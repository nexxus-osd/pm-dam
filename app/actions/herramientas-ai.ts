'use server'

import { revalidatePath } from 'next/cache';
import { HerramientaAIService } from '@/lib/services/herramienta-ai.service';
import { CreateHerramientaAISchema, UpdateHerramientaAISchema } from '@/lib/validations/herramienta-ai';
import prisma from '@/lib/prisma';

export async function createHerramientaAIAction(data: any): Promise<{ success: boolean; error?: string }> {
    try {
        // Asegurar usuario si no se proporciona
        if (!data.agregado_por_id) {
            const admin = await prisma.usuario.findFirst();
            if (admin) {
                data.agregado_por_id = admin.id;
            } else {
                return { success: false, error: "No hay usuarios en el sistema para asignar como creador." };
            }
        }

        // Valores por defecto
        if (!data.moneda) {
            data.moneda = 'USD';
        }

        if (!data.favorita) {
            data.favorita = false;
        }

        if (!data.activa) {
            data.activa = true;
        }

        if (!data.tiene_api) {
            data.tiene_api = false;
        }

        // Validar
        const validated = CreateHerramientaAISchema.safeParse(data);
        if (!validated.success) {
            console.error("Validation error:", validated.error);
            return { success: false, error: "Datos inválidos: " + JSON.stringify(validated.error.format()) };
        }

        await HerramientaAIService.create(validated.data);
        revalidatePath('/herramientas');
        return { success: true };
    } catch (error) {
        console.error("Error creating AI tool:", error);
        return { success: false, error: 'Error interno al crear la herramienta AI' };
    }
}

export async function updateHerramientaAIAction(id: string, data: any): Promise<{ success: boolean; error?: string }> {
    try {
        // Validar
        const validated = UpdateHerramientaAISchema.safeParse({ id, ...data });
        if (!validated.success) {
            console.error("Validation error:", validated.error);
            return { success: false, error: "Datos inválidos: " + JSON.stringify(validated.error.format()) };
        }

        await HerramientaAIService.update(id, validated.data);
        revalidatePath('/herramientas');
        revalidatePath(`/herramientas/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating AI tool:", error);
        return { success: false, error: 'Error al actualizar la herramienta AI' };
    }
}

export async function deleteHerramientaAIAction(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await HerramientaAIService.delete(id);
        revalidatePath('/herramientas');
        return { success: true };
    } catch (error) {
        console.error("Error deleting AI tool:", error);
        return { success: false, error: 'Error al eliminar la herramienta AI' };
    }
}

export async function toggleFavoritaHerramientaAIAction(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await HerramientaAIService.toggleFavorita(id);
        revalidatePath('/herramientas');
        return { success: true };
    } catch (error) {
        console.error("Error toggling favorite AI tool:", error);
        return { success: false, error: 'Error al cambiar el estado favorito de la herramienta AI' };
    }
}
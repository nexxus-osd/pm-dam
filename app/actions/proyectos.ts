'use server';

import { revalidatePath } from 'next/cache';
import { ProyectoService } from '@/lib/services/proyecto.service';
import { CreateProyectoSchema, UpdateProyectoSchema, type CreateProyectoInput } from '@/lib/validations/proyecto';
import prisma from '@/lib/prisma';

export async function getProyectoByIdAction(id: string) {
  try {
    const proyecto = await ProyectoService.getById(id);
    return { success: true, data: proyecto };
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al obtener el proyecto' 
    };
  }
}

export async function createProyectoAction(data: any): Promise<{ success: boolean; error?: string }> {
    try {
        // Asegurar responsable
        if (!data.responsable_id) {
            const admin = await prisma.usuario.findFirst();
            if (admin) {
                data.responsable_id = admin.id;
            } else {
                return { success: false, error: "No hay usuarios en el sistema para asignar como responsable." };
            }
        }

        // Parsear fechas de string a Date si vienen JSONificadas
        if (typeof data.fecha_inicio === 'string') data.fecha_inicio = new Date(data.fecha_inicio);
        if (typeof data.fecha_deadline === 'string') data.fecha_deadline = new Date(data.fecha_deadline);

        // Validar
        const validated = CreateProyectoSchema.safeParse(data);
        if (!validated.success) {
            console.error("Validation error:", validated.error);
            return { success: false, error: "Datos inválidos: " + JSON.stringify(validated.error.format()) };
        }

        await ProyectoService.create(validated.data);
        revalidatePath('/proyectos');
        return { success: true };
    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, error: 'Error interno al crear el proyecto' };
    }
}

export async function updateProyectoAction(data: any): Promise<{ success: boolean; error?: string }> {
    try {
        // Parsear fechas de string a Date si vienen JSONificadas
        if (typeof data.fecha_inicio === 'string') data.fecha_inicio = new Date(data.fecha_inicio);
        if (typeof data.fecha_deadline === 'string') data.fecha_deadline = new Date(data.fecha_deadline);

        // Validar
        const validated = UpdateProyectoSchema.safeParse(data);
        if (!validated.success) {
            console.error("Validation error:", validated.error);
            return { success: false, error: "Datos inválidos: " + JSON.stringify(validated.error.format()) };
        }

        await ProyectoService.update(validated.data.id, validated.data);
        revalidatePath('/proyectos');
        revalidatePath(`/proyectos/${validated.data.id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating project:", error);
        return { success: false, error: 'Error interno al actualizar el proyecto' };
    }
}

export async function deleteProyectoAction(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await ProyectoService.delete(id);
        revalidatePath('/proyectos');
        return { success: true };
    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, error: 'Error al eliminar el proyecto' };
    }
}
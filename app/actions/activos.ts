'use server'

import { revalidatePath } from 'next/cache';
import { ActivoDigitalService } from '@/lib/services/activo-digital.service';
import { CreateActivoDigitalSchema } from '@/lib/validations/activo-digital';
import prisma from '@/lib/prisma';
import { generateId } from '@/lib/utils'; // Importar la función segura de generación de IDs

export async function createActivoDigitalAction(data: any): Promise<{ success: boolean; error?: string }> {
    try {
        // Asegurar creador si no se proporciona
        if (!data.creado_por_id) {
            const admin = await prisma.usuario.findFirst();
            if (admin) {
                data.creado_por_id = admin.id;
            } else {
                return { success: false, error: "No hay usuarios en el sistema para asignar como creador." };
            }
        }

        // Valores por defecto para ebooks
        if (data.tipo_activo === 'DOCUMENTO' && !data.formato) {
            data.formato = 'EPUB';
        }
        
        if (data.tipo_activo === 'DOCUMENTO' && !data.tamaño) {
            data.tamaño = 0; // Tamaño por defecto, se actualizará cuando se suba el archivo
        }

        if (data.tipo_activo === 'DOCUMENTO' && !data.url_archivo) {
            // Generar una URL única basada en el nombre y un ID seguro
            const fileId = generateId(); // Usar una función segura para generar IDs
            const fileName = data.nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
            data.url_archivo = `/assets/${data.categoria.toLowerCase()}/${fileName}-${fileId}.${data.formato.toLowerCase()}`;
        }

        // Asegurar valores por defecto para otros campos requeridos
        if (!data.descripcion) {
            data.descripcion = '';
        }

        if (!data.derechos_uso) {
            data.derechos_uso = 'USO_INTERNO';
        }

        if (!data.licencia) {
            data.licencia = 'COPYRIGHT';
        }

        if (!data.estado) {
            data.estado = 'DRAFT';
        }

        if (!data.etiquetas || !Array.isArray(data.etiquetas)) {
            data.etiquetas = [];
        }

        // Validar
        const validated = CreateActivoDigitalSchema.safeParse(data);
        if (!validated.success) {
            console.error("Validation error:", validated.error);
            return { success: false, error: "Datos inválidos: " + JSON.stringify(validated.error.format()) };
        }

        await ActivoDigitalService.create(validated.data);
        revalidatePath('/activos');
        return { success: true };
    } catch (error) {
        console.error("Error creating asset:", error);
        return { success: false, error: 'Error interno al crear el activo digital' };
    }
}

export async function deleteActivoDigitalAction(id: string): Promise<{ success: boolean; error?: string }> {
    try {
        await ActivoDigitalService.delete(id);
        revalidatePath('/activos');
        return { success: true };
    } catch (error) {
        console.error("Error deleting asset:", error);
        return { success: false, error: 'Error al eliminar el activo digital' };
    }
}
'use server';

import { TareaService } from '@/lib/services/tarea.service';
import { revalidatePath } from 'next/cache';
import { CreateTareaSchema, UpdateTareaSchema } from '@/lib/validations/tarea';

export async function createTareaAction(data: any) {
  try {
    // Validar datos
    const validated = CreateTareaSchema.safeParse(data);
    if (!validated.success) {
      console.error("Error de validación en tarea:", validated.error);
      return { 
        success: false, 
        error: 'Datos inválidos: ' + JSON.stringify(validated.error.format()) 
      };
    }

    const tarea = await TareaService.create(validated.data);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true, data: tarea };
  } catch (error) {
    console.error('Error al crear tarea:', error);
    // Proporcionar información más detallada del error
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error desconocido al crear la tarea';
      
    return { 
      success: false, 
      error: errorMessage
    };
  }
}

export async function updateTareaAction(data: any) {
  try {
    // Validar datos
    const validated = UpdateTareaSchema.safeParse(data);
    if (!validated.success) {
      return { 
        success: false, 
        error: 'Datos inválidos: ' + JSON.stringify(validated.error.format()) 
      };
    }

    const tarea = await TareaService.update(validated.data.id, validated.data);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true, data: tarea };
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al actualizar la tarea' 
    };
  }
}

export async function deleteTareaAction(id: string) {
  try {
    await TareaService.delete(id);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al eliminar la tarea' 
    };
  }
}
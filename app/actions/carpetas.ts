'use server';

import { CarpetaService } from '@/lib/services/carpeta.service';
import { revalidatePath } from 'next/cache';
import { CreateCarpetaSchema, UpdateCarpetaSchema, CreateDocumentoSchema, UpdateDocumentoSchema } from '@/lib/validations/carpeta';

// ====================================
// ACCIONES PARA CARPETAS
// ====================================

export async function createCarpetaAction(data: any) {
  try {
    // Validar datos
    const validated = CreateCarpetaSchema.safeParse(data);
    if (!validated.success) {
      return { 
        success: false, 
        error: 'Datos inválidos: ' + JSON.stringify(validated.error.format()) 
      };
    }

    const carpeta = await CarpetaService.createCarpeta(validated.data);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true, data: carpeta };
  } catch (error) {
    console.error('Error al crear carpeta:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al crear la carpeta' 
    };
  }
}

export async function updateCarpetaAction(data: any) {
  try {
    // Validar datos
    const validated = UpdateCarpetaSchema.safeParse(data);
    if (!validated.success) {
      return { 
        success: false, 
        error: 'Datos inválidos: ' + JSON.stringify(validated.error.format()) 
      };
    }

    const carpeta = await CarpetaService.updateCarpeta(validated.data.id, validated.data);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true, data: carpeta };
  } catch (error) {
    console.error('Error al actualizar carpeta:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al actualizar la carpeta' 
    };
  }
}

export async function deleteCarpetaAction(id: string) {
  try {
    await CarpetaService.deleteCarpeta(id);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar carpeta:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al eliminar la carpeta' 
    };
  }
}

// ====================================
// ACCIONES PARA DOCUMENTOS
// ====================================

export async function createDocumentoAction(data: any) {
  try {
    // Si data es FormData, convertirlo a objeto
    let processData = data;
    if (data instanceof FormData) {
      processData = Object.fromEntries(data.entries());
      
      // Manejar el archivo si existe
      const archivo = data.get('archivo');
      if (archivo && archivo instanceof File) {
        processData.archivo = archivo;
      }
    }
    
    // Asegurarse de que processData es un objeto válido
    if (!processData || typeof processData !== 'object') {
      return { 
        success: false, 
        error: 'Datos inválidos: no se recibió un objeto válido'
      };
    }
    
    // Validar datos
    const validated = CreateDocumentoSchema.safeParse(processData);
    if (!validated.success) {
      console.error("Validation error:", validated.error);
      return { 
        success: false, 
        error: 'Datos inválidos: ' + validated.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      };
    }

    const documento = await CarpetaService.createDocumento(validated.data);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true, data: documento };
  } catch (error: any) {
    console.error('Error al crear documento:', error);
    
    // Manejo específico de errores de base de datos
    if (error.code === 'P2002') {
      return { 
        success: false, 
        error: 'Ya existe un documento con ese nombre en esta ubicación'
      };
    }
    
    if (error.code === 'P2025') {
      return { 
        success: false, 
        error: 'No se encontró el proyecto o carpeta especificada'
      };
    }
    
    return { 
      success: false, 
      error: error.message || 'Error desconocido al crear el documento' 
    };
  }
}

export async function updateDocumentoAction(data: any) {
  try {
    // Validar datos
    const validated = UpdateDocumentoSchema.safeParse(data);
    if (!validated.success) {
      return { 
        success: false, 
        error: 'Datos inválidos: ' + JSON.stringify(validated.error.format()) 
      };
    }

    const documento = await CarpetaService.updateDocumento(validated.data.id, validated.data);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true, data: documento };
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al actualizar el documento' 
    };
  }
}

export async function deleteDocumentoAction(id: string) {
  try {
    await CarpetaService.deleteDocumento(id);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al eliminar el documento' 
    };
  }
}
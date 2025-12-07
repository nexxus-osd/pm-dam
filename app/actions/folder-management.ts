'use server';

import { FolderManagementService } from '@/lib/services/folder-management.service';
import { revalidatePath } from 'next/cache';

// ====================================
// ACCIONES PARA GESTIÓN AVANZADA DE CARPETAS
// ====================================

export async function moveCarpetaAction(carpetaId: string, newParentId: string | null, proyectoId: string) {
  try {
    const result = await FolderManagementService.moveCarpeta(carpetaId, newParentId, proyectoId);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error al mover carpeta:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al mover la carpeta' 
    };
  }
}

export async function moveDocumentoAction(documentoId: string, newCarpetaId: string | null, proyectoId: string) {
  try {
    const result = await FolderManagementService.moveDocumento(documentoId, newCarpetaId, proyectoId);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error al mover documento:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al mover el documento' 
    };
  }
}

export async function searchFoldersAndDocumentsAction(proyectoId: string, searchTerm: string) {
  try {
    const result = await FolderManagementService.searchFoldersAndDocuments(proyectoId, searchTerm);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error al buscar carpetas y documentos:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido en la búsqueda' 
    };
  }
}

export async function getFolderStatsAction(carpetaId: string) {
  try {
    const result = await FolderManagementService.getFolderStats(carpetaId);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error al obtener estadísticas de carpeta:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al obtener estadísticas' 
    };
  }
}

export async function duplicateCarpetaAction(carpetaId: string, newName: string) {
  try {
    const result = await FolderManagementService.duplicateCarpeta(carpetaId, newName);
    revalidatePath('/proyectos/[id]');
    revalidatePath('/proyectos');
    return { success: true, data: result };
  } catch (error) {
    console.error('Error al duplicar carpeta:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al duplicar la carpeta' 
    };
  }
}
// ============================================================
// SERVICIO DE GESTIÓN AVANZADA DE CARPETAS
// Funcionalidades adicionales para gestión de carpetas, documentos y archivos
// ============================================================

import { CarpetaService } from './carpeta.service';

export class FolderManagementService {
    /**
     * Mover una carpeta a otra ubicación
     */
    static async moveCarpeta(carpetaId: string, newParentId: string | null, proyectoId: string) {
        try {
            // Verificar que la carpeta exista
            const carpeta = await CarpetaService.getCarpetaById(carpetaId);
            
            // Verificar que la nueva carpeta padre sea válida (si se especifica)
            if (newParentId) {
                const newParent = await CarpetaService.getCarpetaById(newParentId);
                if (newParent.proyecto_id !== proyectoId) {
                    throw new Error('La carpeta destino debe pertenecer al mismo proyecto');
                }
                
                // Prevenir mover una carpeta a sí misma
                if (carpetaId === newParentId) {
                    throw new Error('No se puede mover una carpeta a sí misma');
                }
                
                // Prevenir ciclos (mover una carpeta a una de sus subcarpetas)
                let current = newParent;
                while (current.carpeta_padre_id) {
                    if (current.carpeta_padre_id === carpetaId) {
                        throw new Error('No se puede mover una carpeta a una de sus subcarpetas');
                    }
                    current = await CarpetaService.getCarpetaById(current.carpeta_padre_id);
                }
            }
            
            // Actualizar la carpeta
            const updatedCarpeta = await CarpetaService.updateCarpeta(carpetaId, {
                id: carpetaId,
                carpeta_padre_id: newParentId || undefined
            });            
            return updatedCarpeta;
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Mover un documento a otra carpeta
     */
    static async moveDocumento(documentoId: string, newCarpetaId: string | null, proyectoId: string) {
        try {
            // Verificar que el documento exista
            const documento = await CarpetaService.getDocumentoById(documentoId);
            
            // Verificar que la nueva carpeta sea válida (si se especifica)
            if (newCarpetaId) {
                const carpeta = await CarpetaService.getCarpetaById(newCarpetaId);
                if (carpeta.proyecto_id !== proyectoId) {
                    throw new Error('La carpeta destino debe pertenecer al mismo proyecto');
                }
            }
            
            // Actualizar el documento
            const updatedDocumento = await CarpetaService.updateDocumento(documentoId, {
                id: documentoId,
                carpeta_id: newCarpetaId || undefined
            });
            
            return updatedDocumento;
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Buscar carpetas y documentos por nombre
     */
    static async searchFoldersAndDocuments(proyectoId: string, searchTerm: string) {
        try {
            // Obtener todas las carpetas del proyecto
            const carpetas = await CarpetaService.getCarpetasByProject(proyectoId);
            
            // Obtener todos los documentos del proyecto
            const documentos = await CarpetaService.getDocumentosByFolderOrProject(proyectoId);
            
            // Filtrar carpetas por término de búsqueda
            const filteredCarpetas = carpetas.filter((carpeta: any) => 
                carpeta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (carpeta.descripcion && carpeta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            
            // Filtrar documentos por término de búsqueda
            const filteredDocumentos = documentos.filter((documento: any) => 
                documento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (documento.descripcion && documento.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            
            return {
                carpetas: filteredCarpetas,
                documentos: filteredDocumentos
            };
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Obtener estadísticas de una carpeta (recuento de subcarpetas y documentos)
     */
    static async getFolderStats(carpetaId: string) {
        try {
            const carpeta = await CarpetaService.getCarpetaById(carpetaId);
            
            // Contar subcarpetas directas
            const subcarpetasCount = carpeta.subcarpetas ? carpeta.subcarpetas.length : 0;
            
            // Contar documentos directos
            const documentosCount = carpeta.documentos ? carpeta.documentos.length : 0;
            
            return {
                subcarpetasCount,
                documentosCount
            };
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Duplicar una carpeta y su contenido
     */
    static async duplicateCarpeta(carpetaId: string, newName: string) {
        try {
            // Obtener la carpeta original
            const originalCarpeta = await CarpetaService.getCarpetaById(carpetaId);
            
            // Crear una nueva carpeta con los mismos datos pero nombre diferente
            const newCarpeta = await CarpetaService.createCarpeta({
                nombre: newName,
                descripcion: originalCarpeta.descripcion,
                proyecto_id: originalCarpeta.proyecto_id,
                carpeta_padre_id: originalCarpeta.carpeta_padre_id,
                creada_por_id: originalCarpeta.creada_por.id
            });
            
            // Duplicar documentos de la carpeta original
            if (originalCarpeta.documentos && originalCarpeta.documentos.length > 0) {
                for (const doc of originalCarpeta.documentos) {
                    await CarpetaService.createDocumento({
                        nombre: `${doc.nombre} (copia)`,
                        descripcion: doc.descripcion,
                        tipo_documento: doc.tipo_documento,
                        contenido: doc.contenido,
                        proyecto_id: doc.proyecto.id,
                        carpeta_id: newCarpeta.id,
                        creada_por_id: doc.creada_por.id
                    });
                }
            }
            
            return newCarpeta;
        } catch (error) {
            throw error;
        }
    }
}
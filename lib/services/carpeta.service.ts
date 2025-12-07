// ============================================================
// SERVICIO DE CARPETAS
// Gestión de carpetas y documentos para proyectos
// ============================================================

import prisma from '@/lib/prisma';
import { ProyectoService } from './proyecto.service';
import type { CreateCarpetaInput, UpdateCarpetaInput, CreateDocumentoInput, UpdateDocumentoInput } from '@/lib/validations/carpeta';

// Cast prisma to any to bypass TypeScript errors temporarily
const typedPrisma: any = prisma;

export class CarpetaService {
    /**
     * Crear nueva carpeta
     */
    static async createCarpeta(data: CreateCarpetaInput) {
        const carpeta = await typedPrisma.carpeta.create({
            data,
            include: {
                subcarpetas: true,
                documentos: true,
            }
        });

        return carpeta;
    }

    /**
     * Obtener carpeta por ID
     */
    static async getCarpetaById(id: string) {
        const carpeta = await typedPrisma.carpeta.findUnique({
            where: { id },
            include: {
                carpeta_padre: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
                subcarpetas: {
                    select: {
                        id: true,
                        nombre: true,
                        descripcion: true,
                        fecha_creacion: true,
                    }
                },
                documentos: {
                    select: {
                        id: true,
                        nombre: true,
                        tipo_documento: true,
                        fecha_creacion: true,
                    }
                },
                proyecto: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
                creada_por: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        avatar_url: true,
                    }
                },
            }
        });

        if (!carpeta) {
            throw new Error('Carpeta no encontrada');
        }

        return carpeta;
    }

    /**
     * Listar carpetas de un proyecto
     */
    static async getCarpetasByProject(proyectoId: string, carpetaPadreId?: string | null) {
        const where: any = { 
            proyecto_id: proyectoId,
        };

        // Si no se especifica carpeta padre, obtener solo carpetas raíz
        if (carpetaPadreId === undefined) {
            where.carpeta_padre_id = null;
        } else if (carpetaPadreId !== null) {
            where.carpeta_padre_id = carpetaPadreId;
        }

        const carpetas = await typedPrisma.carpeta.findMany({
            where,
            include: {
                subcarpetas: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
                documentos: {
                    select: {
                        id: true,
                        nombre: true,
                        tipo_documento: true,
                    }
                },
                creada_por: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
            },
            orderBy: { fecha_creacion: 'asc' },
        });

        return carpetas;
    }

    /**
     * Actualizar carpeta
     */
    static async updateCarpeta(id: string, data: UpdateCarpetaInput) {
        const carpeta = await typedPrisma.carpeta.update({
            where: { id },
            data,
            include: {
                subcarpetas: true,
                documentos: true,
            }
        });

        return carpeta;
    }

    /**
     * Eliminar carpeta
     */
    static async deleteCarpeta(id: string) {
        // Primero eliminar documentos en la carpeta
        await typedPrisma.documento.deleteMany({
            where: { carpeta_id: id }
        });

        // Luego eliminar subcarpetas recursivamente
        const subcarpetas = await typedPrisma.carpeta.findMany({
            where: { carpeta_padre_id: id }
        });

        for (const subcarpeta of subcarpetas) {
            await this.deleteCarpeta(subcarpeta.id);
        }

        // Finalmente eliminar la carpeta
        await typedPrisma.carpeta.delete({
            where: { id }
        });
    }

    /**
     * Crear nuevo documento
     */
    static async createDocumento(data: CreateDocumentoInput & { archivo?: File, tipo_contenido?: string }) {
        // Inicializar campos de archivo
        let nombre_archivo: string | undefined;
        let tipo_archivo: string | undefined;
        let tamano_archivo: number | undefined;
        
        // Si es un archivo, procesarlo
        if (data.tipo_contenido === 'archivo' && data.archivo) {
            // En un entorno real, aquí se guardaría el archivo en un almacenamiento
            // Por ahora, solo simulamos obteniendo la información del archivo
            nombre_archivo = data.archivo.name;
            tipo_archivo = data.archivo.type || 'application/octet-stream';
            tamano_archivo = data.archivo.size;
        }
        
        // Eliminar campos que no pertenecen al modelo de base de datos
        const { archivo, tipo_contenido, ...dataForDB } = data as any;
        
        const documento = await typedPrisma.documento.create({
            data: {
                ...dataForDB,
                nombre_archivo,
                tipo_archivo,
                tamano_archivo,
            },
            include: {
                carpeta: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
                proyecto: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
                creada_por: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
            }
        });

        return documento;
    }

    /**
     * Obtener documento por ID
     */
    static async getDocumentoById(id: string) {
        const documento = await typedPrisma.documento.findUnique({
            where: { id },
            include: {
                carpeta: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
                proyecto: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
                creada_por: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        avatar_url: true,
                    }
                },
            }
        });

        if (!documento) {
            throw new Error('Documento no encontrado');
        }

        return documento;
    }

    /**
     * Listar documentos de una carpeta o proyecto
     */
    static async getDocumentosByFolderOrProject(proyectoId: string, carpetaId?: string) {
        const where: any = { 
            proyecto_id: proyectoId,
        };

        if (carpetaId) {
            where.carpeta_id = carpetaId;
        } else {
            // Si no hay carpeta específica, obtener documentos sin carpeta (raíz)
            where.carpeta_id = null;
        }

        const documentos = await typedPrisma.documento.findMany({
            where,
            include: {
                carpeta: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
                creada_por: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
            },
            orderBy: { fecha_creacion: 'asc' },
        });

        return documentos;
    }

    /**
     * Actualizar documento
     */
    static async updateDocumento(id: string, data: UpdateDocumentoInput) {
        const documento = await typedPrisma.documento.update({
            where: { id },
            data,
            include: {
                carpeta: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
                proyecto: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
                creada_por: {
                    select: {
                        id: true,
                        nombre: true,
                    }
                },
            }
        });

        return documento;
    }

    /**
     * Eliminar documento
     */
    static async deleteDocumento(id: string) {
        await typedPrisma.documento.delete({
            where: { id }
        });
    }
}
// ============================================================
// SERVICIO DE TAREAS
// Lógica de negocio para tareas
// ============================================================

import prisma from '@/lib/prisma';
import { ProyectoService } from './proyecto.service';
import { formulas } from '@/utils/formulas';
import type { Tarea } from '@prisma/client';
import type { CreateTareaInput, UpdateTareaInput } from '@/lib/validations/tarea';
import { parseJsonArray } from '@/lib/enums_polyfill';

// Helper de transformación
const transformTarea = (t: any): any => {
    if (!t) return null;
    return {
        ...t,
        etiquetas: parseJsonArray(t.etiquetas),
        checklist: parseJsonArray(t.checklist),
        archivos_adjuntos: parseJsonArray(t.archivos_adjuntos),
    };
};

export class TareaService {
    /**
     * Crear nueva tarea
     */
    static async create(data: CreateTareaInput): Promise<Tarea> {
        const createData: any = {
            ...data,
            etiquetas: JSON.stringify(data.etiquetas || []),
            checklist: JSON.stringify(data.checklist || []),
            archivos_adjuntos: JSON.stringify(data.archivos_adjuntos || []),
            // Inicializar campos calculados
            total_subtareas: 0,
            subtareas_completadas: 0,
            progreso_subtareas: 0,
            costo_ai: 0,
        };

        const tarea = await prisma.tarea.create({
            data: createData,
        });

        // Actualizar rollups del proyecto
        await ProyectoService.actualizarRollups(data.proyecto_id);

        // Si tiene tarea padre, actualizar sus rollups
        if (data.tarea_padre_id) {
            await this.actualizarRollups(data.tarea_padre_id);
        }

        return transformTarea(tarea);
    }

    /**
     * Obtener tarea por ID
     */
    static async getById(id: string) {
        const tarea = await prisma.tarea.findUnique({
            where: { id },
            include: {
                proyecto: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                tarea_padre: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                subtareas: true,
                asignado_a: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        avatar_url: true,
                    },
                },
                observadores: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nombre: true,
                                email: true,
                                avatar_url: true,
                            },
                        },
                    },
                },
                herramientas_ai: {
                    include: {
                        herramienta: {
                            select: {
                                id: true,
                                nombre: true,
                                logo_url: true,
                                costo_mensual: true,
                            },
                        },
                    },
                },
                activos_generados: true,
                comentarios: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nombre: true,
                                avatar_url: true,
                            },
                        },
                    },
                    orderBy: { fecha: 'desc' },
                },
                dependencias_origen: {
                    include: {
                        tarea_destino: {
                            select: {
                                id: true,
                                nombre: true,
                                estado: true,
                            },
                        },
                    },
                },
            },
        });

        if (!tarea) {
            throw new Error('Tarea no encontrada');
        }

        return transformTarea(tarea);
    }

    /**
     * Listar tareas de un proyecto
     */
    static async listByProject(proyectoId: string, filtros?: any) {
        const where: any = { proyecto_id: proyectoId };

        if (filtros?.estado) {
            where.estado = { in: filtros.estado };
        }

        if (filtros?.asignado_a_id) {
            where.asignado_a_id = filtros.asignado_a_id;
        }

        if (filtros?.solo_tareas_principales) {
            where.tarea_padre_id = null;
        }

        const tareas = await prisma.tarea.findMany({
            where,
            include: {
                asignado_a: {
                    select: {
                        id: true,
                        nombre: true,
                        avatar_url: true,
                    },
                },
                subtareas: {
                    select: {
                        id: true,
                        estado: true,
                    },
                },
            },
            orderBy: { fecha_creacion: 'desc' },
        });

        return tareas.map(transformTarea);
    }

    /**
     * Actualizar tarea
     */
    static async update(id: string, data: Partial<UpdateTareaInput>): Promise<Tarea> {
        const tareaAnterior = await prisma.tarea.findUnique({ where: { id } });

        if (!tareaAnterior) {
            throw new Error('Tarea no encontrada');
        }

        // Si se está completando la tarea, agregar fecha
        if (data.estado === 'COMPLETADO' && tareaAnterior.estado !== 'COMPLETADO') {
            data.fecha_completado = new Date();
        }

        // Calcular eficiencia si tiene tiempo_real y tiempo_estimado
        if (data.tiempo_real && tareaAnterior.tiempo_estimado) {
            (data as any).eficiencia = formulas.calcularEficienciaTiempo(
                tareaAnterior.tiempo_estimado,
                data.tiempo_real
            );
        }

        const updateData: any = { ...data };
        if (data.etiquetas) updateData.etiquetas = JSON.stringify(data.etiquetas);
        if (data.checklist) updateData.checklist = JSON.stringify(data.checklist);
        if (data.archivos_adjuntos) updateData.archivos_adjuntos = JSON.stringify(data.archivos_adjuntos);

        const tarea = await prisma.tarea.update({
            where: { id },
            data: updateData,
        });

        // Actualizar rollups del proyecto
        await ProyectoService.actualizarRollups(tarea.proyecto_id);

        // Si tiene tarea padre, actualizar sus rollups
        if (tarea.tarea_padre_id) {
            await this.actualizarRollups(tarea.tarea_padre_id);
        }

        return transformTarea(tarea);
    }

    /**
     * Eliminar tarea
     */
    static async delete(id: string): Promise<void> {
        const tarea = await prisma.tarea.findUnique({ where: { id } });

        if (!tarea) {
            throw new Error('Tarea no encontrada');
        }

        await prisma.tarea.delete({ where: { id } });

        // Actualizar rollups del proyecto
        await ProyectoService.actualizarRollups(tarea.proyecto_id);

        // Si tiene tarea padre, actualizar sus rollups
        if (tarea.tarea_padre_id) {
            await this.actualizarRollups(tarea.tarea_padre_id);
        }
    }

    /**
     * Actualizar rollups de una tarea (para subtareas)
     */
    static async actualizarRollups(tareaId: string) {
        const [tareaRaw, subtareasRaw, herramientasAI] = await Promise.all([
            prisma.tarea.findUnique({ where: { id: tareaId } }),
            prisma.tarea.findMany({ where: { tarea_padre_id: tareaId } }),
            prisma.herramientaAI.findMany(),
        ]);

        if (!tareaRaw) {
            throw new Error('Tarea no encontrada');
        }

        const tarea = transformTarea(tareaRaw);
        const subtareas = subtareasRaw.map(transformTarea);

        const tareaActualizada = formulas.actualizarTareaConRollups(
            tarea as any,
            subtareas as any,
            herramientasAI as any
        );

        await prisma.tarea.update({
            where: { id: tareaId },
            data: {
                total_subtareas: tareaActualizada.total_subtareas,
                subtareas_completadas: tareaActualizada.subtareas_completadas,
                progreso_subtareas: tareaActualizada.progreso_subtareas,
                costo_ai: tareaActualizada.costo_ai,
                eficiencia: tareaActualizada.eficiencia,
            },
        });
    }

    /**
     * Vincular herramienta AI a tarea
     */
    static async vincularHerramientaAI(tareaId: string, herramientaId: string) {
        await prisma.tareaHerramientaAI.create({
            data: {
                tarea_id: tareaId,
                herramienta_id: herramientaId,
            },
        });

        // Actualizar rollups de la tarea
        await this.actualizarRollups(tareaId);

        // Actualizar veces_usada de la herramienta
        await prisma.herramientaAI.update({
            where: { id: herramientaId },
            data: {
                veces_usada: {
                    increment: 1,
                },
            },
        });

        // Actualizar proyecto
        const tarea = await prisma.tarea.findUnique({
            where: { id: tareaId },
            select: { proyecto_id: true },
        });

        if (tarea) {
            await ProyectoService.actualizarRollups(tarea.proyecto_id);
        }
    }

    /**
     * Desvincular herramienta AI
     */
    static async desvincularHerramientaAI(tareaId: string, herramientaId: string) {
        await prisma.tareaHerramientaAI.deleteMany({
            where: {
                tarea_id: tareaId,
                herramienta_id: herramientaId,
            },
        });

        // Actualizar rollups
        await this.actualizarRollups(tareaId);

        // Decrementar veces_usada
        await prisma.herramientaAI.update({
            where: { id: herramientaId },
            data: {
                veces_usada: {
                    decrement: 1,
                },
            },
        });
    }

    /**
     * Agregar comentario
     */
    static async agregarComentario(tareaId: string, usuarioId: string, texto: string) {
        const comentario = await prisma.comentario.create({
            data: {
                tarea_id: tareaId,
                usuario_id: usuarioId,
                texto,
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre: true,
                        avatar_url: true,
                    },
                },
            },
        });

        return comentario;
    }
}

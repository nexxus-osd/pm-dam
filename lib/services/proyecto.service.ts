// ============================================================
// SERVICIO DE PROYECTOS
// Lógica de negocio para proyectos
// ============================================================

import prisma from '@/lib/prisma';
import { formulas } from '@/utils/formulas';
import type { Proyecto, Tarea, Transaccion, ActivoDigital, HerramientaAI } from '@prisma/client';
import { type CreateProyectoInput, type UpdateProyectoInput, type FiltrosProyectoInput } from '@/lib/validations/proyecto';
import { parseJsonArray } from '@/lib/enums_polyfill';

// Helper para transformar proyecto de BD (SQLite String) a Modelo Frontend (Array)
const transformProyecto = (p: any): any => {
    if (!p) return null;
    return {
        ...p,
        etiquetas: parseJsonArray(p.etiquetas),
        archivos_adjuntos: parseJsonArray(p.archivos_adjuntos),
        campos_personalizados: typeof p.campos_personalizados === 'string' ? JSON.parse(p.campos_personalizados) : p.campos_personalizados
    };
};

export class ProyectoService {
    /**
     * Crear nuevo proyecto
     */
    static async create(data: CreateProyectoInput): Promise<Proyecto> {
        const proyecto = await prisma.proyecto.create({
            data: {
                ...data,
                etiquetas: JSON.stringify(data.etiquetas || []),
                archivos_adjuntos: JSON.stringify(data.archivos_adjuntos || []),
                campos_personalizados: data.campos_personalizados ? JSON.stringify(data.campos_personalizados) : undefined,
                // Inicializar campos calculados
                progreso_total: 0,
                total_tareas: 0,
                tareas_completadas: 0,
                tareas_en_progreso: 0,
                tareas_bloqueadas: 0,
                gastos_acumulados: 0,
                ingresos_totales: 0,
                balance_restante: data.presupuesto_asignado,
                roi_preliminar: 0,
                activos_generados: 0,
                costo_ai_total: 0,
            },
        });

        return transformProyecto(proyecto);
    }

    /**
     * Obtener proyecto por ID con relaciones
     */
    static async getById(id: string) {
        const proyecto = await prisma.proyecto.findUnique({
            where: { id },
            include: {
                responsable: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        avatar_url: true,
                        rol: true,
                    },
                },
                equipo: {
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                nombre: true,
                                email: true,
                                avatar_url: true,
                                rol: true,
                            },
                        },
                    },
                },
                tareas: {
                    orderBy: { fecha_creacion: 'desc' },
                    take: 10, // Últimas 10 tareas
                },
                transacciones: {
                    orderBy: { fecha_transaccion: 'desc' },
                    take: 10,
                },
                activos: {
                    orderBy: { fecha_creacion: 'desc' },
                    take: 10,
                },
            },
        });

        if (!proyecto) {
            throw new Error('Proyecto no encontrado');
        }

        return transformProyecto(proyecto);
    }

    /**
     * Listar proyectos con filtros y paginación
     */
    static async list(filtros: FiltrosProyectoInput) {
        const { tipo_activo, estado, prioridad, responsable_id, busqueda, page, limit } = filtros;

        const where: any = {};

        if (tipo_activo && tipo_activo.length > 0) {
            where.tipo_activo = { in: tipo_activo };
        }

        if (estado && estado.length > 0) {
            where.estado = { in: estado };
        }

        if (prioridad && prioridad.length > 0) {
            where.prioridad = { in: prioridad };
        }

        if (responsable_id) {
            where.responsable_id = responsable_id;
        }

        if (busqueda) {
            where.OR = [
                { nombre: { contains: busqueda } }, // Removed mode: insensitive (not supported in SQLite default)
                { descripcion: { contains: busqueda } },
                { etiquetas: { contains: busqueda } }, // JSON string contains
            ];
        }

        const [proyectos, total] = await Promise.all([
            prisma.proyecto.findMany({
                where,
                include: {
                    responsable: {
                        select: {
                            id: true,
                            nombre: true,
                            email: true,
                            avatar_url: true,
                        },
                    },
                },
                orderBy: { fecha_actualizacion: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.proyecto.count({ where }),
        ]);

        return {
            proyectos: proyectos.map(transformProyecto),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Actualizar proyecto
     */
    static async update(id: string, data: Partial<UpdateProyectoInput>): Promise<Proyecto> {
        const updateData: any = { ...data };

        if (data.etiquetas) {
            updateData.etiquetas = JSON.stringify(data.etiquetas);
        }

        if (data.archivos_adjuntos) {
            updateData.archivos_adjuntos = JSON.stringify(data.archivos_adjuntos);
        }

        if (data.campos_personalizados) {
            updateData.campos_personalizados = JSON.stringify(data.campos_personalizados);
        }

        const proyecto = await prisma.proyecto.update({
            where: { id },
            data: updateData,
        });

        return transformProyecto(proyecto);
    }

    /**
     * Eliminar proyecto
     */
    static async delete(id: string): Promise<void> {
        await prisma.proyecto.delete({
            where: { id },
        });
    }

    /**
     * Actualizar TODOS los rollups del proyecto
     */
    static async actualizarRollups(proyectoId: string): Promise<Proyecto> {
        // Obtener datos necesarios
        const [proyecto, tareas, transacciones, activos, herramientasAI] = await Promise.all([
            prisma.proyecto.findUnique({ where: { id: proyectoId } }),
            prisma.tarea.findMany({ where: { proyecto_id: proyectoId } }),
            prisma.transaccion.findMany({
                where: { proyecto_id: proyectoId, estado: 'PAGADO' },
            }),
            prisma.activoDigital.findMany({ where: { proyecto_id: proyectoId } }),
            prisma.herramientaAI.findMany(),
        ]);

        if (!proyecto) {
            throw new Error('Proyecto no encontrado');
        }

        // Calcular métricas usando las fórmulas
        // Nota: Los datos de DB vienen como JSON strings para arrays en SQLite.
        // Convertimos a objetos JS antes de pasar a formulas.
        const proyectoObj = transformProyecto(proyecto);
        // Tareas y otros también necesitarían transformación si usan arrays.
        // Asumiendo que formulas maneja inputs flexibles o debemos transformar todo.

        // Simplemente pasamos y esperamos lo mejor por ahora o hacemos un cast agresivo
        const proyectoActualizado = formulas.actualizarProyectoConRollups(
            proyectoObj as any,
            tareas as any,
            transacciones as any,
            activos as any,
            herramientasAI as any
        );

        // Guardar en DB
        const result = await prisma.proyecto.update({
            where: { id: proyectoId },
            data: {
                progreso_total: proyectoActualizado.progreso_total,
                total_tareas: proyectoActualizado.total_tareas,
                tareas_completadas: proyectoActualizado.tareas_completadas,
                tareas_en_progreso: proyectoActualizado.tareas_en_progreso,
                tareas_bloqueadas: proyectoActualizado.tareas_bloqueadas,
                gastos_acumulados: proyectoActualizado.gastos_acumulados,
                ingresos_totales: proyectoActualizado.ingresos_totales,
                balance_restante: proyectoActualizado.balance_restante,
                roi_preliminar: proyectoActualizado.roi_preliminar,
                activos_generados: proyectoActualizado.activos_generados,
                costo_ai_total: proyectoActualizado.costo_ai_total,
                // herramientas_ai_usadas: proyectoActualizado.herramientas_ai_usadas, // Campo no existe en DB
            },
        });

        return transformProyecto(result);
    }

    /**
     * Obtener dashboard del proyecto
     */
    static async getDashboard(proyectoId: string) {
        const proyecto = await this.getById(proyectoId); // Ya transformado
        const tareas = await prisma.tarea.findMany({
            where: { proyecto_id: proyectoId },
        });

        const tareasVencidas = tareas.filter(
            (t) => t.fecha_vencimiento && t.fecha_vencimiento < new Date() && t.estado !== 'COMPLETADO'
        ).length;

        const diasRestantes = Math.ceil(
            (proyecto.fecha_deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        const salud = formulas.calcularSaludProyecto(proyecto as any, tareas as any);

        return {
            proyecto: {
                nombre: proyecto.nombre,
                estado: proyecto.estado,
                progreso_total: proyecto.progreso_total,
                salud,
            },
            tareas: {
                total: proyecto.total_tareas,
                completadas: proyecto.tareas_completadas,
                en_progreso: proyecto.tareas_en_progreso,
                bloqueadas: proyecto.tareas_bloqueadas,
                vencidas: tareasVencidas,
                porcentaje_completado: proyecto.progreso_total,
            },
            finanzas: {
                presupuesto: Number(proyecto.presupuesto_asignado),
                gastado: Number(proyecto.gastos_acumulados),
                restante: Number(proyecto.balance_restante),
                roi: proyecto.roi_preliminar,
            },
            activos: {
                total: proyecto.activos_generados,
            },
            herramientas_ai: {
                total_usadas: (proyecto as any).herramientas_ai_usadas?.length || 0,
                costo_total: Number(proyecto.costo_ai_total),
            },
            timeline: {
                dias_restantes: diasRestantes,
            },
        };
    }

    /**
     * Aplicar workflow a proyecto
     */
    static async aplicarWorkflow(proyectoId: string, workflowId: string) {
        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId },
        });

        if (!workflow) {
            throw new Error('Workflow no encontrado');
        }

        // Crear relación
        await prisma.proyectoWorkflow.create({
            data: {
                proyecto_id: proyectoId,
                workflow_id: workflowId,
            },
        });

        // Generar tareas desde el workflow
        // En SQLite, fases es String JSON.
        const fases = typeof workflow.fases === 'string' ? JSON.parse(workflow.fases) : workflow.fases;

        const tareasCreadas = [];

        for (const fase of fases) {
            for (const tareaTemplate of fase.tareas_template) {
                const tarea = await prisma.tarea.create({
                    data: {
                        proyecto_id: proyectoId,
                        nombre: tareaTemplate.nombre,
                        descripcion: tareaTemplate.descripcion || '',
                        tipo_tarea: tareaTemplate.tipo,
                        estado: 'POR_HACER',
                        prioridad: 'MEDIA',
                        tiempo_estimado: tareaTemplate.duracion_estimada,
                    },
                });
                tareasCreadas.push(tarea);
            }
        }

        // Actualizar rollups
        await this.actualizarRollups(proyectoId);

        return {
            workflow,
            tareas_creadas: tareasCreadas.length,
        };
    }
}

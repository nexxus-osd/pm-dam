import prisma from '@/lib/prisma';
import { ProyectoService } from './proyecto.service';
import type { Workflow, Tarea } from '@prisma/client';
import type {
    CreateWorkflowInput,
    UpdateWorkflowInput,
    AplicarWorkflowInput,
    FiltrosWorkflowInput,
} from '@/lib/validations/workflow';
import { parseJsonArray } from '@/lib/enums_polyfill';

// Helper
const transformWorkflow = (w: any): any => {
    if (!w) return null;
    return {
        ...w,
        fases: parseJsonArray(w.fases),
        plantilla_tareas: parseJsonArray(w.plantilla_tareas),
    };
};

export class WorkflowService {
    /**
     * Crear nuevo workflow
     */
    static async create(data: CreateWorkflowInput): Promise<Workflow> {
        const createData: any = {
            ...data,
            fases: JSON.stringify(data.fases || []),
            plantilla_tareas: JSON.stringify(data.plantilla_tareas || []),
            veces_usado: 0,
        };

        const workflow = await prisma.workflow.create({
            data: createData,
        });

        return transformWorkflow(workflow);
    }

    /**
     * Obtener workflow por ID
     */
    static async getById(id: string) {
        const workflow = await prisma.workflow.findUnique({
            where: { id },
            include: {
                proyectos: {
                    include: {
                        proyecto: {
                            select: {
                                id: true,
                                nombre: true,
                                estado: true,
                                fecha_creacion: true,
                            },
                        },
                    },
                },
            },
        });

        if (!workflow) {
            throw new Error('Workflow no encontrado');
        }

        return transformWorkflow(workflow);
    }

    /**
     * Listar workflows con filtros
     */
    static async list(filtros: FiltrosWorkflowInput) {
        const { tipo_proyecto, activo, busqueda, page, limit } = filtros;

        const where: any = {};

        if (tipo_proyecto && tipo_proyecto.length > 0) {
            where.tipo_proyecto = { in: tipo_proyecto };
        }

        if (activo !== undefined) {
            where.activo = activo;
        }

        if (busqueda) {
            where.OR = [
                { nombre: { contains: busqueda } },
                { descripcion: { contains: busqueda } },
            ];
        }

        const [workflows, total] = await Promise.all([
            prisma.workflow.findMany({
                where,
                orderBy: [{ veces_usado: 'desc' }, { fecha_creacion: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.workflow.count({ where }),
        ]);

        return {
            workflows: workflows.map(transformWorkflow),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Actualizar workflow
     */
    static async update(id: string, data: Partial<UpdateWorkflowInput>): Promise<Workflow> {
        const updateData: any = { ...data };
        if (data.fases) updateData.fases = JSON.stringify(data.fases);
        if (data.plantilla_tareas) updateData.plantilla_tareas = JSON.stringify(data.plantilla_tareas);

        const workflow = await prisma.workflow.update({
            where: { id },
            data: updateData,
        });

        return transformWorkflow(workflow);
    }

    /**
     * Eliminar workflow
     */
    static async delete(id: string): Promise<void> {
        await prisma.workflow.delete({
            where: { id },
        });
    }

    /**
     * Aplicar workflow a un proyecto
     * Genera todas las tareas automáticamente
     */
    static async aplicarAProyecto(data: AplicarWorkflowInput) {
        const [proyecto, workflowRaw] = await Promise.all([
            prisma.proyecto.findUnique({ where: { id: data.proyecto_id } }),
            prisma.workflow.findUnique({ where: { id: data.workflow_id } }),
        ]);

        if (!proyecto) {
            throw new Error('Proyecto no encontrado');
        }

        if (!workflowRaw) {
            throw new Error('Workflow no encontrado');
        }

        const workflow = transformWorkflow(workflowRaw);

        // Verificar que el tipo de proyecto coincida
        if (workflow.tipo_proyecto !== proyecto.tipo_activo) {
            throw new Error(
                `Este workflow es para proyectos de tipo ${workflow.tipo_proyecto}, pero el proyecto es de tipo ${proyecto.tipo_activo}`
            );
        }

        // Crear relación proyecto-workflow
        await prisma.proyectoWorkflow.create({
            data: {
                proyecto_id: data.proyecto_id,
                workflow_id: data.workflow_id,
            },
        });

        // Generar tareas desde las fases del workflow
        const fases = workflow.fases as any[];
        const tareasCreadas = [];
        const mapaTareas = new Map<string, string>(); // nombre_template -> id_tarea_creada

        for (const fase of fases.sort((a: any, b: any) => a.orden - b.orden)) {
            for (const tareaTemplate of fase.tareas_template) {
                // Calcular dependencias reales
                const dependenciasIds: string[] = [];
                if (tareaTemplate.dependencias) {
                    for (const depNombre of tareaTemplate.dependencias) {
                        const depId = mapaTareas.get(depNombre);
                        if (depId) {
                            dependenciasIds.push(depId);
                        }
                    }
                }

                // Crear la tarea
                const createData: any = {
                    proyecto_id: data.proyecto_id,
                    nombre: tareaTemplate.nombre,
                    descripcion: tareaTemplate.descripcion || `Tarea de la fase: ${fase.nombre}`,
                    tipo_tarea: tareaTemplate.tipo || 'OTRO',
                    estado: 'POR_HACER',
                    prioridad: 'MEDIA',
                    tiempo_estimado: tareaTemplate.duracion_estimada,
                    etiquetas: JSON.stringify([fase.nombre, workflow.nombre]), // JSON Stringify para Tarea.etiquetas
                    posicion_kanban: tareasCreadas.length,
                    checklist: '[]', // Default JSON str
                    archivos_adjuntos: '[]', // Default JSON str
                    total_subtareas: 0,
                    subtareas_completadas: 0,
                    progreso_subtareas: 0,
                    costo_ai: 0,
                };

                const tarea: Tarea = await prisma.tarea.create({
                    data: createData,
                });

                // Crear dependencias si existen
                if (dependenciasIds.length > 0) {
                    for (const depId of dependenciasIds) {
                        await prisma.tareaDependencia.create({
                            data: {
                                tarea_origen_id: tarea.id,
                                tarea_destino_id: depId,
                                // tipo: 'BLOQUEA', // Eliminado
                            } as any,
                        });
                    }
                }

                // Vincular herramientas AI sugeridas si existen
                if ((tareaTemplate as any).herramientas_ai_sugeridas) {
                    for (const nombreHerramienta of (tareaTemplate as any).herramientas_ai_sugeridas) {
                        // Buscar herramienta por nombre
                        const herramienta = await prisma.herramientaAI.findFirst({
                            where: {
                                nombre: { contains: nombreHerramienta },
                                activa: true,
                            },
                        });

                        if (herramienta) {
                            await prisma.tareaHerramientaAI.create({
                                data: {
                                    tarea_id: tarea.id,
                                    herramienta_id: herramienta.id,
                                },
                            });
                        }
                    }
                }

                tareasCreadas.push(tarea);
                mapaTareas.set(tareaTemplate.nombre, tarea.id);
            }
        }

        // Incrementar contador de veces usado
        await prisma.workflow.update({
            where: { id: data.workflow_id },
            data: {
                veces_usado: {
                    increment: 1,
                },
            },
        });

        // Actualizar rollups del proyecto
        await ProyectoService.actualizarRollups(data.proyecto_id);

        return {
            workflow,
            tareas_creadas: tareasCreadas.length,
            tareas: tareasCreadas,
        };
    }

    /**
     * Obtener workflows populares (más usados)
     */
    static async getPopulares(limite: number = 5) {
        const workflows = await prisma.workflow.findMany({
            where: {
                activo: true,
            },
            orderBy: {
                veces_usado: 'desc',
            },
            take: limite,
        });

        return workflows.map(transformWorkflow);
    }

    /**
     * Obtener workflows por tipo de proyecto
     */
    static async getPorTipoProyecto(tipoProyecto: string) {
        const workflows = await prisma.workflow.findMany({
            where: {
                tipo_proyecto: tipoProyecto as any,
                activo: true,
            },
            orderBy: [{ veces_usado: 'desc' }, { fecha_creacion: 'desc' }],
        });

        return workflows.map(transformWorkflow);
    }

    /**
     * Duplicar workflow
     */
    static async duplicar(id: string, nuevoNombre: string, creadoPor: string) {
        const workflowOriginal = await prisma.workflow.findUnique({
            where: { id },
        });

        if (!workflowOriginal) {
            throw new Error('Workflow no encontrado');
        }

        // Usamos campos raw strings, no es necesario transform si copiamos directo
        const workflowNuevo = await prisma.workflow.create({
            data: {
                nombre: nuevoNombre,
                tipo_proyecto: workflowOriginal.tipo_proyecto,
                descripcion: `Copia de: ${workflowOriginal.descripcion}`,
                fases: workflowOriginal.fases, // string ok
                plantilla_tareas: workflowOriginal.plantilla_tareas, // string ok
                activo: true,
                creado_por: creadoPor,
                veces_usado: 0,
            },
        });

        return transformWorkflow(workflowNuevo);
    }

    /**
     * Obtener estadísticas de un workflow
     */
    static async getEstadisticas(id: string) {
        const [workflowRaw, proyectos] = await Promise.all([
            prisma.workflow.findUnique({ where: { id } }),
            prisma.proyectoWorkflow.findMany({
                where: { workflow_id: id },
                include: {
                    proyecto: {
                        select: {
                            id: true,
                            nombre: true,
                            estado: true,
                            progreso_total: true,
                            fecha_creacion: true,
                        },
                    },
                },
            }),
        ]);

        if (!workflowRaw) {
            throw new Error('Workflow no encontrado');
        }

        const workflow = transformWorkflow(workflowRaw);
        const fases = workflow.fases as any[];

        const totalTareasTemplate = fases.reduce(
            (sum: number, fase: any) => sum + (fase.tareas_template?.length || 0),
            0
        );

        const proyectosCompletados = proyectos.filter(
            (p) => p.proyecto.estado === 'COMPLETADO'
        ).length;

        const progresoPromedio =
            proyectos.length > 0
                ? proyectos.reduce((sum, p) => sum + p.proyecto.progreso_total, 0) / proyectos.length
                : 0;

        return {
            workflow_id: id,
            nombre: workflow.nombre,
            tipo_proyecto: workflow.tipo_proyecto,
            veces_usado: workflow.veces_usado,
            total_fases: fases.length,
            total_tareas_template: totalTareasTemplate,
            proyectos_usando: proyectos.length,
            proyectos_completados: proyectosCompletados,
            progreso_promedio: Math.round(progresoPromedio),
            activo: workflow.activo,
        };
    }
}

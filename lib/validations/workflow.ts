// ============================================================
// VALIDACIONES ZOD - WORKFLOWS
// ============================================================

import { z } from 'zod';

export const TipoProyectoSchema = z.enum(['EBOOK', 'CURSO_ONLINE', 'JUEGO_LUDICO', 'APP']);

// Schema para fase del workflow
export const FaseWorkflowSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    orden: z.number().int().positive(),
    duracion_estimada: z.number().positive().optional(), // días
    tareas_template: z.array(
        z.object({
            nombre: z.string(),
            descripcion: z.string().optional(),
            tipo: z.string(),
            duracion_estimada: z.number().positive().optional(), // horas
            dependencias: z.array(z.string()).optional(),
            herramientas_ai_sugeridas: z.array(z.string()).optional(),
        })
    ).default([]),
});

// Schema para crear workflow
export const CreateWorkflowSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100),
    tipo_proyecto: TipoProyectoSchema,
    descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    fases: z.array(FaseWorkflowSchema).min(1, 'Debe tener al menos una fase'),
    plantilla_tareas: z.array(z.any()).default([]), // Tareas adicionales no en fases
    activo: z.boolean().default(true),
    creado_por: z.string().uuid('ID de creador inválido'),
});

// Schema para actualizar workflow
export const UpdateWorkflowSchema = CreateWorkflowSchema.partial().extend({
    id: z.string().uuid(),
});

// Schema para aplicar workflow a proyecto
export const AplicarWorkflowSchema = z.object({
    proyecto_id: z.string().uuid('ID de proyecto inválido'),
    workflow_id: z.string().uuid('ID de workflow inválido'),
});

// Schema para filtros
export const FiltrosWorkflowSchema = z.object({
    tipo_proyecto: z.array(TipoProyectoSchema).optional(),
    activo: z.boolean().optional(),
    busqueda: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
});

export type FaseWorkflowInput = z.infer<typeof FaseWorkflowSchema>;
export type CreateWorkflowInput = z.infer<typeof CreateWorkflowSchema>;
export type UpdateWorkflowInput = z.infer<typeof UpdateWorkflowSchema>;
export type AplicarWorkflowInput = z.infer<typeof AplicarWorkflowSchema>;
export type FiltrosWorkflowInput = z.infer<typeof FiltrosWorkflowSchema>;

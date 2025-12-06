// ============================================================
// VALIDACIONES ZOD - TAREAS
// ============================================================

import { z } from 'zod';

export const EstadoTareaSchema = z.enum([
    'POR_HACER',
    'EN_PROGRESO',
    'EN_REVISION',
    'BLOQUEADO',
    'COMPLETADO',
]);

export const TipoTareaSchema = z.enum([
    'DISENO',
    'DESARROLLO',
    'CONTENIDO',
    'REVISION',
    'MARKETING',
    'INVESTIGACION',
    'OTRO',
]);

// Schema para crear tarea
export const CreateTareaSchema = z.object({
    proyecto_id: z.string().uuid('ID de proyecto inválido'),
    tarea_padre_id: z.string().uuid().optional(),
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200),
    descripcion: z.string().default(''),
    tipo_tarea: TipoTareaSchema,
    estado: EstadoTareaSchema.default('POR_HACER'),
    prioridad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).default('MEDIA'),
    asignado_a_id: z.string().uuid().optional(),
    fecha_inicio: z.coerce.date().optional(),
    fecha_vencimiento: z.coerce.date().optional(),
    tiempo_estimado: z.number().positive().optional(),
    bloqueadores: z.string().optional(),
    checklist: z.array(z.object({
        id: z.string(),
        item: z.string(),
        completado: z.boolean(),
        orden: z.number().int(),
    })).default([]),
    etiquetas: z.array(z.string()).default([]),
    archivos_adjuntos: z.array(z.string()).default([]),
    posicion_kanban: z.number().int().optional(),
});

// Schema para actualizar tarea
export const UpdateTareaSchema = CreateTareaSchema.partial().extend({
    id: z.string().uuid(),
    tiempo_real: z.number().positive().optional(),
    fecha_completado: z.coerce.date().optional(),
});

// Schema para vincular herramienta AI
export const VincularHerramientaAISchema = z.object({
    tarea_id: z.string().uuid(),
    herramienta_id: z.string().uuid(),
});

export type CreateTareaInput = z.infer<typeof CreateTareaSchema>;
export type UpdateTareaInput = z.infer<typeof UpdateTareaSchema>;
export type VincularHerramientaAIInput = z.infer<typeof VincularHerramientaAISchema>;

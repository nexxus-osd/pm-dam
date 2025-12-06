// ============================================================
// VALIDACIONES ZOD - PROYECTOS
// ============================================================

import { z } from 'zod';

// Enums
export const EstadoProyectoSchema = z.enum([
    'PLANEANDO',
    'EN_PROGRESO',
    'PAUSADO',
    'COMPLETADO',
    'CANCELADO',
]);

export const PrioridadSchema = z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']);

export const TipoActivoSchema = z.enum(['EBOOK', 'CURSO_ONLINE', 'JUEGO_LUDICO', 'APP']);

// Schema para crear proyecto
export const CreateProyectoSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200),
    descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    tipo_activo: TipoActivoSchema,
    fecha_inicio: z.coerce.date(),
    fecha_deadline: z.coerce.date(),
    estado: EstadoProyectoSchema.default('PLANEANDO'),
    prioridad: PrioridadSchema.default('MEDIA'),
    responsable_id: z.string().uuid('ID de responsable inválido'),
    presupuesto_asignado: z.number().positive('El presupuesto debe ser positivo'),
    ingresos_estimados: z.number().nonnegative().default(0),
    etiquetas: z.array(z.string()).default([]),
    archivos_adjuntos: z.array(z.string()).default([]),
    notas: z.string().optional(),
    campos_personalizados: z.record(z.any()).optional(),
});

// Schema para actualizar proyecto
export const UpdateProyectoSchema = CreateProyectoSchema.partial().extend({
    id: z.string().uuid(),
});

// Schema para filtros
export const FiltrosProyectoSchema = z.object({
    tipo_activo: z.array(TipoActivoSchema).optional(),
    estado: z.array(EstadoProyectoSchema).optional(),
    prioridad: z.array(PrioridadSchema).optional(),
    responsable_id: z.string().uuid().optional(),
    busqueda: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
});

export type CreateProyectoInput = z.infer<typeof CreateProyectoSchema>;
export type UpdateProyectoInput = z.infer<typeof UpdateProyectoSchema>;
export type FiltrosProyectoInput = z.infer<typeof FiltrosProyectoSchema>;

// Schema para el formulario de frontend (responsable_id es manejado por el server)
export const CreateProyectoFormSchema = CreateProyectoSchema.omit({ responsable_id: true });
export type CreateProyectoFormInput = z.infer<typeof CreateProyectoFormSchema>;

// ============================================================
// VALIDACIONES ZOD - HERRAMIENTAS AI
// ============================================================

import { z } from 'zod';

export const CategoriaAISchema = z.enum([
    'TEXTO',
    'IMAGEN',
    'VIDEO',
    'AUDIO',
    'CODIGO',
    'ANALISIS',
    'CHAT',
    'PRODUCTIVIDAD',
]);

export const TipoPrecioSchema = z.enum([
    'GRATIS',
    'FREEMIUM',
    'SUSCRIPCION',
    'PAY_PER_USE',
    'ONE_TIME',
]);

export const EstadoSuscripcionSchema = z.enum([
    'ACTIVA',
    'PAUSADA',
    'CANCELADA',
    'TRIAL',
]);

// Schema para crear herramienta AI
export const CreateHerramientaAISchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    categoria: z.array(CategoriaAISchema).min(1, 'Debe tener al menos una categoría'),
    descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
    url: z.string().url('URL inválida'),
    logo_url: z.string().url().optional(),
    url_documentacion: z.string().url().optional(),
    tipo_precio: TipoPrecioSchema,
    costo_mensual: z.number().nonnegative().optional(),
    costo_anual: z.number().nonnegative().optional(),
    costo_por_uso: z.number().nonnegative().optional(),
    unidad_uso: z.string().optional(), // "por imagen", "por palabra", etc.
    moneda: z.string().default('USD'),
    plan_actual: z.string().optional(), // "Pro", "Business", etc.
    fecha_suscripcion: z.coerce.date().optional(),
    fecha_renovacion: z.coerce.date().optional(),
    estado_suscripcion: EstadoSuscripcionSchema.optional(),
    caracteristicas: z.array(z.string()).default([]),
    limitaciones: z.array(z.string()).default([]),
    casos_uso: z.array(z.string()).default([]),
    rating: z.number().min(1).max(5).optional(),
    reviews: z.string().optional(),
    notas: z.string().optional(),
    tiene_api: z.boolean().default(false),
    url_api: z.string().url().optional(),
    api_key: z.string().optional(), // Encriptada
    agregado_por_id: z.string().uuid('ID de usuario inválido'),
    favorita: z.boolean().default(false),
    activa: z.boolean().default(true),
    // Métricas de productividad
    tiempo_ahorrado_estimado: z.number().nonnegative().optional(), // horas/mes
    productividad_ganada: z.number().min(0).max(100).optional(), // porcentaje
});

// Schema para actualizar herramienta
export const UpdateHerramientaAISchema = CreateHerramientaAISchema.partial().extend({
    id: z.string().uuid(),
});

// Schema para vincular alternativa
export const VincularAlternativaSchema = z.object({
    herramienta_id: z.string().uuid(),
    alternativa_id: z.string().uuid(),
    razon: z.string().optional(),
});

// Schema para filtros
export const FiltrosHerramientasAISchema = z.object({
    categoria: z.array(CategoriaAISchema).optional(),
    tipo_precio: z.array(TipoPrecioSchema).optional(),
    estado_suscripcion: z.array(EstadoSuscripcionSchema).optional(),
    favorita: z.boolean().optional(),
    activa: z.boolean().optional(),
    tiene_api: z.boolean().optional(),
    busqueda: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
    orderBy: z.enum(['nombre', 'veces_usada', 'costo_mensual', 'rating']).default('nombre'),
    order: z.enum(['asc', 'desc']).default('asc'),
});

export type CreateHerramientaAIInput = z.infer<typeof CreateHerramientaAISchema>;
export type UpdateHerramientaAIInput = z.infer<typeof UpdateHerramientaAISchema>;
export type VincularAlternativaInput = z.infer<typeof VincularAlternativaSchema>;
export type FiltrosHerramientasAIInput = z.infer<typeof FiltrosHerramientasAISchema>;

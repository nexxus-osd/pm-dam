// ============================================================
// VALIDACIONES ZOD - FINANZAS
// ============================================================

import { z } from 'zod';

export const TipoTransaccionSchema = z.enum(['GASTO', 'INGRESO']);

export const CategoriaFinancieraSchema = z.enum([
    'SUSCRIPCION',
    'HERRAMIENTA',
    'FREELANCE',
    'LICENCIA',
    'MARKETING',
    'OTRO',
]);

export const EstadoTransaccionSchema = z.enum([
    'PENDIENTE',
    'PAGADO',
    'CANCELADO',
    'REEMBOLSADO',
]);

export const MetodoPagoSchema = z.enum([
    'TARJETA',
    'TRANSFERENCIA',
    'PAYPAL',
    'STRIPE',
    'OTRO',
]);

export const FrecuenciaRecurrenciaSchema = z.enum([
    'MENSUAL',
    'TRIMESTRAL',
    'ANUAL',
]);

// Schema para crear transacción
export const CreateTransaccionSchema = z.object({
    proyecto_id: z.string().uuid('ID de proyecto inválido'),
    tarea_id: z.string().uuid().optional(),
    herramienta_ai_id: z.string().uuid().optional(),
    activo_id: z.string().uuid().optional(),
    tipo_transaccion: TipoTransaccionSchema,
    categoria: CategoriaFinancieraSchema,
    concepto: z.string().min(3, 'El concepto debe tener al menos 3 caracteres').max(200),
    monto: z.number().positive('El monto debe ser positivo'),
    moneda: z.string().default('USD'),
    tasa_cambio: z.number().positive().optional(),
    fecha_transaccion: z.coerce.date(),
    metodo_pago: MetodoPagoSchema.optional(),
    estado: EstadoTransaccionSchema.default('PENDIENTE'),
    recurrente: z.boolean().default(false),
    frecuencia: FrecuenciaRecurrenciaSchema.optional(),
    proxima_fecha: z.coerce.date().optional(),
    proveedor: z.string().optional(),
    factura_url: z.string().url().optional(),
    numero_factura: z.string().optional(),
    aprobado_por_id: z.string().uuid().optional(),
    fecha_aprobacion: z.coerce.date().optional(),
    requiere_aprobacion: z.boolean().default(false),
    notas: z.string().optional(),
    etiquetas: z.array(z.string()).default([]),
    creado_por_id: z.string().uuid('ID de creador inválido'),
});

// Schema para actualizar transacción
export const UpdateTransaccionSchema = CreateTransaccionSchema.partial().extend({
    id: z.string().uuid(),
});

// Schema para aprobar transacción
export const AprobarTransaccionSchema = z.object({
    aprobado_por_id: z.string().uuid(),
});

// Schema para filtros financieros
export const FiltrosFinanzasSchema = z.object({
    proyecto_id: z.string().uuid().optional(),
    tipo_transaccion: z.array(TipoTransaccionSchema).optional(),
    categoria: z.array(CategoriaFinancieraSchema).optional(),
    estado: z.array(EstadoTransaccionSchema).optional(),
    fecha_desde: z.coerce.date().optional(),
    fecha_hasta: z.coerce.date().optional(),
    recurrente: z.boolean().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
});

export type CreateTransaccionInput = z.infer<typeof CreateTransaccionSchema>;
export type UpdateTransaccionInput = z.infer<typeof UpdateTransaccionSchema>;
export type AprobarTransaccionInput = z.infer<typeof AprobarTransaccionSchema>;
export type FiltrosFinanzasInput = z.infer<typeof FiltrosFinanzasSchema>;

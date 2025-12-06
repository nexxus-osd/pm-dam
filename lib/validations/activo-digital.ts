// ============================================================
// VALIDACIONES ZOD - ACTIVOS DIGITALES (DAM)
// ============================================================

import { z } from 'zod';

export const TipoActivoDigitalSchema = z.enum([
    'IMAGEN',
    'VIDEO',
    'AUDIO',
    'DOCUMENTO',
    'CODIGO',
    'MODELO_3D',
    'FUENTE',
    'OTRO',
]);

export const DerechosUsoSchema = z.enum([
    'USO_LIBRE',
    'USO_COMERCIAL',
    'USO_INTERNO',
    'CON_LICENCIA',
]);

export const TipoLicenciaSchema = z.enum([
    'CREATIVE_COMMONS',
    'COPYRIGHT',
    'DOMINIO_PUBLICO',
    'PERSONALIZADA',
]);

export const EstadoActivoSchema = z.enum([
    'DRAFT',
    'APROBADO',
    'EN_REVISION',
    'ARCHIVADO',
]);

// Schema para crear activo digital
export const CreateActivoDigitalSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200),
    tipo_activo: TipoActivoDigitalSchema,
    categoria: z.string().min(2, 'La categoría es requerida'),
    formato: z.string().min(2, 'El formato es requerido'),
    tamaño: z.number().positive('El tamaño debe ser positivo'),
    url_archivo: z.string().url('URL inválida'),
    thumbnail_url: z.string().url().optional(),
    descripcion: z.string().default(''),
    alt_text: z.string().optional(),
    proyecto_id: z.string().uuid('ID de proyecto inválido'),
    tarea_id: z.string().uuid().optional(),
    creado_por_id: z.string().uuid('ID de creador inválido'),
    derechos_uso: DerechosUsoSchema,
    licencia: TipoLicenciaSchema,
    detalles_licencia: z.string().optional(),
    proveedor: z.string().optional(),
    costo_adquisicion: z.number().nonnegative().optional(),
    fecha_expiracion: z.coerce.date().optional(),
    // Metadatos técnicos
    dimensiones: z.string().optional(), // "1920x1080"
    duracion: z.number().positive().optional(), // segundos
    resolucion: z.string().optional(), // "300 DPI"
    espacio_color: z.string().optional(), // "RGB", "CMYK"
    codec: z.string().optional(),
    // Organización
    etiquetas: z.array(z.string()).default([]),
    version: z.string().default('1.0'),
    estado: EstadoActivoSchema.default('DRAFT'),
    favorito: z.boolean().default(false),
    coleccion: z.string().optional(),
    serie: z.string().optional(),
    notas: z.string().optional(),
});

// Schema para actualizar activo
export const UpdateActivoDigitalSchema = CreateActivoDigitalSchema.partial().extend({
    id: z.string().uuid(),
    modificado_por_id: z.string().uuid().optional(),
});

// Schema para filtros
export const FiltrosActivosSchema = z.object({
    proyecto_id: z.string().uuid().optional(),
    tipo_activo: z.array(TipoActivoDigitalSchema).optional(),
    categoria: z.string().optional(),
    derechos_uso: z.array(DerechosUsoSchema).optional(),
    licencia: z.array(TipoLicenciaSchema).optional(),
    estado: z.array(EstadoActivoSchema).optional(),
    favorito: z.boolean().optional(),
    coleccion: z.string().optional(),
    serie: z.string().optional(),
    busqueda: z.string().optional(),
    formato: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
    orderBy: z.enum(['fecha_creacion', 'nombre', 'tamaño', 'veces_usado']).default('fecha_creacion'),
    order: z.enum(['asc', 'desc']).default('desc'),
});

// Schema para incrementar uso
export const IncrementarUsoSchema = z.object({
    activo_id: z.string().uuid(),
});

export type CreateActivoDigitalInput = z.infer<typeof CreateActivoDigitalSchema>;
export type UpdateActivoDigitalInput = z.infer<typeof UpdateActivoDigitalSchema>;
export type FiltrosActivosInput = z.infer<typeof FiltrosActivosSchema>;
export type IncrementarUsoInput = z.infer<typeof IncrementarUsoSchema>;

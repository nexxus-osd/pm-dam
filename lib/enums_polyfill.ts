// Polyfill para Enums eliminados de Prisma Client al migrar a SQLite
// Estos objetos aseguran que el código existente siga funcionando con tipado similar.

export const EstadoProyecto = {
    PLANEANDO: 'PLANEANDO',
    EN_PROGRESO: 'EN_PROGRESO',
    PAUSADO: 'PAUSADO',
    COMPLETADO: 'COMPLETADO',
    CANCELADO: 'CANCELADO',
} as const;
export type EstadoProyecto = keyof typeof EstadoProyecto;

export const Prioridad = {
    BAJA: 'BAJA',
    MEDIA: 'MEDIA',
    ALTA: 'ALTA',
    CRITICA: 'CRITICA',
} as const;
export type Prioridad = keyof typeof Prioridad;

export const TipoActivo = {
    EBOOK: 'EBOOK',
    CURSO_ONLINE: 'CURSO_ONLINE',
    JUEGO_LUDICO: 'JUEGO_LUDICO',
    APP: 'APP',
} as const;
export type TipoActivo = keyof typeof TipoActivo;

export const EstadoTarea = {
    POR_HACER: 'POR_HACER',
    EN_PROGRESO: 'EN_PROGRESO',
    EN_REVISION: 'EN_REVISION',
    BLOQUEADO: 'BLOQUEADO',
    COMPLETADO: 'COMPLETADO',
} as const;
export type EstadoTarea = keyof typeof EstadoTarea;

export const TipoTarea = {
    DISENO: 'DISENO',
    DESARROLLO: 'DESARROLLO',
    CONTENIDO: 'CONTENIDO',
    REVISION: 'REVISION',
    MARKETING: 'MARKETING',
    INVESTIGACION: 'INVESTIGACION',
    OTRO: 'OTRO',
} as const;
export type TipoTarea = keyof typeof TipoTarea;

export const TipoActivoDigital = {
    IMAGEN: 'IMAGEN',
    VIDEO: 'VIDEO',
    AUDIO: 'AUDIO',
    DOCUMENTO: 'DOCUMENTO',
    CODIGO: 'CODIGO',
    MODELO_3D: 'MODELO_3D',
    FUENTE: 'FUENTE',
    OTRO: 'OTRO',
} as const;
export type TipoActivoDigital = keyof typeof TipoActivoDigital;

export const DerechosUso = {
    USO_LIBRE: 'USO_LIBRE',
    USO_COMERCIAL: 'USO_COMERCIAL',
    USO_INTERNO: 'USO_INTERNO',
    CON_LICENCIA: 'CON_LICENCIA',
} as const;
export type DerechosUso = keyof typeof DerechosUso;

export const TipoLicencia = {
    CREATIVE_COMMONS: 'CREATIVE_COMMONS',
    COPYRIGHT: 'COPYRIGHT',
    DOMINIO_PUBLICO: 'DOMINIO_PUBLICO',
    PERSONALIZADA: 'PERSONALIZADA',
} as const;
export type TipoLicencia = keyof typeof TipoLicencia;

export const EstadoActivo = {
    DRAFT: 'DRAFT',
    APROBADO: 'APROBADO',
    EN_REVISION: 'EN_REVISION',
    ARCHIVADO: 'ARCHIVADO',
} as const;
export type EstadoActivo = keyof typeof EstadoActivo;

export const TipoTransaccion = {
    GASTO: 'GASTO',
    INGRESO: 'INGRESO',
} as const;
export type TipoTransaccion = keyof typeof TipoTransaccion;

export const CategoriaFinanciera = {
    SUSCRIPCION: 'SUSCRIPCION',
    HERRAMIENTA: 'HERRAMIENTA',
    FREELANCE: 'FREELANCE',
    LICENCIA: 'LICENCIA',
    MARKETING: 'MARKETING',
    OTRO: 'OTRO',
} as const;
export type CategoriaFinanciera = keyof typeof CategoriaFinanciera;

export const EstadoTransaccion = {
    PENDIENTE: 'PENDIENTE',
    PAGADO: 'PAGADO',
    CANCELADO: 'CANCELADO',
    REEMBOLSADO: 'REEMBOLSADO',
} as const;
export type EstadoTransaccion = keyof typeof EstadoTransaccion;

export const FrecuenciaRecurrencia = {
    MENSUAL: 'MENSUAL',
    TRIMESTRAL: 'TRIMESTRAL',
    ANUAL: 'ANUAL',
} as const;
export type FrecuenciaRecurrencia = keyof typeof FrecuenciaRecurrencia;

export const MetodoPago = {
    TARJETA: 'TARJETA',
    TRANSFERENCIA: 'TRANSFERENCIA',
    PAYPAL: 'PAYPAL',
    STRIPE: 'STRIPE',
    OTRO: 'OTRO',
} as const;
export type MetodoPago = keyof typeof MetodoPago;

export const TipoPrecioAI = {
    GRATIS: 'GRATIS',
    FREEMIUM: 'FREEMIUM',
    SUSCRIPCION: 'SUSCRIPCION',
    PAY_PER_USE: 'PAY_PER_USE',
    ONE_TIME: 'ONE_TIME',
} as const;
export type TipoPrecioAI = keyof typeof TipoPrecioAI;

export const EstadoSuscripcion = {
    ACTIVA: 'ACTIVA',
    PAUSADA: 'PAUSADA',
    CANCELADA: 'CANCELADA',
    TRIAL: 'TRIAL',
} as const;
export type EstadoSuscripcion = keyof typeof EstadoSuscripcion;

export const CategoriaAI = {
    TEXTO: 'TEXTO',
    IMAGEN: 'IMAGEN',
    VIDEO: 'VIDEO',
    AUDIO: 'AUDIO',
    CODIGO: 'CODIGO',
    ANALISIS: 'ANALISIS',
    DATOS: 'DATOS',
} as const;
export type CategoriaAI = keyof typeof CategoriaAI;

export const RolUsuario = {
    ADMIN: 'ADMIN',
    PROJECT_MANAGER: 'PROJECT_MANAGER',
    DESARROLLADOR: 'DESARROLLADOR',
    DISENADOR: 'DISENADOR',
    CREADOR_CONTENIDO: 'CREADOR_CONTENIDO',
    VIEWER: 'VIEWER',
} as const;
export type RolUsuario = keyof typeof RolUsuario;

// Helper para parsear JSON seguro (arrays)
export function parseJsonArray(jsonString: string | null | undefined): string[] {
    if (!jsonString) return [];
    try {
        const parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// ============================================================
// DATABASE TYPES - Tipos reutilizables del sistema
// ============================================================

import type {
    Proyecto as PrismaProyecto,
    Tarea as PrismaTarea,
    Transaccion as PrismaTransaccion,
    ActivoDigital as PrismaActivoDigital,
    HerramientaAI as PrismaHerramientaAI,
} from '@prisma/client';
import { EstadoTarea as PrismaEstadoTarea, TipoTransaccion as PrismaTipoTransaccion } from '@/lib/enums_polyfill';

// Re-exportar tipos de Prisma
export type Proyecto = PrismaProyecto & {
    herramientas_ai_usadas?: string[];
};

export type Tarea = PrismaTarea & {
    herramientas_ai: string[];
    dependencias_ids: string[];
};

export type Transaccion = PrismaTransaccion;
export type ActivoDigital = PrismaActivoDigital;
export type HerramientaAI = PrismaHerramientaAI & {
    proyectos_usada?: string[];
};

export type EstadoTarea = PrismaEstadoTarea;
export type TipoTransaccion = PrismaTipoTransaccion;

// Tipos de utilidad
export type Percentage = number; // 0-100
export type Currency = number;   // Monto en USD o moneda base

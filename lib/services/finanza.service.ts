// ============================================================
// SERVICIO DE FINANZAS
// Lógica de negocio para transacciones financieras
// ============================================================

import prisma from '@/lib/prisma';
import { ProyectoService } from './proyecto.service';
import { formulas } from '@/utils/formulas';
import type { Transaccion } from '@prisma/client';
import type {
    CreateTransaccionInput,
    UpdateTransaccionInput,
    AprobarTransaccionInput,
    FiltrosFinanzasInput,
} from '@/lib/validations/transaccion';
import { parseJsonArray } from '@/lib/enums_polyfill';

// Helper
const transformTransaccion = (t: any): any => {
    if (!t) return null;
    return {
        ...t,
        etiquetas: parseJsonArray(t.etiquetas),
    };
};

export class FinanzaService {
    /**
     * Crear nueva transacción
     */
    static async create(data: CreateTransaccionInput): Promise<Transaccion> {
        const createData: any = {
            ...data,
            etiquetas: JSON.stringify(data.etiquetas || []),
        };

        const transaccion = await prisma.transaccion.create({
            data: createData,
        });

        // Si la transacción está pagada, actualizar rollups del proyecto
        if (transaccion.estado === 'PAGADO') {
            await ProyectoService.actualizarRollups(data.proyecto_id);

            // Si está vinculada a una herramienta AI, actualizar sus estadísticas
            if (data.herramienta_ai_id) {
                await this.actualizarEstadisticasHerramientaAI(data.herramienta_ai_id);
            }
        }

        return transformTransaccion(transaccion);
    }

    /**
     * Obtener transacción por ID
     */
    static async getById(id: string) {
        const transaccion = await prisma.transaccion.findUnique({
            where: { id },
            include: {
                proyecto: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                tarea: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                herramienta_ai: {
                    select: {
                        id: true,
                        nombre: true,
                        logo_url: true,
                        // auto_renovacion: true -> Eliminado por no existir en schema
                    },
                },
                activo: {
                    select: {
                        id: true,
                        nombre: true,
                        thumbnail_url: true,
                    },
                },
                aprobado_por: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                    },
                },
                creado_por: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                    },
                },
            },
        });

        if (!transaccion) {
            throw new Error('Transacción no encontrada');
        }

        return transformTransaccion(transaccion);
    }

    /**
     * Listar transacciones con filtros
     */
    static async list(filtros: FiltrosFinanzasInput) {
        const {
            proyecto_id,
            tipo_transaccion,
            categoria,
            estado,
            fecha_desde,
            fecha_hasta,
            recurrente,
            page,
            limit,
        } = filtros;

        const where: any = {};

        if (proyecto_id) {
            where.proyecto_id = proyecto_id;
        }

        if (tipo_transaccion && tipo_transaccion.length > 0) {
            where.tipo_transaccion = { in: tipo_transaccion };
        }

        if (categoria && categoria.length > 0) {
            where.categoria = { in: categoria };
        }

        if (estado && estado.length > 0) {
            where.estado = { in: estado };
        }

        if (fecha_desde || fecha_hasta) {
            where.fecha_transaccion = {};
            if (fecha_desde) where.fecha_transaccion.gte = fecha_desde;
            if (fecha_hasta) where.fecha_transaccion.lte = fecha_hasta;
        }

        if (recurrente !== undefined) {
            where.recurrente = recurrente;
        }

        const [transacciones, total] = await Promise.all([
            prisma.transaccion.findMany({
                where,
                include: {
                    proyecto: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    herramienta_ai: {
                        select: {
                            id: true,
                            nombre: true,
                            logo_url: true,
                        },
                    },
                },
                orderBy: { fecha_transaccion: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.transaccion.count({ where }),
        ]);

        return {
            transacciones: transacciones.map(transformTransaccion),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Actualizar transacción
     */
    static async update(id: string, data: Partial<UpdateTransaccionInput>): Promise<Transaccion> {
        const transaccionAnterior = await prisma.transaccion.findUnique({
            where: { id },
        });

        if (!transaccionAnterior) {
            throw new Error('Transacción no encontrada');
        }

        const updateData: any = { ...data };
        if (data.etiquetas) updateData.etiquetas = JSON.stringify(data.etiquetas);

        const transaccion = await prisma.transaccion.update({
            where: { id },
            data: updateData,
        });

        // Si cambió el estado a PAGADO, actualizar rollups
        if (
            transaccion.estado === 'PAGADO' &&
            transaccionAnterior.estado !== 'PAGADO'
        ) {
            await ProyectoService.actualizarRollups(transaccion.proyecto_id);

            if (transaccion.herramienta_ai_id) {
                await this.actualizarEstadisticasHerramientaAI(transaccion.herramienta_ai_id);
            }
        }

        // Si cambió de PAGADO a otro estado, recalcular
        if (
            transaccionAnterior.estado === 'PAGADO' &&
            transaccion.estado !== 'PAGADO'
        ) {
            await ProyectoService.actualizarRollups(transaccion.proyecto_id);

            if (transaccion.herramienta_ai_id) {
                await this.actualizarEstadisticasHerramientaAI(transaccion.herramienta_ai_id);
            }
        }

        return transformTransaccion(transaccion);
    }

    /**
     * Eliminar transacción
     */
    static async delete(id: string): Promise<void> {
        const transaccion = await prisma.transaccion.findUnique({
            where: { id },
        });

        if (!transaccion) {
            throw new Error('Transacción no encontrada');
        }

        await prisma.transaccion.delete({ where: { id } });

        // Si estaba pagada, actualizar rollups
        if (transaccion.estado === 'PAGADO') {
            await ProyectoService.actualizarRollups(transaccion.proyecto_id);

            if (transaccion.herramienta_ai_id) {
                await this.actualizarEstadisticasHerramientaAI(transaccion.herramienta_ai_id);
            }
        }
    }

    /**
     * Aprobar transacción
     */
    static async aprobar(id: string, data: AprobarTransaccionInput): Promise<Transaccion> {
        const transaccion = await prisma.transaccion.update({
            where: { id },
            data: {
                estado: 'PAGADO',
                aprobado_por_id: data.aprobado_por_id,
                fecha_aprobacion: new Date(),
            },
        });

        // Actualizar rollups del proyecto
        await ProyectoService.actualizarRollups(transaccion.proyecto_id);

        if (transaccion.herramienta_ai_id) {
            await this.actualizarEstadisticasHerramientaAI(transaccion.herramienta_ai_id);
        }

        return transformTransaccion(transaccion);
    }

    /**
     * Obtener resumen financiero de un proyecto
     */
    static async obtenerResumenProyecto(proyectoId: string) {
        const [proyecto, transacciones] = await Promise.all([
            prisma.proyecto.findUnique({
                where: { id: proyectoId },
            }),
            prisma.transaccion.findMany({
                where: {
                    proyecto_id: proyectoId,
                    estado: 'PAGADO',
                },
            }),
        ]);

        if (!proyecto) {
            throw new Error('Proyecto no encontrado');
        }

        const gastosPorCategoria = formulas.calcularGastosPorCategoria(transacciones as any);
        const proyeccionMensual = formulas.calcularProyeccionMensual(transacciones as any);
        const burnRate = formulas.calcularBurnRate(transacciones as any, proyecto.fecha_inicio);
        const runway = formulas.calcularRunway(Number(proyecto.balance_restante), burnRate);

        const topGastos = Object.entries(gastosPorCategoria)
            .map(([categoria, monto]) => ({
                categoria,
                monto,
                porcentaje: (monto / Number(proyecto.gastos_acumulados)) * 100,
            }))
            .sort((a, b) => b.monto - a.monto)
            .slice(0, 5);

        return {
            presupuesto_total: Number(proyecto.presupuesto_asignado),
            gastado: Number(proyecto.gastos_acumulados),
            ingresos: Number(proyecto.ingresos_totales),
            balance: Number(proyecto.balance_restante),
            roi: proyecto.roi_preliminar,
            burn_rate: burnRate,
            runway_meses: runway,
            proyeccion_mensual: proyeccionMensual,
            top_gastos: topGastos,
            gastos_por_categoria: gastosPorCategoria,
            total_transacciones: transacciones.length,
        };
    }

    /**
     * Obtener transacciones recurrentes próximas a vencer
     */
    static async obtenerRecurrentesProximas(diasAnticipacion: number = 7) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);

        const transacciones = await prisma.transaccion.findMany({
            where: {
                recurrente: true,
                estado: 'PAGADO',
                proxima_fecha: {
                    lte: fechaLimite,
                },
            },
            include: {
                proyecto: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                herramienta_ai: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
            orderBy: {
                proxima_fecha: 'asc',
            },
        });

        return transacciones.map(transformTransaccion);
    }

    /**
     * Generar próxima transacción recurrente
     */
    static async generarProximaRecurrente(transaccionId: string): Promise<Transaccion> {
        const transaccionOriginal = await prisma.transaccion.findUnique({
            where: { id: transaccionId },
        });

        if (!transaccionOriginal) {
            throw new Error('Transacción no encontrada');
        }

        if (!transaccionOriginal.recurrente) {
            throw new Error('La transacción no es recurrente');
        }

        // Calcular próxima fecha según frecuencia
        const proximaFecha = new Date(transaccionOriginal.proxima_fecha || new Date());
        let nuevaProximaFecha = new Date(proximaFecha);

        switch (transaccionOriginal.frecuencia) {
            case 'MENSUAL':
                nuevaProximaFecha.setMonth(nuevaProximaFecha.getMonth() + 1);
                break;
            case 'TRIMESTRAL':
                nuevaProximaFecha.setMonth(nuevaProximaFecha.getMonth() + 3);
                break;
            case 'ANUAL':
                nuevaProximaFecha.setFullYear(nuevaProximaFecha.getFullYear() + 1);
                break;
        }

        // Crear nueva transacción
        const nuevaTransaccion = await prisma.transaccion.create({
            data: {
                proyecto_id: transaccionOriginal.proyecto_id,
                tarea_id: transaccionOriginal.tarea_id,
                herramienta_ai_id: transaccionOriginal.herramienta_ai_id,
                activo_id: transaccionOriginal.activo_id,
                tipo_transaccion: transaccionOriginal.tipo_transaccion,
                categoria: transaccionOriginal.categoria,
                concepto: transaccionOriginal.concepto,
                monto: transaccionOriginal.monto,
                moneda: transaccionOriginal.moneda,
                fecha_transaccion: proximaFecha,
                metodo_pago: transaccionOriginal.metodo_pago,
                estado: 'PENDIENTE',
                recurrente: true,
                frecuencia: transaccionOriginal.frecuencia,
                proxima_fecha: nuevaProximaFecha,
                proveedor: transaccionOriginal.proveedor,
                requiere_aprobacion: transaccionOriginal.requiere_aprobacion,
                etiquetas: transaccionOriginal.etiquetas, // String a String OK
                creado_por_id: transaccionOriginal.creado_por_id,
            },
        });

        // Actualizar fecha de próxima recurrencia en la original
        await prisma.transaccion.update({
            where: { id: transaccionId },
            data: {
                proxima_fecha: nuevaProximaFecha,
            },
        });

        return transformTransaccion(nuevaTransaccion);
    }

    /**
     * Actualizar estadísticas de herramienta AI
     */
    private static async actualizarEstadisticasHerramientaAI(herramientaId: string) {
        const transacciones = await prisma.transaccion.findMany({
            where: {
                herramienta_ai_id: herramientaId,
                tipo_transaccion: 'GASTO',
                estado: 'PAGADO',
            },
        });

        const costoTotal = transacciones.reduce((sum, t) => sum + Number(t.monto), 0);

        await prisma.herramientaAI.update({
            where: { id: herramientaId },
            data: {
                costo_total_gastado: costoTotal,
            },
        });
    }

    /**
     * Obtener resumen financiero global
     */
    static async obtenerResumenGlobal(filtros?: { fecha_desde?: Date; fecha_hasta?: Date }) {
        const where: any = {};

        if (filtros?.fecha_desde || filtros?.fecha_hasta) {
            where.fecha_transaccion = {};
            if (filtros.fecha_desde) where.fecha_transaccion.gte = filtros.fecha_desde;
            if (filtros.fecha_hasta) where.fecha_transaccion.lte = filtros.fecha_hasta;
        }

        where.estado = 'PAGADO';

        const [proyectos, transacciones] = await Promise.all([
            prisma.proyecto.findMany(),
            prisma.transaccion.findMany({ where }),
        ]);

        const resumen = formulas.generarResumenFinanciero(proyectos as any, transacciones as any);

        return resumen;
    }
}

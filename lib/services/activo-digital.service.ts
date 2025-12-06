// ============================================================
// SERVICIO DE ACTIVOS DIGITALES (DAM)
// Digital Asset Management
// ============================================================

import prisma from '@/lib/prisma';
import { ProyectoService } from './proyecto.service';
import { formulas } from '@/utils/formulas';
import type { ActivoDigital } from '@prisma/client';
import type {
    CreateActivoDigitalInput,
    UpdateActivoDigitalInput,
    FiltrosActivosInput,
} from '@/lib/validations/activo-digital';
import { parseJsonArray } from '@/lib/enums_polyfill';

// Helper
const transformActivo = (a: any): any => {
    if (!a) return null;
    return {
        ...a,
        etiquetas: parseJsonArray(a.etiquetas),
    };
};

export class ActivoDigitalService {
    /**
     * Crear nuevo activo digital
     */
    static async create(data: CreateActivoDigitalInput): Promise<ActivoDigital> {
        const createData: any = {
            ...data,
            etiquetas: JSON.stringify(data.etiquetas || []),
            veces_usado: 0,
        };

        const activo = await prisma.activoDigital.create({
            data: createData,
        });

        // Actualizar contador de activos del proyecto
        await ProyectoService.actualizarRollups(data.proyecto_id);

        return transformActivo(activo);
    }

    /**
     * Obtener activo por ID
     */
    static async getById(id: string) {
        const activo = await prisma.activoDigital.findUnique({
            where: { id },
            include: {
                proyecto: {
                    select: {
                        id: true,
                        nombre: true,
                        tipo_activo: true,
                    },
                },
                tarea: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                creado_por: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        avatar_url: true,
                    },
                },
                transacciones: {
                    where: {
                        tipo_transaccion: 'GASTO',
                    },
                    select: {
                        id: true,
                        concepto: true,
                        monto: true,
                        fecha_transaccion: true,
                    },
                },
            },
        });

        if (!activo) {
            throw new Error('Activo no encontrado');
        }

        return transformActivo(activo);
    }

    /**
     * Listar activos con filtros avanzados
     */
    static async list(filtros: FiltrosActivosInput) {
        const {
            proyecto_id,
            tipo_activo,
            categoria,
            derechos_uso,
            licencia,
            estado,
            favorito,
            coleccion,
            serie,
            busqueda,
            formato,
            page,
            limit,
            orderBy,
            order,
        } = filtros;

        const where: any = {};

        if (proyecto_id) {
            where.proyecto_id = proyecto_id;
        }

        if (tipo_activo && tipo_activo.length > 0) {
            where.tipo_activo = { in: tipo_activo };
        }

        if (categoria) {
            where.categoria = { contains: categoria }; // mode insensitive removed
        }

        if (derechos_uso && derechos_uso.length > 0) {
            where.derechos_uso = { in: derechos_uso };
        }

        if (licencia && licencia.length > 0) {
            where.licencia = { in: licencia };
        }

        if (estado && estado.length > 0) {
            where.estado = { in: estado };
        }

        if (favorito !== undefined) {
            where.favorito = favorito;
        }

        if (coleccion) {
            where.coleccion = { contains: coleccion }; // mode insensitive removed
        }

        if (serie) {
            where.serie = { contains: serie }; // mode insensitive removed
        }

        if (formato) {
            where.formato = { contains: formato }; // mode insensitive removed
        }

        if (busqueda) {
            where.OR = [
                { nombre: { contains: busqueda } }, // mode insensitive removed
                { descripcion: { contains: busqueda } },
                { etiquetas: { contains: busqueda } }, // JSON string contains
                { categoria: { contains: busqueda } }, // mode insensitive removed
            ];
        }

        const [activos, total] = await Promise.all([
            prisma.activoDigital.findMany({
                where,
                include: {
                    proyecto: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    creado_por: {
                        select: {
                            id: true,
                            nombre: true,
                            avatar_url: true,
                        },
                    },
                },
                orderBy: { [orderBy]: order },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.activoDigital.count({ where }),
        ]);

        return {
            activos: activos.map(transformActivo),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Actualizar activo
     */
    static async update(id: string, data: Partial<UpdateActivoDigitalInput>): Promise<ActivoDigital> {
        const updateData: any = {
            ...data,
            ultima_modificacion: new Date(),
        };

        if (data.etiquetas) {
            updateData.etiquetas = JSON.stringify(data.etiquetas);
        }

        const activo = await prisma.activoDigital.update({
            where: { id },
            data: updateData,
        });

        return transformActivo(activo);
    }

    /**
     * Eliminar activo
     */
    static async delete(id: string): Promise<void> {
        const activo = await prisma.activoDigital.findUnique({
            where: { id },
        });

        if (!activo) {
            throw new Error('Activo no encontrado');
        }

        await prisma.activoDigital.delete({ where: { id } });

        // Actualizar contador del proyecto
        await ProyectoService.actualizarRollups(activo.proyecto_id);
    }

    /**
     * Incrementar contador de uso
     */
    static async incrementarUso(id: string): Promise<ActivoDigital> {
        const activo = await prisma.activoDigital.update({
            where: { id },
            data: {
                veces_usado: {
                    increment: 1,
                },
            },
        });

        return transformActivo(activo);
    }

    /**
     * Marcar/desmarcar como favorito
     */
    static async toggleFavorito(id: string): Promise<ActivoDigital> {
        const activo = await prisma.activoDigital.findUnique({
            where: { id },
        });

        if (!activo) {
            throw new Error('Activo no encontrado');
        }

        const updated = await prisma.activoDigital.update({
            where: { id },
            data: {
                favorito: !activo.favorito,
            },
        });

        return transformActivo(updated);
    }

    /**
     * Obtener activos por colección
     */
    static async getByColeccion(coleccion: string, proyectoId?: string) {
        const where: any = {
            coleccion: { equals: coleccion }, // mode insensitive removed
        };

        if (proyectoId) {
            where.proyecto_id = proyectoId;
        }

        const activos = await prisma.activoDigital.findMany({
            where,
            orderBy: [{ version: 'desc' }, { fecha_creacion: 'desc' }],
        });

        return activos.map(transformActivo);
    }

    /**
     * Obtener activos por serie
     */
    static async getBySerie(serie: string, proyectoId?: string) {
        const where: any = {
            serie: { equals: serie }, // mode insensitive removed
        };

        if (proyectoId) {
            where.proyecto_id = proyectoId;
        }

        const activos = await prisma.activoDigital.findMany({
            where,
            orderBy: [{ version: 'desc' }, { fecha_creacion: 'desc' }],
        });

        return activos.map(transformActivo);
    }

    /**
     * Obtener estadísticas de activos
     */
    static async getEstadisticas(proyectoId?: string) {
        const where: any = {};
        if (proyectoId) {
            where.proyecto_id = proyectoId;
        }

        const [activosRaw, total] = await Promise.all([
            prisma.activoDigital.findMany({ where }),
            prisma.activoDigital.count({ where }),
        ]);

        const activos = activosRaw.map(transformActivo);

        // Los helpers de fórmulas esperan any o modelos alineados, transformActivo ayuda
        const espacioTotal = formulas.calcularEspacioTotal(activos);
        const espacioGB = formulas.calcularEspacioEnGB(activos);
        const activosPorTipo = formulas.agruparActivosPorTipo(activos);
        const masUsados = formulas.obtenerActivosMasUsados(activos, 10);

        // Activos por estado
        const porEstado = activos.reduce((acc: any, activo: any) => {
            acc[activo.estado] = (acc[activo.estado] || 0) + 1;
            return acc;
        }, {});

        // Activos por licencia
        const porLicencia = activos.reduce((acc: any, activo: any) => {
            acc[activo.licencia] = (acc[activo.licencia] || 0) + 1;
            return acc;
        }, {});

        return {
            total_activos: total,
            espacio_total_mb: espacioTotal,
            espacio_total_gb: espacioGB,
            activos_por_tipo: activosPorTipo,
            activos_por_estado: porEstado,
            activos_por_licencia: porLicencia,
            activos_mas_usados: masUsados,
            activos_favoritos: activos.filter((a: any) => a.favorito).length,
        };
    }

    /**
     * Buscar activos similares (mismo tipo y categoría)
     */
    static async buscarSimilares(activoId: string, limite: number = 5) {
        const activoRaw = await prisma.activoDigital.findUnique({
            where: { id: activoId },
        });

        if (!activoRaw) {
            throw new Error('Activo no encontrado');
        }

        const activo = transformActivo(activoRaw);

        // Fetch de candidatos (mismo proyecto, no el mismo ID)
        // Optimizacion: filtrar por tipo o categoria en DB si posible.
        const candidatosRaw = await prisma.activoDigital.findMany({
            where: {
                id: { not: activoId },
                proyecto_id: activo.proyecto_id,
                OR: [
                    { tipo_activo: activo.tipo_activo },
                    { categoria: { equals: activo.categoria } }, // Category is string in DB
                ]
            },
            take: 50, // Traemos mas para filtrar en memoria
        });

        const candidatos = candidatosRaw.map(transformActivo);

        // Filtrar y ordenar en memoria por similitud de etiquetas
        const similares = candidatos.map((c: any) => {
            let score = 0;
            if (c.tipo_activo === activo.tipo_activo) score += 2;
            if (c.categoria === activo.categoria) score += 2;

            // Similitud de etiquetas
            if (activo.etiquetas && c.etiquetas) {
                const etiquetasComunes = activo.etiquetas.filter((tag: string) => c.etiquetas.includes(tag));
                score += etiquetasComunes.length;
            }

            return { ...c, similarityScore: score };
        })
            .sort((a: any, b: any) => b.similarityScore - a.similarityScore)
            .slice(0, limite); // Top N

        return similares;
    }

    /**
     * Obtener versiones de un activo
     */
    static async getVersiones(nombre: string, proyectoId: string) {
        const activos = await prisma.activoDigital.findMany({
            where: {
                nombre: { contains: nombre }, // mode insensitive removed
                proyecto_id: proyectoId,
            },
            orderBy: { version: 'desc' },
        });

        return activos.map(transformActivo);
    }

    /**
     * Obtener activos con licencias próximas a expirar
     */
    static async getLicenciasProximasExpirar(diasAnticipacion: number = 30) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + diasAnticipacion);

        // Este query usa fechas, funciona bien en SQLite
        const activos = await prisma.activoDigital.findMany({
            where: {
                fecha_expiracion: {
                    lte: fechaLimite,
                    gte: new Date(),
                },
            },
            include: {
                proyecto: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
            },
            orderBy: { fecha_expiracion: 'asc' },
        });

        return activos.map(transformActivo);
    }
}

// ============================================================
// SERVICIO DE HERRAMIENTAS AI
// AI Directory con análisis de ROI
// ============================================================

import prisma from '@/lib/prisma';
import { formulas } from '@/utils/formulas';
import type { HerramientaAI } from '@prisma/client';
import type {
    CreateHerramientaAIInput,
    UpdateHerramientaAIInput,
    FiltrosHerramientasAIInput,
    VincularAlternativaInput,
} from '@/lib/validations/herramienta-ai';
import { parseJsonArray } from '@/lib/enums_polyfill';

// Helper para transformar
const transformHerramienta = (h: any): any => {
    if (!h) return null;
    return {
        ...h,
        categoria: parseJsonArray(h.categoria),
        caracteristicas: parseJsonArray(h.caracteristicas),
        casos_uso: parseJsonArray(h.casos_uso),
    };
};

export class HerramientaAIService {
    /**
     * Crear nueva herramienta AI
     */
    static async create(data: CreateHerramientaAIInput): Promise<HerramientaAI> {
        const createData: any = {
            ...data,
            categoria: JSON.stringify(data.categoria || []),
            caracteristicas: JSON.stringify(data.caracteristicas || []),
            casos_uso: JSON.stringify(data.casos_uso || []),
            veces_usada: 0,
            costo_total_gastado: 0,
        };

        const herramienta = await prisma.herramientaAI.create({
            data: createData,
        });

        return transformHerramienta(herramienta);
    }

    /**
     * Obtener herramienta por ID
     */
    static async getById(id: string) {
        const herramienta = await prisma.herramientaAI.findUnique({
            where: { id },
            include: {
                agregado_por: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                    },
                },
                tareas: {
                    include: {
                        tarea: {
                            select: {
                                id: true,
                                nombre: true,
                                proyecto_id: true,
                                proyecto: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                    },
                                },
                            },
                        },
                    },
                    take: 10,
                    orderBy: {
                        // TODO: corregir campo de ordenamiento si 'vinculado_en' no existe
                        // Por ahora usamos id o fecha de creación si es posible
                        id: 'desc',
                    },
                },
                transacciones: {
                    where: {
                        tipo_transaccion: 'GASTO',
                        estado: 'PAGADO',
                    },
                    select: {
                        id: true,
                        monto: true,
                        fecha_transaccion: true,
                        proyecto: {
                            select: {
                                id: true,
                                nombre: true,
                            },
                        },
                    },
                    orderBy: {
                        fecha_transaccion: 'desc',
                    },
                },
                alternativas_origen: {
                    include: {
                        herramienta_destino: { // Corregido de 'alternativa' a 'herramienta_destino'
                            select: {
                                id: true,
                                nombre: true,
                                logo_url: true,
                                costo_mensual: true,
                                rating: true,
                            },
                        },
                    },
                },
            },
        });

        if (!herramienta) {
            throw new Error('Herramienta AI no encontrada');
        }

        const transformada = transformHerramienta(herramienta);

        // Transformar también la herramienta destino en alternativas si fuera necesario (aunque allí no usamos arrays por ahora en el select)
        // Pero el tipo HerramientaAI incluye arrays, así que mejor prevenir si se retornan
        if (transformada.alternativas_origen) {
            transformada.alternativas_origen = transformada.alternativas_origen.map((alt: any) => ({
                ...alt,
                herramienta_destino: transformHerramienta(alt.herramienta_destino)
            }));
        }

        return transformada;
    }

    /**
     * Listar herramientas con filtros
     */
    static async list(filtros: FiltrosHerramientasAIInput) {
        const {
            categoria,
            tipo_precio,
            estado_suscripcion,
            favorita,
            activa,
            tiene_api,
            busqueda,
            page,
            limit,
            orderBy,
            order,
        } = filtros;

        const where: any = {};

        // Filtros simples compatibles directo con Prisma
        if (tipo_precio && tipo_precio.length > 0) {
            where.tipo_precio = { in: tipo_precio };
        }

        if (estado_suscripcion && estado_suscripcion.length > 0) {
            where.estado_suscripcion = { in: estado_suscripcion };
        }

        if (favorita !== undefined) {
            where.favorita = favorita;
        }

        if (activa !== undefined) {
            where.activa = activa;
        }

        if (tiene_api !== undefined) {
            where.tiene_api = tiene_api;
        }

        if (busqueda) {
            where.OR = [
                { nombre: { contains: busqueda } }, // mode insensitive removido
                { descripcion: { contains: busqueda } },
                { casos_uso: { contains: busqueda } }, // Busqueda en String JSON
            ];
        }

        // Recuperar TODAS las herramientas que cumplan filtros básicos y paginar en memoria si hay filtros de array complejos
        // Ojo: Si 'categoria' está presente, no podemos filtrarla en DB fácilmente.
        // Estrategia: Si hay filtro de categoría, traemos mas o todas y filtramos en JS.
        // Dado el scope pequeño, traeremos todas las que cumplan el 'where' parcial.

        const herramientasRaw = await prisma.herramientaAI.findMany({
            where,
            orderBy: { [orderBy]: order },
        });

        let herramientas = herramientasRaw.map(transformHerramienta);

        // Filtrado en memoria para Arrays (Categoria)
        if (categoria && categoria.length > 0) {
            herramientas = herramientas.filter((h: any) =>
                h.categoria.some((c: string) => categoria.includes(c as any))
            );
        }

        const totalFiltered = herramientas.length;

        // Paginación manual en memoria
        const start = (page - 1) * limit;
        const pagedHerramientas = herramientas.slice(start, start + limit);

        // Count total real en DB (aproximación si no filtramos por categoría)
        // Para consistencia con paginación en memoria, usamos totalFiltered

        return {
            herramientas: pagedHerramientas,
            total: totalFiltered,
            page,
            limit,
            totalPages: Math.ceil(totalFiltered / limit),
        };
    }

    /**
     * Actualizar herramienta
     */
    static async update(id: string, data: Partial<UpdateHerramientaAIInput>): Promise<HerramientaAI> {
        const updateData: any = { ...data };

        if (data.categoria) updateData.categoria = JSON.stringify(data.categoria);
        if (data.caracteristicas) updateData.caracteristicas = JSON.stringify(data.caracteristicas);
        if (data.casos_uso) updateData.casos_uso = JSON.stringify(data.casos_uso);

        const herramienta = await prisma.herramientaAI.update({
            where: { id },
            data: updateData,
        });

        return transformHerramienta(herramienta);
    }

    /**
     * Eliminar herramienta
     */
    static async delete(id: string): Promise<void> {
        await prisma.herramientaAI.delete({
            where: { id },
        });
    }

    /**
     * Obtener estadísticas de una herramienta
     */
    static async getEstadisticas(id: string) {
        const [herramientaRaw, tareas, transacciones] = await Promise.all([
            prisma.herramientaAI.findUnique({ where: { id } }),
            prisma.tarea.findMany(),
            prisma.transaccion.findMany({
                where: {
                    herramienta_ai_id: id,
                    tipo_transaccion: 'GASTO',
                    estado: 'PAGADO',
                },
            }),
        ]);

        if (!herramientaRaw) {
            throw new Error('Herramienta AI no encontrada');
        }

        const herramienta = transformHerramienta(herramientaRaw);

        // Usamos as any y convertimos a tipos compatibles para formulas
        const herramientaActualizada = formulas.actualizarHerramientaConRollups(
            herramienta as any,
            tareas as any,
            transacciones as any
        );

        // Calcular ROI
        // Asegurar que usamos number
        const costoTotal = Number(herramientaActualizada.costo_total_gastado || 0);
        const tiempoAhorrado = Number(herramienta.tiempo_ahorrado_estimado || 0);
        const valorHora = 50; // USD por hora (configurable)
        const valorGenerado = tiempoAhorrado * valorHora;
        const roi = costoTotal > 0 ? ((valorGenerado - costoTotal) / costoTotal) * 100 : 0;

        // Proyectos únicos (si la propiedad no existe, default a 0)
        const proyectosUnicos = (herramientaActualizada as any).proyectos_usada?.length || 0;

        // Uso promedio por mes
        const fechaSuscripcion = herramienta.fecha_suscripcion ? new Date(herramienta.fecha_suscripcion) : null;
        const mesesDesdeCreacion = fechaSuscripcion
            ? Math.max(
                1,
                Math.ceil(
                    (Date.now() - fechaSuscripcion.getTime()) / (1000 * 60 * 60 * 24 * 30)
                )
            )
            : 1;

        const vecesUsada = Number(herramientaActualizada.veces_usada || 0);
        const usoPorMes = vecesUsada / mesesDesdeCreacion;

        return {
            herramienta_id: id,
            nombre: herramienta.nombre,
            veces_usada: vecesUsada,
            proyectos_usada: proyectosUnicos,
            costo_total_gastado: costoTotal,
            costo_promedio_uso: vecesUsada > 0
                ? costoTotal / vecesUsada
                : 0,
            tiempo_ahorrado_horas: tiempoAhorrado,
            valor_generado: valorGenerado,
            roi_porcentaje: Math.round(roi),
            uso_promedio_mes: Math.round(usoPorMes),
            activa: herramienta.estado_suscripcion === 'ACTIVA',
            fecha_proxima_renovacion: herramienta.fecha_renovacion,
        };
    }

    /**
     * Obtener estadísticas globales de todas las herramientas
     */
    static async getEstadisticasGlobales() {
        // Traer todas
        const herramientasRaw = await prisma.herramientaAI.findMany();
        const herramientas = herramientasRaw.map(transformHerramienta);

        const transacciones = await prisma.transaccion.findMany({
            where: {
                tipo_transaccion: 'GASTO',
                estado: 'PAGADO',
                herramienta_ai_id: { not: null },
            },
        });

        const totalHerramientas = herramientas.length;
        const herramientasActivas = herramientas.filter(
            (h: any) => h.estado_suscripcion === 'ACTIVA'
        ).length;

        const costoTotalMensual = herramientas
            .filter((h: any) => h.estado_suscripcion === 'ACTIVA')
            .reduce((sum: number, h: any) => sum + Number(h.costo_mensual || 0), 0);

        const herramientaMasUsada = formulas.obtenerHerramientaMasUsada(herramientas as any);

        // Top 5 por uso
        const topPorUso = [...herramientas]
            .sort((a: any, b: any) => b.veces_usada - a.veces_usada)
            .slice(0, 5)
            .map((h: any) => ({
                id: h.id,
                nombre: h.nombre,
                veces_usada: h.veces_usada,
                costo_mensual: Number(h.costo_mensual),
            }));

        // Top 5 por costo
        const topPorCosto = [...herramientas]
            .sort((a: any, b: any) => Number(b.costo_total_gastado) - Number(a.costo_total_gastado))
            .slice(0, 5)
            .map((h: any) => ({
                id: h.id,
                nombre: h.nombre,
                costo_total: Number(h.costo_total_gastado),
            }));

        // ROI promedio
        const herramientasConROI = herramientas.filter(
            (h: any) => h.tiempo_ahorrado_estimado && Number(h.costo_total_gastado) > 0
        );
        const valorHora = 50;
        const roiPromedio = herramientasConROI.length > 0
            ? herramientasConROI.reduce((sum: number, h: any) => {
                const valorGenerado = (h.tiempo_ahorrado_estimado || 0) * valorHora;
                const costo = Number(h.costo_total_gastado);
                const roi = ((valorGenerado - costo) / costo) * 100;
                return sum + roi;
            }, 0) / herramientasConROI.length
            : 0;

        return {
            total_herramientas: totalHerramientas,
            herramientas_activas: herramientasActivas,
            costo_mensual_total: Math.round(costoTotalMensual),
            herramienta_mas_usada: herramientaMasUsada
                ? {
                    nombre: herramientaMasUsada.nombre,
                    veces_usada: herramientaMasUsada.veces_usada,
                }
                : null,
            top_por_uso: topPorUso,
            top_por_costo: topPorCosto,
            roi_promedio: Math.round(roiPromedio),
            total_gastado: Math.round(
                transacciones.reduce((sum, t) => sum + Number(t.monto), 0)
            ),
        };
    }

    /**
     * Vincular alternativa
     */
    static async vincularAlternativa(data: VincularAlternativaInput) {
        await prisma.alternativaAI.create({
            data: {
                herramienta_origen_id: data.herramienta_id, // Corregido nombres de campos
                herramienta_destino_id: data.alternativa_id,
            } as any, // Cast a any por discrepancia de tipos si existe
        });
    }

    /**
     * Desvincular alternativa
     */
    static async desvincularAlternativa(herramientaId: string, alternativaId: string) {
        await prisma.alternativaAI.deleteMany({
            where: {
                herramienta_origen_id: herramientaId,
                herramienta_destino_id: alternativaId,
            },
        });
    }

    // ... getRecomendaciones y toggleFavorita se mantienen igual ...
    /**
     * Obtener recomendaciones de herramientas
     * Basado en el proyecto y sus necesidades
     */
    static async getRecomendaciones(proyectoId: string) {
        // Obtener tipo de proyecto
        const proyecto = await prisma.proyecto.findUnique({
            where: { id: proyectoId },
        });

        if (!proyecto) {
            throw new Error('Proyecto no encontrado');
        }

        // Mapeo de tipo de proyecto a categorías AI recomendadas
        const categoriasRecomendadas: Record<string, string[]> = {
            EBOOK: ['TEXTO', 'IMAGEN', 'ANALISIS'], // CHAT removido si no existe en enum
            CURSO_ONLINE: ['VIDEO', 'AUDIO', 'TEXTO', 'IMAGEN'],
            JUEGO_LUDICO: ['IMAGEN', 'AUDIO', 'CODIGO'],
            APP: ['CODIGO', 'IMAGEN', 'ANALISIS'],
        };

        const categorias = categoriasRecomendadas[proyecto.tipo_activo] || [];

        // Traer todas las activas y filtrar en memoria por categoria
        // Esto es necesario porque sqlite no soporta array contains well
        const herramientasRaw = await prisma.herramientaAI.findMany({
            where: {
                activa: true,
            },
            orderBy: [{ rating: 'desc' }, { veces_usada: 'desc' }],
            // No limitamos aquí con take, filtramos primero
        });

        const herramientas = herramientasRaw.map(transformHerramienta);

        const recomendadas = herramientas.filter((h: any) =>
            h.categoria.some((c: string) => categorias.includes(c))
        ).slice(0, 10);

        return recomendadas;
    }

    /**
     * Toggle favorita
     */
    static async toggleFavorita(id: string): Promise<HerramientaAI> {
        const herramienta = await prisma.herramientaAI.findUnique({
            where: { id },
        });

        if (!herramienta) {
            throw new Error('Herramienta AI no encontrada');
        }

        const updated = await prisma.herramientaAI.update({
            where: { id },
            data: {
                favorita: !herramienta.favorita,
            },
        });

        return transformHerramienta(updated);
    }
}

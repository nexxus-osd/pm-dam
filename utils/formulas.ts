// ============================================================
// 🧮 FÓRMULAS Y ROLLUPS - IMPLEMENTACIÓN
// Sistema PM/DAM - Cálculos en Tiempo Real
// ============================================================

import type {
    Proyecto,
    Tarea,
    Transaccion,
    ActivoDigital,
    HerramientaAI,
    Percentage,
    Currency,
    EstadoTarea,
} from './database.types';

// Helper para convertir Decimal a number
function toNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (value === null || value === undefined) return 0;
    return Number(value);
}

// ============================================================
// HELPERS GENÉRICOS
// ============================================================

/**
 * Redondear a 2 decimales
 */
function round(num: number): number {
    return Math.round(num * 100) / 100;
}

/**
 * Calcular porcentaje
 */
function calcularPorcentaje(parte: number, total: number): Percentage {
    if (total === 0) return 0;
    return round((parte / total) * 100);
}

// ============================================================
// DB 1: PROYECTOS - CÁLCULOS
// ============================================================

/**
 * Calcular progreso total del proyecto basado en tareas
 */
export function calcularProgresoProyecto(tareas: Tarea[]): Percentage {
    if (tareas.length === 0) return 0;

    const tareasCompletadas = tareas.filter(
        (t) => t.estado === 'COMPLETADO'
    ).length;

    return calcularPorcentaje(tareasCompletadas, tareas.length);
}

/**
 * Calcular progreso ponderado (considera subtareas)
 */
export function calcularProgresoPonderado(tareas: Tarea[]): Percentage {
    if (tareas.length === 0) return 0;

    let progresoTotal = 0;

    tareas.forEach((tarea) => {
        if (tarea.total_subtareas > 0) {
            // Si tiene subtareas, usa su progreso
            progresoTotal += tarea.progreso_subtareas;
        } else {
            // Si no tiene subtareas, 0% o 100%
            progresoTotal += tarea.estado === 'COMPLETADO' ? 100 : 0;
        }
    });

    return round(progresoTotal / tareas.length);
}

/**
 * Contar tareas por estado
 */
export function contarTareasPorEstado(
    tareas: Tarea[]
): Record<EstadoTarea, number> {
    return tareas.reduce(
        (acc, tarea) => {
            const estado = tarea.estado as EstadoTarea;
            acc[estado] = (acc[estado] || 0) + 1;
            return acc;
        },
        {} as Record<EstadoTarea, number>
    );
}

/**
 * Calcular balance financiero
 */
export function calcularBalanceFinanciero(
    presupuesto: Currency,
    transacciones: Transaccion[]
): {
    gastos_acumulados: Currency;
    ingresos_totales: Currency;
    balance_restante: Currency;
} {
    const gastos = transacciones
        .filter((t) => t.tipo_transaccion === 'GASTO' && t.estado === 'PAGADO')
        .reduce((sum, t) => sum + toNumber(t.monto), 0);

    const ingresos = transacciones
        .filter((t) => t.tipo_transaccion === 'INGRESO' && t.estado === 'PAGADO')
        .reduce((sum, t) => sum + toNumber(t.monto), 0);

    return {
        gastos_acumulados: round(gastos),
        ingresos_totales: round(ingresos),
        balance_restante: round(presupuesto - gastos),
    };
}

/**
 * Calcular ROI preliminar
 */
export function calcularROI(
    ingresos_estimados: Currency,
    gastos_acumulados: Currency
): Percentage {
    if (gastos_acumulados === 0) return 0;

    const roi = ((ingresos_estimados - gastos_acumulados) / gastos_acumulados) * 100;
    return round(roi);
}

/**
 * Calcular costo total de herramientas AI
 */
export function calcularCostoAI(
    tareas: Tarea[],
    herramientas: HerramientaAI[]
): Currency {
    // Obtener IDs únicos de herramientas usadas
    const herramientasUsadas = new Set<string>();

    tareas.forEach((tarea) => {
        // Asegurarse de que herramientas_ai sea un array antes de iterar
        const herramientasAi = Array.isArray(tarea.herramientas_ai) ? tarea.herramientas_ai : [];
        herramientasAi.forEach((id: string) => herramientasUsadas.add(id));
    });

    // Sumar costos
    let costoTotal = 0;
    herramientasUsadas.forEach((id) => {
        const herramienta = herramientas.find((h) => h.id === id);
        if (herramienta?.costo_mensual) {
            costoTotal += toNumber(herramienta.costo_mensual);
        }
    });

    return round(costoTotal);
}

/**
 * Actualizar proyecto con todos los rollups
 */
export function actualizarProyectoConRollups(
    proyecto: Proyecto,
    tareas: Tarea[],
    transacciones: Transaccion[],
    activos: ActivoDigital[],
    herramientas: HerramientaAI[]
): Partial<Proyecto> {
    const conteos = contarTareasPorEstado(tareas);
    const { gastos_acumulados, ingresos_totales, balance_restante } =
        calcularBalanceFinanciero(toNumber(proyecto.presupuesto_asignado), transacciones);

    return {
        // Progreso
        total_tareas: tareas.length,
        tareas_completadas: conteos['COMPLETADO'] || 0,
        tareas_en_progreso: conteos['EN_PROGRESO'] || 0,
        tareas_bloqueadas: conteos['BLOQUEADO'] || 0,
        progreso_total: calcularProgresoPonderado(tareas),
        // Finanzas
        gastos_acumulados: gastos_acumulados as any,
        ingresos_totales: ingresos_totales as any,
        balance_restante: balance_restante as any,
        roi_preliminar: calcularROI(toNumber(proyecto.ingresos_estimados), gastos_acumulados),
        // Activos
        activos_generados: activos.length,
        // AI
        costo_ai_total: calcularCostoAI(tareas, herramientas) as any,
    };
}

// ============================================================
// DB 2: TAREAS - CÁLCULOS
// ============================================================

/**
 * Calcular progreso de subtareas
 */
export function calcularProgresoSubtareas(subtareas: Tarea[]): Percentage {
    return calcularProgresoProyecto(subtareas);
}

/**
 * Calcular eficiencia de tiempo
 */
export function calcularEficienciaTiempo(
    tiempo_estimado?: number | null,
    tiempo_real?: number | null
): Percentage | undefined {
    if (!tiempo_estimado || !tiempo_real || tiempo_real === 0) return undefined;

    return calcularPorcentaje(tiempo_estimado, tiempo_real);
}

/**
 * Calcular costo de AI de una tarea
 */
export function calcularCostoAITarea(
    tarea: Tarea,
    herramientas: HerramientaAI[]
): Currency {
    let costo = 0;

    // Asegurarse de que herramientas_ai sea un array antes de iterar
    const herramientasAi = Array.isArray(tarea.herramientas_ai) ? tarea.herramientas_ai : [];
    herramientasAi.forEach((herramientaId: string) => {
        const herramienta = herramientas.find((h) => h.id === herramientaId);
        if (herramienta?.costo_mensual) {
            costo += toNumber(herramienta.costo_mensual);
        } else if (herramienta?.costo_por_uso) {
            costo += toNumber(herramienta.costo_por_uso);
        }
    });

    return round(costo);
}

/**
 * Verificar si una tarea está bloqueada por dependencias
 */
export function verificarDependenciasBloqueadas(
    tarea: Tarea,
    todasTareas: Tarea[]
): boolean {
    // Asegurarse de que dependencias_ids sea un array antes de acceder a su longitud
    const dependenciasIds = Array.isArray(tarea.dependencias_ids) ? tarea.dependencias_ids : [];
    if (dependenciasIds.length === 0) return false;

    return dependenciasIds.some((depId: string) => {
        const dependencia = todasTareas.find((t) => t.id === depId);
        return dependencia?.estado !== 'COMPLETADO';
    });
}

/**
 * Actualizar tarea con rollups
 */
export function actualizarTareaConRollups(
    tarea: Tarea,
    subtareas: Tarea[],
    herramientas: HerramientaAI[]
): Partial<Tarea> {
    return {
        total_subtareas: subtareas.length,
        subtareas_completadas: subtareas.filter((s) => s.estado === 'COMPLETADO').length,
        progreso_subtareas: calcularProgresoSubtareas(subtareas),
        costo_ai: calcularCostoAITarea(tarea, herramientas) as any,
        eficiencia: calcularEficienciaTiempo(tarea.tiempo_estimado, tarea.tiempo_real) ?? null,
    };
}

// ============================================================
// DB 4: INVENTARIO ACTIVOS - CÁLCULOS
// ============================================================

/**
 * Calcular espacio total usado por activos (en MB)
 */
export function calcularEspacioTotal(activos: ActivoDigital[]): number {
    const totalMB = activos.reduce((sum, activo) => sum + activo.tamano, 0);
    return round(totalMB);
}

/**
 * Calcular espacio en GB
 */
export function calcularEspacioEnGB(activos: ActivoDigital[]): number {
    return round(calcularEspacioTotal(activos) / 1024);
}

/**
 * Agrupar activos por tipo
 */
export function agruparActivosPorTipo(activos: ActivoDigital[]) {
    return activos.reduce(
        (acc, activo) => {
            acc[activo.tipo_activo] = (acc[activo.tipo_activo] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );
}

/**
 * Obtener activos más usados
 */
export function obtenerActivosMasUsados(
    activos: ActivoDigital[],
    limite: number = 10
): ActivoDigital[] {
    return [...activos]
        .sort((a, b) => b.veces_usado - a.veces_usado)
        .slice(0, limite);
}

// ============================================================
// DB 5: FINANZAS - CÁLCULOS Y ANÁLISIS
// ============================================================

/**
 * Calcular gastos por categoría
 */
export function calcularGastosPorCategoria(transacciones: Transaccion[]) {
    const gastos = transacciones.filter(
        (t) => t.tipo_transaccion === 'GASTO' && t.estado === 'PAGADO'
    );

    return gastos.reduce(
        (acc, transaccion) => {
            acc[transaccion.categoria] =
                (acc[transaccion.categoria] || 0) + toNumber(transaccion.monto);
            return acc;
        },
        {} as Record<string, Currency>
    );
}

/**
 * Calcular proyección mensual de gastos recurrentes
 */
export function calcularProyeccionMensual(transacciones: Transaccion[]): Currency {
    const gastosRecurrentes = transacciones.filter(
        (t) =>
            t.tipo_transaccion === 'GASTO' &&
            t.recurrente &&
            t.estado === 'PAGADO'
    );

    let totalMensual = 0;

    gastosRecurrentes.forEach((gasto) => {
        const monto = toNumber(gasto.monto);
        switch (gasto.frecuencia) {
            case 'MENSUAL':
                totalMensual += monto;
                break;
            case 'TRIMESTRAL':
                totalMensual += monto / 3;
                break;
            case 'ANUAL':
                totalMensual += monto / 12;
                break;
        }
    });

    return round(totalMensual);
}

/**
 * Calcular burn rate (tasa de quemado de presupuesto)
 */
export function calcularBurnRate(
    transacciones: Transaccion[],
    fecha_inicio: Date
): Currency {
    const gastosOrdenados = transacciones
        .filter((t) => t.tipo_transaccion === 'GASTO' && t.estado === 'PAGADO')
        .sort((a, b) => a.fecha_transaccion.getTime() - b.fecha_transaccion.getTime());

    if (gastosOrdenados.length === 0) return 0;

    const totalGastado = gastosOrdenados.reduce((sum, t) => sum + toNumber(t.monto), 0);
    const mesesTranscurridos =
        (Date.now() - fecha_inicio.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (mesesTranscurridos === 0) return 0;

    return round(totalGastado / mesesTranscurridos);
}

/**
 * Calcular runway (tiempo restante con presupuesto actual)
 */
export function calcularRunway(
    balance_restante: Currency,
    burn_rate: Currency
): number {
    if (burn_rate === 0) return Infinity;
    return round(balance_restante / burn_rate);
}

// ============================================================
// DB E: AI DIRECTORY - CÁLCULOS Y ESTADÍSTICAS
// ============================================================

/**
 * Calcular veces que se usó una herramienta
 */
export function contarUsoHerramienta(
    herramienta_id: string,
    tareas: Tarea[]
): number {
    return tareas.filter((t) => {
        // Asegurarse de que herramientas_ai sea un array antes de usar includes
        const herramientasAi = Array.isArray(t.herramientas_ai) ? t.herramientas_ai : [];
        return herramientasAi.includes(herramienta_id);
    }).length;
}

/**
 * Obtener proyectos únicos donde se usó una herramienta
 */
export function obtenerProyectosHerramienta(
    herramienta_id: string,
    tareas: Tarea[]
): string[] {
    const proyectos = new Set<string>();

    tareas.forEach((tarea) => {
        // Asegurarse de que herramientas_ai sea un array antes de usar includes
        const herramientasAi = Array.isArray(tarea.herramientas_ai) ? tarea.herramientas_ai : [];
        if (herramientasAi.includes(herramienta_id)) {
            proyectos.add(tarea.proyecto_id);
        }
    });

    return Array.from(proyectos);
}

/**
 * Calcular gasto total en una herramienta
 */
export function calcularGastoTotalHerramienta(
    herramienta_id: string,
    transacciones: Transaccion[]
): Currency {
    const gastos = transacciones.filter(
        (t) =>
            t.herramienta_ai_id === herramienta_id &&
            t.tipo_transaccion === 'GASTO' &&
            t.estado === 'PAGADO'
    );

    return round(gastos.reduce((sum, t) => sum + toNumber(t.monto), 0));
}

/**
 * Actualizar herramienta AI con rollups
 */
export function actualizarHerramientaConRollups(
    herramienta: HerramientaAI,
    tareas: Tarea[],
    transacciones: Transaccion[]
): Partial<HerramientaAI> {
    return {
        veces_usada: contarUsoHerramienta(herramienta.id, tareas),
        costo_total_gastado: calcularGastoTotalHerramienta(
            herramienta.id,
            transacciones
        ) as any,
    };
}

/**
 * Obtener herramienta más usada
 */
export function obtenerHerramientaMasUsada(
    herramientas: HerramientaAI[]
): HerramientaAI | null {
    if (herramientas.length === 0) return null;

    return herramientas.reduce((prev, current) =>
        current.veces_usada > prev.veces_usada ? current : prev
    );
}

// ============================================================
// MÉTRICAS GLOBALES Y DASHBOARDS
// ============================================================

/**
 * Calcular salud del proyecto
 */
export function calcularSaludProyecto(
    proyecto: Proyecto,
    tareas: Tarea[]
): 'Saludable' | 'En Riesgo' | 'Crítico' {
    const diasRestantes =
        (proyecto.fecha_deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    const progresoEsperado =
        ((Date.now() - proyecto.fecha_inicio.getTime()) /
            (proyecto.fecha_deadline.getTime() - proyecto.fecha_inicio.getTime())) *
        100;
    const retrasoProgreso = progresoEsperado - proyecto.progreso_total;
    const tareasVencidas = tareas.filter(
        (t) =>
            t.fecha_vencimiento &&
            t.fecha_vencimiento < new Date() &&
            t.estado !== 'COMPLETADO'
    ).length;
    const excesoPresupuesto =
        toNumber(proyecto.gastos_acumulados) > toNumber(proyecto.presupuesto_asignado);

    // Crítico
    if (
        diasRestantes < 7 && proyecto.progreso_total < 80 ||
        retrasoProgreso > 30 ||
        tareasVencidas > 5 ||
        excesoPresupuesto && toNumber(proyecto.balance_restante) < 0
    ) {
        return 'Crítico';
    }

    // En Riesgo
    if (
        diasRestantes < 14 && proyecto.progreso_total < 60 ||
        retrasoProgreso > 15 ||
        tareasVencidas > 2 ||
        toNumber(proyecto.balance_restante) < toNumber(proyecto.presupuesto_asignado) * 0.1
    ) {
        return 'En Riesgo';
    }

    // Saludable
    return 'Saludable';
}

/**
 * Calcular tendencia de progreso
 */
export function calcularTendenciaProgreso(
    historial: Array<{ fecha: Date; progreso: Percentage }>
): 'Mejorando' | 'Estable' | 'Empeorando' {
    if (historial.length < 2) return 'Estable';

    const ultimos = historial.slice(-5); // Últimos 5 registros
    let tendencia = 0;

    for (let i = 1; i < ultimos.length; i++) {
        const actual = ultimos[i];
        const anterior = ultimos[i - 1];
        if (actual && anterior) {
            const diff = actual.progreso - anterior.progreso;
            tendencia += diff;
        }
    }

    const promedioDiff = tendencia / (ultimos.length - 1);

    if (promedioDiff > 2) return 'Mejorando';
    if (promedioDiff < -2) return 'Empeorando';
    return 'Estable';
}

/**
 * Calcular eficiencia global del presupuesto
 */
export function calcularEficienciaPresupuesto(
    presupuesto: Currency,
    gastado: Currency,
    progreso: Percentage
): Percentage {
    if (presupuesto === 0) return 0;

    const porcentajeGastado = (gastado / presupuesto) * 100;

    // Eficiencia = progreso logrado vs presupuesto gastado
    // Si gastamos 50% y logramos 50% = 100% eficiente
    // Si gastamos 50% y logramos 75% = 150% eficiente
    // Si gastamos 75% y logramos 50% = 66% eficiente

    if (porcentajeGastado === 0) return progreso > 0 ? 100 : 0;

    return round((progreso / porcentajeGastado) * 100);
}

/**
 * Generar resumen financiero global
 */
export function generarResumenFinanciero(
    proyectos: Proyecto[],
    transacciones: Transaccion[]
) {
    const proyectosActivos = proyectos.filter(
        (p) => p.estado === 'EN_PROGRESO' || p.estado === 'PLANEANDO'
    );

    const presupuestoTotal = proyectos.reduce(
        (sum, p) => sum + toNumber(p.presupuesto_asignado),
        0
    );
    const gastosTotal = transacciones
        .filter((t) => t.tipo_transaccion === 'GASTO' && t.estado === 'PAGADO')
        .reduce((sum, t) => sum + toNumber(t.monto), 0);
    const ingresosTotal = transacciones
        .filter((t) => t.tipo_transaccion === 'INGRESO' && t.estado === 'PAGADO')
        .reduce((sum, t) => sum + toNumber(t.monto), 0);

    const gastosPorCategoria = calcularGastosPorCategoria(transacciones);
    const topGastos = Object.entries(gastosPorCategoria)
        .map(([categoria, monto]) => ({
            categoria,
            monto: monto as number,
            porcentaje: calcularPorcentaje(monto as number, gastosTotal),
        }))
        .sort((a, b) => (b.monto as number) - (a.monto as number))
        .slice(0, 5);

    return {
        total_proyectos_activos: proyectosActivos.length,
        presupuesto_total: round(presupuestoTotal),
        gastos_totales: round(gastosTotal),
        ingresos_totales: round(ingresosTotal),
        balance_global: round(presupuestoTotal - gastosTotal + ingresosTotal),
        roi_promedio: calcularROI(ingresosTotal, gastosTotal),
        top_gastos: topGastos,
        proyecciones_mensuales: calcularProyeccionMensual(transacciones),
    };
}

// ============================================================
// EXPORTACIONES
// ============================================================

export const formulas = {
    // Proyectos
    calcularProgresoProyecto,
    calcularProgresoPonderado,
    calcularBalanceFinanciero,
    calcularROI,
    calcularCostoAI,
    actualizarProyectoConRollups,
    calcularSaludProyecto,
    calcularEficienciaPresupuesto,
    // Tareas
    calcularProgresoSubtareas,
    calcularEficienciaTiempo,
    calcularCostoAITarea,
    actualizarTareaConRollups,
    verificarDependenciasBloqueadas,
    // Activos
    calcularEspacioTotal,
    calcularEspacioEnGB,
    agruparActivosPorTipo,
    obtenerActivosMasUsados,
    // Finanzas
    calcularGastosPorCategoria,
    calcularProyeccionMensual,
    calcularBurnRate,
    calcularRunway,
    // AI
    contarUsoHerramienta,
    obtenerProyectosHerramienta,
    calcularGastoTotalHerramienta,
    actualizarHerramientaConRollups,
    obtenerHerramientaMasUsada,
    // Globales
    generarResumenFinanciero,
    calcularTendenciaProgreso,
};
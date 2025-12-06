// ============================================================
// API ROUTE: ESTADÍSTICAS GLOBALES Y RECOMENDACIONES
// GET /api/herramientas-ai/stats - Estadísticas globales
// GET /api/herramientas-ai/recomendaciones?proyecto_id=xxx - Recomendaciones
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { HerramientaAIService } from '@/lib/services/herramienta-ai.service';

/**
 * GET /api/herramientas-ai/stats
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const proyectoId = searchParams.get('proyecto_id');

        if (proyectoId) {
            // Recomendaciones para un proyecto
            const recomendaciones = await HerramientaAIService.getRecomendaciones(proyectoId);
            return NextResponse.json(recomendaciones);
        } else {
            // Estadísticas globales
            const estadisticas = await HerramientaAIService.getEstadisticasGlobales();
            return NextResponse.json(estadisticas);
        }
    } catch (error: any) {
        if (error.message === 'Proyecto no encontrado') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener estadísticas/recomendaciones:', error);
        return NextResponse.json(
            { error: 'Error al obtener estadísticas' },
            { status: 500 }
        );
    }
}

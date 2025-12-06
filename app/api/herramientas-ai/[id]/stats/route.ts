// ============================================================
// API ROUTE: ESTADÍSTICAS DE HERRAMIENTA AI
// GET /api/herramientas-ai/[id]/stats - Estadísticas con ROI
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { HerramientaAIService } from '@/lib/services/herramienta-ai.service';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const estadisticas = await HerramientaAIService.getEstadisticas(params.id);
        return NextResponse.json(estadisticas);
    } catch (error: any) {
        if (error.message === 'Herramienta AI no encontrada') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener estadísticas:', error);
        return NextResponse.json(
            { error: 'Error al obtener estadísticas' },
            { status: 500 }
        );
    }
}

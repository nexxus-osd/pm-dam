// ============================================================
// API ROUTE: ESTADÍSTICAS Y BÚSQUEDAS ESPECIALES
// GET /api/activos/stats - Estadísticas de activos
// GET /api/activos/licencias-expirar - Licencias próximas a expirar
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ActivoDigitalService } from '@/lib/services/activo-digital.service';

/**
 * GET /api/activos/stats?proyecto_id=xxx
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const proyectoId = searchParams.get('proyecto_id') || undefined;

        const estadisticas = await ActivoDigitalService.getEstadisticas(proyectoId);

        return NextResponse.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return NextResponse.json(
            { error: 'Error al obtener estadísticas' },
            { status: 500 }
        );
    }
}

// ============================================================
// API ROUTE: RESUMEN FINANCIERO
// GET /api/finanzas/resumen - Resumen global
// GET /api/finanzas/resumen?proyecto_id=xxx - Resumen de proyecto
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { FinanzaService } from '@/lib/services/finanza.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const proyectoId = searchParams.get('proyecto_id');

        if (proyectoId) {
            // Resumen de un proyecto específico
            const resumen = await FinanzaService.obtenerResumenProyecto(proyectoId);
            return NextResponse.json(resumen);
        } else {
            // Resumen global
            const fechaDesde = searchParams.get('fecha_desde');
            const fechaHasta = searchParams.get('fecha_hasta');

            const filtros = {
                fecha_desde: fechaDesde ? new Date(fechaDesde) : undefined,
                fecha_hasta: fechaHasta ? new Date(fechaHasta) : undefined,
            };

            const resumen = await FinanzaService.obtenerResumenGlobal(filtros);
            return NextResponse.json(resumen);
        }
    } catch (error: any) {
        if (error.message === 'Proyecto no encontrado') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener resumen financiero:', error);
        return NextResponse.json(
            { error: 'Error al obtener resumen financiero' },
            { status: 500 }
        );
    }
}

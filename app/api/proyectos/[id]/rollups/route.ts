// ============================================================
// API ROUTE: ACTUALIZAR ROLLUPS
// POST /api/proyectos/[id]/rollups - Recalcular métricas
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ProyectoService } from '@/lib/services/proyecto.service';

/**
 * POST /api/proyectos/[id]/rollups
 * Forzar recalculo de rollups
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const proyecto = await ProyectoService.actualizarRollups(params.id);

        return NextResponse.json({
            message: 'Rollups actualizados exitosamente',
            proyecto,
        });
    } catch (error: any) {
        if (error.message === 'Proyecto no encontrado') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al actualizar rollups:', error);
        return NextResponse.json(
            { error: 'Error al actualizar rollups' },
            { status: 500 }
        );
    }
}

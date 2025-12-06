// ==================================================================
// API ROUTE: ESTADÍSTICAS Y UTILIDADES DE WORKFLOWS
// GET /api/workflows/stats?id=xxx - Estadísticas de workflow
// GET /api/workflows/stats?populares=true - Workflows populares
// GET /api/workflows/stats?tipo=EBOOK - Por tipo de proyecto
// ==================================================================

import { NextRequest, NextResponse } from 'next/server';
import { WorkflowService } from '@/lib/services/workflow.service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const populares = searchParams.get('populares') === 'true';
        const tipo = searchParams.get('tipo');

        if (id) {
            // Estadísticas de un workflow específico
            const estadisticas = await WorkflowService.getEstadisticas(id);
            return NextResponse.json(estadisticas);
        }

        if (populares) {
            // Workflows más populares
            const limite = parseInt(searchParams.get('limite') || '5');
            const workflows = await WorkflowService.getPopulares(limite);
            return NextResponse.json(workflows);
        }

        if (tipo) {
            // Workflows por tipo de proyecto
            const workflows = await WorkflowService.getPorTipoProyecto(tipo);
            return NextResponse.json(workflows);
        }

        return NextResponse.json(
            { error: 'Debes proporcionar id, populares=true, o tipo' },
            { status: 400 }
        );
    } catch (error: any) {
        if (error.message === 'Workflow no encontrado') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener estadísticas:', error);
        return NextResponse.json(
            { error: 'Error al obtener estadísticas' },
            { status: 500 }
        );
    }
}

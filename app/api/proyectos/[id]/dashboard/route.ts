// ============================================================
// API ROUTE: DASHBOARD DEL PROYECTO
// GET /api/proyectos/[id]/dashboard - Obtener dashboard completo
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ProyectoService } from '@/lib/services/proyecto.service';

/**
 * GET /api/proyectos/[id]/dashboard
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const dashboard = await ProyectoService.getDashboard(params.id);
        return NextResponse.json(dashboard);
    } catch (error: any) {
        if (error.message === 'Proyecto no encontrado') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener dashboard:', error);
        return NextResponse.json(
            { error: 'Error al obtener dashboard' },
            { status: 500 }
        );
    }
}

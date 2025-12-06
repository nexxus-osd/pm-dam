// ============================================================
// API ROUTE: TOGGLE FAVORITO
// POST /api/activos/[id]/favorito - Marcar/desmarcar favorito
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ActivoDigitalService } from '@/lib/services/activo-digital.service';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const activo = await ActivoDigitalService.toggleFavorito(params.id);

        return NextResponse.json({
            message: activo.favorito ? 'Marcado como favorito' : 'Desmarcado de favoritos',
            activo,
        });
    } catch (error: any) {
        if (error.message === 'Activo no encontrado') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al marcar favorito:', error);
        return NextResponse.json(
            { error: 'Error al marcar favorito' },
            { status: 500 }
        );
    }
}

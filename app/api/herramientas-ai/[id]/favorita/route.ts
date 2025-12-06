// ============================================================
// API ROUTE: TOGGLE FAVORITA
// POST /api/herramientas-ai/[id]/favorita - Marcar/desmarcar favorita
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { HerramientaAIService } from '@/lib/services/herramienta-ai.service';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const herramienta = await HerramientaAIService.toggleFavorita(params.id);

        return NextResponse.json({
            message: herramienta.favorita ? 'Marcada como favorita' : 'Desmarcada de favoritas',
            herramienta,
        });
    } catch (error: any) {
        if (error.message === 'Herramienta AI no encontrada') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al marcar favorita:', error);
        return NextResponse.json(
            { error: 'Error al marcar favorita' },
            { status: 500 }
        );
    }
}

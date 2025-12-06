// ============================================================
// API ROUTE: OPERACIONES ADICIONALES DE ACTIVOS
// POST /api/activos/[id]/usar - Incrementar contador de uso
// POST /api/activos/[id]/favorito - Toggle favorito
// GET /api/activos/[id]/similares - Buscar similares
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ActivoDigitalService } from '@/lib/services/activo-digital.service';

/**
 * POST /api/activos/[id]/usar
 * Incrementar contador de uso
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const activo = await ActivoDigitalService.incrementarUso(params.id);

        return NextResponse.json({
            message: 'Uso registrado exitosamente',
            activo,
        });
    } catch (error: any) {
        if (error.message === 'Activo no encontrado') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al registrar uso:', error);
        return NextResponse.json(
            { error: 'Error al registrar uso' },
            { status: 500 }
        );
    }
}

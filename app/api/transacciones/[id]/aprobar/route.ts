// ============================================================
// API ROUTE: APROBAR TRANSACCIÓN
// POST /api/transacciones/[id]/aprobar - Aprobar y marcar como pagado
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { FinanzaService } from '@/lib/services/finanza.service';
import { AprobarTransaccionSchema } from '@/lib/validations/transaccion';
import { ZodError } from 'zod';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const data = AprobarTransaccionSchema.parse(body);

        const transaccion = await FinanzaService.aprobar(params.id, data);

        return NextResponse.json({
            message: 'Transacción aprobada exitosamente',
            transaccion,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al aprobar transacción:', error);
        return NextResponse.json(
            { error: 'Error al aprobar transacción' },
            { status: 500 }
        );
    }
}

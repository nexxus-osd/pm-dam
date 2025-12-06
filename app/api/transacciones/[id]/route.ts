// ============================================================
// API ROUTE: TRANSACCIÓN INDIVIDUAL
// GET /api/transacciones/[id] - Obtener transacción
// PUT /api/transacciones/[id] - Actualizar transacción
// DELETE /api/transacciones/[id] - Eliminar transacción
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { FinanzaService } from '@/lib/services/finanza.service';
import { UpdateTransaccionSchema } from '@/lib/validations/transaccion';
import { ZodError } from 'zod';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const transaccion = await FinanzaService.getById(params.id);
        return NextResponse.json(transaccion);
    } catch (error: any) {
        if (error.message === 'Transacción no encontrada') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener transacción:', error);
        return NextResponse.json(
            { error: 'Error al obtener transacción' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const data = UpdateTransaccionSchema.parse({ ...body, id: params.id });

        const transaccion = await FinanzaService.update(params.id, data);

        return NextResponse.json(transaccion);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al actualizar transacción:', error);
        return NextResponse.json(
            { error: 'Error al actualizar transacción' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await FinanzaService.delete(params.id);
        return NextResponse.json({ message: 'Transacción eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar transacción:', error);
        return NextResponse.json(
            { error: 'Error al eliminar transacción' },
            { status: 500 }
        );
    }
}

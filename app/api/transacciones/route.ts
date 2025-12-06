// ============================================================
// API ROUTE: TRANSACCIONES
// GET /api/transacciones - Listar transacciones
// POST /api/transacciones - Crear transacción
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { FinanzaService } from '@/lib/services/finanza.service';
import { CreateTransaccionSchema, FiltrosFinanzasSchema } from '@/lib/validations/transaccion';
import { ZodError } from 'zod';

/**
 * GET /api/transacciones
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filtros = FiltrosFinanzasSchema.parse({
            proyecto_id: searchParams.get('proyecto_id') || undefined,
            tipo_transaccion: searchParams.get('tipo_transaccion')?.split(','),
            categoria: searchParams.get('categoria')?.split(','),
            estado: searchParams.get('estado')?.split(','),
            fecha_desde: searchParams.get('fecha_desde'),
            fecha_hasta: searchParams.get('fecha_hasta'),
            recurrente: searchParams.get('recurrente') === 'true' ? true : undefined,
            page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
            limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
        });

        const result = await FinanzaService.list(filtros);

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Parámetros inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al listar transacciones:', error);
        return NextResponse.json(
            { error: 'Error al listar transacciones' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/transacciones
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = CreateTransaccionSchema.parse(body);

        const transaccion = await FinanzaService.create(data);

        return NextResponse.json(transaccion, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al crear transacción:', error);
        return NextResponse.json(
            { error: 'Error al crear transacción' },
            { status: 500 }
        );
    }
}

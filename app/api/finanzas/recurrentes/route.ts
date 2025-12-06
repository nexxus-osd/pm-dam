// ============================================================
// API ROUTE: TRANSACCIONES RECURRENTES
// GET /api/finanzas/recurrentes - Próximas a vencer
// POST /api/finanzas/recurrentes - Generar próxima transacción
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { FinanzaService } from '@/lib/services/finanza.service';
import { z } from 'zod';

/**
 * GET /api/finanzas/recurrentes?dias=7
 * Obtener transacciones recurrentes próximas a vencer
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const dias = parseInt(searchParams.get('dias') || '7');

        const transacciones = await FinanzaService.obtenerRecurrentesProximas(dias);

        return NextResponse.json(transacciones);
    } catch (error) {
        console.error('Error al obtener recurrentes:', error);
        return NextResponse.json(
            { error: 'Error al obtener transacciones recurrentes' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/finanzas/recurrentes
 * Generar próxima transacción recurrente
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { transaccion_id } = z
            .object({ transaccion_id: z.string().uuid() })
            .parse(body);

        const nuevaTransaccion = await FinanzaService.generarProximaRecurrente(transaccion_id);

        return NextResponse.json({
            message: 'Próxima transacción recurrente generada',
            transaccion: nuevaTransaccion,
        });
    } catch (error: any) {
        if (error.message.includes('no encontrada') || error.message.includes('no es recurrente')) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.error('Error al generar recurrente:', error);
        return NextResponse.json(
            { error: 'Error al generar transacción recurrente' },
            { status: 500 }
        );
    }
}

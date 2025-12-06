// ============================================================
// API ROUTE: HERRAMIENTA AI INDIVIDUAL
// GET /api/herramientas-ai/[id] - Obtener herramienta
// PUT /api/herramientas-ai/[id] - Actualizar herramienta
// DELETE /api/herramientas-ai/[id] - Eliminar herramienta
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { HerramientaAIService } from '@/lib/services/herramienta-ai.service';
import { UpdateHerramientaAISchema } from '@/lib/validations/herramienta-ai';
import { ZodError } from 'zod';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const herramienta = await HerramientaAIService.getById(params.id);
        return NextResponse.json(herramienta);
    } catch (error: any) {
        if (error.message === 'Herramienta AI no encontrada') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener herramienta AI:', error);
        return NextResponse.json(
            { error: 'Error al obtener herramienta AI' },
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
        const data = UpdateHerramientaAISchema.parse({ ...body, id: params.id });

        const herramienta = await HerramientaAIService.update(params.id, data);

        return NextResponse.json(herramienta);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al actualizar herramienta AI:', error);
        return NextResponse.json(
            { error: 'Error al actualizar herramienta AI' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await HerramientaAIService.delete(params.id);
        return NextResponse.json({ message: 'Herramienta AI eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar herramienta AI:', error);
        return NextResponse.json(
            { error: 'Error al eliminar herramienta AI' },
            { status: 500 }
        );
    }
}

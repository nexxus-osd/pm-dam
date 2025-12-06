// ============================================================
// API ROUTE: HERRAMIENTAS AI
// GET /api/herramientas-ai - Listar herramientas
// POST /api/herramientas-ai - Crear herramienta
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { HerramientaAIService } from '@/lib/services/herramienta-ai.service';
import { CreateHerramientaAISchema, FiltrosHerramientasAISchema } from '@/lib/validations/herramienta-ai';
import { ZodError } from 'zod';

/**
 * GET /api/herramientas-ai
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filtros = FiltrosHerramientasAISchema.parse({
            categoria: searchParams.get('categoria')?.split(','),
            tipo_precio: searchParams.get('tipo_precio')?.split(','),
            estado_suscripcion: searchParams.get('estado_suscripcion')?.split(','),
            favorita: searchParams.get('favorita') === 'true' ? true : undefined,
            activa: searchParams.get('activa') === 'true' ? true : undefined,
            tiene_api: searchParams.get('tiene_api') === 'true' ? true : undefined,
            busqueda: searchParams.get('busqueda') || undefined,
            page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
            limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
            orderBy: (searchParams.get('orderBy') as any) || 'nombre',
            order: (searchParams.get('order') as any) || 'asc',
        });

        const result = await HerramientaAIService.list(filtros);

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Parámetros inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al listar herramientas AI:', error);
        return NextResponse.json(
            { error: 'Error al listar herramientas AI' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/herramientas-ai
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = CreateHerramientaAISchema.parse(body);

        const herramienta = await HerramientaAIService.create(data);

        return NextResponse.json(herramienta, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al crear herramienta AI:', error);
        return NextResponse.json(
            { error: 'Error al crear herramienta AI' },
            { status: 500 }
        );
    }
}

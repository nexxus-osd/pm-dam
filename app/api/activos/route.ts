// ============================================================
// API ROUTE: ACTIVOS DIGITALES
// GET /api/activos - Listar activos
// POST /api/activos - Crear activo
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ActivoDigitalService } from '@/lib/services/activo-digital.service';
import { CreateActivoDigitalSchema, FiltrosActivosSchema } from '@/lib/validations/activo-digital';
import { ZodError } from 'zod';

/**
 * GET /api/activos
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filtros = FiltrosActivosSchema.parse({
            proyecto_id: searchParams.get('proyecto_id') || undefined,
            tipo_activo: searchParams.get('tipo_activo')?.split(','),
            categoria: searchParams.get('categoria') || undefined,
            derechos_uso: searchParams.get('derechos_uso')?.split(','),
            licencia: searchParams.get('licencia')?.split(','),
            estado: searchParams.get('estado')?.split(','),
            favorito: searchParams.get('favorito') === 'true' ? true : undefined,
            coleccion: searchParams.get('coleccion') || undefined,
            serie: searchParams.get('serie') || undefined,
            busqueda: searchParams.get('busqueda') || undefined,
            formato: searchParams.get('formato') || undefined,
            page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
            limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
            orderBy: (searchParams.get('orderBy') as any) || 'fecha_creacion',
            order: (searchParams.get('order') as any) || 'desc',
        });

        const result = await ActivoDigitalService.list(filtros);

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Parámetros inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al listar activos:', error);
        return NextResponse.json(
            { error: 'Error al listar activos' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/activos
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = CreateActivoDigitalSchema.parse(body);

        const activo = await ActivoDigitalService.create(data);

        return NextResponse.json(activo, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al crear activo:', error);
        return NextResponse.json(
            { error: 'Error al crear activo' },
            { status: 500 }
        );
    }
}

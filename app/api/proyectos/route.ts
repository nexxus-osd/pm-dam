// ============================================================
// API ROUTE: PROYECTOS
// GET /api/proyectos - Listar proyectos
// POST /api/proyectos - Crear proyecto
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ProyectoService } from '@/lib/services/proyecto.service';
import { CreateProyectoSchema, FiltrosProyectoSchema } from '@/lib/validations/proyecto';
import { ZodError } from 'zod';

/**
 * GET /api/proyectos
 * Listar proyectos con filtros
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Parsear query params
        const filtros = FiltrosProyectoSchema.parse({
            tipo_activo: searchParams.get('tipo_activo')?.split(','),
            estado: searchParams.get('estado')?.split(','),
            prioridad: searchParams.get('prioridad')?.split(','),
            responsable_id: searchParams.get('responsable_id') || undefined,
            busqueda: searchParams.get('busqueda') || undefined,
            page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
            limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
        });

        const result = await ProyectoService.list(filtros);

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Parámetros inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al listar proyectos:', error);
        return NextResponse.json(
            { error: 'Error al listar proyectos' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/proyectos
 * Crear nuevo proyecto
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validar datos
        const data = CreateProyectoSchema.parse(body);

        // Crear proyecto
        const proyecto = await ProyectoService.create(data);

        return NextResponse.json(proyecto, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al crear proyecto:', error);
        return NextResponse.json(
            { error: 'Error al crear proyecto' },
            { status: 500 }
        );
    }
}

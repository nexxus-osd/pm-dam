// ============================================================
// API ROUTE: WORKFLOWS
// GET /api/workflows - Listar workflows
// POST /api/workflows - Crear workflow
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { WorkflowService } from '@/lib/services/workflow.service';
import { CreateWorkflowSchema, FiltrosWorkflowSchema } from '@/lib/validations/workflow';
import { ZodError } from 'zod';

/**
 * GET /api/workflows
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const filtros = FiltrosWorkflowSchema.parse({
            tipo_proyecto: searchParams.get('tipo_proyecto')?.split(','),
            activo: searchParams.get('activo') === 'true' ? true : undefined,
            busqueda: searchParams.get('busqueda') || undefined,
            page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
            limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
        });

        const result = await WorkflowService.list(filtros);

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Parámetros inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al listar workflows:', error);
        return NextResponse.json(
            { error: 'Error al listar workflows' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/workflows
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = CreateWorkflowSchema.parse(body);

        const workflow = await WorkflowService.create(data);

        return NextResponse.json(workflow, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al crear workflow:', error);
        return NextResponse.json(
            { error: 'Error al crear workflow' },
            { status: 500 }
        );
    }
}

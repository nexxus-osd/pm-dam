// ============================================================
// API ROUTE: WORKFLOW INDIVIDUAL
// GET /api/workflows/[id] - Obtener workflow
// PUT /api/workflows/[id] - Actualizar workflow
// DELETE /api/workflows/[id] - Eliminar workflow
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { WorkflowService } from '@/lib/services/workflow.service';
import { UpdateWorkflowSchema } from '@/lib/validations/workflow';
import { ZodError } from 'zod';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const workflow = await WorkflowService.getById(params.id);
        return NextResponse.json(workflow);
    } catch (error: any) {
        if (error.message === 'Workflow no encontrado') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener workflow:', error);
        return NextResponse.json(
            { error: 'Error al obtener workflow' },
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
        const data = UpdateWorkflowSchema.parse({ ...body, id: params.id });

        const workflow = await WorkflowService.update(params.id, data);

        return NextResponse.json(workflow);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al actualizar workflow:', error);
        return NextResponse.json(
            { error: 'Error al actualizar workflow' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await WorkflowService.delete(params.id);
        return NextResponse.json({ message: 'Workflow eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar workflow:', error);
        return NextResponse.json(
            { error: 'Error al eliminar workflow' },
            { status: 500 }
        );
    }
}

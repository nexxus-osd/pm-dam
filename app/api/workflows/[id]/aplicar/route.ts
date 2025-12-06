// ============================================================
// API ROUTE: APLICAR WORKFLOW A PROYECTO
// POST /api/workflows/[id]/aplicar - Aplicar workflow y generar tareas
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { WorkflowService } from '@/lib/services/workflow.service';
import { z } from 'zod';
import { ZodError } from 'zod';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { proyecto_id } = z.object({ proyecto_id: z.string().uuid() }).parse(body);

        const result = await WorkflowService.aplicarAProyecto({
            proyecto_id,
            workflow_id: params.id,
        });

        return NextResponse.json({
            message: `Workflow aplicado exitosamente. Se crearon ${result.tareas_creadas} tareas.`,
            ...result,
        });
    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        if (
            error.message.includes('no encontrado') ||
            error.message.includes('tipo')
        ) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        console.error('Error al aplicar workflow:', error);
        return NextResponse.json(
            { error: 'Error al aplicar workflow' },
            { status: 500 }
        );
    }
}

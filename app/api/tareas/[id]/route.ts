// ============================================================
// API ROUTE: TAREA INDIVIDUAL
// GET /api/tareas/[id] - Obtener tarea
// PUT /api/tareas/[id] - Actualizar tarea
// DELETE /api/tareas/[id] - Eliminar tarea
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { TareaService } from '@/lib/services/tarea.service';
import { UpdateTareaSchema } from '@/lib/validations/tarea';
import { ZodError } from 'zod';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const tarea = await TareaService.getById(params.id);
        return NextResponse.json(tarea);
    } catch (error: any) {
        if (error.message === 'Tarea no encontrada') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener tarea:', error);
        return NextResponse.json(
            { error: 'Error al obtener tarea' },
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
        const data = UpdateTareaSchema.parse({ ...body, id: params.id });

        const tarea = await TareaService.update(params.id, data);

        return NextResponse.json(tarea);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al actualizar tarea:', error);
        return NextResponse.json(
            { error: 'Error al actualizar tarea' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await TareaService.delete(params.id);
        return NextResponse.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        return NextResponse.json(
            { error: 'Error al eliminar tarea' },
            { status: 500 }
        );
    }
}

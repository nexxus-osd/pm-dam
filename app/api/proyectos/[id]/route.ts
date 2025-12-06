// ============================================================
// API ROUTE: PROYECTO INDIVIDUAL
// GET /api/proyectos/[id] - Obtener proyecto
// PUT /api/proyectos/[id] - Actualizar proyecto
// DELETE /api/proyectos/[id] - Eliminar proyecto
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ProyectoService } from '@/lib/services/proyecto.service';
import { UpdateProyectoSchema } from '@/lib/validations/proyecto';
import { ZodError } from 'zod';

/**
 * GET /api/proyectos/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const proyecto = await ProyectoService.getById(params.id);
        return NextResponse.json(proyecto);
    } catch (error: any) {
        if (error.message === 'Proyecto no encontrado') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener proyecto:', error);
        return NextResponse.json(
            { error: 'Error al obtener proyecto' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/proyectos/[id]
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        // Validar datos
        const data = UpdateProyectoSchema.parse({ ...body, id: params.id });

        // Actualizar proyecto
        const proyecto = await ProyectoService.update(params.id, data);

        // Actualizar rollups
        await ProyectoService.actualizarRollups(params.id);

        return NextResponse.json(proyecto);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al actualizar proyecto:', error);
        return NextResponse.json(
            { error: 'Error al actualizar proyecto' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/proyectos/[id]
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await ProyectoService.delete(params.id);
        return NextResponse.json({ message: 'Proyecto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        return NextResponse.json(
            { error: 'Error al eliminar proyecto' },
            { status: 500 }
        );
    }
}

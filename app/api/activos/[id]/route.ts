// ============================================================
// API ROUTE: ACTIVO INDIVIDUAL
// GET /api/activos/[id] - Obtener activo
// PUT /api/activos/[id] - Actualizar activo
// DELETE /api/activos/[id] - Eliminar activo
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { ActivoDigitalService } from '@/lib/services/activo-digital.service';
import { UpdateActivoDigitalSchema } from '@/lib/validations/activo-digital';
import { ZodError } from 'zod';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const activo = await ActivoDigitalService.getById(params.id);
        return NextResponse.json(activo);
    } catch (error: any) {
        if (error.message === 'Activo no encontrado') {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        console.error('Error al obtener activo:', error);
        return NextResponse.json(
            { error: 'Error al obtener activo' },
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
        const data = UpdateActivoDigitalSchema.parse({ ...body, id: params.id });

        const activo = await ActivoDigitalService.update(params.id, data);

        return NextResponse.json(activo);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al actualizar activo:', error);
        return NextResponse.json(
            { error: 'Error al actualizar activo' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await ActivoDigitalService.delete(params.id);
        return NextResponse.json({ message: 'Activo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar activo:', error);
        return NextResponse.json(
            { error: 'Error al eliminar activo' },
            { status: 500 }
        );
    }
}

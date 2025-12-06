// ============================================================
// API ROUTE: TAREAS
// GET /api/tareas - Listar tareas
// POST /api/tareas - Crear tarea
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { TareaService } from '@/lib/services/tarea.service';
import { CreateTareaSchema } from '@/lib/validations/tarea';
import { ZodError } from 'zod';

/**
 * GET /api/tareas?proyecto_id=xxx
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const proyectoId = searchParams.get('proyecto_id');

        if (!proyectoId) {
            return NextResponse.json(
                { error: 'proyecto_id es requerido' },
                { status: 400 }
            );
        }

        const filtros = {
            estado: searchParams.get('estado')?.split(','),
            asignado_a_id: searchParams.get('asignado_a_id') || undefined,
            solo_tareas_principales: searchParams.get('solo_principales') === 'true',
        };

        const tareas = await TareaService.listByProject(proyectoId, filtros);

        return NextResponse.json(tareas);
    } catch (error) {
        console.error('Error al listar tareas:', error);
        return NextResponse.json(
            { error: 'Error al listar tareas' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/tareas
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = CreateTareaSchema.parse(body);

        const tarea = await TareaService.create(data);

        return NextResponse.json(tarea, { status: 201 });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                { error: 'Datos inválidos', details: error.errors },
                { status: 400 }
            );
        }

        console.error('Error al crear tarea:', error);
        return NextResponse.json(
            { error: 'Error al crear tarea' },
            { status: 500 }
        );
    }
}

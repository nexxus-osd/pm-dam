import { NextResponse } from 'next/server';
import { CarpetaService } from '@/lib/services/carpeta.service';

// GET /api/carpetas - Listar todas las carpetas (con filtros opcionales)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const proyectoId = searchParams.get('proyectoId');
    const carpetaPadreId = searchParams.get('carpetaPadreId');

    if (!proyectoId) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro proyectoId' },
        { status: 400 }
      );
    }

    const carpetas = await CarpetaService.getCarpetasByProject(proyectoId, carpetaPadreId || undefined);

    return NextResponse.json(carpetas);
  } catch (error) {
    console.error('Error al obtener carpetas:', error);
    return NextResponse.json(
      { error: 'Error al obtener carpetas' },
      { status: 500 }
    );
  }
}

// POST /api/carpetas - Crear una nueva carpeta
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validación básica
    if (!data.nombre || !data.proyecto_id || !data.creada_por_id) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, proyecto_id, creada_por_id' },
        { status: 400 }
      );
    }

    const carpeta = await CarpetaService.createCarpeta(data);

    return NextResponse.json(carpeta, { status: 201 });
  } catch (error) {
    console.error('Error al crear carpeta:', error);
    return NextResponse.json(
      { error: 'Error al crear carpeta' },
      { status: 500 }
    );
  }
}
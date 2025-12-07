import { NextResponse } from 'next/server';
import { CarpetaService } from '@/lib/services/carpeta.service';

// GET /api/carpetas/[id] - Obtener una carpeta por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de carpeta es requerido' },
        { status: 400 }
      );
    }

    const carpeta = await CarpetaService.getCarpetaById(id);

    return NextResponse.json(carpeta);
  } catch (error: any) {
    console.error('Error al obtener carpeta:', error);
    
    if (error.message === 'Carpeta no encontrada') {
      return NextResponse.json(
        { error: 'Carpeta no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al obtener carpeta' },
      { status: 500 }
    );
  }
}

// PUT /api/carpetas/[id] - Actualizar una carpeta
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID de carpeta es requerido' },
        { status: 400 }
      );
    }

    const carpeta = await CarpetaService.updateCarpeta(id, data);

    return NextResponse.json(carpeta);
  } catch (error) {
    console.error('Error al actualizar carpeta:', error);
    return NextResponse.json(
      { error: 'Error al actualizar carpeta' },
      { status: 500 }
    );
  }
}

// DELETE /api/carpetas/[id] - Eliminar una carpeta
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de carpeta es requerido' },
        { status: 400 }
      );
    }

    await CarpetaService.deleteCarpeta(id);

    return NextResponse.json({ message: 'Carpeta eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar carpeta:', error);
    return NextResponse.json(
      { error: 'Error al eliminar carpeta' },
      { status: 500 }
    );
  }
}
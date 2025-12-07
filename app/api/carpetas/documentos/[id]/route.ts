import { NextResponse } from 'next/server';
import { CarpetaService } from '@/lib/services/carpeta.service';

// GET /api/carpetas/documentos/[id] - Obtener un documento por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de documento es requerido' },
        { status: 400 }
      );
    }

    const documento = await CarpetaService.getDocumentoById(id);

    return NextResponse.json(documento);
  } catch (error: any) {
    console.error('Error al obtener documento:', error);
    
    if (error.message === 'Documento no encontrado') {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Error al obtener documento' },
      { status: 500 }
    );
  }
}

// PUT /api/carpetas/documentos/[id] - Actualizar un documento
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de documento es requerido' },
        { status: 400 }
      );
    }
    
    // Para manejar archivos, necesitamos parsear FormData
    const contentType = request.headers.get('content-type') || '';
    
    let data: any = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Manejar FormData (para archivos)
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    } else {
      // Manejar JSON normal
      data = await request.json();
    }

    const documento = await CarpetaService.updateDocumento(id, data);

    return NextResponse.json(documento);
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar documento' },
      { status: 500 }
    );
  }
}

// DELETE /api/carpetas/documentos/[id] - Eliminar un documento
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de documento es requerido' },
        { status: 400 }
      );
    }

    await CarpetaService.deleteDocumento(id);

    return NextResponse.json({ message: 'Documento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    return NextResponse.json(
      { error: 'Error al eliminar documento' },
      { status: 500 }
    );
  }
}
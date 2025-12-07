import { NextResponse } from 'next/server';
import { CarpetaService } from '@/lib/services/carpeta.service';

// GET /api/carpetas/documentos - Listar documentos con filtros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const proyectoId = searchParams.get('proyectoId');
    const carpetaId = searchParams.get('carpetaId');

    if (!proyectoId) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro proyectoId' },
        { status: 400 }
      );
    }

    const documentos = await CarpetaService.getDocumentosByFolderOrProject(proyectoId, carpetaId || undefined);

    return NextResponse.json(documentos);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    return NextResponse.json(
      { error: 'Error al obtener documentos' },
      { status: 500 }
    );
  }
}

// POST /api/carpetas/documentos - Crear un nuevo documento
export async function POST(request: Request) {
  try {
    // Para manejar archivos, necesitamos parsear FormData
    const contentType = request.headers.get('content-type') || '';
    
    let data: any = {};
    
    if (contentType.includes('multipart/form-data')) {
      // Manejar FormData (para archivos)
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
      
      // Manejar archivo si existe
      const archivo = formData.get('archivo');
      if (archivo && archivo instanceof Blob && archivo.size > 0) {
        data.archivo = archivo;
        data.tipo_contenido = 'archivo';
      }
    } else {
      // Manejar JSON normal
      data = await request.json();
    }

    // Validación básica
    if (!data.nombre || !data.proyecto_id || !data.creada_por_id) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, proyecto_id, creada_por_id' },
        { status: 400 }
      );
    }

    const documento = await CarpetaService.createDocumento(data);

    return NextResponse.json(documento, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear documento:', error);
    
    // Manejo específico de errores
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un documento con ese nombre en esta ubicación' },
        { status: 409 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'No se encontró el proyecto o carpeta especificada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Error al crear documento' },
      { status: 500 }
    );
  }
}
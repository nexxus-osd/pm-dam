'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, FileText, Plus, Eye, Edit3, Trash2, File } from "lucide-react";
import { CrearCarpetaDialog } from "@/components/carpetas/crear-carpeta-dialog";
import { CrearDocumentoDialog } from "@/components/carpetas/crear-documento-dialog";
import { EditarCarpetaDialog } from "@/components/carpetas/editar-carpeta-dialog";
import { EditarDocumentoDialog } from "@/components/carpetas/editar-documento-dialog";
import { DocumentoContent } from "@/components/carpetas/documento-content";
import { CarpetaItem } from "@/components/carpetas/carpeta-item";
import { deleteCarpetaAction, deleteDocumentoAction } from "@/app/actions/carpetas";
import { getCarpetasByProjectAction } from "@/app/actions/carpetas";

export default function CarpetasPage() {
  const [carpetas, setCarpetas] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentoView, setDocumentoView] = useState<{ open: boolean; documento: any }>({ open: false, documento: null });
  const [projectId, setProjectId] = useState<string>('');

  // In a real implementation, you would get the project ID from context or route params
  // For now, we'll simulate with a placeholder
  useEffect(() => {
    const fetchCarpetas = async () => {
      try {
        setLoading(true);
        // This would be replaced with actual project ID
        // const result = await getCarpetasByProjectAction(projectId);
        // Simulating data for demonstration
        setCarpetas([]);
        setDocumentos([]);
      } catch (err) {
        console.error("Error al cargar carpetas:", err);
        setError("Error al cargar las carpetas");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchCarpetas();
    }
  }, [projectId]);

  const handleDeleteCarpeta = async (carpetaId: string, carpetaNombre: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la carpeta "${carpetaNombre}" y todo su contenido?`)) {
      return;
    }

    try {
      const result = await deleteCarpetaAction(carpetaId);
      if (!result.success) {
        throw new Error(result.error);
      }
      // Refresh data
      // fetchCarpetas();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la carpeta: " + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const handleDeleteDocumento = async (documentoId: string, documentoNombre: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el documento "${documentoNombre}"?`)) {
      return;
    }

    try {
      const result = await deleteDocumentoAction(documentoId);
      if (!result.success) {
        throw new Error(result.error);
      }
      // Refresh data
      // fetchCarpetas();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el documento: " + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const handleViewDocumento = (documento: any) => {
    setDocumentoView({ open: true, documento });
  };

  if (loading) {
    return <div className="p-8">Cargando...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestión de Carpetas</h1>
          <p className="text-muted-foreground mt-1">
            Organiza y gestiona todas tus carpetas, documentos y archivos.
          </p>
        </div>
        <div className="flex gap-2">
          <CrearCarpetaDialog 
            projectId={projectId} 
            userId="" 
            onCarpetaCreada={() => {}} // Would refresh data
          />
          <CrearDocumentoDialog 
            projectId={projectId} 
            userId="" 
            onDocumentoCreado={() => {}} // Would refresh data
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Carpetas
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {carpetas.length > 0 ? (
            <div className="grid gap-3">
              {carpetas.map((carpeta: any) => (
                <div key={carpeta.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Folder className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">{carpeta.nombre}</span>
                    </div>
                    <div className="flex gap-1">
                      <EditarCarpetaDialog 
                        carpeta={carpeta}
                        onCarpetaActualizada={() => {}} // Would refresh data
                      >
                        <Button variant="ghost" size="sm">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </EditarCarpetaDialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCarpeta(carpeta.id, carpeta.nombre)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {carpeta.descripcion && (
                    <p className="text-sm text-muted-foreground mt-1">{carpeta.descripcion}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span>{carpeta.subcarpetas?.length || 0} subcarpetas</span>
                    <span>{carpeta.documentos?.length || 0} documentos</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-3">
                Aún no hay carpetas creadas.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Crea tu primera carpeta para comenzar a organizar tus documentos.
              </p>
              <CrearCarpetaDialog 
                projectId={projectId} 
                userId="" 
                onCarpetaCreada={() => {}} // Would refresh data
              >
                <Button>
                  <Folder className="h-4 w-4 mr-2" />
                  Crear Carpeta
                </Button>
              </CrearCarpetaDialog>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documentos.length > 0 ? (
            <div className="grid gap-2">
              {documentos.map((documento: any) => (
                <div 
                  key={documento.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  {documento.nombre_archivo ? (
                    // Es un archivo subido
                    <File className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    // Es una nota de texto
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span 
                    className="text-sm truncate cursor-pointer hover:underline"
                    onClick={() => handleViewDocumento(documento)}
                  >
                    {documento.nombre}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {documento.nombre_archivo 
                      ? `${documento.tipo_documento} (${(documento.tamano_archivo / 1024).toFixed(1)} KB)` 
                      : documento.tipo_documento}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleViewDocumento(documento)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <EditarDocumentoDialog 
                      documento={documento}
                      onDocumentoActualizado={() => {}} // Would refresh data
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </EditarDocumentoDialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleDeleteDocumento(documento.id, documento.nombre)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-3">
                Aún no hay documentos creados.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Crea tu primer documento para comenzar.
              </p>
              <CrearDocumentoDialog 
                projectId={projectId} 
                userId="" 
                onDocumentoCreado={() => {}} // Would refresh data
              >
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Crear Documento
                </Button>
              </CrearDocumentoDialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vista previa de documento */}
      {documentoView.open && (
        <DocumentoContent 
          documento={documentoView.documento}
          onClose={() => setDocumentoView({ open: false, documento: null })}
        />
      )}
    </div>
  );
}
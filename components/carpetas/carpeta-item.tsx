'use client';

import { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, Plus, MoreVertical, Trash2, File, Edit3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CrearCarpetaDialog } from './crear-carpeta-dialog';
import { CrearDocumentoDialog } from './crear-documento-dialog';
import { EditarCarpetaDialog } from './editar-carpeta-dialog';
import { EditarDocumentoDialog } from './editar-documento-dialog';
import { DocumentoContent } from './documento-content';
import { deleteCarpetaAction, deleteDocumentoAction } from '@/app/actions/carpetas';

interface CarpetaItemProps {
  carpeta: any;
  projectId: string;
  userId: string;
  nivel: number;
  onRefresh: () => void;
  onCarpetaSeleccionada?: (carpeta: any) => void; // Nueva prop para manejar selección
}

export function CarpetaItem({ carpeta, projectId, userId, nivel, onRefresh, onCarpetaSeleccionada }: CarpetaItemProps) {
  const [expandida, setExpandida] = useState(false);
  const [documentoView, setDocumentoView] = useState<{ open: boolean; documento: any }>({ open: false, documento: null });
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateSubfolderDialog, setShowCreateSubfolderDialog] = useState(false);
  const [showCreateDocumentoDialog, setShowCreateDocumentoDialog] = useState(false);
  const tieneSubcarpetas = carpeta.subcarpetas && carpeta.subcarpetas.length > 0;
  const tieneDocumentos = carpeta.documentos && carpeta.documentos.length > 0;

  // Limitar la indentación máxima para mantener la legibilidad
  const nivelIndentacion = Math.min(nivel, 3);

  const handleDeleteCarpeta = async () => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la carpeta "${carpeta.nombre}" y todo su contenido?`)) {
      return;
    }

    try {
      const result = await deleteCarpetaAction(carpeta.id);
      if (!result.success) {
        throw new Error(result.error);
      }
      onRefresh();
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
      onRefresh();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el documento: " + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const handleViewDocumento = (documento: any) => {
    setDocumentoView({ open: true, documento });
  };

  // Función para manejar la selección de carpeta
  const handleSelectCarpeta = () => {
    if (onCarpetaSeleccionada) {
      onCarpetaSeleccionada(carpeta);
    }
  };

  return (
    <div className="space-y-1">
      {/* Carpeta */}
      <div 
        className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors ${nivelIndentacion > 0 ? `ml-${nivelIndentacion * 4}` : ''}`}
        style={{ marginLeft: nivelIndentacion > 0 ? `${nivelIndentacion * 1}rem` : '0' }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setExpandida(!expandida)}
          disabled={!tieneSubcarpetas && !tieneDocumentos}
        >
          {tieneSubcarpetas || tieneDocumentos ? (
            expandida ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <Folder className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
        
        <Folder 
          className="h-4 w-4 text-muted-foreground cursor-pointer" 
          onClick={handleSelectCarpeta} // Agregar click para seleccionar carpeta
        />
        <span 
          className="text-sm font-medium flex-1 truncate cursor-pointer hover:underline" 
          onClick={handleSelectCarpeta} // Agregar click para seleccionar carpeta
        >
          {carpeta.nombre}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              <div className="flex items-center gap-2 w-full cursor-pointer">
                <Edit3 className="h-4 w-4" />
                Editar Carpeta
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowCreateSubfolderDialog(true)}>
              <div className="flex items-center gap-2 w-full cursor-pointer">
                <Folder className="h-4 w-4" />
                Nueva Subcarpeta
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowCreateDocumentoDialog(true)}>
              <div className="flex items-center gap-2 w-full cursor-pointer">
                <FileText className="h-4 w-4" />
                Nuevo Documento
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteCarpeta} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Carpeta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Diálogos fuera del menú desplegable */}
      <EditarCarpetaDialog 
        carpeta={carpeta}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onCarpetaActualizada={onRefresh}
      />
      
      <CrearCarpetaDialog 
        projectId={projectId}
        userId={userId}
        carpetaPadreId={carpeta.id}
        open={showCreateSubfolderDialog}
        onOpenChange={setShowCreateSubfolderDialog}
        onCarpetaCreada={onRefresh}
      />
      
      <CrearDocumentoDialog 
        projectId={projectId}
        userId={userId}
        carpetaId={carpeta.id}
        open={showCreateDocumentoDialog}
        onOpenChange={setShowCreateDocumentoDialog}
        onDocumentoCreado={onRefresh}
      />

      {/* Contenido expandido */}
      {expandida && (
        <div className="space-y-1">
          {/* Subcarpetas */}
          {carpeta.subcarpetas?.map((subcarpeta: any) => (
            <CarpetaItem
              key={subcarpeta.id}
              carpeta={subcarpeta}
              projectId={projectId}
              userId={userId}
              nivel={nivel + 1}
              onRefresh={onRefresh}
              onCarpetaSeleccionada={onCarpetaSeleccionada} // Pasar la prop hacia abajo
            />
          ))}
          
          {/* Documentos */}
          {carpeta.documentos?.map((documento: any) => (
            <div 
              key={documento.id}
              className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors ml-${(nivelIndentacion + 1) * 4}`}
              style={{ marginLeft: `${(nivelIndentacion + 1) * 1}rem` }}
            >
              <div className="w-6" /> {/* Espacio para alinear con las carpetas */}
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
                  onDocumentoActualizado={onRefresh}
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
      )}
      
      {/* Visualizador de documento */}
      {documentoView.documento && (
        <DocumentoContent
          documento={documentoView.documento}
          open={documentoView.open}
          onOpenChange={(open) => setDocumentoView({ ...documentoView, open })}
        />
      )}
    </div>
  );
}
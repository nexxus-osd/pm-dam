'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, FileUp } from 'lucide-react';

interface DocumentoContentProps {
  documento: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentoContent({ documento, open, onOpenChange }: DocumentoContentProps) {
  const [contenido, setContenido] = useState(documento.contenido || '');
  
  const handleDownload = () => {
    if (documento.nombre_archivo) {
      // En una implementación real, esto descargaría el archivo
      alert(`En una implementación real, esto descargaría el archivo: ${documento.nombre_archivo}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {documento.nombre_archivo ? (
              <FileUp className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            {documento.nombre}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            {documento.descripcion || 'Sin descripción'}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <div className="text-sm">
              <span className="font-medium">Tipo:</span> {documento.tipo_documento}
            </div>
            {documento.nombre_archivo && (
              <div className="text-sm">
                <span className="font-medium">Tamaño:</span> {(documento.tamano_archivo / 1024).toFixed(1)} KB
              </div>
            )}
          </div>
          
          {documento.nombre_archivo ? (
            // Archivo adjunto
            <div className="text-center py-8">
              <FileUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Archivo Adjunto</h3>
              <p className="text-muted-foreground mb-4">
                Este documento contiene un archivo adjunto: {documento.nombre_archivo}
              </p>
              <Button onClick={handleDownload} className="gap-2">
                <Download className="h-4 w-4" />
                Descargar Archivo
              </Button>
            </div>
          ) : (
            // Nota de texto
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Contenido</h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Vista Previa
                </Button>
              </div>
              <div className="border rounded-md p-4 min-h-[200px] whitespace-pre-wrap">
                {contenido || 'Este documento no tiene contenido.'}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
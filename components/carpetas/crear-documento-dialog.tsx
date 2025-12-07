'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateDocumentoSchema } from '@/lib/validations/carpeta';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, Plus, CheckCircle } from 'lucide-react';
import { createDocumentoAction } from '@/app/actions';

interface CrearDocumentoDialogProps {
  projectId: string;
  userId: string;
  carpetaId?: string;
  onDocumentoCreado?: () => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CrearDocumentoDialog({ 
  projectId, 
  userId, 
  carpetaId, 
  onDocumentoCreado, 
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: CrearDocumentoDialogProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setUncontrolledOpen;
  
  const [isLoading, setIsLoading] = useState(false);
  const [tipoContenido, setTipoContenido] = useState<'texto' | 'archivo'>('texto');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(CreateDocumentoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      tipo_documento: 'NOTA',
      contenido: '',
      proyecto_id: projectId,
      carpeta_id: carpetaId,
      creada_por_id: userId,
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setSuccessMessage(null);
      
      // Agregar campos adicionales
      const dataToSend = {
        ...data,
        tipo_contenido: tipoContenido
      };
      
      // Si es un archivo, usar FormData
      let submitData = dataToSend;
      if (tipoContenido === 'archivo' && fileInputRef.current?.files?.[0]) {
        const formData = new FormData();
        // Agregar todos los campos de datos
        Object.keys(dataToSend).forEach(key => {
          if (key !== 'archivo') { // archivo se agrega por separado
            formData.append(key, dataToSend[key]);
          }
        });
        formData.append('archivo', fileInputRef.current.files[0]);
        submitData = formData;
      }
      
      const result = await createDocumentoAction(submitData);
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Mostrar mensaje de éxito
      setSuccessMessage('Documento creado exitosamente');
      
      // Resetear formulario después de un breve retraso
      setTimeout(() => {
        reset();
        if (setOpen) setOpen(false);
        setSuccessMessage(null);
        
        // Llamar callback si existe
        if (onDocumentoCreado) {
          onDocumentoCreado();
        }
      }, 1500);
    } catch (error) {
      console.error(error);
      setSuccessMessage(null);
      alert("Error: " + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isControlled && controlledOnOpenChange) {
        controlledOnOpenChange(isOpen);
      } else {
        setUncontrolledOpen(isOpen);
      }
      
      if (!isOpen) {
        reset();
        setTipoContenido('texto');
        setSuccessMessage(null);
      }
    }}>
      {children ? (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Documento
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Nuevo Documento
          </DialogTitle>
          <DialogDescription>
            Crea una nueva nota o sube un archivo a esta carpeta.
          </DialogDescription>
        </DialogHeader>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre del Documento</Label>
            <Input 
              id="nombre" 
              {...register("nombre")} 
              placeholder="Ej. Resumen del proyecto, Notas de reunión, etc." 
            />
            {errors.nombre && <span className="text-xs text-red-500">{errors.nombre.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea 
              id="descripcion" 
              {...register("descripcion")} 
              placeholder="Describe el contenido de este documento..." 
            />
            {errors.descripcion && <span className="text-xs text-red-500">{errors.descripcion.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Tipo de Contenido</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={tipoContenido === 'texto' ? 'default' : 'outline'}
                  onClick={() => setTipoContenido('texto')}
                  className="flex-1"
                >
                  Nota de Texto
                </Button>
                <Button
                  type="button"
                  variant={tipoContenido === 'archivo' ? 'default' : 'outline'}
                  onClick={() => setTipoContenido('archivo')}
                  className="flex-1"
                >
                  Archivo Externo
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipo_documento">Tipo de Documento</Label>
              <select
                id="tipo_documento"
                {...register("tipo_documento")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="NOTA">Nota</option>
                <option value="DOCUMENTO">Documento</option>
                <option value="PRESENTACION">Presentación</option>
                <option value="HOJA_DE_CALCULO">Hoja de Cálculo</option>
                <option value="IMAGEN">Imagen</option>
                <option value="VIDEO">Video</option>
                <option value="AUDIO">Audio</option>
                <option value="PDF">PDF</option>
                <option value="OTRO">Otro</option>
              </select>
              {errors.tipo_documento && <span className="text-xs text-red-500">{errors.tipo_documento.message}</span>}
            </div>
          </div>

          {tipoContenido === 'texto' ? (
            <div className="grid gap-2">
              <Label htmlFor="contenido">Contenido *</Label>
              <Textarea 
                id="contenido" 
                {...register("contenido")} 
                placeholder="Escribe tu nota aquí..." 
                rows={6}
              />
              {errors.contenido && <span className="text-xs text-red-500">{errors.contenido.message}</span>}
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="archivo">Archivo *</Label>
              <Input 
                id="archivo" 
                type="file"
                ref={fileInputRef}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">Selecciona un archivo para adjuntar</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => {
              if (setOpen) setOpen(false);
            }} disabled={isLoading || !!successMessage}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !!successMessage}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : successMessage ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Creado
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Crear Documento
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
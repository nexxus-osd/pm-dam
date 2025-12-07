'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateDocumentoSchema } from '@/lib/validations/carpeta';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, Edit3 } from 'lucide-react';
import { updateDocumentoAction } from '@/app/actions/carpetas';

interface EditarDocumentoDialogProps {
  documento: any;
  onDocumentoActualizado?: () => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditarDocumentoDialog({ 
  documento,
  onDocumentoActualizado,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: EditarDocumentoDialogProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setUncontrolledOpen;
  
  const [tipoContenido, setTipoContenido] = useState<'texto' | 'archivo'>(
    documento.nombre_archivo ? 'archivo' : 'texto'
  );

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(UpdateDocumentoSchema),
    defaultValues: {
      id: documento.id,
      nombre: documento.nombre,
      descripcion: documento.descripcion || '',
      tipo_documento: documento.tipo_documento,
      contenido: documento.contenido || '',
      proyecto_id: documento.proyecto_id,
      carpeta_id: documento.carpeta_id || undefined,
      creada_por_id: documento.creada_por_id,
    }
  });

  // Actualizar valores cuando cambia el documento
  useEffect(() => {
    if (documento) {
      setValue('id', documento.id);
      setValue('nombre', documento.nombre);
      setValue('descripcion', documento.descripcion || '');
      setValue('tipo_documento', documento.tipo_documento);
      setValue('contenido', documento.contenido || '');
      setValue('proyecto_id', documento.proyecto_id);
      setValue('carpeta_id', documento.carpeta_id || undefined);
      setValue('creada_por_id', documento.creada_por_id);
      setTipoContenido(documento.nombre_archivo ? 'archivo' : 'texto');
    }
  }, [documento, setValue]);

  const onSubmit = async (data: any) => {
    try {
      // Agregar el tipo de contenido para la validación
      const dataToSend = {
        ...data,
        tipo_contenido: tipoContenido
      };
      
      const result = await updateDocumentoAction(dataToSend);
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Resetear formulario
      reset();
      if (setOpen) setOpen(false);
      
      // Llamar callback si existe
      if (onDocumentoActualizado) {
        onDocumentoActualizado();
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit3 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Editar Documento
          </DialogTitle>
          <DialogDescription>
            Modifica la información de este documento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("id")} />
          <input type="hidden" {...register("proyecto_id")} />
          <input type="hidden" {...register("creada_por_id")} />
          {documento.carpeta_id && (
            <input type="hidden" {...register("carpeta_id")} />
          )}

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
                  disabled={!!documento.nombre_archivo}
                >
                  Nota de Texto
                </Button>
                <Button
                  type="button"
                  variant={tipoContenido === 'archivo' ? 'default' : 'outline'}
                  onClick={() => setTipoContenido('archivo')}
                  className="flex-1"
                  disabled={!!documento.nombre_archivo}
                >
                  Archivo Externo
                </Button>
              </div>
              {documento.nombre_archivo && (
                <p className="text-xs text-muted-foreground">
                  Este documento ya tiene un archivo adjunto y no se puede cambiar el tipo.
                </p>
              )}
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

          {tipoContenido === 'texto' && (
            <div className="grid gap-2">
              <Label htmlFor="contenido">Contenido</Label>
              <Textarea 
                id="contenido" 
                {...register("contenido")} 
                placeholder="Escribe el contenido de tu nota aquí..." 
                rows={6}
              />
              {errors.contenido && <span className="text-xs text-red-500">{errors.contenido.message}</span>}
            </div>
          )}

          {documento.nombre_archivo && (
            <div className="grid gap-2 p-3 bg-muted rounded-md">
              <Label>Archivo Adjunto</Label>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{documento.nombre_archivo}</span>
                <span className="text-xs text-muted-foreground">
                  ({(documento.tamano_archivo / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen && setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <FileText className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateCarpetaSchema } from '@/lib/validations/carpeta';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Folder, Loader2, Edit3 } from 'lucide-react';
import { updateCarpetaAction } from '@/app/actions/carpetas';

interface EditarCarpetaDialogProps {
  carpeta: any;
  onCarpetaActualizada?: () => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditarCarpetaDialog({ 
  carpeta,
  onCarpetaActualizada,
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: EditarCarpetaDialogProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(UpdateCarpetaSchema),
    defaultValues: {
      id: carpeta.id,
      nombre: carpeta.nombre,
      descripcion: carpeta.descripcion || '',
      proyecto_id: carpeta.proyecto_id,
      carpeta_padre_id: carpeta.carpeta_padre_id || undefined,
      creada_por_id: carpeta.creada_por_id,
    }
  });

  // Actualizar valores cuando cambia la carpeta
  useEffect(() => {
    if (carpeta) {
      setValue('id', carpeta.id);
      setValue('nombre', carpeta.nombre);
      setValue('descripcion', carpeta.descripcion || '');
      setValue('proyecto_id', carpeta.proyecto_id);
      setValue('carpeta_padre_id', carpeta.carpeta_padre_id || undefined);
      setValue('creada_por_id', carpeta.creada_por_id);
    }
  }, [carpeta, setValue]);

  const onSubmit = async (data: any) => {
    try {
      const result = await updateCarpetaAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Resetear formulario
      reset();
      if (setOpen) setOpen(false);
      
      // Llamar callback si existe
      if (onCarpetaActualizada) {
        onCarpetaActualizada();
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
            <Folder className="h-5 w-5" />
            Editar Carpeta
          </DialogTitle>
          <DialogDescription>
            Modifica la información de esta carpeta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("id")} />
          <input type="hidden" {...register("proyecto_id")} />
          <input type="hidden" {...register("creada_por_id")} />
          {carpeta.carpeta_padre_id && (
            <input type="hidden" {...register("carpeta_padre_id")} />
          )}

          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre de la Carpeta</Label>
            <Input 
              id="nombre" 
              {...register("nombre")} 
              placeholder="Ej. Documentación, Recursos, etc." 
            />
            {errors.nombre && <span className="text-xs text-red-500">{errors.nombre.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea 
              id="descripcion" 
              {...register("descripcion")} 
              placeholder="Describe el propósito de esta carpeta..." 
            />
            {errors.descripcion && <span className="text-xs text-red-500">{errors.descripcion.message}</span>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen && setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Folder className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
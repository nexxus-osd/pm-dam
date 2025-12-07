'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateCarpetaSchema } from '@/lib/validations/carpeta';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Folder, Loader2, Plus } from 'lucide-react';
import { createCarpetaAction } from '@/app/actions';

interface CrearCarpetaDialogProps {
  projectId: string;
  userId: string;
  carpetaPadreId?: string;
  onCarpetaCreada?: () => void;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CrearCarpetaDialog({ 
  projectId, 
  userId, 
  carpetaPadreId, 
  onCarpetaCreada, 
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: CrearCarpetaDialogProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setUncontrolledOpen;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(CreateCarpetaSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      proyecto_id: projectId,
      carpeta_padre_id: carpetaPadreId,
      creada_por_id: userId,
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const result = await createCarpetaAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      
      reset();
      if (setOpen) setOpen(false);
      
      if (onCarpetaCreada) {
        onCarpetaCreada();
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
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Carpeta
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Nueva Carpeta
          </DialogTitle>
          <DialogDescription>
            Crea una nueva carpeta para organizar tus documentos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre de la Carpeta</Label>
            <Input 
              id="nombre" 
              {...register("nombre")} 
              placeholder="Ej. Fases de desarrollo, Recursos, etc." 
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
              Crear Carpeta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
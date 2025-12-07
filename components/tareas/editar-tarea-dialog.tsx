'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateTareaSchema } from '@/lib/validations/tarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Pencil } from 'lucide-react';
import { updateTareaAction } from '@/app/actions/tareas';

interface EditarTareaDialogProps {
  tarea: any;
  onTareaActualizada?: () => void;
  children?: React.ReactNode;
}

export function EditarTareaDialog({ tarea, onTareaActualizada, children }: EditarTareaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(UpdateTareaSchema),
    defaultValues: {
      id: tarea.id,
      nombre: tarea.nombre,
      descripcion: tarea.descripcion || '',
      tipo_tarea: tarea.tipo_tarea,
      estado: tarea.estado,
      prioridad: tarea.prioridad,
      checklist: Array.isArray(tarea.checklist) ? tarea.checklist : [],
      etiquetas: Array.isArray(tarea.etiquetas) ? tarea.etiquetas : [],
      archivos_adjuntos: Array.isArray(tarea.archivos_adjuntos) ? tarea.archivos_adjuntos : [],
    }
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      const result = await updateTareaAction(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Resetear formulario
      setOpen(false);
      
      // Llamar callback si existe
      if (onTareaActualizada) {
        onTareaActualizada();
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  };

  // Opciones para los selects
  const tiposTarea = [
    { value: 'CONTENIDO', label: 'Contenido' },
    { value: 'DISENO', label: 'Diseño' },
    { value: 'DESARROLLO', label: 'Desarrollo' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'REVISION', label: 'Revisión' },
    { value: 'INVESTIGACION', label: 'Investigación' },
    { value: 'OTRO', label: 'Otro' },
  ];

  const prioridades = [
    { value: 'BAJA', label: 'Baja' },
    { value: 'MEDIA', label: 'Media' },
    { value: 'ALTA', label: 'Alta' },
    { value: 'CRITICA', label: 'Crítica' },
  ];

  const estados = [
    { value: 'POR_HACER', label: 'Por hacer' },
    { value: 'EN_PROGRESO', label: 'En progreso' },
    { value: 'EN_REVISION', label: 'En revisión' },
    { value: 'COMPLETADO', label: 'Completado' },
    { value: 'BLOQUEADO', label: 'Bloqueado' },
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        reset();
      }
    }}>
      {children ? (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Tarea</DialogTitle>
          <DialogDescription>
            Modifica los detalles de tu tarea.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre de la Tarea</Label>
            <Input 
              id="nombre" 
              {...register("nombre")} 
              placeholder="Nombre de la tarea" 
            />
            {errors.nombre && <span className="text-xs text-red-500">{errors.nombre.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea 
              id="descripcion" 
              {...register("descripcion")} 
              placeholder="Describe los detalles de la tarea..." 
            />
            {errors.descripcion && <span className="text-xs text-red-500">{errors.descripcion.message}</span>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tipo_tarea">Tipo de Tarea</Label>
              <select
                id="tipo_tarea"
                {...register("tipo_tarea")}
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {tiposTarea.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
              {errors.tipo_tarea && <span className="text-xs text-red-500">{errors.tipo_tarea.message}</span>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prioridad">Prioridad</Label>
              <select
                id="prioridad"
                {...register("prioridad")}
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {prioridades.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
              {errors.prioridad && <span className="text-xs text-red-500">{errors.prioridad.message}</span>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estado">Estado</Label>
              <select
                id="estado"
                {...register("estado")}
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {estados.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
              {errors.estado && <span className="text-xs text-red-500">{errors.estado.message}</span>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
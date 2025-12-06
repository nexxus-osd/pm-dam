'use client'

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProyectoSchema, CreateProyectoFormSchema, type CreateProyectoFormInput } from '@/lib/validations/proyecto';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface EditarProyectoDialogProps {
  proyecto: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditarProyectoDialog({ proyecto, open, onOpenChange, onSuccess }: EditarProyectoDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Valores por defecto
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CreateProyectoFormInput>({
    resolver: zodResolver(CreateProyectoFormSchema) as any,
    defaultValues: {
      nombre: '',
      descripcion: '',
      tipo_activo: 'EBOOK',
      presupuesto_asignado: 0,
      estado: 'PLANEANDO',
      prioridad: 'MEDIA',
      fecha_inicio: new Date(),
      fecha_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +1 semana
      etiquetas: [],
    }
  });

  // Cuando se abre el diálogo, cargamos los datos del proyecto
  useEffect(() => {
    if (open && proyecto) {
      // Establecer valores del formulario con los datos del proyecto
      setValue('nombre', proyecto.nombre);
      setValue('descripcion', proyecto.descripcion);
      setValue('tipo_activo', proyecto.tipo_activo);
      setValue('presupuesto_asignado', proyecto.presupuesto_asignado);
      setValue('estado', proyecto.estado);
      setValue('prioridad', proyecto.prioridad);
      setValue('fecha_inicio', new Date(proyecto.fecha_inicio));
      setValue('fecha_deadline', new Date(proyecto.fecha_deadline));
      setValue('etiquetas', proyecto.etiquetas || []);
    }
  }, [open, proyecto, setValue]);

  async function onSubmit(data: CreateProyectoFormInput) {
    setIsLoading(true);
    
    try {
      // Preparar datos para la actualización
      const updateData = {
        ...data,
        id: proyecto.id,
        fecha_inicio: data.fecha_inicio.toISOString(),
        fecha_deadline: data.fecha_deadline.toISOString()
      };

      // Llamar a la API para actualizar el proyecto
      const response = await fetch(`/api/proyectos/${proyecto.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el proyecto');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      alert("Error: " + (error instanceof Error ? error.message : 'Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Editar Proyecto</DialogTitle>
          <DialogDescription>
            Modifica los detalles de tu proyecto creativo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre del Proyecto</Label>
            <Input id="nombre" {...register("nombre")} placeholder="Ej. Ebook de Marketing Q4" />
            {errors.nombre && <span className="text-xs text-red-500">{errors.nombre.message}</span>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea id="descripcion" {...register("descripcion")} placeholder="Describe el objetivo y alcance..." />
            {errors.descripcion && <span className="text-xs text-red-500">{errors.descripcion.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tipo_activo">Tipo de Activo</Label>
              <select id="tipo_activo" {...register("tipo_activo")} className={inputClass}>
                <option value="EBOOK">Ebook</option>
                <option value="CURSO_ONLINE">Curso Online</option>
                <option value="JUEGO_LUDICO">Juego Lúdico</option>
                <option value="APP">App / Software</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="presupuesto">Presupuesto ($)</Label>
              <Input
                id="presupuesto"
                type="number"
                {...register("presupuesto_asignado", { valueAsNumber: true })}
              />
              {errors.presupuesto_asignado && <span className="text-xs text-red-500">{errors.presupuesto_asignado.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="prioridad">Prioridad</Label>
              <select id="prioridad" {...register("prioridad")} className={inputClass}>
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estado">Estado</Label>
              <select id="estado" {...register("estado")} className={inputClass}>
                <option value="PLANEANDO">Planeando</option>
                <option value="EN_PROGRESO">En Progreso</option>
                <option value="PAUSADO">Pausado</option>
                <option value="COMPLETADO">Completado</option>
                <option value="CANCELADO">Cancelado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
              <Input id="fecha_inicio" type="date" {...register("fecha_inicio")} />
              {errors.fecha_inicio && <span className="text-xs text-red-500">{errors.fecha_inicio.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fecha_deadline">Deadline</Label>
              <Input id="fecha_deadline" type="date" {...register("fecha_deadline")} />
              {errors.fecha_deadline && <span className="text-xs text-red-500">{errors.fecha_deadline.message}</span>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isLoading} className="bg-primary/90 hover:bg-primary">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Actualizando...' : 'Actualizar Proyecto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
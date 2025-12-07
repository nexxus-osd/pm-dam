'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTareaSchema } from '@/lib/validations/tarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { createTareaAction } from '@/app/actions/tareas';

interface AgregarTareaDialogProps {
  proyectoId: string;
  tareaPadreId?: string;
  onTareaCreada?: () => void;
  children?: React.ReactNode;
}

export function AgregarTareaDialog({ proyectoId, tareaPadreId, onTareaCreada, children }: AgregarTareaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(CreateTareaSchema),
    defaultValues: {
      proyecto_id: proyectoId,
      nombre: '',
      descripcion: '',
      tipo_tarea: 'CONTENIDO',
      estado: 'POR_HACER',
      prioridad: 'MEDIA',
      checklist: [], // Este debe ser un array vacío de objetos
      etiquetas: [],
      archivos_adjuntos: [],
    }
  });

  const onSubmit = async (data: any) => {
    try {
      // Asegurarse de que los arrays estén definidos
      const processedData = {
        ...data,
        checklist: Array.isArray(data.checklist) ? data.checklist : [],
        etiquetas: Array.isArray(data.etiquetas) ? data.etiquetas : [],
        archivos_adjuntos: Array.isArray(data.archivos_adjuntos) ? data.archivos_adjuntos : []
      };
      
      // Si hay tarea padre, añadirlo a los datos
      const datosConTareaPadre = tareaPadreId ? { ...processedData, tarea_padre_id: tareaPadreId } : processedData;
      
      setIsLoading(true);
      
      const result = await createTareaAction(datosConTareaPadre);
      if (!result.success) {
        throw new Error(result.error || 'Error desconocido al crear la tarea');
      }
      
      // Resetear formulario
      reset();
      setOpen(false);
      
      // Llamar callback si existe
      if (onTareaCreada) {
        onTareaCreada();
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
      alert("Error al crear la tarea: " + (error instanceof Error ? error.message : 'Error desconocido'));
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant={tareaPadreId ? "ghost" : "outline"} className={tareaPadreId ? "w-full justify-start" : "gap-2"}>
            <Plus className="h-4 w-4" />
            {tareaPadreId ? "Agregar subtarea" : "Agregar Tarea"}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{tareaPadreId ? "Agregar Subtarea" : "Agregar Nueva Tarea"}</DialogTitle>
          <DialogDescription>
            {tareaPadreId 
              ? "Agrega una subtarea a esta tarea principal." 
              : "Define los detalles de tu nueva tarea."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre de la Tarea</Label>
            <Input 
              id="nombre" 
              {...register("nombre")} 
              placeholder={tareaPadreId ? "Ej. Revisar sección 1" : "Ej. Crear borrador del capítulo 1"} 
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {tareaPadreId ? "Agregar Subtarea" : "Agregar Tarea"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
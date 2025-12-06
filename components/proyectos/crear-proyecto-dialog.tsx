'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProyectoSchema, CreateProyectoFormSchema, type CreateProyectoFormInput } from '@/lib/validations/proyecto';
import { createProyectoAction } from '@/app/actions/proyectos';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export function CrearProyectoDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Valores por defecto
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateProyectoFormInput>({
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

    async function onSubmit(data: CreateProyectoFormInput) {
        setIsLoading(true);
        // Server action espera datos. Las fechas serán strings del input date, coerce.date() en schema lo maneja.
        const res = await createProyectoAction(data as any);
        setIsLoading(false);

        if (res.success) {
            setOpen(false);
            reset();
            // Aquí podríamos mostrar un Toast de éxito
        } else {
            console.error(res.error);
            alert("Error: " + res.error);
        }
    }

    const inputClass = "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="premium" className="gap-2 shadow-lg shadow-purple-500/20">
                    <Plus className="h-4 w-4" />
                    Nuevo Proyecto
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                    <DialogDescription>
                        Define los detalles iniciales para tu nuevo proyecto creativo.
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
                            <Label htmlFor="estado">Estado Inicial</Label>
                            <select id="estado" {...register("estado")} className={inputClass}>
                                <option value="PLANEANDO">Planeando</option>
                                <option value="EN_PROGRESO">En Progreso</option>
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
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading} className="bg-primary/90 hover:bg-primary">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? 'Creando...' : 'Crear Proyecto'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

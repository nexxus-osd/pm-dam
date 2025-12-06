import { ProyectoService } from "@/lib/services/proyecto.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CrearProyectoDialog } from "@/components/proyectos/crear-proyecto-dialog";
import { ProyectoCardActions } from "@/components/proyectos/proyecto-card-actions";

export const dynamic = 'force-dynamic'; // Asegurar que no se cachee estáticamente si cambian los datos

export default async function ProyectosPage() {
    let proyectos: any[] = [];
    try {
        const result = await ProyectoService.list({ limit: 100, page: 1 });
        proyectos = result.proyectos;
    } catch (error) {
        console.error("Error al cargar proyectos:", error);
        // Podríamos mostrar un componente de error aquí o simplemente lista vacía
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'COMPLETADO': return 'success';
            case 'EN_PROGRESO': return 'info';
            case 'BLOQUEADO': return 'destructive';
            case 'REVISION': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Proyectos</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona y supervisa el progreso de todos tus proyectos creativos.
                    </p>
                </div>
                <CrearProyectoDialog />
            </div>

            {proyectos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-lg bg-card/50">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No hay proyectos aún</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm text-center">
                        Comienza creando tu primer proyecto para gestionar tareas y activos.
                    </p>
                    <CrearProyectoDialog />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {proyectos.map((proyecto) => (
                        <div key={proyecto.id} className="group flex flex-col rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-start justify-between mb-4">
                                <Badge variant={getStatusVariant(proyecto.estado)} className="mb-2">
                                    {proyecto.estado.replace('_', ' ')}
                                </Badge>
                                <ProyectoCardActions id={proyecto.id} proyecto={proyecto} />
                            </div>

                            <div className="mb-4 flex-1">
                                <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">{proyecto.nombre}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {proyecto.descripcion || "Sin descripción disponible."}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Progreso */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span>Progreso</span>
                                        <span>{Math.round(proyecto.progreso_total)}%</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500 ease-out group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-500"
                                            style={{ width: `${proyecto.progreso_total}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{format(new Date(proyecto.fecha_deadline), 'd MMM', { locale: es })}</span>
                                        </div>
                                        {proyecto.responsable && (
                                            <div className="flex items-center gap-1" title={`Responsable: ${proyecto.responsable.nombre}`}>
                                                <Users className="h-3 w-3" />
                                                <span>{proyecto.responsable.nombre.split(' ')[0]}</span>
                                            </div>
                                        )}
                                    </div>

                                    <Link href={`/proyectos/${proyecto.id}`} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Ver más <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

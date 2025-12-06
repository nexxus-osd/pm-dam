import { ProyectoService } from "@/lib/services/proyecto.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, User, Tag, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function ProyectoDetallePage({ params }: { params: { id: string } }) {
  let proyecto: any = null;
  
  try {
    proyecto = await ProyectoService.getById(params.id);
  } catch (error) {
    console.error("Error al cargar proyecto:", error);
    notFound();
  }

  if (!proyecto) {
    notFound();
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

  const getPrioridadVariant = (prioridad: string) => {
    switch (prioridad) {
      case 'ALTA': 
      case 'CRITICA': return 'destructive';
      case 'MEDIA': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link href="/proyectos" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
            ← Volver a proyectos
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{proyecto.nombre}</h1>
          <p className="text-muted-foreground mt-1">
            {proyecto.descripcion || "Sin descripción disponible."}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={getPrioridadVariant(proyecto.prioridad)}>
            {proyecto.prioridad}
          </Badge>
          <Badge variant={getStatusVariant(proyecto.estado)}>
            {proyecto.estado.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium">Progreso</div>
            </div>
            <div className="text-2xl font-bold mt-1">{proyecto.progreso_total || 0}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {proyecto.tareas_completadas || 0} de {proyecto.total_tareas || 0} tareas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium">Presupuesto</div>
            </div>
            <div className="text-2xl font-bold mt-1">${proyecto.presupuesto_asignado?.toLocaleString() || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Gastado: ${(proyecto.gastos_acumulados || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium">Salud</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {proyecto.salud_proyecto === 'BUENA' ? '🟢' : 
               proyecto.salud_proyecto === 'REGULAR' ? '🟡' : '🔴'} 
              {proyecto.salud_proyecto || 'DESCONOCIDA'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              ROI: {proyecto.roi_preliminar || 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm font-medium">Deadline</div>
            </div>
            <div className="text-2xl font-bold mt-1">
              {format(new Date(proyecto.fecha_deadline), 'd MMM', { locale: es })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {proyecto.dias_restantes || 0} días restantes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información detallada */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Resumen */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resumen del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Tipo de Activo</h4>
                  <p className="font-medium">{proyecto.tipo_activo?.replace('_', ' ') || 'No especificado'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Fecha de Inicio</h4>
                  <p className="font-medium">
                    {format(new Date(proyecto.fecha_inicio), 'd MMM yyyy', { locale: es })}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Responsable</h4>
                  <p className="font-medium">
                    {proyecto.responsable?.nombre || 'No asignado'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Ingresos Estimados</h4>
                  <p className="font-medium">
                    ${(proyecto.ingresos_estimados || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {proyecto.etiquetas && proyecto.etiquetas.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {proyecto.etiquetas.map((etiqueta: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {etiqueta}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tareas recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Tareas Recientes
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/proyectos/${params.id}/tareas`}>Ver todas</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!proyecto.tareas || proyecto.tareas.length === 0) ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay tareas registradas para este proyecto.
                </p>
              ) : (
                <div className="space-y-3">
                  {proyecto.tareas.slice(0, 5).map((tarea: any) => (
                    <div key={tarea.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                      <div>
                        <p className="font-medium text-sm">{tarea.nombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {tarea.estado?.replace('_', ' ') || 'Sin estado'}
                        </p>
                      </div>
                      <Badge variant={tarea.estado === 'COMPLETADA' ? 'success' : 'secondary'}>
                        {tarea.estado === 'COMPLETADA' ? 'Completada' : 'Pendiente'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Responsable */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Responsable
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proyecto.responsable ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{proyecto.responsable.nombre}</p>
                    <p className="text-sm text-muted-foreground">{proyecto.responsable.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay responsable asignado</p>
              )}
            </CardContent>
          </Card>

          {/* Acciones */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href={`/proyectos/${params.id}/tareas/nueva`}>Agregar Tarea</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/proyectos/${params.id}/editar`}>Editar Proyecto</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/proyectos/${params.id}/finanzas`}>Ver Finanzas</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
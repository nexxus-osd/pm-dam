'use client'

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, User, Tag, FileText, Clock, CheckCircle, AlertTriangle, Plus, Folder, File, Eye, Edit3, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { AgregarTareaDialog } from "@/components/tareas/agregar-tarea-dialog";
import { TareaItem } from "@/components/tareas/tarea-item";
import { getProyectoByIdAction } from "@/app/actions/proyectos";
import { CrearCarpetaDialog } from "@/components/carpetas/crear-carpeta-dialog";
import { CrearDocumentoDialog } from "@/components/carpetas/crear-documento-dialog";
import { EditarDocumentoDialog } from "@/components/carpetas/editar-documento-dialog";
import { DocumentoContent } from "@/components/carpetas/documento-content";
import { CarpetaItem } from "@/components/carpetas/carpeta-item";
import { deleteDocumentoAction } from "@/app/actions/carpetas";

export const dynamic = 'force-dynamic';

export default function ProyectoDetallePage() {
  // Usar useParams para obtener el ID en componente cliente
  const params = useParams();
  const id = params?.id as string;
  
  const [proyecto, setProyecto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documentoView, setDocumentoView] = useState<{ open: boolean; documento: any }>({ open: false, documento: null });
  const [carpetaSeleccionada, setCarpetaSeleccionada] = useState<any>(null); // Nuevo estado para la carpeta seleccionada
  
  const fetchProyecto = async () => {
    try {
      setLoading(true);
      if (!id) {
        throw new Error("ID de proyecto no proporcionado");
      }
      const result = await getProyectoByIdAction(id);
      if (result.success) {
        setProyecto(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error("Error al cargar proyecto:", err);
      setError("Error al cargar el proyecto");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProyecto();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error || !proyecto) {
    notFound();
    return null;
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
      default: return 'secondary';
    }
  };

  const handleDeleteDocumento = async (documentoId: string, documentoNombre: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el documento "${documentoNombre}"?`)) {
      return;
    }

    try {
      const result = await deleteDocumentoAction(documentoId);
      if (!result.success) {
        throw new Error(result.error);
      }
      fetchProyecto();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el documento: " + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  const handleViewDocumento = (documento: any) => {
    setDocumentoView({ open: true, documento });
  };

  // Función para manejar la selección de carpeta
  const handleCarpetaSeleccionada = (carpeta: any) => {
    setCarpetaSeleccionada(carpeta);
  };

  // Calcular días restantes de forma segura para evitar problemas de hidratación
  const calcularDiasRestantes = () => {
    if (typeof window !== 'undefined') {
      // En el cliente, calcular normalmente
      return Math.ceil((new Date(proyecto.fecha_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    } else {
      // En el servidor, devolver un valor por defecto
      return 0;
    }
  };

  const diasRestantes = calcularDiasRestantes();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link href="/proyectos" className="text-sm text-primary hover:underline flex items-center gap-1 mb-2">
            ← Volver a proyectos
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{proyecto.nombre}</h1>
          <p className="text-muted-foreground text-sm mt-1">
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
              {/* Salud del proyecto calculada dinámicamente */}
              Desconocida
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
              {/* Cálculo de días restantes */}
              {diasRestantes} días restantes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información detallada */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Tareas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Tareas del Proyecto
                </div>
                <AgregarTareaDialog 
                  proyectoId={id} 
                  onTareaCreada={fetchProyecto}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(!proyecto.tareas || proyecto.tareas.length === 0) ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-3">
                    No hay tareas registradas para este proyecto.
                  </p>
                  <AgregarTareaDialog 
                    proyectoId={id} 
                    onTareaCreada={fetchProyecto}
                  >
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Crear primera tarea
                    </Button>
                  </AgregarTareaDialog>
                </div>
              ) : (
                <div className="space-y-3">
                  {proyecto.tareas
                    .filter((tarea: any) => !tarea.tarea_padre_id) // Solo tareas principales
                    .map((tarea: any) => (
                      <TareaItem 
                        key={tarea.id} 
                        tarea={tarea} 
                        nivel={0}
                        onTareaActualizada={fetchProyecto}
                      />
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>

          {/* Carpetas y Documentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  Documentos del Proyecto
                </div>
                <div className="flex gap-2">
                  <CrearCarpetaDialog 
                    projectId={id} 
                    userId={proyecto.responsable?.id || ''} 
                    onCarpetaCreada={fetchProyecto}
                  />
                  <CrearDocumentoDialog 
                    projectId={id} 
                    userId={proyecto.responsable?.id || ''} 
                    onDocumentoCreado={fetchProyecto}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {proyecto.carpetas && proyecto.carpetas.length > 0 ? (
                <div className="grid gap-3">
                  {proyecto.carpetas.map((carpeta: any) => (
                    <CarpetaItem 
                      key={carpeta.id} 
                      carpeta={carpeta} 
                      projectId={id}
                      userId={proyecto.responsable?.id || ''}
                      nivel={0}
                      onRefresh={fetchProyecto}
                      onCarpetaSeleccionada={handleCarpetaSeleccionada} // Pasar la función de selección
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-3">
                    Aún no hay carpetas en este proyecto.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crea carpetas para organizar tus documentos.
                  </p>
                  <CrearCarpetaDialog 
                    projectId={id} 
                    userId={proyecto.responsable?.id || ''} 
                    onCarpetaCreada={fetchProyecto}
                  >
                    <Button>
                      <Folder className="h-4 w-4 mr-2" />
                      Crear Carpeta
                    </Button>
                  </CrearCarpetaDialog>
                </div>
              )}
              
              {/* Documentos en la raíz (sin carpeta) */}
              {proyecto.documentos && proyecto.documentos.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentos sin carpeta
                  </h3>
                  <div className="grid gap-2">
                    {proyecto.documentos.map((documento: any) => (
                      <div 
                        key={documento.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        {documento.nombre_archivo ? (
                          // Es un archivo subido
                          <File className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          // Es una nota de texto
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span 
                          className="text-sm truncate cursor-pointer hover:underline"
                          onClick={() => handleViewDocumento(documento)}
                        >
                          {documento.nombre}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {documento.nombre_archivo 
                            ? `${documento.tipo_documento} (${(documento.tamano_archivo / 1024).toFixed(1)} KB)` 
                            : documento.tipo_documento}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleViewDocumento(documento)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <EditarDocumentoDialog 
                            documento={documento}
                            onDocumentoActualizado={fetchProyecto}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </EditarDocumentoDialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleDeleteDocumento(documento.id, documento.nombre)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Botón para crear documento en la raíz si no hay carpetas ni documentos */}
              {!proyecto.carpetas?.length && !proyecto.documentos?.length && (
                <div className="text-center py-8 border-t border-border mt-6">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-3">
                    Aún no hay documentos en este proyecto.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Crea documentos directamente o dentro de carpetas.
                  </p>
                  <CrearDocumentoDialog 
                    projectId={id} 
                    userId={proyecto.responsable?.id || ''} 
                    onDocumentoCreado={fetchProyecto}
                  >
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      Crear Documento
                    </Button>
                  </CrearDocumentoDialog>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  // Mostrar mensaje de que la función no está implementada aún
                  alert('Función de edición no implementada aún');
                }}
              >
                Editar Proyecto
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/proyectos/${id}/finanzas`}>Ver Finanzas</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Contenido de carpeta seleccionada - Mostrado debajo de Acciones */}
          {carpetaSeleccionada && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    {carpetaSeleccionada.nombre}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCarpetaSeleccionada(null)} // Botón para cerrar
                  >
                    Cerrar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Subcarpetas de la carpeta seleccionada */}
                {carpetaSeleccionada.subcarpetas && carpetaSeleccionada.subcarpetas.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      Subcarpetas
                    </h3>
                    <div className="grid gap-2">
                      {carpetaSeleccionada.subcarpetas.map((subcarpeta: any) => (
                        <div 
                          key={subcarpeta.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => handleCarpetaSeleccionada(subcarpeta)}
                        >
                          <Folder className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{subcarpeta.nombre}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documentos de la carpeta seleccionada */}
                {carpetaSeleccionada.documentos && carpetaSeleccionada.documentos.length > 0 && (
                  <div>
                    <h3 className="text-md font-medium mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Documentos
                    </h3>
                    <div className="grid gap-2">
                      {carpetaSeleccionada.documentos.map((documento: any) => (
                        <div 
                          key={documento.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          {documento.nombre_archivo ? (
                            // Es un archivo subido
                            <File className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            // Es una nota de texto
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span 
                            className="text-sm truncate cursor-pointer hover:underline"
                            onClick={() => handleViewDocumento(documento)}
                          >
                            {documento.nombre}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {documento.nombre_archivo 
                              ? `${documento.tipo_documento} (${(documento.tamano_archivo / 1024).toFixed(1)} KB)` 
                              : documento.tipo_documento}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleViewDocumento(documento)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <EditarDocumentoDialog 
                              documento={documento}
                              onDocumentoActualizado={fetchProyecto}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                            </EditarDocumentoDialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleDeleteDocumento(documento.id, documento.nombre)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensaje si no hay contenido en la carpeta */}
                {(!carpetaSeleccionada.subcarpetas || carpetaSeleccionada.subcarpetas.length === 0) && 
                 (!carpetaSeleccionada.documentos || carpetaSeleccionada.documentos.length === 0) && (
                  <div className="text-center py-8">
                    <Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">
                      Esta carpeta está vacía.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Visualizador de documento */}
      {documentoView.documento && (
        <DocumentoContent
          documento={documentoView.documento}
          open={documentoView.open}
          onOpenChange={(open) => setDocumentoView({ ...documentoView, open })}
        />
      )}
    </div>
  );
}
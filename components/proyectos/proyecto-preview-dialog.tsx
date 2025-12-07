'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, User, Tag, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ProyectoPreviewDialogProps {
  proyecto: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProyectoPreviewDialog({ proyecto, open, onOpenChange }: ProyectoPreviewDialogProps) {
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

  // Formatear números de forma segura para evitar problemas de hidratación
  const formatCurrency = (amount: number | undefined) => {
    if (typeof window !== 'undefined') {
      // En el cliente, formatear normalmente
      return amount?.toLocaleString() || '0';
    } else {
      // En el servidor, devolver el número sin formato
      return amount?.toString() || '0';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{proyecto.nombre}</DialogTitle>
          <DialogDescription>
            Vista previa del proyecto
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={getPrioridadVariant(proyecto.prioridad)}>
              {proyecto.prioridad}
            </Badge>
            <Badge variant={getStatusVariant(proyecto.estado)}>
              {proyecto.estado.replace('_', ' ')}
            </Badge>
          </div>

          <p className="text-muted-foreground">
            {proyecto.descripcion || "Sin descripción disponible."}
          </p>

          {/* Métricas principales */}
          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <CardContent className="pt-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium">Progreso</div>
                </div>
                <div className="text-xl font-bold mt-1">{proyecto.progreso_total || 0}%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {proyecto.tareas_completadas || 0} de {proyecto.total_tareas || 0} tareas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium">Presupuesto</div>
                </div>
                <div className="text-xl font-bold mt-1">${formatCurrency(proyecto.presupuesto_asignado)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Gastado: ${formatCurrency(proyecto.gastos_acumulados)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información básica */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Inicio</div>
                <div className="text-sm">
                  {format(new Date(proyecto.fecha_inicio), 'd MMM yyyy', { locale: es })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Deadline</div>
                <div className="text-sm">
                  {format(new Date(proyecto.fecha_deadline), 'd MMM yyyy', { locale: es })}
                </div>
              </div>
            </div>
          </div>

          {/* Tipo de activo */}
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Tipo de Activo</div>
              <div className="text-sm">
                {proyecto.tipo_activo?.replace('_', ' ') || 'No especificado'}
              </div>
            </div>
          </div>

          {/* Etiquetas */}
          {proyecto.etiquetas && proyecto.etiquetas.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Etiquetas
              </div>
              <div className="flex flex-wrap gap-2">
                {proyecto.etiquetas.map((etiqueta: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {etiqueta}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Responsable */}
          {proyecto.responsable && (
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{proyecto.responsable.nombre}</p>
                <p className="text-xs text-muted-foreground">{proyecto.responsable.email}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
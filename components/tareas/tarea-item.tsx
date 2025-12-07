'use client'

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronRight, Plus, MoreVertical, Trash, Pencil } from 'lucide-react';
import { AgregarTareaDialog } from '@/components/tareas/agregar-tarea-dialog';
import { EditarTareaDialog } from '@/components/tareas/editar-tarea-dialog';
import { deleteTareaAction } from '@/app/actions/tareas';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TareaItemProps {
  tarea: any;
  nivel: number;
  onTareaActualizada?: () => void;
}

export function TareaItem({ tarea, nivel, onTareaActualizada }: TareaItemProps) {
  const [expandida, setExpandida] = useState(true);
  const subtareas = Array.isArray(tarea.subtareas) ? tarea.subtareas : [];
  const tieneSubtareas = subtareas.length > 0;

  const getEstadoVariant = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO': return 'success';
      case 'EN_PROGRESO': return 'info';
      case 'BLOQUEADO': return 'destructive';
      case 'EN_REVISION': return 'warning';
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

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.")) return;
    
    try {
      const result = await deleteTareaAction(tarea.id);
      if (!result.success) {
        alert("Error: " + result.error);
      } else if (onTareaActualizada) {
        onTareaActualizada();
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la tarea");
    }
  };

  // Limitar la indentación máxima para mantener la legibilidad
  const nivelIndentacion = Math.min(nivel, 3);

  return (
    <div className="space-y-2">
      <Card 
        className={`${nivelIndentacion > 0 ? `ml-${nivelIndentacion * 4}` : ''}`}
        style={{ marginLeft: nivelIndentacion > 0 ? `${nivelIndentacion * 1}rem` : '0' }}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {tieneSubtareas && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setExpandida(!expandida)}
              >
                {expandida ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm truncate">{tarea.nombre}</h4>
                <div className="flex gap-1">
                  <Badge variant={getPrioridadVariant(tarea.prioridad)} className="text-xs">
                    {tarea.prioridad}
                  </Badge>
                  <Badge variant={getEstadoVariant(tarea.estado)} className="text-xs">
                    {tarea.estado.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              
              {tarea.descripcion && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {tarea.descripcion}
                </p>
              )}
              
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>{tarea.tipo_tarea.replace('_', ' ')}</span>
                {tarea.asignado_a && (
                  <span>Asignado a: {tarea.asignado_a.nombre}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-3 gap-1">
            <AgregarTareaDialog 
              proyectoId={tarea.proyecto_id} 
              tareaPadreId={tarea.id}
              onTareaCreada={onTareaActualizada}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <EditarTareaDialog 
                    tarea={tarea} 
                    onTareaActualizada={onTareaActualizada}
                  >
                    <div className="flex items-center gap-2 w-full cursor-pointer">
                      <Pencil className="h-4 w-4" />
                      Editar
                    </div>
                  </EditarTareaDialog>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      
      {expandida && tieneSubtareas && (
        <div className="space-y-2">
          {subtareas.map((subtarea: any) => (
            <TareaItem 
              key={subtarea.id} 
              tarea={subtarea} 
              nivel={nivel + 1}
              onTareaActualizada={onTareaActualizada}
            />
          ))}
        </div>
      )}
    </div>
  );
}
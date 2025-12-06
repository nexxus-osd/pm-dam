'use client';

import { Button } from '@/components/ui/button';
import { Edit3, Trash2 } from 'lucide-react';

interface NotaCardProps {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
  color: string;
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
}

export function NotaCard({ 
  id, 
  titulo, 
  contenido, 
  fecha, 
  color,
  onEditar,
  onEliminar
}: NotaCardProps) {
  return (
    <div className={`${color} border rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-foreground line-clamp-2">{titulo}</h3>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEditar(id)}
            className="h-8 w-8 p-0"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEliminar(id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-foreground whitespace-pre-line flex-grow line-clamp-4">
        {contenido}
      </p>
      <p className="text-xs text-muted-foreground mt-3">
        {new Date(fecha).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </p>
    </div>
  );
}
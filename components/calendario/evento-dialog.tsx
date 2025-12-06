'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface EventoDialogProps {
  onEventoCreado?: () => void;
}

export function EventoDialog({ onEventoCreado }: EventoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Cerrar diálogo y llamar callback
      setOpen(false);
      if (onEventoCreado) onEventoCreado();
    } catch (err) {
      setError('Error al crear el evento');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Crear Nuevo Evento
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              placeholder="Título del evento"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="fecha">Fecha *</Label>
            <Input
              id="fecha"
              type="date"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="horaInicio">Hora de inicio</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="horaInicio"
                  type="time"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="horaFin">Hora de fin</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="horaFin"
                  type="time"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="ubicacion">Ubicación</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="ubicacion"
                placeholder="Ubicación del evento"
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tipo">Tipo de evento</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Reunión</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="review">Revisión</SelectItem>
                <SelectItem value="launch">Lanzamiento</SelectItem>
                <SelectItem value="presentation">Presentación</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Descripción del evento"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="asistentes">Asistentes</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="asistentes"
                type="number"
                min="1"
                placeholder="Número de asistentes"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Evento'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, MapPin, Users, Plus, Edit3 } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  type: string;
  description: string;
}

interface EventoDialogProps {
  evento?: Event;
  onEventoCreado?: (nuevoEvento: Event) => void;
  onEventoActualizado?: (eventoActualizado: Event) => void;
}

export function EventoDialog({ evento, onEventoCreado, onEventoActualizado }: EventoDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [titulo, setTitulo] = useState(evento?.title || '');
  const [fecha, setFecha] = useState(evento?.date || '');
  const [horaInicio, setHoraInicio] = useState(evento?.time || '');
  const [ubicacion, setUbicacion] = useState(evento?.location || '');
  const [tipo, setTipo] = useState(evento?.type || '');
  const [descripcion, setDescripcion] = useState(evento?.description || '');
  const [asistentes, setAsistentes] = useState(evento?.attendees.toString() || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generar ID de forma segura para evitar problemas de hidratación
      let eventId: string;
      if (evento?.id) {
        eventId = evento.id;
      } else if (typeof window !== 'undefined') {
        // Solo generar ID aleatorio en el cliente
        eventId = Math.random().toString(36).substr(2, 9);
      } else {
        // En el servidor, usar un placeholder
        eventId = 'temp-event-id';
      }
      
      const eventData: Event = {
        id: eventId,
        title: titulo,
        date: fecha,
        time: horaInicio,
        location: ubicacion,
        attendees: parseInt(asistentes) || 0,
        type: tipo,
        description: descripcion
      };
      
      // Cerrar diálogo y llamar callback
      setOpen(false);
      if (evento && onEventoActualizado) {
        onEventoActualizado(eventData);
      } else if (!evento && onEventoCreado) {
        onEventoCreado(eventData);
      }
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
        {evento ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit3 className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Evento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {evento ? 'Editar Evento' : 'Crear Nuevo Evento'}
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
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título del evento"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="fecha">Fecha *</Label>
            <Input
              id="fecha"
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
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
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="asistentes">Asistentes</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="asistentes"
                  type="number"
                  min="1"
                  value={asistentes}
                  onChange={(e) => setAsistentes(e.target.value)}
                  placeholder="Número de asistentes"
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
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Ubicación del evento"
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tipo">Tipo de evento</Label>
            <Select value={tipo} onValueChange={setTipo}>
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
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del evento"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : (evento ? 'Actualizar' : 'Crear Evento')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
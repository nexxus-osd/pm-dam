'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventoDialog } from '@/components/calendario/evento-dialog';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react';

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

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Reunión de equipo',
      date: '2023-06-15',
      time: '10:00',
      location: 'Sala de conferencias A',
      attendees: 8,
      type: 'meeting',
      description: 'Reunión semanal para revisar el progreso del proyecto'
    },
    {
      id: '2',
      title: 'Entrega de prototipo',
      date: '2023-06-20',
      time: '15:30',
      location: 'Oficina principal',
      attendees: 5,
      type: 'deadline',
      description: 'Entrega del prototipo de la aplicación móvil'
    }
  ]);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const handleEventoCreado = (nuevoEvento: Event) => {
    setEvents([...events, nuevoEvento]);
  };

  const handleEventoActualizado = (eventoActualizado: Event) => {
    setEvents(events.map(event => 
      event.id === eventoActualizado.id ? eventoActualizado : event
    ));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    // Día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const firstDayOfWeek = firstDay.getDay();
    // Número de días en el mes
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Agregar días vacíos al principio
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-border/30 p-1 bg-muted/10"></div>
      );
    }
    
    // Agregar días del mes
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, '0');
      const monthStr = String(month + 1).padStart(2, '0');
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      
      const dayEvents = events.filter(event => event.date === dateStr);
      
      const isToday = isCurrentMonth && day === todayDate;
      
      days.push(
        <div 
          key={day} 
          className={`h-24 border border-border/30 p-1 transition-colors ${
            isToday 
              ? 'bg-primary/10 border-primary/30' 
              : 'hover:bg-muted/50'
          }`}
        >
          <div className={`font-medium text-sm ${isToday ? 'text-primary' : ''}`}>
            {day}
          </div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 2).map(event => (
              <div 
                key={event.id} 
                className={`text-xs p-1 rounded truncate ${
                  event.type === 'meeting' ? 'bg-blue-500/10 text-blue-500' :
                  event.type === 'deadline' ? 'bg-red-500/10 text-red-500' :
                  event.type === 'review' ? 'bg-yellow-500/10 text-yellow-500' :
                  event.type === 'launch' ? 'bg-green-500/10 text-green-500' :
                  event.type === 'presentation' ? 'bg-purple-500/10 text-purple-500' :
                  'bg-gray-500/10 text-gray-500'
                }`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 2} más
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Formatear la fecha de manera segura para evitar problemas de hidratación
  const formattedCurrentDate = typeof window !== 'undefined'
    ? currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : currentDate.toISOString();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">Organiza y programa tus eventos</p>
        </div>
        <EventoDialog onEventoCreado={handleEventoCreado} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector de mes */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-lg p-4 transition-all hover-glow-section">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Hoy
                </Button>
                <div className="flex">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')} className="rounded-r-none border-r-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')} className="rounded-l-none">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Vista de calendario */}
          <div className="bg-card border rounded-lg overflow-hidden mt-4 transition-all hover-glow-section">
            {/* Encabezado con días de la semana */}
            <div className="grid grid-cols-7 bg-muted/50">
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground border-r border-border/30 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Cuadrícula del calendario */}
            <div className="grid grid-cols-7">
              {renderCalendar()}
            </div>
          </div>
        </div>

        {/* Lista de eventos del día */}
        <div className="bg-card border rounded-lg transition-all hover-glow-section">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Eventos de hoy</h3>
            <p className="text-sm text-muted-foreground">
              {formattedCurrentDate}
            </p>
          </div>
          <div className="divide-y">
            {events.filter(event => event.date === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`).length > 0 ? (
              events.filter(event => event.date === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`).map(event => (
                <div key={event.id} className="p-6 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      event.type === 'meeting' ? 'bg-blue-500' :
                      event.type === 'deadline' ? 'bg-red-500' :
                      event.type === 'review' ? 'bg-yellow-500' :
                      event.type === 'launch' ? 'bg-green-500' :
                      event.type === 'presentation' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{event.attendees} personas</span>
                        </div>
                      </div>
                    </div>
                    <EventoDialog evento={event} onEventoActualizado={handleEventoActualizado} />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium">No hay eventos programados</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  No tienes eventos programados para hoy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventoDialog } from '@/components/calendario/evento-dialog';

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Datos simulados para eventos del calendario
  const events = [
    {
      id: '1',
      title: 'Reunión de equipo',
      date: '2025-12-06',
      time: '10:00 AM - 11:30 AM',
      location: 'Sala de conferencias A',
      attendees: 5,
      type: 'meeting',
      description: 'Reunión semanal para discutir el progreso del proyecto'
    },
    {
      id: '2',
      title: 'Entrega de proyecto',
      date: '2025-12-07',
      time: '11:30 AM - 12:00 PM',
      location: 'Online',
      attendees: 3,
      type: 'deadline',
      description: 'Entrega final del proyecto de rediseño del sitio web'
    },
    {
      id: '3',
      title: 'Revisión de diseño',
      date: '2025-12-08',
      time: '2:00 PM - 3:00 PM',
      location: 'Oficina principal',
      attendees: 4,
      type: 'review',
      description: 'Revisión del nuevo diseño de la aplicación móvil'
    },
    {
      id: '4',
      title: 'Lanzamiento de producto',
      date: '2025-12-09',
      time: '9:00 AM - 10:00 AM',
      location: 'Evento virtual',
      attendees: 15,
      type: 'launch',
      description: 'Lanzamiento oficial del nuevo producto X'
    },
    {
      id: '5',
      title: 'Presentación a clientes',
      date: '2025-12-10',
      time: '3:00 PM - 4:30 PM',
      location: 'Sala VIP',
      attendees: 8,
      type: 'presentation',
      description: 'Presentación del progreso del proyecto a clientes importantes'
    },
  ];

  // Generar días del mes
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Días vacíos al inicio del mes
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-border/30"></div>);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === dateStr);
      
      days.push(
        <div key={day} className="h-24 border border-border/30 p-1 hover:bg-muted/50 transition-colors">
          <div className="font-medium text-sm">{day}</div>
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">Gestiona tus eventos y reuniones.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <EventoDialog onEventoCreado={() => {}} />
        </div>
      </div>

      {/* Selector de mes */}
      <div className="flex items-center justify-between bg-card border rounded-lg p-4">
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Hoy
          </Button>
        </div>
      </div>

      {/* Vista de calendario */}
      <div className="bg-card border rounded-lg overflow-hidden">
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

      {/* Lista de eventos del día */}
      <div className="bg-card border rounded-lg">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Eventos de hoy</h3>
          <p className="text-sm text-muted-foreground">
            {currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
  );
}
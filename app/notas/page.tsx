'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotaCard } from '@/components/notas/nota-card';
import { NotaForm } from '@/components/notas/nota-form';
import { getNotasAction, createNotaAction, updateNotaAction, deleteNotaAction } from '@/app/actions';

interface Nota {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
  color: string;
}

export default function NotasPage() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar notas al montar el componente
  useEffect(() => {
    loadNotas();
  }, []);

  const loadNotas = async () => {
    setLoading(true);
    try {
      const result = await getNotasAction();
      if (result.success && result.data) {
        // Convertir las fechas al formato esperado
        const notasConvertidas = result.data.map((nota: any) => ({
          id: nota.id,
          titulo: nota.titulo,
          contenido: nota.contenido,
          fecha: new Date(nota.createdAt).toISOString(),
          color: nota.color
        }));
        setNotas(notasConvertidas);
      }
    } catch (error) {
      console.error('Error cargando notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: { titulo: string; contenido: string; color: string }) => {
    try {
      let result;
      
      if (editandoId) {
        // Actualizar nota existente
        result = await updateNotaAction(editandoId, data);
        if (result.success) {
          // Actualizar nota en el estado local
          setNotas(notas.map(nota => 
            nota.id === editandoId 
              ? { ...nota, titulo: data.titulo, contenido: data.contenido, color: data.color }
              : nota
          ));
        }
      } else {
        // Crear nueva nota
        result = await createNotaAction(data);
        if (result.success && result.data) {
          // Agregar nueva nota al estado local
          const nuevaNota: Nota = {
            id: result.data.id,
            titulo: result.data.titulo,
            contenido: result.data.contenido,
            fecha: new Date(result.data.createdAt).toISOString(),
            color: result.data.color
          };
          setNotas([nuevaNota, ...notas]);
        }
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Error desconocido');
      }
      
      // Resetear formulario
      setMostrarFormulario(false);
      setEditandoId(null);
    } catch (error) {
      console.error('Error guardando nota:', error);
      alert('Error al guardar la nota');
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      const result = await deleteNotaAction(id);
      if (result.success) {
        // Eliminar nota del estado local
        setNotas(notas.filter(nota => nota.id !== id));
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error eliminando nota:', error);
      alert('Error al eliminar la nota');
    }
  };

  const handleEditar = (id: string) => {
    setEditandoId(id);
    setMostrarFormulario(true);
  };

  const notasFiltradas = notas.filter(nota => 
    nota.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    nota.contenido.toLowerCase().includes(busqueda.toLowerCase())
  );

  const notaEditando = editandoId ? notas.find(n => n.id === editandoId) : undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notas Rápidas</h1>
          <p className="text-muted-foreground">Captura y organiza tus ideas importantes.</p>
        </div>
        <Button onClick={() => setMostrarFormulario(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Nota
        </Button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar notas..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Formulario para crear/editar nota */}
      {mostrarFormulario && (
        <div className="bg-card border rounded-lg p-6">
          <NotaForm
            initialValues={
              notaEditando 
                ? { 
                    titulo: notaEditando.titulo, 
                    contenido: notaEditando.contenido, 
                    color: notaEditando.color 
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setMostrarFormulario(false);
              setEditandoId(null);
            }}
            isEditing={!!editandoId}
          />
        </div>
      )}

      {/* Lista de notas */}
      {notasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10 border-dashed">
          <div className="rounded-full bg-muted p-4 mb-4">
            <StickyNote className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No hay notas</h3>
          <p className="text-muted-foreground mb-4">
            {busqueda ? 'No se encontraron notas que coincidan con tu búsqueda.' : 'Crea tu primera nota para empezar.'}
          </p>
          <Button onClick={() => setMostrarFormulario(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Nota
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notasFiltradas.map(nota => (
            <NotaCard
              key={nota.id}
              id={nota.id}
              titulo={nota.titulo}
              contenido={nota.contenido}
              fecha={nota.fecha}
              color={nota.color}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
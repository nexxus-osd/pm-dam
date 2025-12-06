// ============================================================
// TAREAS SERVICE - Supabase Integration
// ============================================================

import { supabase } from '../client';
import { Tarea } from '../types';

export class TareasService {
  // Obtener todas las tareas de un proyecto
  static async getByProjectId(proyectoId: string): Promise<{ data: Tarea[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .eq('proyecto_id', proyectoId)
        .order('fecha_creacion', { ascending: false });
      
      if (error) throw error;
      return { data: data as Tarea[], error: null };
    } catch (error) {
      console.error(`Error fetching tareas for proyecto ${proyectoId}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Obtener tarea por ID
  static async getById(id: string): Promise<{ data: Tarea | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data: data as Tarea, error: null };
    } catch (error) {
      console.error(`Error fetching tarea ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Crear nueva tarea
  static async create(tarea: Partial<Tarea>): Promise<{ data: Tarea | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .insert(tarea)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Tarea, error: null };
    } catch (error) {
      console.error('Error creating tarea:', error);
      return { data: null, error: error as Error };
    }
  }

  // Actualizar tarea
  static async update(id: string, tarea: Partial<Tarea>): Promise<{ data: Tarea | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('tareas')
        .update(tarea)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Tarea, error: null };
    } catch (error) {
      console.error(`Error updating tarea ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Eliminar tarea
  static async delete(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('tareas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`Error deleting tarea ${id}:`, error);
      return { error: error as Error };
    }
  }
}
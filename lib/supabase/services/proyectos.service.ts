// ============================================================
// PROYECTOS SERVICE - Supabase Integration
// ============================================================

import { supabase } from '../client';
import { Proyecto } from '../types';

export class ProyectosService {
  // Obtener todos los proyectos
  static async getAll(): Promise<{ data: Proyecto[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .order('fecha_creacion', { ascending: false });
      
      if (error) throw error;
      return { data: data as Proyecto[], error: null };
    } catch (error) {
      console.error('Error fetching proyectos:', error);
      return { data: null, error: error as Error };
    }
  }

  // Obtener proyecto por ID
  static async getById(id: string): Promise<{ data: Proyecto | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data: data as Proyecto, error: null };
    } catch (error) {
      console.error(`Error fetching proyecto ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Crear nuevo proyecto
  static async create(proyecto: Partial<Proyecto>): Promise<{ data: Proyecto | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .insert(proyecto)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Proyecto, error: null };
    } catch (error) {
      console.error('Error creating proyecto:', error);
      return { data: null, error: error as Error };
    }
  }

  // Actualizar proyecto
  static async update(id: string, proyecto: Partial<Proyecto>): Promise<{ data: Proyecto | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('proyectos')
        .update(proyecto)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Proyecto, error: null };
    } catch (error) {
      console.error(`Error updating proyecto ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Eliminar proyecto
  static async delete(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('proyectos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`Error deleting proyecto ${id}:`, error);
      return { error: error as Error };
    }
  }
}
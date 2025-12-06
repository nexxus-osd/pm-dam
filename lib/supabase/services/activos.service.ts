// ============================================================
// ACTIVOS DIGITALES SERVICE - Supabase Integration
// ============================================================

import { supabase } from '../client';
import { ActivoDigital } from '../types';

export class ActivosService {
  // Obtener todos los activos digitales de un proyecto
  static async getByProjectId(proyectoId: string): Promise<{ data: ActivoDigital[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('activos_digitales')
        .select('*')
        .eq('proyecto_id', proyectoId)
        .order('fecha_creacion', { ascending: false });
      
      if (error) throw error;
      return { data: data as ActivoDigital[], error: null };
    } catch (error) {
      console.error(`Error fetching activos for proyecto ${proyectoId}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Obtener activo digital por ID
  static async getById(id: string): Promise<{ data: ActivoDigital | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('activos_digitales')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data: data as ActivoDigital, error: null };
    } catch (error) {
      console.error(`Error fetching activo ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Crear nuevo activo digital
  static async create(activo: Partial<ActivoDigital>): Promise<{ data: ActivoDigital | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('activos_digitales')
        .insert(activo)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as ActivoDigital, error: null };
    } catch (error) {
      console.error('Error creating activo:', error);
      return { data: null, error: error as Error };
    }
  }

  // Actualizar activo digital
  static async update(id: string, activo: Partial<ActivoDigital>): Promise<{ data: ActivoDigital | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('activos_digitales')
        .update(activo)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as ActivoDigital, error: null };
    } catch (error) {
      console.error(`Error updating activo ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Eliminar activo digital
  static async delete(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('activos_digitales')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`Error deleting activo ${id}:`, error);
      return { error: error as Error };
    }
  }
}
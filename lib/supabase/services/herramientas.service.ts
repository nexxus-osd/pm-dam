// ============================================================
// HERRAMIENTAS AI SERVICE - Supabase Integration
// ============================================================

import { supabase } from '../client';
import { HerramientaAI } from '../types';

export class HerramientasService {
  // Obtener todas las herramientas AI
  static async getAll(): Promise<{ data: HerramientaAI[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('herramientas_ai')
        .select('*')
        .order('nombre');
      
      if (error) throw error;
      return { data: data as HerramientaAI[], error: null };
    } catch (error) {
      console.error('Error fetching herramientas AI:', error);
      return { data: null, error: error as Error };
    }
  }

  // Obtener herramienta AI por ID
  static async getById(id: string): Promise<{ data: HerramientaAI | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('herramientas_ai')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data: data as HerramientaAI, error: null };
    } catch (error) {
      console.error(`Error fetching herramienta AI ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Crear nueva herramienta AI
  static async create(herramienta: Partial<HerramientaAI>): Promise<{ data: HerramientaAI | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('herramientas_ai')
        .insert(herramienta)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as HerramientaAI, error: null };
    } catch (error) {
      console.error('Error creating herramienta AI:', error);
      return { data: null, error: error as Error };
    }
  }

  // Actualizar herramienta AI
  static async update(id: string, herramienta: Partial<HerramientaAI>): Promise<{ data: HerramientaAI | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('herramientas_ai')
        .update(herramienta)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as HerramientaAI, error: null };
    } catch (error) {
      console.error(`Error updating herramienta AI ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Eliminar herramienta AI
  static async delete(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('herramientas_ai')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`Error deleting herramienta AI ${id}:`, error);
      return { error: error as Error };
    }
  }
}
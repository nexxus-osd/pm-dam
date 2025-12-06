// ============================================================
// TRANSACCIONES SERVICE - Supabase Integration
// ============================================================

import { supabase } from '../client';
import { Transaccion } from '../types';

export class TransaccionesService {
  // Obtener todas las transacciones de un proyecto
  static async getByProjectId(proyectoId: string): Promise<{ data: Transaccion[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('transacciones')
        .select('*')
        .eq('proyecto_id', proyectoId)
        .order('fecha_transaccion', { ascending: false });
      
      if (error) throw error;
      return { data: data as Transaccion[], error: null };
    } catch (error) {
      console.error(`Error fetching transacciones for proyecto ${proyectoId}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Obtener transacción por ID
  static async getById(id: string): Promise<{ data: Transaccion | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('transacciones')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data: data as Transaccion, error: null };
    } catch (error) {
      console.error(`Error fetching transaccion ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Crear nueva transacción
  static async create(transaccion: Partial<Transaccion>): Promise<{ data: Transaccion | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('transacciones')
        .insert(transaccion)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Transaccion, error: null };
    } catch (error) {
      console.error('Error creating transaccion:', error);
      return { data: null, error: error as Error };
    }
  }

  // Actualizar transacción
  static async update(id: string, transaccion: Partial<Transaccion>): Promise<{ data: Transaccion | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('transacciones')
        .update(transaccion)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Transaccion, error: null };
    } catch (error) {
      console.error(`Error updating transaccion ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Eliminar transacción
  static async delete(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('transacciones')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`Error deleting transaccion ${id}:`, error);
      return { error: error as Error };
    }
  }
}
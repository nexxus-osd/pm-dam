// ============================================================
// NOTIFICACIONES SERVICE - Supabase Integration
// ============================================================

import { supabase } from '../client';
import { Notificacion } from '../types';

export class NotificacionesService {
  // Obtener notificaciones de un usuario
  static async getByUserId(userId: string): Promise<{ data: Notificacion[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('destinatario_id', userId)
        .order('fecha', { ascending: false });
      
      if (error) throw error;
      return { data: data as Notificacion[], error: null };
    } catch (error) {
      console.error(`Error fetching notificaciones for user ${userId}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Obtener notificación por ID
  static async getById(id: string): Promise<{ data: Notificacion | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data: data as Notificacion, error: null };
    } catch (error) {
      console.error(`Error fetching notificacion ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Crear nueva notificación
  static async create(notificacion: Partial<Notificacion>): Promise<{ data: Notificacion | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('notificaciones')
        .insert(notificacion)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Notificacion, error: null };
    } catch (error) {
      console.error('Error creating notificacion:', error);
      return { data: null, error: error as Error };
    }
  }

  // Marcar notificación como leída
  static async markAsRead(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notificaciones')
        .update({ leida: true })
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`Error marking notificacion ${id} as read:`, error);
      return { error: error as Error };
    }
  }

  // Eliminar notificación
  static async delete(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('notificaciones')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`Error deleting notificacion ${id}:`, error);
      return { error: error as Error };
    }
  }
}
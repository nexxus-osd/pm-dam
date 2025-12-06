// ============================================================
// USUARIOS SERVICE - Supabase Integration
// ============================================================

import { supabase } from '../client';
import { Usuario } from '../types';

export class UsuariosService {
  // Obtener todos los usuarios
  static async getAll(): Promise<{ data: Usuario[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nombre');
      
      if (error) throw error;
      return { data: data as Usuario[], error: null };
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      return { data: null, error: error as Error };
    }
  }

  // Obtener usuario por ID
  static async getById(id: string): Promise<{ data: Usuario | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data: data as Usuario, error: null };
    } catch (error) {
      console.error(`Error fetching usuario ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Obtener usuario por email
  static async getByEmail(email: string): Promise<{ data: Usuario | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) throw error;
      return { data: data as Usuario, error: null };
    } catch (error) {
      console.error(`Error fetching usuario with email ${email}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Crear nuevo usuario
  static async create(usuario: Partial<Usuario>): Promise<{ data: Usuario | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert(usuario)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Usuario, error: null };
    } catch (error) {
      console.error('Error creating usuario:', error);
      return { data: null, error: error as Error };
    }
  }

  // Actualizar usuario
  static async update(id: string, usuario: Partial<Usuario>): Promise<{ data: Usuario | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update(usuario)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Usuario, error: null };
    } catch (error) {
      console.error(`Error updating usuario ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Eliminar usuario
  static async delete(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`Error deleting usuario ${id}:`, error);
      return { error: error as Error };
    }
  }
}
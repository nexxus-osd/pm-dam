// ============================================================
// WORKFLOWS SERVICE - Supabase Integration
// ============================================================

import { supabase } from '../client';
import { Workflow } from '../types';

export class WorkflowsService {
  // Obtener todos los workflows
  static async getAll(): Promise<{ data: Workflow[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('nombre');
      
      if (error) throw error;
      return { data: data as Workflow[], error: null };
    } catch (error) {
      console.error('Error fetching workflows:', error);
      return { data: null, error: error as Error };
    }
  }

  // Obtener workflow por ID
  static async getById(id: string): Promise<{ data: Workflow | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data: data as Workflow, error: null };
    } catch (error) {
      console.error(`Error fetching workflow ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Crear nuevo workflow
  static async create(workflow: Partial<Workflow>): Promise<{ data: Workflow | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .insert(workflow)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Workflow, error: null };
    } catch (error) {
      console.error('Error creating workflow:', error);
      return { data: null, error: error as Error };
    }
  }

  // Actualizar workflow
  static async update(id: string, workflow: Partial<Workflow>): Promise<{ data: Workflow | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .update(workflow)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data: data as Workflow, error: null };
    } catch (error) {
      console.error(`Error updating workflow ${id}:`, error);
      return { data: null, error: error as Error };
    }
  }

  // Eliminar workflow
  static async delete(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error(`Error deleting workflow ${id}:`, error);
      return { error: error as Error };
    }
  }
}
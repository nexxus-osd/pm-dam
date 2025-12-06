'use server'

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';

// Definir el tipo para las notas
interface Nota {
  id: string;
  titulo: string;
  contenido: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getNotasAction(): Promise<{ success: boolean; data?: Nota[]; error?: string }> {
  try {
    // Verificar si la tabla notas existe, si no, crearla
    const notas = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' AND name='notas';
    `;
    
    // Si no existe, crear la tabla (esto es solo para demostración, en producción se usaría migraciones)
    if ((notas as any[]).length === 0) {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS notas (
          id TEXT PRIMARY KEY,
          titulo TEXT NOT NULL,
          contenido TEXT NOT NULL,
          color TEXT NOT NULL DEFAULT 'bg-yellow-100 border-yellow-300',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `;
    }
    
    // Obtener todas las notas
    const notasData = await prisma.$queryRaw`
      SELECT id, titulo, contenido, color, created_at as createdAt, updated_at as updatedAt
      FROM notas
      ORDER BY created_at DESC;
    ` as Nota[];
    
    return { success: true, data: notasData };
  } catch (error) {
    console.error("Error obteniendo notas:", error);
    return { success: false, error: 'Error al obtener las notas' };
  }
}

export async function createNotaAction(data: { titulo: string; contenido: string; color: string }): Promise<{ success: boolean; data?: Nota; error?: string }> {
  try {
    const id = Date.now().toString();
    const createdAt = new Date();
    
    // Insertar nueva nota
    await prisma.$executeRaw`
      INSERT INTO notas (id, titulo, contenido, color, created_at, updated_at)
      VALUES (${id}, ${data.titulo}, ${data.contenido}, ${data.color}, ${createdAt.toISOString()}, ${createdAt.toISOString()});
    `;
    
    const nota = {
      id,
      titulo: data.titulo,
      contenido: data.contenido,
      color: data.color,
      createdAt,
      updatedAt: createdAt
    };
    
    revalidatePath('/notas');
    return { success: true, data: nota };
  } catch (error) {
    console.error("Error creando nota:", error);
    return { success: false, error: 'Error al crear la nota' };
  }
}

export async function updateNotaAction(id: string, data: { titulo: string; contenido: string; color: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const updatedAt = new Date();
    
    // Actualizar nota
    await prisma.$executeRaw`
      UPDATE notas 
      SET titulo = ${data.titulo}, contenido = ${data.contenido}, color = ${data.color}, updated_at = ${updatedAt.toISOString()}
      WHERE id = ${id};
    `;
    
    revalidatePath('/notas');
    return { success: true };
  } catch (error) {
    console.error("Error actualizando nota:", error);
    return { success: false, error: 'Error al actualizar la nota' };
  }
}

export async function deleteNotaAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Eliminar nota
    await prisma.$executeRaw`
      DELETE FROM notas WHERE id = ${id};
    `;
    
    revalidatePath('/notas');
    return { success: true };
  } catch (error) {
    console.error("Error eliminando nota:", error);
    return { success: false, error: 'Error al eliminar la nota' };
  }
}
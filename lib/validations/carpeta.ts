import { z } from 'zod';

// Schema para crear carpeta
export const CreateCarpetaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es demasiado largo'),
  descripcion: z.string().max(500).optional(),
  proyecto_id: z.string().uuid('ID de proyecto inválido'),
  carpeta_padre_id: z.string().uuid().optional(),
  creada_por_id: z.string().uuid('ID de usuario inválido'),
});

// Schema para actualizar carpeta
export const UpdateCarpetaSchema = CreateCarpetaSchema.partial().extend({
  id: z.string().uuid(),
});

// Schema base para documento
const BaseDocumentoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es demasiado largo'),
  descripcion: z.string().max(500).optional(),
  tipo_documento: z.string().min(1, 'El tipo de documento es requerido'),
  contenido: z.string().optional(),
  proyecto_id: z.string().uuid('ID de proyecto inválido'),
  carpeta_id: z.string().uuid().optional(),
  creada_por_id: z.string().uuid('ID de usuario inválido'),
});

// Schema para crear documento
export const CreateDocumentoSchema = BaseDocumentoSchema.superRefine((data, ctx) => {
  // No requerimos contenido o archivo en el esquema base, lo manejaremos en la lógica de negocio
});

// Schema para actualizar documento
export const UpdateDocumentoSchema = BaseDocumentoSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateCarpetaInput = z.infer<typeof CreateCarpetaSchema>;
export type UpdateCarpetaInput = z.infer<typeof UpdateCarpetaSchema>;
export type CreateDocumentoInput = z.infer<typeof BaseDocumentoSchema>;
export type UpdateDocumentoInput = z.infer<typeof UpdateDocumentoSchema>;
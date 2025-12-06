// ============================================================
// SUPABASE SERVICE CLIENT (SERVER-SIDE)
// ============================================================

import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar que las variables de entorno estén definidas
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Crear el cliente de Supabase con permisos de servicio
export const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

export default supabaseService;
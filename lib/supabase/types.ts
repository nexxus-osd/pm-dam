// ============================================================
// SUPABASE TYPE DEFINITIONS
// ============================================================

// Definiciones de tipos para las tablas de la base de datos
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Usuario
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  avatar_url?: string;
  rol: string;
  departamento?: string;
  activo: boolean;
  fecha_registro: string;
  ultimo_acceso?: string;
  preferencias?: Json;
}

// Proyecto
export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  tipo_activo: string;
  fecha_inicio: string;
  fecha_deadline: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  estado: string;
  prioridad: string;
  responsable_id: string;
  progreso_total: number;
  total_tareas: number;
  tareas_completadas: number;
  tareas_en_progreso: number;
  tareas_bloqueadas: number;
  presupuesto_asignado: number;
  gastos_acumulados: number;
  ingresos_totales: number;
  balance_restante: number;
  roi_preliminar: number;
  ingresos_estimados: number;
  activos_generados: number;
  costo_ai_total: number;
  etiquetas: string;
  notas?: string;
  archivos_adjuntos: string;
  campos_personalizados?: Json;
}

// Tarea
export interface Tarea {
  id: string;
  proyecto_id: string;
  tarea_padre_id?: string;
  nombre: string;
  descripcion: string;
  tipo_tarea: string;
  estado: string;
  prioridad: string;
  asignado_a_id?: string;
  fecha_inicio?: string;
  fecha_vencimiento?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_completado?: string;
  tiempo_estimado?: number;
  tiempo_real?: number;
  eficiencia?: number;
  total_subtareas: number;
  subtareas_completadas: number;
  progreso_subtareas: number;
  bloqueadores?: string;
  costo_ai: number;
  checklist?: Json;
  etiquetas: string;
  archivos_adjuntos: string;
  posicion_kanban?: number;
}

// Workflow
export interface Workflow {
  id: string;
  nombre: string;
  tipo_proyecto: string;
  descripcion: string;
  fases: Json;
  plantilla_tareas: Json;
  activo: boolean;
  veces_usado: number;
  fecha_creacion: string;
  creado_por: string;
  ultima_actualizacion: string;
}

// Activo Digital
export interface ActivoDigital {
  id: string;
  nombre: string;
  tipo_activo: string;
  categoria: string;
  formato: string;
  tamano: number;
  url_archivo: string;
  thumbnail_url?: string;
  descripcion: string;
  alt_text?: string;
  proyecto_id: string;
  tarea_id?: string;
  creado_por_id: string;
  fecha_creacion: string;
  ultima_modificacion: string;
  modificado_por_id?: string;
  derechos_uso: string;
  licencia: string;
  detalles_licencia?: string;
  proveedor?: string;
  costo_adquisicion?: number;
  fecha_expiracion?: string;
  dimensiones?: string;
  duracion?: number;
  resolucion?: string;
  espacio_color?: string;
  codec?: string;
  etiquetas: string;
  version: string;
  estado: string;
  favorito: boolean;
  veces_usado: number;
  coleccion?: string;
  serie?: string;
  notas?: string;
}

// Transacción
export interface Transaccion {
  id: string;
  proyecto_id: string;
  tarea_id?: string;
  herramienta_ai_id?: string;
  activo_id?: string;
  tipo_transaccion: string;
  categoria: string;
  concepto: string;
  monto: number;
  moneda: string;
  tasa_cambio?: number;
  fecha_transaccion: string;
  metodo_pago?: string;
  estado: string;
  recurrente: boolean;
  frecuencia?: string;
  proxima_fecha?: string;
  proveedor?: string;
  factura_url?: string;
  numero_factura?: string;
  aprobado_por_id?: string;
  fecha_aprobacion?: string;
  requiere_aprobacion: boolean;
  notas?: string;
  etiquetas: string;
  fecha_creacion: string;
  creado_por_id: string;
}

// Herramienta AI
export interface HerramientaAI {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  url: string;
  logo_url?: string;
  url_documentacion?: string;
  tipo_precio: string;
  costo_mensual?: number;
  costo_anual?: number;
  costo_por_uso?: number;
  unidad_uso?: string;
  moneda: string;
  plan_actual?: string;
  fecha_suscripcion?: string;
  fecha_renovacion?: string;
  estado_suscripcion?: string;
  veces_usada: number;
  costo_total_gastado: number;
  roi_herramienta?: number;
  tiempo_ahorrado_estimado?: number;
  productividad_ganada?: number;
  caracteristicas: string;
  limitaciones?: string;
  casos_uso: string;
  rating: number;
  reviews?: string;
  notas?: string;
  favorita: boolean;
  etiquetas: string;
  fecha_agregada: string;
  agregado_por_id: string;
  activa: boolean;
  tiene_api: boolean;
  url_api?: string;
  api_key?: string;
}

// Notificación
export interface Notificacion {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  destinatario_id: string;
  leida: boolean;
  fecha: string;
  enlace?: string;
  metadata?: Json;
}
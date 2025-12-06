// ============================================================
// 🗄️ TIPOS DE BASE DE DATOS - PM/DAM SYSTEM
// ============================================================

// ============================================================
// ENUMS Y TIPOS COMPARTIDOS
// ============================================================

export type UUID = string;
export type Currency = number;
export type Percentage = number;

export enum EstadoProyecto {
    PLANEANDO = 'Planeando',
    EN_PROGRESO = 'En Progreso',
    PAUSADO = 'Pausado',
    COMPLETADO = 'Completado',
    CANCELADO = 'Cancelado',
}

export enum Prioridad {
    BAJA = 'Baja',
    MEDIA = 'Media',
    ALTA = 'Alta',
    CRITICA = 'Crítica',
}

export enum TipoActivo {
    EBOOK = 'Ebook',
    CURSO_ONLINE = 'Curso Online',
    JUEGO = 'Juego Lúdico',
    APP = 'App',
}

export enum EstadoTarea {
    POR_HACER = 'Por Hacer',
    EN_PROGRESO = 'En Progreso',
    EN_REVISION = 'En Revisión',
    BLOQUEADO = 'Bloqueado',
    COMPLETADO = 'Completado',
}

export enum TipoTarea {
    DISENO = 'Diseño',
    DESARROLLO = 'Desarrollo',
    CONTENIDO = 'Contenido',
    REVISION = 'Revisión',
    MARKETING = 'Marketing',
    INVESTIGACION = 'Investigación',
    OTRO = 'Otro',
}

export enum TipoActivoDigital {
    IMAGEN = 'Imagen',
    VIDEO = 'Video',
    AUDIO = 'Audio',
    DOCUMENTO = 'Documento',
    CODIGO = 'Código',
    MODELO_3D = '3D',
    FUENTE = 'Fuente',
    OTRO = 'Otro',
}

export enum DerechosUso {
    USO_LIBRE = 'Uso Libre',
    USO_COMERCIAL = 'Uso Comercial',
    USO_INTERNO = 'Uso Interno',
    CON_LICENCIA = 'Con Licencia',
}

export enum TipoLicencia {
    CREATIVE_COMMONS = 'Creative Commons',
    COPYRIGHT = 'Copyright',
    DOMINIO_PUBLICO = 'Dominio Público',
    PERSONALIZADA = 'Personalizada',
}

export enum EstadoActivo {
    DRAFT = 'Draft',
    APROBADO = 'Aprobado',
    EN_REVISION = 'En Revisión',
    ARCHIVADO = 'Archivado',
}

export enum TipoTransaccion {
    GASTO = 'Gasto',
    INGRESO = 'Ingreso',
}

export enum CategoriaFinanciera {
    SUSCRIPCION = 'Suscripción',
    HERRAMIENTA = 'Herramienta',
    FREELANCE = 'Freelance',
    LICENCIA = 'Licencia',
    MARKETING = 'Marketing',
    OTRO = 'Otro',
}

export enum EstadoTransaccion {
    PENDIENTE = 'Pendiente',
    PAGADO = 'Pagado',
    CANCELADO = 'Cancelado',
    REEMBOLSADO = 'Reembolsado',
}

export enum FrecuenciaRecurrencia {
    MENSUAL = 'Mensual',
    TRIMESTRAL = 'Trimestral',
    ANUAL = 'Anual',
}

export enum MetodoPago {
    TARJETA = 'Tarjeta',
    TRANSFERENCIA = 'Transferencia',
    PAYPAL = 'PayPal',
    STRIPE = 'Stripe',
    OTRO = 'Otro',
}

export enum TipoPrecioAI {
    GRATIS = 'Gratis',
    FREEMIUM = 'Freemium',
    SUSCRIPCION = 'Suscripción',
    PAY_PER_USE = 'Pay-per-use',
    ONE_TIME = 'One-time',
}

export enum EstadoSuscripcion {
    ACTIVA = 'Activa',
    PAUSADA = 'Pausada',
    CANCELADA = 'Cancelada',
    TRIAL = 'Trial',
}

export enum CategoriaAI {
    TEXTO = 'Texto',
    IMAGEN = 'Imagen',
    VIDEO = 'Video',
    AUDIO = 'Audio',
    CODIGO = 'Código',
    ANALISIS = 'Análisis',
    DATOS = 'Datos',
}

// ============================================================
// DB 1: PROYECTOS (Master Projects Database)
// ============================================================

export interface Proyecto {
    // Identificación
    id: UUID;
    nombre: string;
    descripcion: string;
    tipo_activo: TipoActivo;

    // Fechas
    fecha_inicio: Date;
    fecha_deadline: Date;
    fecha_creacion: Date;
    fecha_actualizacion: Date;

    // Estado y prioridad
    estado: EstadoProyecto;
    prioridad: Prioridad;

    // Equipo
    responsable: UUID; // User ID
    equipo: UUID[]; // User IDs

    // Progreso (Calculado con Rollups)
    progreso_total: Percentage; // FÓRMULA: SUM(tareas.completadas) / COUNT(tareas) * 100
    total_tareas: number; // ROLLUP: COUNT(tareas)
    tareas_completadas: number; // ROLLUP: COUNT(tareas WHERE estado = "Completado")
    tareas_en_progreso: number; // ROLLUP: COUNT(tareas WHERE estado = "En Progreso")
    tareas_bloqueadas: number; // ROLLUP: COUNT(tareas WHERE estado = "Bloqueado")

    // Finanzas (Calculado con Rollups)
    presupuesto_asignado: Currency;
    gastos_acumulados: Currency; // ROLLUP: SUM(finanzas.monto WHERE tipo = "Gasto")
    ingresos_totales: Currency; // ROLLUP: SUM(finanzas.monto WHERE tipo = "Ingreso")
    balance_restante: Currency; // FÓRMULA: presupuesto_asignado - gastos_acumulados
    roi_preliminar: Percentage; // FÓRMULA: (ingresos_estimados - gastos_acumulados) / gastos_acumulados * 100
    ingresos_estimados: Currency;

    // Activos (Calculado con Rollups)
    activos_generados: number; // ROLLUP: COUNT(inventario_activos WHERE proyecto_id = this.id)

    // AI Tools (Calculado con Rollups)
    herramientas_ai_usadas: UUID[]; // ROLLUP: UNIQUE(tareas.herramientas_ai)
    costo_ai_total: Currency; // FÓRMULA: SUM(herramientas_ai.costo)

    // Metadatos
    etiquetas: string[];
    notas: string; // Rich Text
    archivos_adjuntos: string[]; // URLs

    // Campos específicos por tipo de activo (opcional)
    campos_personalizados?: Record<string, any>;
}

// Campos adicionales específicos para Ebooks
export interface CamposEbook {
    isbn?: string;
    numero_paginas?: number;
    portada_id?: UUID; // Relación con Activo Digital
    formato_exportacion?: string[]; // PDF, EPUB, MOBI
    autor?: string;
    editorial?: string;
}

// Campos adicionales específicos para Cursos Online
export interface CamposCurso {
    duracion_total?: number; // horas
    numero_modulos?: number;
    numero_lecciones?: number;
    plataforma?: string; // Udemy, Teachable, Propia
    precio_curso?: Currency;
    instructor?: string;
}

// Campos adicionales específicos para Juegos
export interface CamposJuego {
    plataforma_juego?: string[]; // Web, iOS, Android, PC
    genero?: string; // Puzzle, Adventure, Educational
    engine?: string; // Unity, Godot, Phaser
    mecanica_principal?: string;
}

// Campos adicionales específicos para Apps
export interface CamposApp {
    plataforma_app?: string[]; // Web, iOS, Android, Desktop
    stack_tecnologico?: string[];
    tipo_app?: string; // SaaS, E-commerce, Social, Utility
    usuarios_objetivo?: number;
    url_repositorio?: string;
    url_demo?: string;
}

// ============================================================
// DB 2: TAREAS (Tasks & Subtasks Database)
// ============================================================

export interface ChecklistItem {
    id: string;
    item: string;
    completado: boolean;
    orden: number;
}

export interface Comentario {
    id: string;
    usuario: UUID;
    fecha: Date;
    texto: string;
    editado?: boolean;
}

export interface Tarea {
    // Identificación
    id: UUID;
    proyecto_id: UUID; // RELACIÓN → Proyectos (DB 1)
    tarea_padre_id?: UUID; // RELACIÓN → Tarea padre (para subtareas)

    // Información básica
    nombre: string;
    descripcion: string; // Rich Text
    tipo_tarea: TipoTarea;
    estado: EstadoTarea;
    prioridad: Prioridad;

    // Asignación
    asignado_a?: UUID; // User ID
    observadores: UUID[]; // User IDs que siguen la tarea

    // Fechas
    fecha_inicio?: Date;
    fecha_vencimiento?: Date;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
    fecha_completado?: Date;

    // Tiempo
    tiempo_estimado?: number; // horas
    tiempo_real?: number; // horas
    eficiencia?: Percentage; // FÓRMULA: (tiempo_estimado / tiempo_real) * 100

    // Subtareas (Calculado con Rollups)
    subtareas_ids: UUID[]; // RELACIÓN → Subtareas (DB 2)
    total_subtareas: number; // ROLLUP: COUNT(subtareas)
    subtareas_completadas: number; // ROLLUP: COUNT(subtareas WHERE estado = "Completado")
    progreso_subtareas: Percentage; // FÓRMULA: (subtareas_completadas / total_subtareas) * 100

    // Dependencias
    dependencias_ids: UUID[]; // Tareas de las que depende
    bloqueadores: string; // Descripción de bloqueadores

    // AI Tools
    herramientas_ai: UUID[]; // RELACIÓN → AI Directory (DB E)
    costo_ai: Currency; // ROLLUP: SUM(ai_directory.costo WHERE id IN herramientas_ai)

    // Activos generados
    activos_generados: UUID[]; // RELACIÓN → Inventario Activos (DB 4)

    // Checklist y comentarios
    checklist: ChecklistItem[];
    comentarios: Comentario[];

    // Metadatos
    etiquetas: string[];
    archivos_adjuntos: string[]; // URLs
    posicion_kanban?: number; // Para ordenamiento en vista Kanban
}

// ============================================================
// DB 3: FLUJOS DE TRABAJO (Workflows Database)
// ============================================================

export interface FaseWorkflow {
    id: string;
    nombre: string;
    orden: number;
    tareas_template: PlantillaTarea[];
    duracion_estimada?: number; // días
    descripcion?: string;
}

export interface PlantillaTarea {
    nombre: string;
    tipo: TipoTarea;
    duracion_estimada?: number; // horas
    descripcion?: string;
    dependencias?: string[]; // nombres de otras tareas template
    herramientas_ai_sugeridas?: UUID[];
}

export interface Workflow {
    // Identificación
    id: UUID;
    nombre: string;
    tipo_proyecto: TipoActivo;
    descripcion: string; // Rich Text

    // Estructura
    fases: FaseWorkflow[];
    plantilla_tareas: PlantillaTarea[];

    // Metadatos
    activo: boolean;
    veces_usado: number; // contador
    fecha_creacion: Date;
    creado_por: UUID;
    ultima_actualizacion: Date;
}

// ============================================================
// DB 4: INVENTARIO DE ACTIVOS (DAM - Digital Assets Management)
// ============================================================

export interface ActivoDigital {
    // Identificación
    id: UUID;
    nombre: string;
    tipo_activo: TipoActivoDigital;
    categoria: string; // Logo, Banner, Icono, Ilustración, etc.

    // Archivo
    formato: string; // .png, .mp4, .pdf, etc.
    tamaño: number; // MB
    url_archivo: string;
    thumbnail_url?: string;

    // Descripción
    descripcion: string; // Rich Text
    alt_text?: string; // Para accesibilidad

    // Relaciones
    proyecto_id: UUID; // RELACIÓN → Proyectos (DB 1)
    tarea_id?: UUID; // RELACIÓN → Tarea que lo produjo (DB 2)

    // Autoría
    creado_por: UUID; // User ID
    fecha_creacion: Date;
    ultima_modificacion: Date;
    modificado_por?: UUID;

    // Derechos y licencias
    derechos_uso: DerechosUso;
    licencia: TipoLicencia;
    detalles_licencia?: string;
    proveedor?: string; // Proveedor/Autor original
    costo_adquisicion?: Currency;
    fecha_expiracion?: Date; // Para licencias temporales

    // Metadatos técnicos
    dimensiones?: string; // "1920x1080" para imágenes/videos
    duracion?: number; // segundos para audio/video
    resolucion?: string; // "300 DPI"
    espacio_color?: string; // "RGB", "CMYK"
    codec?: string; // Para videos

    // Organización
    etiquetas: string[];
    version: string; // v1.0, v2.3, etc.
    estado: EstadoActivo;
    favorito: boolean;
    veces_usado: number; // Contador de uso

    // Colecciones
    coleccion?: string; // Nombre de colección
    serie?: string; // Si forma parte de una serie

    // Notas
    notas?: string;
}

// ============================================================
// DB 5: FINANZAS (Finance Database)
// ============================================================

export interface Transaccion {
    // Identificación
    id: UUID;

    // Relaciones
    proyecto_id: UUID; // RELACIÓN → Proyectos (DB 1) [OBLIGATORIO]
    tarea_id?: UUID; // RELACIÓN → Tarea asociada (DB 2) [Opcional]
    herramienta_ai_id?: UUID; // RELACIÓN → AI Directory (DB E) [Opcional]
    activo_id?: UUID; // RELACIÓN → Inventario Activos (DB 4) [Opcional]

    // Información básica
    tipo_transaccion: TipoTransaccion;
    categoria: CategoriaFinanciera;
    concepto: string;

    // Monto
    monto: Currency;
    moneda: string; // USD, EUR, MXN
    tasa_cambio?: number; // Si aplica conversión

    // Fecha y método
    fecha_transaccion: Date;
    metodo_pago?: MetodoPago;
    estado: EstadoTransaccion;

    // Recurrencia
    recurrente: boolean;
    frecuencia?: FrecuenciaRecurrencia;
    proxima_fecha?: Date; // Para pagos recurrentes

    // Proveedor
    proveedor?: string;
    factura_url?: string;
    numero_factura?: string;

    // Aprobación
    aprobado_por?: UUID;
    fecha_aprobacion?: Date;
    requiere_aprobacion: boolean;

    // Metadatos
    notas?: string;
    etiquetas: string[];
    fecha_creacion: Date;
    creado_por: UUID;
}

// ============================================================
// DB E: AI DIRECTORY (AI Tools Catalog)
// ============================================================

export interface HerramientaAI {
    // Identificación
    id: UUID;
    nombre: string;
    categoria: CategoriaAI[];
    descripcion: string; // Rich Text

    // Enlaces
    url: string;
    logo_url?: string;
    url_documentacion?: string;

    // Precio
    tipo_precio: TipoPrecioAI;
    costo_mensual?: Currency;
    costo_anual?: Currency;
    costo_por_uso?: Currency;
    unidad_uso?: string; // "por 1000 tokens", "por minuto", etc.
    moneda: string;

    // Suscripción actual
    plan_actual?: string; // Free, Pro, Enterprise
    fecha_suscripcion?: Date;
    fecha_renovacion?: Date;
    estado_suscripcion?: EstadoSuscripcion;

    // Uso (Calculado con Rollups)
    uso_en_tareas: UUID[]; // RELACIÓN → Tareas (DB 2)
    veces_usada: number; // ROLLUP: COUNT(tareas WHERE herramienta_id = this.id)
    proyectos_usada: UUID[]; // ROLLUP: UNIQUE(tareas.proyecto_id)
    costo_total_gastado: Currency; // ROLLUP: SUM(finanzas.monto WHERE herramienta_ai_id = this.id)

    // Métricas
    roi_herramienta?: Percentage; // Calculado manualmente
    tiempo_ahorrado_estimado?: number; // horas
    productividad_ganada?: Percentage;

    // Características
    caracteristicas: string[]; // Features clave
    limitaciones?: string; // Rich Text
    casos_uso: string[];

    // Alternativas
    alternativas_ids: UUID[]; // Otras herramientas similares

    // Evaluación
    rating: number; // 1-5
    reviews?: string; // comentarios del equipo
    notas?: string;

    // Metadatos
    favorita: boolean;
    etiquetas: string[];
    fecha_agregada: Date;
    agregado_por: UUID;
    activa: boolean;

    // Integración
    tiene_api: boolean;
    url_api?: string;
    api_key?: string; // (encriptada)
}

// ============================================================
// TIPOS DE USUARIO
// ============================================================

export enum RolUsuario {
    ADMIN = 'Admin',
    PROJECT_MANAGER = 'Project Manager',
    DESARROLLADOR = 'Desarrollador',
    DISENADOR = 'Diseñador',
    CREADOR_CONTENIDO = 'Creador de Contenido',
    VIEWER = 'Viewer',
}

export interface Usuario {
    id: UUID;
    nombre: string;
    email: string;
    avatar_url?: string;
    rol: RolUsuario;
    departamento?: string;
    activo: boolean;
    fecha_registro: Date;
    ultimo_acceso?: Date;

    // Preferencias
    preferencias?: {
        tema?: 'light' | 'dark';
        idioma?: string;
        notificaciones_email?: boolean;
        notificaciones_push?: boolean;
    };
}

// ============================================================
// TIPOS PARA VISTAS Y DASHBOARDS
// ============================================================

export interface MetricasProyecto {
    proyecto_id: UUID;
    progreso_total: Percentage;
    salud_proyecto: 'Saludable' | 'En Riesgo' | 'Crítico'; // Basado en múltiples factores
    dias_restantes: number;
    tareas_vencidas: number;
    eficiencia_tiempo: Percentage;
    eficiencia_presupuesto: Percentage;
    tendencia_progreso: 'Mejorando' | 'Estable' | 'Empeorando';
}

export interface ResumenFinanciero {
    total_proyectos_activos: number;
    presupuesto_total: Currency;
    gastos_totales: Currency;
    ingresos_totales: Currency;
    balance_global: Currency;
    roi_promedio: Percentage;
    top_gastos: Array<{
        categoria: CategoriaFinanciera;
        monto: Currency;
        porcentaje: Percentage;
    }>;
    proyecciones_mensuales: Currency;
}

export interface EstadisticasAI {
    total_herramientas: number;
    herramientas_activas: number;
    gasto_mensual_ai: Currency;
    gasto_total_ai: Currency;
    herramienta_mas_usada: {
        id: UUID;
        nombre: string;
        veces_usada: number;
    };
    roi_ai_global: Percentage;
}

export interface ResumenActivos {
    total_activos: number;
    activos_por_tipo: Record<TipoActivoDigital, number>;
    espacio_total_usado: number; // GB
    activos_recientes: ActivoDigital[];
    activos_mas_usados: ActivoDigital[];
}

// ============================================================
// TIPOS PARA FILTROS Y BÚSQUEDA
// ============================================================

export interface FiltrosProyecto {
    tipo_activo?: TipoActivo[];
    estado?: EstadoProyecto[];
    prioridad?: Prioridad[];
    responsable?: UUID[];
    fecha_inicio_desde?: Date;
    fecha_inicio_hasta?: Date;
    presupuesto_min?: Currency;
    presupuesto_max?: Currency;
    etiquetas?: string[];
    busqueda?: string; // Búsqueda de texto libre
}

export interface FiltrosTarea {
    proyecto_id?: UUID;
    estado?: EstadoTarea[];
    prioridad?: Prioridad[];
    tipo_tarea?: TipoTarea[];
    asignado_a?: UUID[];
    fecha_vencimiento_desde?: Date;
    fecha_vencimiento_hasta?: Date;
    tiene_bloqueadores?: boolean;
    etiquetas?: string[];
    busqueda?: string;
}

export interface FiltrosActivos {
    tipo_activo?: TipoActivoDigital[];
    proyecto_id?: UUID;
    derechos_uso?: DerechosUso[];
    licencia?: TipoLicencia[];
    estado?: EstadoActivo[];
    favorito?: boolean;
    etiquetas?: string[];
    busqueda?: string;
}

// ============================================================
// TIPOS PARA EXPORTACIÓN Y REPORTES
// ============================================================

export interface ReporteProyecto {
    proyecto: Proyecto;
    metricas: MetricasProyecto;
    tareas: Tarea[];
    finanzas: Transaccion[];
    activos: ActivoDigital[];
    herramientas_ai: HerramientaAI[];
    fecha_generacion: Date;
}

export interface ExportConfig {
    formato: 'PDF' | 'CSV' | 'JSON' | 'XLSX';
    incluir_graficos: boolean;
    incluir_activos: boolean;
    rango_fechas?: {
        inicio: Date;
        fin: Date;
    };
}

// ============================================================
// TIPOS PARA NOTIFICACIONES Y ALERTAS
// ============================================================

export enum TipoNotificacion {
    TAREA_ASIGNADA = 'Tarea Asignada',
    TAREA_VENCIDA = 'Tarea Vencida',
    PROYECTO_COMPLETADO = 'Proyecto Completado',
    PRESUPUESTO_EXCEDIDO = 'Presupuesto Excedido',
    COMENTARIO_NUEVO = 'Comentario Nuevo',
    MENCION = 'Mención',
    ACTUALIZACION_ESTADO = 'Actualización de Estado',
}

export interface Notificacion {
    id: UUID;
    tipo: TipoNotificacion;
    titulo: string;
    mensaje: string;
    destinatario: UUID;
    leida: boolean;
    fecha: Date;
    enlace?: string; // URL para navegar al item relacionado
    metadata?: Record<string, any>;
}

// ============================================================
// TIPOS PARA WEBHOOKS Y INTEGRACIONES
// ============================================================

export interface WebhookConfig {
    id: UUID;
    nombre: string;
    url: string;
    eventos: string[]; // 'proyecto.creado', 'tarea.completada', etc.
    activo: boolean;
    headers?: Record<string, string>;
    secret?: string;
}

export interface IntegracionExterna {
    id: UUID;
    nombre: string; // Slack, Discord, Zapier, etc.
    tipo: string;
    configuracion: Record<string, any>;
    activa: boolean;
    ultimo_sync?: Date;
}

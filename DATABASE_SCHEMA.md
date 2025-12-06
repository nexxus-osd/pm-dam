# 🏗️ Esquema de Base de Datos Maestra - PM/DAM System

> Sistema de Gestión de Proyectos y Activos Digitales  
> Inspirado en: Notion, ClickUp, Airtable, Plane.so

---

## 📊 Arquitectura General

El sistema se basa en **6 bases de datos principales** interconectadas mediante relaciones bidireccionales que permiten:
- ✅ Seguimiento de progreso en tiempo real
- ✅ Cálculo automático de costos y ROI
- ✅ Gestión integral de activos digitales
- ✅ Análisis de uso de herramientas AI

---

## 🗄️ Base de Datos 1: PROYECTOS (Master Projects DB)

### Campos Principales

| Campo | Tipo | Descripción | Fórmula/Rollup |
|-------|------|-------------|----------------|
| `id` | UUID | Identificador único | - |
| `nombre` | String | Nombre del proyecto | - |
| `descripcion` | Text | Descripción detallada | - |
| `tipo_activo` | Select | Ebook, Curso Online, Juego, App | - |
| `fecha_inicio` | Date | Fecha de inicio | - |
| `fecha_deadline` | Date | Fecha límite | - |
| `estado` | Select | Planeando, En Progreso, Pausado, Completado, Cancelado | - |
| `prioridad` | Select | Baja, Media, Alta, Crítica | - |
| `responsable` | User | Usuario responsable | - |
| `equipo` | Array[User] | Equipo asignado | - |
| `progreso_total` | Number (%) | **FÓRMULA**: Rollup de tareas completadas | `=SUM(tareas.completadas) / COUNT(tareas) * 100` |
| `total_tareas` | Number | **ROLLUP**: Conteo de tareas | `=COUNT(tareas_vinculadas)` |
| `tareas_completadas` | Number | **ROLLUP**: Tareas completadas | `=COUNTIF(tareas.estado, "Completado")` |
| `presupuesto_asignado` | Currency | Presupuesto total | - |
| `gastos_acumulados` | Currency | **ROLLUP**: Suma de gastos | `=SUM(finanzas.monto WHERE proyecto_id = this.id)` |
| `balance_restante` | Currency | **FÓRMULA**: Presupuesto disponible | `=presupuesto_asignado - gastos_acumulados` |
| `roi_preliminar` | Number (%) | **FÓRMULA**: ROI estimado | `=(ingresos_estimados - gastos_acumulados) / gastos_acumulados * 100` |
| `ingresos_estimados` | Currency | Ingresos proyectados | - |
| `activos_generados` | Number | **ROLLUP**: Conteo de activos | `=COUNT(inventario_activos WHERE proyecto_id = this.id)` |
| `herramientas_ai_usadas` | Array | **ROLLUP**: Herramientas AI utilizadas | `=UNIQUE(tareas.herramientas_ai)` |
| `costo_ai_total` | Currency | **FÓRMULA**: Costo total AI | `=SUM(ai_directory.costo WHERE id IN herramientas_ai_usadas)` |
| `etiquetas` | Multi-Select | Etiquetas personalizadas | - |
| `notas` | Rich Text | Notas adicionales | - |
| `archivos_adjuntos` | Files | Documentos relacionados | - |

### Relaciones
- **Tiene muchas** → Tareas (DB 2)
- **Tiene muchas** → Transacciones Financieras (DB 5)
- **Tiene muchas** → Activos Digitales (DB 4)
- **Usa muchas** → Herramientas AI (DB E)

---

## 🗄️ Base de Datos 2: TAREAS (Tasks & Subtasks DB)

### Campos Principales

| Campo | Tipo | Descripción | Fórmula/Rollup |
|-------|------|-------------|----------------|
| `id` | UUID | Identificador único | - |
| `proyecto_id` | Relation | **RELACIÓN** → Proyectos (DB 1) | - |
| `tarea_padre_id` | Relation | **RELACIÓN** → Tarea padre (para subtareas) | - |
| `nombre` | String | Nombre de la tarea | - |
| `descripcion` | Rich Text | Descripción detallada | - |
| `tipo_tarea` | Select | Diseño, Desarrollo, Contenido, Revisión, Marketing, etc. | - |
| `estado` | Select | Por Hacer, En Progreso, En Revisión, Bloqueado, Completado | - |
| `prioridad` | Select | Baja, Media, Alta, Crítica | - |
| `asignado_a` | User | Responsable | - |
| `fecha_inicio` | Date | Fecha de inicio | - |
| `fecha_vencimiento` | Date | Fecha límite | - |
| `tiempo_estimado` | Number (hours) | Horas estimadas | - |
| `tiempo_real` | Number (hours) | Horas trabajadas | - |
| `subtareas` | Relation | **RELACIÓN** → Subtareas (DB 2) | - |
| `progreso_subtareas` | Number (%) | **FÓRMULA**: Progreso de subtareas | `=COUNT(subtareas WHERE estado = "Completado") / COUNT(subtareas) * 100` |
| `dependencias` | Relation | Tareas de las que depende | - |
| `bloqueadores` | Rich Text | Descripción de bloqueadores | - |
| `herramientas_ai` | Multi-Relation | **RELACIÓN** → AI Directory (DB E) | - |
| `costo_ai` | Currency | **ROLLUP**: Costo de AI usadas | `=SUM(ai_directory.costo WHERE id IN herramientas_ai)` |
| `activos_generados` | Multi-Relation | **RELACIÓN** → Inventario Activos (DB 4) | - |
| `etiquetas` | Multi-Select | Etiquetas | - |
| `checklist` | Array[Object] | Lista de verificación | `[{item: string, completado: boolean}]` |
| `comentarios` | Array[Object] | Comentarios del equipo | `[{usuario, fecha, texto}]` |
| `archivos_adjuntos` | Files | Archivos relacionados | - |

### Relaciones
- **Pertenece a** → Proyecto (DB 1)
- **Puede tener** → Subtareas (DB 2 - auto-relación)
- **Genera** → Activos Digitales (DB 4)
- **Utiliza** → Herramientas AI (DB E)
- **Puede tener** → Gastos asociados (DB 5)

---

## 🗄️ Base de Datos 3: FLUJOS DE TRABAJO (Workflows DB)

### Campos Principales

| Campo | Tipo | Descripción | Fórmula/Rollup |
|-------|------|-------------|----------------|
| `id` | UUID | Identificador único | - |
| `nombre` | String | Nombre del flujo | - |
| `tipo_proyecto` | Select | Ebook, Curso Online, Juego, App | - |
| `descripcion` | Rich Text | Descripción del flujo | - |
| `fases` | Array[Object] | Fases del workflow | `[{nombre, orden, tareas_template}]` |
| `plantilla_tareas` | Array[Object] | Tareas predefinidas | `[{nombre, tipo, duración_estimada}]` |
| `activo` | Boolean | Workflow activo | - |

### Relaciones
- **Se aplica a** → Proyectos (DB 1)
- **Define** → Plantillas de Tareas (DB 2)

---

## 🗄️ Base de Datos 4: INVENTARIO DE ACTIVOS (DAM - Digital Assets Management)

### Campos Principales

| Campo | Tipo | Descripción | Fórmula/Rollup |
|-------|------|-------------|----------------|
| `id` | UUID | Identificador único | - |
| `nombre` | String | Nombre del activo | - |
| `tipo_activo` | Select | Imagen, Video, Audio, Documento, Código, 3D, Fuente, Otro | - |
| `categoria` | Select | Logo, Banner, Icono, Ilustración, Fotografía, etc. | - |
| `formato` | String | Extensión del archivo | `.png, .mp4, .pdf, etc.` |
| `tamaño` | Number (MB) | Tamaño del archivo | - |
| `url_archivo` | URL | Ruta del archivo | - |
| `thumbnail_url` | URL | Miniatura | - |
| `descripcion` | Rich Text | Descripción del activo | - |
| `proyecto_id` | Relation | **RELACIÓN** → Proyectos (DB 1) | - |
| `tarea_id` | Relation | **RELACIÓN** → Tarea que lo produjo (DB 2) | - |
| `creado_por` | User | Usuario creador | - |
| `fecha_creacion` | Date | Fecha de creación | - |
| `ultima_modificacion` | Date | Última modificación | - |
| `derechos_uso` | Select | Uso Libre, Uso Comercial, Uso Interno, Con Licencia | - |
| `licencia` | Select | Creative Commons, Copyright, Dominio Público, Personalizada | - |
| `detalles_licencia` | Rich Text | Detalles adicionales | - |
| `proveedor` | String | Proveedor/Autor original | - |
| `costo_adquisicion` | Currency | Costo del activo (si aplica) | - |
| `fecha_expiracion` | Date | Fecha de expiración de licencia | - |
| `dimensiones` | String | Dimensiones (para imágenes/videos) | `1920x1080` |
| `duracion` | Number (seconds) | Duración (para audio/video) | - |
| `etiquetas` | Multi-Select | Etiquetas de búsqueda | - |
| `version` | String | Versión del activo | `v1.0, v2.3, etc.` |
| `estado` | Select | Draft, Aprobado, En Revisión, Archivado | - |
| `favorito` | Boolean | Marcado como favorito | - |
| `veces_usado` | Number | **ROLLUP**: Contador de uso | Auto-incrementa |

### Relaciones
- **Pertenece a** → Proyecto (DB 1)
- **Creado por** → Tarea (DB 2)
- **Puede vincularse con** → Gastos (DB 5) si fue adquirido

---

## 🗄️ Base de Datos 5: FINANZAS (Finance DB)

### Campos Principales

| Campo | Tipo | Descripción | Fórmula/Rollup |
|-------|------|-------------|----------------|
| `id` | UUID | Identificador único | - |
| `proyecto_id` | Relation | **RELACIÓN** → Proyectos (DB 1) | - |
| `tarea_id` | Relation | **RELACIÓN** → Tarea asociada (DB 2) [Opcional] | - |
| `tipo_transaccion` | Select | Gasto, Ingreso | - |
| `categoria` | Select | Suscripción, Herramienta, Freelance, Licencia, Marketing, Otro | - |
| `concepto` | String | Descripción del gasto/ingreso | - |
| `monto` | Currency | Cantidad | - |
| `moneda` | Select | USD, EUR, MXN, etc. | - |
| `fecha_transaccion` | Date | Fecha de la transacción | - |
| `metodo_pago` | Select | Tarjeta, Transferencia, PayPal, Stripe, etc. | - |
| `estado` | Select | Pendiente, Pagado, Cancelado, Reembolsado | - |
| `recurrente` | Boolean | Es recurrente | - |
| `frecuencia` | Select | Mensual, Anual, Trimestral | (si recurrente = true) |
| `proveedor` | String | Nombre del proveedor | - |
| `factura_url` | URL | Enlace a factura | - |
| `herramienta_ai_id` | Relation | **RELACIÓN** → AI Directory (DB E) [Opcional] | - |
| `activo_id` | Relation | **RELACIÓN** → Inventario Activos (DB 4) [Opcional] | Si se compró un activo |
| `aprobado_por` | User | Usuario que aprobó | - |
| `notas` | Rich Text | Notas adicionales | - |
| `etiquetas` | Multi-Select | Etiquetas | - |

### Relaciones
- **Vinculado a** → Proyecto (DB 1) [OBLIGATORIO]
- **Puede vincular** → Tarea (DB 2) [Opcional]
- **Puede vincular** → Herramienta AI (DB E) [Opcional]
- **Puede vincular** → Activo Digital (DB 4) [Opcional]

---

## 🗄️ Base de Datos E: AI DIRECTORY (AI Tools Catalog)

### Campos Principales

| Campo | Tipo | Descripción | Fórmula/Rollup |
|-------|------|-------------|----------------|
| `id` | UUID | Identificador único | - |
| `nombre` | String | Nombre de la herramienta | `ChatGPT, Midjourney, Claude, etc.` |
| `categoria` | Multi-Select | Texto, Imagen, Video, Audio, Código, Análisis | - |
| `descripcion` | Rich Text | Descripción de la herramienta | - |
| `url` | URL | Sitio web oficial | - |
| `logo_url` | URL | Logo de la herramienta | - |
| `tipo_precio` | Select | Gratis, Freemium, Suscripción, Pay-per-use, One-time | - |
| `costo_mensual` | Currency | Costo mensual (si aplica) | - |
| `costo_anual` | Currency | Costo anual (si aplica) | - |
| `costo_por_uso` | Currency | Costo por uso (si aplica) | - |
| `plan_actual` | String | Plan contratado | `Free, Pro, Enterprise` |
| `fecha_suscripcion` | Date | Fecha de inicio de suscripción | - |
| `fecha_renovacion` | Date | Fecha de renovación | - |
| `estado_suscripcion` | Select | Activa, Pausada, Cancelada, Trial | - |
| `uso_en_tareas` | Relation | **RELACIÓN** → Tareas (DB 2) | - |
| `veces_usada` | Number | **ROLLUP**: Contador de uso | `=COUNT(tareas WHERE herramienta_id = this.id)` |
| `proyectos_usada` | Multi-Relation | **ROLLUP**: Proyectos donde se usó | `=UNIQUE(tareas.proyecto_id WHERE herramienta_id = this.id)` |
| `costo_total_gastado` | Currency | **FÓRMULA**: Total gastado | `=SUM(finanzas.monto WHERE herramienta_ai_id = this.id)` |
| `roi_herramienta` | Number (%) | **FÓRMULA**: ROI de la herramienta | Calculado manualmente o por métricas |
| `caracteristicas` | Array[String] | Características clave | - |
| `limitaciones` | Rich Text | Limitaciones conocidas | - |
| `alternativas` | Multi-Relation | Otras herramientas similares | - |
| `rating` | Number (1-5) | Calificación interna | - |
| `notas` | Rich Text | Notas de uso | - |
| `favorita` | Boolean | Marcada como favorita | - |
| `etiquetas` | Multi-Select | Etiquetas | - |

### Relaciones
- **Usada en** → Tareas (DB 2)
- **Aparece en** → Proyectos (DB 1) [via Tareas]
- **Tiene** → Gastos asociados (DB 5)

---

## 🔗 Resumen de Relaciones Clave

```
┌─────────────┐
│  PROYECTOS  │ (DB 1)
│   (Master)  │
└──────┬──────┘
       │
       ├──────────► TAREAS (DB 2)
       │            │
       │            ├──────► Subtareas (DB 2 - auto-relación)
       │            │
       │            ├──────► ACTIVOS (DB 4)
       │            │
       │            └──────► AI TOOLS (DB E)
       │
       ├──────────► FINANZAS (DB 5)
       │            │
       │            ├──────► AI TOOLS (DB E)
       │            │
       │            └──────► ACTIVOS (DB 4)
       │
       ├──────────► ACTIVOS (DB 4)
       │
       └──────────► WORKFLOWS (DB 3)
```

---

## 📈 Fórmulas Clave para Cálculos en Tiempo Real

### 1. Progreso Total del Proyecto
```javascript
progreso_total = (tareas_completadas / total_tareas) * 100
```

### 2. Balance Financiero
```javascript
balance_restante = presupuesto_asignado - gastos_acumulados
```

### 3. ROI Preliminar
```javascript
roi_preliminar = ((ingresos_estimados - gastos_acumulados) / gastos_acumulados) * 100
```

### 4. Costo de AI por Proyecto
```javascript
costo_ai_total = SUM(
  ai_directory.costo 
  WHERE ai_directory.id IN (
    SELECT DISTINCT tarea.herramienta_ai_id 
    FROM tareas 
    WHERE tarea.proyecto_id = proyecto.id
  )
)
```

### 5. Eficiencia de Tiempo
```javascript
eficiencia = (tiempo_estimado_total / tiempo_real_total) * 100
```

---

## 🎯 Módulos de Creación de Activos

### 1️⃣ Módulo EBOOKS
**Tipo de Proyecto**: Ebook  
**Workflow predefinido**:
- Fase 1: Planificación (Concept, Outline, Research)
- Fase 2: Escritura (Chapters, Content Creation)
- Fase 3: Diseño (Cover Design, Layout, Formatting)
- Fase 4: Revisión (Editing, Proofreading)
- Fase 5: Publicación (Export, Distribution)

**Campos adicionales específicos**:
- `isbn`: String
- `numero_paginas`: Number
- `portada_id`: Relation → Activos (DB 4)
- `formato_exportacion`: Multi-Select (PDF, EPUB, MOBI)

### 2️⃣ Módulo CURSOS ONLINE
**Tipo de Proyecto**: Curso Online  
**Workflow predefinido**:
- Fase 1: Diseño Instruccional
- Fase 2: Creación de Contenido
- Fase 3: Producción de Videos
- Fase 4: Desarrollo de Plataforma
- Fase 5: Testing & Launch

**Campos adicionales específicos**:
- `duracion_total`: Number (hours)
- `numero_modulos`: Number
- `numero_lecciones`: Number
- `plataforma`: Select (Udemy, Teachable, Propia)
- `precio_curso`: Currency

### 3️⃣ Módulo JUEGOS LÚDICOS
**Tipo de Proyecto**: Juego  
**Workflow predefinido**:
- Fase 1: Concepto y GDD (Game Design Document)
- Fase 2: Arte y Assets
- Fase 3: Programación
- Fase 4: Testing
- Fase 5: Launch

**Campos adicionales específicos**:
- `plataforma_juego`: Multi-Select (Web, iOS, Android, PC)
- `genero`: Select (Puzzle, Adventure, Educational, etc.)
- `engine`: Select (Unity, Godot, Phaser, Custom)
- `mecanica_principal`: String

### 4️⃣ Módulo DESARROLLO DE APPS
**Tipo de Proyecto**: App  
**Workflow predefinido**:
- Fase 1: Discovery & Planning
- Fase 2: UI/UX Design
- Fase 3: Desarrollo Frontend
- Fase 4: Desarrollo Backend
- Fase 5: Testing & QA
- Fase 6: Deployment

**Campos adicionales específicos**:
- `plataforma_app`: Multi-Select (Web, iOS, Android, Desktop)
- `stack_tecnologico`: Array[String]
- `tipo_app`: Select (SaaS, E-commerce, Social, Utility)
- `usuarios_objetivo`: Number

---

## 🧮 Ejemplo de Uso: Proyecto Completo

### Proyecto: "Ebook de Productividad con IA"

#### DB 1 - PROYECTOS
```json
{
  "id": "proj_001",
  "nombre": "Ebook: Productividad con IA",
  "tipo_activo": "Ebook",
  "estado": "En Progreso",
  "presupuesto_asignado": 5000,
  "gastos_acumulados": 1850,  // ROLLUP de DB 5
  "balance_restante": 3150,    // FÓRMULA
  "progreso_total": 65,        // ROLLUP de DB 2
  "total_tareas": 23,          // ROLLUP de DB 2
  "tareas_completadas": 15,    // ROLLUP de DB 2
  "activos_generados": 12,     // ROLLUP de DB 4
  "costo_ai_total": 450        // FÓRMULA desde DB E
}
```

#### DB 2 - TAREAS (ejemplo)
```json
{
  "id": "task_001",
  "proyecto_id": "proj_001",
  "nombre": "Diseño de portada",
  "estado": "Completado",
  "herramientas_ai": ["ai_003"], // Midjourney
  "costo_ai": 30,                // ROLLUP de DB E
  "activos_generados": ["asset_001"] // Cover final
}
```

#### DB 4 - INVENTARIO ACTIVOS (ejemplo)
```json
{
  "id": "asset_001",
  "nombre": "Portada Principal - Ebook Productividad",
  "tipo_activo": "Imagen",
  "formato": ".png",
  "proyecto_id": "proj_001",
  "tarea_id": "task_001",
  "derechos_uso": "Uso Comercial",
  "licencia": "Copyright",
  "url_archivo": "/assets/covers/ebook-prod-ai-cover.png"
}
```

#### DB 5 - FINANZAS (ejemplo)
```json
{
  "id": "fin_001",
  "proyecto_id": "proj_001",
  "tarea_id": "task_001",
  "tipo_transaccion": "Gasto",
  "categoria": "Herramienta",
  "concepto": "Suscripción Midjourney Pro",
  "monto": 30,
  "herramienta_ai_id": "ai_003"
}
```

#### DB E - AI DIRECTORY (ejemplo)
```json
{
  "id": "ai_003",
  "nombre": "Midjourney",
  "categoria": ["Imagen"],
  "tipo_precio": "Suscripción",
  "costo_mensual": 30,
  "veces_usada": 47,           // ROLLUP de DB 2
  "costo_total_gastado": 180   // ROLLUP de DB 5
}
```

---

## 🎨 Puntos Clave de Implementación

### ✅ Integridad Referencial
- Toda **tarea** debe pertenecer a un **proyecto**
- Todo **gasto** debe vincularse a un **proyecto** (mínimo)
- Todo **activo final** debe vincularse a la **tarea** que lo produjo

### ✅ Rollups Automáticos
- Los campos calculados se actualizan en tiempo real
- Usar triggers/listeners para mantener sincronización

### ✅ Validaciones
- `balance_restante` no debe ser negativo (alerta)
- `fecha_vencimiento` de tareas no debe exceder `fecha_deadline` del proyecto
- `gastos_acumulados` actualiza automáticamente al crear transacción

### ✅ Índices Recomendados
- `proyectos.id`
- `tareas.proyecto_id`
- `finanzas.proyecto_id`
- `activos.proyecto_id`
- `ai_directory.id`

---

## 🚀 Próximos Pasos Sugeridos

1. **Implementar esquema de DB** (PostgreSQL, MongoDB, o Supabase recomendado)
2. **Crear TypeScript Interfaces** para type-safety
3. **Desarrollar Context/Store** para gestión de estado
4. **Implementar Queries con Rollups** usando ORMs (Prisma, TypeORM)
5. **Crear Dashboard de Analytics** con todas las métricas calculadas

---

**Documento creado**: 2025-12-05  
**Versión**: 1.0  
**Sistema**: PM/DAM Consolidado

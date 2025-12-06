# 🎨 Diagramas Visuales del Sistema PM/DAM

## 📐 Diagrama Entidad-Relación (ER) Completo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             SISTEMA PM/DAM                                   │
│                    (Project Management / Digital Asset Management)          │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                           👥 USUARIOS                                       │
├────────────────────────────────────────────────────────────────────────────┤
│ • id (PK)                                                                   │
│ • nombre, email, avatar                                                     │
│ • rol (Admin, PM, Dev, Designer, Content Creator, Viewer)                  │
│ • departamento, activo                                                      │
│ • preferencias (JSON)                                                       │
└───┬────────────────────────────────────────────────────────────────────────┘
    │
    │ responsable_id
    │ (1:N)
    ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                       📁 PROYECTOS (Master DB)                              │
├────────────────────────────────────────────────────────────────────────────┤
│ • id (PK)                                                                   │
│ • nombre, descripcion, tipo_activo                                          │
│ • estado, prioridad, fechas                                                 │
│                                                                             │
│ 📊 CALCULADO CON ROLLUPS:                                                  │
│ • progreso_total ← COUNT(tareas completadas) / COUNT(tareas)              │
│ • total_tareas ← COUNT(tareas)                                             │
│ • tareas_completadas ← COUNT(tareas WHERE estado = "Completado")          │
│ • gastos_acumulados ← SUM(transacciones.monto WHERE tipo = "Gasto")       │
│ • balance_restante ← presupuesto - gastos_acumulados                       │
│ • roi_preliminar ← (ingresos_estimados - gastos) / gastos * 100           │
│ • activos_generados ← COUNT(activos_digitales)                             │
│ • costo_ai_total ← SUM(herramientas_ai.costo)                              │
│                                                                             │
│ • campos_personalizados (JSON) → Específicos por tipo                      │
└───┬──────────┬──────────┬──────────┬───────────────────────────────────────┘
    │          │          │          │
    │          │          │          │
    │(1:N)     │(1:N)     │(1:N)     │(N:M via ProyectoWorkflow)
    │          │          │          │
    ▼          ▼          ▼          ▼
┌─────────┐ ┌────────┐ ┌─────────┐ ┌──────────────┐
│ TAREAS  │ │ACTIVOS │ │FINANZAS │ │  WORKFLOWS   │
│         │ │ (DAM)  │ │         │ │              │
└─────────┘ └────────┘ └─────────┘ └──────────────┘
    │
    │
    ▼

┌────────────────────────────────────────────────────────────────────────────┐
│                      ✅ TAREAS & SUBTAREAS                                  │
├────────────────────────────────────────────────────────────────────────────┤
│ • id (PK)                                                                   │
│ • proyecto_id (FK) → PROYECTOS                                              │
│ • tarea_padre_id (FK) → TAREAS (auto-relación para subtareas)              │
│ • nombre, descripcion, tipo_tarea                                           │
│ • estado, prioridad, asignado_a_id (FK → Usuarios)                         │
│ • fechas (inicio, vencimiento, creación, completado)                       │
│ • tiempo_estimado, tiempo_real, eficiencia                                  │
│                                                                             │
│ 📊 CALCULADO:                                                               │
│ • total_subtareas ← COUNT(subtareas)                                       │
│ • subtareas_completadas ← COUNT(subtareas WHERE estado = "Completado")    │
│ • progreso_subtareas ← subtareas_completadas / total_subtareas * 100      │
│ • costo_ai ← SUM(herramientas_ai.costo)                                    │
│ • eficiencia ← tiempo_estimado / tiempo_real * 100                         │
│                                                                             │
│ • checklist (JSON Array)                                                    │
│ • comentarios (Relación 1:N → Comentarios)                                 │
│ • dependencias (N:M via TareaDependencia)                                  │
│ • bloqueadores (texto)                                                      │
└───┬────────────┬─────────────┬─────────────────────────────────────────────┘
    │            │             │
    │(N:M)       │(1:N)        │(N:M via TareaObservador)
    │            │             │
    ▼            ▼             ▼
┌──────────┐ ┌─────────┐  ┌──────────┐
│HERRAMIENT│ │ ACTIVOS │  │OBSERVADO-│
│AS AI     │ │GENERADOS│  │  RES     │
└──────────┘ └─────────┘  └──────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                    📦 ACTIVOS DIGITALES (DAM)                               │
├────────────────────────────────────────────────────────────────────────────┤
│ • id (PK)                                                                   │
│ • nombre, tipo_activo, categoria, formato                                   │
│ • tamaño, url_archivo, thumbnail_url                                        │
│ • descripcion, alt_text                                                     │
│                                                                             │
│ RELACIONES:                                                                 │
│ • proyecto_id (FK) → PROYECTOS [OBLIGATORIO]                               │
│ • tarea_id (FK) → TAREAS [OPCIONAL - tarea que lo produjo]                │
│ • creado_por_id (FK) → USUARIOS                                            │
│                                                                             │
│ DERECHOS Y LICENCIAS:                                                       │
│ • derechos_uso (Libre, Comercial, Interno, Con Licencia)                  │
│ • licencia (CC, Copyright, Dominio Público, Personalizada)                │
│ • detalles_licencia, proveedor                                             │
│ • costo_adquisicion, fecha_expiracion                                      │
│                                                                             │
│ METADATOS TÉCNICOS:                                                         │
│ • dimensiones (1920x1080)                                                  │
│ • duracion (segundos para video/audio)                                     │
│ • resolucion, espacio_color, codec                                         │
│                                                                             │
│ ORGANIZACIÓN:                                                               │
│ • version, estado, favorito, veces_usado                                   │
│ • coleccion, serie, etiquetas[]                                            │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                        💰 FINANZAS (Transacciones)                          │
├────────────────────────────────────────────────────────────────────────────┤
│ • id (PK)                                                                   │
│ • tipo_transaccion (Gasto / Ingreso)                                       │
│ • categoria, concepto, monto, moneda                                        │
│ • fecha_transaccion, metodo_pago, estado                                   │
│                                                                             │
│ RELACIONES MÚLTIPLES:                                                       │
│ • proyecto_id (FK) → PROYECTOS [OBLIGATORIO]                               │
│ • tarea_id (FK) → TAREAS [OPCIONAL]                                        │
│ • herramienta_ai_id (FK) → HERRAMIENTAS_AI [OPCIONAL]                      │
│ • activo_id (FK) → ACTIVOS_DIGITALES [OPCIONAL]                            │
│                                                                             │
│ RECURRENCIA:                                                                │
│ • recurrente (boolean)                                                      │
│ • frecuencia (Mensual, Trimestral, Anual)                                  │
│ • proxima_fecha                                                             │
│                                                                             │
│ APROBACIÓN:                                                                 │
│ • requiere_aprobacion, aprobado_por_id                                     │
│ • fecha_aprobacion                                                          │
│                                                                             │
│ • proveedor, factura_url, numero_factura                                   │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                    🤖 AI DIRECTORY (Catálogo de AI)                         │
├────────────────────────────────────────────────────────────────────────────┤
│ • id (PK)                                                                   │
│ • nombre, categoria[], descripcion                                          │
│ • url, logo_url, url_documentacion                                          │
│                                                                             │
│ PRECIOS:                                                                    │
│ • tipo_precio (Gratis, Freemium, Suscripción, Pay-per-use, One-time)      │
│ • costo_mensual, costo_anual, costo_por_uso                                │
│ • unidad_uso, moneda                                                        │
│                                                                             │
│ SUSCRIPCIÓN ACTUAL:                                                         │
│ • plan_actual, fecha_suscripcion, fecha_renovacion                         │
│ • estado_suscripcion (Activa, Pausada, Cancelada, Trial)                  │
│                                                                             │
│ 📊 CALCULADO CON ROLLUPS:                                                  │
│ • veces_usada ← COUNT(tareas WHERE herramienta_id = this.id)              │
│ • proyectos_usada[] ← UNIQUE(tareas.proyecto_id)                           │
│ • costo_total_gastado ← SUM(transacciones.monto WHERE herramienta = this) │
│                                                                             │
│ MÉTRICAS:                                                                   │
│ • roi_herramienta (%), tiempo_ahorrado_estimado                            │
│ • productividad_ganada (%)                                                  │
│                                                                             │
│ • caracteristicas[], limitaciones, casos_uso[]                             │
│ • rating (1-5), reviews, notas                                             │
│ • alternativas (N:M via AlternativaAI)                                     │
│                                                                             │
│ INTEGRACIÓN:                                                                │
│ • tiene_api, url_api, api_key (encriptada)                                │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                      🔄 WORKFLOWS (Plantillas)                              │
├────────────────────────────────────────────────────────────────────────────┤
│ • id (PK)                                                                   │
│ • nombre, tipo_proyecto, descripcion                                        │
│                                                                             │
│ ESTRUCTURA (JSON):                                                          │
│ • fases: [                                                                  │
│     {                                                                       │
│       nombre: "Planificación",                                             │
│       orden: 1,                                                             │
│       tareas_template: [...],                                              │
│       duracion_estimada: 7 (días)                                          │
│     }                                                                       │
│   ]                                                                         │
│                                                                             │
│ • plantilla_tareas: [                                                       │
│     {                                                                       │
│       nombre: "Crear outline",                                             │
│       tipo: "Contenido",                                                    │
│       duracion_estimada: 4 (horas),                                        │
│       dependencias: ["tarea_anterior"],                                    │
│       herramientas_ai_sugeridas: ["chatgpt"]                               │
│     }                                                                       │
│   ]                                                                         │
│                                                                             │
│ • activo, veces_usado, fecha_creacion                                      │
│ • creado_por                                                                │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Actualización Automática (Triggers)

```
┌───────────────────────────────────────────────────────────────┐
│              EVENTO: Usuario completa una tarea                │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ UPDATE Tarea       │
        │ estado = "Completado"│
        └────────┬───────────┘
                 │
                 ▼
        ┌─────────────────────────────────────┐
        │ TRIGGER 1: Actualizar Progreso      │
        │ de Subtareas (si es tarea padre)    │
        └────────┬────────────────────────────┘
                 │
                 ▼
        ┌─────────────────────────────────────┐
        │ TRIGGER 2: Actualizar Proyecto      │
        │ • tareas_completadas += 1           │
        │ • progreso_total = CALC()           │
        └────────┬────────────────────────────┘
                 │
                 ▼
        ┌─────────────────────────────────────┐
        │ TRIGGER 3: Verificar Dependencias   │
        │ ¿Hay tareas bloqueadas?             │
        │ → Desbloquear si todas deps OK     │
        └────────┬────────────────────────────┘
                 │
                 ▼
        ┌─────────────────────────────────────┐
        │ TRIGGER 4: Calcular Salud Proyecto  │
        │ → Saludable / En Riesgo / Crítico  │
        └────────┬────────────────────────────┘
                 │
                 ▼
        ┌─────────────────────────────────────┐
        │ TRIGGER 5: Enviar Notificaciones    │
        │ • Al Project Manager                │
        │ • A dependencias desbloqueadas      │
        └─────────────────────────────────────┘
```

---

## 💰 Flujo de Registro de Gasto

```
┌──────────────────────────────────────────────────────┐
│   Usuario registra un gasto de suscripción AI       │
│   Ej: Midjourney Pro - $30/mes                       │
└───────────────┬──────────────────────────────────────┘
                │
                ▼
       ┌─────────────────────┐
       │ CREATE Transaccion  │
       │ • proyecto_id       │
       │ • herramienta_ai_id │
       │ • monto: 30         │
       └──────┬──────────────┘
              │
              ▼
       ┌──────────────────────────────────┐
       │ TRIGGER 1: Actualizar Proyecto   │
       │ • gastos_acumulados += 30        │
       │ • balance_restante -= 30         │
       │ • roi_preliminar = RECALC()      │
       └──────┬───────────────────────────┘
              │
              ▼
       ┌──────────────────────────────────┐
       │ TRIGGER 2: Actualizar Herramienta│
       │ • costo_total_gastado += 30      │
       └──────┬───────────────────────────┘
              │
              ▼
       ┌──────────────────────────────────┐
       │ TRIGGER 3: Verificar Alertas     │
       │ ¿balance_restante < 10%?         │
       │ → Enviar alerta de presupuesto   │
       └──────────────────────────────────┘
```

---

## 🎨 Flujo de Creación de Activo Digital

```
┌──────────────────────────────────────────────────────┐
│   Designer crea una portada usando Midjourney       │
└───────────────┬──────────────────────────────────────┘
                │
                ▼
       ┌─────────────────────┐
       │ 1. Vincular AI Tool │
       │ TareaHerramientaAI  │
       │ tarea ↔ Midjourney  │
       └──────┬──────────────┘
              │
              ▼
       ┌──────────────────────────────────┐
       │ 2. CREATE ActivoDigital          │
       │ • nombre: "Portada Ebook"        │
       │ • proyecto_id                    │
       │ • tarea_id (que lo generó)       │
       │ • url_archivo                    │
       │ • derechos_uso                   │
       └──────┬───────────────────────────┘
              │
              ▼
       ┌──────────────────────────────────┐
       │ TRIGGER 1: Actualizar Proyecto   │
       │ • activos_generados += 1         │
       └──────┬───────────────────────────┘
              │
              ▼
       ┌──────────────────────────────────┐
       │ TRIGGER 2: Actualizar Tarea      │
       │ • activos_generados[] ← asset.id │
       └──────┬───────────────────────────┘
              │
              ▼
       ┌──────────────────────────────────┐
       │ TRIGGER 3: Actualizar AI Tool    │
       │ • veces_usada += 1               │
       │ • proyectos_usada[] ← proyecto.id│
       └──────────────────────────────────┘
```

---

## 📊 Vista de Dashboard en Tiempo Real

```
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD DEL PROYECTO                        │
│                    "Ebook: Productividad con IA"                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 PROGRESO GENERAL                                             │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ ████████████████░░░░░░░░░░░░░░░░ 65%                │       │
│  │ 15 de 23 tareas completadas                          │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  💼 TAREAS                    │  💰 FINANZAS                     │
│  ┌─────────────────────┐      │  ┌─────────────────────┐        │
│  │ ✅ Completadas: 15  │      │  │ 💵 Presupuesto: $5,000│       │
│  │ 🔄 En Progreso: 5   │      │  │ 💸 Gastado: $1,850   │       │
│  │ 🚫 Bloqueadas: 0    │      │  │ 💰 Restante: $3,150  │       │
│  │ 📋 Por Hacer: 3     │      │  │ 📈 ROI: 700%         │       │
│  └─────────────────────┘      │  │ 🔥 Burn Rate: $370/mes      │
│                               │  └─────────────────────┘        │
│  🎨 ACTIVOS                   │  🤖 HERRAMIENTAS AI              │
│  ┌─────────────────────┐      │  ┌─────────────────────┐        │
│  │ 📦 Total: 12        │      │  │ 🛠️  Usadas: 4        │       │
│  │ 🖼️  Imágenes: 8     │      │  │ 💵 Costo: $150      │       │
│  │ 📄 Docs: 4          │      │  │ 🏆 Más usada:       │       │
│  │ 💾 Espacio: 45 MB   │      │  │    ChatGPT (12x)    │       │
│  └─────────────────────┘      │  └─────────────────────┘        │
│                                                                  │
│  ⏱️  TIMELINE                                                    │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ Inicio: 01 Ene 2025          Deadline: 31 Mar 2025   │       │
│  │ ████████████████░░░░░░░░░░░░░░░░░░                  │       │
│  │ 65% del tiempo transcurrido │ 45 días restantes      │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  🏥 SALUD DEL PROYECTO: 🟢 Saludable                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

TODOS estos datos se calculan AUTOMÁTICAMENTE con Rollups!
```

---

## 🎯 Jerarquía de Datos

```
EMPRESA
  │
  ├─ USUARIOS
  │   └─ Roles, Permisos, Preferencias
  │
  └─ PROYECTOS (Master)
      │
      ├─ WORKFLOWS APLICADOS
      │   └─ Fases → Tareas Template
      │
      ├─ EQUIPO
      │   └─ ProyectoUsuario (rol en el proyecto)
      │
      ├─ TAREAS
      │   │
      │   ├─ SUBTAREAS (recursivo)
      │   │   └─ SUBTAREAS
      │   │       └─ ...
      │   │
      │   ├─ DEPENDENCIAS
      │   │   └─ TareaDependencia
      │   │
      │   ├─ OBSERVADORES
      │   │   └─ TareaObservador
      │   │
      │   ├─ CHECKLIST
      │   │   └─ Items (JSON)
      │   │
      │   ├─ COMENTARIOS
      │   │   └─ Usuario, Fecha, Texto
      │   │
      │   ├─ HERRAMIENTAS AI USADAS
      │   │   └─ TareaHerramientaAI
      │   │
      │   └─ ACTIVOS GENERADOS
      │       └─ ActivoDigital[]
      │
      ├─ FINANZAS
      │   │
      │   ├─ TRANSACCIONES
      │   │   ├─ Vinculadas a Tarea
      │   │   ├─ Vinculadas a Herramienta AI
      │   │   └─ Vinculadas a Activo
      │   │
      │   └─ GASTOS RECURRENTES
      │       └─ Próxima Fecha
      │
      ├─ ACTIVOS DIGITALES (DAM)
      │   │
      │   ├─ COLECCIONES
      │   │   └─ Activos agrupados
      │   │
      │   ├─ SERIES
      │   │   └─ Hero Animations v1.0, v1.1, v2.0
      │   │
      │   └─ VERSIONES
      │       └─ Historial de cambios
      │
      └─ MÉTRICAS CALCULADAS
          ├─ Progreso
          ├─ Finanzas
          ├─ ROI
          ├─ Salud del Proyecto
          └─ Estadísticas de AI
```

---

## 🔄 Ciclo de Vida de un Proyecto

```
1. PLANEANDO
   │
   ├─ Crear proyecto
   ├─ Aplicar workflow
   ├─ Asignar equipo
   ├─ Definir presupuesto
   │
   ▼
2. EN PROGRESO
   │
   ├─ Ejecutar tareas
   ├─ Usar herramientas AI
   ├─ Generar activos
   ├─ Registrar gastos
   ├─ Monitorear progreso
   │
   │  [Loop continuo de tracking]
   │  ┌─────────────────────────────┐
   │  │ • Completar tareas          │
   │  │ • Rollups se actualizan     │
   │  │ • Dashboard refleja cambios │
   │  │ • Alertas si hay problemas  │
   │  └─────────────────────────────┘
   │
   ▼
3. PAUSADO (si necesario)
   │
   ├─ Registrar motivo
   ├─ Congelar presupuesto
   │
   ▼
4. COMPLETADO
   │
   ├─ Todas las tareas completadas (100%)
   ├─ Activos entregados
   ├─ Cierre financiero
   ├─ Análisis de ROI final
   ├─ Reporte generado
   │
   ▼
5. ARCHIVADO
   │
   └─ Proyecto finalizado
      └─ Datos históricos conservados
```

---

## 🎨 Arquitectura de Capas

```
┌────────────────────────────────────────────────────┐
│              CAPA DE PRESENTACIÓN                  │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐     │
│  │ Web App  │  │ Mobile   │  │  Desktop    │     │
│  │ (Next.js)│  │ (RN)     │  │  (Electron) │     │
│  └──────────┘  └──────────┘  └─────────────┘     │
└────────────┬───────────────────────────────────────┘
             │ REST API / GraphQL
             ▼
┌────────────────────────────────────────────────────┐
│              CAPA DE APLICACIÓN                    │
│  ┌─────────────────────────────────────────┐      │
│  │  API Routes / Resolvers                 │      │
│  │  • Autenticación (JWT/NextAuth)         │      │
│  │  • Autorización (RBAC)                  │      │
│  │  • Validación (Zod)                     │      │
│  │  • Rate Limiting                        │      │
│  └─────────────────────────────────────────┘      │
└────────────┬───────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────┐
│              CAPA DE LÓGICA DE NEGOCIO             │
│  ┌─────────────────────────────────────────┐      │
│  │  Services & Business Logic              │      │
│  │  • formulas.ts (Rollups & Cálculos)    │      │
│  │  • ProjectService                       │      │
│  │  • TaskService                          │      │
│  │  • FinanceService                       │      │
│  │  • DAMService                           │      │
│  │  • AIDirectoryService                   │      │
│  │  • WorkflowService                      │      │
│  └─────────────────────────────────────────┘      │
└────────────┬───────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────┐
│              CAPA DE ACCESO A DATOS                │
│  ┌─────────────────────────────────────────┐      │
│  │  Prisma ORM                             │      │
│  │  • Modelos                              │      │
│  │  • Queries optimizados                  │      │
│  │  • Transactions                         │      │
│  │  • Migrations                           │      │
│  └─────────────────────────────────────────┘      │
└────────────┬───────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────┐
│              CAPA DE DATOS                         │
│  ┌──────────────┐  ┌──────────────┐              │
│  │  PostgreSQL  │  │    Redis     │              │
│  │  (Database)  │  │   (Cache)    │              │
│  └──────────────┘  └──────────────┘              │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│              CAPA DE INFRAESTRUCTURA               │
│  ┌──────────────┐  ┌──────────────┐              │
│  │     S3       │  │   Webhooks   │              │
│  │  (Storage)   │  │ (Integraciones│              │
│  └──────────────┘  └──────────────┘              │
└────────────────────────────────────────────────────┘
```

---

**Versión**: 1.0  
**Fecha**: 2025-12-05  
**Sistema**: PM/DAM Visual Diagrams

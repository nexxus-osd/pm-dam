# 📐 Diagrama de Relaciones y Guía de Implementación

## Sistema PM/DAM - Gestión de Proyectos y Activos Digitales

---

## 🔗 Diagrama de Relaciones Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USUARIOS (Central)                          │
│  • Autenticación y permisos                                         │
│  • Roles: Admin, PM, Dev, Designer, Content Creator, Viewer         │
└────────────┬────────────────────────────────────────────────────────┘
             │
             ├───────────────────────────────────────┐
             │                                       │
             ▼                                       ▼
┌─────────────────────┐                   ┌──────────────────────┐
│   DB 1: PROYECTOS   │◄──────────────────┤   DB 3: WORKFLOWS    │
│    (Master DB)      │                   │  • Plantillas        │
├─────────────────────┤                   │  • Fases             │
│ • Progreso Total ●  │                   │  • Tareas Template   │
│ • Balance ●         │                   └──────────────────────┘
│ • ROI ●             │
│ • Costos AI ●       │
└──────┬──┬───┬───┬──┘
       │  │   │   │
       │  │   │   └──────────────────────────────────┐
       │  │   │                                      │
       │  │   └─────┐                                │
       │  │         │                                │
       ▼  ▼         ▼                                ▼
  ┌────────┐  ┌──────────┐                    ┌─────────────┐
  │ DB 2:  │  │  DB 4:   │                    │   DB 5:     │
  │ TAREAS │  │ ACTIVOS  │                    │  FINANZAS   │
  │        │  │ (DAM)    │                    │             │
  ├────────┤  ├──────────┤                    ├─────────────┤
  │ • Sub  │  │• Archivos│                    │• Gastos     │
  │   tareas│  │• Licencias│                   │• Ingresos   │
  │ • Deps │  │• Versiones│                   │• Recurrentes│
  │ • Check│  │• Metadata│                    │• ROI        │
  └───┬────┘  └────┬─────┘                    └──────┬──────┘
      │            │                                  │
      │            │    ┌─────────────────────────────┘
      │            │    │
      └────────────┼────┼──────────────┐
                   │    │              │
                   ▼    ▼              ▼
              ┌────────────────────────────┐
              │   DB E: AI DIRECTORY       │
              │  (Catálogo de Herramientas)│
              ├────────────────────────────┤
              │ • Catálogo de IA           │
              │ • Costos por herramienta   │
              │ • Uso en proyectos ●       │
              │ • ROI por herramienta ●    │
              └────────────────────────────┘

● = Campo calculado con Rollups/Fórmulas
```

---

## 🔄 Flujo de Datos y Cálculos

### 1. Creación de Proyecto → Actualización en Tiempo Real

```
┌──────────────────┐
│ 1. Crear Proyecto│
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 2. Aplicar Workflow (DB 3)          │
│    → Genera Tareas predefinidas     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 3. Tareas creadas (DB 2)            │
│    → Asignadas a usuarios           │
│    → Con dependencias               │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 4. Usuario completa tarea           │
│    → Marca como "Completado"        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 5. TRIGGER: Actualizar Proyecto     │
│    ● Recalcular progreso_total      │
│    ● Actualizar tareas_completadas  │
│    ● Verificar salud del proyecto   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 6. Dashboard muestra cambios        │
│    en tiempo real                   │
└─────────────────────────────────────┘
```

### 2. Registro de Gasto → Actualización Financiera

```
┌──────────────────┐
│ 1. Crear Gasto   │
│    (DB 5)        │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 2. Vincular a:                      │
│    • Proyecto (OBLIGATORIO)         │
│    • Tarea (Opcional)               │
│    • Herramienta AI (Opcional)      │
│    • Activo (Opcional)              │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 3. TRIGGER: Actualizar Proyecto     │
│    ● gastos_acumulados += monto     │
│    ● balance_restante recalculado   │
│    ● roi_preliminar recalculado     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 4. Si vinculado a Herramienta AI:   │
│    ● Actualizar costo_total_gastado │
│    ● Incrementar veces_usada        │
└─────────────────────────────────────┘
```

### 3. Uso de Herramienta AI en Tarea

```
┌──────────────────┐
│ 1. Tarea usa AI  │
│    (ej: Midjourney│
│     para diseño)  │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 2. Vincular Herramienta (DB E)      │
│    → Crear relación Tarea-AI        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 3. TRIGGER: Actualizar contadores   │
│    ● herramienta.veces_usada += 1   │
│    ● tarea.costo_ai += costo_ai     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ 4. ROLLUP: Proyecto                 │
│    ● costo_ai_total recalculado     │
│    ● herramientas_ai_usadas actualizadas│
└─────────────────────────────────────┘
```

---

## 🎯 Queries Críticos para Rollups

### Query 1: Actualizar Progreso de Proyecto

```typescript
// Función que se ejecuta cuando se actualiza una tarea
async function actualizarProgresoProyecto(proyectoId: string) {
  const tareas = await prisma.tarea.findMany({
    where: { proyecto_id: proyectoId },
    select: { estado: true }
  });

  const total_tareas = tareas.length;
  const tareas_completadas = tareas.filter(t => t.estado === 'COMPLETADO').length;
  const tareas_en_progreso = tareas.filter(t => t.estado === 'EN_PROGRESO').length;
  const tareas_bloqueadas = tareas.filter(t => t.estado === 'BLOQUEADO').length;
  const progreso_total = (tareas_completadas / total_tareas) * 100;

  await prisma.proyecto.update({
    where: { id: proyectoId },
    data: {
      total_tareas,
      tareas_completadas,
      tareas_en_progreso,
      tareas_bloqueadas,
      progreso_total: Math.round(progreso_total * 100) / 100
    }
  });
}
```

### Query 2: Actualizar Finanzas de Proyecto

```typescript
async function actualizarFinanzasProyecto(proyectoId: string) {
  const transacciones = await prisma.transaccion.findMany({
    where: { 
      proyecto_id: proyectoId,
      estado: 'PAGADO'
    }
  });

  const gastos_acumulados = transacciones
    .filter(t => t.tipo_transaccion === 'GASTO')
    .reduce((sum, t) => sum + Number(t.monto), 0);

  const ingresos_totales = transacciones
    .filter(t => t.tipo_transaccion === 'INGRESO')
    .reduce((sum, t) => sum + Number(t.monto), 0);

  const proyecto = await prisma.proyecto.findUnique({
    where: { id: proyectoId },
    select: { presupuesto_asignado: true, ingresos_estimados: true }
  });

  const balance_restante = Number(proyecto.presupuesto_asignado) - gastos_acumulados;
  const roi_preliminar = gastos_acumulados > 0 
    ? ((Number(proyecto.ingresos_estimados) - gastos_acumulados) / gastos_acumulados) * 100 
    : 0;

  await prisma.proyecto.update({
    where: { id: proyectoId },
    data: {
      gastos_acumulados,
      ingresos_totales,
      balance_restante,
      roi_preliminar: Math.round(roi_preliminar * 100) / 100
    }
  });
}
```

### Query 3: Calcular Costo AI del Proyecto

```typescript
async function actualizarCostoAIProyecto(proyectoId: string) {
  // Obtener todas las herramientas AI usadas en tareas del proyecto
  const herramientasUsadas = await prisma.tareaHerramientaAI.findMany({
    where: {
      tarea: {
        proyecto_id: proyectoId
      }
    },
    include: {
      herramienta: {
        select: {
          id: true,
          costo_mensual: true,
          costo_por_uso: true
        }
      }
    }
  });

  // IDs únicos de herramientas
  const herramientasUnicas = new Set(
    herramientasUsadas.map(h => h.herramienta.id)
  );

  // Calcular costo total
  let costo_ai_total = 0;
  herramientasUsadas.forEach(rel => {
    const herramienta = rel.herramienta;
    costo_ai_total += Number(herramienta.costo_mensual || herramienta.costo_por_uso || 0);
  });

  await prisma.proyecto.update({
    where: { id: proyectoId },
    data: {
      costo_ai_total,
      // Nota: herramientas_ai_usadas se podría almacenar como JSON
      // o manejarse dinámicamente en queries
    }
  });
}
```

### Query 4: Actualizar Estadísticas de Herramienta AI

```typescript
async function actualizarEstadisticasHerramientaAI(herramientaId: string) {
  // Contar veces usada
  const veces_usada = await prisma.tareaHerramientaAI.count({
    where: { herramienta_id: herramientaId }
  });

  // Obtener proyectos únicos
  const proyectosUsados = await prisma.tareaHerramientaAI.findMany({
    where: { herramienta_id: herramientaId },
    select: {
      tarea: {
        select: { proyecto_id: true }
      }
    }
  });

  const proyectosUnicos = new Set(proyectosUsados.map(p => p.tarea.proyecto_id));

  // Calcular gasto total
  const transacciones = await prisma.transaccion.findMany({
    where: {
      herramienta_ai_id: herramientaId,
      tipo_transaccion: 'GASTO',
      estado: 'PAGADO'
    }
  });

  const costo_total_gastado = transacciones.reduce(
    (sum, t) => sum + Number(t.monto), 
    0
  );

  await prisma.herramientaAI.update({
    where: { id: herramientaId },
    data: {
      veces_usada,
      costo_total_gastado
    }
  });
}
```

---

## 🔔 Sistema de Triggers y Webhooks

### Eventos que deben disparar actualizaciones

#### Eventos de Tareas

```typescript
// 1. Cuando se crea una tarea
on_tarea_created → actualizarProgresoProyecto()

// 2. Cuando se actualiza el estado de una tarea
on_tarea_status_changed → actualizarProgresoProyecto()

// 3. Cuando se completa una tarea
on_tarea_completed → {
  actualizarProgresoProyecto()
  verificarDependenciasBloqueadas()
  enviarNotificacion()
}

// 4. Cuando se vincula una herramienta AI
on_herramienta_ai_vinculada → {
  actualizarCostoAITarea()
  actualizarCostoAIProyecto()
  actualizarEstadisticasHerramientaAI()
}
```

#### Eventos Financieros

```typescript
// 1. Cuando se crea una transacción
on_transaccion_created → actualizarFinanzasProyecto()

// 2. Cuando se aprueba un pago
on_transaccion_aprobada → {
  actualizarFinanzasProyecto()
  if (herramienta_ai_id) {
    actualizarEstadisticasHerramientaAI()
  }
}

// 3. Cuando se registra un ingreso
on_ingreso_registrado → {
  actualizarFinanzasProyecto()
  recalcularROI()
}
```

#### Eventos de Activos

```typescript
// 1. Cuando se sube un activo
on_activo_uploaded → {
  incrementarContadorActivos(proyecto_id)
  if (tarea_id) {
    vincularActivoATarea()
  }
}

// 2. Cuando se usa un activo
on_activo_usado → incrementarContadorUso()
```

---

## 📊 Implementación de Dashboards

### Dashboard Principal del Proyecto

```typescript
interface DashboardProyecto {
  // Información básica
  proyecto: {
    nombre: string;
    estado: EstadoProyecto;
    progreso_total: number;
    salud: 'Saludable' | 'En Riesgo' | 'Crítico';
  };

  // Métricas de tareas
  tareas: {
    total: number;
    completadas: number;
    en_progreso: number;
    bloqueadas: number;
    vencidas: number;
    porcentaje_completado: number;
  };

  // Métricas financieras
  finanzas: {
    presupuesto: number;
    gastado: number;
    restante: number;
    roi: number;
    burn_rate: number; // Gasto mensual promedio
    runway: number; // Meses restantes
    grafico_gastos: Array<{categoria: string, monto: number}>;
  };

  // Activos
  activos: {
    total: number;
    por_tipo: Record<TipoActivoDigital, number>;
    espacio_usado: number; // GB
  };

  // AI Tools
  herramientas_ai: {
    total_usadas: number;
    costo_total: number;
    mas_usada: {
      nombre: string;
      veces: number;
    };
  };

  // Timeline
  timeline: {
    dias_transcurridos: number;
    dias_restantes: number;
    porcentaje_tiempo: number;
  };
}

// Query para obtener dashboard completo
async function obtenerDashboardProyecto(proyectoId: string): Promise<DashboardProyecto> {
  const [proyecto, tareas, transacciones, activos, herramientasAI] = await Promise.all([
    prisma.proyecto.findUnique({ where: { id: proyectoId } }),
    prisma.tarea.findMany({ where: { proyecto_id: proyectoId } }),
    prisma.transaccion.findMany({ where: { proyecto_id: proyectoId, estado: 'PAGADO' } }),
    prisma.activoDigital.findMany({ where: { proyecto_id: proyectoId } }),
    // ... obtener herramientas AI usadas
  ]);

  // Calcular métricas usando las funciones de formulas.ts
  const tareas_vencidas = tareas.filter(
    t => t.fecha_vencimiento && t.fecha_vencimiento < new Date() && t.estado !== 'COMPLETADO'
  ).length;

  const burn_rate = calcularBurnRate(transacciones, proyecto.fecha_inicio);
  const runway = calcularRunway(Number(proyecto.balance_restante), burn_rate);

  return {
    proyecto: {
      nombre: proyecto.nombre,
      estado: proyecto.estado,
      progreso_total: proyecto.progreso_total,
      salud: calcularSaludProyecto(proyecto, tareas)
    },
    tareas: {
      total: proyecto.total_tareas,
      completadas: proyecto.tareas_completadas,
      en_progreso: proyecto.tareas_en_progreso,
      bloqueadas: proyecto.tareas_bloqueadas,
      vencidas: tareas_vencidas,
      porcentaje_completado: proyecto.progreso_total
    },
    finanzas: {
      presupuesto: Number(proyecto.presupuesto_asignado),
      gastado: Number(proyecto.gastos_acumulados),
      restante: Number(proyecto.balance_restante),
      roi: proyecto.roi_preliminar,
      burn_rate,
      runway,
      grafico_gastos: calcularGastosPorCategoria(transacciones)
    },
    activos: {
      total: proyecto.activos_generados,
      por_tipo: agruparActivosPorTipo(activos),
      espacio_usado: calcularEspacioEnGB(activos)
    },
    herramientas_ai: {
      // ... calcular desde herramientasAI
    },
    timeline: {
      // ... calcular fechas
    }
  };
}
```

---

## 🚀 Pasos de Implementación

### Fase 1: Setup Base de Datos (Semana 1)

1. ✅ Configurar PostgreSQL
2. ✅ Inicializar Prisma
3. ✅ Aplicar schema (`prisma migrate dev`)
4. ✅ Generar Prisma Client
5. ✅ Seed inicial con datos de prueba

### Fase 2: API Base (Semana 2-3)

1. ✅ CRUD para Proyectos
2. ✅ CRUD para Tareas (con subtareas)
3. ✅ CRUD para Transacciones
4. ✅ CRUD para Activos Digitales
5. ✅ CRUD para Herramientas AI
6. ✅ CRUD para Workflows

### Fase 3: Implementar Rollups y Fórmulas (Semana 4)

1. ✅ Triggers de actualización automática
2. ✅ Funciones de cálculo (usar utils/formulas.ts)
3. ✅ Sistema de eventos
4. ✅ Validaciones de integridad referencial

### Fase 4: Frontend - Vistas Principales (Semana 5-6)

1. ✅ Dashboard General
2. ✅ Vista de Proyectos (lista y detalle)
3. ✅ Vista de Tareas (Kanban, Lista, Calendario)
4. ✅ Vista de Finanzas
5. ✅ Vista de Activos (DAM)
6. ✅ Vista de AI Directory

### Fase 5: Módulos Especializados (Semana 7-8)

1. ✅ Módulo de Ebooks
2. ✅ Módulo de Cursos Online
3. ✅ Módulo de Juegos
4. ✅ Módulo de Apps

### Fase 6: Features Avanzadas (Semana 9-10)

1. ✅ Sistema de notificaciones
2. ✅ Búsqueda y filtros avanzados
3. ✅ Exportación de reportes
4. ✅ Integraciones (Slack, etc.)
5. ✅ Analytics y gráficos
6. ✅ Permisos y roles

### Fase 7: Optimización y Testing (Semana 11-12)

1. ✅ Tests unitarios
2. ✅ Tests de integración
3. ✅ Optimización de queries
4. ✅ Caching (Redis)
5. ✅ Performance monitoring
6. ✅ Deploy a producción

---

## 🔐 Consideraciones de Seguridad

1. **Autenticación**: JWT o NextAuth.js
2. **Autorización**: RBAC (Role-Based Access Control)
3. **Encriptación**: API keys de herramientas AI
4. **Validación**: Zod para validación de schemas
5. **Rate Limiting**: Prevenir abuso de API
6. **Backup**: Backup automático diario

---

## 📈 Métricas de Éxito

- **Performance**: Queries < 100ms
- **Uptime**: 99.9%
- **Precisión de Cálculos**: 100% (rollups correctos)
- **Cobertura de Tests**: > 80%
- **Satisfacción de Usuario**: > 4.5/5

---

**Versión**: 1.0  
**Fecha**: 2025-12-05  
**Autor**: Sistema PM/DAM  
**Estado**: Listo para implementación

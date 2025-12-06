# 💼 Casos de Uso y Ejemplos Prácticos

## Sistema PM/DAM - Escenarios Reales

---

## 📖 CASO DE USO 1: Creación de un Ebook desde Cero

### Escenario

Quieres crear un ebook sobre "Productividad con IA" y necesitas gestionar todo el proceso desde la planificación hasta la publicación.

### Paso a Paso

#### 1. Crear Proyecto

```typescript
const nuevoProyecto = await prisma.proyecto.create({
  data: {
    nombre: "Ebook: Productividad con IA",
    descripcion: "Guía completa sobre cómo usar herramientas de IA...",
    tipo_activo: "EBOOK",
    estado: "PLANEANDO",
    prioridad: "ALTA",
    fecha_inicio: new Date("2025-01-01"),
    fecha_deadline: new Date("2025-03-31"),
    presupuesto_asignado: 5000,
    ingresos_estimados: 15000,
    responsable_id: "user_001",
    etiquetas: ["productividad", "ia", "ebook"],
    campos_personalizados: {
      // Campos específicos de Ebook
      numero_paginas: 150,
      formato_exportacion: ["PDF", "EPUB"],
      autor: "Juan Pérez",
      isbn: "978-3-16-148410-0"
    }
  }
});
// → Resultado: Proyecto creado con ID único
```

#### 2. Aplicar Workflow de Ebook

```typescript
// El workflow predefinido genera automáticamente las tareas
const workflow = await prisma.workflow.findFirst({
  where: { tipo_proyecto: "EBOOK", activo: true }
});

// Crear tareas desde el template
const tareasGeneradas = await crearTareasDesdeWorkflow(
  nuevoProyecto.id,
  workflow
);

// Tareas generadas automáticamente:
// ✅ Fase 1: Planificación
//    - Crear outline
//    - Investigación de temas
//    - Definir audiencia
// ✅ Fase 2: Escritura
//    - Capítulo 1: Introducción a la IA
//    - Capítulo 2: Herramientas de IA
//    - ...
// ✅ Fase 3: Diseño
//    - Diseño de portada
//    - Maquetación
// ✅ Fase 4: Revisión
//    - Corrección de estilo
//    - Revisión técnica
// ✅ Fase 5: Publicación
//    - Exportar a PDF/EPUB
//    - Distribución
```

#### 3. Asignar Tareas al Equipo

```typescript
// Tarea: Diseño de portada
await prisma.tarea.update({
  where: { id: "task_portada" },
  data: {
    asignado_a_id: "designer_001",
    fecha_inicio: new Date("2025-01-15"),
    fecha_vencimiento: new Date("2025-01-20"),
    tiempo_estimado: 8, // horas
    prioridad: "ALTA"
  }
});
```

#### 4. Usar Herramienta AI para Diseño

```typescript
// Vincular Midjourney a la tarea de portada
await prisma.tareaHerramientaAI.create({
  data: {
    tarea_id: "task_portada",
    herramienta_id: "ai_midjourney"
  }
});

// → TRIGGER automático:
// ✓ herramienta.veces_usada += 1
// ✓ tarea.costo_ai actualizado
// ✓ proyecto.costo_ai_total recalculado
```

#### 5. Registrar Gasto de Suscripción

```typescript
await prisma.transaccion.create({
  data: {
    proyecto_id: nuevoProyecto.id,
    tarea_id: "task_portada",
    herramienta_ai_id: "ai_midjourney",
    tipo_transaccion: "GASTO",
    categoria: "SUSCRIPCION",
    concepto: "Midjourney Pro - Enero 2025",
    monto: 30,
    moneda: "USD",
    fecha_transaccion: new Date(),
    metodo_pago: "TARJETA",
    estado: "PAGADO",
    recurrente: true,
    frecuencia: "MENSUAL",
    creado_por_id: "user_001"
  }
});

// → TRIGGER automático:
// ✓ proyecto.gastos_acumulados += 30
// ✓ proyecto.balance_restante = 5000 - 30 = 4970
// ✓ herramienta_ai.costo_total_gastado += 30
```

#### 6. Subir Activo de Portada

```typescript
const portada = await prisma.activoDigital.create({
  data: {
    nombre: "Portada - Productividad con IA",
    tipo_activo: "IMAGEN",
    categoria: "Portada",
    formato: ".png",
    tamaño: 2.5, // MB
    url_archivo: "/assets/covers/productividad-ia-cover.png",
    thumbnail_url: "/assets/covers/productividad-ia-cover-thumb.png",
    descripcion: "Portada principal del ebook",
    proyecto_id: nuevoProyecto.id,
    tarea_id: "task_portada",
    creado_por_id: "designer_001",
    derechos_uso: "USO_COMERCIAL",
    licencia: "COPYRIGHT",
    dimensiones: "1600x2400",
    estado: "APROBADO",
    etiquetas: ["portada", "ebook", "diseño"]
  }
});

// → TRIGGER automático:
// ✓ proyecto.activos_generados += 1
// ✓ activo vinculado a tarea
```

#### 7. Completar Tarea

```typescript
await prisma.tarea.update({
  where: { id: "task_portada" },
  data: {
    estado: "COMPLETADO",
    fecha_completado: new Date(),
    tiempo_real: 6.5 // horas reales trabajadas
  }
});

// → TRIGGER automático:
// ✓ proyecto.tareas_completadas += 1
// ✓ proyecto.progreso_total recalculado
// ✓ tarea.eficiencia = (8 / 6.5) * 100 = 123% 🎉
// ✓ Notificación al Project Manager
```

#### 8. Dashboard del Proyecto (Vista en Tiempo Real)

```typescript
const dashboard = await obtenerDashboardProyecto(nuevoProyecto.id);

console.log(dashboard);
// {
//   proyecto: {
//     nombre: "Ebook: Productividad con IA",
//     estado: "EN_PROGRESO",
//     progreso_total: 12.5, // 3 de 24 tareas completadas
//     salud: "Saludable"
//   },
//   tareas: {
//     total: 24,
//     completadas: 3,
//     en_progreso: 5,
//     bloqueadas: 0,
//     vencidas: 0,
//     porcentaje_completado: 12.5
//   },
//   finanzas: {
//     presupuesto: 5000,
//     gastado: 350, // Midjourney + otros gastos
//     restante: 4650,
//     roi: 4185%, // (15000 - 350) / 350 * 100
//     burn_rate: 175, // USD/mes
//     runway: 26.5, // meses
//     grafico_gastos: [
//       { categoria: "SUSCRIPCION", monto: 180, porcentaje: 51% },
//       { categoria: "HERRAMIENTA", monto: 100, porcentaje: 29% },
//       { categoria: "FREELANCE", monto: 70, porcentaje: 20% }
//     ]
//   },
//   activos: {
//     total: 8,
//     por_tipo: { IMAGEN: 5, DOCUMENTO: 3 },
//     espacio_usado: 0.015 // GB
//   },
//   herramientas_ai: {
//     total_usadas: 4,
//     costo_total: 150,
//     mas_usada: { nombre: "ChatGPT", veces: 12 }
//   }
// }
```

---

## 🎮 CASO DE USO 2: Desarrollo de un Juego Lúdico

### Escenario

Estás creando un juego educativo de matemáticas para niños.

#### 1. Crear Proyecto de Juego

```typescript
const juegoMatematicas = await prisma.proyecto.create({
  data: {
    nombre: "MathQuest: Aventura Numérica",
    descripcion: "Juego educativo para aprender matemáticas...",
    tipo_activo: "JUEGO_LUDICO",
    estado: "PLANEANDO",
    prioridad: "ALTA",
    fecha_inicio: new Date("2025-02-01"),
    fecha_deadline: new Date("2025-06-30"),
    presupuesto_asignado: 25000,
    ingresos_estimados: 80000,
    responsable_id: "pm_001",
    campos_personalizados: {
      plataforma_juego: ["Web", "iOS", "Android"],
      genero: "Educational Puzzle",
      engine: "Phaser",
      mecanica_principal: "Resolver puzzles matemáticos para avanzar"
    }
  }
});
```

#### 2. Crear Tareas con Dependencias

```typescript
// Tarea 1: Game Design Document
const task_gdd = await prisma.tarea.create({
  data: {
    proyecto_id: juegoMatematicas.id,
    nombre: "Crear Game Design Document",
    tipo_tarea: "DISENO",
    estado: "EN_PROGRESO",
    prioridad: "CRITICA",
    asignado_a_id: "game_designer_001",
    fecha_vencimiento: new Date("2025-02-15"),
    tiempo_estimado: 40
  }
});

// Tarea 2: Diseño de personajes (depende del GDD)
const task_personajes = await prisma.tarea.create({
  data: {
    proyecto_id: juegoMatematicas.id,
    nombre: "Diseñar personajes principales",
    tipo_tarea: "DISENO",
    estado: "POR_HACER",
    asignado_a_id: "artist_001",
    tiempo_estimado: 60
  }
});

// Crear dependencia
await prisma.tareaDependencia.create({
  data: {
    tarea_origen_id: task_personajes.id,
    tarea_destino_id: task_gdd.id
  }
});
// → task_personajes está bloqueada hasta que task_gdd se complete
```

#### 3. Usar Múltiples Herramientas AI

```typescript
// Para el diseño de personajes, usar varias herramientas
await prisma.tareaHerramientaAI.createMany({
  data: [
    { tarea_id: task_personajes.id, herramienta_id: "ai_midjourney" },
    { tarea_id: task_personajes.id, herramienta_id: "ai_dall_e" },
    { tarea_id: task_personajes.id, herramienta_id: "ai_remove_bg" }
  ]
});

// → Costo combinado calculado automáticamente
// tarea.costo_ai = 30 + 20 + 10 = 60 USD
```

#### 4. Crear Subtareas

```typescript
// Tarea principal: Programación del juego
const task_programacion = await prisma.tarea.create({
  data: {
    proyecto_id: juegoMatematicas.id,
    nombre: "Programación del juego",
    tipo_tarea: "DESARROLLO",
    tiempo_estimado: 200
  }
});

// Subtareas
const subtareas = await prisma.tarea.createMany({
  data: [
    {
      proyecto_id: juegoMatematicas.id,
      tarea_padre_id: task_programacion.id,
      nombre: "Sistema de niveles",
      tipo_tarea: "DESARROLLO",
      tiempo_estimado: 40
    },
    {
      proyecto_id: juegoMatematicas.id,
      tarea_padre_id: task_programacion.id,
      nombre: "Sistema de puntuación",
      tipo_tarea: "DESARROLLO",
      tiempo_estimado: 30
    },
    {
      proyecto_id: juegoMatematicas.id,
      tarea_padre_id: task_programacion.id,
      nombre: "Integración de assets",
      tipo_tarea: "DESARROLLO",
      tiempo_estimado: 50
    }
  ]
});

// → progreso_subtareas se calcula automáticamente
// Al completar cada subtarea, task_programacion.progreso_subtareas se actualiza
```

#### 5. Gestionar Assets del Juego (DAM)

```typescript
// Carpeta de sprites de personajes
const sprites = [
  {
    nombre: "Personaje Principal - Idle Animation",
    tipo_activo: "IMAGEN",
    categoria: "Sprite",
    formato: ".png",
    tamaño: 0.5,
    url_archivo: "/assets/sprites/hero_idle.png",
    proyecto_id: juegoMatematicas.id,
    tarea_id: task_personajes.id,
    dimensiones: "64x64",
    derechos_uso: "USO_COMERCIAL",
    licencia: "COPYRIGHT",
    version: "1.0",
    serie: "Hero Animations",
    etiquetas: ["sprite", "personaje", "animacion"]
  },
  {
    nombre: "Personaje Principal - Walk Animation",
    tipo_activo: "IMAGEN",
    categoria: "Sprite",
    formato: ".png",
    tamaño: 0.8,
    url_archivo: "/assets/sprites/hero_walk.png",
    proyecto_id: juegoMatematicas.id,
    tarea_id: task_personajes.id,
    dimensiones: "64x64",
    serie: "Hero Animations",
    version: "1.0"
  }
  // ... más sprites
];

await prisma.activoDigital.createMany({ data: sprites });

// Búsqueda de activos por serie
const heroAnimations = await prisma.activoDigital.findMany({
  where: {
    proyecto_id: juegoMatematicas.id,
    serie: "Hero Animations"
  },
  orderBy: { version: 'desc' }
});
```

#### 6. Análisis de Costos de AI

```typescript
// ¿Cuánto hemos gastado en herramientas AI para este proyecto?
const analisisAI = await prisma.herramientaAI.findMany({
  where: {
    tareas: {
      some: {
        tarea: {
          proyecto_id: juegoMatematicas.id
        }
      }
    }
  },
  select: {
    nombre: true,
    costo_mensual: true,
    veces_usada: true,
    costo_total_gastado: true
  }
});

console.log(analisisAI);
// [
//   {
//     nombre: "Midjourney",
//     costo_mensual: 30,
//     veces_usada: 25,
//     costo_total_gastado: 150
//   },
//   {
//     nombre: "GitHub Copilot",
//     costo_mensual: 10,
//     veces_usada: 50,
//     costo_total_gastado: 50
//   },
//   ...
// ]
```

---

## 🎓 CASO DE USO 3: Creación de Curso Online

### Escenario

Crear un curso online sobre "Next.js 14 para Principiantes"

#### 1. Estructura del Proyecto

```typescript
const cursoNextJS = await prisma.proyecto.create({
  data: {
    nombre: "Curso: Next.js 14 para Principiantes",
    tipo_activo: "CURSO_ONLINE",
    presupuesto_asignado: 10000,
    ingresos_estimados: 50000,
    campos_personalizados: {
      duracion_total: 12, // horas
      numero_modulos: 6,
      numero_lecciones: 45,
      plataforma: "Teachable",
      precio_curso: 199
    }
  }
});
```

#### 2. Estructura de Tareas por Módulo

```typescript
// Módulo 1: Introducción
const modulo1 = await prisma.tarea.create({
  data: {
    proyecto_id: cursoNextJS.id,
    nombre: "Módulo 1: Introducción a Next.js",
    tipo_tarea: "CONTENIDO"
  }
});

// Lecciones del módulo (subtareas)
await prisma.tarea.createMany({
  data: [
    {
      proyecto_id: cursoNextJS.id,
      tarea_padre_id: modulo1.id,
      nombre: "Lección 1.1: ¿Qué es Next.js?",
      tipo_tarea: "CONTENIDO",
      checklist: JSON.stringify([
        { id: "1", item: "Escribir guion", completado: false },
        { id: "2", item: "Grabar video", completado: false },
        { id: "3", item: "Editar video", completado: false },
        { id: "4", item: "Subir a plataforma", completado: false }
      ])
    },
    {
      proyecto_id: cursoNextJS.id,
      tarea_padre_id: modulo1.id,
      nombre: "Lección 1.2: Instalación y configuración",
      tipo_tarea: "CONTENIDO"
    }
  ]
});
```

#### 3. Usar AI para Crear Material

```typescript
// Usar ChatGPT para escribir guiones
const leccion = await prisma.tarea.findFirst({
  where: { nombre: "Lección 1.1: ¿Qué es Next.js?" }
});

await prisma.tareaHerramientaAI.create({
  data: {
    tarea_id: leccion.id,
    herramienta_id: "ai_chatgpt"
  }
});

// Registrar tiempo y costo
await prisma.tarea.update({
  where: { id: leccion.id },
  data: {
    tiempo_real: 2,
    notas: "Usado ChatGPT para generar outline del guion. Ahorró ~1 hora."
  }
});
```

#### 4. Gestionar Videos (DAM)

```typescript
await prisma.activoDigital.create({
  data: {
    nombre: "Video: Lección 1.1 - ¿Qué es Next.js?",
    tipo_activo: "VIDEO",
    categoria: "Lección",
    formato: ".mp4",
    tamaño: 250, // MB
    url_archivo: "/courses/nextjs/videos/leccion-1-1.mp4",
    thumbnail_url: "/courses/nextjs/thumbs/leccion-1-1.jpg",
    proyecto_id: cursoNextJS.id,
    tarea_id: leccion.id,
    duracion: 480, // segundos (8 minutos)
    dimensiones: "1920x1080",
    codec: "H.264",
    derechos_uso: "USO_COMERCIAL",
    licencia: "COPYRIGHT",
    version: "1.0",
    coleccion: "Módulo 1",
    etiquetas: ["video", "leccion", "nextjs"]
  }
});
```

---

## 📱 CASO DE USO 4: Desarrollo de App Móvil

### Escenario

Crear una app de gestión de finanzas personales

#### 1. Proyecto con Stack Tecnológico

```typescript
const appFinanzas = await prisma.proyecto.create({
  data: {
    nombre: "MoneyTracker - App de Finanzas",
    tipo_activo: "APP",
    presupuesto_asignado: 50000,
    campos_personalizados: {
      plataforma_app: ["iOS", "Android", "Web"],
      stack_tecnologico: [
        "React Native",
        "TypeScript",
        "Supabase",
        "Zustand",
        "Tailwind"
      ],
      tipo_app: "Utility",
      usuarios_objetivo: 10000,
      url_repositorio: "https://github.com/company/moneytracker",
      url_demo: "https://demo.moneytracker.app"
    }
  }
});
```

#### 2. Fases de Desarrollo

```typescript
// Fase 1: Discovery & Planning
const faseDiscovery = await prisma.tarea.create({
  data: {
    proyecto_id: appFinanzas.id,
    nombre: "FASE 1: Discovery & Planning",
    tipo_tarea: "OTRO"
  }
});

// Fase 2: UI/UX Design
const faseDesign = await prisma.tarea.create({
  data: {
    proyecto_id: appFinanzas.id,
    nombre: "FASE 2: UI/UX Design",
    tipo_tarea: "DISENO"
  }
});

// Fase 3: Desarrollo Frontend
const faseFrontend = await prisma.tarea.create({
  data: {
    proyecto_id: appFinanzas.id,
    nombre: "FASE 3: Desarrollo Frontend",
    tipo_tarea: "DESARROLLO"
  }
});

// ... más fases
```

#### 3. Usar AI para Desarrollo

```typescript
// Tarea: Crear componente de dashboard
const taskDashboard = await prisma.tarea.create({
  data: {
    proyecto_id: appFinanzas.id,
    tarea_padre_id: faseFrontend.id,
    nombre: "Implementar Dashboard de Finanzas",
    tipo_tarea: "DESARROLLO",
    asignado_a_id: "dev_001",
    tiempo_estimado: 16
  }
});

// Usar GitHub Copilot y ChatGPT
await prisma.tareaHerramientaAI.createMany({
  data: [
    { tarea_id: taskDashboard.id, herramienta_id: "ai_copilot" },
    { tarea_id: taskDashboard.id, herramienta_id: "ai_chatgpt" }
  ]
});

// Al completar, registrar feedback
await prisma.tarea.update({
  where: { id: taskDashboard.id },
  data: {
    estado: "COMPLETADO",
    tiempo_real: 10, // Ahorró 6 horas gracias a AI
    notas: `
      GitHub Copilot generó el 60% del código boilerplate.
      ChatGPT ayudó a resolver bug de actualización de estado.
      Productividad aumentada significativamente.
    `
  }
});
```

#### 4. Gestionar Licencias de Librerías

```typescript
// Registrar licencia de iconos
await prisma.activoDigital.create({
  data: {
    nombre: "Heroicons Pro",
    tipo_activo: "FUENTE", // o crear tipo "LIBRERIA"
    categoria: "Iconos",
    proyecto_id: appFinanzas.id,
    derechos_uso: "CON_LICENCIA",
    licencia: "PERSONALIZADA",
    detalles_licencia: "Licencia comercial válida por 1 año",
    proveedor: "Heroicons",
    costo_adquisicion: 99,
    fecha_expiracion: new Date("2026-01-01"),
    url_archivo: "https://heroicons.com",
    etiquetas: ["iconos", "ui", "premium"]
  }
});

// Registrar el gasto
await prisma.transaccion.create({
  data: {
    proyecto_id: appFinanzas.id,
    tipo_transaccion: "GASTO",
    categoria: "LICENCIA",
    concepto: "Heroicons Pro - Licencia Anual",
    monto: 99,
    fecha_transaccion: new Date(),
    estado: "PAGADO"
  }
});
```

---

## 📊 CASO DE USO 5: Análisis Financiero Multi-Proyecto

### Escenario

Eres director de proyectos y necesitas un resumen financiero de todos tus proyectos activos.

```typescript
async function obtenerResumenGlobal() {
  // Obtener todos los proyectos activos
  const proyectosActivos = await prisma.proyecto.findMany({
    where: {
      estado: { in: ['EN_PROGRESO', 'PLANEANDO'] }
    },
    include: {
      transacciones: {
        where: { estado: 'PAGADO' }
      }
    }
  });

  // Calcular métricas globales
  let totalPresupuesto = 0;
  let totalGastado = 0;
  let totalProyectos = proyectosActivos.length;
  let proyectosEnRiesgo = 0;
  let proyectosCriticos = 0;

  for (const proyecto of proyectosActivos) {
    totalPresupuesto += Number(proyecto.presupuesto_asignado);
    totalGastado += Number(proyecto.gastos_acumulados);

    // Obtener tareas para calcular salud
    const tareas = await prisma.tarea.findMany({
      where: { proyecto_id: proyecto.id }
    });

    const salud = calcularSaludProyecto(proyecto, tareas);
    if (salud === 'En Riesgo') proyectosEnRiesgo++;
    if (salud === 'Crítico') proyectosCriticos++;
  }

  // Top 5 proyectos por gasto
  const topGastos = proyectosActivos
    .sort((a, b) => Number(b.gastos_acumulados) - Number(a.gastos_acumulados))
    .slice(0, 5)
    .map(p => ({
      nombre: p.nombre,
      gastado: Number(p.gastos_acumulados),
      presupuesto: Number(p.presupuesto_asignado),
      porcentaje_usado: (Number(p.gastos_acumulados) / Number(p.presupuesto_asignado)) * 100
    }));

  return {
    total_proyectos: totalProyectos,
    proyectos_saludables: totalProyectos - proyectosEnRiesgo - proyectosCriticos,
    proyectos_en_riesgo: proyectosEnRiesgo,
    proyectos_criticos: proyectosCriticos,
    presupuesto_total: totalPresupuesto,
    gastado_total: totalGastado,
    balance_global: totalPresupuesto - totalGastado,
    porcentaje_ejecutado: (totalGastado / totalPresupuesto) * 100,
    top_gastos: topGastos
  };
}

// Ejecutar análisis
const resumen = await obtenerResumenGlobal();
console.log(resumen);
// {
//   total_proyectos: 12,
//   proyectos_saludables: 8,
//   proyectos_en_riesgo: 3,
//   proyectos_criticos: 1,
//   presupuesto_total: 150000,
//   gastado_total: 67500,
//   balance_global: 82500,
//   porcentaje_ejecutado: 45,
//   top_gastos: [
//     { nombre: "App XYZ", gastado: 15000, presupuesto: 25000, porcentaje_usado: 60 },
//     { nombre: "Ebook ABC", gastado: 12000, presupuesto: 15000, porcentaje_usado: 80 },
//     ...
//   ]
// }
```

---

## 🤖 CASO DE USO 6: Análisis de ROI de Herramientas AI

### Escenario

¿Cuál herramienta AI nos da el mejor retorno de inversión?

```typescript
async function analizarROIHerramientasAI() {
  const herramientas = await prisma.herramientaAI.findMany({
    where: { activa: true },
    include: {
      tareas: {
        include: {
          tarea: {
            select: {
              tiempo_estimado: true,
              tiempo_real: true,
              estado: true
            }
          }
        }
      },
      transacciones: {
        where: { estado: 'PAGADO' }
      }
    }
  });

  const analisis = herramientas.map(herramienta => {
    // Calcular tiempo ahorrado
    let tiempoAhorradoTotal = 0;
    let tareasCompletadas = 0;

    herramienta.tareas.forEach(rel => {
      const tarea = rel.tarea;
      if (tarea.estado === 'COMPLETADO' && tarea.tiempo_estimado && tarea.tiempo_real) {
        const ahorro = tarea.tiempo_estimado - tarea.tiempo_real;
        if (ahorro > 0) {
          tiempoAhorradoTotal += ahorro;
          tareasCompletadas++;
        }
      }
    });

    // Calcular valor del tiempo ahorrado (asumiendo $50/hora)
    const valorTiempoAhorrado = tiempoAhorradoTotal * 50;

    // Calcular costo total
    const costoTotal = Number(herramienta.costo_total_gastado);

    // ROI = (Valor generado - Costo) / Costo * 100
    const roi = costoTotal > 0 
      ? ((valorTiempoAhorrado - costoTotal) / costoTotal) * 100 
      : 0;

    return {
      nombre: herramienta.nombre,
      veces_usada: herramienta.veces_usada,
      costo_total: costoTotal,
      tiempo_ahorrado_horas: tiempoAhorradoTotal,
      valor_tiempo_ahorrado: valorTiempoAhorrado,
      roi: roi,
      roi_categoria: roi > 200 ? 'Excelente' : roi > 100 ? 'Bueno' : roi > 0 ? 'Positivo' : 'Negativo'
    };
  });

  // Ordenar por ROI
  return analisis.sort((a, b) => b.roi - a.roi);
}

const roiHerramientas = await analizarROIHerramientasAI();
console.log(roiHerramientas);
// [
//   {
//     nombre: "GitHub Copilot",
//     veces_usada: 87,
//     costo_total: 100,
//     tiempo_ahorrado_horas: 120,
//     valor_tiempo_ahorrado: 6000,
//     roi: 5900%, // ¡Excelente!
//     roi_categoria: 'Excelente'
//   },
//   {
//     nombre: "ChatGPT Plus",
//     veces_usada: 156,
//     costo_total: 240,
//     valor_tiempo_ahorrado: 3500,
//     roi: 1358%,
//     roi_categoria: 'Excelente'
//   },
//   ...
// ]
```

---

## 🔍 CASO DE USO 7: Búsqueda Avanzada de Activos

### Escenario

Necesitas encontrar todos los assets relacionados con "personajes" que estén bajo licencia comercial.

```typescript
// Búsqueda con múltiples filtros
const resultados = await prisma.activoDigital.findMany({
  where: {
    AND: [
      {
        OR: [
          { nombre: { contains: "personaje", mode: 'insensitive' } },
          { descripcion: { contains: "personaje", mode: 'insensitive' } },
          { etiquetas: { has: "personaje" } }
        ]
      },
      { derechos_uso: "USO_COMERCIAL" },
      { estado: "APROBADO" }
    ]
  },
  include: {
    proyecto: {
      select: { nombre: true }
    },
    tarea: {
      select: { nombre: true }
    },
    creado_por: {
      select: { nombre: true }
    }
  },
  orderBy: {
    fecha_creacion: 'desc'
  }
});

console.log(`Encontrados ${resultados.length} activos`);
resultados.forEach(activo => {
  console.log(`
    📦 ${activo.nombre}
    📁 Proyecto: ${activo.proyecto.nombre}
    ✅ Estado: ${activo.estado}
    👤 Creador: ${activo.creado_por.nombre}
    📏 Tamaño: ${activo.tamaño} MB
    🏷️ Tags: ${activo.etiquetas.join(', ')}
  `);
});
```

---

## 📈 CASO DE USO 8: Generar Reporte de Proyecto

### Escenario

Necesitas generar un reporte completo del proyecto para presentar al cliente.

```typescript
async function generarReporteProyecto(proyectoId: string) {
  const [proyecto, tareas, transacciones, activos, equipo] = await Promise.all([
    prisma.proyecto.findUnique({
      where: { id: proyectoId },
      include: { responsable: true }
    }),
    prisma.tarea.findMany({
      where: { proyecto_id: proyectoId },
      include: {
        asignado_a: true,
        subtareas: true,
        activos_generados: true
      }
    }),
    prisma.transaccion.findMany({
      where: { proyecto_id: proyectoId }
    }),
    prisma.activoDigital.findMany({
      where: { proyecto_id: proyectoId }
    }),
    prisma.proyectoUsuario.findMany({
      where: { proyecto_id: proyectoId },
      include: { usuario: true }
    })
  ]);

  const reporte = {
    // RESUMEN EJECUTIVO
    resumen: {
      nombre: proyecto.nombre,
      responsable: proyecto.responsable.nombre,
      estado: proyecto.estado,
      progreso: `${proyecto.progreso_total}%`,
      salud: calcularSaludProyecto(proyecto, tareas),
      fecha_inicio: proyecto.fecha_inicio,
      fecha_deadline: proyecto.fecha_deadline,
      dias_restantes: Math.ceil(
        (proyecto.fecha_deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    },

    // EQUIPO
    equipo: equipo.map(e => ({
      nombre: e.usuario.nombre,
      rol: e.rol,
      tareas_asignadas: tareas.filter(t => t.asignado_a?.id === e.usuario_id).length
    })),

    // PROGRESO DE TAREAS
    tareas: {
      total: proyecto.total_tareas,
      completadas: proyecto.tareas_completadas,
      en_progreso: proyecto.tareas_en_progreso,
      bloqueadas: proyecto.tareas_bloqueadas,
      por_hacer: proyecto.total_tareas - proyecto.tareas_completadas - proyecto.tareas_en_progreso,
      grafico: [
        { estado: 'Completadas', cantidad: proyecto.tareas_completadas },
        { estado: 'En Progreso', cantidad: proyecto.tareas_en_progreso },
        { estado: 'Bloqueadas', cantidad: proyecto.tareas_bloqueadas }
      ]
    },

    // FINANZAS
    finanzas: {
      presupuesto: Number(proyecto.presupuesto_asignado),
      gastado: Number(proyecto.gastos_acumulados),
      restante: Number(proyecto.balance_restante),
      porcentaje_ejecutado: (Number(proyecto.gastos_acumulados) / Number(proyecto.presupuesto_asignado)) * 100,
      roi_estimado: proyecto.roi_preliminar,
      gastos_por_categoria: calcularGastosPorCategoria(transacciones),
      ultimas_transacciones: transacciones
        .sort((a, b) => b.fecha_transaccion.getTime() - a.fecha_transaccion.getTime())
        .slice(0, 10)
    },

    // ACTIVOS GENERADOS
    activos: {
      total: activos.length,
      por_tipo: agruparActivosPorTipo(activos),
      espacio_usado: calcularEspacioEnGB(activos),
      destacados: activos
        .filter(a => a.favorito || a.veces_usado > 5)
        .slice(0, 10)
    },

    // HERRAMIENTAS AI
    herramientas_ai: {
      total_usadas: proyecto.herramientas_ai_usadas?.length || 0,
      costo_total: Number(proyecto.costo_ai_total),
      // ... más detalles
    },

    // HITOS IMPORTANTES
    hitos: tareas
      .filter(t => t.prioridad === 'CRITICA' || t.prioridad === 'ALTA')
      .map(t => ({
        nombre: t.nombre,
        estado: t.estado,
        fecha_vencimiento: t.fecha_vencimiento,
        asignado: t.asignado_a?.nombre
      })),

    // FECHA DE GENERACIÓN
    fecha_reporte: new Date()
  };

  return reporte;
}

// Uso
const reporte = await generarReporteProyecto("proyecto_123");

// Exportar a PDF, JSON, etc.
await exportarReportePDF(reporte);
```

---

## 🎯 Resumen de Patrones Comunes

### 1. **Crear → Vincular → Actualizar Automático**

Todos los elementos se vinculan y los rollups se actualizan automáticamente.

### 2. **Workflows → Tareas Predefinidas**

Usa workflows para generar estructuras de tareas repetibles.

### 3. **AI Tools → Track de Costos**

Siempre vincula herramientas AI a tareas para análisis de ROI.

### 4. **Activos → Relacionar con Tareas**

Todos los activos deben vincularse a la tarea que los produjo.

### 5. **Finanzas → Múltiples Relaciones**

Las transacciones pueden vincularse a proyecto, tarea, herramienta AI y activo.

### 6. **Dependencias → Bloqueos Automáticos**

Las dependencias entre tareas previenen inicio prematuro.

### 7. **Subtareas → Progreso Calculado**

El progreso de subtareas actualiza automáticamente la tarea padre.

---

**Versión**: 1.0  
**Fecha**: 2025-12-05  
**Sistema**: PM/DAM Casos de Uso

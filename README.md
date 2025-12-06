# 🚀 Sistema PM/DAM - Gestión de Proyectos y Activos Digitales

> **Sistema integral de gestión de proyectos y activos digitales inspirado en Notion, ClickUp, Airtable y Plane.so**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-green)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Visión General](#visión-general)
- [Características Principales](#características-principales)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
- [Módulos Principales](#módulos-principales)
- [Documentación](#documentación)
- [Roadmap](#roadmap)
- [Contribuir](#contribuir)

---

## 🎯 Visión General

Este sistema es una solución completa de **Project Management (PM)** y **Digital Asset Management (DAM)** diseñada para equipos creativos y de desarrollo que trabajan en la creación de activos digitales como:

- 📚 **Ebooks**
- 🎓 **Cursos Online**
- 🎮 **Juegos Lúdicos**
- 📱 **Aplicaciones (Web/Mobile)**

### Problema que Resuelve

Los equipos dedicados a crear activos digitales enfrentan múltiples desafíos:

- ❌ Gestión fragmentada de proyectos, tareas, finanzas y activos
- ❌ Falta de visibilidad del progreso en tiempo real
- ❌ Dificultad para calcular ROI y costos de herramientas (especialmente AI)
- ❌ Assets dispersos sin sistema centralizado de gestión
- ❌ No hay forma de medir el impacto de herramientas AI en productividad

### Solución

✅ **Base de datos maestra integrada** con 6 módulos interconectados  
✅ **Cálculos automáticos en tiempo real** (progreso, finanzas, ROI)  
✅ **DAM completo** para gestionar todos los activos digitales  
✅ **AI Directory** para trackear costos y ROI de herramientas AI  
✅ **Workflows predefinidos** para acelerar la creación de proyectos  
✅ **Dashboards inteligentes** con métricas clave  

---

## ✨ Características Principales

### 🎯 Gestión de Proyectos

- Creación de proyectos por tipo (Ebook, Curso, Juego, App)
- Workflows predefinidos con tareas template
- Progreso calculado automáticamente con rollups
- Sistema de salud del proyecto (Saludable/En Riesgo/Crítico)
- Dependencias entre tareas
- Subtareas ilimitadas con progreso anidado

### 💰 Gestión Financiera

- Presupuesto asignado vs gastos acumulados
- Cálculo automático de ROI preliminar
- Burn rate y runway (tiempo restante de presupuesto)
- Gastos recurrentes (suscripciones)
- Vinculación de gastos a proyectos, tareas, herramientas AI y activos
- Análisis de gastos por categoría
- Proyecciones mensuales

### 📦 Digital Asset Management (DAM)

- Gestión centralizada de todos los activos digitales
- Soporte para: Imágenes, Videos, Audio, Documentos, Código, 3D, Fuentes
- Sistema de licencias y derechos de uso
- Versionado de activos
- Metadatos técnicos completos (dimensiones, duración, codec, etc.)
- Búsqueda avanzada por tags, tipo, licencia, proyecto
- Contador de uso de activos
- Sistema de colecciones y series

### 🤖 AI Directory

- Catálogo de herramientas de IA
- Tracking de uso por proyecto y tarea
- Cálculo automático de costos de AI
- Análisis de ROI por herramienta
- Tiempo ahorrado estimado
- Alternativas sugeridas
- Integración con APIs (opcional)

### 📊 Analytics y Reportes

- Dashboard de proyecto en tiempo real
- Resumen financiero global
- Estadísticas de herramientas AI
- Análisis de activos
- Métricas de eficiencia (tiempo estimado vs real)
- Tendencias de progreso
- Exportación de reportes (PDF, CSV, JSON, XLSX)

### 🔔 Notificaciones

- Tareas asignadas
- Tareas vencidas
- Presupuesto excedido
- Proyecto completado
- Comentarios y menciones
- Actualizaciones de estado

---

## 🏗️ Arquitectura

El sistema se basa en **6 bases de datos principales** interconectadas:

```
┌─────────────────────┐
│   USUARIOS (0)      │
│  • Autenticación    │
│  • Roles y permisos │
└──────────┬──────────┘
           │
    ┌──────┴───────────────────────────┐
    │                                  │
    ▼                                  ▼
┌─────────────┐                 ┌────────────┐
│ PROYECTOS(1)│◄────────────────┤ WORKFLOWS  │
│  (Master DB)│                 │    (3)     │
└──┬──┬──┬──┬┘                 └────────────┘
   │  │  │  │
   │  │  │  └──────┐
   ▼  ▼  ▼         ▼
┌──────┐ ┌──────┐ ┌─────────┐
│TAREAS│ │ACTIVOS│ │FINANZAS │
│ (2)  │ │ (4)  │ │  (5)    │
└───┬──┘ └──┬───┘ └────┬────┘
    │       │          │
    └───────┴──────────┴───────┐
                               │
                               ▼
                      ┌──────────────┐
                      │ AI DIRECTORY │
                      │     (E)      │
                      └──────────────┘
```

### Tecnologías Principales

- **Backend**: Node.js + TypeScript
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Frontend** (sugerido): Next.js 14 + React
- **Validación**: Zod
- **Testing**: Jest + Vitest
- **Cache**: Redis (opcional)
- **Storage**: S3 o similar para activos

---

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/pm-dam-system.git
cd pm-dam-system
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
# Editar .env con tus credenciales
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pmdam"
JWT_SECRET="your-secret-key"
```

4. **Ejecutar migraciones**

```bash
npx prisma migrate dev
```

5. **Generar Prisma Client**

```bash
npx prisma generate
```

6. **Seed de datos iniciales (opcional)**

```bash
npm run seed
```

7. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

El sistema estará disponible en `http://localhost:3000`

---

## 🗄️ Estructura de la Base de Datos

### DB 1: Proyectos (Master)

- Información del proyecto (nombre, descripción, tipo, fechas)
- Progreso total (calculado con rollup)
- Finanzas (presupuesto, gastos, balance, ROI)
- Contadores de tareas y activos
- Costos de AI

### DB 2: Tareas

- Tareas y subtareas ilimitadas
- Dependencias entre tareas
- Asignación y fechas
- Tiempo estimado vs real
- Checklist y comentarios
- Vinculación con herramientas AI

### DB 3: Workflows

- Plantillas de proyectos
- Fases predefinidas
- Tareas template
- Aplicables a tipos de proyectos

### DB 4: Activos Digitales (DAM)

- Todos los tipos de activos
- Licencias y derechos
- Metadatos técnicos
- Versionado
- Vinculación a proyectos y tareas

### DB 5: Finanzas

- Transacciones (gastos e ingresos)
- Gastos recurrentes
- Vinculación múltiple (proyecto, tarea, herramienta AI, activo)
- Estados y aprobaciones

### DB E: AI Directory

- Catálogo de herramientas AI
- Costos y planes
- Estadísticas de uso
- ROI por herramienta
- Alternativas

Ver [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) para detalles completos.

---

## 📦 Módulos Principales

### 1. Módulo de Ebooks

- Workflow predefinido: Planificación → Escritura → Diseño → Revisión → Publicación
- Campos específicos: ISBN, número de páginas, formatos de exportación
- Gestión de capítulos como subtareas
- Diseño de portada con AI tools

### 2. Módulo de Cursos Online

- Estructura por módulos y lecciones
- Gestión de videos y materiales
- Plataforma de hosting
- Pricing y proyecciones de ingresos

### 3. Módulo de Juegos Lúdicos

- Game Design Document (GDD)
- Gestión de assets (sprites, audio, etc.)
- Engine y plataformas
- Fases de desarrollo

### 4. Módulo de Apps

- Discovery → Design → Development → Testing → Deploy
- Stack tecnológico
- Repositorios y URLs
- Gestión de librerías y licencias

Ver [EXAMPLES_AND_USE_CASES.md](./EXAMPLES_AND_USE_CASES.md) para ejemplos completos.

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Esquema completo de las 6 bases de datos con todos los campos, relaciones y fórmulas |
| [types/database.types.ts](./types/database.types.ts) | Interfaces TypeScript para todas las entidades |
| [utils/formulas.ts](./utils/formulas.ts) | Implementación de todas las fórmulas y rollups |
| [prisma/schema.prisma](./prisma/schema.prisma) | Schema de Prisma listo para producción |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Guía de implementación con queries, triggers y roadmap |
| [EXAMPLES_AND_USE_CASES.md](./EXAMPLES_AND_USE_CASES.md) | Casos de uso reales con código completo |

---

## 🧮 Fórmulas Clave

El sistema incluye cálculos automáticos en tiempo real:

### Progreso de Proyecto

```typescript
progreso_total = (tareas_completadas / total_tareas) * 100
```

### Balance Financiero

```typescript
balance_restante = presupuesto_asignado - gastos_acumulados
```

### ROI Preliminar

```typescript
roi = ((ingresos_estimados - gastos_acumulados) / gastos_acumulados) * 100
```

### Costo de AI

```typescript
costo_ai_total = SUM(herramientas_ai_usadas.costo_mensual)
```

### Salud del Proyecto

```typescript
salud = calcular_salud(
  diasRestantes,
  progresoEsperado,
  retrasoProgreso,
  tareasVencidas,
  excesoPresupuesto
)
// → 'Saludable' | 'En Riesgo' | 'Crítico'
```

Ver [utils/formulas.ts](./utils/formulas.ts) para todas las fórmulas.

---

## 📊 Dashboards Disponibles

### Dashboard de Proyecto

- Progreso visual (porcentaje completado)
- Estado de tareas (completadas, en progreso, bloqueadas)
- Balance financiero (presupuesto, gastado, restante)
- ROI preliminar
- Burn rate y runway
- Activos generados
- Herramientas AI usadas y costos

### Dashboard Global

- Todos los proyectos activos
- Proyectos por estado (saludables, en riesgo, críticos)
- Resumen financiero global
- Top gastos por categoría
- Herramientas AI más usadas
- ROI de herramientas AI

### Dashboard de AI Tools

- Catálogo completo
- Estadísticas de uso
- Análisis de ROI por herramienta
- Tiempo ahorrado estimado
- Recomendaciones y alternativas

---

## 🛣️ Roadmap

### ✅ Fase 1: Base (Completada)

- [x] Diseño de arquitectura
- [x] Schema de base de datos
- [x] Tipos TypeScript
- [x] Fórmulas y rollups
- [x] Documentación completa

### 🚧 Fase 2: Backend (En progreso)

- [ ] Setup de Prisma y PostgreSQL
- [ ] API REST/GraphQL
- [ ] Autenticación y autorización
- [ ] CRUD para todos los módulos
- [ ] Sistema de triggers
- [ ] Webhooks y notificaciones

### 📋 Fase 3: Frontend

- [ ] Setup de Next.js 14
- [ ] Diseño system y componentes
- [ ] Vistas principales (proyectos, tareas, finanzas)
- [ ] Dashboards interactivos
- [ ] Vista de DAM
- [ ] AI Directory

### 🎨 Fase 4: Módulos Especializados

- [ ] Módulo de Ebooks
- [ ] Módulo de Cursos Online
- [ ] Módulo de Juegos
- [ ] Módulo de Apps

### 🚀 Fase 5: Features Avanzadas

- [ ] Búsqueda avanzada
- [ ] Filtros dinámicos
- [ ] Exportación de reportes
- [ ] Integraciones (Slack, Discord, Zapier)
- [ ] Mobile app (React Native)

### ⚡ Fase 6: Optimización

- [ ] Tests unitarios y de integración
- [ ] Optimización de queries
- [ ] Caching con Redis
- [ ] Performance monitoring
- [ ] Deploy a producción

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Áreas donde puedes contribuir

- 🐛 Reportar bugs
- 💡 Sugerir nuevas features
- 📝 Mejorar documentación
- 🧪 Escribir tests
- 🎨 Mejorar UI/UX
- 🔧 Optimizar código

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

Este sistema fue inspirado por las mejores prácticas de:

- **Notion** - Flexibilidad de base de datos y vistas
- **ClickUp** - Gestión avanzada de proyectos
- **Airtable** - Sistema de relaciones y rollups
- **Plane.so** - UI/UX moderna y eficiente

---

## 📞 Contacto

**Proyecto**: PM/DAM System  
**Versión**: 1.0.0  
**Fecha**: Diciembre 2025

---

## 🎯 Casos de Uso Rápidos

### Crear un Ebook

```typescript
const proyecto = await crearProyecto({
  tipo: 'EBOOK',
  nombre: 'Mi Ebook',
  presupuesto: 5000
});

await aplicarWorkflow(proyecto.id, 'ebook-workflow');
// → Genera automáticamente 20+ tareas predefinidas
```

### Registrar uso de AI

```typescript
await vincularHerramientaAI({
  tarea_id: 'task_123',
  herramienta_id: 'midjourney'
});
// → Actualiza automáticamente costos y estadísticas
```

### Ver Dashboard

```typescript
const dashboard = await getDashboard(proyecto.id);
// → Retorna métricas en tiempo real
```

Ver más en [EXAMPLES_AND_USE_CASES.md](./EXAMPLES_AND_USE_CASES.md)

---

## 🌟 Características Destacadas

### 🔥 Lo que hace único a este sistema

1. **Rollups Automáticos**: Todos los cálculos se actualizan en tiempo real sin intervención manual

2. **AI-First**: Primer PM/DAM que trackea específicamente el uso y ROI de herramientas AI

3. **DAM Integrado**: No necesitas un sistema separado para gestionar activos

4. **Workflows Inteligentes**: Templates predefinidos que aceleran la creación de proyectos

5. **Finanzas Integradas**: Todo gasto está vinculado a su contexto (proyecto/tarea/herramienta)

6. **Tipo-seguro**: TypeScript en todo el stack para máxima confiabilidad

---

<div align="center">

**⭐ Si este proyecto te resulta útil, considera darle una estrella ⭐**

Hecho con ❤️ para equipos creativos y de desarrollo

</div>

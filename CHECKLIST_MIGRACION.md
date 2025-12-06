# Migración a SQLite y Adaptación de Servicios

## Estado: COMPLETA ✅

Se ha completado la migración de PostgreSQL a SQLite para resolver problemas de conexión y simplificar el entorno de desarrollo local.

### Cambios Realizados

1. **Base de Datos**:
    * Cambio de `provider = "postgresql"` a `provider = "sqlite"` en `prisma/schema.prisma`.
    * Configuración de URL en `.env`: `file:./dev.db`.
    * Eliminación de tipos escalares no soportados por SQLite (`String[]`, `Enum`, `JSON`). Convertidos a `String`.

2. **Manejo de Datos (Polyfills & Adaptadores)**:
    * Creación de `lib/enums_polyfill.ts`: Define los Enums y utilidades de parseo JSON (`parseJsonArray`).
    * Actualización de todos los servicios (`ProyectoService`, `TareaService`, `WorkflowService`, etc.) para:
        * **Escritura**: Serializar arrays y objetos a JSON Strings (`JSON.stringify`).
        * **Lectura**: Deserializar JSON Strings a objetos/arrays JS (`parseJsonArray`), manteniendo la compatibilidad con el Frontend.

3. **Correcciones de Tipado (TypeScript)**:
    * Resolución de errores de tipado en `formulas.ts` y servicios.
    * Casting explícito donde es necesario debido a la naturaleza dinámica de los campos JSON en SQLite.
    * Build exitoso (`npm run type-check` pasando sin errores).

4. **Funcionalidad**:
    * Los filtros de arrays (e.g., etiquetas) se adaptaron para funcionar con strings (`contains`).
    * Lógica de negocio ("Apply Workflow", "Rollups") preservada y adaptada.

### Próximos Pasos para el Usuario

1. Reiniciar el servidor de desarrollo:

    ```bash
    npm run dev
    ```

2. Probar la creación de un nuevo proyecto desde el Dashboard.
3. Verificar que las tareas, fases y etiquetas se guarden y muestren correctamente.

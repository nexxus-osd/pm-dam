# Módulo de Gestión de Carpetas

Este módulo proporciona funcionalidades avanzadas para la gestión de carpetas, documentos y archivos en el sistema.

## Características

1. **Estructura jerárquica de carpetas** - Permite crear carpetas anidadas con una estructura de árbol
2. **Gestión de documentos** - Crear, editar, eliminar y organizar documentos dentro de carpetas
3. **Soporte para diferentes tipos de documentos**:
   - Notas de texto
   - Archivos adjuntos
4. **Operaciones avanzadas**:
   - Mover carpetas y documentos entre carpetas
   - Duplicar carpetas
   - Buscar carpetas y documentos
   - Estadísticas de carpetas

## Arquitectura

### Componentes principales

1. **Modelos de datos**:
   - `Carpeta` - Representa una carpeta en el sistema
   - `Documento` - Representa un documento (nota o archivo)

2. **Servicios**:
   - `CarpetaService` - Servicio base para operaciones CRUD de carpetas y documentos
   - `FolderManagementService` - Servicio avanzado con funcionalidades adicionales

3. **API Routes**:
   - `/api/carpetas` - Operaciones CRUD para carpetas
   - `/api/carpetas/[id]` - Operaciones específicas para una carpeta
   - `/api/carpetas/documentos` - Operaciones CRUD para documentos
   - `/api/carpetas/documentos/[id]` - Operaciones específicas para un documento

4. **Componentes UI**:
   - `CarpetaItem` - Visualización de una carpeta
   - `DocumentoContent` - Visualización de contenido de documento
   - `CrearCarpetaDialog` - Diálogo para crear carpetas
   - `CrearDocumentoDialog` - Diálogo para crear documentos
   - `MoveItemDialog` - Diálogo para mover elementos
   - `SearchFoldersDocuments` - Componente de búsqueda

5. **Server Actions**:
   - Acciones para todas las operaciones de carpeta y documento
   - Acciones para funcionalidades avanzadas como mover, duplicar y buscar

## Uso

### Crear una carpeta

```typescript
// Usando server actions
const result = await createCarpetaAction({
  nombre: "Nueva Carpeta",
  descripcion: "Descripción opcional",
  proyecto_id: "id-del-proyecto",
  creada_por_id: "id-del-usuario"
});
```

### Crear un documento

```typescript
// Para una nota de texto
const result = await createDocumentoAction({
  nombre: "Mi Nota",
  descripcion: "Descripción opcional",
  tipo_documento: "Nota",
  contenido: "Contenido de la nota",
  proyecto_id: "id-del-proyecto",
  carpeta_id: "id-de-la-carpeta-opcional",
  creada_por_id: "id-del-usuario"
});

// Para un archivo adjunto
const formData = new FormData();
formData.append('nombre', 'Mi Archivo');
formData.append('tipo_documento', 'PDF');
formData.append('archivo', file);
formData.append('proyecto_id', 'id-del-proyecto');
formData.append('creada_por_id', 'id-del-usuario');

const result = await createDocumentoAction(formData);
```

### Mover una carpeta o documento

```typescript
// Mover una carpeta
const result = await moveCarpetaAction(
  "id-de-la-carpeta", 
  "id-de-la-nueva-carpeta-padre-o-null-para-raiz", 
  "id-del-proyecto"
);

// Mover un documento
const result = await moveDocumentoAction(
  "id-del-documento", 
  "id-de-la-nueva-carpeta-o-null-para-raiz", 
  "id-del-proyecto"
);
```

### Buscar carpetas y documentos

```typescript
const result = await searchFoldersAndDocumentsAction(
  "id-del-proyecto",
  "término-de-búsqueda"
);

// Resultado contiene:
// {
//   carpetas: [...],
//   documentos: [...]
// }
```

## Integración

### En páginas de proyecto

El módulo está integrado en las páginas de proyecto donde los usuarios pueden:
- Crear y organizar carpetas
- Subir y crear documentos
- Mover elementos entre carpetas
- Buscar contenido específico

### API REST

Todas las operaciones están disponibles a través de endpoints RESTful que siguen las mejores prácticas:
- GET para lectura
- POST para creación
- PUT para actualización
- DELETE para eliminación

Los endpoints manejan adecuadamente:
- Validación de datos
- Manejo de errores
- Respuestas consistentes

## Seguridad

- Todas las operaciones requieren contexto de proyecto
- Validación de permisos a nivel de servicio
- Protección contra operaciones cíclicas (mover una carpeta a sí misma)
- Validación de integridad referencial

## Extensibilidad

El módulo está diseñado para ser fácilmente extensible:
- Nuevos tipos de documentos pueden agregarse fácilmente
- Las funcionalidades de búsqueda pueden ampliarse
- Se pueden agregar nuevas operaciones de gestión masiva
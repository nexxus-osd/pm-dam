# Guía de Integración del Módulo de Gestión de Carpetas

Esta guía explica cómo integrar y utilizar el módulo de gestión de carpetas en tu aplicación.

## Estructura del Módulo

```
app/
├── api/
│   └── carpetas/
│       ├── route.ts                  # CRUD de carpetas
│       ├── [id]/
│       │   └── route.ts             # Operaciones específicas de carpeta
│       └── documentos/
│           ├── route.ts             # CRUD de documentos
│           └── [id]/
│               └── route.ts         # Operaciones específicas de documento
├── carpetas/
│   └── page.tsx                     # Página principal de gestión de carpetas
components/
├── carpetas/
│   ├── carpeta-item.tsx             # Componente para mostrar una carpeta
│   ├── crear-carpeta-dialog.tsx     # Diálogo para crear carpetas
│   ├── crear-documento-dialog.tsx   # Diálogo para crear documentos
│   ├── editar-carpeta-dialog.tsx    # Diálogo para editar carpetas
│   ├── editar-documento-dialog.tsx  # Diálogo para editar documentos
│   ├── documento-content.tsx        # Visualización de contenido de documento
│   ├── move-item-dialog.tsx         # Diálogo para mover elementos
│   └── search-folders-documents.tsx # Componente de búsqueda
lib/
├── services/
│   ├── carpeta.service.ts           # Servicio base (ya existente)
│   └── folder-management.service.ts # Servicio avanzado (nuevo)
├── validations/
│   └── carpeta.ts                   # Validaciones (ya existente)
app/
├── actions/
│   ├── carpetas.ts                  # Server actions básicos (ya existentes)
│   └── folder-management.ts         # Server actions avanzados (nuevos)
```

## Integración en Páginas Existentes

### En la página de detalle de proyecto

Para integrar el módulo en la página de detalle de proyecto (`app/proyectos/[id]/page.tsx`):

1. Importar los nuevos componentes:
```typescript
import { MoveItemDialog } from "@/components/carpetas/move-item-dialog";
import { SearchFoldersDocuments } from "@/components/carpetas/search-folders-documents";
```

2. Agregar funcionalidad de búsqueda:
```tsx
<div className="mb-6">
  <SearchFoldersDocuments 
    projectId={id} 
    onResultSelect={(item, type) => {
      // Manejar selección de resultado de búsqueda
      if (type === 'carpeta') {
        // Navegar a la carpeta
      } else {
        // Mostrar el documento
        handleViewDocumento(item);
      }
    }}
  />
</div>
```

3. Agregar botón de mover en las acciones de carpeta:
```tsx
<MoveItemDialog
  itemType="carpeta"
  itemId={carpeta.id}
  projectName={proyecto.nombre}
  projectId={id}
  currentFolderId={carpeta.carpeta_padre_id}
  folders={proyecto.carpetas}
  onMove={fetchProyecto}
>
  <Button variant="ghost" size="sm">
    <Move className="h-4 w-4" />
  </Button>
</MoveItemDialog>
```

## Uso de la API

### Endpoints disponibles

1. **Listar carpetas de un proyecto**
   ```
   GET /api/carpetas?proyectoId=ID_DEL_PROYECTO&carpetaPadreId=ID_DE_CARPETA_PADRE_OPCIONAL
   ```

2. **Crear una carpeta**
   ```
   POST /api/carpetas
   Content-Type: application/json
   
   {
     "nombre": "Nombre de la carpeta",
     "descripcion": "Descripción opcional",
     "proyecto_id": "ID_DEL_PROYECTO",
     "carpeta_padre_id": "ID_DE_CARPETA_PADRE_OPCIONAL",
     "creada_por_id": "ID_DEL_USUARIO"
   }
   ```

3. **Obtener una carpeta específica**
   ```
   GET /api/carpetas/ID_DE_LA_CARPETA
   ```

4. **Actualizar una carpeta**
   ```
   PUT /api/carpetas/ID_DE_LA_CARPETA
   Content-Type: application/json
   
   {
     "nombre": "Nuevo nombre",
     "descripcion": "Nueva descripción"
   }
   ```

5. **Eliminar una carpeta**
   ```
   DELETE /api/carpetas/ID_DE_LA_CARPETA
   ```

6. **Listar documentos**
   ```
   GET /api/carpetas/documentos?proyectoId=ID_DEL_PROYECTO&carpetaId=ID_DE_CARPETA_OPCIONAL
   ```

7. **Crear un documento**
   ```
   POST /api/carpetas/documentos
   Content-Type: application/json o multipart/form-data
   
   // Para notas de texto:
   {
     "nombre": "Nombre del documento",
     "descripcion": "Descripción opcional",
     "tipo_documento": "Nota",
     "contenido": "Contenido de la nota",
     "proyecto_id": "ID_DEL_PROYECTO",
     "carpeta_id": "ID_DE_CARPETA_OPCIONAL",
     "creada_por_id": "ID_DEL_USUARIO"
   }
   
   // Para archivos:
   FormData con los campos anteriores más:
   archivo: FILE_OBJECT
   ```

8. **Obtener un documento específico**
   ```
   GET /api/carpetas/documentos/ID_DEL_DOCUMENTO
   ```

9. **Actualizar un documento**
   ```
   PUT /api/carpetas/documentos/ID_DEL_DOCUMENTO
   Content-Type: application/json o multipart/form-data
   ```

10. **Eliminar un documento**
    ```
    DELETE /api/carpetas/documentos/ID_DEL_DOCUMENTO
    ```

## Uso de Server Actions

### Acciones básicas (ya existentes)
```typescript
import { 
  createCarpetaAction, 
  updateCarpetaAction, 
  deleteCarpetaAction,
  createDocumentoAction,
  updateDocumentoAction,
  deleteDocumentoAction
} from "@/app/actions/carpetas";
```

### Acciones avanzadas (nuevas)
```typescript
import { 
  moveCarpetaAction, 
  moveDocumentoAction, 
  searchFoldersAndDocumentsAction,
  getFolderStatsAction,
  duplicateCarpetaAction
} from "@/app/actions/folder-management";
```

## Personalización

### Agregar nuevos tipos de documentos

1. Actualizar el enum de tipos de documento en el esquema de Prisma si es necesario
2. Modificar las validaciones en `lib/validations/carpeta.ts` si se necesitan reglas específicas
3. Actualizar la interfaz de usuario para manejar el nuevo tipo

### Extender funcionalidades de búsqueda

1. Modificar el método `searchFoldersAndDocuments` en `FolderManagementService`
2. Actualizar el componente `SearchFoldersDocuments` para mostrar nuevos campos
3. Agregar filtros adicionales según sea necesario

### Agregar permisos

1. Modificar los servicios para verificar permisos antes de realizar operaciones
2. Agregar middleware de autenticación a las rutas de API si es necesario
3. Actualizar las validaciones para incluir verificación de permisos

## Manejo de Errores

Todos los servicios y acciones manejan errores apropiadamente:
- Errores de validación retornan mensajes descriptivos
- Errores de base de datos son registrados y se retornan mensajes genéricos al cliente
- Los errores de red y del sistema se manejan con reintentos cuando es apropiado

## Recomendaciones de Uso

1. **Validación de datos**: Siempre validar los datos antes de pasarlos a los servicios
2. **Manejo de estado**: Utilizar `revalidatePath` después de operaciones que modifican datos
3. **Seguridad**: Verificar siempre los permisos del usuario antes de permitir operaciones
4. **Performance**: Implementar paginación para listados grandes
5. **Experiencia de usuario**: Proporcionar feedback visual durante operaciones largas

## Problemas Comunes

1. **Errores de tipo al mover elementos**: Asegúrate de que los IDs sean del tipo correcto (string)
2. **Problemas con archivos adjuntos**: Verifica que el servidor tenga permisos para manejar uploads
3. **Errores de validación**: Revisa que todos los campos requeridos estén presentes
4. **Problemas de permisos**: Verifica que el usuario tenga acceso al proyecto y carpeta correspondientes

## Mantenimiento

1. **Actualizaciones de dependencias**: Revisar compatibilidad con nuevas versiones de Next.js
2. **Optimización de consultas**: Monitorear el rendimiento de las consultas a la base de datos
3. **Limpieza de código**: Remover código obsoleto y optimizar componentes
4. **Pruebas**: Mantener cobertura de pruebas adecuada para nuevas funcionalidades
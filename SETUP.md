# 🚀 Guía de Setup - Sistema PM/DAM

Esta guía te llevará paso a paso por la configuración inicial del proyecto.

---

## ✅ Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** 18 o superior → [Descargar](https://nodejs.org/)
- **PostgreSQL** 15 o superior → [Descargar](https://www.postgresql.org/download/)
- **npm** o **yarn**
- **Git**

Para verificar:

```bash
node --version  # Debe ser >= 18
npm --version   # Debe ser >= 9
psql --version  # Debe ser >= 15
```

---

## 📦 Paso 1: Instalar Dependencias

```bash
npm install
```

Esto instalará:

- Next.js 14
- Prisma
- TypeScript
- Zod
- Y todas las demás dependencias

---

## 🗄️ Paso 2: Configurar Base de Datos

### 2.1 Crear Base de Datos en PostgreSQL

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE pmdam;

# Crear usuario (opcional)
CREATE USER pmdam_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE pmdam TO pmdam_user;

# Salir
\q
```

### 2.2 Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env  # o usar tu editor favorito
```

Configurar mínimamente:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/pmdam?schema=public"
NEXTAUTH_SECRET="genera-un-secret-aqui"
JWT_SECRET="genera-otro-secret-aqui"
```

Para generar secrets seguros:

```bash
openssl rand -base64 32
```

---

## 🔧 Paso 3: Configurar Prisma

### 3.1 Generar Prisma Client

```bash
npm run db:generate
```

### 3.2 Ejecutar Migraciones

```bash
npm run db:migrate
```

Cuando te pregunte por el nombre de la migración, usar:

```
init
```

Esto creará todas las tablas en la base de datos.

### 3.3 (Opcional) Ver Base de Datos

```bash
npm run db:studio
```

Esto abrirá Prisma Studio en `http://localhost:5555`

---

## 🌱 Paso 4: Seed de Datos de Prueba

```bash
npm run db:seed
```

Esto creará:

- ✅ 5 usuarios de prueba
- ✅ 4 herramientas AI (ChatGPT, Midjourney, etc.)
- ✅ 1 workflow de Ebook
- ✅ 1 proyecto de ejemplo
- ✅ 4 tareas
- ✅ 1 activo digital
- ✅ 3 transacciones

**Credenciales de acceso:**

- <admin@pmdam.com>
- <maria@pmdam.com> (Project Manager)
- <carlos@pmdam.com> (Developer)
- <ana@pmdam.com> (Designer)
- <luis@pmdam.com> (Content Creator)

---

## ▶️ Paso 5: Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:3000
```

---

## 🧪 Paso 6: Verificar Instalación

### Verificar que Prisma funciona

```bash
npx prisma db pull
```

Debe mostrar: "✔ Introspected 15 models..."

### Verificar TypeScript

```bash
npm run type-check
```

No debe mostrar errores.

---

## 📁 Estructura del Proyecto

```
admin am-pm/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   └── (resto de rutas)
├── components/            # Componentes React
├── lib/                   # Librerías y utilities
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/
│   ├── schema.prisma     # Schema de DB
│   └── seed.ts           # Datos de prueba
├── types/
│   └── database.types.ts # Interfaces TypeScript
├── utils/
│   └── formulas.ts       # Fórmulas y rollups
├── .env                   # Variables de entorno (NO commitearlo)
├── .env.example          # Template de .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Build para producción |
| `npm start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run db:generate` | Genera Prisma Client |
| `npm run db:migrate` | Ejecuta migraciones |
| `npm run db:push` | Push schema sin migración |
| `npm run db:seed` | Ejecuta seed de datos |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run db:reset` | Resetea DB (⚠️ Borra todo) |
| `npm run type-check` | Verifica tipos TypeScript |
| `npm test` | Ejecuta tests |

---

## 🔍 Primer Uso

Una vez que el servidor esté corriendo:

### 1. Ver Dashboard Principal

```
http://localhost:3000
```

### 2. Ver Proyecto de Ejemplo

```
http://localhost:3000/proyectos/[ID_DEL_PROYECTO]
```

### 3. Explorar API

```
http://localhost:3000/api/proyectos
http://localhost:3000/api/tareas
http://localhost:3000/api/herramientas-ai
```

### 4. Ver Prisma Studio

```bash
npm run db:studio
```

Luego abre: `http://localhost:5555`

---

## 🐛 Solución de Problemas

### Error: "Can't reach database server"

**Solución:**

1. Verificar que PostgreSQL esté corriendo:

   ```bash
   sudo service postgresql status
   # o
   pg_ctl status
   ```

2. Verificar credenciales en `.env`

3. Intentar conectar manualmente:

   ```bash
   psql -U postgres -d pmdam
   ```

### Error:  "Prisma Client could not locate"

**Solución:**

```bash
npm run db:generate
```

### Error: "Migration failed"

**Solución:**

```bash
# Resetear migraciones (⚠️ Borra datos)
npm run db:reset

# O manualmente:
npx prisma migrate reset
npx prisma migrate dev
npm run db:seed
```

### Error: Port 3000 already in use

**Solución:**

```bash
# Cambiar puerto en .env
PORT=3001

# O matar proceso:
lsof -ti:3000 | xargs kill
```

---

## 📊 Verificar Datos de Seed

Después de ejecutar el seed, verifica:

```sql
-- Conectar a la DB
psql -U postgres -d pmdam

-- Ver usuarios
SELECT nombre, email, rol FROM usuarios;

-- Ver proyectos
SELECT nombre, estado, progreso_total FROM proyectos;

-- Ver herramientas AI
SELECT nombre, costo_mensual, veces_usada FROM herramientas_ai;

-- Salir
\q
```

---

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ **Explorar la documentación**
   - Lee `DATABASE_SCHEMA.md`
   - Revisa `EXAMPLES_AND_USE_CASES.md`

2. ✅ **Crear tu primer proyecto**
   - Usa la API o interfaz (cuando esté lista)
   - Prueba los workflows

3. ✅ **Estudiar el código**
   - Revisa `utils/formulas.ts`
   - Entiende los rollups

4. ✅ **Comenzar desarrollo**
   - Implementar API routes
   - Crear componentes UI
   - Agregar features

---

## 🆘 Ayuda

Si tienes problemas:

1. **Revisa logs**:

   ```bash
   # Logs de Prisma
   npx prisma --version
   
   # Logs de Node
   npm run dev --verbose
   ```

2. **Consulta documentación**:
   - [Prisma Docs](https://www.prisma.io/docs)
   - [Next.js Docs](https://nextjs.org/docs)

3. **Issues conocidos**: Ver `IMPLEMENTATION_GUIDE.md`

---

## ✅ Checklist de Setup Completo

- [ ] Node.js instalado
- [ ] PostgreSQL instalado y corriendo
- [ ] Dependencias instaladas (`npm install`)
- [ ] `.env` configurado
- [ ] Base de datos creada
- [ ] Migraciones ejecutadas
- [ ] Seed ejecutado
- [ ] Servidor dev corriendo
- [ ] Prisma Studio funciona
- [ ] No hay errores de TypeScript

**Si todos los checks están ✅, ya estás listo para desarrollar! 🚀**

---

## 📝 Notas

- **Desarrollo**: Usa `npm run dev` siempre
- **Producción**: Primero `npm run build`, luego `npm start`
- **Base de Datos**: No shares credenciales de producción
- **Git**: Nunca commitear `.env`

---

**¿Todo listo?** Continúa con la **Fase 2: Implementar API** según `IMPLEMENTATION_GUIDE.md`

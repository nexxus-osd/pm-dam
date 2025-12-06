import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de la base de datos (SQLite)...');

    // Limpiar datos existentes (opcional - comentar en producción)
    try {
        await prisma.notificacion.deleteMany();
        await prisma.comentario.deleteMany();
        await prisma.tareaHerramientaAI.deleteMany();
        await prisma.tareaDependencia.deleteMany();
        await prisma.tareaObservador.deleteMany();
        await prisma.transaccion.deleteMany();
        await prisma.activoDigital.deleteMany();
        await prisma.tarea.deleteMany();
        await prisma.proyectoWorkflow.deleteMany();
        await prisma.proyectoUsuario.deleteMany();
        await prisma.proyecto.deleteMany();
        await prisma.workflow.deleteMany();
        await prisma.herramientaAI.deleteMany();
        await prisma.usuario.deleteMany();
        console.log('✅ Datos existentes eliminados');
    } catch (e) {
        console.log('⚠️ No se pudieron borrar algunos datos (probablemente primera ejecución)');
    }

    // === 1. CREAR USUARIOS ===
    console.log('👥 Creando usuarios...');

    const admin = await prisma.usuario.create({
        data: {
            nombre: 'Admin Principal',
            email: 'admin@pmdam.com',
            rol: 'ADMIN',
            departamento: 'Dirección',
            activo: true,
            preferencias: JSON.stringify({
                tema: 'dark',
                idioma: 'es',
                notificaciones_email: true,
                notificaciones_push: true,
            }),
        },
    });

    const pm = await prisma.usuario.create({
        data: {
            nombre: 'María González',
            email: 'maria@pmdam.com',
            rol: 'PROJECT_MANAGER',
            departamento: 'Gestión de Proyectos',
            activo: true,
        },
    });

    const dev = await prisma.usuario.create({
        data: {
            nombre: 'Carlos Ruiz',
            email: 'carlos@pmdam.com',
            rol: 'DESARROLLADOR',
            departamento: 'Desarrollo',
            activo: true,
        },
    });

    const designer = await prisma.usuario.create({
        data: {
            nombre: 'Ana Martínez',
            email: 'ana@pmdam.com',
            rol: 'DISENADOR',
            departamento: 'Diseño',
            activo: true,
        },
    });

    const writer = await prisma.usuario.create({
        data: {
            nombre: 'Luis Fernández',
            email: 'luis@pmdam.com',
            rol: 'CREADOR_CONTENIDO',
            departamento: 'Contenido',
            activo: true,
        },
    });

    console.log(`✅ ${5} usuarios creados`);

    // === 2. CREAR HERRAMIENTAS AI ===
    console.log('🤖 Creando catálogo de herramientas AI...');

    const chatgpt = await prisma.herramientaAI.create({
        data: {
            nombre: 'ChatGPT Plus',
            categoria: JSON.stringify(['TEXTO', 'CODIGO']),
            descripcion: 'Asistente de IA para generación de texto, código y análisis',
            url: 'https://chat.openai.com',
            tipo_precio: 'SUSCRIPCION',
            costo_mensual: 20,
            moneda: 'USD',
            plan_actual: 'Plus',
            estado_suscripcion: 'ACTIVA',
            caracteristicas: JSON.stringify([
                'GPT-4 access',
                'Generación de código',
                'Análisis de datos',
                'Plugins',
            ]),
            casos_uso: JSON.stringify(['Escritura de contenido', 'Debugging', 'Ideación']),
            rating: 4.8,
            favorita: true,
            agregado_por_id: admin.id,
            activa: true,
            tiene_api: true,
        },
    });

    const midjourney = await prisma.herramientaAI.create({
        data: {
            nombre: 'Midjourney',
            categoria: JSON.stringify(['IMAGEN']),
            descripcion: 'Generador de imágenes con IA',
            url: 'https://midjourney.com',
            tipo_precio: 'SUSCRIPCION',
            costo_mensual: 30,
            moneda: 'USD',
            plan_actual: 'Pro',
            estado_suscripcion: 'ACTIVA',
            caracteristicas: JSON.stringify(['Generación de imágenes', 'Upscaling', 'Variaciones']),
            casos_uso: JSON.stringify(['Diseño de portadas', 'Ilustraciones', 'Conceptos visuales']),
            rating: 4.9,
            favorita: true,
            agregado_por_id: admin.id,
            activa: true,
        },
    });

    const _copilot = await prisma.herramientaAI.create({
        data: {
            nombre: 'GitHub Copilot',
            categoria: JSON.stringify(['CODIGO']),
            descripcion: 'Asistente de programación con IA',
            url: 'https://github.com/features/copilot',
            tipo_precio: 'SUSCRIPCION',
            costo_mensual: 10,
            moneda: 'USD',
            plan_actual: 'Individual',
            estado_suscripcion: 'ACTIVA',
            caracteristicas: JSON.stringify(['Code completion', 'Sugerencias', 'Documentación']),
            casos_uso: JSON.stringify(['Desarrollo', 'Code review', 'Aprendizaje']),
            rating: 4.7,
            favorita: true,
            agregado_por_id: admin.id,
            activa: true,
            tiene_api: false,
        },
    });

    const claude = await prisma.herramientaAI.create({
        data: {
            nombre: 'Claude Pro',
            categoria: JSON.stringify(['TEXTO', 'CODIGO', 'ANALISIS']),
            descripcion: 'Asistente de IA de Anthropic',
            url: 'https://claude.ai',
            tipo_precio: 'SUSCRIPCION',
            costo_mensual: 20,
            moneda: 'USD',
            plan_actual: 'Pro',
            estado_suscripcion: 'ACTIVA',
            caracteristicas: JSON.stringify(['Contexto largo', 'Análisis de documentos', 'Coding']),
            casos_uso: JSON.stringify(['Análisis', 'Escritura técnica', 'Código']),
            rating: 4.8,
            agregado_por_id: admin.id,
            activa: true,
            tiene_api: true,
        },
    });

    console.log(`✅ ${4} herramientas AI creadas`);

    // === 3. CREAR WORKFLOW DE EBOOK ===
    console.log('🔄 Creando workflow de Ebook...');

    const fasesEbook = [
        {
            nombre: 'Planificación',
            orden: 1,
            duracion_estimada: 7,
            tareas_template: [
                { nombre: 'Definir audiencia objetivo', tipo: 'INVESTIGACION', duracion_estimada: 4 },
                { nombre: 'Investigación de mercado', tipo: 'INVESTIGACION', duracion_estimada: 8 },
                { nombre: 'Crear outline del libro', tipo: 'CONTENIDO', duracion_estimada: 6 },
            ],
        },
        {
            nombre: 'Escritura',
            orden: 2,
            duracion_estimada: 30,
            tareas_template: [
                { nombre: 'Introducción', tipo: 'CONTENIDO', duracion_estimada: 8 },
                { nombre: 'Capítulo 1', tipo: 'CONTENIDO', duracion_estimada: 12 },
                { nombre: 'Capítulo 2', tipo: 'CONTENIDO', duracion_estimada: 12 },
                { nombre: 'Capítulo 3', tipo: 'CONTENIDO', duracion_estimada: 12 },
                { nombre: 'Conclusión', tipo: 'CONTENIDO', duracion_estimada: 6 },
            ],
        },
        {
            nombre: 'Diseño',
            orden: 3,
            duracion_estimada: 7,
            tareas_template: [
                { nombre: 'Diseño de portada', tipo: 'DISENO', duracion_estimada: 8 },
                { nombre: 'Maquetación', tipo: 'DISENO', duracion_estimada: 12 },
            ],
        },
        {
            nombre: 'Revisión',
            orden: 4,
            duracion_estimada: 7,
            tareas_template: [
                { nombre: 'Corrección de estilo', tipo: 'REVISION', duracion_estimada: 16 },
                { nombre: 'Revisión técnica', tipo: 'REVISION', duracion_estimada: 8 },
            ],
        },
        {
            nombre: 'Publicación',
            orden: 5,
            duracion_estimada: 3,
            tareas_template: [
                { nombre: 'Exportar a PDF/EPUB', tipo: 'OTRO', duracion_estimada: 4 },
                { nombre: 'Configurar distribución', tipo: 'MARKETING', duracion_estimada: 4 },
            ],
        },
    ];

    const _workflowEbook = await prisma.workflow.create({
        data: {
            nombre: 'Workflow de Ebook',
            tipo_proyecto: 'EBOOK',
            descripcion: 'Flujo de trabajo completo para la creación de un ebook',
            fases: JSON.stringify(fasesEbook),
            plantilla_tareas: JSON.stringify([]),
            activo: true,
            creado_por: admin.id,
        },
    });

    console.log('✅ Workflow de Ebook creado');

    // === 4. CREAR PROYECTO DE EBOOK ===
    console.log('📚 Creando proyecto de ejemplo: Ebook...');

    const proyectoEbook = await prisma.proyecto.create({
        data: {
            nombre: 'Ebook: Productividad con IA',
            descripcion: 'Guía completa sobre cómo usar herramientas de IA para aumentar la productividad personal y profesional',
            tipo_activo: 'EBOOK',
            estado: 'EN_PROGRESO',
            prioridad: 'ALTA',
            fecha_inicio: new Date('2025-01-01'),
            fecha_deadline: new Date('2025-03-31'),
            presupuesto_asignado: 5000,
            ingresos_estimados: 15000,
            responsable_id: pm.id,
            etiquetas: JSON.stringify(['productividad', 'ia', 'ebook', 'tecnología']),
            notas: 'Este es nuestro primer ebook sobre IA. Enfocado en usuarios no técnicos.',
            campos_personalizados: JSON.stringify({
                numero_paginas: 150,
                formato_exportacion: ['PDF', 'EPUB', 'MOBI'],
                autor: 'Luis Fernández',
                isbn: '978-3-16-148410-0',
            }),
        },
    });

    // Agregar equipo al proyecto
    await prisma.proyectoUsuario.createMany({
        data: [
            { proyecto_id: proyectoEbook.id, usuario_id: writer.id, rol: 'Escritor Principal' },
            { proyecto_id: proyectoEbook.id, usuario_id: designer.id, rol: 'Diseñador' },
            { proyecto_id: proyectoEbook.id, usuario_id: dev.id, rol: 'Soporte Técnico' },
        ],
    });

    console.log('✅ Proyecto de Ebook creado con equipo');

    // === 5. CREAR TAREAS DEL PROYECTO ===
    console.log('✅ Creando tareas del proyecto...');

    // Fase 1: Planificación
    const tareaOutline = await prisma.tarea.create({
        data: {
            proyecto_id: proyectoEbook.id,
            nombre: 'Crear outline del libro',
            descripcion: 'Definir estructura completa de capítulos y secciones',
            tipo_tarea: 'CONTENIDO',
            estado: 'COMPLETADO',
            prioridad: 'CRITICA',
            asignado_a_id: writer.id,
            fecha_inicio: new Date('2025-01-02'),
            fecha_vencimiento: new Date('2025-01-06'),
            fecha_completado: new Date('2025-01-05'),
            tiempo_estimado: 6,
            tiempo_real: 5,
            etiquetas: JSON.stringify(['planificación', 'estructura']),
        },
    });

    // Fase 2: Escritura
    const tareaIntro = await prisma.tarea.create({
        data: {
            proyecto_id: proyectoEbook.id,
            nombre: 'Escribir Introducción',
            descripcion: 'Redactar introducción del ebook explicando el propósito y alcance',
            tipo_tarea: 'CONTENIDO',
            estado: 'COMPLETADO',
            prioridad: 'ALTA',
            asignado_a_id: writer.id,
            fecha_inicio: new Date('2025-01-08'),
            fecha_vencimiento: new Date('2025-01-12'),
            fecha_completado: new Date('2025-01-11'),
            tiempo_estimado: 8,
            tiempo_real: 7,
            etiquetas: JSON.stringify(['escritura', 'introducción']),
        },
    });

    const tareaCapitulo1 = await prisma.tarea.create({
        data: {
            proyecto_id: proyectoEbook.id,
            nombre: 'Capítulo 1: Introducción a las herramientas de IA',
            descripcion: 'Explicar qué son las herramientas de IA y cómo pueden ayudar',
            tipo_tarea: 'CONTENIDO',
            estado: 'EN_PROGRESO',
            prioridad: 'ALTA',
            asignado_a_id: writer.id,
            fecha_inicio: new Date('2025-01-15'),
            fecha_vencimiento: new Date('2025-01-25'),
            tiempo_estimado: 12,
            tiempo_real: 8,
            etiquetas: JSON.stringify(['escritura', 'capítulo-1']),
            checklist: JSON.stringify([
                { id: '1', item: 'Definir concepto de IA', completado: true, orden: 1 },
                { id: '2', item: 'Listar herramientas principales', completado: true, orden: 2 },
                { id: '3', item: 'Casos de uso reales', completado: false, orden: 3 },
                { id: '4', item: 'Ejercicios prácticos', completado: false, orden: 4 },
            ]),
        },
    });

    // Fase 3: Diseño
    const tareaPortada = await prisma.tarea.create({
        data: {
            proyecto_id: proyectoEbook.id,
            nombre: 'Diseñar portada del ebook',
            descripcion: 'Crear portada atractiva y profesional usando Midjourney',
            tipo_tarea: 'DISENO',
            estado: 'COMPLETADO',
            prioridad: 'ALTA',
            asignado_a_id: designer.id,
            fecha_inicio: new Date('2025-01-20'),
            fecha_vencimiento: new Date('2025-01-25'),
            fecha_completado: new Date('2025-01-24'),
            tiempo_estimado: 8,
            tiempo_real: 6,
            etiquetas: JSON.stringify(['diseño', 'portada']),
        },
    });

    console.log(`✅ ${4} tareas creadas`);

    // === 6. VINCULAR HERRAMIENTAS AI A TAREAS ===
    console.log('🔗 Vinculando herramientas AI a tareas...');

    await prisma.tareaHerramientaAI.createMany({
        data: [
            { tarea_id: tareaOutline.id, herramienta_id: chatgpt.id },
            { tarea_id: tareaIntro.id, herramienta_id: chatgpt.id },
            { tarea_id: tareaCapitulo1.id, herramienta_id: chatgpt.id },
            { tarea_id: tareaCapitulo1.id, herramienta_id: claude.id },
            { tarea_id: tareaPortada.id, herramienta_id: midjourney.id },
        ],
    });

    console.log('✅ Herramientas AI vinculadas');

    // === 7. CREAR ACTIVOS DIGITALES ===
    console.log('📦 Creando activos digitales...');

    const _portada = await prisma.activoDigital.create({
        data: {
            nombre: 'Portada Principal - Productividad con IA',
            tipo_activo: 'IMAGEN',
            categoria: 'Portada',
            formato: '.png',
            tamano: 2.5,
            url_archivo: '/assets/ebooks/productividad-ia/portada-v1.png',
            thumbnail_url: '/assets/ebooks/productividad-ia/portada-v1-thumb.png',
            descripcion: 'Portada principal del ebook, diseñada con Midjourney',
            proyecto_id: proyectoEbook.id,
            tarea_id: tareaPortada.id,
            creado_por_id: designer.id,
            derechos_uso: 'USO_COMERCIAL',
            licencia: 'COPYRIGHT',
            dimensiones: '1600x2400',
            resolucion: '300 DPI',
            espacio_color: 'RGB',
            estado: 'APROBADO',
            favorito: true,
            version: '1.0',
            etiquetas: JSON.stringify(['portada', 'ebook', 'diseño', 'aprobado']),
        },
    });

    console.log('✅ Activo de portada creado');

    // === 8. CREAR TRANSACCIONES FINANCIERAS ===
    console.log('💰 Registrando transacciones...');

    await prisma.transaccion.createMany({
        data: [
            {
                proyecto_id: proyectoEbook.id,
                herramienta_ai_id: chatgpt.id,
                tipo_transaccion: 'GASTO',
                categoria: 'SUSCRIPCION',
                concepto: 'ChatGPT Plus - Enero 2025',
                monto: 20,
                moneda: 'USD',
                fecha_transaccion: new Date('2025-01-01'),
                metodo_pago: 'TARJETA',
                estado: 'PAGADO',
                recurrente: true,
                frecuencia: 'MENSUAL',
                creado_por_id: admin.id,
            },
            {
                proyecto_id: proyectoEbook.id,
                herramienta_ai_id: midjourney.id,
                tipo_transaccion: 'GASTO',
                categoria: 'SUSCRIPCION',
                concepto: 'Midjourney Pro - Enero 2025',
                monto: 30,
                moneda: 'USD',
                fecha_transaccion: new Date('2025-01-01'),
                metodo_pago: 'TARJETA',
                estado: 'PAGADO',
                recurrente: true,
                frecuencia: 'MENSUAL',
                creado_por_id: admin.id,
            },
            {
                proyecto_id: proyectoEbook.id,
                herramienta_ai_id: claude.id,
                tipo_transaccion: 'GASTO',
                categoria: 'SUSCRIPCION',
                concepto: 'Claude Pro - Enero 2025',
                monto: 20,
                moneda: 'USD',
                fecha_transaccion: new Date('2025-01-01'),
                metodo_pago: 'TARJETA',
                estado: 'PAGADO',
                recurrente: true,
                frecuencia: 'MENSUAL',
                creado_por_id: admin.id,
            },
        ],
    });

    console.log('✅ Transacciones registradas');

    // === 9. ACTUALIZAR ROLLUPS DEL PROYECTO ===
    console.log('📊 Actualizando métricas del proyecto...');

    const totalTareas = await prisma.tarea.count({
        where: { proyecto_id: proyectoEbook.id },
    });

    const tareasCompletadas = await prisma.tarea.count({
        where: { proyecto_id: proyectoEbook.id, estado: 'COMPLETADO' },
    });

    const tareasEnProgreso = await prisma.tarea.count({
        where: { proyecto_id: proyectoEbook.id, estado: 'EN_PROGRESO' },
    });

    const gastosAcumulados = await prisma.transaccion.aggregate({
        where: {
            proyecto_id: proyectoEbook.id,
            tipo_transaccion: 'GASTO',
            estado: 'PAGADO',
        },
        _sum: { monto: true },
    });

    const activosGenerados = await prisma.activoDigital.count({
        where: { proyecto_id: proyectoEbook.id },
    });

    const progresoTotal = (tareasCompletadas / totalTareas) * 100;
    const gastos = Number(gastosAcumulados._sum.monto || 0);
    const balance = 5000 - gastos;
    const roi = ((15000 - gastos) / gastos) * 100;

    await prisma.proyecto.update({
        where: { id: proyectoEbook.id },
        data: {
            total_tareas: totalTareas,
            tareas_completadas: tareasCompletadas,
            tareas_en_progreso: tareasEnProgreso,
            progreso_total: progresoTotal,
            gastos_acumulados: gastos,
            balance_restante: balance,
            roi_preliminar: roi,
            activos_generados: activosGenerados,
            costo_ai_total: 70, // ChatGPT + Midjourney + Claude
        },
    });

    console.log('✅ Métricas del proyecto actualizadas');

    // === 10. CREAR COMENTARIOS ===
    console.log('💬 Agregando comentarios...');

    await prisma.comentario.createMany({
        data: [
            {
                tarea_id: tareaCapitulo1.id,
                usuario_id: pm.id,
                texto: '¡Excelente progreso! Me gusta la estructura que estás usando.',
                fecha: new Date('2025-01-18'),
            },
            {
                tarea_id: tareaPortada.id,
                usuario_id: pm.id,
                texto: 'La portada quedó increíble. Aprobada para uso.',
                fecha: new Date('2025-01-24'),
            },
        ],
    });

    console.log('✅ Comentarios agregados');

    // === RESUMEN FINAL ===
    console.log('\n========================================');
    console.log('✅ SEED COMPLETADO EXITOSAMENTE');
    console.log('========================================\n');

    console.log('📊 Resumen de datos creados:');
    console.log(`   👥 Usuarios: 5`);
    console.log(`   🤖 Herramientas AI: 4`);
    console.log(`   🔄 Workflows: 1`);
    console.log(`   📁 Proyectos: 1`);
    console.log(`   ✅ Tareas: ${totalTareas}`);
    console.log(`   📦 Activos: ${activosGenerados}`);
    console.log(`   💰 Transacciones: 3`);
    console.log(`   💬 Comentarios: 2\n`);

    console.log('📈 Métricas del Proyecto:');
    console.log(`   Progreso: ${progresoTotal.toFixed(1)}%`);
    console.log(`   Presupuesto: $5,000`);
    console.log(`   Gastado: $${gastos}`);
    console.log(`   Balance: $${balance}`);
    console.log(`   ROI: ${roi.toFixed(0)}%\n`);

    console.log('🔐 Credenciales de acceso:');
    console.log('   Admin: admin@pmdam.com');
    console.log('   PM: maria@pmdam.com');
    console.log('   Dev: carlos@pmdam.com');
    console.log('   Designer: ana@pmdam.com');
    console.log('   Writer: luis@pmdam.com\n');

    console.log('🚀 Siguiente paso: npm run dev');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Error en el seed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });

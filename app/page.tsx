import { Activity, CreditCard, Layers, Calendar, ArrowUpRight, ArrowDownRight, Users, Clock } from 'lucide-react';
import { CrearProyectoDialog } from "@/components/proyectos/crear-proyecto-dialog";

export default async function DashboardPage() {
    // Simulación de datos (Mock data) para visualización inmediata
    // En una iteración futura conectaremos con ProyectoService.getDashboard()
    const stats = [
        {
            name: 'Proyectos Activos',
            value: '12',
            change: '+2',
            trend: 'up',
            icon: Layers,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            name: 'ROI Promedio',
            value: '315%',
            change: '+12%',
            trend: 'up',
            icon: Activity,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            name: 'Activos Generados',
            value: '1,234',
            change: '+156',
            trend: 'up',
            icon: Calendar,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
        {
            name: 'Gasto en IA',
            value: '$4,200',
            change: '-4%',
            trend: 'down', // Bueno porque gastamos menos
            icon: CreditCard,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10'
        },
    ];

    const recentProjects = [
        { name: 'Campaña Q4 Marketing', status: 'En Progreso', progress: 75, team: 4, deadline: '12 Dic' },
        { name: 'Rediseño Website', status: 'Revisión', progress: 90, team: 3, deadline: '15 Dic' },
        { name: 'Lanzamiento Producto X', status: 'Bloqueado', progress: 45, team: 6, deadline: '20 Dic' },
        { name: 'Automatización Email', status: 'Completado', progress: 100, team: 2, deadline: '10 Dic' },
    ];

    // Datos simulados para el calendario
    const calendarEvents = [
        { date: '2025-12-06', title: 'Reunión de equipo', time: '10:00 AM', type: 'meeting' },
        { date: '2025-12-07', title: 'Entrega de proyecto', time: '11:30 AM', type: 'deadline' },
        { date: '2025-12-08', title: 'Revisión de diseño', time: '2:00 PM', type: 'review' },
        { date: '2025-12-09', title: 'Lanzamiento de producto', time: '9:00 AM', type: 'launch' },
        { date: '2025-12-10', title: 'Presentación a clientes', time: '3:00 PM', type: 'presentation' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                        Dashboard Overview
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Bienvenido de nuevo. Aquí tienes un resumen de tu ecosistema creativo.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Descargar Reporte
                    </button>
                    <CrearProyectoDialog />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={stat.name} className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
                        <div className={`absolute right-4 top-4 rounded-full p-2 opacity-10 transition-opacity group-hover:opacity-100 ${stat.bg}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div className="flex items-center justify-between space-y-0 pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
                        </div>
                        <div className="relative z-10">
                            <div className="text-3xl font-bold text-foreground mt-2">{stat.value}</div>
                            <div className="flex items-center mt-1">
                                {stat.trend === 'up' ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
                                )}
                                <span className="text-xs font-medium text-green-500 mr-2">{stat.change}</span>
                                <span className="text-xs text-muted-foreground">vs mes anterior</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                {/* Gráfico principal o Lista de proyectos */}
                <div className="col-span-4 rounded-xl border bg-card/50 shadow-sm backdrop-blur-xl">
                    <div className="p-6 border-b border-border/50">
                        <h3 className="text-lg font-semibold text-foreground">Proyectos Recientes</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-4 mt-4">
                            {recentProjects.map((project, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0 last:pb-0">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium leading-none text-foreground">{project.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>Deadline: {project.deadline}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                            <Users className="h-3 w-3" />
                                            <span>{project.team}</span>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${project.status === 'En Progreso' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            project.status === 'Completado' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                project.status === 'Bloqueado' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            }`}>
                                            {project.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Calendario */}
                <div className="col-span-3 rounded-xl border bg-gradient-to-br from-card to-card/50 shadow-sm">
                    <div className="p-6 border-b border-border/50">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-500" />
                            Calendario
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {calendarEvents.map((event, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                                        <p className="text-xs text-muted-foreground">{event.time}</p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                        event.type === 'meeting' ? 'bg-blue-500' :
                                        event.type === 'deadline' ? 'bg-red-500' :
                                        event.type === 'review' ? 'bg-yellow-500' :
                                        event.type === 'launch' ? 'bg-green-500' :
                                        'bg-gray-500'
                                    }`} />
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                            Ver calendario completo →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
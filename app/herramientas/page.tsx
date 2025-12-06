import { HerramientaAIService } from '@/lib/services/herramienta-ai.service';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { HerramientaDialog } from '@/components/herramientas/herramienta-dialog';

export default async function HerramientasPage() {
    const { herramientas } = await HerramientaAIService.list({
        page: 1,
        limit: 50,
        orderBy: 'veces_usada',
        order: 'desc'
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Herramientas AI</h1>
                    <p className="text-muted-foreground">Catálogo de herramientas de inteligencia artificial.</p>
                </div>
                <HerramientaDialog onHerramientaCreada={() => {}} />
            </div>

            {herramientas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10 border-dashed">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <Bot className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No hay herramientas registradas</h3>
                    <p className="text-muted-foreground mb-4">Agrega herramientas AI para potenciar tus proyectos.</p>
                    <HerramientaDialog onHerramientaCreada={() => {}} />
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {herramientas.map((tool: any) => (
                        <div key={tool.id} className="group flex flex-col rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md h-full">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                                            {tool.logo_url ? (
                                                <img src={tool.logo_url} alt={tool.nombre} className="h-full w-full object-cover" />
                                            ) : (
                                                <Bot className="h-6 w-6 text-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold leading-none">{tool.nombre}</h3>
                                            <span className="text-xs text-muted-foreground mt-1 block capitalize">
                                                {Array.isArray(tool.categoria) 
                                                    ? tool.categoria.join(', ').toLowerCase()
                                                    : tool.categoria?.replace('_', ' ').toLowerCase()}
                                            </span>
                                        </div>
                                    </div>
                                    {tool.favorita && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                                    {tool.descripcion}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {Array.isArray(tool.casos_uso) && tool.casos_uso.slice(0, 2).map((uso: string) => (
                                        <span key={uso} className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
                                            {uso}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 pt-0 border-t bg-muted/50 rounded-b-xl flex items-center justify-between mt-auto">
                                <div className="text-xs font-medium">
                                    {tool.tipo_precio === 'GRATIS' ? 'Gratis' : `$${tool.costo_mensual}/mes`}
                                </div>
                                <div className="flex gap-1">
                                    <HerramientaDialog 
                                        herramienta={tool} 
                                        onHerramientaActualizada={() => {}} 
                                    />
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={tool.url || '#'} target="_blank">
                                            Visitar <ExternalLink className="ml-2 h-3 w-3" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
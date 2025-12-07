import { HerramientaAIService } from '@/lib/services/herramienta-ai.service';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Star, ExternalLink, Wrench } from 'lucide-react';
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
          <h1 className="text-3xl font-bold tracking-tight">Herramientas Educativas</h1>
          <p className="text-muted-foreground">Descubre y gestiona tus herramientas favoritas</p>
        </div>
        <HerramientaDialog />
      </div>

      {herramientas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10 border-dashed">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Wrench className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No hay herramientas</h3>
          <p className="text-muted-foreground mb-4">Agrega tu primera herramienta para empezar.</p>
          <HerramientaDialog />
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {herramientas.map((tool: any) => (
            <div 
              key={tool.id} 
              className="group relative rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md hover-glow-card flex flex-col h-full"
            >
              <div className="p-6 pb-4 flex-1">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-muted p-2">
                    <Wrench className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold line-clamp-1">{tool.nombre}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {tool.descripcion || 'Sin descripción'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-1">
                  {Array.isArray(tool.etiquetas) && tool.etiquetas.slice(0, 3).map((tag: string) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      {tag}
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

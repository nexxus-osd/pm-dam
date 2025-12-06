import { ActivoDigitalService } from '@/lib/services/activo-digital.service';
import { Button } from '@/components/ui/button';
import { FileIcon, Plus } from 'lucide-react';
import { CrearContenidoDialog } from '@/components/activos/crear-contenido-dialog';

export default async function ActivosPage() {
    const { activos } = await ActivoDigitalService.list({
        page: 1,
        limit: 50,
        orderBy: 'fecha_creacion',
        order: 'desc'
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Activos Digitales</h1>
                    <p className="text-muted-foreground">Gestiona tus recursos y archivos multimedia.</p>
                </div>
                <div className="flex gap-2">
                    <CrearContenidoDialog />
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Subir Activo
                    </Button>
                </div>
            </div>

            {activos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10 border-dashed">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <FileIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No hay activos</h3>
                    <p className="text-muted-foreground mb-4">Sube tu primer activo digital para empezar.</p>
                    <div className="flex gap-2">
                        <CrearContenidoDialog />
                        <Button variant="outline">Subir ahora</Button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {activos.map((activo: any) => (
                        <div key={activo.id} className="group relative rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
                            <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-muted relative">
                                {activo.thumbnail_url ? (
                                    <img src={activo.thumbnail_url} alt={activo.nombre} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground bg-muted/50">
                                        <FileIcon className="h-10 w-10 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                                    {activo.tipo_activo}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold line-clamp-1" title={activo.nombre}>{activo.nombre}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 h-10">
                                    {activo.descripcion || 'Sin descripción'}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-1">
                                    {Array.isArray(activo.etiquetas) && activo.etiquetas.slice(0, 3).map((tag: string) => (
                                        <span key={tag} className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
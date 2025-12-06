import { WorkflowService } from '@/lib/services/workflow.service';
import { Button } from '@/components/ui/button';
import { GitBranch, Plus, Copy, BarChart } from 'lucide-react';

export default async function WorkflowsPage() {
    const { workflows } = await WorkflowService.list({ page: 1, limit: 50 });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
                    <p className="text-muted-foreground">Plantillas de procesos automatizados para tus proyectos.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Workflow
                </Button>
            </div>

            {workflows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10 border-dashed">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <GitBranch className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No hay workflows definidos</h3>
                    <p className="text-muted-foreground mb-4">Crea plantillas para estandarizar tus procesos de trabajo.</p>
                    <Button variant="outline">Crear Workflow</Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {workflows.map((wf: any) => (
                        <div key={wf.id} className="group relative flex flex-col rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
                            <div className="p-6 flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <GitBranch className="h-6 w-6" />
                                    </div>
                                    <div className="text-xs font-medium px-2 py-1 rounded-full bg-muted uppercase tracking-wider">
                                        {wf.tipo_proyecto}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{wf.nombre}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                    {wf.descripcion || 'Sin descripción'}
                                </p>

                                <div className="grid grid-cols-2 gap-4 my-4 py-4 border-t border-b border-border/50">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{Array.isArray(wf.fases) ? wf.fases.length : 0}</div>
                                        <div className="text-xs text-muted-foreground uppercase">Fases</div>
                                    </div>
                                    <div className="text-center border-l border-border/50">
                                        <div className="text-2xl font-bold">{wf.veces_usado}</div>
                                        <div className="text-xs text-muted-foreground uppercase">Usos</div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase">Fases del proceso</h4>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                        {Array.isArray(wf.fases) && wf.fases.slice(0, 3).map((fase: any, i: number) => (
                                            <div key={i} className="flex items-center gap-1">
                                                <span className="font-medium">{i + 1}.</span>
                                                <span className="text-muted-foreground">{fase.nombre}</span>
                                            </div>
                                        ))}
                                        {Array.isArray(wf.fases) && wf.fases.length > 3 && (
                                            <span className="text-muted-foreground">+{wf.fases.length - 3} más</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t bg-muted/50 rounded-b-xl flex gap-2">
                                <Button variant="outline" size="sm" className="w-full gap-2">
                                    <Copy className="h-3 w-3" /> Duplicar
                                </Button>
                                <Button variant="outline" size="sm" className="w-full gap-2">
                                    <BarChart className="h-3 w-3" /> Estadísticas
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

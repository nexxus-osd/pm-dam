'use client';

import { useEffect, useState } from 'react';
import { WorkflowService } from '@/lib/services/workflow.service';
import { Button } from '@/components/ui/button';
import { Workflow, Copy, BarChart } from 'lucide-react';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const data = await WorkflowService.list({ page: 1, limit: 50 });
        setWorkflows(data.workflows);
      } catch (error) {
        console.error('Error fetching workflows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newWorkflow = await WorkflowService.create({ nombre, descripcion });
      setWorkflows([newWorkflow, ...workflows]);
      setOpen(false);
      setNombre('');
      setDescripcion('');
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground">Automatiza tus procesos creativos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Workflow className="h-4 w-4" />
              Nuevo Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nuevo workflow</DialogTitle>
              <DialogDescription>
                Define un nuevo workflow para automatizar tus procesos.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="text-sm font-medium">Nombre</label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del workflow"
                  required
                />
              </div>
              <div>
                <label htmlFor="descripcion" className="text-sm font-medium">Descripción</label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe el propósito del workflow"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Crear Workflow
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/10 border-dashed">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Workflow className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No hay workflows</h3>
          <p className="text-muted-foreground mb-4">Crea tu primer workflow para automatizar procesos.</p>
          <Button variant="outline" onClick={() => setOpen(true)}>Crear Workflow</Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((wf: any) => (
            <div 
              key={wf.id} 
              className="group relative rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md hover-glow-card"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Workflow className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{wf.nombre}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {wf.descripcion || 'Sin descripción'}
                      </p>
                    </div>
                  </div>
                  {wf.favorito && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fases</span>
                    <span className="font-medium">{Array.isArray(wf.fases) ? wf.fases.length : 0}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {Array.isArray(wf.fases) && wf.fases.slice(0, 3).map((fase: any) => (
                      <div key={fase.id} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
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
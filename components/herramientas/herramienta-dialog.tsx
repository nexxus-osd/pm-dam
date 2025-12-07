'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil } from 'lucide-react';
import { HerramientaForm } from './herramienta-form';
import { createHerramientaAIAction, updateHerramientaAIAction } from '@/app/actions/herramientas-ai';

interface HerramientaDialogProps {
  herramienta?: any;
}

export function HerramientaDialog({ 
  herramienta 
}: HerramientaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (herramienta) {
        // Actualizar herramienta existente
        result = await updateHerramientaAIAction(herramienta.id, data);
      } else {
        // Crear nueva herramienta
        result = await createHerramientaAIAction(data);
      }
      
      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || 'Error desconocido');
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {herramienta ? (
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Herramienta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {herramienta ? 'Editar Herramienta AI' : 'Crear Nueva Herramienta AI'}
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}
        
        <HerramientaForm
          initialData={herramienta}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
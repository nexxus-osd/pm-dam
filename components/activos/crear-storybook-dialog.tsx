'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { BookHeart, Plus } from 'lucide-react';
import { createActivoDigitalAction } from '@/app/actions/activos';

// Cargar dinámicamente react-quill para evitar problemas de SSR
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface CrearStorybookDialogProps {
  onStorybookCreado?: () => void;
}

export function CrearStorybookDialog({ onStorybookCreado }: CrearStorybookDialogProps) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('STORYBOOK');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configuración del editor
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  // Manejar el evento de teclado para prevenir el cierre del diálogo al presionar Enter o Escape en el editor
  const handleQuillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
    }
    // Permitir la barra espaciadora y otras teclas normales
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Preparar datos para crear el storybook
      const storybookData = {
        nombre,
        descripcion,
        categoria,
        tipo_activo: 'DOCUMENTO',
        formato: 'HTML',
        tamaño: 0,
        url_archivo: '', // Se generará automáticamente en la acción
        creado_por_id: '',
        proyecto_id: '',
        derechos_uso: 'USO_INTERNO',
        licencia: 'COPYRIGHT',
        estado: 'DRAFT',
        etiquetas: ['storybook', 'interactivo', 'historia'],
      };

      const result = await createActivoDigitalAction(storybookData);
      
      if (result.success) {
        // Resetear formulario
        setNombre('');
        setDescripcion('');
        setCategoria('STORYBOOK');
        setOpen(false);
        
        // Llamar callback si existe
        if (onStorybookCreado) {
          onStorybookCreado();
        }
      } else {
        setError(result.error || 'Error al crear el storybook');
      }
    } catch (error: any) {
      console.error('Error al crear storybook:', error);
      setError(error.message || 'Error al crear el storybook');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookHeart className="h-4 w-4" />
          Storybook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookHeart className="h-5 w-5" />
              Crear Storybook
            </DialogTitle>
            <DialogDescription>
              Crea un nuevo storybook interactivo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre-storybook" className="text-right">
                Nombre
              </Label>
              <div className="col-span-3">
                <Input
                  id="nombre-storybook"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Mi Storybook"
                  className="w-full rounded-md border border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="descripcion-storybook" className="text-right pt-2">
                Descripción
              </Label>
              <div className="col-span-3">
                <div className="h-40 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={descripcion}
                    onChange={setDescripcion}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Describe tu storybook..."
                    className="h-32"
                    onKeyDown={handleQuillKeyDown}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoria-storybook" className="text-right">
                Categoría
              </Label>
              <div className="col-span-3">
                <Input
                  id="categoria-storybook"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="STORYBOOK"
                  className="w-full rounded-md border border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Storybook'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
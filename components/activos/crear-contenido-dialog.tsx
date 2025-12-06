'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  BookOpen, 
  BookImage, 
  Palette, 
  BookHeart, 
  Gamepad2, 
  Plus,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CrearEbookDialog } from './crear-ebook-dialog';
import { CrearLibroIlustradoDialog } from './crear-libro-ilustrado-dialog';
import { CrearLibroDibujarDialog } from './crear-libro-dibujar-dialog';
import { CrearStorybookDialog } from './crear-storybook-dialog';
import { CrearJuegoLudicoDialog } from './crear-juego-ludico-dialog';

interface CrearContenidoDialogProps {
  onContenidoCreado?: () => void;
}

export function CrearContenidoDialog({ onContenidoCreado }: CrearContenidoDialogProps) {
  const [open, setOpen] = useState(false);
  
  const handleContenidoCreado = () => {
    setOpen(false);
    if (onContenidoCreado) {
      onContenidoCreado();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Contenido
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <CrearEbookDialog onEbookCreado={handleContenidoCreado} />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <CrearLibroIlustradoDialog onLibroCreado={handleContenidoCreado} />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <CrearLibroDibujarDialog onLibroCreado={handleContenidoCreado} />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <CrearStorybookDialog onStorybookCreado={handleContenidoCreado} />
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <CrearJuegoLudicoDialog onJuegoCreado={handleContenidoCreado} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
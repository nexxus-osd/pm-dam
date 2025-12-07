'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { moveCarpetaAction, moveDocumentoAction } from "@/app/actions/folder-management";
import { toast } from "sonner";

interface MoveItemDialogProps {
  children: React.ReactNode;
  itemType: 'carpeta' | 'documento';
  itemId: string;
  projectName: string;
  projectId: string;
  currentFolderId?: string | null;
  folders: any[];
  onMove: () => void;
}

export function MoveItemDialog({
  children,
  itemType,
  itemId,
  projectName,
  projectId,
  currentFolderId,
  folders,
  onMove
}: MoveItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [destinationFolderId, setDestinationFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMove = async () => {
    if (!destinationFolderId && destinationFolderId !== null) {
      toast.error('Por favor selecciona una carpeta de destino');
      return;
    }

    // Prevent moving to the same folder
    if (destinationFolderId === currentFolderId) {
      toast.error('El elemento ya está en esta carpeta');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (itemType === 'carpeta') {
        result = await moveCarpetaAction(itemId, destinationFolderId, projectId);
      } else {
        result = await moveDocumentoAction(itemId, destinationFolderId, projectId);
      }

      if (result.success) {
        toast.success(`${itemType === 'carpeta' ? 'Carpeta' : 'Documento'} movido exitosamente`);
        onMove();
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error al mover el elemento');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter out the current item if it's a folder (to prevent moving a folder into itself)
  const availableFolders = folders.filter(folder => {
    if (itemType === 'carpeta') {
      return folder.id !== itemId;
    }
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mover {itemType === 'carpeta' ? 'Carpeta' : 'Documento'}</DialogTitle>
          <DialogDescription>
            Selecciona la carpeta de destino para mover este {itemType === 'carpeta' ? 'elemento' : 'documento'}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="destination" className="text-right">
              Destino
            </Label>
            <Select 
              value={destinationFolderId || ''} 
              onValueChange={(value) => setDestinationFolderId(value === 'root' ? null : value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar carpeta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Raíz del proyecto ({projectName})</SelectItem>
                {availableFolders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleMove} disabled={loading}>
            {loading ? 'Moviendo...' : 'Mover'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
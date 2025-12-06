'use client'

import { MoreVertical, Trash, Edit, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deleteProyectoAction } from "@/app/actions/proyectos";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { EditarProyectoDialog } from "@/components/proyectos/editar-proyecto-dialog";

export function ProyectoCardActions({ id, proyecto }: { id: string; proyecto: any }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const router = useRouter();

    async function handleDelete() {
        if (!confirm("¿Estás seguro de eliminar este proyecto? Esta acción no se puede deshacer.")) return;

        setIsDeleting(true);
        const res = await deleteProyectoAction(id);

        if (!res.success) {
            alert("Error: " + res.error);
            setIsDeleting(false);
        }
        // Si éxito, revalidatePath en server action actualizará la lista, 
        // y el router.refresh() opcional asegura la vista cliente.
        router.refresh();
    }

    const handleEditSuccess = () => {
        router.refresh();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
                        disabled={isDeleting}
                        aria-label="Opciones"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/proyectos/${id}`)}>
                        <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                        <Trash className="mr-2 h-4 w-4" /> Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <EditarProyectoDialog 
                proyecto={proyecto}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSuccess={handleEditSuccess}
            />
        </>
    )
}

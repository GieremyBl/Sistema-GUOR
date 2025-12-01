// admin/src/components/pedidos/DeletePedidoDialog.tsx
"use client";

import { useState } from 'react';
import { Pedido } from '@types';
import { deletePedido } from '@/components/actions/pedidos';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from'@/app/hooks/use-toast';

interface DeletePedidoDialogProps {
  pedido: Pedido;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeletePedidoDialog({ 
  pedido, 
  open, 
  onOpenChange, 
  onSuccess 
}: DeletePedidoDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deletePedido(pedido.id);
      
      if (result.success) {
        toast({
          title: '¡Pedido eliminado!',
          description: `El pedido ha sido eliminado correctamente.`,
        });
        
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(result.error || 'Error al eliminar');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error al eliminar',
        description: error.message || 'No se pudo eliminar el pedido',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El pedido del cliente{' '}
            <span className="font-semibold">
              {pedido.cliente?.razon_social || 'sin nombre'}
            </span>{' '}
            será eliminado permanentemente junto con todos sus detalles.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
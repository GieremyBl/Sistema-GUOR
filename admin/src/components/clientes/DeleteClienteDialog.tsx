'use client';

import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Cliente } from '@/lib/types/cliente.types';

interface DeleteClienteDialogProps {
  open: boolean;
  cliente: Cliente | null;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}
export default function DeleteClienteDialog({
  open,
  cliente,
  onClose,
  onOpenChange,
  onConfirm,
  title = '¿Estás seguro?',
  description,
  isLoading = false,
}: DeleteClienteDialogProps) {

  const defaultDescription = cliente
        ? `Estás a punto de eliminar al cliente ${cliente.razon_social || cliente.email}. Esta acción es irreversible.`
        : 'Esta acción no se puede deshacer.';

    const finalDescription = description || defaultDescription;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mt-1">
                {finalDescription}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onClose}
            disabled={isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
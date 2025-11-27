'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface Usuario {
  id: string;
  nombre_completo: string;
  email: string;
}

interface DeleteUserDialogProps {
  user: Usuario | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteUserDialog({
  user,
  open,
  onClose,
  onConfirm,
}: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <div className="text-sm text-muted-foreground space-y-4">
            <p>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario:
            </p>
            <div className="p-3 bg-gray-50 rounded-md space-y-1">
              <p className="font-medium text-gray-900">{user?.nombre_completo}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
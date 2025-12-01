'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, // Agregado para accesibilidad
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
// CORRECCIÓN: Usar la ruta correcta de tipos que usas en el resto del proyecto
import { Usuario } from '@/lib/types/usuario.types';

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

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // IMPORTANTE: Prevenir el cierre automático del modal
    e.preventDefault();
    
    setLoading(true);
    try {
      await onConfirm();
      // Cerramos manualmente solo cuando la operación termina con éxito
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
          
          {/* CORRECCIÓN: Usar AlertDialogDescription para accesibilidad */}
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el usuario.
          </AlertDialogDescription>

          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
            <div className="font-medium text-red-900">{user?.nombre_completo}</div>
            <div className="text-sm text-red-700">{user?.email}</div>
            <div className="text-xs text-red-600 mt-1 capitalize">{user?.rol}</div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar Usuario'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
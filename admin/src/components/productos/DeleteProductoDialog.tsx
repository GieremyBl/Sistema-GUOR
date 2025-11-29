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
import type { ProductoConCategoria } from '@/lib/types/producto.types';

interface DeleteProductoDialogProps {
  producto: ProductoConCategoria | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteProductoDialog({
  producto,
  open,
  onClose,
  onConfirm,
}: DeleteProductoDialogProps) {
  if (!producto) return null;

  const categoriaNombre = Array.isArray(producto.categoria) 
    ? producto.categoria[0]?.nombre 
    : 'Sin categoría';

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto:
            </p>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
              <p className="font-semibold text-gray-900">{producto.nombre}</p>
              <p className="text-sm text-gray-600">Categoría: {categoriaNombre}</p>
              <p className="text-sm text-gray-600">
                Precio: S/ {producto.precio.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Stock actual: {producto.stock}</p>
            </div>
            {producto.stock > 0 && (
              <p className="text-amber-600 text-sm font-medium">
                ⚠️ Advertencia: Este producto aún tiene stock disponible
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Eliminar producto
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
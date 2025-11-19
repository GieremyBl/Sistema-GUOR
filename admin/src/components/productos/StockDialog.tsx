'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Minus, Package } from 'lucide-react';

interface Producto {
  id: string;
  nombre: string;
  stock: number;
}

interface StockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  producto: Producto | null;
  onSubmit: (
    id: string,
    cantidad: number,
    operacion: 'agregar' | 'reducir' | 'establecer'
  ) => Promise<void>;
}

export default function StockDialog({
  open,
  onOpenChange,
  producto,
  onSubmit,
}: StockDialogProps) {
  const [loading, setLoading] = useState(false);
  const [operacion, setOperacion] = useState<'agregar' | 'reducir' | 'establecer'>('agregar');
  const [cantidad, setCantidad] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!producto || !cantidad) return;

    const cant = parseInt(cantidad);
    if (isNaN(cant) || cant <= 0) {
      alert('Ingresa una cantidad válida');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(producto.id, cant, operacion);
      setCantidad('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockPreview = () => {
    if (!producto || !cantidad) return producto?.stock || 0;
    
    const stockActual = producto.stock || 0;
    const cant = parseInt(cantidad) || 0;

    if (operacion === 'agregar') {
      return stockActual + cant;
    } else if (operacion === 'reducir') {
      return Math.max(0, stockActual - cant);
    } else {
      return cant;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gestionar Stock</DialogTitle>
          <DialogDescription>
            Actualiza el inventario de <strong>{producto?.nombre}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stock actual */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">Stock Actual</span>
            </div>
            <span className="text-2xl font-bold">{producto?.stock || 0}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de operación */}
            <div className="space-y-2">
              <Label>Tipo de Operación</Label>
              <Select
                value={operacion}
                onValueChange={(value: any) => setOperacion(value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agregar">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Agregar Stock
                    </div>
                  </SelectItem>
                  <SelectItem value="reducir">
                    <div className="flex items-center gap-2">
                      <Minus className="h-4 w-4" />
                      Reducir Stock
                    </div>
                  </SelectItem>
                  <SelectItem value="establecer">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Establecer Stock
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad */}
            <div className="space-y-2">
              <Label htmlFor="cantidad">
                {operacion === 'establecer' ? 'Nuevo Stock' : 'Cantidad'}
              </Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                placeholder="Ingresa cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Preview */}
            {cantidad && parseInt(cantidad) > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Nuevo stock:</span>
                  <span className="font-bold text-lg">{getStockPreview()}</span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !cantidad}>
                {loading ? 'Actualizando...' : 'Actualizar Stock'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
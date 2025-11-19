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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Categoria {
  id: string;
  nombre: string;
}

interface CreateProductoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categorias: Categoria[];
  onSubmit: (data: {
    nombre: string;
    descripcion?: string;
    precio: number;
    categoriaId: string;
    stock?: number;
    stockMinimo?: number;
    imagen?: string;
    estado: string;
  }) => Promise<void>;
}

export default function CreateProductoDialog({
  open,
  onOpenChange,
  categorias,
  onSubmit,
}: CreateProductoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: '',
    stock: '0',
    stockMinimo: '10',
    imagen: '',
    estado: 'activo',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        precio: parseFloat(formData.precio),
        categoriaId: formData.categoriaId,
        stock: parseInt(formData.stock) || 0,
        stockMinimo: parseInt(formData.stockMinimo) || 10,
        imagen: formData.imagen || undefined,
        estado: formData.estado,
      });
      // Resetear form
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoriaId: '',
        stock: '0',
        stockMinimo: '10',
        imagen: '',
        estado: 'activo',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error al crear producto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa los datos del nuevo producto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Producto *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Polo Clásico"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Descripción detallada del producto..."
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (S/) *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoriaId">Categoría *</Label>
              <Select
                value={formData.categoriaId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoriaId: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Inicial</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                disabled={loading}
              />
              <p className="text-sm text-gray-500">Cantidad disponible</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockMinimo">Stock Mínimo</Label>
              <Input
                id="stockMinimo"
                type="number"
                placeholder="10"
                value={formData.stockMinimo}
                onChange={(e) =>
                  setFormData({ ...formData, stockMinimo: e.target.value })
                }
                disabled={loading}
              />
              <p className="text-sm text-gray-500">Alerta de reposición</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imagen">URL de Imagen</Label>
            <Input
              id="imagen"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.imagen}
              onChange={(e) =>
                setFormData({ ...formData, imagen: e.target.value })
              }
              disabled={loading}
            />
            <p className="text-sm text-gray-500">Imagen del producto (opcional)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado}
              onValueChange={(value) =>
                setFormData({ ...formData, estado: value })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="agotado">Agotado</SelectItem>
                <SelectItem value="descontinuado">Descontinuado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
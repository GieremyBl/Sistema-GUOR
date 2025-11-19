'use client';

import { useState, useEffect } from 'react';
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

// ✅ CORRECCIÓN 1: Actualizamos la interfaz para aceptar number | string
// Esto hace que el componente sea flexible y no falle si la BD envía un número.
interface Producto {
  id: string | number; 
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria_id?: string | number; // Aceptamos ambos
  categoriaId?: string | number;  // Aceptamos ambos
  stock: number;
  stock_minimo?: number;
  stockMinimo?: number;
  imagen?: string;
  estado: string;
}

interface Categoria {
  id: string | number; // ID de categoría también flexible
  nombre: string;
}

interface EditProductoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  producto: Producto | null;
  categorias: Categoria[];
  // ✅ CORRECCIÓN 2: onSubmit también debe aceptar ID flexible
  onSubmit: (id: string, data: any) => Promise<void>;
}

export default function EditProductoDialog({
  open,
  onOpenChange,
  producto,
  categorias,
  onSubmit,
}: EditProductoDialogProps) {
  const [loading, setLoading] = useState(false);
  
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoriaId: '',
    stock: '',
    stockMinimo: '',
    imagen: '',
    estado: 'activo',
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio.toString(),
        // ✅ CORRECCIÓN 3: Manejo seguro de IDs
        categoriaId:
          producto.categoria_id?.toString() ||
          producto.categoriaId?.toString() ||
          '',
        stock: producto.stock.toString(),
        stockMinimo:
          producto.stock_minimo?.toString() ||
          producto.stockMinimo?.toString() ||
          '10',
        imagen: producto.imagen || '',
        estado: producto.estado || 'activo',
      });
    }
  }, [producto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!producto) return;

    setLoading(true);
    try {
      // Enviamos el ID siempre como string para consistencia en onSubmit
      await onSubmit(producto.id.toString(), {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        precio: parseFloat(formData.precio),
        // Convertimos a número para la API si es necesario
        categoria_id: Number(formData.categoriaId), 
        stock: parseInt(formData.stock) || 0,
        stock_minimo: parseInt(formData.stockMinimo) || 0,
        imagen: formData.imagen || null,
        estado: formData.estado,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Modifica los datos del producto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Producto *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Precio y Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (S/) *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
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
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockMinimo">Stock Mínimo</Label>
              <Input
                id="stockMinimo"
                type="number"
                value={formData.stockMinimo}
                onChange={(e) =>
                  setFormData({ ...formData, stockMinimo: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <Label htmlFor="imagen">URL de Imagen</Label>
            <Input
              id="imagen"
              type="url"
              value={formData.imagen}
              onChange={(e) =>
                setFormData({ ...formData, imagen: e.target.value })
              }
              disabled={loading}
              placeholder="https://..."
            />
          </div>

          {/* Estado */}
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
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
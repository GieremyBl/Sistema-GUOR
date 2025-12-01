'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/app/hooks/use-toast';
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
import { updateProducto } from '@/lib/actions/productos.actions';
import { Producto } from '@/lib/types/producto.types';
import { Categoria } from '@/lib/types/categoria.types';

// Definimos el tipo de estado para el casting
type EstadoProducto = "activo" | "inactivo" | "agotado" | "descontinuado";

export default function EditProductoDialog({
  producto,
  categorias = [],
  categoriasError = null,
  open = true,
  onOpenChange,
  onSuccess,
}: {
  producto: Producto | null;
  categorias?: Categoria[];
  categoriasError?: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    stock: '',
    stock_minimo: '',
    imagen: '',
    estado: 'activo',
  });

  useEffect(() => {
    if (producto && open) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio.toString(),
        categoria_id: producto.categoria_id?.toString() || '',
        stock: producto.stock.toString(),
        stock_minimo: (producto.stock_minimo || 0).toString(),
        imagen: producto.imagen || '',
        estado: producto.estado || 'activo',
      });
    }
  }, [producto, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!producto) return;

    if (!formData.nombre.trim()) return alert('El nombre es requerido');
    if (!formData.precio || parseFloat(formData.precio) <= 0) return alert('Precio inválido');
    if (!formData.categoria_id) return alert('Categoría requerida');

    setLoading(true);
    try {
      const payload = { 
        id: producto.id,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        precio: parseFloat(formData.precio),
        categoria_id: Number(formData.categoria_id),
        stock: Math.max(0, parseInt(formData.stock) || 0),
        stock_minimo: Math.max(0, parseInt(formData.stock_minimo) || 0),
        imagen: formData.imagen.trim() || undefined,
        estado: formData.estado as EstadoProducto,
      };
      
      const result = await updateProducto(payload);

      if (result.success) {
        toast({ title: 'Éxito', description: 'Producto actualizado correctamente' });
        
        if (onSuccess) onSuccess(); 
        
        router.refresh();
        if (onOpenChange) onOpenChange(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col bg-white">
        
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            
            <DialogHeader className="px-6 py-4 border-b z-10 bg-white">
              <DialogTitle>Editar Producto</DialogTitle>
              <DialogDescription>
                Modifica los datos del producto "{producto?.nombre}"
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Producto *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                      disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      rows={3}
                      disabled={loading}
                      className="resize-none"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="precio">Precio (S/) *</Label>
                      <Input
                        id="precio"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precio}
                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoria_id">Categoría *</Label>
                      <Select
                        value={formData.categoria_id}
                        onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriasError ? (
                            <SelectItem value="error" disabled>Error al cargar</SelectItem>
                          ) : categorias.length > 0 ? (
                            categorias.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.nombre}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-data" disabled>No hay categorías</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock_minimo">Stock Mínimo</Label>
                      <Input
                        id="stock_minimo"
                        type="number"
                        min="0"
                        value={formData.stock_minimo}
                        onChange={(e) => setFormData({ ...formData, stock_minimo: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="imagen">URL de Imagen</Label>
                    <Input
                      id="imagen"
                      type="url"
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                      disabled={loading}
                    />
                </div>

                <div className="space-y-2 pb-2">
                    <Label htmlFor="estado">Estado *</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => setFormData({ ...formData, estado: value })}
                      disabled={loading}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                        <SelectItem value="agotado">Agotado</SelectItem>
                        <SelectItem value="descontinuado">Descontinuado</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
            </div>

            <DialogFooter className="px-6 py-4 border-t bg-gray-50">
                <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)} disabled={loading}>
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
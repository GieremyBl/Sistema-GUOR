'use client';

import { useState, ChangeEvent } from 'react';
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
import { ImagePlus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { CreateProductoDialogProps } from '@/lib/types/categoria.types';

export default function CreateProductoDialog({
  open,
  onOpenChange,
  onSubmit,
  categorias,
}: CreateProductoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    stock: '0',
    stock_minimo: '10',
    estado: 'activo',
  });

  // Manejo de imagen
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen no debe superar los 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('El archivo debe ser una imagen');
        return;
      }
      setError(null);
      setImagenFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImagenFile(null);
    setPreviewUrl(null);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria_id: '',
      stock: '0',
      stock_minimo: '10',
      estado: 'activo',
    });
    removeImage();
    setError(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validaciones
      if (!formData.nombre.trim()) throw new Error('El nombre es obligatorio');
      if (!formData.categoria_id) throw new Error('La categoría es obligatoria');
      if (!formData.precio || parseFloat(formData.precio) <= 0) throw new Error('El precio debe ser mayor a 0');

      let imagenUrl = '';

      // Subida de imagen a Supabase Storage
      if (imagenFile) {
        const fileExt = imagenFile.name.split('.').pop()?.toLowerCase();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('productos')
          .upload(fileName, imagenFile, { cacheControl: '3600', upsert: false });

        if (uploadError) throw new Error(`Error imagen: ${uploadError.message}`);
        
        const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
        imagenUrl = data.publicUrl;
      }

      await onSubmit({
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim() || undefined,
        precio: parseFloat(formData.precio),
        categoria_id: Number(formData.categoria_id),
        stock: Math.max(0, parseInt(formData.stock) || 0),
        stock_minimo: Math.max(0, parseInt(formData.stock_minimo) || 10),
        imagen: imagenUrl || undefined,
        estado: formData.estado,
      });

      handleOpenChange(false);
    } catch (error: any) {
      console.error(error);
      setError(error.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col bg-white">
        
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            
            {/* Header Fijo */}
            <DialogHeader className="px-6 py-4 border-b z-10 bg-white">
              <DialogTitle>Crear Nuevo Producto</DialogTitle>
              <DialogDescription>Ingresa los datos del nuevo producto</DialogDescription>
            </DialogHeader>

            {/* Contenido con Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Producto *</Label>
                    <Input
                      id="nombre"
                      placeholder="Ej: Blusa de Seda"
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
                      placeholder="Detalles..."
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
                        placeholder="0.00"
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
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          {/* AQUÍ MOSTRAMOS LAS CATEGORÍAS DE LA BD.
                             Si el array 'categorias' está vacío, mostramos mensaje.
                          */}
                          {categorias && categorias.length > 0 ? (
                            categorias.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.nombre}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="sin-datos" disabled>
                              No hay categorías cargadas
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Inicial</Label>
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
                    <Label>Imagen</Label>
                    {!previewUrl ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 cursor-pointer relative flex flex-col items-center justify-center h-32">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageChange}
                          disabled={loading}
                        />
                        <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Subir imagen (Máx 2MB)</span>
                      </div>
                    ) : (
                      <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border group">
                        <img src={previewUrl} alt="Previsualización" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-600 hover:bg-red-100 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                </div>

                <div className="space-y-2 pb-2">
                    <Label htmlFor="estado">Estado</Label>
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

            {/* Footer Fijo */}
            <DialogFooter className="px-6 py-4 border-t bg-gray-50">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
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
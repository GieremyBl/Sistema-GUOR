'use client';

import { useState, ChangeEvent, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { ImagePlus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface Categoria {
  id: string | number;
  nombre: string;
}

interface CreateProductoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function CreateProductoDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateProductoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasLoading, setCategoriasLoading] = useState(false);

  // Estado para la imagen
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

  // Cargar categorías cuando se abre el diálogo
  useEffect(() => {
    if (open && categorias.length === 0) {
      loadCategorias();
    }
  }, [open]);

  const loadCategorias = async () => {
    setCategoriasLoading(true);
    try {
      const response = await fetch('/api/categorias');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setError('Error al cargar las categorías');
    } finally {
      setCategoriasLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen no debe superar los 2MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        setError('El archivo debe ser una imagen');
        return;
      }

      setError(null);
      setImagenFile(file);
      // Crear URL temporal para previsualizar
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
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
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validaciones
      if (!formData.nombre.trim()) {
        setError('El nombre del producto es obligatorio');
        setLoading(false);
        return;
      }

      if (!formData.categoria_id) {
        setError('La categoría es obligatoria');
        setLoading(false);
        return;
      }

      if (!formData.precio || parseFloat(formData.precio) <= 0) {
        setError('El precio debe ser mayor a 0');
        setLoading(false);
        return;
      }

      let imagenUrl = '';

      // Lógica de Subida de Imagen a Supabase
      if (imagenFile) {
        console.log('Subiendo imagen...', imagenFile.name);

        const fileExt = imagenFile.name.split('.').pop()?.toLowerCase();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = fileName;

        // Subir al bucket 'productos'
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('productos')
          .upload(filePath, imagenFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Error de Supabase:', uploadError);
          throw new Error(`Error subiendo la imagen: ${uploadError.message}`);
        }

        console.log('Imagen subida exitosamente:', uploadData);

        // Obtener la URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('productos')
          .getPublicUrl(filePath);

        imagenUrl = publicUrl;
        console.log('URL pública generada:', imagenUrl);
      }

      // Enviar datos
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
      console.error('Error en el formulario:', error);
      setError(error.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Producto</DialogTitle>
          <DialogDescription>
            Completa el formulario para agregar un nuevo producto al catálogo
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Producto *</Label>
            <Input
              id="nombre"
              placeholder="Ej: Polo Clásico Algodón"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Detalles del producto..."
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows={3}
              disabled={loading}
              className="resize-none"
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
                disabled={loading || categoriasLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.length > 0 ? (
                    categorias.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nombre}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No hay categorías disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Inicial</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                placeholder="0"
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
                placeholder="10"
                value={formData.stock_minimo}
                onChange={(e) => setFormData({ ...formData, stock_minimo: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <Label>Imagen del Producto</Label>

            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <ImagePlus className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Haz clic para subir una imagen</span>
                  <span className="text-xs text-gray-400">PNG, JPG, WEBP (Máx. 2MB)</span>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-xs h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img src={previewUrl} alt="Previsualización" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={loading}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-sm transition-colors disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado}
              onValueChange={(value) => setFormData({ ...formData, estado: value })}
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
              onClick={() => handleOpenChange(false)}
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
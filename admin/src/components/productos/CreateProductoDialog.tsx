'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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

// Definición de Tipos
interface Categoria {
  id: string;
  nombre: string;
}

interface CreateProductoFormProps {
  categorias: Categoria[];
  onSubmit: (data: any) => Promise<void>;
}

export default function CreateProductoForm({
  categorias,
  onSubmit,
}: CreateProductoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para la imagen
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    stock: '0',
    stockMinimo: '400',
    estado: 'activo',
  });

  // Manejar selección de archivo del escritorio
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
      URL.revokeObjectURL(previewUrl); // Liberar memoria
    }
    setImagenFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.categoria_id) {
        setError('La categoría es obligatoria');
        setLoading(false);
        return;
      }

      // Validación adicional del precio
      if (!formData.precio || parseFloat(formData.precio) <= 0) {
        setError('El precio debe ser mayor a 0');
        setLoading(false);
        return;
      }

      let imagenUrl = '';

      // 1. Lógica de Subida de Imagen a Supabase
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
            upsert: false
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

      // 2. Enviar datos al padre (incluyendo la nueva URL de imagen)
      await onSubmit({
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        precio: parseFloat(formData.precio),
        categoria_id: parseInt(formData.categoria_id),
        stock: parseInt(formData.stock) || 0,
        stock_minimo: parseInt(formData.stockMinimo) || 400,
        imagen: imagenUrl || undefined,
        estado: formData.estado,
      });

      // Limpiar el preview después de enviar
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

    } catch (error: any) {
      console.error('Error en el formulario:', error);
      setError(error.message || 'Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl text-gray-800">Crear Nuevo Producto</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          
          {/* Mostrar errores */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Sección: Nombre y Descripción */}
          <div className="space-y-4">
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
          </div>

          {/* Sección: Precios y Categoría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio (S/) *</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoriaId">Categoría *</Label>
              <Select
                value={formData.categoria_id || ''}
                onValueChange={(value) => {
                  setFormData({ ...formData, categoria_id: value });
                  // Limpiar error de categoría si existía
                  if (error === 'La categoría es obligatoria') {
                    setError(null);
                  }
                }}
                disabled={loading}
              >
                <SelectTrigger className={!formData.categoria_id && error === 'La categoría es obligatoria' ? 'border-red-500' : ''}>
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

          {/* Sección: Inventario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Inicial</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockMinimo">Stock Mínimo</Label>
              <Input
                id="stockMinimo"
                type="number"
                placeholder="10"
                value={formData.stockMinimo}
                onChange={(e) => setFormData({ ...formData, stockMinimo: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {/* Sección: Imagen (File Upload) */}
          <div className="space-y-2">
            <Label>Imagen del Producto</Label>
            
            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                  disabled={loading}
                />
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <ImagePlus className="h-10 w-10 mb-2" />
                  <span className="text-sm font-medium">Haz clic para subir una imagen</span>
                  <span className="text-xs text-gray-400">PNG, JPG, WEBP (Máx. 2MB)</span>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-xs h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img 
                  src={previewUrl} 
                  alt="Previsualización" 
                  className="w-full h-full object-cover"
                />
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

          {/* Sección: Estado */}
          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={formData.estado}
              onValueChange={(value) => setFormData({ ...formData, estado: value })}
              disabled={loading}
            >
              <SelectTrigger className="w-full md:w-[200px]">
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

        </CardContent>

        <CardFooter className="flex justify-end gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Subiendo y Creando...' : 'Crear Producto'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
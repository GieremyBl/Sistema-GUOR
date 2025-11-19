// src/app/Panel-Administrativo/productos/nuevo/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// 1. CAMBIO: Importamos el Formulario, no el Dialog
import CreateProductoForm from '@/components/productos/CreateProductoDialog'; 
import { useToast } from '@/app/hooks/use-toast';
import { createProducto, fetchCategorias, Categoria } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NuevoProductoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await fetchCategorias();
      setCategorias(data);
    } catch (error: any) {
      console.error('Error cargando categorías:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar las categorías',
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. CAMBIO: Manejo de datos simplificado
  const handleSubmit = async (data: any) => {
    try {
      // Mapeamos los datos del formulario a lo que espera tu API (Snake Case)
      await createProducto({
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        categoria_id: Number(data.categoriaId),
        stock: data.stock,
        stock_minimo: data.stockMinimo,
        imagen: data.imagen,
        estado: data.estado, 
      });

      toast({
        title: 'Éxito',
        description: 'Producto creado correctamente',
      });

      // Redirigir al listado
      router.push('/Panel-Administrativo/productos');
      router.refresh(); 
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear el producto',
      });
      // No relanzamos el error para que el formulario no explote, solo mostramos el toast
    }
  };

  const categoriasTransformadas = categorias.map((cat) => ({
    id: cat.id.toString(),
    nombre: cat.nombre,
  }));

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      
      {/* Header con botón de regresar */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Producto</h1>
          <p className="text-gray-600 mt-1">
            Completa el formulario para agregar un nuevo producto al catálogo
          </p>
        </div>
      </div>

      {/* 3. CAMBIO: Renderizamos el formulario directamente (sin Dialog/Open props) */}
      {loading ? (
        <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <CreateProductoForm
          categorias={categoriasTransformadas}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
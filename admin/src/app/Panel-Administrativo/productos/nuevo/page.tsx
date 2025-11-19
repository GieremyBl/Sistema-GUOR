'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CreateProductoDialog from '@/components/productos/CreateProductoDialog';
import { useToast } from '@/app/hooks/use-toast';
import { createProducto, fetchCategorias, Categoria } from '@/lib/api';

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

  const handleSubmit = async (data: any) => {
    try {
      await createProducto({
        nombre: data.nombre,
        descripcion: data.descripcion,
        precio: data.precio,
        categoria_id: Number(data.categoriaId),
        stock: data.stock,
        stock_minimo: data.stockMinimo,
        imagen: data.imagen,
      });

      toast({
        title: 'Éxito',
        description: 'Producto creado correctamente',
      });

      router.push('/Panel-Administrativo/productos');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo crear el producto',
      });
      throw error;
    }
  };

  const categoriasTransformadas = categorias.map((cat) => ({
    id: cat.id.toString(),
    nombre: cat.nombre,
  }));

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Producto</h1>
        <p className="text-gray-600 mt-1">
          Completa el formulario para agregar un nuevo producto al catálogo
        </p>
      </div>

      {!loading && (
        <CreateProductoDialog
          open={true}
          onOpenChange={(open) => !open && router.push('/Panel-Administrativo/productos')}
          categorias={categoriasTransformadas}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import EditProductoDialog from '@/components/productos/EditProductoDialog';
import { useToast } from '@/app/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  getProducto,
  updateProducto,
  fetchCategorias,
  ProductoApi,
  Categoria,
  ProductoUpdateData,
} from '@/lib/api';

export default function EditarProductoPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [producto, setProducto] = useState<ProductoApi | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      const [productoData, categoriasData] = await Promise.all([
        getProducto(Number(params.id)),
        fetchCategorias(),
      ]);

      setProducto(productoData);
      setCategorias(categoriasData);
    } catch (error: any) {
      console.error('Error cargando datos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo cargar el producto',
      });
      router.push('/Panel-Administrativo/productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (id: string, data: ProductoUpdateData) => {
    try {
      await updateProducto(Number(id), {
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
        description: 'Producto actualizado correctamente',
      });

      router.push('/Panel-Administrativo/productos');
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo actualizar el producto',
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!producto) {
    return null;
  }

  const productoTransformado = {
    ...producto,
    id: producto.id.toString(),
    categoriaId: producto.categoria_id.toString(),
    stockMinimo: producto.stock_minimo,
  };

  const categoriasTransformadas = categorias.map((cat) => ({
    id: cat.id.toString(),
    nombre: cat.nombre,
  }));

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
        <p className="text-gray-600 mt-1">Modifica los datos del producto</p>
      </div>

      <EditProductoDialog
        open={true}
        onOpenChange={(open) => !open && router.push('/Panel-Administrativo/productos')}
        productos={productoTransformado}
        categorias={categoriasTransformadas}
        onSubmit={handleSubmit}
      />
    </div>
  );
}


import { getProductoById } from '@/lib/actions/productos.actions';
import { getCategorias } from '@/lib/actions/categorias.actions';
import { notFound } from 'next/navigation';
import EditProductoDialog from '@/components/productos/EditProductoDialog'

// Requerimos los parámetros de la ruta (id)
interface ProductoDetailPageProps {
  params: {
    id: string; // El ID del producto de la URL
  };
}

export default async function ProductoDetailPage({ params }: ProductoDetailPageProps) {
  const productoId = parseInt(params.id);

  // Validar que sea un número válido
  if (isNaN(productoId)) {
    return notFound();
  }

  // 1. Fetch de Producto y Categorías en paralelo (Server Actions)
  const [productoResult, categoriasResult] = await Promise.all([
    getProductoById(productoId),
    getCategorias(true),
  ]);

  if (!productoResult.success || !productoResult.data) {
    // Si el producto no existe o hay un error, mostrar 404
    return notFound();
  }

  const producto = productoResult.data;
  const categorias = categoriasResult.success ? categoriasResult.data : [];
  const categoriasError = categoriasResult.success ? null : categoriasResult.error;

  // 2. Pasar los datos al componente cliente
  return (
    <EditProductoDialog
      producto={producto}
      categorias={categorias}
      categoriasError={categoriasError}
    />
  );
}
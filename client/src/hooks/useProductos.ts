import { useState, useEffect } from 'react';
import { ProductosService } from '@/services/productos.service';
import { Producto } from '@/types/database';

export function useProductos(filtros?: {
  categoria_id?: number;
  busqueda?: string;
  ordenar?: 'precio_asc' | 'precio_desc' | 'nombre';
}) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarProductos() {
      setLoading(true);
      try {
        const data = await ProductosService.obtenerProductos(filtros);
        setProductos(data);
        setError(null);
      } catch (err) {
        setError('Error cargando productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    cargarProductos();
  }, [filtros?.categoria_id, filtros?.busqueda, filtros?.ordenar]);

  return { productos, loading, error };
}
import { supabase } from '@/lib/supabase';
import { Producto } from '@/types/database';

export class ProductosService {
  // Obtener todos los productos activos
  static async obtenerProductos(filtros?: {
    categoria_id?: number;
    busqueda?: string;
    ordenar?: 'precio_asc' | 'precio_desc' | 'nombre';
  }): Promise<Producto[]> {
    try {
      let query = supabase
        .from('productos')
        .select('*, categorias(*)')
        .eq('estado', 'activo');

      if (filtros?.categoria_id) {
        query = query.eq('categoria_id', filtros.categoria_id);
      }

      if (filtros?.busqueda) {
        query = query.ilike('nombre', `%${filtros.busqueda}%`);
      }

      if (filtros?.ordenar === 'precio_asc') {
        query = query.order('precio', { ascending: true });
      } else if (filtros?.ordenar === 'precio_desc') {
        query = query.order('precio', { ascending: false });
      } else {
        query = query.order('nombre', { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  }

  // Obtener producto por ID con variantes
  static async obtenerProductoPorId(id: number): Promise<{
    producto: Producto | null;
    variantes: any[];
  }> {
    try {
      const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .select('*, categorias(*)')
        .eq('id', id)
        .single();

      if (errorProducto) throw errorProducto;

      const { data: variantes, error: errorVariantes } = await supabase
        .from('variantes_producto')
        .select('*')
        .eq('producto_id', id);

      if (errorVariantes) throw errorVariantes;

      return {
        producto: producto || null,
        variantes: variantes || []
      };
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      return { producto: null, variantes: [] };
    }
  }

  // Obtener productos destacados
  static async obtenerProductosDestacados(limite: number = 8): Promise<Producto[]> {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*, categorias(*)')
        .eq('estado', 'activo')
        .order('created_at', { ascending: false })
        .limit(limite);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo productos destacados:', error);
      return [];
    }
  }
}
'use server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_UR!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas para el cliente Admin.');
   }
 
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
export type Producto = {
  id: bigint;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoriaId: bigint;
  stock: number;
  stockMinimo: number;
  imagen: string | null;
  estado: 'activo' | 'inactivo' | 'agotado' | 'descontinuado';
  createdAt: Date;
  updatedAt: Date;
};

export type ProductoConCategoria = Producto & {
  categoria: {
    id: bigint;
    nombre: string;
  };
};

type FiltrosProductos = {
  estado?: string;
  categoriaId?: string;
  busqueda?: string;
  stockBajo?: boolean;
  page?: number;
  limit?: number;
};

export async function getProductos(filtros: FiltrosProductos = {}) {
  try {
    let supabase = getSupabaseAdminClient();
    const { 
      estado, 
      categoriaId, 
      busqueda, 
      stockBajo,
      page = 1,
      limit = 10 
    } = filtros;

    let query = getSupabaseAdminClient()
      .from('productos')
      .select(`
        *,
        categoria:categorias (
          id,
          nombre,
          activo
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (estado) {
      query = query.eq('estado', estado);
    }

    if (categoriaId) {
      query = query.eq('categoria_id', categoriaId);
    }

    if (busqueda) {
      query = query.or(`nombre.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%`);
    }

    if (stockBajo) {
      query = query.lte('stock', supabase.rpc('stock_minimo'));
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) throw error;

    return {
      success: true,
      data,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      }
    };
  } catch (error: any) {
    console.error('Error al obtener productos:', error);
    return { success: false, error: error.message };
  }
}

export async function getProductoById(id: string) {
  try {
    let supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        categoria:categorias (*),
        variantes:variantes_producto (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error al obtener producto:', error);
    return { success: false, error: error.message };
  }
}

export async function createProducto(formData: {
  nombre: string;
  descripcion?: string;
  precio: number;
  categoriaId: string;
  stock?: number;
  stockMinimo?: number;
  imagen?: string;
  estado?: string;
}) {
  try {
    let supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('productos')
      .insert([{
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio,
        categoria_id: formData.categoriaId,
        stock: formData.stock ?? 0,
        stock_minimo: formData.stockMinimo ?? 10,
        imagen: formData.imagen,
        estado: formData.estado ?? 'activo'
      }])
      .select(`
        *,
        categoria:categorias (*)
      `)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error al crear producto:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProducto(id: string, formData: any) {
  try {
    let supabase = getSupabaseAdminClient();
    const updateData: any = {};

    if (formData.nombre) updateData.nombre = formData.nombre;
    if (formData.descripcion !== undefined) updateData.descripcion = formData.descripcion;
    if (formData.precio) updateData.precio = formData.precio;
    if (formData.categoriaId) updateData.categoria_id = formData.categoriaId;
    if (formData.stock !== undefined) updateData.stock = formData.stock;
    if (formData.stockMinimo !== undefined) updateData.stock_minimo = formData.stockMinimo;
    if (formData.imagen !== undefined) updateData.imagen = formData.imagen;
    if (formData.estado) updateData.estado = formData.estado;

    const { data, error } = await supabase
      .from('productos')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categoria:categorias (*)
      `)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error al actualizar producto:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProducto(id: string) {
  try {
    let supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error al eliminar producto:', error);
    return { success: false, error: error.message };
  }
}

export async function updateStockProducto(
  id: string, 
  cantidad: number, 
  operacion: 'agregar' | 'reducir' | 'establecer'
) {
  try {
    let supabase = getSupabaseAdminClient();
    // Obtener stock actual
    const { data: producto, error: errorGet } = await supabase
      .from('productos')
      .select('stock')
      .eq('id', id)
      .single();

    if (errorGet) throw errorGet;

    let nuevoStock = producto.stock;

    if (operacion === 'agregar') {
      nuevoStock += cantidad;
    } else if (operacion === 'reducir') {
      nuevoStock -= cantidad;
      if (nuevoStock < 0) {
        throw new Error('El stock no puede ser negativo');
      }
    } else {
      nuevoStock = cantidad;
    }

    const { data, error } = await getSupabaseAdminClient()
      .from('productos')
      .update({ stock: nuevoStock })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error al actualizar stock:', error);
    return { success: false, error: error.message };
  }
}

export async function getProductosStockBajo() {
  try {
    let supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .rpc('verificar_stock_bajo');

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error al obtener productos con stock bajo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener productos disponibles (activos y con stock)
 * Útil para seleccionar productos al crear pedidos
 */
export async function getProductosDisponibles() {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('productos')
      .select(`
        id,
        nombre,
        descripcion,
        precio,
        stock,
        imagen,
        categoria:categorias (
          id,
          nombre
        )
      `)
      .eq('estado', 'activo')
      .gt('stock', 0)
      .order('nombre', { ascending: true });

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error al obtener productos disponibles:', error);
    return { success: false, error: error.message, data: [] };
  }
}
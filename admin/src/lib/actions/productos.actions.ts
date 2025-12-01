'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import type { 
    Producto, 
    ProductoConCategoria, 
    ProductoCreateInput, 
    ProductoUpdateInput,
    FiltrosProductos 
} from '@/lib/types/producto.types'; 


/**
 * Obtener productos con filtros y paginación
 */
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

        let query = supabase
            .from('productos')
            .select(`
                *,
                categoria:categorias!inner (id, nombre, activo) 
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
             query = query.lte('stock', 'stock_minimo'); 
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query.range(from, to);

        if (error) throw error;

        return {
            success: true,
            data: data as ProductoConCategoria[],
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

/**
 * Obtener un producto por ID
 */
export async function getProductoById(id: number) {
    try {
        let supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
            .from('productos')
            .select(`
                *,
                categoria:categorias (id, nombre, activo),
                variantes:variantes_producto (*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        return { success: true, data: data as ProductoConCategoria }; 
    } catch (error: any) {
        console.error('Error al obtener producto:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Crear un nuevo producto
 */
export async function createProducto(input: ProductoCreateInput) {
    try {
        let supabase = getSupabaseAdminClient();
        
        const { data, error } = await supabase
            .from('productos')
            .insert([{
                nombre: input.nombre,
                descripcion: input.descripcion,
                precio: input.precio,
                categoria_id: input.categoria_id,
                stock: input.stock ?? 0,
                stock_minimo: input.stock_minimo ?? 10,
                imagen: input.imagen,
                estado: input.estado ?? 'activo'
            }])
            .select(`
                *,
                categoria:categorias (id, nombre, activo)
            `)
            .single();

        if (error) throw error;

        revalidatePath('Panel-Administrativo/productos');

        return { success: true, data: data as ProductoConCategoria };
    } catch (error: any) {
        console.error('Error al crear producto:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Actualizar un producto existente
 */
export async function updateProducto(input: ProductoUpdateInput) {
    try {
        
        let supabase = getSupabaseAdminClient();
        const { id, ...formData } = input;
        
        const updateData: any = {};

        if (formData.nombre) updateData.nombre = formData.nombre;
        if (formData.descripcion !== undefined) updateData.descripcion = formData.descripcion;
        if (formData.precio) updateData.precio = formData.precio;
        if (formData.categoria_id) updateData.categoria_id = formData.categoria_id;
        if (formData.stock !== undefined) updateData.stock = formData.stock;
        if (formData.stock_minimo !== undefined) updateData.stock_minimo = formData.stock_minimo;
        if (formData.imagen !== undefined) updateData.imagen = formData.imagen;
        if (formData.estado) updateData.estado = formData.estado;

        const { data, error } = await supabase
            .from('productos')
            .update(updateData)
            .eq('id', id)
            .select(`
                *,
                categoria:categorias (id, nombre, activo)
            `)
            .single();

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/productos');
        revalidatePath(`/Panel-Administrativo/productos/${id}`);
        return { success: true, data: data as ProductoConCategoria };
    } catch (error: any) {
        console.error('Error al actualizar producto:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Eliminar un producto
 */
export async function deleteProducto(id: number) {
    try {
        let supabase = getSupabaseAdminClient();
        const { error } = await supabase
            .from('productos')
            .delete()
            .eq('id', id);

        if (error) throw error;
        revalidatePath('/Panel-Administrativo/productos');
        return { success: true };
    } catch (error: any) {
        console.error('Error al eliminar producto:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Actualizar stock de producto
 */
export async function updateStockProducto(
    id: number, 
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

        // Seleccionamos '*' para asegurar que se devuelvan todos los campos obligatorios
        const { data, error } = await supabase
            .from('productos')
            .update({ stock: nuevoStock })
            .eq('id', id)
            .select('*') 
            .single();

        if (error) throw error;
        revalidatePath('/Panel-Administrativo/productos');
        return { success: true, data: data as Producto };
    } catch (error: any) {
        console.error('Error al actualizar stock:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtener productos con stock bajo
 */
export async function getProductosStockBajo() {
    try {
        let supabase = getSupabaseAdminClient();
        
        // Seleccionamos '*' para cumplir con el tipo Producto[]
        const { data, error } = await supabase
             .from('productos')
             .select('*')
             .lte('stock', 'stock_minimo');

        if (error) throw error;

        return { success: true, data: data as Producto[] };
    } catch (error: any) {
        console.error('Error al obtener productos con stock bajo:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtener productos disponibles (activos y con stock)
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
                categoria_id,
                stock_minimo,
                estado,
                created_at,
                updated_at,
                categoria:categorias!inner (id, nombre, activo)
            `)
            .eq('estado', 'activo')
            .gt('stock', 0)
            .order('nombre', { ascending: true });

        if (error) throw error;

        return { success: true, data: data as ProductoConCategoria[] || [] }; 
    } catch (error: any) {
        console.error('Error al obtener productos disponibles:', error);
        return { success: false, error: error.message, data: [] };
    }
}
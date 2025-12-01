'use server';

import { getSupabaseAdminClient } from '@/lib/supabase/admin'; 
import { revalidatePath } from 'next/cache';

import type { 
    Categoria, 
    CategoriaCreateInput, 
    CategoriaUpdateInput,
    CategoriaConProductos,
    CategoriaConConteo,
    FiltrosCategorias
} from '@/lib/types/categoria.types'; 

// ===============================
// FETCH & GET
// ===============================

/**
 * Obtiene todas las categorías o solo las activas, incluyendo el conteo de productos.
 */
export async function getCategorias(activoSolo?: boolean) {
    try {
        let supabase = getSupabaseAdminClient(); 

        let query = supabase
            .from('categorias')
            .select('*, productos(count)', { count: 'exact' })
            .order('nombre', { ascending: true });
            // ...
        
        const { data, error } = await query;

        if (error) throw error;
        
        const dataMapped: CategoriaConConteo[] = (data as any[]).map((c: any) => ({
            ...c,
            _count: {
                productos: c.productos, 
            }
        }));

        return { success: true, data: dataMapped }; 
    } catch (error: any) {
        console.error('Error al obtener categorías:', error);
        return { success: false, error: error.message, data: [] };
    }
}

/**
 * Obtiene una categoría por ID, incluyendo un resumen de sus productos.
 */
export async function getCategoriaById(id: number) {
    try {
        let supabase = getSupabaseAdminClient(); 

        const { data, error } = await supabase
            .from('categorias')
            .select(`
                *,
                productos (
                    id,
                    nombre,
                    precio,
                    stock,
                    estado
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        return { success: true, data: data as CategoriaConProductos }; 
    } catch (error: any) {
        console.error('Error al obtener categoría:', error);
        return { success: false, error: error.message };
    }
}

// ===============================
// MUTATIONS (CRUD)
// ===============================

/**
 * Crea una nueva categoría.
 */
export async function createCategoria(input: CategoriaCreateInput) {
    try {
        let supabase = getSupabaseAdminClient(); 

        const { data, error } = await supabase
            .from('categorias')
            .insert([input])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/categorias');
        return { success: true, data: data as Categoria };
    } catch (error: any) {
        console.error('Error al crear categoría:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Actualiza una categoría existente.
 */
export async function updateCategoria(id: number, input: CategoriaUpdateInput) {
    try {
        let supabase = getSupabaseAdminClient(); 

        const { data, error } = await supabase
            .from('categorias')
            .update(input) 
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/categorias');
        revalidatePath(`/Panel-Administrativo/categorias/${id}`);
        return { success: true, data: data as Categoria };
    } catch (error: any) {
        console.error('Error al actualizar categoría:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Elimina una categoría.
 */
export async function deleteCategoria(id: number) {
    try {
        let supabase = getSupabaseAdminClient(); 
        
        const { error } = await supabase
            .from('categorias')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/categorias');
        return { success: true };
    } catch (error: any) {
        console.error('Error al eliminar categoría:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Alterna el estado activo de una categoría.
 */
export async function toggleCategoriaActivo(id: number, activo: boolean) {
    try {
        let supabase = getSupabaseAdminClient(); 
        
        const { data, error } = await supabase
            .from('categorias')
            .update({ activo: !activo }) 
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/categorias');
        return { success: true, data: data as Categoria };
    } catch (error: any) {
        console.error('Error al cambiar estado:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtiene categorías con filtros de búsqueda y estado.
 */
export async function getCategoriasConFiltros(filtros: FiltrosCategorias = {}) {
    try {
        let supabase = getSupabaseAdminClient(); 

        const { busqueda, activo, page = 1, limit = 10 } = filtros; 

        let query = supabase
            .from('categorias')
            .select('*, productos!count(*)', { count: 'exact' }) 
            .order('nombre', { ascending: true });
 
        // 1. Filtrar por Estado (Activa/Inactiva)
        if (activo !== undefined) {
            query = query.eq('activo', activo);
        }

        // 2. Filtrar por Búsqueda (Nombre o Descripción)
        if (busqueda) {
            query = query.or(`nombre.ilike.%${busqueda}%,descripcion.ilike.%${busqueda}%`);
        }
        
        // Paginación (si se implementa)
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        query = query.range(start, end);


        const { data, error, count } = await query;

        if (error) throw error;
        
        // Mapeo para estandarizar el objeto CategoriaConConteo
        const dataMapped: CategoriaConConteo[] = data.map((c: any) => ({
            ...c,
            _count: {
                productos: c.productos, 
            }
        }));


        return { 
            success: true, 
            data: dataMapped,
            pagination: {
                total: count,
                page: page,
                limit: limit,
                pages: Math.ceil((count || 0) / limit),
            }
        }; 
    } catch (error: any) {
        console.error('Error al obtener categorías con filtros:', error);
        return { success: false, error: error.message, data: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } };
    }
}
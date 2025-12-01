'use server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin'; 
import { revalidatePath } from 'next/cache';
import type { 
    Categoria, 
    CategoriaCreateInput, 
    CategoriaUpdateInput,
    CategoriaConProductos
} from '@/lib/types/categoria.types'; 

// ===============================
// FETCH & GET
// ===============================

/**
 * Obtiene todas las categorías o solo las activas.
 */
export async function getCategorias(activoSolo?: boolean) {
    try {
        let supabase = getSupabaseAdminClient(); 

        let query = supabase
            .from('categorias')
            .select('*, productos(count)')
            .order('nombre', { ascending: true });

        if (activoSolo) {
            query = query.eq('activo', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        return { success: true, data: data as Categoria[] }; 
    } catch (error: any) {
        console.error('Error al obtener categorías:', error);
        return { success: false, error: error.message };
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
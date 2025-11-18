"use server";

import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Obtener productos activos con stock disponible
 */
export async function getProductosDisponibles() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: productos, error } = await supabase
      .from('productos')
      .select(`
        id, 
        nombre, 
        descripcion, 
        precio, 
        stock, 
        stock_minimo,
        imagen,
        categoria:categorias(id, nombre)
      `)
      .eq('estado', true)
      .gt('stock', 0)
      .order('nombre', { ascending: true });

    if (error) throw error;

    return { success: true, data: productos };
  } catch (error: any) {
    console.error('Error obteniendo productos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Buscar productos por nombre o código
 */
export async function searchProductos(searchTerm: string) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: productos, error } = await supabase
      .from('productos')
      .select(`
        id, 
        nombre, 
        precio, 
        stock,
        imagen,
        categoria:categorias(nombre)
      `)
      .eq('estado', true)
      .ilike('nombre', `%${searchTerm}%`)
      .limit(20);

    if (error) throw error;

    return { success: true, data: productos };
  } catch (error: any) {
    console.error('Error buscando productos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener un producto por ID
 */
export async function getProductoById(id: string) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: producto, error } = await supabase
      .from('productos')
      .select(`
        id, 
        nombre, 
        descripcion, 
        precio, 
        stock,
        stock_minimo,
        imagen,
        categoria:categorias(id, nombre)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data: producto };
  } catch (error: any) {
    console.error('Error obteniendo producto:', error);
    return { success: false, error: error.message };
  }
}
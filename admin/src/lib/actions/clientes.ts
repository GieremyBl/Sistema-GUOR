"use server";

import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Obtener todos los clientes activos para selects
 */
export async function getClientesActivos() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: clientes, error } = await supabase
      .from('clientes')
      .select('id, ruc, razon_social, email, telefono, direccion')
      .eq('activo', true)
      .order('razon_social', { ascending: true });

    if (error) throw error;

    return { success: true, data: clientes };
  } catch (error: any) {
    console.error('Error obteniendo clientes:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Buscar clientes por término de búsqueda
 */
export async function searchClientes(searchTerm: string) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: clientes, error } = await supabase
      .from('clientes')
      .select('id, ruc, razon_social, email, telefono')
      .eq('activo', true)
      .or(`razon_social.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,ruc::text.ilike.%${searchTerm}%`)
      .limit(10);

    if (error) throw error;

    return { success: true, data: clientes };
  } catch (error: any) {
    console.error('Error buscando clientes:', error);
    return { success: false, error: error.message };
  }
}

// ============================================
// admin/src/lib/actions/productos.ts
// ============================================

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

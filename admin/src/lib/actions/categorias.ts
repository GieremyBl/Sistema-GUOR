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

export type Categoria = {
  id: bigint;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function getCategorias(activoSolo?: boolean) {
  try {
    let supabase = getSupabaseAdminClient(); 

    let query = supabase
      .from('categorias')
      .select('*')
      .order('nombre', { ascending: true });

    if (activoSolo) {
      query = query.eq('activo', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error al obtener categorías:', error);
    return { success: false, error: error.message };
  }
}

export async function getCategoriaById(id: string) {
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

    return { success: true, data };
  } catch (error: any) {
    console.error('Error al obtener categoría:', error);
    return { success: false, error: error.message };
  }
}

export async function createCategoria(formData: {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}) {
  try {
    let supabase = getSupabaseAdminClient(); 

    const { data, error } = await supabase
      .from('categorias')
      .insert([formData])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error al crear categoría:', error);
    return { success: false, error: error.message };
  }
}

export async function updateCategoria(id: string, formData: Partial<Categoria>) {
  try {
    let supabase = getSupabaseAdminClient(); 

    const { data, error } = await supabase
      .from('categorias')
      .update(formData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error al actualizar categoría:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteCategoria(id: string) {
  try {
    let supabase = getSupabaseAdminClient(); 

    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error al eliminar categoría:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleCategoriaActivo(id: string, activo: boolean) {
  try {
    let supabase = getSupabaseAdminClient(); 
    
    const { data, error } = await supabase
      .from('categorias')
      .update({ activo: !activo })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error('Error al cambiar estado:', error);
    return { success: false, error: error.message };
  }
}
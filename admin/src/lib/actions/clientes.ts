'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import type { Cliente, ClienteCreateInput, ClienteUpdateInput } from '@/lib/api';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas para el cliente Admin.');
   }

    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
// ===============================
// FETCH CLIENTES
// ===============================
export async function fetchClientes(): Promise<Cliente[]> {
  try {
    let supabase = getSupabaseAdminClient(); 
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Error fetching clientes:', error);
      throw new Error('Error al obtener clientes');
    }

    return data || [];
  } catch (error) {
    console.error('Fetch clientes error:', error);
    throw error;
  }
}

// ===============================
// FETCH CLIENTES ACTIVOS (para selectores)
// ===============================
export async function fetchClientesActivos(): Promise<Cliente[]> {
  try {
    let supabase = getSupabaseAdminClient(); 
    
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('activo', true)
      .order('razon_social', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Error fetching clientes activos:', error);
      throw new Error('Error al obtener clientes activos');
    }

    return data || [];
  } catch (error) {
    console.error('Fetch clientes activos error:', error);
    throw error;
  }
}

// ===============================
// FETCH CLIENTE BY ID
// ===============================
export async function fetchClienteById(id: number): Promise<Cliente | null> {
  try {
    let supabase = getSupabaseAdminClient(); 
    
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching cliente:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Fetch cliente by id error:', error);
    return null;
  }
}

// ===============================
// CREATE CLIENTE WITH INVITATION
// ===============================
export async function createClienteWithInvitation(
  clienteData: Omit<ClienteCreateInput, 'password'>
): Promise<Cliente> {
  try {
    let supabase = getSupabaseAdminClient(); 

    // 1. Validar email único
    const { data: existingCliente } = await supabase
      .from('clientes')
      .select('id')
      .eq('email', clienteData.email)
      .maybeSingle();

    if (existingCliente) {
      throw new Error('Ya existe un cliente con este email');
    }

    // 2. Validar RUC único si se proporciona
    if (clienteData.ruc) {
      const { data: existingRuc } = await supabase
        .from('clientes')
        .select('id')
        .eq('ruc', clienteData.ruc)
        .maybeSingle();

      if (existingRuc) {
        throw new Error('Ya existe un cliente con este RUC');
      }
    }

    // 3. Crear usuario en Auth (sin contraseña, será invitado)
    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(
      clienteData.email,
      {
        data: {
          role: 'cliente',
          razon_social: clienteData.razon_social,
        },
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      }
    );

    if (authError) {
      console.error('Error inviting user:', authError);
      throw new Error('Error al enviar invitación: ' + authError.message);
    }

    // Nota: inviteUserByEmail no devuelve user data inmediatamente
    // Necesitamos crear el usuario primero con createUser
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: clienteData.email,
      email_confirm: false,
      user_metadata: {
        role: 'cliente',
        razon_social: clienteData.razon_social,
      },
    });

    if (createError || !userData.user) {
      throw new Error('Error al crear usuario: ' + createError?.message);
    }

    // 4. Crear registro en tabla clientes
    const { data, error } = await supabase
      .from('clientes')
      .insert([{
        auth_id: userData.user.id,
        razon_social: clienteData.razon_social || null,
        ruc: clienteData.ruc || null,
        email: clienteData.email,
        telefono: clienteData.telefono || null,
        direccion: clienteData.direccion || null,
        activo: true,
      }])
      .select()
      .single();

    if (error) {
      // Rollback: eliminar usuario de Auth si falla
      await supabase.auth.admin.deleteUser(userData.user.id);
      throw new Error('Error al crear cliente: ' + error.message);
    }

    // 5. Enviar email de invitación
    await supabase.auth.admin.inviteUserByEmail(clienteData.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    });

    revalidatePath('/Panel-Administrativo/clientes');
    return data;
  } catch (error) {
    console.error('Create cliente with invitation error:', error);
    throw error;
  }
}
// ===============================
// UPDATE CLIENTE
// ===============================
export async function updateCliente(
  id: number,
  clienteData: ClienteUpdateInput
): Promise<Cliente> {
  try {
    let supabase = getSupabaseAdminClient(); 

    // Si se está actualizando el email, validar que sea único
    if (clienteData.email) {
      const { data: existingCliente } = await supabase
        .from('clientes')
        .select('id')
        .eq('email', clienteData.email)
        .neq('id', id)
        .maybeSingle();

      if (existingCliente) {
        throw new Error('Ya existe otro cliente con este email');
      }
    }

    // Si se está actualizando el RUC, validar que sea único
    if (clienteData.ruc !== undefined && clienteData.ruc !== null) {
      const { data: existingRuc } = await supabase
        .from('clientes')
        .select('id')
        .eq('ruc', clienteData.ruc)
        .neq('id', id)
        .maybeSingle();

      if (existingRuc) {
        throw new Error('Ya existe otro cliente con este RUC');
      }
    }

    

    // Preparar datos para actualización
    const updateData: Partial<Cliente> = {};
    if (clienteData.razon_social !== undefined) updateData.razon_social = clienteData.razon_social;
    if (clienteData.ruc !== undefined) updateData.ruc = clienteData.ruc;
    if (clienteData.email !== undefined) updateData.email = clienteData.email;
    if (clienteData.telefono !== undefined) updateData.telefono = clienteData.telefono;
    if (clienteData.direccion !== undefined) updateData.direccion = clienteData.direccion;
    if (clienteData.activo !== undefined) updateData.activo = clienteData.activo;

    const { data, error } = await supabase
      .from('clientes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cliente:', error);
      throw new Error('Error al actualizar cliente');
    }

    revalidatePath('/Panel-Administrativo/clientes');
    revalidatePath('/Panel-Administrativo/pedidos');
    
    return data;
  } catch (error) {
    console.error('Update cliente error:', error);
    throw error;
  }
}

// ===============================
// DELETE CLIENTE (Soft delete)
// ===============================
export async function deleteCliente(id: number): Promise<void> {
  try {
    let supabase = getSupabaseAdminClient(); 

    // Verificar si el cliente tiene pedidos
    const { data: pedidos, error: pedidosError } = await supabase
      .from('pedidos')
      .select('id')
      .eq('cliente_id', id)
      .limit(1);

    if (pedidosError) {
      throw new Error('Error al verificar pedidos del cliente');
    }

    if (pedidos && pedidos.length > 0) {
      // Soft delete: marcar como inactivo en lugar de eliminar
      const { error } = await supabase
        .from('clientes')
        .update({ activo: false })
        .eq('id', id);

      if (error) {
        console.error('Error deactivating cliente:', error);
        throw new Error('Error al desactivar cliente');
      }
    } else {
      // Hard delete si no tiene pedidos
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting cliente:', error);
        throw new Error('Error al eliminar cliente');
      }
    }

    revalidatePath('/Panel-Administrativo/clientes');
    revalidatePath('/Panel-Administrativo/pedidos');
  } catch (error) {
    console.error('Delete cliente error:', error);
    throw error;
  }
}

// ===============================
// TOGGLE ACTIVO
// ===============================
export async function toggleClienteActivo(id: number): Promise<Cliente> {
  try {
    let supabase = getSupabaseAdminClient(); 

    // Obtener estado actual
    const { data: currentCliente, error: fetchError } = await supabase
      .from('clientes')
      .select('activo')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw new Error('Error al obtener cliente');
    }

    // Cambiar estado
    const { data, error } = await supabase
      .from('clientes')
      .update({ activo: !currentCliente.activo })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling cliente activo:', error);
      throw new Error('Error al cambiar estado del cliente');
    }

    revalidatePath('/Panel-Administrativo/clientes');
    revalidatePath('/Panel-Administrativo/pedidos');
    
    return data;
  } catch (error) {
    console.error('Toggle cliente activo error:', error);
    throw error;
  }
}

// ===============================
// SEARCH CLIENTES
// ===============================
export async function searchClientes(query: string): Promise<Cliente[]> {
  try {
    let supabase = getSupabaseAdminClient(); 
    
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .or(`razon_social.ilike.%${query}%,email.ilike.%${query}%,ruc.eq.${query}`)
      .order('razon_social', { ascending: true, nullsFirst: false })
      .limit(50);

    if (error) {
      console.error('Error searching clientes:', error);
      throw new Error('Error al buscar clientes');
    }

    return data || [];
  } catch (error) {
    console.error('Search clientes error:', error);
    throw error;
  }
}
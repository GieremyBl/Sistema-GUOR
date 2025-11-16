"use server";

import { createServerSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export type CreateUsuarioInput = {
  email: string;
  password: string;
  nombre_completo: string;
  telefono?: string;
  rol: 'administrador' | 'recepcionista' | 'diseñador' | 'cortador' | 'ayudante' | 'representante_taller';
  estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
};

export type UpdateUsuarioInput = {
  id: number;
  nombre_completo?: string;
  telefono?: string;
  rol?: 'administrador' | 'recepcionista' | 'diseñador' | 'cortador' | 'ayudante' | 'representante_taller';
  estado?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
};

/**
 * Obtener todos los usuarios
 */
export async function getUsuarios() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: usuarios };
  } catch (error: any) {
    console.error('Error obteniendo usuarios:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener un usuario por ID
 */
export async function getUsuarioById(id: number) {
  try {
    const supabase = createServerSupabaseClient();

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data: usuario };
  } catch (error: any) {
    console.error('Error obteniendo usuario:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Crear un nuevo usuario
 */
export async function createUsuario(input: CreateUsuarioInput) {
  try {
    const supabase = createServerSupabaseClient();

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        nombre_completo: input.nombre_completo,
        rol: input.rol,
      },
    });

    if (authError) throw new Error(`Error en Auth: ${authError.message}`);
    if (!authData.user) throw new Error('No se pudo crear el usuario en Auth');

    // 2. Crear registro en tabla usuarios
    const { data: usuario, error: dbError } = await supabase
      .from('usuarios')
      .insert({
        auth_id: authData.user.id,
        email: input.email,
        nombre_completo: input.nombre_completo,
        telefono: input.telefono || null,
        rol: input.rol,
        estado: input.estado,
        created_by: 1, // TODO: Obtener del usuario actual
      })
      .select()
      .single();

    if (dbError) {
      // Rollback: eliminar usuario de auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(`Error en BD: ${dbError.message}`);
    }

    revalidatePath('/dashboard/usuarios');
    return { success: true, data: usuario };
  } catch (error: any) {
    console.error('Error creando usuario:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar un usuario existente
 */
export async function updateUsuario(input: UpdateUsuarioInput) {
  try {
    const supabase = createServerSupabaseClient();

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (input.nombre_completo) updateData.nombre_completo = input.nombre_completo;
    if (input.telefono !== undefined) updateData.telefono = input.telefono;
    if (input.rol) updateData.rol = input.rol;
    if (input.estado) updateData.estado = input.estado;

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/usuarios');
    return { success: true, data: usuario };
  } catch (error: any) {
    console.error('Error actualizando usuario:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar un usuario
 */
export async function deleteUsuario(id: number) {
  try {
    const supabase = createServerSupabaseClient();

    // 1. Obtener auth_id del usuario
    const { data: usuario, error: getUserError } = await supabase
      .from('usuarios')
      .select('auth_id')
      .eq('id', id)
      .single();

    if (getUserError) throw getUserError;
    if (!usuario) throw new Error('Usuario no encontrado');

    // 2. Eliminar de la tabla usuarios
    const { error: deleteDbError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (deleteDbError) throw deleteDbError;

    // 3. Eliminar de Supabase Auth
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(
      usuario.auth_id
    );

    if (deleteAuthError) {
      console.error('Error eliminando de Auth:', deleteAuthError);
    }

    revalidatePath('/dashboard/usuarios');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando usuario:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Cambiar contraseña de un usuario
 */
export async function changeUserPassword(userId: number, newPassword: string) {
  try {
    const supabase = createServerSupabaseClient();

    // Obtener auth_id
    const { data: usuario, error: getUserError } = await supabase
      .from('usuarios')
      .select('auth_id')
      .eq('id', userId)
      .single();

    if (getUserError) throw getUserError;
    if (!usuario) throw new Error('Usuario no encontrado');

    // Actualizar contraseña
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      usuario.auth_id,
      { password: newPassword }
    );

    if (updateError) throw updateError;

    return { success: true };
  } catch (error: any) {
    console.error('Error cambiando contraseña:', error);
    return { success: false, error: error.message };
  }
}
"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import type { 
    Usuario, 
    FetchUsuariosParams, 
    UsuariosResponse, 
    EstadoUsuario, 
    RolUsuario 
} from '@/lib/types/usuario.types';


export type CreateUsuarioWithPassword = {
    password: string;
} & Pick<Usuario, 'email' | 'nombre_completo' | 'telefono' | 'rol'> & {
    rol: RolUsuario;
    estado: EstadoUsuario;
};

export type UpdateUsuarioActionInput = {
    id: number; 
    nombre_completo?: string;
    telefono?: string | null;
    rol?: RolUsuario;
    estado?: EstadoUsuario;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_UR!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdminClient() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas para el cliente Admin.');
    }
    
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
// ===============================
// FETCH & GET
// ===============================
/**
 * Obtener usuarios con paginación, búsqueda y filtros.
 * @param {FetchUsuariosParams} params
 * @returns {Promise<UsuariosResponse>} 
 */
export async function getUsuario({
    page = 1,
    limit = 10,
    busqueda,
    rol,
    estado
}: FetchUsuariosParams): Promise<UsuariosResponse> {
    try {
        const supabase = getSupabaseAdminClient();
        
        const offset = (page - 1) * limit; 

        let query = supabase
            .from('usuarios')
            .select('*', { count: 'exact' });

        // Aplicar filtros
        if (rol) query = query.eq('rol', rol);
        if (estado) query = query.eq('estado', estado);
        
        // Aplicar búsqueda
        if (busqueda) {
            const searchPattern = `%${busqueda}%`;
            query = query.or(`nombre_completo.ilike.${searchPattern},email.ilike.${searchPattern}`);
        }

        // Paginación
        const { data: usuarios, error, count: total } = await query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        if (total === null) throw new Error('No se pudo obtener el conteo total.');

        return {
            usuarios: usuarios as Usuario[],
            total: total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error: any) {
        console.error('Error obteniendo usuarios:', error);
        return { 
            usuarios: [], 
            total: 0, 
            page: 1,
            limit: 10,
            totalPages: 0 
        };
    }
}

/**
 * Obtener un usuario por ID
 */
export async function getUsuarioById(id: number): Promise<{ success: true, data: Usuario } | { success: false, error: string }> { 
    try {
        let supabase = getSupabaseAdminClient(); 

        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return { success: true, data: usuario as Usuario };
    } catch (error: any) {
        console.error('Error obteniendo usuario:', error);
        return { success: false, error: error.message };
    }
}

// ===============================
// MUTATIONS (CRUD)
// ===============================

/**
 * Crear un nuevo usuario
 */

export async function createUsuario(input: CreateUsuarioWithPassword): Promise<{ success: true, data: Usuario } | { success: false, error: string }> {

    try {

        let supabase = getSupabaseAdminClient();

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
                created_by: '1',
            })
            .select()
            .single();

        if (dbError) {
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw new Error(`Error en BD: ${dbError.message}`);
        }

        revalidatePath('/dashboard/usuarios');
        return { success: true, data: usuario as Usuario };
    } catch (error: any) {
        console.error('Error creando usuario:', error);
        return { success: false, error: error.message };
    }
}

/*
 * Actualizar un usuario existente
 */
export async function updateUsuario(id: number, input: Omit<UpdateUsuarioActionInput, 'id'>): Promise<{ success: true, data: Usuario } | { success: false, error: string }> {
    // ... (Sin cambios, ya acepta number)
    try {
        let supabase = getSupabaseAdminClient(); 

        const updateData: Partial<Omit<Usuario, 'id' | 'email' | 'auth_id' | 'created_at'>> & { updated_at: string } = {
             updated_at: new Date().toISOString(),
        };

        if (input.nombre_completo !== undefined) updateData.nombre_completo = input.nombre_completo;
        if (input.telefono !== undefined) updateData.telefono = input.telefono;
        if (input.rol) updateData.rol = input.rol;
        if (input.estado) updateData.estado = input.estado;

        // 1. Actualizar tabla de usuarios (public.usuarios)
        const { data: usuario, error: dbError } = await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (dbError) throw dbError;

        // 2. Actualizar metadata en Auth si el rol o nombre cambia
        if (input.rol || input.nombre_completo) {
            const { data: userAuth, error: authIdError } = await supabase
                .from('usuarios')
                .select('auth_id')
                .eq('id', id)
                .single();            
            if (!authIdError && userAuth?.auth_id) {
                 await supabase.auth.admin.updateUserById(userAuth.auth_id, {
                    user_metadata: {
                        ...(input.rol && { rol: input.rol }),
                        ...(input.nombre_completo && { nombre_completo: input.nombre_completo }),
                    }
                });
            }
        }
        
        revalidatePath('/dashboard/usuarios');
        revalidatePath(`/dashboard/usuarios/${id}`);
        return { success: true, data: usuario as Usuario };
    } catch (error: any) {
        console.error('Error actualizando usuario:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Eliminar un usuario
 */
export async function deleteUsuario(id: number): Promise<{ success: true } | { success: false, error: string }> {
    try {
        let supabase = getSupabaseAdminClient(); 

        // 1. Obtener auth_id del usuario
        const { data: usuario, error: getUserError } = await supabase
            .from('usuarios')
            .select('auth_id')
            .eq('id', id)
            .single();

        if (getUserError) throw getUserError;
        if (!usuario?.auth_id) throw new Error('Usuario o auth_id no encontrado');

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
            console.error('Error eliminando de Auth (posiblemente ya no existía):', deleteAuthError);
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
export async function changeUserPassword(userId: number, newPassword: string): Promise<{ success: true } | { success: false, error: string }> { // 👈 CORRECCIÓN 3: ID ahora es NUMBER
    try {
        let supabase = getSupabaseAdminClient(); 

        // Obtener auth_id
        const { data: usuario, error: getUserError } = await supabase
            .from('usuarios')
            .select('auth_id')
            .eq('id', userId)
            .single();

        if (getUserError) throw getUserError;
        if (!usuario?.auth_id) throw new Error('Usuario o auth_id no encontrado');

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
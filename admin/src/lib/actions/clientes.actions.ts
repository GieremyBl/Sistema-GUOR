'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdminClient } from '@/lib/supabase/admin'; 
import type { 
    Cliente, 
    ClienteCreateInput, 
    ClienteUpdateInput,
    FetchClientesParams, 
    ClientesResponse 
} from '@/lib/types/cliente.types'; 

// ===============================
// FETCH CLIENTES CON PAGINACIÓN Y FILTROS (Unificación)
// ===============================
/**
 * Obtener clientes con paginación, búsqueda y filtros.
 * Esta función reemplaza a fetchClientes simple y es más flexible.
 * @param {FetchClientesParams} params - Parámetros de paginación y filtros.
 * @returns {Promise<ClientesResponse>} Lista de clientes y metadatos de paginación.
 */
export async function getClientes({
    page = 1,
    limit = 10,
    busqueda,
    activo, 
}: FetchClientesParams = {}): Promise<ClientesResponse> {
    try {
        let supabase = getSupabaseAdminClient();
        
        const offset = (page - 1) * limit;
        const rangeEnd = offset + limit - 1; 
        
        let query = supabase
            .from('clientes')
            .select('*', { count: 'exact' }); 

        if (busqueda) {
            // Lógica de búsqueda combinada (razón social, email, ruc)
            const busquedaQuery = `razon_social.ilike.%${busqueda}%,email.ilike.%${busqueda}%`;
            const rucNumber = parseInt(busqueda);
            
            if (!isNaN(rucNumber)) {
                query = query.or(`${busquedaQuery},ruc.eq.${rucNumber}`);
            } else {
                query = query.or(busquedaQuery);
            }
        }
        
        if (activo !== undefined && activo !== null) {
            query = query.eq('activo', activo);
        }

        const { data: clientes, error, count: total } = await query
            .order('razon_social', { ascending: true, nullsFirst: false })
            .range(offset, rangeEnd);

        if (error) throw error;

        const totalItems = total || 0;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            clientes: clientes as Cliente[],
            total: totalItems,
            totalPages: totalPages,
        };
    } catch (error: any) {
        console.error('Error obteniendo clientes con paginación:', error);
        return {
            clientes: [],
            total: 0,
            totalPages: 0,
            error: error.message || 'Error desconocido al cargar clientes'
        };
    }
}

// ===============================
// FETCH CLIENTES ACTIVOS (para selectores)
// ===============================
// * Conservamos esta función simple ya que es útil para selectores sin paginación *
export async function fetchClientesActivos() {
    try {
        let supabase = getSupabaseAdminClient(); 
        
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('activo', true)
            .order('razon_social', { ascending: true, nullsFirst: false });

        if (error) throw error;

        return { success: true, data: data as Cliente[] };
    } catch (error: any) {
        console.error('Error fetching clientes activos:', error);
        return { success: false, error: error.message || 'Error al obtener clientes activos' };
    }
}


// ===============================
// FETCH CLIENTE BY ID
// ===============================
export async function fetchClienteById(id: number) {
    try {
        let supabase = getSupabaseAdminClient(); 
        
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return { success: true, data: data as Cliente };
    } catch (error: any) {
        console.error('Error fetching cliente:', error);
        return { success: false, error: error.message || 'Cliente no encontrado' };
    }
}

// ===============================
// CREATE CLIENTE WITH INVITATION
// ===============================
export async function createClienteWithInvitation(
    // 🚨 Usamos Omit<ClienteCreateInput, 'password'>, asumiendo que 'password' existe en ClienteCreateInput original.
    // Si no existe, solo usa ClienteCreateInput
    clienteData: Omit<ClienteCreateInput, 'password'>
) {
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
        
        // 3. Crear usuario en Auth
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
            email: clienteData.email,
            email_confirm: false,
            user_metadata: {
                role: 'cliente',
                razon_social: clienteData.razon_social,
            },
        });

        if (createError || !userData.user) {
            throw new Error('Error al crear usuario en Auth: ' + createError?.message);
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
        const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(clienteData.email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        });

        if (inviteError) {
             console.warn('Advertencia: Cliente creado, pero falló el envío de la invitación por email:', inviteError);
        }

        revalidatePath('/Panel-Administrativo/clientes');
        return { success: true, data: data as Cliente };
    } catch (error: any) {
        console.error('Create cliente with invitation error:', error);
        return { success: false, error: error.message || 'Error al crear cliente con invitación' };
    }
}

// ===============================
// UPDATE CLIENTE
// ===============================
export async function updateCliente(
    id: number,
    clienteData: ClienteUpdateInput
) {
    try {
        let supabase = getSupabaseAdminClient(); 

        // 1. Validaciones de unicidad (email/RUC) (Mantenemos esta lógica)
        if (clienteData.email) {
            const { data: existingCliente } = await supabase
                .from('clientes')
                .select('id')
                .eq('email', clienteData.email)
                .neq('id', id)
                .maybeSingle();
            if (existingCliente) throw new Error('Ya existe otro cliente con este email');
        }

        // Esta validación de RUC necesita ser corregida para aceptar RUC como null (para borrar)
        if (clienteData.ruc !== undefined) {
             // Solo validamos unicidad si se proporciona un RUC y no es null
             if (clienteData.ruc !== null) {
                const { data: existingRuc } = await supabase
                    .from('clientes')
                    .select('id')
                    .eq('ruc', clienteData.ruc)
                    .neq('id', id)
                    .maybeSingle();
                if (existingRuc) throw new Error('Ya existe otro cliente con este RUC');
             }
        }
        
        // 2. Actualización en tabla clientes (Optimizado para evitar el error 'null' vs 'undefined')
        const updateData: Partial<Cliente> = {
            razon_social: clienteData.razon_social,
            ruc: clienteData.ruc, 
            email: clienteData.email,
            telefono: clienteData.telefono,
            direccion: clienteData.direccion,
            activo: clienteData.activo,
        };
        
        // Eliminar propiedades con valor 'undefined' para que Supabase solo actualice las claves presentes.
        // Las propiedades con 'null' se MANTIENEN para borrar datos en la BD.
        Object.keys(updateData).forEach(key => 
            (updateData as any)[key] === undefined && delete (updateData as any)[key]
        );
        
        const { data, error } = await supabase
            .from('clientes')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // 3. Actualización en Supabase Auth si cambia el email (Mantenemos esta lógica)
        if (clienteData.email) {
            const { data: cliente } = await supabase
                .from('clientes')
                .select('auth_id')
                .eq('id', id)
                .single();
            
            if (cliente?.auth_id) {
                 const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
                     cliente.auth_id,
                     { email: clienteData.email }
                 );
                 if (updateAuthError) {
                     console.warn('Advertencia: Falló la actualización del email en Auth:', updateAuthError);
                 }
            }
        }

        revalidatePath('/Panel-Administrativo/clientes');
        revalidatePath('/Panel-Administrativo/pedidos');
        
        return { success: true, data: data as Cliente };
    } catch (error: any) {
        console.error('Update cliente error:', error);
        return { success: false, error: error.message || 'Error al actualizar cliente' };
    }
}

// ===============================
// DELETE CLIENTE (Soft delete)
// ===============================
// * Mantenemos esta lógica ya que funciona *
export async function deleteCliente(id: number) {
    try {
        let supabase = getSupabaseAdminClient(); 

        // 1. Verificar si el cliente tiene pedidos
        const { data: pedidos, error: pedidosError } = await supabase
            .from('pedidos')
            .select('id')
            .eq('cliente_id', id)
            .limit(1);

        if (pedidosError) throw new Error('Error al verificar pedidos del cliente');

        // 2. Obtener auth_id para el borrado de Auth
        const { data: cliente } = await supabase
            .from('clientes')
            .select('auth_id')
            .eq('id', id)
            .single();

        if (pedidos && pedidos.length > 0) {
            // Soft delete
            const { error } = await supabase
                .from('clientes')
                .update({ activo: false })
                .eq('id', id);
            if (error) throw new Error('Error al desactivar cliente');
        } else {
            // Hard delete
            const { error: deleteDbError } = await supabase
                .from('clientes')
                .delete()
                .eq('id', id);
            if (deleteDbError) throw new Error('Error al eliminar cliente');
            
            // Eliminar de Auth
            if (cliente?.auth_id) {
                const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(cliente.auth_id);
                if (deleteAuthError) console.warn('Advertencia: Falló la eliminación del usuario de Auth:', deleteAuthError);
            }
        }

        revalidatePath('/Panel-Administrativo/clientes');
        revalidatePath('/Panel-Administrativo/pedidos');
        return { success: true, data: undefined };
    } catch (error: any) {
        console.error('Delete cliente error:', error);
        return { success: false, error: error.message || 'Error al eliminar cliente' };
    }
}

// ===============================
// TOGGLE ACTIVO
// ===============================
// * Mantenemos esta lógica ya que funciona *
export async function toggleClienteActivo(id: number) {
    try {
        let supabase = getSupabaseAdminClient(); 

        // Obtener estado actual
        const { data: currentCliente, error: fetchError } = await supabase
            .from('clientes')
            .select('activo')
            .eq('id', id)
            .single();

        if (fetchError) throw new Error('Cliente no encontrado');

        // Cambiar estado
        const { data, error } = await supabase
            .from('clientes')
            .update({ activo: !currentCliente.activo })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/clientes');
        revalidatePath('/Panel-Administrativo/pedidos');
        
        return { success: true, data: data as Cliente };
    } catch (error: any) {
        console.error('Toggle cliente activo error:', error);
        return { success: false, error: error.message || 'Error al cambiar estado del cliente' };
    }
}

// ===============================
// SEARCH CLIENTES
// ===============================
// * Mantenemos esta lógica ya que funciona *
export async function searchClientes(query: string) {
    try {
        let supabase = getSupabaseAdminClient(); 
        
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .or(`razon_social.ilike.%${query}%,email.ilike.%${query}%,ruc.eq.${query}`)
            .order('razon_social', { ascending: true, nullsFirst: false })
            .limit(50);

        if (error) throw error;

        return { success: true, data: data as Cliente[] };
    } catch (error: any) {
        console.error('Search clientes error:', error);
        return { success: false, error: error.message || 'Error al buscar clientes' };
    }
}
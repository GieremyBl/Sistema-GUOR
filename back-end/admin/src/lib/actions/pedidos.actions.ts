'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdminClient } from '@/lib/supabase/admin'; 
import type { 
    CreatePedidoInput, 
    UpdatePedidoInput, 
    FetchPedidosParams,
    PedidoConRelaciones
} from '@/lib/types/pedido.types'; 

/**
 * Obtener pedidos con filtros y paginación
 */
export async function getPedidos(params: FetchPedidosParams = {}) {
    try {
        const supabase = getSupabaseAdminClient();
        const { 
            page = 1, 
            limit = 10, 
            busqueda, 
            estado, 
            prioridad, 
            cliente_id,
            fecha_desde,
            fecha_hasta 
        } = params;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('pedidos')
            .select(`
                *,
                clientes (
                    id, 
                    razon_social, 
                    ruc, 
                    email, 
                    telefono
                )
            `, { count: 'exact' });

        if (estado) query = query.eq('estado', estado);
        if (prioridad) query = query.eq('prioridad', prioridad);
        if (cliente_id) query = query.eq('cliente_id', cliente_id);
        
        if (fecha_desde) query = query.gte('fecha_pedido', fecha_desde);
        if (fecha_hasta) query = query.lte('fecha_pedido', fecha_hasta);

        if (busqueda) {
            query = query.or(`id.eq.${busqueda}`);
        }

        query = query.order('created_at', { ascending: false }).range(from, to);

        const { data: pedidos, error, count } = await query;

        if (error) throw error;

        const totalPages = count ? Math.ceil(count / limit) : 0;

        return { 
            success: true, 
            data: { 
                pedidos: pedidos || [], 
                meta: { total: count || 0, page, limit, totalPages } 
            } 
        };
    } catch (error: any) {
        console.error('Error obteniendo pedidos:', error);
        return { 
            success: false, 
            error: error.message, 
            data: { 
                pedidos: [], 
                meta: { total: 0, page: 1, limit: 10, totalPages: 0 } 
            } 
        };
    }
}

/**
 * Obtener un pedido por ID con todos sus detalles
 */
export async function getPedidoById(id: number) {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes!pedidos_cliente_id_fkey (
          id,
          razon_social,
          ruc,
          email,
          telefono
        ),
        detalles:detalles_pedido!detalles_pedido_pedido_id_fkey (
          id,
          cantidad,
          precio_unitario,
          subtotal,
          talla,
          color,
          notas,
          producto:productos!detalles_pedido_producto_id_fkey (
            id,
            nombre,
            descripcion
          )
        ),
        creador:usuarios!pedidos_created_by_fkey (
          id,
          nombre_completo
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener pedido:', error);
      return {
        success: false,
        error: error.message || 'Error al cargar el pedido',
        data: null,
      };
    }

    return {
      success: true,
      data: data as PedidoConRelaciones,
      error: null,
    };
  } catch (error: any) {
    console.error('Error en getPedidoById:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado',
      data: null,
    };
  }
}

export async function createPedido(input: CreatePedidoInput) {
    try {
        const supabase = getSupabaseAdminClient(); 
        
        const totalCalculado = input.detalles.reduce((acc, item) => {
            return acc + (item.cantidad * item.precio_unitario);
        }, 0);

        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .insert({
                cliente_id: input.cliente_id,
                fecha_entrega: input.fecha_entrega || null,
                prioridad: input.prioridad || 'NORMAL',
                estado: 'PENDIENTE',
                total: totalCalculado,
                created_by: input.created_by || null,
                fecha_pedido: new Date().toISOString(),
            })
            .select()
            .single();

        if (pedidoError) throw new Error(`Error al crear cabecera: ${pedidoError.message}`);

        if (input.detalles.length > 0) {
            const detallesToInsert = input.detalles.map(d => ({
                pedido_id: pedido.id,
                producto_id: d.producto_id,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario,
                subtotal: d.cantidad * d.precio_unitario
            }));

            const { error: detallesError } = await supabase
                .from('detalles_pedido')
                .insert(detallesToInsert);

            if (detallesError) {
                await supabase.from('pedidos').delete().eq('id', pedido.id);
                throw new Error(`Error al crear detalles: ${detallesError.message}`);
            }
        }

        revalidatePath('/Panel-Administrativo/pedidos');
        return { success: true, data: pedido };
    } catch (error: any) {
        console.error('Error creando pedido:', error);
        return { success: false, error: error.message };
    }
}

export async function updatePedido(input: UpdatePedidoInput) {
    try {
        const supabase = getSupabaseAdminClient(); 

        const updateData: any = { updated_at: new Date().toISOString() };

        if (input.cliente_id !== undefined) updateData.cliente_id = input.cliente_id;
        if (input.fecha_entrega !== undefined) updateData.fecha_entrega = input.fecha_entrega;
        if (input.estado !== undefined) updateData.estado = input.estado;
        if (input.prioridad !== undefined) updateData.prioridad = input.prioridad;
        if (input.updated_by !== undefined) updateData.updated_by = input.updated_by;

        const { data: pedido, error } = await supabase
            .from('pedidos')
            .update(updateData)
            .eq('id', input.id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/pedidos');
        return { success: true, data: pedido };
    } catch (error: any) {
        console.error('Error actualizando pedido:', error);
        return { success: false, error: error.message };
    }
}

export async function deletePedido(id: number) { 
    try {
        const supabase = getSupabaseAdminClient(); 

        await supabase.from('detalles_pedido').delete().eq('pedido_id', id);

        const { error } = await supabase.from('pedidos').delete().eq('id', id);

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/pedidos');
        return { success: true };
    } catch (error: any) {
        console.error('Error eliminando pedido:', error);
        return { success: false, error: error.message };
    }
}

export async function getEstadisticasPedidos() {
    try {
        const supabase = getSupabaseAdminClient(); 
        
        const { data, error } = await supabase
            .from('pedidos')
            .select('estado, prioridad, total');

        if (error) throw error;

        const stats = {
            total: data?.length || 0,
            totalFacturado: data?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0,
            porEstado: data?.reduce((acc: any, curr) => {
                acc[curr.estado] = (acc[curr.estado] || 0) + 1;
                return acc;
            }, {}) || {},
            porPrioridad: data?.reduce((acc: any, curr) => {
                acc[curr.prioridad] = (acc[curr.prioridad] || 0) + 1;
                return acc;
            }, {}) || {}
        };

        return { success: true, data: stats };
    } catch (error: any) {
        console.error('Error obteniendo estadísticas:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Obtener todos los pedidos con relaciones completas
 */
export async function getAllPedidos() {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes!pedidos_cliente_id_fkey (
          id,
          razon_social,
          ruc,
          email,
          telefono
        ),
        detalles:detalles_pedido!detalles_pedido_pedido_id_fkey (
          id,
          cantidad,
          precio_unitario,
          subtotal,
          talla,
          color,
          notas,
          producto:productos!detalles_pedido_producto_id_fkey (
            id,
            nombre,
            descripcion
          )
        ),
        creador:usuarios!pedidos_created_by_fkey (
          id,
          nombre_completo
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener pedidos:', error);
      return {
        success: false,
        error: error.message || 'Error al cargar los pedidos',
        data: null,
      };
    }

    return {
      success: true,
      data: data as PedidoConRelaciones[],
      error: null,
    };
  } catch (error: any) {
    console.error('Error en getAllPedidos:', error);
    return {
      success: false,
      error: error.message || 'Error inesperado',
      data: null,
    };
  }
}
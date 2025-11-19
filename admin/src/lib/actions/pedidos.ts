"use server";

import { createClient } from '@supabase/supabase-js';;
import { revalidatePath } from 'next/cache';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_UR!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Variables SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no definidas para el cliente Admin.');
   }
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
// --- Tipos y Definiciones (Basados en tu api.ts) ---
export type EstadoPedido = 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO' | 'ENTREGADO' | 'CANCELADO';
export type PrioridadPedido = 'BAJA' | 'NORMAL' | 'ALTA' | 'URGENTE';

export type CreatePedidoInput = {
  cliente_id: string;
  fecha_entrega?: string;
  prioridad?: PrioridadPedido;
  detalles: Array<{
    producto_id: string;
    cantidad: number;
    precio_unitario: number;
    // El subtotal se puede calcular en backend para mayor seguridad
  }>;
  created_by?: string; // Opcional, idealmente se toma de la sesión actual
};

export type UpdatePedidoInput = {
  id: string; // UUID
  cliente_id?: string;
  fecha_entrega?: string;
  estado?: EstadoPedido;
  prioridad?: PrioridadPedido;
  updated_by?: string;
};

export type FetchPedidosParams = {
  page?: number;
  limit?: number;
  busqueda?: string;
  estado?: EstadoPedido;
  prioridad?: PrioridadPedido;
  cliente_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
};

// --- Server Actions ---

/**
 * Obtener pedidos con filtros y paginación
 */
export async function getPedidos(params: FetchPedidosParams = {}) {
  try {
    let supabase = getSupabaseAdminClient(); 
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

    // Calcular offset para paginación
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(id, razon_social, ruc, email),
        creador:usuarios!created_by(id, nombre_completo),
        detalles:detalle_pedidos(count)
      `, { count: 'exact' });

    // Aplicar Filtros
    if (estado) query = query.eq('estado', estado);
    if (prioridad) query = query.eq('prioridad', prioridad);
    if (cliente_id) query = query.eq('cliente_id', cliente_id);
    
    if (fecha_desde) query = query.gte('fecha_pedido', fecha_desde);
    if (fecha_hasta) query = query.lte('fecha_pedido', fecha_hasta);

    if (busqueda) {
      query = query.ilike('cliente.razon_social', `%${busqueda}%`);
    }

    // Ordenamiento y Paginación
    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data: pedidos, error, count } = await query;

    if (error) throw error;

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return { 
      success: true, 
      data: { 
        pedidos, 
        meta: { total: count, page, limit, totalPages } 
      } 
    };
  } catch (error: any) {
    console.error('Error obteniendo pedidos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener un pedido por ID con todos sus detalles
 */
export async function getPedidoById(id: string) {
  try {
    let supabase = getSupabaseAdminClient(); 

    const { data: pedido, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(*),
        creador:usuarios!created_by(id, nombre_completo, email),
        detalles:detalle_pedidos(
          *,
          producto:productos(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return { success: true, data: pedido };
  } catch (error: any) {
    console.error('Error obteniendo pedido:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Crear un nuevo pedido (Cabecera + Detalles)
 */
export async function createPedido(input: CreatePedidoInput) {
  try {
    let supabase = getSupabaseAdminClient(); 

    // 1. Obtener usuario actual si no viene en el input
    let userId = input.created_by;
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();

      userId = user?.id; 

    }

    // 2. Calcular total del pedido sumando los detalles
    const totalCalculado = input.detalles.reduce((acc, item) => {
      return acc + (item.cantidad * item.precio_unitario);
    }, 0);

    // 3. Insertar Cabecera del Pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert({
        cliente_id: input.cliente_id,
        fecha_entrega: input.fecha_entrega,
        prioridad: input.prioridad || 'NORMAL',
        estado: 'PENDIENTE',
        total: totalCalculado,
        created_by: userId, // Asegúrate que este ID coincida con el tipo de tu columna (UUID o Int)
      })
      .select()
      .single();

    if (pedidoError) throw new Error(`Error al crear cabecera: ${pedidoError.message}`);

    // 4. Preparar y Insertar Detalles
    if (input.detalles.length > 0) {
      const detallesToInsert = input.detalles.map(d => ({
        pedido_id: pedido.id,
        producto_id: d.producto_id,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: d.cantidad * d.precio_unitario
      }));

      const { error: detallesError } = await supabase
        .from('detalle_pedidos')
        .insert(detallesToInsert);

      if (detallesError) {
        // Rollback manual: si fallan los detalles, borramos el pedido para no dejar basura
        await supabase.from('pedidos').delete().eq('id', pedido.id);
        throw new Error(`Error al crear detalles: ${detallesError.message}`);
      }
    }

    revalidatePath('/dashboard/pedidos');
    return { success: true, data: pedido };
  } catch (error: any) {
    console.error('Error creando pedido:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar un pedido existente (Solo cabecera)
 * Nota: Para editar detalles usualmente se requiere una función aparte o lógica más compleja.
 */
export async function updatePedido(input: UpdatePedidoInput) {
  try {
    let supabase = getSupabaseAdminClient(); 

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (input.cliente_id) updateData.cliente_id = input.cliente_id;
    if (input.fecha_entrega) updateData.fecha_entrega = input.fecha_entrega;
    if (input.estado) updateData.estado = input.estado;
    if (input.prioridad) updateData.prioridad = input.prioridad;
    if (input.updated_by) updateData.updated_by = input.updated_by;

    const { data: pedido, error } = await supabase
      .from('pedidos')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/pedidos');
    revalidatePath(`/dashboard/pedidos/${input.id}`); // Revalidar la vista de detalle también
    return { success: true, data: pedido };
  } catch (error: any) {
    console.error('Error actualizando pedido:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar un pedido
 */
export async function deletePedido(id: string) {
  try {
    let supabase = getSupabaseAdminClient(); 

    // Asumiendo que tienes "On Delete Cascade" configurado en la base de datos
    // para los detalles. Si no, primero debes borrar los detalles.
    
    const { error } = await supabase
      .from('pedidos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/dashboard/pedidos');
    return { success: true };
  } catch (error: any) {
    console.error('Error eliminando pedido:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener estadísticas rápidas (Dashboard)
 */
export async function getEstadisticasPedidos() {
  try {
    let supabase = getSupabaseAdminClient(); 
    
    // Aquí haremos una consulta ligera solo de estados y totales
    const { data, error } = await supabase
      .from('pedidos')
      .select('estado, prioridad, total');

    if (error) throw error;

    const stats = {
      total: data.length,
      totalFacturado: data.reduce((acc, curr) => acc + (curr.total || 0), 0),
      porEstado: data.reduce((acc: any, curr) => {
        acc[curr.estado] = (acc[curr.estado] || 0) + 1;
        return acc;
      }, {}),
      porPrioridad: data.reduce((acc: any, curr) => {
        acc[curr.prioridad] = (acc[curr.prioridad] || 0) + 1;
        return acc;
      }, {})
    };

    return { success: true, data: stats };
  } catch (error: any) {
    console.error('Error obteniendo estadísticas:', error);
    return { success: false, error: error.message };
  }
}
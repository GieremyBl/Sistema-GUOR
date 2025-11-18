import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Tipos para los ENUMs
type EstadoPedido = 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO' | 'ENTREGADO' | 'CANCELADO';
type PrioridadPedido = 'BAJA' | 'NORMAL' | 'ALTA' | 'URGENTE';

/**
 * GET /api/pedidos
 * Listar pedidos con filtros y paginación
 */
export const getPedidos = async (req: Request, res: Response) => {
  try {
    const { 
      busqueda, 
      estado, 
      cliente_id,
      fecha_desde,
      fecha_hasta,
      prioridad,
      page = '1', 
      limit = '10' 
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    // Query base
    let query = supabaseAdmin
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(id, ruc, razon_social, email, telefono, direccion),
        creador:usuarios!pedidos_created_by_fkey(id, nombre_completo, email)
      `, { count: 'exact' });

    // Filtros
    if (busqueda) {
      query = query.or(`id.eq.${busqueda},cliente_id.eq.${busqueda}`);
    }
    if (estado) {
      query = query.eq('estado', estado);
    }
    if (cliente_id) {
      query = query.eq('cliente_id', cliente_id);
    }
    if (prioridad) {
      query = query.eq('prioridad', prioridad);
    }
    if (fecha_desde) {
      query = query.gte('fecha_pedido', fecha_desde);
    }
    if (fecha_hasta) {
      query = query.lte('fecha_pedido', fecha_hasta);
    }

    // Paginación y orden
    query = query
      .range(offset, offset + limitNum - 1)
      .order('fecha_pedido', { ascending: false });

    const { data: pedidos, error, count } = await query;

    if (error) {
      console.error('Error obteniendo pedidos:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      pedidos: pedidos || [],
      total: count || 0,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil((count || 0) / limitNum),
    });
  } catch (error: any) {
    console.error('Error en getPedidos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * GET /api/pedidos/:id
 * Obtener un pedido con sus detalles
 */
export const getPedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Obtener pedido
    const { data: pedido, error: pedidoError } = await supabaseAdmin
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(id, ruc, razon_social, email, telefono, direccion),
        creador:usuarios!pedidos_created_by_fkey(id, nombre_completo, email)
      `)
      .eq('id', id)
      .single();

    if (pedidoError || !pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Obtener detalles
    const { data: detalles, error: detallesError } = await supabaseAdmin
      .from('detalles_pedido')
      .select(`
        *,
        producto:productos(id, nombre, descripcion, precio, imagen)
      `)
      .eq('pedido_id', id);

    if (detallesError) {
      console.error('Error obteniendo detalles:', detallesError);
    }

    return res.json({ 
      pedido: {
        ...pedido,
        detalles: detalles || []
      }
    });
  } catch (error: any) {
    console.error('Error en getPedido:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * POST /api/pedidos
 * Crear nuevo pedido
 */
export const createPedido = async (req: Request, res: Response) => {
  try {
    const {
      cliente_id,
      fecha_entrega,
      prioridad,
      detalles,
      created_by
    } = req.body;

    // Validaciones
    if (!cliente_id || !detalles || detalles.length === 0) {
      return res.status(400).json({
        error: 'Cliente y detalles del pedido son requeridos'
      });
    }

    // Validar que el estado sea válido (siempre será PENDIENTE al crear)
    const estadoInicial: EstadoPedido = 'PENDIENTE';
    
    // Validar prioridad
    const prioridadValida: PrioridadPedido = prioridad || 'NORMAL';
    const prioridadesPermitidas: PrioridadPedido[] = ['BAJA', 'NORMAL', 'ALTA', 'URGENTE'];
    
    if (!prioridadesPermitidas.includes(prioridadValida)) {
      return res.status(400).json({
        error: `Prioridad inválida. Valores permitidos: ${prioridadesPermitidas.join(', ')}`
      });
    }

    // Calcular totales
    let subtotal = 0;
    for (const detalle of detalles) {
      if (!detalle.producto_id || !detalle.cantidad || !detalle.precio_unitario) {
        return res.status(400).json({
          error: 'Cada detalle debe tener producto_id, cantidad y precio_unitario'
        });
      }
      const itemSubtotal = detalle.cantidad * detalle.precio_unitario;
      subtotal += itemSubtotal;
    }

    const total = subtotal;

    // Crear pedido
    const { data: pedido, error: pedidoError } = await supabaseAdmin
      .from('pedidos')
      .insert({
        cliente_id,
        fecha_entrega,
        estado: estadoInicial,
        prioridad: prioridadValida,
        total,
        created_by: created_by || null,
        fecha_pedido: new Date().toISOString()
      })
      .select()
      .single();

    if (pedidoError) {
      console.error('Error creando pedido:', pedidoError);
      return res.status(400).json({ error: pedidoError.message });
    }

    // Crear detalles
    const detallesInsert = detalles.map((detalle: any) => ({
      pedido_id: pedido.id,
      producto_id: detalle.producto_id,
      cantidad: detalle.cantidad,
      precio_unitario: detalle.precio_unitario,
      subtotal: detalle.cantidad * detalle.precio_unitario
    }));

    const { error: detallesError } = await supabaseAdmin
      .from('detalles_pedido')
      .insert(detallesInsert);

    if (detallesError) {
      console.error('Error creando detalles:', detallesError);
      // Rollback: eliminar pedido
      await supabaseAdmin.from('pedidos').delete().eq('id', pedido.id);
      return res.status(400).json({ error: detallesError.message });
    }

    return res.status(201).json({
      message: 'Pedido creado exitosamente',
      pedido
    });
  } catch (error: any) {
    console.error('Error en createPedido:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * PATCH /api/pedidos/:id
 * Actualizar pedido
 */
export const updatePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      cliente_id,
      fecha_entrega,
      estado,
      prioridad,
      updated_by
    } = req.body;

    const updateData: any = { 
      updated_by: updated_by || null 
    };

    // Validar estado si se proporciona
    if (estado !== undefined) {
      const estadosPermitidos: EstadoPedido[] = [
        'PENDIENTE', 'EN_PROCESO', 'TERMINADO', 'ENTREGADO', 'CANCELADO'
      ];
      if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({
          error: `Estado inválido. Valores permitidos: ${estadosPermitidos.join(', ')}`
        });
      }
      updateData.estado = estado;
    }

    // Validar prioridad si se proporciona
    if (prioridad !== undefined) {
      const prioridadesPermitidas: PrioridadPedido[] = ['BAJA', 'NORMAL', 'ALTA', 'URGENTE'];
      if (!prioridadesPermitidas.includes(prioridad)) {
        return res.status(400).json({
          error: `Prioridad inválida. Valores permitidos: ${prioridadesPermitidas.join(', ')}`
        });
      }
      updateData.prioridad = prioridad;
    }

    if (cliente_id !== undefined) updateData.cliente_id = cliente_id;
    if (fecha_entrega !== undefined) updateData.fecha_entrega = fecha_entrega;

    const { data: pedido, error } = await supabaseAdmin
      .from('pedidos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error actualizando pedido:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    return res.json({
      message: 'Pedido actualizado exitosamente',
      pedido
    });
  } catch (error: any) {
    console.error('Error en updatePedido:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * DELETE /api/pedidos/:id
 * Eliminar pedido (solo admin)
 */
export const deletePedido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar que el pedido existe
    const { data: pedidoExistente } = await supabaseAdmin
      .from('pedidos')
      .select('id')
      .eq('id', id)
      .single();

    if (!pedidoExistente) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Los detalles se eliminan automáticamente por CASCADE
    const { error } = await supabaseAdmin
      .from('pedidos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando pedido:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.json({
      message: 'Pedido eliminado correctamente',
      id
    });
  } catch (error: any) {
    console.error('Error en deletePedido:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * GET /api/pedidos/estadisticas
 * Obtener estadísticas de pedidos
 */
export const getEstadisticas = async (req: Request, res: Response) => {
  try {
    // Total de pedidos
    const { count: totalPedidos } = await supabaseAdmin
      .from('pedidos')
      .select('*', { count: 'exact', head: true });

    // Por estado
    const { data: porEstado } = await supabaseAdmin
      .from('pedidos')
      .select('estado');

    // Por prioridad
    const { data: porPrioridad } = await supabaseAdmin
      .from('pedidos')
      .select('prioridad');

    // Total facturado
    const { data: totales } = await supabaseAdmin
      .from('pedidos')
      .select('total');

    const totalFacturado = totales?.reduce((sum, p) => sum + parseFloat(String(p.total)), 0) || 0;

    // Agrupar datos por estado
    const estadosCount: Record<EstadoPedido, number> = {
      'PENDIENTE': 0,
      'EN_PROCESO': 0,
      'TERMINADO': 0,
      'ENTREGADO': 0,
      'CANCELADO': 0
    };
    
    porEstado?.forEach((p: any) => {
      if (p.estado in estadosCount) {
        estadosCount[p.estado as EstadoPedido]++;
      }
    });

    // Agrupar datos por prioridad
    const prioridadesCount: Record<PrioridadPedido, number> = {
      'BAJA': 0,
      'NORMAL': 0,
      'ALTA': 0,
      'URGENTE': 0
    };
    
    porPrioridad?.forEach((p: any) => {
      if (p.prioridad in prioridadesCount) {
        prioridadesCount[p.prioridad as PrioridadPedido]++;
      }
    });

    const estadisticas = {
      total: totalPedidos || 0,
      totalFacturado: parseFloat(totalFacturado.toFixed(2)),
      porEstado: estadosCount,
      porPrioridad: prioridadesCount
    };

    return res.json(estadisticas);
  } catch (error: any) {
    console.error('Error en getEstadisticas:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

// El estado del pedido según tu tabla es 'Estado'
type EstadoPedido = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO'; // Ejemplo de estados

const getSupabaseClient = () => {
    return createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
};

/**
 * GET /api/pedidos
 * Obtener todos los pedidos
 */
export const getPedidos = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { data: pedidos, error } = await supabase
            .from('pedidos')
            .select(`
                *,
                cliente:clientes(nombre_completo, telefono)
            `) // Ajusta 'clientes' al nombre de tu tabla de clientes
            .order('fecha_pedido', { ascending: false });

        if (error) {
            console.error('Error obteniendo pedidos:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
        return res.json({ success: true, data: pedidos || [] });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/pedidos/historial
 * Obtener historial de pedidos (generalmente todos o un subconjunto filtrado)
 */
export const getHistorial = async (req: Request, res: Response) => {
    // La lógica es similar a getPedidos, pero puede incluir más filtros o paginación
    try {
        let supabase = getSupabaseClient();

        const { data: historial, error } = await supabase
            .from('pedidos')
            .select('*')
            .order('created_at', { ascending: false }); // Usando created_at o fecha_pedido

        if (error) {
            console.error('Error obteniendo historial:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        return res.json({ success: true, data: historial || [] });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/pedidos/estadisticas
 * Obtener métricas clave de pedidos
 */
export const getEstadisticas = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { data, error } = await supabase.rpc('get_pedido_stats');

        if (error) {
            console.error('Error obteniendo estadísticas:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        return res.json({ 
            success: true, 
            data: data || { totalPedidos: 0, totalVentas: 0 } 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/pedidos/:id
 * Obtener un pedido por ID
 */
export const getPedido = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { id } = req.params;
        const { data: pedido, error } = await supabase
            .from('pedidos')
            .select(`
                *,
                cliente:clientes(nombre_completo, telefono),
                detalles_pedido(*, producto:productos(nombre, precio))
            `) // Relación con detalles_pedido y productos
            .eq('id', id)
            .single();

        if (error || !pedido) {
            return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
        }
        return res.json({ success: true, data: pedido });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * POST /api/pedidos
 * Crear un nuevo pedido
 */
export const createPedido = async (req: Request, res: Response) => {
    // NOTA: La creación de un pedido (cabecera + detalles + actualización de stock) 
    // ¡Debe hacerse idealmente con una FUNCIÓN RPC para garantizar la atomicidad (transacciones) en Supabase!
    try {
        const { 
            cliente_id, fecha_entrega, detalles, notas, direccion_envio 
        } = req.body;

        // Validaciones básicas (omitiendo por brevedad, pero cruciales)
        let supabase = getSupabaseClient();

        const { data: nuevoPedido, error } = await supabase.rpc('create_full_order', {
            // Parámetros de la función RPC que maneja la transacción
            p_cliente_id: cliente_id,
            p_fecha_entrega: fecha_entrega,
            p_detalles: detalles, // Array de { producto_id, cantidad, precio_unitario }
            p_notas: notas,
            p_direccion_envio: direccion_envio,
        });
        
        if (error) {
            console.error('Error creando pedido con RPC:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.status(201).json({ success: true, message: 'Pedido creado exitosamente', data: nuevoPedido });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * PATCH /api/pedidos/:id
 * Actualizar un pedido (ej. cambiar estado)
 */
export const updatePedido = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { id } = req.params;
        const { estado, fecha_entrega, prioridad } = req.body;
        
        const updateData: any = {};
        if (estado) updateData.estado = estado; // Asume validación de estado
        if (fecha_entrega) updateData.fecha_entrega = fecha_entrega;
        if (prioridad) updateData.prioridad = prioridad;
        updateData.updated_at = new Date().toISOString();

        if (Object.keys(updateData).length === 1 && updateData.updated_at) {
            return res.status(400).json({ success: false, error: 'Debe proporcionar al menos un campo para actualizar' });
        }

        const { data: pedido, error } = await supabase
            .from('pedidos')
            .update(updateData)
            .eq('id', id)
            .select('*')
            .single();

        if (error || !pedido) {
            return res.status(404).json({ success: false, error: 'Pedido no encontrado o error de actualización' });
        }

        return res.json({ success: true, message: 'Pedido actualizado exitosamente', data: pedido });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * DELETE /api/pedidos/:id
 * Eliminar un pedido
 */
export const deletePedido = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { id } = req.params;
        
        // La eliminación de pedidos y sus detalles también debería ser transaccional con RPC
        const { error } = await supabase.rpc('delete_full_order', { p_pedido_id: id }); // Suponiendo que tienes esta RPC

        if (error) {
            console.error('Error eliminando pedido:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.json({ success: true, message: 'Pedido y detalles eliminados exitosamente' });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};
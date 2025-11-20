import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

type EstadoPedido = 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO' | 'ENTREGADO' | 'CANCELADO';
type PrioridadPedido = 'BAJA' | 'NORMAL' | 'ALTA' | 'URGENTE';

const getSupabaseClient = () => {
    return createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
};

/**
 * GET /api/pedidos
 * Obtener todos los pedidos con filtros y paginación
 */
export const getPedidos = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        
        // Obtener parámetros de query
        const { 
            page = 1, 
            limit = 10, 
            busqueda, 
            estado, 
            prioridad, 
            cliente_id,
            fecha_desde,
            fecha_hasta 
        } = req.query;

        // Calcular offset para paginación
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const from = (pageNum - 1) * limitNum;
        const to = from + limitNum - 1;

        // ✅ CORRECCIÓN: Usar razon_social en lugar de nombre_completo
        let query = supabase
            .from('pedidos')
            .select(`
                *,
                cliente:clientes(id, razon_social, ruc, email, telefono)
            `, { count: 'exact' });

        // Aplicar filtros
        if (estado) query = query.eq('estado', estado);
        if (prioridad) query = query.eq('prioridad', prioridad);
        if (cliente_id) query = query.eq('cliente_id', cliente_id);
        
        if (fecha_desde) query = query.gte('fecha_pedido', fecha_desde);
        if (fecha_hasta) query = query.lte('fecha_pedido', fecha_hasta);

        // Búsqueda por RUC o razón social
        if (busqueda) {
            // Para búsqueda en relaciones, necesitamos hacer una query diferente
            const { data: clientes } = await supabase
                .from('clientes')
                .select('id')
                .or(`razon_social.ilike.%${busqueda}%,ruc.ilike.%${busqueda}%`);
            
            if (clientes && clientes.length > 0) {
                const clienteIds = clientes.map(c => c.id);
                query = query.in('cliente_id', clienteIds);
            } else {
                // Si no se encuentra ningún cliente, devolver lista vacía
                return res.json({ 
                    pedidos: [], 
                    total: 0, 
                    page: pageNum, 
                    limit: limitNum, 
                    totalPages: 0 
                });
            }
        }

        // Ordenamiento y paginación
        query = query.order('created_at', { ascending: false }).range(from, to);

        const { data: pedidos, error, count } = await query;

        if (error) {
            console.error('Error obteniendo pedidos:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        const totalPages = count ? Math.ceil(count / limitNum) : 0;

        return res.json({ 
            pedidos: pedidos || [], 
            total: count || 0, 
            page: pageNum, 
            limit: limitNum, 
            totalPages 
        });
    } catch (error: any) {
        console.error('Error en getPedidos:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/pedidos/historial
 * Obtener historial de pedidos
 */
export const getHistorial = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        // ✅ CORRECCIÓN: Usar razon_social
        const { data: historial, error } = await supabase
            .from('pedidos')
            .select(`
                *,
                cliente:clientes(id, razon_social, ruc, email)
            `)
            .order('created_at', { ascending: false });

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

        // Si tienes una función RPC, úsala. Si no, hacemos la query directa
        const { data: pedidos, error } = await supabase
            .from('pedidos')
            .select('estado, prioridad, total');

        if (error) {
            console.error('Error obteniendo estadísticas:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        // Calcular estadísticas
        const stats = {
            total: pedidos?.length || 0,
            totalFacturado: pedidos?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0,
            porEstado: pedidos?.reduce((acc: any, curr) => {
                acc[curr.estado] = (acc[curr.estado] || 0) + 1;
                return acc;
            }, {}) || {},
            porPrioridad: pedidos?.reduce((acc: any, curr) => {
                acc[curr.prioridad] = (acc[curr.prioridad] || 0) + 1;
                return acc;
            }, {}) || {}
        };

        return res.json({ 
            success: true, 
            data: stats
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
        
        // ✅ CORRECCIÓN: Usar razon_social y ajustar nombre de tabla de detalles
        const { data: pedido, error } = await supabase
            .from('pedidos')
            .select(`
                *,
                cliente:clientes(id, razon_social, ruc, email, telefono, direccion),
                detalles:detalle_pedidos(
                    *,
                    producto:productos(id, nombre, precio, descripcion)
                )
            `)
            .eq('id', id)
            .single();

        if (error || !pedido) {
            return res.status(404).json({ success: false, error: 'Pedido no encontrado' });
        }
        
        return res.json({ success: true, pedido });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * POST /api/pedidos
 * Crear un nuevo pedido
 */
export const createPedido = async (req: Request, res: Response) => {
    try {
        const { 
            cliente_id, 
            fecha_entrega, 
            prioridad = 'NORMAL',
            detalles 
        } = req.body;

        // Validaciones básicas
        if (!cliente_id || !detalles || detalles.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'cliente_id y detalles son requeridos' 
            });
        }

        let supabase = getSupabaseClient();

        // Calcular total
        const total = detalles.reduce((acc: number, item: any) => {
            return acc + (item.cantidad * item.precio_unitario);
        }, 0);

        // Insertar cabecera del pedido
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .insert({
                cliente_id,
                fecha_entrega,
                prioridad,
                estado: 'PENDIENTE',
                total,
                fecha_pedido: new Date().toISOString()
            })
            .select()
            .single();

        if (pedidoError) {
            console.error('Error creando pedido:', pedidoError);
            return res.status(400).json({ success: false, error: pedidoError.message });
        }

        // Insertar detalles
        const detallesToInsert = detalles.map((d: any) => ({
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
            // Rollback: eliminar pedido si fallan los detalles
            await supabase.from('pedidos').delete().eq('id', pedido.id);
            console.error('Error creando detalles:', detallesError);
            return res.status(400).json({ success: false, error: detallesError.message });
        }

        return res.status(201).json({ 
            success: true, 
            message: 'Pedido creado exitosamente', 
            pedido 
        });
    } catch (error: any) {
        console.error('Error en createPedido:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * PATCH /api/pedidos/:id
 * Actualizar un pedido
 */
export const updatePedido = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { id } = req.params;
        const { estado, fecha_entrega, prioridad } = req.body;
        
        const updateData: any = {};
        if (estado) updateData.estado = estado;
        if (fecha_entrega) updateData.fecha_entrega = fecha_entrega;
        if (prioridad) updateData.prioridad = prioridad;
        updateData.updated_at = new Date().toISOString();

        if (Object.keys(updateData).length === 1 && updateData.updated_at) {
            return res.status(400).json({ 
                success: false, 
                error: 'Debe proporcionar al menos un campo para actualizar' 
            });
        }

        const { data: pedido, error } = await supabase
            .from('pedidos')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !pedido) {
            return res.status(404).json({ 
                success: false, 
                error: 'Pedido no encontrado o error de actualización' 
            });
        }

        return res.json({ 
            success: true, 
            message: 'Pedido actualizado exitosamente', 
            pedido 
        });
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
        
        // Primero eliminar detalles (si no tienes CASCADE configurado)
        await supabase.from('detalle_pedidos').delete().eq('pedido_id', id);
        
        // Luego eliminar el pedido
        const { error } = await supabase
            .from('pedidos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error eliminando pedido:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.json({ 
            success: true, 
            message: 'Pedido eliminado exitosamente',
            id 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};
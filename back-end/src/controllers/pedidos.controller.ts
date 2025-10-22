import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const pedidosController = {
  async getAll(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('ordenes')
      .select(`
        *,
        usuario:usuarios(id, nombre, email),
        detalles:detalle_orden(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  },

  async create(req: Request, res: Response) {
    const { items, ...pedidoData } = req.body;

    // Iniciar transacción
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .insert([pedidoData])
      .select()
      .single();

    if (pedidoError) {
      return res.status(400).json({ error: pedidoError.message });
    }

    // Agregar items del pedido
    const itemsConPedidoId = items.map((item: any) => ({
      ...item,
      pedido_id: pedido.id,
      subtotal: item.cantidad * item.precio_unitario
    }));

    const { error: itemsError } = await supabase
      .from('items_pedido')
      .insert(itemsConPedidoId);

    if (itemsError) {
      // Si hay error, eliminar el pedido creado
      await supabase.from('pedidos').delete().eq('id', pedido.id);
      return res.status(400).json({ error: itemsError.message });
    }

    return res.status(201).json(pedido);
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        items:items_pedido(
          id,
          variante_id,
          cantidad,
          precio_unitario,
          subtotal
        )
      `)
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Pedido no encontrado' });
    return res.json(data);
  },

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { estado } = req.body;

    const { data, error } = await supabase
      .from('ordenes')
      .update({ estado })
      .eq('id', id)
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data[0]);
  }
};
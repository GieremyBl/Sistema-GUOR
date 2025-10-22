import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const productosController = {
  async getAll(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('productos')
      .select(`
        *,
        categoria:categorias(id, nombre)
      `)
      .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  },

  async create(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('productos')
      .insert([req.body])
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data[0]);
  },

  async updateStock(req: Request, res: Response) {
    const { id } = req.params;
    const { cantidad, tipo_movimiento } = req.body;

    const { data: producto, error: selectError } = await supabase
      .from('productos')
      .select('stock')
      .eq('id', id)
      .single();

    if (selectError) return res.status(400).json({ error: selectError.message });

    const nuevoStock = tipo_movimiento === 'ENTRADA' 
      ? producto.stock + cantidad 
      : producto.stock - cantidad;

    const { data, error } = await supabase
      .from('productos')
      .update({ stock: nuevoStock })
      .eq('id', id)
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data[0]);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    // Primero verificamos si el producto existe
    const { data: producto, error: selectError } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (selectError) {
      return res.status(404).json({ 
        error: 'Producto no encontrado',
        details: selectError.message 
      });
    }

    // Procedemos a eliminar el producto
    const { error: deleteError } = await supabase
      .from('productos')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      return res.status(400).json({ 
        error: 'Error al eliminar el producto',
        details: deleteError.message 
      });
    }

    return res.status(204).send();
  }
};
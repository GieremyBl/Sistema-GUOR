import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const inventarioController = {
  async getAll(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('inventario')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  },

  async create(req: Request, res: Response) {
    const { 
      nombre, 
      tipo, 
      unidad_medida, 
      stock_actual, 
      stock_minimo, 
      activo 
    } = req.body;

    const { data, error } = await supabase
      .from('inventario')
      .insert([{
        nombre,
        tipo,
        unidad_medida,
        stock_actual,
        stock_minimo,
        activo: activo ?? true
      }])
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data[0]);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      nombre, 
      tipo, 
      unidad_medida, 
      stock_actual, 
      stock_minimo, 
      activo 
    } = req.body;

    const { data, error } = await supabase
      .from('inventario')
      .update({
        nombre,
        tipo,
        unidad_medida,
        stock_actual,
        stock_minimo,
        activo
      })
      .eq('id', id)
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data[0]);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { error } = await supabase
      .from('inventario')
      .delete()
      .eq('id', id);
    
    if (error) return res.status(400).json({ error: error.message });
    return res.status(204).send();
  },

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('inventario')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.json(data);
  },

  async updateStock(req: Request, res: Response) {
    const { id } = req.params;
    const { cantidad, tipo_movimiento } = req.body;

    const { data: inventario, error: selectError } = await supabase
      .from('inventario')
      .select('stock_actual')
      .eq('id', id)
      .single();

    if (selectError) return res.status(404).json({ error: 'Producto no encontrado' });

    const nuevoStock = tipo_movimiento === 'ENTRADA' 
      ? inventario.stock_actual + cantidad 
      : inventario.stock_actual - cantidad;

    if (nuevoStock < 0) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    const { data, error } = await supabase
      .from('inventario')
      .update({ stock_actual: nuevoStock })
      .eq('id', id)
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data[0]);
  }
};
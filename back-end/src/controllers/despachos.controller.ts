import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const despachosController = {
  async getAll(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('despachos')
      .select(`
        *,
        orden:ordenes(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  },

  async create(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('despachos')
      .insert([req.body])
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data[0]);
  },

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { estado_despacho } = req.body;

    const { data, error } = await supabase
      .from('despachos')
      .update({ estado_despacho })
      .eq('id', id)
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data[0]);
  }
};
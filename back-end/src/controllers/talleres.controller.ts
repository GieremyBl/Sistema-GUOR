import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const talleresController = {
  async getAll(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('talleres_externos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  },

  async create(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('talleres_externos')
      .insert([req.body])
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data[0]);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('talleres_externos')
      .update(req.body)
      .eq('id', id)
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data[0]);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { error } = await supabase
      .from('talleres_externos')
      .delete()
      .eq('id', id);
    
    if (error) return res.status(400).json({ error: error.message });
    return res.status(204).send();
  }
};
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const usuariosController = {
  async getAll(req: Request, res: Response) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  },

  async create(req: Request, res: Response) {
    const { email, contraseña, ...resto } = req.body;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: contraseña
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ ...resto, id: authData.user?.id }])
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json(data[0]);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('usuarios')
      .update(req.body)
      .eq('id', id)
      .select();
    
    if (error) return res.status(400).json({ error: error.message });
    return res.json(data[0]);
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);
    
    if (error) return res.status(400).json({ error: error.message });
    return res.status(204).send();
  }
};
import { supabase } from '@/lib/supabase';
import { Categoria } from '@/types/database';

export class CategoriasService {
  static async obtenerCategorias(): Promise<Categoria[]> {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      return [];
    }
  }

  static async obtenerCategoriaPorId(id: number): Promise<Categoria | null> {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      return null;
    }
  }
}
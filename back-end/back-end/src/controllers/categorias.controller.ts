import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const getSupabaseClient = () => {
    return createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
};
/**
 * GET /api/categorias
 * Listar todas las categorías (activas o todas)
 */
export const getCategorias = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        // Se podría añadir un filtro para mostrar solo activas
        const { data: categorias,error } = await supabase
            .from('categorias')
            .select('id, nombre, descripcion, activo, created_at, updated_at')
            .order('nombre', { ascending: true });
    
        if (error) {
            console.error('Error obteniendo categorías:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
        return res.json({ success: true, data: categorias || [] });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/categorias/:id
 * Obtener una categoría por ID
 */
export const getCategoria = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { id } = req.params;
        const { data: categoria, error } = await supabase
            .from('categorias')
            .select('id, nombre, descripcion, activo, created_at, updated_at')
            .eq('id', id)
            .single();

        if (error || !categoria) {
            return res.status(404).json({ success: false, error: 'Categoría no encontrada' });
        }
        return res.json({ success: true, data: categoria });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * POST /api/categorias
 * Crear nueva categoría
 */
export const createCategoria = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { nombre, descripcion } = req.body;

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ success: false, error: 'El nombre es requerido' });
        }

        const { data: categoria, error } = await supabase
            .from('categorias')
            .insert({ 
                nombre: nombre.trim(), 
                descripcion: descripcion || null, 
                activo: true // Por defecto, es true según tu tabla
            })
            .select('*')
            .single();

        if (error) {
            console.error('Error creando categoría:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.status(201).json({ 
            success: true, 
            message: 'Categoría creada exitosamente', 
            data: categoria 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * PATCH /api/categorias/:id
 * Actualizar categoría
 */
export const updateCategoria = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        
        const { id } = req.params;
        const { nombre, descripcion, activo } = req.body;
        
        const updateData: any = {};
        if (nombre !== undefined) updateData.nombre = nombre.trim();
        if (descripcion !== undefined) updateData.descripcion = descripcion || null;
        if (activo !== undefined) updateData.activo = activo;
        updateData.updated_at = new Date().toISOString();

        if (Object.keys(updateData).length === 1 && updateData.updated_at) { // Solo actualizando updated_at
            return res.status(400).json({ success: false, error: 'Debe proporcionar al menos un campo para actualizar' });
        }

        const { data: categoria, error } = await supabase
            .from('categorias')
            .update(updateData)
            .eq('id', id)
            .select('*')
            .single();

        if (error || !categoria) {
            return res.status(404).json({ success: false, error: 'Categoría no encontrada o error de actualización' });
        }

        return res.json({ 
            success: true, 
            message: 'Categoría actualizada exitosamente', 
            data: categoria 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * DELETE /api/categorias/:id
 * Eliminar categoría (con validación de productos)
 */
export const deleteCategoria = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        const { id } = req.params;

        // 1. Verificar si hay productos asociados (usando tu tabla productos)
        const { data: productosAsociados } = await supabase
            .from('productos')
            .select('id')
            .eq('categoria_id', id)
            .limit(1);

        if (productosAsociados && productosAsociados.length > 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'No se puede eliminar la categoría porque tiene productos asociados' 
            });
        }

        // 2. Eliminar la categoría
        const { error } = await supabase
            .from('categorias')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error eliminando categoría:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.json({ success: true, message: 'Categoría eliminada exitosamente' });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};
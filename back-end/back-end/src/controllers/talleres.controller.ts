import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

type EstadoTaller = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
type EspecialidadTaller = 'CORTE' | 'CONFECCION' | 'BORDADO' | 'ESTAMPADO' | 'COSTURA' | 'ACABADOS' | 'OTRO';

const getSupabaseClient = () => {
    return createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
};

/**
 * GET /api/talleres
 * Obtener todos los talleres con filtros y paginación
 */
export const getTalleres = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        
        const { 
            page = 1, 
            limit = 10, 
            busqueda, 
            estado,
            especialidad
        } = req.query;

        // Calcular offset para paginación
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const from = (pageNum - 1) * limitNum;
        const to = from + limitNum - 1;

        let query = supabase
            .from('talleres')
            .select('*', { count: 'exact' });

        // Aplicar filtros
        if (estado) {
            query = query.eq('estado', estado);
        }

        if (especialidad) {
            query = query.eq('especialidad', especialidad);
        }

        // Búsqueda por nombre, RUC o contacto
        if (busqueda) {
            query = query.or(`nombre.ilike.%${busqueda}%,ruc.ilike.%${busqueda}%,contacto.ilike.%${busqueda}%`);
        }

        // Ordenamiento y paginación
        query = query.order('created_at', { ascending: false }).range(from, to);

        const { data: talleres, error, count } = await query;

        if (error) {
            console.error('Error obteniendo talleres:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        const totalPages = count ? Math.ceil(count / limitNum) : 0;

        return res.json({ 
            talleres: talleres || [], 
            total: count || 0, 
            page: pageNum, 
            limit: limitNum, 
            totalPages 
        });
    } catch (error: any) {
        console.error('Error en getTalleres:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/talleres/:id
 * Obtener un taller por ID
 */
export const getTaller = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { id } = req.params;
        
        const { data: taller, error } = await supabase
            .from('talleres')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !taller) {
            return res.status(404).json({ success: false, error: 'Taller no encontrado' });
        }
        
        return res.json({ success: true, taller });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * POST /api/talleres
 * Crear un nuevo taller
 */
export const createTaller = async (req: Request, res: Response) => {
    try {
        const { 
            nombre,
            ruc,
            contacto,
            telefono,
            email,
            direccion,
            especialidad,
            estado = 'ACTIVO'
        } = req.body;

        // Validaciones básicas
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                error: 'El nombre del taller es requerido' 
            });
        }

        let supabase = getSupabaseClient();

        // Verificar si el RUC ya existe (si se proporciona)
        if (ruc) {
            const { data: existingTaller } = await supabase
                .from('talleres')
                .select('id')
                .eq('ruc', ruc)
                .single();

            if (existingTaller) {
                return res.status(400).json({
                    success: false,
                    error: 'Ya existe un taller con ese RUC'
                });
            }
        }

        // Insertar taller
        const { data: taller, error } = await supabase
            .from('talleres')
            .insert({
                nombre: nombre.trim(),
                ruc: ruc || null,
                contacto: contacto || null,
                telefono: telefono || null,
                email: email || null,
                direccion: direccion || null,
                especialidad: especialidad || null,
                estado: estado,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Error creando taller:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.status(201).json({ 
            success: true, 
            message: 'Taller creado exitosamente', 
            taller 
        });
    } catch (error: any) {
        console.error('Error en createTaller:', error);
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * PATCH /api/talleres/:id
 * Actualizar un taller
 */
export const updateTaller = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { id } = req.params;
        const { 
            nombre,
            ruc,
            contacto,
            telefono,
            email,
            direccion,
            especialidad,
            estado
        } = req.body;
        
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (nombre !== undefined) updateData.nombre = nombre.trim();
        if (ruc !== undefined) updateData.ruc = ruc || null;
        if (contacto !== undefined) updateData.contacto = contacto || null;
        if (telefono !== undefined) updateData.telefono = telefono || null;
        if (email !== undefined) updateData.email = email || null;
        if (direccion !== undefined) updateData.direccion = direccion || null;
        if (especialidad !== undefined) updateData.especialidad = especialidad || null;
        if (estado !== undefined) updateData.estado = estado;

        // Verificar si solo se está actualizando updated_at
        if (Object.keys(updateData).length === 1 && updateData.updated_at) {
            return res.status(400).json({ 
                success: false, 
                error: 'Debe proporcionar al menos un campo para actualizar' 
            });
        }

        // Si se está actualizando el RUC, verificar que no exista en otro taller
        if (ruc) {
            const { data: existingTaller } = await supabase
                .from('talleres')
                .select('id')
                .eq('ruc', ruc)
                .neq('id', id)
                .single();

            if (existingTaller) {
                return res.status(400).json({
                    success: false,
                    error: 'Ya existe otro taller con ese RUC'
                });
            }
        }

        const { data: taller, error } = await supabase
            .from('talleres')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !taller) {
            return res.status(404).json({ 
                success: false, 
                error: 'Taller no encontrado o error de actualización' 
            });
        }

        return res.json({ 
            success: true, 
            message: 'Taller actualizado exitosamente', 
            taller 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * DELETE /api/talleres/:id
 * Eliminar un taller
 */
export const deleteTaller = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();

        const { id } = req.params;
        
        const { error } = await supabase
            .from('talleres')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error eliminando taller:', error);
            return res.status(400).json({ success: false, error: error.message });
        }

        return res.json({ 
            success: true, 
            message: 'Taller eliminado exitosamente',
            id 
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};

/**
 * GET /api/talleres/estadisticas
 * Obtener estadísticas de talleres
 */
export const getEstadisticas = async (req: Request, res: Response) => {
    try {
        let supabase = getSupabaseClient();
        
        const { data: talleres, error } = await supabase
            .from('talleres')
            .select('estado, especialidad');

        if (error) {
            console.error('Error obteniendo estadísticas:', error);
            return res.status(500).json({ success: false, error: error.message });
        }

        const stats = {
            total: talleres?.length || 0,
            porEstado: talleres?.reduce((acc: any, curr) => {
                acc[curr.estado] = (acc[curr.estado] || 0) + 1;
                return acc;
            }, {}) || {},
            porEspecialidad: talleres?.reduce((acc: any, curr) => {
                if (curr.especialidad) {
                    acc[curr.especialidad] = (acc[curr.especialidad] || 0) + 1;
                }
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
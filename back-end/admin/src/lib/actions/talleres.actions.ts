'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';

// 🎯 Importaciones del esquema y tipos de entrada
import type {
    Taller,
    TallerCreateInput,
    TallerUpdateInput,
    FetchTalleresParams,
    TalleresResponse,
    EstadisticasTalleres,
} from '@/lib/types/taller.types';
import { 
    EstadoTaller, 
    EspecialidadTaller 
} from '@/lib/types/taller.types';

// ===============================
// FETCH & GET ACTIONS
// ===============================

/**
 * Obtener talleres con filtros y paginación
 */
export async function getTalleresAction(params: FetchTalleresParams = {}): Promise<{ success: true, data: TalleresResponse } | { success: false, error: string }> {
    try {
        let supabase = getSupabaseAdminClient();
        const { page = 1, limit = 10, busqueda, estado, especialidad } = params;

        let query = supabase
            .from('talleres')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false });

        if (busqueda) {
            query = query.or(`nombre.ilike.%${busqueda}%,ruc.ilike.%${busqueda}%`);
        }

        if (estado) {
            query = query.eq('estado', estado);
        }

        if (especialidad) {
            query = query.eq('especialidad', especialidad);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, error, count } = await query.range(from, to);

        if (error) throw error;

        const response: TalleresResponse = {
            talleres: data as Taller[],
            total: count || 0,
            page: page,
            limit: limit,
            totalPages: Math.ceil((count || 0) / limit),
        };

        return { success: true, data: response };
    } catch (error: any) {
        console.error('Error en getTalleresAction:', error);
        return {
            success: false,
            error: error.message || 'Error al cargar talleres'
        };
    }
}

/**
 * Obtener un taller por ID
 */
export async function getTallerAction(id: number): Promise<{ success: true, data: Taller } | { success: false, error: string }> {
    try {
        let supabase = getSupabaseAdminClient();

        const { data, error } = await supabase
            .from('talleres')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return { success: true, data: data as Taller };
    } catch (error: any) {
        console.error('Error en getTallerAction:', error);
        return {
            success: false,
            error: error.message || 'Taller no encontrado'
        };
    }
}

// ===============================
// MUTATIONS (CRUD) ACTIONS
// ===============================

/**
 * Crear un nuevo taller
 */
export async function createTallerAction(data: TallerCreateInput): Promise<{ success: true, data: Taller, message: string } | { success: false, error: string }> {
    try {
        let supabase = getSupabaseAdminClient();

        const { data: tallerData, error } = await supabase
            .from('talleres')
            .insert([data])
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/talleres');
        return {
            success: true,
            data: tallerData as Taller,
            message: `Taller '${tallerData.nombre}' creado exitosamente.`
        };
    } catch (error: any) {
        console.error('Error en createTallerAction:', error);
        return {
            success: false,
            error: error.message || 'Error al crear el taller'
        };
    }
}

/**
 * Actualizar un taller existente
 */
export async function updateTallerAction(id: number, data: TallerUpdateInput): Promise<{ success: true, data: Taller, message: string } | { success: false, error: string }> {
    try {
        let supabase = getSupabaseAdminClient();

        const { data: tallerData, error } = await supabase
            .from('talleres')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/talleres');
        revalidatePath(`/Panel-Administrativo/talleres/${id}`);
        return {
            success: true,
            data: tallerData as Taller,
            message: `Taller '${tallerData.nombre}' actualizado exitosamente.`
        };
    } catch (error: any) {
        console.error('Error en updateTallerAction:', error);
        return {
            success: false,
            error: error.message || 'Error al actualizar el taller'
        };
    }
}

/**
 * Eliminar un taller
 */
export async function deleteTallerAction(id: number): Promise<{ success: true, message: string } | { success: false, error: string }> {
    try {
        let supabase = getSupabaseAdminClient();

        const { error } = await supabase
            .from('talleres')
            .delete()
            .eq('id', id);

        if (error) throw error;

        revalidatePath('/Panel-Administrativo/talleres');
        return {
            success: true,
            message: 'Taller eliminado exitosamente.'
        };
    } catch (error: any) {
        console.error('Error en deleteTallerAction:', error);
        return {
            success: false,
            error: error.message || 'Error al eliminar el taller'
        };
    }
}

/**
 * Obtener estadísticas de talleres
 * (Placeholder mejorado para usar los Enums)
 */
export async function getEstadisticasTalleresAction(): Promise<{ success: true, data: EstadisticasTalleres } | { success: false, error: string }> {
    try {
        let supabase = getSupabaseAdminClient();

        // Obtener el conteo total
        const { count: totalCount, error: countError } = await supabase
            .from('talleres')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        const estadisticas: EstadisticasTalleres = {
            total: totalCount || 0,
            porEstado: Object.values(EstadoTaller).reduce((acc, estado) => ({ ...acc, [estado]: 0 }), {} as Record<EstadoTaller, number>),
            porEspecialidad: Object.values(EspecialidadTaller).reduce((acc, especialidad) => ({ ...acc, [especialidad]: 0 }), {} as Record<EspecialidadTaller, number>),
        };
        
        return { success: true, data: estadisticas };
    } catch (error: any) {
        console.error('Error en getEstadisticasTalleresAction:', error);
        return {
            success: false,
            error: error.message || 'Error al obtener estadísticas'
        };
    }
}
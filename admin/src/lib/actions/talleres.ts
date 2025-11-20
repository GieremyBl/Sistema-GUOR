'use server';

import { 
  fetchTalleres, 
  getTaller, 
  createTaller, 
  updateTaller, 
  deleteTaller,
  getEstadisticasTalleres,
  type FetchTalleresParams,
  type TallerCreateData,
  type TallerUpdateData
} from '@/api';
import { revalidatePath } from 'next/cache';

/**
 * Obtener talleres con filtros y paginación
 */
export async function getTalleresAction(params: FetchTalleresParams = {}) {
  try {
    const response = await fetchTalleres(params);
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
export async function getTallerAction(id: number) {
  try {
    const response = await getTaller(id);
    return { success: true, data: response.taller };
  } catch (error: any) {
    console.error('Error en getTallerAction:', error);
    return { 
      success: false, 
      error: error.message || 'Error al cargar el taller' 
    };
  }
}

/**
 * Crear un nuevo taller
 */
export async function createTallerAction(data: TallerCreateData) {
  try {
    const response = await createTaller(data);
    revalidatePath('/Panel-Administrativo/talleres');
    return { 
      success: true, 
      data: response.taller,
      message: response.message 
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
export async function updateTallerAction(id: number, data: TallerUpdateData) {
  try {
    const response = await updateTaller(id, data);
    revalidatePath('/Panel-Administrativo/talleres');
    revalidatePath(`/Panel-Administrativo/talleres/${id}`);
    return { 
      success: true, 
      data: response.taller,
      message: response.message 
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
export async function deleteTallerAction(id: number) {
  try {
    const response = await deleteTaller(id);
    revalidatePath('/Panel-Administrativo/talleres');
    return { 
      success: true, 
      message: response.message 
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
 */
export async function getEstadisticasTalleresAction() {
  try {
    const estadisticas = await getEstadisticasTalleres();
    return { success: true, data: estadisticas };
  } catch (error: any) {
    console.error('Error en getEstadisticasTalleresAction:', error);
    return { 
      success: false, 
      error: error.message || 'Error al obtener estadísticas' 
    };
  }
}
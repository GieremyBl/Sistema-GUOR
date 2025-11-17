// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Usuario {
  id: string;
  nombre_completo: string;
  email: string;
  telefono?: string;
  rol: string;
  estado: string;
  created_at: string;
}

export interface UsuariosResponse {
  usuarios: Usuario[];
  total: number;
  totalPages: number;
  page: number;
}

export interface FetchUsuariosParams {
  page?: number;
  limit?: number;
  busqueda?: string;
  rol?: string;
  estado?: string;
}

// Obtener usuarios con filtros
export async function fetchUsuarios(params: FetchUsuariosParams = {}): Promise<UsuariosResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.busqueda) searchParams.append('busqueda', params.busqueda);
  if (params.rol) searchParams.append('rol', params.rol);
  if (params.estado) searchParams.append('estado', params.estado);

  const response = await fetch(`${API_URL}/api/usuarios?${searchParams}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cargar usuarios');
  }

  return response.json();
}

// Obtener un usuario por ID
export async function getUsuario(id: string): Promise<{ usuario: Usuario }> {
  const response = await fetch(`${API_URL}/api/usuarios/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Usuario no encontrado');
  }

  return response.json();
}

// Crear usuario
export async function createUsuario(data: Partial<Usuario>): Promise<Usuario> {
  const response = await fetch(`${API_URL}/api/usuarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear usuario');
  }

  return response.json();
}

// Actualizar usuario
export async function updateUsuario(id: string, data: Partial<Usuario>): Promise<Usuario> {
  const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar usuario');
  }

  return response.json();
}

// Eliminar usuario
export async function deleteUsuario(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/usuarios/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al eliminar usuario');
  }
}
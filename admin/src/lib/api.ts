
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

export type EstadoPedido = 
  | 'PENDIENTE'
  | 'EN_PROCESO'
  | 'TERMINADO'
  | 'ENTREGADO'
  | 'CANCELADO';

export type PrioridadPedido = 'BAJA' | 'NORMAL' | 'ALTA' | 'URGENTE';

export interface Cliente {
  id: string;
  ruc: string;
  razon_social: string;
  email?: string;
  telefono?: string;
  direccion?: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
}

export interface DetallePedido {
  id: string;
  pedido_id: string;
  producto_id: string;
  producto?: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Creador {
  id: string;
  nombre_completo: string;
  email: string;
}

export interface Pedido {
  id: string;
  cliente_id: string;
  cliente?: Cliente;
  fecha_pedido: string;
  fecha_entrega?: string | null;
  estado: EstadoPedido;
  prioridad: PrioridadPedido;
  total: number;
  created_by?: string;
  updated_by?: string;
  creador?: Creador;
  created_at: string;
  updated_at: string;
  detalles?: DetallePedido[];
}

export interface PedidosResponse {
  pedidos: Pedido[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchPedidosParams {
  page?: number;
  limit?: number;
  busqueda?: string;
  estado?: EstadoPedido;
  prioridad?: PrioridadPedido;
  cliente_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface CreatePedidoData {
  cliente_id: string;
  fecha_entrega?: string;
  prioridad?: PrioridadPedido;
  detalles: Array<{
    producto_id: string;
    cantidad: number;
    precio_unitario: number;
  }>;
  created_by?: string;
}

export interface UpdatePedidoData {
  cliente_id?: string;
  fecha_entrega?: string;
  estado?: EstadoPedido;
  prioridad?: PrioridadPedido;
  updated_by?: string;
}

export interface EstadisticasPedidos {
  total: number;
  totalFacturado: number;
  porEstado: Record<EstadoPedido, number>;
  porPrioridad: Record<PrioridadPedido, number>;
}

//Funciones del API de Usuarios

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

//Funciones del API de Pedidos

//Obtener pedidos con filtros

export async function fetchPedidos(params: FetchPedidosParams = {}): Promise<PedidosResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.busqueda) searchParams.append('busqueda', params.busqueda);
  if (params.estado) searchParams.append('estado', params.estado);
  if (params.prioridad) searchParams.append('prioridad', params.prioridad);
  if (params.cliente_id) searchParams.append('cliente_id', params.cliente_id);
  if (params.fecha_desde) searchParams.append('fecha_desde', params.fecha_desde);
  if (params.fecha_hasta) searchParams.append('fecha_hasta', params.fecha_hasta);

  const response = await fetch(`${API_URL}/api/pedidos?${searchParams}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cargar pedidos');
  }

  return response.json();
}

//Obtener un pedido por ID

export async function getPedido(id: string): Promise<{ pedido: Pedido }> {
  const response = await fetch(`${API_URL}/api/pedidos/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Pedido no encontrado');
  }

  return response.json();
}

//Crear nuevo pedido

export async function createPedido(data: CreatePedidoData): Promise<{ message: string; pedido: Pedido }> {
  const response = await fetch(`${API_URL}/api/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear pedido');
  }

  return response.json();
}

//Actualizar pedido existente

export async function updatePedido(
  id: string, 
  data: UpdatePedidoData
): Promise<{ message: string; pedido: Pedido }> {
  const response = await fetch(`${API_URL}/api/pedidos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar pedido');
  }

  return response.json();
}

//Eliminar pedido

export async function deletePedido(id: string): Promise<{ message: string; id: string }> {
  const response = await fetch(`${API_URL}/api/pedidos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al eliminar pedido');
  }

  return response.json();
}

//Obtener estadísticas de pedidos

export async function getEstadisticasPedidos(): Promise<EstadisticasPedidos> {
  const response = await fetch(`${API_URL}/api/pedidos/estadisticas`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener estadísticas');
  }

  return response.json();
}
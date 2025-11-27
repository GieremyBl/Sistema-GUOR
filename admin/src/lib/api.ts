
import { supabase } from '@/lib/supabase/client';

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
  id: number; 
  ruc?: number | null;
  razon_social?: string | null;
  email: string;
  telefono?: number | null;
  direccion?: string | null;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ClienteCreateInput {
  razon_social?: string | null;
  ruc?: number | null;
  email: string;
  telefono?: number | null;
  direccion?: string | null;
}

export interface ClienteUpdateInput {
  razon_social?: string | null;
  ruc?: number | null;
  email?: string;
  telefono?: number | null;
  direccion?: string | null;
  activo?: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  categoria_id: number;
  stock: number;
  stock_minimo: number;
  estado: 'activo' | 'inactivo';
  created_at: string;
  updated_at: string;
  categoria?: { 
    id: number; 
    nombre: string; 
  };
}

export interface DetallePedido {
  id: number;
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
  id: number;
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
  cliente_id: number;
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
  cliente_id?: number;
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

export interface Categoria {
    id: number;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
    created_at: string;
    updated_at: string | null;
}

export interface CategoriasResponse {
    success: boolean;
    data: Categoria[];
}

export interface CategoriaData {
    nombre: string;
    descripcion?: string;
    activo?: boolean;
}

export interface CategoriaCreateData {
  nombre: string;
  descripcion?: string;
  activo: boolean;
}

export interface CategoriaUpdateData {
    nombre?: string;
    descripcion?: string | null;
    activo?: boolean;
}

export interface ProductosResponse {
    success: boolean;
    data: Producto[];
}

export interface ProductoCreateData {
    nombre: string;
    descripcion?: string;
    categoria_id: number;
    precio: number;
    stock?: number;
    stock_minimo?: number;
    imagen?: string;
    estado?: 'activo' | 'inactivo';
}


export interface ProductoUpdateData extends Partial<ProductoCreateData> {
    estado?: 'activo' | 'inactivo';
}

export type EstadoTaller = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
export type EspecialidadTaller = 'CORTE' | 'CONFECCION' | 'BORDADO' | 'ESTAMPADO' | 'COSTURA' | 'ACABADOS' | 'OTRO';

export interface Taller {
  id: number;
  nombre: string;
  ruc?: string | null;
  contacto?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  especialidad?: EspecialidadTaller | null;
  estado: EstadoTaller;
  created_at: string;
  updated_at?: string | null;
}

export interface TalleresResponse {
  talleres: Taller[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchTalleresParams {
  page?: number;
  limit?: number;
  busqueda?: string;
  estado?: EstadoTaller;
  especialidad?: EspecialidadTaller;
}

export interface TallerCreateData {
  nombre: string;
  ruc?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  especialidad?: EspecialidadTaller;
  estado?: EstadoTaller;
}

export interface TallerUpdateData {
  nombre?: string;
  ruc?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  especialidad?: EspecialidadTaller;
  estado?: EstadoTaller;
}

export interface EstadisticasTalleres {
  total: number;
  porEstado: Record<EstadoTaller, number>;
  porEspecialidad: Record<EspecialidadTaller, number>;
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

//Funciones de Utilidad

async function handleResponse(response: Response) {
    if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}: ${response.statusText}`;
        try {
            const json = await response.json();
            if (json.error) errorMessage = json.error;
        } catch {}
        throw new Error(errorMessage);
    }
    
    const result = await response.json();

    if (!result.success) {
        throw new Error(result.error || 'Operación fallida en el servidor.');
    }
    
    return result.data;
}

// Funciones del Cliente API para Categorías

// listar todas las categorías
export async function fetchCategorias(): Promise<Categoria[]> {
  const response = await fetch(`${API_URL}/api/categorias`);
  return handleResponse(response);
}

// Obtener una categoría por ID
export async function getCategoria(id: number): Promise<Categoria> {
  const response = await fetch(`${API_URL}/api/categorias/${id}`);
  return handleResponse(response);
} 

// Crear nueva categoría
export async function createCategoria(data: CategoriaCreateData) {
  const { data: categoria, error } = await supabase
    .from('categorias')
    .insert({
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: data.activo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return categoria;
}
// Actualizar categoría existente
export async function updateCategoria(id: number, data: CategoriaUpdateData): Promise<Categoria> {
  const response = await fetch(`${API_URL}/api/categorias/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}
// Eliminar categoría

export async function deleteCategoria(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/categorias/${id}`, {
    method: 'DELETE',
  });
  const result = await handleResponse(response);
  return result || { message : 'Categoría eliminada exitosamente' }; 
}

// Funciones del Cliente API para Productos

// Crear nuevo producto

export async function createProducto(data: ProductoCreateData): Promise<Producto> {
  const response = await fetch(`${API_URL}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Actualizar producto existente
export async function updateProducto(id: number, data: ProductoUpdateData): Promise<Producto> {
  const response = await fetch(`${API_URL}/api/productos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// Eliminar producto
export async function deleteProducto(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/productos/${id}`, {
    method: 'DELETE',
  });
  const result = await handleResponse(response);
  return result || { message : 'Producto eliminado exitosamente' }; 
}

// Obtener un producto por ID
export async function getProducto(id: number): Promise<Producto> {
  const response = await fetch(`${API_URL}/api/productos/${id}`);
  return handleResponse(response);
}

// Listar todos los productos
export async function fetchProductos(): Promise<Producto[]> {
  const response = await fetch(`${API_URL}/api/productos`);
  return handleResponse(response);
}
// Funciones del API de Talleres

// Obtener talleres con filtros

export async function fetchTalleres(params: FetchTalleresParams = {}): Promise<TalleresResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.busqueda) searchParams.append('busqueda', params.busqueda);
  if (params.estado) searchParams.append('estado', params.estado);
  if (params.especialidad) searchParams.append('especialidad', params.especialidad);

  const response = await fetch(`${API_URL}/api/talleres?${searchParams}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cargar talleres');
  }

  return response.json();
}

// Obtener un taller por ID

export async function getTaller(id: number): Promise<{ taller: Taller }> {
  const response = await fetch(`${API_URL}/api/talleres/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Taller no encontrado');
  }

  return response.json();
}

// Crear nuevo taller

export async function createTaller(data: TallerCreateData): Promise<{ message: string; taller: Taller }> {
  const response = await fetch(`${API_URL}/api/talleres`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al crear taller');
  }

  return response.json();
}

// Actualizar taller existente 

export async function updateTaller(
  id: number, 
  data: TallerUpdateData
): Promise<{ message: string; taller: Taller }> {
  const response = await fetch(`${API_URL}/api/talleres/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al actualizar taller');
  }

  return response.json();
}

// Eliminar talleres

export async function deleteTaller(id: number): Promise<{ message: string; id: number }> {
  const response = await fetch(`${API_URL}/api/talleres/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al eliminar taller');
  }

  return response.json();
}

//Obtener estadísticas de talleres
 
export async function getEstadisticasTalleres(): Promise<EstadisticasTalleres> {
  const response = await fetch(`${API_URL}/api/talleres/estadisticas`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener estadísticas');
  }

  const result = await response.json();
  return result.data;
}

// Funciones del API de Clientes

// Obtener todos los clientes
export async function getClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// Obtener un cliente por ID
export async function getCliente(id: string): Promise<Cliente> {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Crear nuevo cliente
export async function createCliente(clienteData: ClienteCreateInput): Promise<Cliente> {
  const { data, error } = await supabase
    .from('clientes')
    .insert({
      ...clienteData,
      activo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    // Manejo de errores específicos de Supabase
    if (error.code === '23505') {
      throw new Error('Ya existe un cliente con ese email');
    }
    throw new Error(error.message);
  }
  
  return data;
}

// Actualizar cliente existente
export async function updateCliente(id: string, clienteData: ClienteUpdateInput): Promise<Cliente> {
  const { data, error } = await supabase
    .from('clientes')
    .update({
      ...clienteData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya existe un cliente con ese email');
    }
    throw new Error(error.message);
  }
  
  return data;
}

// Eliminar cliente
export async function deleteCliente(id: string): Promise<void> {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
}

// Buscar clientes (opcional, para búsquedas avanzadas)
export async function searchClientes(busqueda: string): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .or(`razon_social.ilike.%${busqueda}%,email.ilike.%${busqueda}%,ruc.ilike.%${busqueda}%`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}


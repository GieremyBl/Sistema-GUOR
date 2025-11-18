export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  TERMINADO = 'TERMINADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export enum PrioridadPedido {
  BAJA = 'BAJA',
  NORMAL = 'NORMAL',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

// Cliente según tu estructura de Supabase
export interface Cliente {
  id: string; // Usamos string para IDs grandes (int8)
  razon_social?: string;
  ruc?: number;
  email: string;
  telefono?: number;
  direccion?: string;
  activo?: boolean;
}

// Producto según tu estructura de Supabase
export interface Producto {
  id: number; // Asumimos que los IDs de productos son números
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  stock_minimo?: number;
  imagen?: string;
  estado?: boolean;
  categoria_id?: number;
  categoria?: {
    id: number;
    nombre: string;
  };
}

// Detalle de Pedido
export interface DetallePedido {
  id?: number;
  pedido_id?: string;
  producto_id: number;
  producto?: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// Pedido principal
export interface Pedido {
  id: string;
  cliente_id: string; 
  cliente?: Cliente;
  estado: EstadoPedido;
  prioridad: PrioridadPedido;
  fecha_pedido: string;
  fecha_entrega?: string;
  total: number;
  created_by?: string;
  updated_by?: string;
  creador?: {
    id: number;
    nombre_completo: string;
    email?: string;
  };
  detalles?: DetallePedido[];
  created_at?: string;
  updated_at?: string;
}

// Inputs para Server Actions
export interface CreatePedidoInput {
  cliente_id: string;
  fecha_entrega?: string;
  prioridad?: PrioridadPedido;
  detalles: Array<{
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }>;
  created_by?: string;
}

export interface UpdatePedidoInput {
  id: string;
  cliente_id?: string;
  fecha_entrega?: string;
  estado?: EstadoPedido;
  prioridad?: PrioridadPedido;
  updated_by?: string;
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

// NUEVO: Tipo para la Metadata de paginación que acepta null en 'total'
export interface PaginacionMeta {
  total: number | null;
  page: number;
  limit: number;
  totalPages: number;
}

// Labels para UI
export const ESTADO_PEDIDO_LABELS: Record<EstadoPedido, string> = {
  [EstadoPedido.PENDIENTE]: 'Pendiente',
  [EstadoPedido.EN_PROCESO]: 'En Proceso',
  [EstadoPedido.TERMINADO]: 'Terminado',
  [EstadoPedido.ENTREGADO]: 'Entregado',
  [EstadoPedido.CANCELADO]: 'Cancelado',
};

export const PRIORIDAD_PEDIDO_LABELS: Record<PrioridadPedido, string> = {
  [PrioridadPedido.BAJA]: 'Baja',
  [PrioridadPedido.NORMAL]: 'Normal',
  [PrioridadPedido.ALTA]: 'Alta',
  [PrioridadPedido.URGENTE]: 'Urgente',
};

// Colores para badges
export const ESTADO_PEDIDO_COLORS: Record<EstadoPedido, string> = {
  [EstadoPedido.PENDIENTE]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [EstadoPedido.EN_PROCESO]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [EstadoPedido.TERMINADO]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [EstadoPedido.ENTREGADO]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [EstadoPedido.CANCELADO]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const PRIORIDAD_PEDIDO_COLORS: Record<PrioridadPedido, string> = {
  [PrioridadPedido.BAJA]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  [PrioridadPedido.NORMAL]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [PrioridadPedido.ALTA]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [PrioridadPedido.URGENTE]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};
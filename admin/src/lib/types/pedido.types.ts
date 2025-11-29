import { Cliente } from './cliente.types';
import { Producto } from './producto.types';
import { Usuario } from './usuario.types'; // Si tienes este tipo

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

export interface DetallePedido {
  id?: number;
  pedido_id?: number;
  producto_id: number;
  producto?: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  cliente_id: number;
  cliente?: Cliente;
  estado: EstadoPedido;
  prioridad: PrioridadPedido;
  fecha_pedido: string;
  fecha_entrega?: string | null;
  total: number;
  created_by?: string;
  updated_by?: string;
  creador?: {
    id: string;
    nombre_completo: string;
    email?: string;
  };
  detalles?: DetallePedido[];
  created_at?: string;
  updated_at?: string;
}

// NUEVO: Tipo para pedido con relaciones de Supabase (arrays por el JOIN)
export interface PedidoConRelaciones extends Omit<Pedido, 'cliente' | 'creador' | 'detalles'> {
  cliente: Cliente[];
  creador?: Array<{
    id: string;
    nombre_completo: string;
    email?: string;
  }>;
  detalles?: Array<DetallePedido & {
    producto?: Producto[];
  }>;
}

export interface CreatePedidoInput {
  cliente_id: number;
  fecha_entrega?: string;
  prioridad: PrioridadPedido;
  detalles: Array<{
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
  }>;
  created_by?: string;
}

export interface UpdatePedidoInput {
  id: number;
  cliente_id?: number;
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
  cliente_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
}

// Constantes
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
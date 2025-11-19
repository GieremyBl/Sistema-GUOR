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

// Cliente según tu estructura de Supabase - CORREGIDO
export interface Cliente {
  id: string;
  razon_social?: string | null;
  ruc?: number | null;
  email: string;
  telefono?: number | null;
  direccion?: string | null;
  activo: boolean; // Cambiado de opcional a requerido con valor por defecto
}

// Tipo para crear cliente (sin id y sin activo)
export interface ClienteCreateInput {
  razon_social?: string | null;
  ruc?: number | null;
  email: string;
  telefono?: number | null;
  direccion?: string | null;
}

// Tipo para actualizar cliente
export interface ClienteUpdateInput {
  razon_social?: string | null;
  ruc?: number | null;
  email?: string;
  telefono?: number | null;
  direccion?: string | null;
  activo?: boolean;
}

// Resto de los tipos permanecen igual...
export interface Producto {
  id: number;
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

export interface DetallePedido {
  id?: number;
  pedido_id?: string;
  producto_id: number;
  producto?: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

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

export interface PaginacionMeta {
  total: number | null;
  page: number;
  limit: number;
  totalPages: number;
}

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

// ROLES Y PERMISOS

export enum Role {
  ADMINISTRADOR = 'administrador',
  CORTADOR = 'cortador',
  DISENADOR = 'diseñador',
  RECEPCIONISTA = 'recepcionista',
  AYUDANTE = 'ayudante',
  REPRESENTANTE_TALLER = 'representante_taller',
}

export enum Permission {
  // Gestión de Usuarios
  VIEW_USERS = 'view_users',
  MANAGE_USERS = 'manage_users',
  
  // Gestión de Clientes
  VIEW_CLIENTS = 'view_clients',
  MANAGE_CLIENTS = 'manage_clients',
  
  // Gestión de Pedidos
  VIEW_ORDERS = 'view_orders',
  CREATE_ORDERS = 'create_orders',
  EDIT_ORDERS = 'edit_orders',
  DELETE_ORDERS = 'delete_orders',
  CHANGE_ORDER_STATUS = 'change_order_status',
  
  // Gestión de Productos
  VIEW_PRODUCTS = 'view_products',
  MANAGE_PRODUCTS = 'manage_products',
  MANAGE_STOCK = 'manage_stock',
  
  // Gestión de Categorías
  VIEW_CATEGORIES = 'view_categories',
  MANAGE_CATEGORIES = 'manage_categories',
  
  // Gestión de Inventario
  VIEW_INVENTORY = 'view_inventory',
  MANAGE_INVENTORY = 'manage_inventory',
  
  // Gestión de Confecciones
  VIEW_CONFECTIONS = 'view_confections',
  MANAGE_CONFECTIONS = 'manage_confections',
  
  // Gestión de Talleres
  VIEW_WORKSHOPS = 'view_workshops',
  MANAGE_WORKSHOPS = 'manage_workshops',
  
  // Gestión de Cotizaciones
  VIEW_QUOTES = 'view_quotes',
  MANAGE_QUOTES = 'manage_quotes',
  
  // Gestión de Despachos
  VIEW_DISPATCHES = 'view_dispatches',
  MANAGE_DISPATCHES = 'manage_dispatches',
  
  // Reportes
  VIEW_REPORTS = 'view_reports',
  EXPORT_REPORTS = 'export_reports',
  
  // Configuración
  VIEW_SETTINGS = 'view_settings',
  MANAGE_SETTINGS = 'manage_settings',
}

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMINISTRADOR]: 'Administrador',
  [Role.CORTADOR]: 'Cortador',
  [Role.DISENADOR]: 'Diseñador',
  [Role.RECEPCIONISTA]: 'Recepcionista',
  [Role.AYUDANTE]: 'Ayudante',
  [Role.REPRESENTANTE_TALLER]: 'Representante de Taller',
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  [Permission.VIEW_USERS]: 'Ver Usuarios',
  [Permission.MANAGE_USERS]: 'Gestionar Usuarios',
  [Permission.VIEW_CLIENTS]: 'Ver Clientes',
  [Permission.MANAGE_CLIENTS]: 'Gestionar Clientes',
  [Permission.VIEW_ORDERS]: 'Ver Pedidos',
  [Permission.CREATE_ORDERS]: 'Crear Pedidos',
  [Permission.EDIT_ORDERS]: 'Editar Pedidos',
  [Permission.DELETE_ORDERS]: 'Eliminar Pedidos',
  [Permission.CHANGE_ORDER_STATUS]: 'Cambiar Estado de Pedidos',
  [Permission.VIEW_PRODUCTS]: 'Ver Productos',
  [Permission.MANAGE_PRODUCTS]: 'Gestionar Productos',
  [Permission.MANAGE_STOCK]: 'Gestionar Stock',
  [Permission.VIEW_CATEGORIES]: 'Ver Categorías',
  [Permission.MANAGE_CATEGORIES]: 'Gestionar Categorías',
  [Permission.VIEW_INVENTORY]: 'Ver Inventario',
  [Permission.MANAGE_INVENTORY]: 'Gestionar Inventario',
  [Permission.VIEW_CONFECTIONS]: 'Ver Confecciones',
  [Permission.MANAGE_CONFECTIONS]: 'Gestionar Confecciones',
  [Permission.VIEW_WORKSHOPS]: 'Ver Talleres',
  [Permission.MANAGE_WORKSHOPS]: 'Gestionar Talleres',
  [Permission.VIEW_QUOTES]: 'Ver Cotizaciones',
  [Permission.MANAGE_QUOTES]: 'Gestionar Cotizaciones',
  [Permission.VIEW_DISPATCHES]: 'Ver Despachos',
  [Permission.MANAGE_DISPATCHES]: 'Gestionar Despachos',
  [Permission.VIEW_REPORTS]: 'Ver Reportes',
  [Permission.EXPORT_REPORTS]: 'Exportar Reportes',
  [Permission.VIEW_SETTINGS]: 'Ver Configuración',
  [Permission.MANAGE_SETTINGS]: 'Gestionar Configuración',
};
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  contraseña: string;
  telefono: string;
  direccion: string;
  estado: boolean;
  rol: 'ADMIN' | 'USER';
  created_at: Date;
  updated_at: Date;
}

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: string;
  stock: number;
  stock_minimo: number;
  imagen: string;
  estado: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ItemPedido {
  id: string;
  pedido_id: string;
  variante_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at: Date;
  updated_at: Date;
}

// Actualizar la interfaz Pedido para incluir los items
export interface Pedido {
  id: string;
  numero_orden: string;
  usuario_id: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO' | 'ENTREGADO' | 'CANCELADO';
  fecha_pedido: Date;
  fecha_entrega: Date | null;
  total: number;
  items: ItemPedido[]; // Agregar relación con items
  created_at: Date;
  updated_at: Date;
}

export interface DetallePedido {
  id: string;
  pedido_id: string;
  producto_id: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at: Date;
  updated_at: Date;
}

export interface Inventario {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  unidad_medida: string;
  stock_actual: number;
  stock_minimo: number;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Confeccion {
  id: string;
  pedido_id: string;
  taller_id: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO';
  fecha_inicio: Date;
  fecha_fin: Date | null;
  observaciones: string;
  created_at: Date;
  updated_at: Date;
}

export interface Despacho {
  id: string;
  pedido_id: string;
  usuario_id: string;
  estado: 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO';
  fecha_despacho: Date;
  fecha_entrega: Date | null;
  direccion_entrega: string;
  created_at: Date;
  updated_at: Date;
}

export interface Taller {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: boolean;
  created_at: Date;
  updated_at: Date;
}

// Tipos para las respuestas de la API
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
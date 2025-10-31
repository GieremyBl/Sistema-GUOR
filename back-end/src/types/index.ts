export interface Usuario {
  id: bigint;
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
  id: bigint;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria_id: bigint;
  stock: number;
  stock_minimo: number;
  imagen: string;
  estado: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Pedido {
  id: bigint;
  cliente_id: bigint;
  cotizacion_id: bigint | null;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO' | 'ENTREGADO' | 'CANCELADO';
  fecha_pedido: Date;
  fecha_entrega: Date | null;
  total: number;
  created_at: Date;
  updated_at: Date;
}

export interface DetallePedido {
  id: bigint;
  pedido_id: bigint;
  producto_id: bigint;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at: Date;
  updated_at: Date;
}

export interface Inventario {
  id: bigint;
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
  id: bigint;
  pedido_id: bigint;
  taller_id: bigint;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO';
  fecha_inicio: Date;
  fecha_fin: Date | null;
  observaciones: string;
  created_at: Date;
  updated_at: Date;
}

export interface Despacho {
  id: bigint;
  pedido_id: bigint;
  usuario_id: bigint;
  estado: 'PENDIENTE' | 'EN_RUTA' | 'ENTREGADO';
  fecha_despacho: Date;
  fecha_entrega: Date | null;
  direccion_entrega: string;
  created_at: Date;
  updated_at: Date;
}

export interface Taller {
  id: bigint;
  nombre: string;
  telefono: string;
  direccion: string;
  estado: boolean;
  email: string;
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
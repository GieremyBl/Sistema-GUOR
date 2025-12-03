export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  categoria_id: number;
  imagen: string;
  precio: number;
  stock: number;
  stock_minimo: number;
  updated_at: string | null;
  estado: 'activo' | 'inactivo';
  categorias?: Categoria;
}

export interface ItemCarrito {
  producto_id: number;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
  talla: string;
  color?: string;
  stock: number;
}

export interface VarianteProducto {
  id: number;
  producto_id: number;
  created_at: string;
  nombre: string;
  precio_adicion: number;
  stock_adicion: number;
  updated_at: string | null;
  valor: string;
}

export interface Cliente {
  id: number;
  ruc: number;
  razon_social: string;
  email: string;
  telefono: number;
  direccion: string;
  activo: boolean;
  created_at: string;
  auth_id: string;
  updated_at: string;
}

export interface Pedido {
  id: number;
  numero_pedido: string;
  cliente_id: number;
  fecha_pedido: string;
  fecha_entrega: string | null;
  estado: 'PENDIENTE' | 'PROCESANDO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
  prioridad: 'NORMAL' | 'URGENTE';
  subtotal: number;
  descuento: number;
  impuesto: number;
  total: number;
  notas: string | null;
  direccion_envio: string;
  created_by: string;
  created_at: string;
  updated_at: string | null;
  updated_by: string | null;
  // Relación
  clientes?: Cliente;
}

export interface DetallePedido {
  id: number;
  pedido_id: number;
  producto_id: number;
  cantidad: number;
  talla: string;
  color: string | null;
  precio_unitario: number;
  subtotal: number;
  notas: string | null;
  created_at: string;
  // Relación
  productos?: Producto;
}
  export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string | null;
    activo: boolean;
    created_at?: string;
    updated_at?: string;
  }

  export interface CategoriaCreateInput {
    nombre: string;
    descripcion?: string;
    activo?: boolean;
  }

  export interface CategoriaUpdateInput {
    nombre?: string;
    descripcion?: string | null;
    activo?: boolean;
  }
  export interface ProductoResumen {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    estado: string;
}

export interface CategoriaConProductos extends Categoria {
    productos: ProductoResumen[];
}
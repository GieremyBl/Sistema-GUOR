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

export interface CategoriaTable extends Categoria {
  _count?: {
    productos: number;
  };
}

export interface CreateProductoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  categorias: Categoria[];
}
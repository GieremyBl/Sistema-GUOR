/**
 * Interfaz base de la entidad Categoria
 */
export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string | null;
    activo: boolean;
    created_at?: string;
    updated_at?: string;
}

/**
 * Datos requeridos para crear una Categoria
 */
export interface CategoriaCreateInput {
    nombre: string;
    descripcion?: string;
    activo?: boolean;
}

/**
 * Datos opcionales para actualizar una Categoria
 */
export interface CategoriaUpdateInput {
    nombre?: string;
    descripcion?: string | null;
    activo?: boolean;
}

/**
 * Resumen de Producto anidado en CategoriaConProductos
 */
export interface ProductoResumen {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    estado: string;
}

/**
 * Categoria con la lista completa de Productos (para vistas detalladas)
 */
export interface CategoriaConProductos extends Categoria {
    productos: ProductoResumen[];
}

/**
 * Categoria con el conteo de productos (para la tabla de listado)
 */
export interface CategoriaConConteo extends Categoria {
    _count?: {
        productos: number;
    };
}

/**
 * Props para el diálogo de creación de producto (requiere la lista de categorías)
 */
export interface CreateProductoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
    categorias: Categoria[];
}


export interface CategoriaFiltersState {
    busqueda: string;
    estado: string; // 'Activa' o 'Inactiva' (o '')
}

/**
 * Tipo para los parámetros de filtrado que se envían a la Server Action.
 * Este mapea el estado de la UI a los valores de la DB (booleanos) o de paginación.
 */
export interface FiltrosCategorias {
    busqueda?: string;
    activo?: boolean; // Solo booleanos para la DB
    page?: number;
    limit?: number;
}

/**
 * Opciones de Estado de Categoría para el Select (UI).
 */
export const CATEGORY_STATUS_OPTIONS = [
    { value: 'Activa', name: 'Activa' },
    { value: 'Inactiva', name: 'Inactiva' },
];

/**
 * Props del componente CategoryList (contenedor de la lista y lógica)
 * Si no recibe props, debe existir para ser exportado.
 */
export interface CategoriaListProps {}

/**
 * Props para el componente CategoryFilters (Componente de UI)
 */
export interface CategoriaFiltersProps {
    filters: CategoriaFiltersState;
    onFiltersChange: (filters: CategoriaFiltersState) => void;
}
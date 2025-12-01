import { Categoria } from "@/lib/types/categoria.types";

/**
 * Tipo Base para la tabla 'productos' (Reflejando la DB)
 */
export interface Producto {
    id: number; 
    nombre: string;
    descripcion?: string;
    categoria_id: number; 
    imagen?: string;
    precio: number;
    stock: number;
    stock_minimo: number;
    estado: 'activo' | 'inactivo' | 'agotado' | 'descontinuado';
    created_at: string;
    updated_at?: string; 
}

/**
 * Tipo para Producto con su relación 'categoria' (JOIN)
 */
export interface ProductoConCategoria extends Producto {
    categoria: Categoria[];
}

/**
 * Tipo para los parámetros de filtrado y paginación
 */
export type FiltrosProductos = {
    estado?: string;
    categoriaId?: string;
    busqueda?: string;
    stockBajo?: boolean;
    page?: number;
    limit?: number;
};

/**
 * Tipo para la creación de un producto (Datos de entrada)
 */
export interface ProductoCreateInput {
    nombre: string;
    descripcion?: string;
    categoria_id: number;
    precio: number;
    stock?: number;
    stock_minimo?: number;
    imagen?: string;
    estado?: 'activo' | 'inactivo' | 'agotado' | 'descontinuado';
}

/**
 * Tipo para la actualización de un producto.
 */
export interface ProductoUpdateInput extends Partial<ProductoCreateInput> {
    id: number;
}

/**
 * Interfaz para el estado local del componente ProductFilters.
 * Es una versión simplificada de FiltrosProductos para el componente.
 */
export interface ProductoFiltersState {
    busqueda: string;
    categoria: string; 
    estado: string;
}

/**
 * Opciones de Estado de Producto para el Select.
 */
export const PRODUCT_STATUS_OPTIONS = [
    { value: 'activo', name: 'Activo' },
    { value: 'inactivo', name: 'Inactivo' },
    { value: 'agotado', name: 'Agotado' }, 
];

// Nueva interfaz para las opciones de categoría
export interface CategoryOption {
    id: string; // Para el Select value
    name: string;
}

// Interfaz final para ProductoFiltersProps:
export interface ProductoFiltersProps {
    filters: ProductoFiltersState;
    onFiltersChange: (filters: ProductoFiltersState) => void;
    categorias: CategoryOption[]; 
}

export interface ProductoListProps {
    categorias: CategoryOption[];
}
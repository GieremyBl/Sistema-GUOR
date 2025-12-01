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
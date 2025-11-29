/**
 * Tipos comunes reutilizables en toda la aplicación
 */

/**
 * Metadata de paginación estándar
 */
export interface PaginacionMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Respuesta API estándar con tipado genérico
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

/**
 * Respuesta paginada genérica
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: PaginacionMeta;
}

/**
 * Parámetros base para consultas con paginación
 */
export interface BasePaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Parámetros base para búsqueda
 */
export interface BaseSearchParams extends BasePaginationParams {
  busqueda?: string;
}

/**
 * Filtros de fecha
 */
export interface DateRangeFilter {
  fecha_desde?: string;
  fecha_hasta?: string;
}

/**
 * Timestamps estándar para entidades
 */
export interface Timestamps {
  created_at: string;
  updated_at?: string | null;
}

/**
 * Audit fields (quién creó/modificó)
 */
export interface AuditFields {
  created_by?: string | null;
  updated_by?: string | null;
}

/**
 * Tipo para estados booleanos en español
 */
export type EstadoActivo = 'activo' | 'inactivo';

/**
 * Utilidad para hacer campos opcionales
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Utilidad para hacer campos requeridos
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Opciones de ordenamiento
 */
export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Respuesta de operaciones CRUD con mensaje
 */
export interface OperationResponse<T = void> {
  message: string;
  data?: T;
}
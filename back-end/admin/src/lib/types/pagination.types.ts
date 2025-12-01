// ===================================
// Tipos Genéricos de Paginación y Listados
// ===================================

/**
 * Tipos genéricos para respuestas paginadas
 */
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Parámetros base para listados paginados
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
    busqueda?: string;
}

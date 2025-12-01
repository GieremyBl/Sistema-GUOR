
export interface Cliente {
    id: number;
    auth_id: string;
    razon_social: string | null;
    ruc: number | null;
    email: string;
    telefono: number | null;
    direccion: string | null;
    activo: boolean;
    created_at: string;
    updated_at: string;
}
export interface ClienteCreateInput {
    razon_social: string | null;
    ruc?: number | null;
    email: string;
    telefono?: number | null;
    direccion?: string | null;
}

export interface ClienteUpdateInput {
    razon_social?: string | null;
    ruc?: number | null;
    email?: string;
    telefono?: number | null;
    direccion?: string | null;
    activo?: boolean;
}

export interface FetchClientesParams {
    page?: number;
    limit?: number;
    busqueda?: string;
    activo?: boolean;
}

export interface ClientesResponse {
    clientes: Cliente[];
    total: number;
    totalPages: number;
    error?: string;
}

export interface ClientesTableProps {
    clientes: Cliente[];
    onEdit: (cliente: Cliente) => void; 
    onDelete: (cliente: Cliente) => void;
    onToggleActivo: (cliente: Cliente) => void;
    isLoading?: boolean;
    pagination: { 
        page: number; 
        limit: number; 
        total: number; 
        totalPages: number;
    };
    onPageChange: (page: number) => void;
}
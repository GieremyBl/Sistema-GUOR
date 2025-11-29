export interface Usuario {
  id: number;
  nombre_completo: string;
  email: string;
  telefono: string | null;
  rol: string;
  estado: string;
  auth_id?: string | null;
  ultimo_acceso?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface UsuarioCreateInput {
  nombre_completo: string;
  email: string;
  telefono?: string;
  rol: string;
  estado?: string;
  auth_id?: string;
}

export interface UsuarioUpdateInput {
  nombre_completo?: string;
  email?: string;
  telefono?: string;
  rol?: string;
  estado?: string;
  ultimo_acceso?: string;
}

export interface UsuariosResponse {
  usuarios: Usuario[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export interface FetchUsuariosParams {
  page?: number;
  limit?: number;
  busqueda?: string;
  rol?: string;
  estado?: string;
}

// Enums y constantes
export enum EstadoUsuario {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  SUSPENDIDO = 'suspendido',
}

export enum RolUsuario {
  ADMINISTRADOR = 'administrador',
  CORTADOR = 'cortador',
  DISENADOR = 'diseñador',
  RECEPCIONISTA = 'recepcionista',
  AYUDANTE = 'ayudante',
  REPRESENTANTE_TALLER = 'representante_taller',
}

export const ESTADO_USUARIO_LABELS: Record<EstadoUsuario, string> = {
  [EstadoUsuario.ACTIVO]: 'Activo',
  [EstadoUsuario.INACTIVO]: 'Inactivo',
  [EstadoUsuario.SUSPENDIDO]: 'Suspendido',
};

export const ROL_USUARIO_LABELS: Record<RolUsuario, string> = {
  [RolUsuario.ADMINISTRADOR]: 'Administrador',
  [RolUsuario.CORTADOR]: 'Cortador',
  [RolUsuario.DISENADOR]: 'Diseñador',
  [RolUsuario.RECEPCIONISTA]: 'Recepcionista',
  [RolUsuario.AYUDANTE]: 'Ayudante',
  [RolUsuario.REPRESENTANTE_TALLER]: 'Representante de Taller',
};

export const ESTADO_USUARIO_COLORS: Record<EstadoUsuario, string> = {
  [EstadoUsuario.ACTIVO]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [EstadoUsuario.INACTIVO]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  [EstadoUsuario.SUSPENDIDO]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};
export enum EstadoTaller {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
}

export enum EspecialidadTaller {
  CORTE = 'CORTE',
  CONFECCION = 'CONFECCION',
  BORDADO = 'BORDADO',
  ESTAMPADO = 'ESTAMPADO',
  COSTURA = 'COSTURA',
  ACABADOS = 'ACABADOS',
  OTRO = 'OTRO',
}

export interface Taller {
  id: number;
  nombre: string;
  ruc?: string | null;
  contacto?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  especialidad?: EspecialidadTaller;
  estado: EstadoTaller;
  created_at: string;
  updated_at?: string | null;
}

export interface TallerCreateInput {
  nombre: string;
  ruc?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  especialidad?: EspecialidadTaller;
  estado?: EstadoTaller;
}

export interface TallerUpdateInput {
  nombre?: string;
  ruc?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  especialidad?: EspecialidadTaller;
  estado?: EstadoTaller;
}

export interface TalleresResponse {
  talleres: Taller[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchTalleresParams {
  page?: number;
  limit?: number;
  busqueda?: string;
  estado?: EstadoTaller;
  especialidad?: EspecialidadTaller;
}

export interface EstadisticasTalleres {
  total: number;
  porEstado: Record<EstadoTaller, number>;
  porEspecialidad: Record<EspecialidadTaller, number>;
}

// Constantes y labels
export const ESTADO_TALLER_LABELS: Record<EstadoTaller, string> = {
  [EstadoTaller.ACTIVO]: 'Activo',
  [EstadoTaller.INACTIVO]: 'Inactivo',
  [EstadoTaller.SUSPENDIDO]: 'Suspendido',
};

export const ESPECIALIDAD_TALLER_LABELS: Record<EspecialidadTaller, string> = {
  [EspecialidadTaller.CORTE]: 'Corte',
  [EspecialidadTaller.CONFECCION]: 'Confección',
  [EspecialidadTaller.BORDADO]: 'Bordado',
  [EspecialidadTaller.ESTAMPADO]: 'Estampado',
  [EspecialidadTaller.COSTURA]: 'Costura',
  [EspecialidadTaller.ACABADOS]: 'Acabados',
  [EspecialidadTaller.OTRO]: 'Otro',
};

export const ESTADO_TALLER_COLORS: Record<EstadoTaller, string> = {
  [EstadoTaller.ACTIVO]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [EstadoTaller.INACTIVO]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  [EstadoTaller.SUSPENDIDO]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export const ESPECIALIDAD_TALLER_COLORS: Record<EspecialidadTaller, string> = {
  [EspecialidadTaller.CORTE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [EspecialidadTaller.CONFECCION]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [EspecialidadTaller.BORDADO]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  [EspecialidadTaller.ESTAMPADO]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [EspecialidadTaller.COSTURA]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  [EspecialidadTaller.ACABADOS]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  [EspecialidadTaller.OTRO]: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};
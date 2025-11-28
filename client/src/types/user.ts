export interface User {
  id: string;
  nombre: string;
  apellidos: string;
  ruc: string;
  correo: string;
  empresa?: string;
  telefono?: string;
  direccion?: string;
  createdAt: Date;
}

export interface LoginCredentials {
  correo: string;
  ruc: string;
}

export interface RegisterData extends LoginCredentials {
  nombre: string;
  apellidos: string;
  empresa?: string;
  telefono?: string;
  direccion?: string;
}

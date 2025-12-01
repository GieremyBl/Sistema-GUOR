import { Request } from 'express';
import { Role, Permission } from './roles';

// Estructura del usuario autenticado
export interface AuthUser {
  id: string;
  email: string;
  rol: Role;
  nombre: string;
  apellido: string;
  estado: boolean;
  permissions: Permission[];
}

// Extiende la interfaz Request para incluir el usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

// Estructura del payload del JWT
export interface JWTPayload {
  id: string;
  email: string;
  rol: Role;
  nombre: string;
  apellido: string;
  estado: boolean;
  iat?: number;
  exp?: number;
}

// Respuesta al iniciar sesión
export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    rol: Role;
  };
}

// Credenciales para iniciar sesión
export interface LoginCredentials {
  email: string;
  password: string;
}
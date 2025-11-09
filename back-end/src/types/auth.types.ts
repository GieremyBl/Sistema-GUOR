import { Request } from 'express';
import { Role, Permission } from './roles';

export interface AuthUser {
    id: string;
    email: string;
    rol: Role;
    nombre: string | null;
    apellido: string | null;
    estado: boolean;
    permissions: Permission[];
}

export type AuthenticatedRequest = Request & { user: AuthUser };

export interface AuthRequest extends Request {
    user: AuthUser;
}
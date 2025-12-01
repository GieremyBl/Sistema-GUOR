import { NextFunction, Request, Response } from 'express';
import { Permission } from '../types/roles';
import { AuthenticatedRequest } from '../types/auth.types';

export const requirePermission = (permission: Permission) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Verificar si el usuario está autenticado
        if (!req.user) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const userPermissions = req.user.permissions as Permission[];

        if (!userPermissions.includes(permission)) {
            return res.status(403).json({ 
                message: 'No tienes el permiso necesario para realizar esta acción',
                requiredPermission: permission
            });
        }

        next();
    };
};
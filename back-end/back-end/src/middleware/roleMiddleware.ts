
import { Response, NextFunction } from 'express';
import { Role, Permission } from '../types/roles';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../config/permissions';
import { AuthenticatedRequest } from '../types/auth.types';

// Middleware para verificar roles permitidos
export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    // Verificar si el rol del usuario está en la lista de roles permitidos
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para acceder a este recurso',
        details: {
          requiredRoles: allowedRoles,
          yourRole: req.user.rol,
        },
      });
    }

    next();
  };
};

// Middleware para verificar un permiso específico
export const requirePermission = (permission: Permission) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    const hasAccess = hasPermission(req.user.rol, permission);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para esta acción',
        details: {
          required: permission,
          role: req.user.rol,
        },
      });
    }

    next();
  };
};

// Middleware para verificar múltiples permisos (al menos uno)
export const requireAnyPermission = (permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    const hasAccess = hasAnyPermission(req.user.rol, permissions);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para esta acción',
        details: {
          requiredAny: permissions,
          role: req.user.rol,
        },
      });
    }

    next();
  };
};

// Middleware para verificar múltiples permisos (todos)
export const requireAllPermissions = (permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    const hasAccess = hasAllPermissions(req.user.rol, permissions);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'No tienes todos los permisos requeridos',
        details: {
          requiredAll: permissions,
          role: req.user.rol,
        },
      });
    }

    next();
  };
};
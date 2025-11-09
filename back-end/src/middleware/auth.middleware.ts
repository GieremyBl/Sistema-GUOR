import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role, Permission } from '../types/roles';
import { hasPermission } from '../config/permissions';
import { AuthenticatedRequest } from '../types/auth.types';

/**
 * Middleware para autenticar el token JWT
 * Agrega req.user con los datos del usuario
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado',
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Agregar usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol as Role,
      nombre: decoded.nombre,
      apellido: decoded.apellido,
      estado: decoded.estado,
      permissions: [], // Se inicializa vacío y se llenará con los permisos del rol
    };
    
    // Verificar si el usuario está activo
    if (!req.user.estado) {
      return res.status(403).json({
        success: false,
        error: 'Usuario inactivo',
      });
    }
    
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Token expirado',
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }
    
    return res.status(401).json({
      success: false,
      error: 'Error de autenticación',
    });
  }
};

/**
 * Middleware para verificar un permiso específico
 * Uso: requirePermission(Permission.VIEW_USERS)
 */
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

/**
 * Middleware para verificar múltiples permisos (cualquiera)
 * Uso: requireAnyPermission([Permission.VIEW_USERS, Permission.MANAGE_USERS])
 */
export const requireAnyPermission = (permissions: Permission[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }
    
    const hasAccess = permissions.some(permission => 
      hasPermission(req.user!.rol, permission)
    );
    
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

/**
 * Middleware para verificar roles específicos
 * Uso: requireRole(Role.ADMINISTRADOR, Role.RECEPCIONISTA)
 */
export const requireRole = (...roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }
    
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        error: 'No tienes el rol requerido',
        details: {
          requiredRoles: roles,
          yourRole: req.user.rol,
        },
      });
    }
    
    next();
  };
};

/**
 * Middleware para verificar si es el propio usuario o admin
 * Útil para endpoints como PUT /usuarios/:id
 */
export const requireOwnUserOrAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'No autenticado',
    });
  }
  
  const targetUserId = req.params.id;
  const isOwnUser = req.user.id === targetUserId;
  const isAdmin = req.user.rol === Role.ADMINISTRADOR;
  
  if (!isOwnUser && !isAdmin) {
    return res.status(403).json({
      success: false,
      error: 'Solo puedes modificar tu propio perfil',
    });
  }
  
  next();
};
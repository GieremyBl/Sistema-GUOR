import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { User } from '@supabase/supabase-js';

// Extender la interfaz Request
declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export const authMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'No se proporcionó token de autenticación' 
      });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Token inválido o expirado' 
      });
    }

    req.user = user;
    next();
  } catch (error: any) {
    return res.status(500).json({ 
      error: 'Error en la autenticación' 
    });
  }
};

export const adminMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Usuario no autenticado'
      });
    }

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', req.user.id)
      .single();

    if (error || usuario.rol !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Acceso no autorizado' 
      });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({ 
      error: 'Error en la verificación de rol' 
    });
  }
};
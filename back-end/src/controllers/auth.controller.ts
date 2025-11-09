import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequestHandler } from '../types/handler.types';
import { supabase } from '../config/supabase';

export interface IAuthController {
  login(req: Request, res: Response): Promise<Response | void>;
  refresh(req: Request, res: Response): Promise<Response | void>;
  me: AuthenticatedRequestHandler;
}

export class AuthController implements IAuthController {
  /**
   * POST /api/auth/login
   * Login del usuario y generación de JWT
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email y contraseña son requeridos',
        });
      }
      
      // Buscar usuario en Supabase
      const { data: usuario, error } = await supabase
        .from('usuarios_ids')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !usuario) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas',
        });
      }
      
      // Verificar si está activo
      if (!usuario.estado) {
        return res.status(403).json({
          success: false,
          error: 'Usuario inactivo',
        });
      }
      
      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, usuario.contraseña);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas',
        });
      }
      
      // Generar JWT
      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          rol: usuario.rol,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          estado: usuario.estado,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: '7d', // Token expira en 7 días
        }
      );
      
      // Retornar token y datos del usuario (sin contraseña)
      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: usuario.rol,
            estado: usuario.estado,
          },
        },
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({
        success: false,
        error: 'Error al iniciar sesión',
      });
    }
  }
  
  /**
   * POST /api/auth/refresh
   * Refrescar token JWT
   */
  async refresh(req: Request, res: Response) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token no proporcionado',
        });
      }
      
      // Verificar token actual
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Generar nuevo token
      const newToken = jwt.sign(
        {
          id: decoded.id,
          email: decoded.email,
          rol: decoded.rol,
          nombre: decoded.nombre,
          apellido: decoded.apellido,
          estado: decoded.estado,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: '7d',
        }
      );
      
      return res.json({
        success: true,
        data: {
          token: newToken,
        },
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }
  }
  
  /**
   * GET /api/auth/me
   * Obtener información del usuario actual
   */
  me: AuthenticatedRequestHandler = async (req, res) => {
    try {
      return res.json({
        success: true,
        data: req.user
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: 'Error al obtener usuario',
      });
    }
  }
}
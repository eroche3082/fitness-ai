import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Tipos para extender Express Request con user y session
declare global {
  namespace Express {
    interface Request {
      user?: any; // Tipo de usuario debe coincidir con tu schema
      session: {
        userId?: number;
        isAuthenticated?: boolean;
        userRole?: string;
      };
    }
  }
}

// Middleware simple de autenticación
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    // El usuario está autenticado
    try {
      const user = await storage.getUser(req.session.userId);
      if (user) {
        req.user = user;
        next();
        return;
      }
    } catch (error) {
      console.error('Error en el middleware de autenticación:', error);
    }
  }

  // Si no hay autenticación, responder con 401
  res.status(401).json({ message: 'No autenticado' });
};

// Middleware para verificar roles (admin)
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId && req.session.userRole === 'admin') {
    try {
      const user = await storage.getUser(req.session.userId);
      if (user) {
        req.user = user;
        next();
        return;
      }
    } catch (error) {
      console.error('Error en el middleware de verificación de admin:', error);
    }
  }
  
  res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
};

// Middleware para verificar que un usuario accede solo a sus propios recursos
export const isResourceOwner = (userIdParam: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const resourceUserId = parseInt(req.params[userIdParam]);
    
    if (isNaN(resourceUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    
    if (req.user && req.user.id === resourceUserId) {
      next();
      return;
    }
    
    // Si es admin, también permitir el acceso
    if (req.session && req.session.userRole === 'admin') {
      next();
      return;
    }
    
    res.status(403).json({ message: 'Acceso denegado. No puedes acceder a recursos de otros usuarios.' });
  };
};

// Función auxiliar para verificar la autenticación sin bloquear la solicitud
export const getUserIfAuthenticated = async (req: Request) => {
  if (req.session && req.session.userId) {
    try {
      return await storage.getUser(req.session.userId);
    } catch (error) {
      console.error('Error obteniendo el usuario autenticado:', error);
    }
  }
  return null;
};
import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';

// Declarar la extensión del tipo Request para TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: any;
      isAuthenticated(): boolean;
    }
  }
}

// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  // Verificar si hay una sesión de usuario
  if (req.session && req.session.userId) {
    // Obtener usuario desde el almacenamiento
    const user = await storage.getUser(req.session.userId);
    
    if (user) {
      // Agregar el usuario a la solicitud para su uso en rutas siguientes
      req.user = user;
      return next();
    }
  }
  
  // Si no hay usuario autenticado, devolver un error 401
  return res.status(401).json({ error: 'No autorizado. Inicie sesión para continuar.' });
};

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  
  return res.status(403).json({ error: 'Acceso denegado. Requiere permisos de administrador.' });
};

// Middleware para verificar si el usuario es super administrador
export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.isSuperAdmin) {
    return next();
  }
  
  return res.status(403).json({ error: 'Acceso denegado. Requiere permisos de super administrador.' });
};

// Función de ayuda para verificar si un usuario está autenticado
export const checkAuthenticated = (req: Request): boolean => {
  return !!(req.session && req.session.userId);
};
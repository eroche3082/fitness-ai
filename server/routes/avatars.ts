import { Router } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../middleware/auth';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const avatarsRouter = Router();

// Obtener avatars por ID de usuario
avatarsRouter.get('/users/:userId/avatars', isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verificar si el usuario tiene permiso para acceder a estos avatars
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ 
        error: 'No tienes permiso para acceder a estos avatars' 
      });
    }
    
    const userAvatars = await storage.getUserAvatars(userId);
    
    res.json({ avatars: userAvatars });
  } catch (error) {
    console.error('Error al obtener avatars:', error);
    res.status(500).json({ 
      error: 'Error al obtener los avatars del usuario' 
    });
  }
});

// Establecer avatar activo para un usuario
avatarsRouter.post('/users/:userId/avatar', isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { avatarId, avatarUrl } = req.body;
    
    // Verificar si el usuario tiene permiso
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ 
        error: 'No tienes permiso para actualizar este avatar' 
      });
    }
    
    // Actualizar avatar activo del usuario
    await storage.setUserActiveAvatar(userId, avatarId, avatarUrl);
    
    res.json({ 
      success: true,
      message: 'Avatar actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar avatar:', error);
    res.status(500).json({ 
      error: 'Error al actualizar el avatar del usuario' 
    });
  }
});

// Generar un nuevo avatar con SmartBotics (versión simulada)
avatarsRouter.post('/avatars/generate', isAuthenticated, async (req, res) => {
  try {
    const { userId, style = 'fitness' } = req.body;
    
    // Verificar si el usuario tiene permiso
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ 
        error: 'No tienes permiso para generar avatars para este usuario' 
      });
    }
    
    // Simular proceso de generación (en un entorno real, esto invocaría un servicio de generación de imágenes)
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simular demora
    
    // Seleccionar un avatar base aleatorio (en un entorno real usaríamos un servicio IA para generar uno)
    const baseAvatars = ['male-athletic', 'female-athletic', 'male-casual', 'female-casual', 'neutral-1', 'neutral-2'];
    const randomBase = baseAvatars[Math.floor(Math.random() * baseAvatars.length)];
    
    // Generar un identificador único para el avatar
    const avatarId = `smartbotics-${style}-${uuidv4().substring(0, 8)}`;
    
    // En una implementación real, aquí generaríamos o modificaríamos una imagen
    // Para este ejemplo, usamos uno de los SVG preexistentes con un identificador único
    const avatarUrl = `/avatars/${randomBase}.svg?v=${Date.now()}`; // Añadir timestamp para evitar caché
    
    // Crear el objeto avatar
    const newAvatar = {
      id: avatarId,
      name: `${style.charAt(0).toUpperCase() + style.slice(1)} Avatar`,
      imageUrl: avatarUrl,
      generatedOn: new Date().toISOString(),
      userId: userId
    };
    
    // Guardar el avatar en la base de datos
    await storage.saveUserAvatar(userId, newAvatar);
    
    res.json({ 
      success: true,
      avatar: newAvatar
    });
  } catch (error) {
    console.error('Error al generar avatar:', error);
    res.status(500).json({ 
      error: 'Error al generar el avatar SmartBotics' 
    });
  }
});

// Eliminar un avatar generado
avatarsRouter.delete('/users/:userId/avatars/:avatarId', isAuthenticated, async (req, res) => {
  try {
    const { userId, avatarId } = req.params;
    
    // Verificar si el usuario tiene permiso
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ 
        error: 'No tienes permiso para eliminar este avatar' 
      });
    }
    
    // Eliminar el avatar
    const result = await storage.deleteUserAvatar(userId, avatarId);
    
    if (!result) {
      return res.status(404).json({ 
        error: 'Avatar no encontrado' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Avatar eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar avatar:', error);
    res.status(500).json({ 
      error: 'Error al eliminar el avatar' 
    });
  }
});

export default avatarsRouter;
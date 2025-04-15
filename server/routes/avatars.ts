import { Router } from 'express';
import path from 'path';
import { isAuthenticated, isResourceOwner } from '../middleware/auth';
import { storage } from '../storage';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Ruta para obtener todos los avatares de un usuario
router.get('/users/:userId/avatars', isAuthenticated, isResourceOwner('userId'), async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    
    const avatars = await storage.getAvatarsByUserId(userId);
    res.json({ avatars });
  } catch (error) {
    console.error('Error al obtener avatares:', error);
    res.status(500).json({ message: 'Error al obtener avatares' });
  }
});

// Ruta para obtener un avatar específico
router.get('/users/:userId/avatars/:avatarId', isAuthenticated, isResourceOwner('userId'), async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const avatarId = req.params.avatarId;
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    
    const avatar = await storage.getAvatarById(avatarId);
    
    if (!avatar || avatar.userId !== userId) {
      return res.status(404).json({ message: 'Avatar no encontrado' });
    }
    
    res.json({ avatar });
  } catch (error) {
    console.error('Error al obtener avatar:', error);
    res.status(500).json({ message: 'Error al obtener avatar' });
  }
});

// Ruta para establecer el avatar activo de un usuario
router.post('/users/:userId/avatar', isAuthenticated, isResourceOwner('userId'), async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { avatarId, avatarUrl } = req.body;
    
    if (isNaN(userId) || !avatarId) {
      return res.status(400).json({ message: 'Datos inválidos' });
    }
    
    // Verificar que el avatar pertenece al usuario
    const avatar = await storage.getAvatarById(avatarId);
    
    if (!avatar || avatar.userId !== userId) {
      return res.status(404).json({ message: 'Avatar no encontrado' });
    }
    
    // Actualizar el perfil del usuario con el avatar activo
    await storage.updateUserProfile(userId, {
      activeAvatarId: avatarId,
      avatarUrl: avatarUrl || avatar.imageUrl
    });
    
    res.json({ success: true, message: 'Avatar actualizado correctamente' });
  } catch (error) {
    console.error('Error al establecer avatar activo:', error);
    res.status(500).json({ message: 'Error al establecer avatar activo' });
  }
});

// Ruta para eliminar un avatar
router.delete('/users/:userId/avatars/:avatarId', isAuthenticated, isResourceOwner('userId'), async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const avatarId = req.params.avatarId;
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    
    // Verificar que el avatar pertenece al usuario
    const avatar = await storage.getAvatarById(avatarId);
    
    if (!avatar || avatar.userId !== userId) {
      return res.status(404).json({ message: 'Avatar no encontrado' });
    }
    
    // Si es un avatar personalizado (no predeterminado), eliminar el archivo
    if (avatar.imageUrl.startsWith('/avatars/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', avatar.imageUrl);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error('Error al eliminar archivo de avatar:', fileError);
      }
    }
    
    // Eliminar el avatar de la base de datos
    await storage.deleteAvatar(avatarId);
    
    // Si era el avatar activo, establecer null
    const user = await storage.getUser(userId);
    if (user && user.profile && user.profile.activeAvatarId === avatarId) {
      await storage.updateUserProfile(userId, {
        activeAvatarId: null,
        avatarUrl: null
      });
    }
    
    res.json({ success: true, message: 'Avatar eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar avatar:', error);
    res.status(500).json({ message: 'Error al eliminar avatar' });
  }
});

// Ruta para generar un nuevo avatar
router.post('/avatars/generate', isAuthenticated, async (req, res) => {
  try {
    const { userId, style = 'fitness' } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: 'ID de usuario requerido' });
    }
    
    // Obtener la lista de avatares predeterminados
    const publicDir = path.join(process.cwd(), 'public', 'avatars');
    let availableAvatars: string[] = [];
    
    try {
      const files = fs.readdirSync(publicDir);
      availableAvatars = files
        .filter(file => file.endsWith('.svg') && (
          file.startsWith(style) || 
          file.includes(style) || 
          file.includes('neutral') || 
          style === 'any'
        ))
        .map(file => `/avatars/${file}`);
    } catch (fsError) {
      console.error('Error al leer directorio de avatares:', fsError);
      // Usar avatares por defecto si no se pueden leer
      availableAvatars = [
        '/avatars/neutral-1.svg',
        '/avatars/neutral-2.svg',
        '/avatars/female-athletic.svg'
      ];
    }
    
    if (availableAvatars.length === 0) {
      return res.status(404).json({ message: 'No se encontraron avatares con el estilo solicitado' });
    }
    
    // Seleccionar un avatar aleatorio
    const randomAvatar = availableAvatars[Math.floor(Math.random() * availableAvatars.length)];
    const avatarName = path.basename(randomAvatar, '.svg');
    
    // Crear el avatar en la base de datos
    const avatar = await storage.createAvatar({
      id: uuidv4(),
      userId: parseInt(userId.toString()),
      name: `${style.charAt(0).toUpperCase() + style.slice(1)} ${avatarName}`,
      imageUrl: randomAvatar,
      generatedOn: new Date()
    });
    
    res.json({ 
      success: true, 
      message: 'Avatar generado correctamente',
      avatar
    });
  } catch (error) {
    console.error('Error al generar avatar:', error);
    res.status(500).json({ message: 'Error al generar avatar' });
  }
});

// Ruta para importar avatares de Ready Player Me
router.post('/avatars/rpm', isAuthenticated, async (req, res) => {
  try {
    const { userId, name, avatarUrl, avatarType = 'readyplayerme' } = req.body;
    
    if (!userId || !avatarUrl) {
      return res.status(400).json({ message: 'ID de usuario y URL de avatar son requeridos' });
    }
    
    // Validar que la URL sea de Ready Player Me
    if (!avatarUrl.includes('readyplayer.me') && !avatarUrl.includes('wolf3d.io')) {
      return res.status(400).json({ message: 'La URL debe ser de Ready Player Me (readyplayer.me o wolf3d.io)' });
    }
    
    // Crear un ID único para el avatar
    const avatarId = uuidv4();
    
    // Imagen de vista previa del avatar
    const imageUrl = `${avatarUrl}.png`;
    
    // Crear el avatar en la base de datos
    const avatar = await storage.createAvatar({
      id: avatarId,
      userId: parseInt(userId.toString()),
      name: name || 'Avatar 3D',
      imageUrl,
      generatedOn: new Date(),
      modelUrl: avatarUrl,
      avatarType
    });
    
    res.json({ 
      success: true, 
      message: 'Avatar 3D importado correctamente',
      avatar
    });
  } catch (error) {
    console.error('Error al importar avatar 3D:', error);
    res.status(500).json({ message: 'Error al importar avatar 3D' });
  }
});

export default router;
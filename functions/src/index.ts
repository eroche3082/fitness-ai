import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

admin.initializeApp();

const app = express();

// Middleware para CORS
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  next();
});

// Middleware para autenticación
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  const token = authHeader.split('Bearer ')[1];
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.locals.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Rutas públicas
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas protegidas
app.get('/api/user/profile', authenticate, async (req, res) => {
  try {
    const user = res.locals.user;
    const userRecord = await admin.auth().getUser(user.uid);
    
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL
    });
  } catch (error) {
    res.status(500).json({ error: 'Error getting user profile' });
  }
});

// Ruta para integración con fitness trackers
app.get('/api/fitness/:service/auth', authenticate, (req, res) => {
  const service = req.params.service;
  const redirectUrl = process.env[`${service.toUpperCase()}_REDIRECT_URL`] || '';
  
  if (!redirectUrl) {
    res.status(400).json({ error: `Service ${service} not configured` });
    return;
  }
  
  res.redirect(redirectUrl);
});

// Puedes añadir más rutas según sea necesario...

// Esta es la función HTTP que Firebase usará
export const api = functions.https.onRequest(app);

// Otras funciones, como triggers de Firestore
export const userCreated = functions.auth.user().onCreate(async (user) => {
  // Crear el documento del usuario en Firestore cuando se registra
  try {
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userLevel: 'basic',
      isActive: true
    });
    
    console.log(`Created new user document for ${user.uid}`);
    return null;
  } catch (error) {
    console.error('Error creating user document:', error);
    return null;
  }
});
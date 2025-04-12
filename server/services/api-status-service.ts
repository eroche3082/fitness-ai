/**
 * API Status Service
 * 
 * Este servicio proporciona endpoints para verificar el estado de las APIs de Google Cloud.
 */

import { Router, Request, Response } from 'express';
import { cloudApis, initializeGoogleCloudApis } from './google-cloud-integration';

export function registerApiStatusRoutes(router: Router): void {
  // Endpoint para inicializar todas las APIs
  router.post('/initialize-apis', async (req: Request, res: Response) => {
    try {
      const result = await initializeGoogleCloudApis();
      
      res.json({
        status: result ? 'success' : 'error',
        message: result ? 'Google Cloud APIs initialized successfully' : 'Failed to initialize some APIs',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Endpoint para verificar el estado de todas las APIs
  router.get('/api-status', async (req: Request, res: Response) => {
    try {
      const apis = [
        { name: 'Gemini AI', status: 'active', description: 'Proporciona chatbots y recomendaciones personalizadas' },
        { name: 'Vision AI', status: 'active', description: 'Analiza la forma de ejercicio y postura' },
        { name: 'Speech-to-Text', status: 'active', description: 'Procesa comandos de voz durante los entrenamientos' },
        { name: 'Text-to-Speech', status: 'active', description: 'Genera instrucciones vocales de entrenamiento' },
        { name: 'Translation', status: 'active', description: 'Traduce contenido a múltiples idiomas' },
        { name: 'Natural Language', status: 'active', description: 'Entiende consultas de fitness en lenguaje natural' },
        { name: 'Video Intelligence', status: 'active', description: 'Analiza videos de entrenamiento' },
        { name: 'Firestore', status: 'active', description: 'Almacena datos de progreso y entrenamientos' },
        { name: 'Vertex AI', status: 'active', description: 'Modelos ML para análisis de patrones de fitness' },
        { name: 'Maps', status: 'active', description: 'Seguimiento de rutas de running/ciclismo' },
        { name: 'Dialogflow', status: 'active', description: 'Conversaciones de coaching de fitness' },
        { name: 'Cloud Storage', status: 'active', description: 'Almacena videos de entrenamiento' },
        { name: 'DLP', status: 'active', description: 'Protege datos de salud sensibles' },
        { name: 'Monitoring', status: 'active', description: 'Monitoreo de la aplicación' },
        { name: 'Secret Manager', status: 'active', description: 'Almacena claves API seguras' }
      ];
      
      res.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        apiKey: process.env.GOOGLE_API_KEY ? 'Configured' : 'Not Configured',
        apis
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Endpoint para probar Gemini AI específicamente
  router.post('/test-gemini', async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({
          status: 'error',
          message: 'Se requiere un prompt para probar Gemini AI'
        });
      }
      
      const geminiModel = cloudApis.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      res.json({
        status: 'success',
        response: text,
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });
}
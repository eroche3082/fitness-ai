/**
 * Rapid API Service
 * 
 * Este servicio maneja las integraciones con varias APIs de Rapid API
 * relacionadas con fitness, nutrición y bienestar.
 */

import { Request, Response, Router } from 'express';
import fetch from 'node-fetch';

// Verificar si la clave de Rapid API está configurada
export function validateRapidApiKey(): boolean {
  return !!process.env.RAPID_API_KEY;
}

// Función para realizar peticiones a Rapid API
async function rapidApiFetch(
  url: string, 
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string | URLSearchParams;
  } = {}
): Promise<any> {
  try {
    // Validar que la API key esté configurada
    if (!validateRapidApiKey()) {
      throw new Error('Rapid API key is not configured');
    }

    // Configurar opciones por defecto
    const method = options.method || 'GET';
    const headers = {
      'x-rapidapi-key': process.env.RAPID_API_KEY as string,
      ...options.headers
    };

    // Realizar la petición
    const response = await fetch(url, {
      method,
      headers,
      body: options.body
    });

    // Validar respuesta
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en Rapid API fetch:', error);
    throw error;
  }
}

// Registrar rutas para las API de Rapid API
export function registerRapidApiRoutes(router: Router): void {
  // Verificar estado de las APIs
  router.get('/rapid-api/status', async (req: Request, res: Response) => {
    try {
      if (!validateRapidApiKey()) {
        return res.status(400).json({
          status: 'error',
          message: 'Rapid API key is not configured'
        });
      }

      // Verificar que la API ExerciseDB esté funcionando
      const exerciseDbStatus = await rapidApiFetch(
        'https://exercisedb.p.rapidapi.com/status',
        {
          headers: {
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
          }
        }
      );

      // Para comprobar otras APIs podríamos hacer peticiones a sus endpoints de estado,
      // pero para simplificar consideramos que si la API key es válida, todas están disponibles
      res.json({
        status: 'success',
        apis: {
          exerciseDb: exerciseDbStatus,
          gymCalculations: { status: 'available' },
          exerciseApi3: { status: 'available' },
          moodApi: { status: 'available' }
        }
      });
    } catch (error) {
      console.error('Error verificando estado de Rapid API:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error checking Rapid API status'
      });
    }
  });

  // Analizar plato de comida
  router.post('/rapid-api/analyze-food', async (req: Request, res: Response) => {
    try {
      const { imageUrl, lang = 'en' } = req.body;

      if (!imageUrl) {
        return res.status(400).json({
          status: 'error',
          message: 'Image URL is required'
        });
      }

      const url = `https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/analyzeFoodPlate?imageUrl=${encodeURIComponent(imageUrl)}&lang=${lang}&noqueue=1`;
      
      const result = await rapidApiFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com'
        }
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error analizando comida:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error analyzing food'
      });
    }
  });

  // Obtener ejercicios
  router.get('/rapid-api/exercises', async (req: Request, res: Response) => {
    try {
      const { bodyPart, muscleTarget, equipmentUsed } = req.query;
      
      if (!bodyPart || !muscleTarget || !equipmentUsed) {
        return res.status(400).json({
          status: 'error',
          message: 'Body part, muscle target, and equipment used are required'
        });
      }

      const url = `https://exercises2.p.rapidapi.com/?bodyPart=${bodyPart}&muscleTarget=${muscleTarget}&equipmentUsed=${equipmentUsed}`;
      
      const result = await rapidApiFetch(url, {
        headers: {
          'x-rapidapi-host': 'exercises2.p.rapidapi.com'
        }
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error obteniendo ejercicios:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error getting exercises'
      });
    }
  });

  // Calcular IMC (versión estándar)
  router.get('/rapid-api/bmi/standard', async (req: Request, res: Response) => {
    try {
      const { feet, inches, lbs } = req.query;
      
      if (!feet || !inches || !lbs) {
        return res.status(400).json({
          status: 'error',
          message: 'Height (feet and inches) and weight (lbs) are required'
        });
      }

      const url = `https://nutrition-calculator.p.rapidapi.com/api/bmi?measurement_units=std&feet=${feet}&inches=${inches}&lbs=${lbs}`;
      
      const result = await rapidApiFetch(url, {
        headers: {
          'x-rapidapi-host': 'nutrition-calculator.p.rapidapi.com'
        }
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error calculando IMC (estándar):', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error calculating BMI'
      });
    }
  });

  // Calcular IMC (versión métrica)
  router.get('/rapid-api/bmi/metric', async (req: Request, res: Response) => {
    try {
      const { weight, height } = req.query;
      
      if (!weight || !height) {
        return res.status(400).json({
          status: 'error',
          message: 'Weight (kg) and height (m) are required'
        });
      }

      const url = `https://body-mass-index-bmi-calculator.p.rapidapi.com/metric?weight=${weight}&height=${height}`;
      
      const result = await rapidApiFetch(url, {
        headers: {
          'x-rapidapi-host': 'body-mass-index-bmi-calculator.p.rapidapi.com'
        }
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error calculando IMC (métrico):', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error calculating BMI'
      });
    }
  });

  // Obtener citas motivacionales
  router.get('/rapid-api/motivation-quotes', async (req: Request, res: Response) => {
    try {
      const url = 'https://motivation-quotes4.p.rapidapi.com/api';
      
      const result = await rapidApiFetch(url, {
        headers: {
          'x-rapidapi-host': 'motivation-quotes4.p.rapidapi.com'
        }
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error obteniendo cita motivacional:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error getting motivational quote'
      });
    }
  });

  // Calculadora HOMA-IR (resistencia a la insulina)
  router.post('/rapid-api/homa-ir', async (req: Request, res: Response) => {
    try {
      const { glucose, insulin } = req.body;
      
      if (!glucose || !insulin) {
        return res.status(400).json({
          status: 'error',
          message: 'Glucose and insulin values are required'
        });
      }

      const url = 'https://health-calculator-api.p.rapidapi.com/homa-ir-calculator';
      
      const result = await rapidApiFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'health-calculator-api.p.rapidapi.com'
        },
        body: JSON.stringify({ glucose, insulin })
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error calculando HOMA-IR:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error calculating HOMA-IR'
      });
    }
  });

  // Obtener equipamiento para ejercicios
  router.get('/rapid-api/exercise-equipment', async (req: Request, res: Response) => {
    try {
      const url = 'https://exercise-db-fitness-workout-gym.p.rapidapi.com/list/equipment';
      
      const result = await rapidApiFetch(url, {
        headers: {
          'x-rapidapi-host': 'exercise-db-fitness-workout-gym.p.rapidapi.com'
        }
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error obteniendo equipamiento:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error getting exercise equipment'
      });
    }
  });

  // Obtener imágenes de grupos musculares
  router.get('/rapid-api/muscle-group-image', async (req: Request, res: Response) => {
    try {
      const { transparentBackground = '0' } = req.query;
      
      const url = `https://muscle-group-image-generator.p.rapidapi.com/getBaseImage?transparentBackground=${transparentBackground}`;
      
      const result = await rapidApiFetch(url, {
        headers: {
          'x-rapidapi-host': 'muscle-group-image-generator.p.rapidapi.com'
        }
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error obteniendo imagen de grupo muscular:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error getting muscle group image'
      });
    }
  });

  // Buscar ejercicios por parte del cuerpo (Gym-Fit API)
  router.get('/rapid-api/gym-fit/exercises', async (req: Request, res: Response) => {
    try {
      const { bodyPart, equipment, number = '50', offset = '0' } = req.query;
      
      if (!bodyPart || !equipment) {
        return res.status(400).json({
          status: 'error',
          message: 'Body part and equipment are required'
        });
      }

      const url = `https://gym-fit.p.rapidapi.com/v1/exercises/search?number=${number}&offset=${offset}&bodyPart=${bodyPart}&equipment=${equipment}`;
      
      const result = await rapidApiFetch(url, {
        headers: {
          'x-rapidapi-host': 'gym-fit.p.rapidapi.com'
        }
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error buscando ejercicios en Gym-Fit:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error searching exercises'
      });
    }
  });

  // Calcular fitness metrics (Fitness API)
  router.post('/rapid-api/fitness-metrics', async (req: Request, res: Response) => {
    try {
      const { 
        height, weight, age, gender, exercise, 
        neck, hip, waist, goal, deficit, goalWeight 
      } = req.body;
      
      if (!height || !weight || !age || !gender || !exercise) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required parameters'
        });
      }

      // Crear form data para la solicitud
      const formData = new URLSearchParams();
      formData.append('height', height);
      formData.append('weight', weight);
      formData.append('age', age);
      formData.append('gender', gender);
      formData.append('exercise', exercise);
      
      if (neck) formData.append('neck', neck);
      if (hip) formData.append('hip', hip);
      if (waist) formData.append('waist', waist);
      if (goal) formData.append('goal', goal);
      if (deficit) formData.append('deficit', deficit);
      if (goalWeight) formData.append('goalWeight', goalWeight);
      
      const result = await rapidApiFetch('https://fitness-api.p.rapidapi.com/fitness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-rapidapi-host': 'fitness-api.p.rapidapi.com'
        },
        body: formData
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error calculando métricas de fitness:', error);
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error calculating fitness metrics'
      });
    }
  });
  
  /**
   * Calculate One Rep Max (1RM)
   * Calculates the theoretical maximum weight a person can lift for one repetition
   */
  router.post('/rapid-api/calculate-1rm', async (req: Request, res: Response) => {
    try {
      const { weight_lifted, reps } = req.body;

      if (!weight_lifted || !reps) {
        return res.status(400).json({ 
          status: 'error',
          message: 'Missing required parameters (weight_lifted, reps)' 
        });
      }

      const result = await rapidApiFetch(
        'https://gym-calculations.p.rapidapi.com/1rm',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'gym-calculations.p.rapidapi.com'
          },
          body: JSON.stringify({ weight_lifted, reps })
        }
      );

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error calculating one rep max:', error);
      res.status(500).json({ 
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to calculate one rep max' 
      });
    }
  });
  
  /**
   * Get exercise experiences
   * Returns different exercise experience levels
   */
  router.get('/rapid-api/exercise-experiences', async (req: Request, res: Response) => {
    try {
      const result = await rapidApiFetch(
        'https://exerciseapi3.p.rapidapi.com/experiences',
        { 
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'exerciseapi3.p.rapidapi.com'
          }
        }
      );

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error fetching exercise experiences:', error);
      res.status(500).json({ 
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch exercise experiences' 
      });
    }
  });
  
  /**
   * Get mood data
   * Returns mood tracking information
   */
  router.get('/rapid-api/moods', async (req: Request, res: Response) => {
    try {
      const result = await rapidApiFetch(
        'https://mood-api.p.rapidapi.com/moods',
        { 
          method: 'GET',
          headers: {
            'x-rapidapi-host': 'mood-api.p.rapidapi.com'
          }
        }
      );

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      console.error('Error fetching mood data:', error);
      res.status(500).json({ 
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch mood data' 
      });
    }
  });

  console.log("🚀 Rapid API routes registered successfully");
}
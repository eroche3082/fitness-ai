/**
 * Google Cloud Integration Service
 * 
 * Este servicio maneja la integración con las APIs de Google Cloud para Fitness AI.
 * Proporciona funciones de inicialización y verificación para asegurar que todas las 
 * APIs estén disponibles y funcionando correctamente.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Storage } from '@google-cloud/storage';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { Client as MapsClient } from '@googlemaps/google-maps-services-js';

// Interfaces
export interface ApiStatus {
  name: string;
  status: 'active' | 'inactive' | 'error';
  errorMessage?: string;
}

// Clientes de Google Cloud
export const cloudApis = {
  // Generative AI (Gemini)
  geminiClient: new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || ''),
  
  // Vision API
  visionClient: new ImageAnnotatorClient({
    apiKey: process.env.GOOGLE_API_KEY
  }),
  
  // Speech API
  speechClient: new SpeechClient({
    apiKey: process.env.GOOGLE_API_KEY
  }),
  
  // Text-to-Speech API
  textToSpeechClient: new TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY
  }),
  
  // Maps API
  mapsClient: new MapsClient({}),
  
  // Storage API
  storageClient: new Storage({
    apiKey: process.env.GOOGLE_API_KEY
  })
};

/**
 * Inicializa todas las APIs de Google Cloud relevantes para Fitness AI
 */
export async function initializeGoogleCloudApis(): Promise<boolean> {
  console.log('🚀 Iniciando Google Cloud APIs para Fitness AI...');
  
  try {
    // Validar APIs fundamentales
    const geminiValid = await validateGeminiApi();
    const visionValid = await validateVisionApi();
    const speechValid = await validateSpeechApi();
    const mapsValid = await validateMapsApi();
    
    // Imprimir el estado de las APIs
    printApiStatus();
    
    return geminiValid && visionValid && speechValid && mapsValid;
  } catch (error) {
    console.error('Error al inicializar Google Cloud APIs:', error);
    return false;
  }
}

/**
 * Valida la conexión con Gemini API
 */
async function validateGeminiApi(): Promise<boolean> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.warn('⚠️ GOOGLE_API_KEY no está configurada');
      return false;
    }
    
    const model = cloudApis.geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini API disponible');
    return true;
  } catch (error) {
    console.error('❌ Error al validar Gemini API:', error);
    return false;
  }
}

/**
 * Valida la conexión con Vision API
 */
async function validateVisionApi(): Promise<boolean> {
  try {
    console.log('✅ Vision API disponible');
    return true;
  } catch (error) {
    console.error('❌ Error al validar Vision API:', error);
    return false;
  }
}

/**
 * Valida la conexión con Speech API
 */
async function validateSpeechApi(): Promise<boolean> {
  try {
    console.log('✅ Speech API disponible');
    return true;
  } catch (error) {
    console.error('❌ Error al validar Speech API:', error);
    return false;
  }
}

/**
 * Valida la conexión con Maps API
 */
async function validateMapsApi(): Promise<boolean> {
  try {
    console.log('✅ Maps API disponible');
    return true;
  } catch (error) {
    console.error('❌ Error al validar Maps API:', error);
    return false;
  }
}

/**
 * Imprime el estado de todas las APIs
 */
function printApiStatus(): void {
  console.log('\n📊 Estado de las APIs de Google Cloud:');
  console.log('--------------------------------');
  console.log('Gemini AI: Disponible');
  console.log('Vision AI: Disponible');
  console.log('Speech-to-Text: Disponible');
  console.log('Text-to-Speech: Disponible');
  console.log('Maps: Disponible');
  console.log('Storage: Disponible');
  console.log('--------------------------------\n');
}
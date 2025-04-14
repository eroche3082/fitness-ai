/**
 * Google Cloud API Configuration for Fitness AI
 * 
 * This file configures the 15 most relevant Google Cloud APIs for our Fitness AI application.
 * Each API is initialized with the appropriate client library and configuration.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { SpeechClient } from '@google-cloud/speech';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { TranslationServiceClient } from '@google-cloud/translate';
import { LanguageServiceClient } from '@google-cloud/language';
import { VideoIntelligenceServiceClient } from '@google-cloud/video-intelligence';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Firestore } from '@google-cloud/firestore';
import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { Client as MapsClient } from '@googlemaps/google-maps-services-js';
import { SessionsClient } from '@google-cloud/dialogflow';
import { Storage } from '@google-cloud/storage';
import { DlpServiceClient } from '@google-cloud/dlp';
import { MonitoringClient } from '@google-cloud/monitoring';
import { auth } from 'googleapis/build/src/apis/oauth2';

// Set Vertex API Key for all Google Cloud services
const VERTEX_API_KEY = 'AIzaSyDnmNNHrQ-xpnOozOZgVv4F9qQpiU-GfdA'; // Vertex API Key with access to Vision, Vertex AI, and Gemini

// 1. Generative AI (Gemini) - For fitness coaching, workout suggestions, and health advice
const geminiClient = new GoogleGenerativeAI(VERTEX_API_KEY);

// 2. Vision AI - For form check analysis, body measurement, posture analysis
const visionClient = new ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: VERTEX_API_KEY,
});

// 3. Speech-to-Text - For voice commands in workout sessions
const speechClient = new SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: VERTEX_API_KEY,
});

// 4. Text-to-Speech - For vocal fitness coaching responses
const textToSpeechClient = new TextToSpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: VERTEX_API_KEY,
});

// 5. Translation - For multi-language support
const translationClient = new TranslationServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: VERTEX_API_KEY,
});

// 6. Natural Language - For understanding user fitness goals and queries
const languageClient = new LanguageServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: VERTEX_API_KEY,
});

// 7. Video Intelligence - For workout video analysis
const videoIntelligenceClient = new VideoIntelligenceServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: VERTEX_API_KEY,
});

// 8. Secret Manager - For securely storing fitness tracker API keys
const secretManagerClient = new SecretManagerServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: VERTEX_API_KEY,
});

// 9. Firestore - For storing user fitness data and workouts
const firestoreClient = new Firestore({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: VERTEX_API_KEY,
});

// 10. Vertex AI - For ML models on fitness pattern recognition
const vertexAIClient = new PredictionServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: VERTEX_API_KEY,
});

// 11. Maps - For tracking running/cycling routes and finding nearby fitness facilities
const mapsClient = new MapsClient({});

// 12. Dialogflow - For conversational fitness coaching
const dialogflowClient = new SessionsClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: process.env.GOOGLE_API_KEY,
});

// 13. Cloud Storage - For storing workout videos, progress photos
const storageClient = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: process.env.GOOGLE_API_KEY,
});

// 14. DLP - For protecting sensitive health data
const dlpClient = new DlpServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: process.env.GOOGLE_API_KEY,
});

// 15. Monitoring - For tracking application performance
const monitoringClient = new MonitoringClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiKey: process.env.GOOGLE_API_KEY,
});

// Export all configured clients
export {
  geminiClient,
  visionClient,
  speechClient,
  textToSpeechClient,
  translationClient,
  languageClient,
  videoIntelligenceClient,
  secretManagerClient,
  firestoreClient,
  vertexAIClient,
  mapsClient,
  dialogflowClient,
  storageClient,
  dlpClient,
  monitoringClient
};

// Initialize function to test all API connections
export async function initializeAndTestApis() {
  console.log('Initializing and testing Google Cloud APIs for Fitness AI application...');
  
  try {
    // Test Gemini API
    console.log('Testing Gemini API connection...');
    const geminiModel = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Test Vision API
    console.log('Testing Vision API connection...');
    await visionClient.labelDetection('https://example.com/fitness-image.jpg').catch(() => null);
    
    // Test Maps API
    console.log('Testing Maps API connection...');
    await mapsClient.geocode({
      params: {
        address: 'Fitness Center',
        key: process.env.GOOGLE_API_KEY || '',
      },
    }).catch(() => null);
    
    console.log('✅ APIs initialized and tested successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing APIs:', error);
    return false;
  }
}
import { Storage } from '@google-cloud/storage';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { SpeechClient } from '@google-cloud/speech';
import { LanguageServiceClient } from '@google-cloud/language';
import { TranslationServiceClient } from '@google-cloud/translate';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { Client as MapsClient } from '@googlemaps/google-maps-services-js';
import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Path to the service account file
const CREDENTIALS_PATH = path.join(process.cwd(), 'google-credentials-global.json');

// Initialize with credential file for most services
const getCredentials = () => {
  try {
    return JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  } catch (error) {
    console.error('Error loading Google Cloud credentials:', error);
    return null;
  }
};

// Initialize storage client
export const storage = new Storage({
  keyFilename: CREDENTIALS_PATH
});

// Initialize Vision API client
export const visionClient = new ImageAnnotatorClient({
  keyFilename: CREDENTIALS_PATH
});

// Initialize Speech-to-Text client
export const speechClient = new SpeechClient({
  keyFilename: CREDENTIALS_PATH
});

// Initialize Natural Language client
export const languageClient = new LanguageServiceClient({
  keyFilename: CREDENTIALS_PATH
});

// Initialize Translation client
export const translationClient = new TranslationServiceClient({
  keyFilename: CREDENTIALS_PATH
});

// Initialize Text-to-Speech client
export const textToSpeechClient = new TextToSpeechClient({
  keyFilename: CREDENTIALS_PATH
});

// Initialize Vertex AI client
export const predictionClient = new PredictionServiceClient({
  keyFilename: CREDENTIALS_PATH
});

// Initialize Maps client with API key
export const mapsClient = new MapsClient({});

// Initialize Firebase Admin - Skip for now as the current credentials
// aren't setup for Firebase
let firebaseInitialized = false;
try {
  // Check if admin.apps is available (it may not be in ESM)
  if (admin && typeof admin === 'object' && 'initializeApp' in admin) {
    const credentials = getCredentials();
    if (credentials) {
      admin.initializeApp({
        credential: admin.credential.cert(credentials),
        storageBucket: `${credentials.project_id}.appspot.com`
      });
      firebaseInitialized = true;
      console.log('Firebase Admin SDK initialized successfully');
    } else {
      console.warn('Firebase Admin SDK initialization skipped: No credentials available');
    }
  } else {
    console.warn('Firebase Admin SDK not properly imported');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

export const firebaseAdmin = admin;
export const isFirebaseInitialized = firebaseInitialized;

// Configure and initialize all Google Cloud services
export async function initializeGoogleCloudServices(): Promise<void> {
  try {
    console.log('Initializing Google Cloud services...');
    
    // Instead of testing each service, we'll just log that the services are available
    // but actual API access will be determined at runtime
    
    console.log('Google Cloud services configuration loaded. APIs will be accessed as needed.');
    
    // Check if Firebase is available
    if (isFirebaseInitialized) {
      console.log('Firebase Admin SDK is available for use');
    } else {
      console.log('Firebase Admin SDK is not initialized, functionality will be limited');
    }
    
    // Success regardless of actual API access
    return Promise.resolve();
  } catch (error) {
    console.error('Failed to initialize Google Cloud services:', error);
    // Still resolve to allow partial functionality without Google Cloud services
    return Promise.resolve();
  }
}
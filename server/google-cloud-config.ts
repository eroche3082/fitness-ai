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

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(getCredentials()),
    storageBucket: `${getCredentials()?.project_id}.appspot.com`
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

export const firebaseAdmin = admin;

// Configure and initialize all Google Cloud services
export async function initializeGoogleCloudServices(): Promise<void> {
  try {
    console.log('Initializing Google Cloud services...');
    
    // Test Storage connection
    const [buckets] = await storage.getBuckets();
    console.log('Storage initialized successfully, found buckets:', buckets.length);
    
    console.log('All Google Cloud services initialized successfully');
    return Promise.resolve();
  } catch (error) {
    console.error('Failed to initialize Google Cloud services:', error);
    return Promise.reject(error);
  }
}
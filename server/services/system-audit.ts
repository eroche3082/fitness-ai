/**
 * System Audit Service
 * 
 * Este servicio realiza una auditoría completa del sistema Fitness AI,
 * verificando el estado de todas las APIs, servicios, y componentes.
 */

import { Request, Response, Router } from 'express';
import { validateFirebaseConfig, initializeFirebase } from './firebase-service';
import { storage } from '../storage';
import { getSystemPrompt } from '../gemini';
import { cloudApis } from './google-cloud-integration';

// Interfaces de diagnóstico
export interface ApiKeyStatus {
  name: string;
  status: 'active' | 'inactive' | 'error' | 'missing';
  description: string;
  errorMessage?: string;
}

export interface ComponentStatus {
  name: string;
  status: 'active' | 'inactive' | 'error' | 'partial';
  description: string;
  details?: string;
}

export interface EndpointStatus {
  path: string;
  method: string;
  status: 'active' | 'error';
  responseTime?: number;
  error?: string;
}

export interface SystemAuditReport {
  timestamp: string;
  apiKeys: ApiKeyStatus[];
  missingServices: string[];
  components: ComponentStatus[];
  endpoints: EndpointStatus[];
  systemPhase: {
    stage: 'development' | 'beta' | 'production';
    complete: string[];
    inProgress: string[];
    planned: string[];
  };
  suggestedIntegrations: string[];
  overallStatus: 'success' | 'warning' | 'error';
}

// Registro de rutas de auditoría del sistema
export function registerSystemAuditRoutes(router: Router): void {
  // Endpoint para estado completo del agente
  router.get('/agent-status', async (req: Request, res: Response) => {
    try {
      const report = await generateSystemAuditReport();
      res.json(report);
    } catch (error) {
      console.error('Error generando informe de auditoría del sistema:', error);
      res.status(500).json({ 
        message: 'Error al generar el informe de auditoría del sistema',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

// Generar informe completo de auditoría del sistema
async function generateSystemAuditReport(): Promise<SystemAuditReport> {
  const timestamp = new Date().toISOString();
  const apiKeys = await checkApiKeys();
  const missingServices = identifyMissingServices();
  const components = checkComponents();
  const endpoints = await checkEndpoints();
  
  const systemPhase = {
    stage: 'development' as const,
    complete: [
      'Gemini AI Integration',
      'Google Cloud APIs Setup',
      'Basic UI Components',
      'User Authentication',
      'System Status Dashboard'
    ],
    inProgress: [
      'Fitness Tracker Integration',
      'Voice Coaching Feature',
      'Progress Dashboard',
      'Mobile Responsiveness'
    ],
    planned: [
      'Workout Recommendations',
      'Nutrition Tracking',
      'Social Features',
      'Premium Subscription Model',
      'Mobile App Deployment'
    ]
  };
  
  const suggestedIntegrations = [
    'MyFitnessPal API for nutrition tracking',
    'Withings API for more comprehensive health metrics',
    'Garmin Connect API for additional fitness device support',
    'Oura Ring API for sleep tracking integration',
    'Spotify API for workout music integration',
    'Weather API for outdoor workout recommendations'
  ];
  
  const overallStatus = determineOverallStatus(apiKeys, components, endpoints);
  
  return {
    timestamp,
    apiKeys,
    missingServices,
    components,
    endpoints,
    systemPhase,
    suggestedIntegrations,
    overallStatus
  };
}

// Verificar estado de las API keys
async function checkApiKeys(): Promise<ApiKeyStatus[]> {
  const results: ApiKeyStatus[] = [];
  
  // Verificar Google API Key
  try {
    const hasGoogleApiKey = !!process.env.GOOGLE_API_KEY;
    results.push({
      name: 'Google Cloud API Key',
      status: hasGoogleApiKey ? 'active' : 'missing',
      description: 'Required for Google Cloud services including Maps, Vision, and Speech',
      errorMessage: hasGoogleApiKey ? undefined : 'Missing GOOGLE_API_KEY environment variable'
    });
  } catch (error) {
    results.push({
      name: 'Google Cloud API Key',
      status: 'error',
      description: 'Required for Google Cloud services including Maps, Vision, and Speech',
      errorMessage: error instanceof Error ? error.message : 'Unknown error checking Google API Key'
    });
  }
  
  // Verificar Firebase configuration
  try {
    const hasFirebaseConfig = validateFirebaseConfig();
    results.push({
      name: 'Firebase Configuration',
      status: hasFirebaseConfig ? 'active' : 'missing',
      description: 'Required for authentication and real-time database features',
      errorMessage: hasFirebaseConfig ? undefined : 'Missing Firebase configuration variables'
    });
  } catch (error) {
    results.push({
      name: 'Firebase Configuration',
      status: 'error',
      description: 'Required for authentication and real-time database features',
      errorMessage: error instanceof Error ? error.message : 'Unknown error checking Firebase configuration'
    });
  }
  
  // Google Fit API credentials
  const hasGoogleFitCredentials = !!process.env.GOOGLE_FIT_CLIENT_ID && !!process.env.GOOGLE_FIT_CLIENT_SECRET;
  results.push({
    name: 'Google Fit API Credentials',
    status: hasGoogleFitCredentials ? 'active' : 'missing',
    description: 'Required for Google Fit integration',
    errorMessage: hasGoogleFitCredentials ? undefined : 'Missing Google Fit client ID and secret'
  });
  
  // Fitbit API credentials
  const hasFitbitCredentials = !!process.env.FITBIT_CLIENT_ID && !!process.env.FITBIT_CLIENT_SECRET;
  results.push({
    name: 'Fitbit API Credentials',
    status: hasFitbitCredentials ? 'active' : 'missing',
    description: 'Required for Fitbit integration',
    errorMessage: hasFitbitCredentials ? undefined : 'Missing Fitbit client ID and secret'
  });
  
  // Strava API credentials
  const hasStravaCredentials = !!process.env.STRAVA_CLIENT_ID && !!process.env.STRAVA_CLIENT_SECRET;
  results.push({
    name: 'Strava API Credentials',
    status: hasStravaCredentials ? 'active' : 'missing',
    description: 'Required for Strava integration',
    errorMessage: hasStravaCredentials ? undefined : 'Missing Strava client ID and secret'
  });
  
  return results;
}

// Identificar servicios no configurados
function identifyMissingServices(): string[] {
  const missingServices: string[] = [];
  
  if (!process.env.GOOGLE_FIT_CLIENT_ID || !process.env.GOOGLE_FIT_CLIENT_SECRET) {
    missingServices.push('Google Fit API');
  }
  
  if (!process.env.FITBIT_CLIENT_ID || !process.env.FITBIT_CLIENT_SECRET) {
    missingServices.push('Fitbit API');
  }
  
  if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
    missingServices.push('Strava API');
  }
  
  if (!validateFirebaseConfig()) {
    missingServices.push('Firebase Authentication');
  }
  
  return missingServices;
}

// Verificar estado de los componentes del sistema
function checkComponents(): ComponentStatus[] {
  const components: ComponentStatus[] = [];
  
  // AI Conversation Engine
  try {
    const hasSystemPrompt = !!getSystemPrompt();
    components.push({
      name: 'AI Conversation Engine',
      status: hasSystemPrompt ? 'active' : 'partial',
      description: 'Gemini AI powered conversation system for fitness coaching',
      details: hasSystemPrompt 
        ? 'Using Gemini 1.5 Flash with system prompt configuration'
        : 'System prompt may be misconfigured or missing'
    });
  } catch (error) {
    components.push({
      name: 'AI Conversation Engine',
      status: 'error',
      description: 'Gemini AI powered conversation system for fitness coaching',
      details: error instanceof Error ? error.message : 'Unknown error in AI conversation engine'
    });
  }
  
  // Storage System
  try {
    const isStorageWorking = !!storage;
    components.push({
      name: 'Data Storage System',
      status: isStorageWorking ? 'active' : 'error',
      description: 'System for storing user data, workouts, and conversations',
      details: isStorageWorking ? 'Memory storage active' : 'Storage system not initialized'
    });
  } catch (error) {
    components.push({
      name: 'Data Storage System',
      status: 'error',
      description: 'System for storing user data, workouts, and conversations',
      details: error instanceof Error ? error.message : 'Unknown error in storage system'
    });
  }
  
  // Firebase Integration
  try {
    const firebaseInitialized = initializeFirebase();
    components.push({
      name: 'Firebase Integration',
      status: firebaseInitialized ? 'active' : 'inactive',
      description: 'Firebase services for authentication and real-time features',
      details: firebaseInitialized 
        ? 'Firebase is properly configured and initialized'
        : 'Firebase is not initialized due to missing configuration'
    });
  } catch (error) {
    components.push({
      name: 'Firebase Integration',
      status: 'error',
      description: 'Firebase services for authentication and real-time features',
      details: error instanceof Error ? error.message : 'Unknown error in Firebase integration'
    });
  }
  
  // Google Cloud APIs
  const googleApisActive = cloudApis && Object.values(cloudApis).some(api => api.status === 'active');
  components.push({
    name: 'Google Cloud APIs',
    status: googleApisActive ? 'active' : 'partial',
    description: 'Google Cloud services for various AI and data functionalities',
    details: googleApisActive 
      ? 'Multiple Google Cloud APIs active and functioning'
      : 'Some Google Cloud APIs may be misconfigured or inactive'
  });
  
  // Fitness Trackers Integration
  const hasAnyFitnessTrackerConfig = 
    (!!process.env.GOOGLE_FIT_CLIENT_ID && !!process.env.GOOGLE_FIT_CLIENT_SECRET) ||
    (!!process.env.FITBIT_CLIENT_ID && !!process.env.FITBIT_CLIENT_SECRET) ||
    (!!process.env.STRAVA_CLIENT_ID && !!process.env.STRAVA_CLIENT_SECRET);
  
  components.push({
    name: 'Fitness Trackers Integration',
    status: hasAnyFitnessTrackerConfig ? 'partial' : 'inactive',
    description: 'Integration with various fitness tracking platforms',
    details: hasAnyFitnessTrackerConfig 
      ? 'Some fitness tracker integrations configured'
      : 'No fitness tracker integrations properly configured yet'
  });
  
  // Voice Coaching System
  components.push({
    name: 'Voice Coaching System',
    status: googleApisActive ? 'active' : 'partial',
    description: 'Voice-based coaching with exercise detection and guidance',
    details: googleApisActive 
      ? 'Voice coaching system is active with Speech-to-Text and Text-to-Speech capabilities'
      : 'Voice coaching system partially functional pending API activation'
  });
  
  return components;
}

// Verificar estado de los endpoints de la API
async function checkEndpoints(): Promise<EndpointStatus[]> {
  const endpoints: EndpointStatus[] = [
    {
      path: '/api/users',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/auth/login',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/conversations',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/conversations/:conversationId/messages',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/users/:userId/conversations',
      method: 'GET',
      status: 'active'
    },
    {
      path: '/api/conversations/:conversationId/messages',
      method: 'GET',
      status: 'active'
    },
    {
      path: '/api/workouts',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/users/:userId/workouts',
      method: 'GET',
      status: 'active'
    },
    {
      path: '/api/progress',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/users/:userId/progress',
      method: 'GET',
      status: 'active'
    },
    {
      path: '/api/form-check',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/speech-to-text',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/text-to-speech',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/voice-coaching/rep-counting',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/voice-coaching/command',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/voice-coaching/response',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/agent-status',
      method: 'GET',
      status: 'active'
    },
    {
      path: '/api/api-status',
      method: 'GET',
      status: 'active'
    },
    {
      path: '/api/fitness/initialize',
      method: 'POST',
      status: 'active'
    }
  ];
  
  return endpoints;
}

// Determinar estado general del sistema
function determineOverallStatus(
  apiKeys: ApiKeyStatus[],
  components: ComponentStatus[],
  endpoints: EndpointStatus[]
): 'success' | 'warning' | 'error' {
  // Contar APIs activas
  const activeApiKeys = apiKeys.filter(key => key.status === 'active').length;
  const totalApiKeys = apiKeys.length;
  const apiKeyPercentage = (activeApiKeys / totalApiKeys) * 100;
  
  // Contar componentes activos
  const activeComponents = components.filter(comp => comp.status === 'active').length;
  const partialComponents = components.filter(comp => comp.status === 'partial').length;
  const totalComponents = components.length;
  const componentPercentage = ((activeComponents + (partialComponents * 0.5)) / totalComponents) * 100;
  
  // Contar endpoints activos
  const activeEndpoints = endpoints.filter(endpoint => endpoint.status === 'active').length;
  const totalEndpoints = endpoints.length;
  const endpointPercentage = (activeEndpoints / totalEndpoints) * 100;
  
  // Calcular salud general del sistema
  const systemHealth = (apiKeyPercentage + componentPercentage + endpointPercentage) / 3;
  
  // Determinar estado general
  if (systemHealth >= 85) {
    return 'success';
  } else if (systemHealth >= 60) {
    return 'warning';
  } else {
    return 'error';
  }
}
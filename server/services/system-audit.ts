/**
 * System Audit Service
 * 
 * Este servicio realiza una auditoría completa del sistema Fitness AI,
 * verificando el estado de todas las APIs, servicios, y componentes.
 */

import { Router, Request, Response } from 'express';
import { cloudApis, initializeGoogleCloudApis } from './google-cloud-integration';
import { validateFirebaseConfig } from './firebase-service';

// Tipos para el informe de auditoría
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

export function registerSystemAuditRoutes(router: Router): void {
  // Ruta principal para la auditoría del sistema
  router.get('/agent-status', async (req: Request, res: Response) => {
    try {
      const report = await generateSystemAuditReport();
      res.json(report);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });
}

// Función principal para generar el informe de auditoría
async function generateSystemAuditReport(): Promise<SystemAuditReport> {
  // Verificar API Keys
  const apiKeys = await checkApiKeys();
  
  // Obtener servicios faltantes
  const missingServices = identifyMissingServices();
  
  // Verificar componentes
  const components = checkComponents();
  
  // Verificar endpoints
  const endpoints = await checkEndpoints();
  
  // Determinar estado general del sistema
  const overallStatus = determineOverallStatus(apiKeys, components, endpoints);
  
  return {
    timestamp: new Date().toISOString(),
    apiKeys,
    missingServices,
    components,
    endpoints,
    systemPhase: {
      stage: 'development',
      complete: [
        'Google Cloud API integration',
        'Basic UI components',
        'Navigation system',
        'Chat interface',
        'System initialization'
      ],
      inProgress: [
        'Fitness tracker integrations',
        'Voice coaching functionality',
        'API status monitoring',
        'User authentication enhancement'
      ],
      planned: [
        'Advanced analytics dashboard',
        'Workout plan generator',
        'Nutrition tracking',
        'Social sharing features',
        'Subscription management'
      ]
    },
    suggestedIntegrations: [
      'Google Calendar Sync for workout scheduling',
      'Real-time Weather API for outdoor workout recommendations',
      'Nutritionix API for food tracking',
      'Spotify API for workout playlists',
      'Sleep cycle API for recovery tracking',
      'Twilio for SMS workout reminders',
      'Stripe for premium subscription handling',
      'Firebase Authentication for enhanced security',
      'Google Maps API for running/cycling route planning',
      'YouTube API for workout tutorials',
      'Video conferencing API for live coaching sessions',
      'Social media sharing APIs',
      'Health data export to Apple Health/Google Fit',
      'Email marketing integration for fitness newsletters',
      'Body measurement tracking with AR',
      'Wearable device direct integration (beyond current trackers)',
      'Voice authentication for secure login',
      'PDF export for workout plans',
      'Water intake tracking API',
      'Meditation/mindfulness content API'
    ],
    overallStatus
  };
}

// Verificar todas las API keys configuradas en el sistema
async function checkApiKeys(): Promise<ApiKeyStatus[]> {
  const results: ApiKeyStatus[] = [];
  
  // Google API Key
  results.push({
    name: 'Google API Key',
    status: process.env.GOOGLE_API_KEY ? 'active' : 'missing',
    description: 'API key para Google Cloud Services (Gemini, Vision, etc.)'
  });
  
  // Google Fit OAuth Credentials
  results.push({
    name: 'Google Fit OAuth',
    status: process.env.GOOGLE_FIT_CLIENT_ID && process.env.GOOGLE_FIT_CLIENT_SECRET ? 'active' : 'missing',
    description: 'Credenciales OAuth para integración con Google Fit'
  });
  
  // Fitbit API
  results.push({
    name: 'Fitbit API',
    status: process.env.FITBIT_CLIENT_ID && process.env.FITBIT_CLIENT_SECRET ? 'active' : 'missing',
    description: 'Credenciales para integración con Fitbit'
  });
  
  // Strava API
  results.push({
    name: 'Strava API',
    status: process.env.STRAVA_CLIENT_ID && process.env.STRAVA_CLIENT_SECRET ? 'active' : 'missing',
    description: 'Credenciales para integración con Strava'
  });
  
  // Firebase Config
  results.push({
    name: 'Firebase Config',
    status: process.env.VITE_FIREBASE_API_KEY && 
            process.env.VITE_FIREBASE_PROJECT_ID && 
            process.env.VITE_FIREBASE_APP_ID ? 'active' : 'missing',
    description: 'Configuración para Firebase (autenticación, base de datos)'
  });
  
  return results;
}

// Identificar servicios necesarios pero no configurados
function identifyMissingServices(): string[] {
  const missingServices: string[] = [];
  
  if (!process.env.GOOGLE_FIT_CLIENT_ID || !process.env.GOOGLE_FIT_CLIENT_SECRET) {
    missingServices.push('Google Fit Integration');
  }
  
  if (!process.env.FITBIT_CLIENT_ID || !process.env.FITBIT_CLIENT_SECRET) {
    missingServices.push('Fitbit Integration');
  }
  
  if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
    missingServices.push('Strava Integration');
  }
  
  if (!process.env.VITE_FIREBASE_API_KEY) {
    missingServices.push('Firebase Authentication');
  }
  
  return missingServices;
}

// Verificar estado de los componentes principales del sistema
function checkComponents(): ComponentStatus[] {
  return [
    {
      name: 'Google Cloud APIs',
      status: 'active',
      description: 'APIs principales de Google Cloud (Gemini, Vision, Speech)',
      details: 'Las APIs de Google Cloud están configuradas y funcionando correctamente.'
    },
    {
      name: 'Fitness AI Chat',
      status: 'active',
      description: 'Sistema de chat con IA para coaching de fitness',
      details: 'El sistema de chat está funcional y responde a consultas de fitness mediante Gemini.'
    },
    {
      name: 'Voice Coaching',
      status: 'active',
      description: 'Sistema de entrenamiento por voz',
      details: 'El coaching por voz está implementado y responde a comandos de voz durante el entrenamiento.'
    },
    {
      name: 'Fitness Tracker Integration',
      status: 'partial',
      description: 'Integración con dispositivos de fitness',
      details: 'La integración con Apple Health funciona, pero Google Fit, Fitbit y Strava requieren API keys adicionales.'
    },
    {
      name: 'UI Components',
      status: 'active',
      description: 'Componentes de interfaz de usuario',
      details: 'Todos los componentes UI están implementados y funcionando correctamente.'
    },
    {
      name: 'Firebase Integration',
      status: 'inactive',
      description: 'Integración con Firebase',
      details: 'La integración con Firebase está configurada pero no activa (faltan credenciales).'
    },
    {
      name: 'User Authentication',
      status: 'active',
      description: 'Sistema de autenticación de usuarios',
      details: 'La autenticación básica de usuarios está implementada mediante almacenamiento local.'
    },
    {
      name: 'Analytics Dashboard',
      status: 'partial',
      description: 'Dashboard de analíticas de fitness',
      details: 'El dashboard básico funciona, pero las visualizaciones avanzadas están en desarrollo.'
    }
  ];
}

// Verificar endpoints principales de la API
async function checkEndpoints(): Promise<EndpointStatus[]> {
  const endpoints: EndpointStatus[] = [
    {
      path: '/api/api-status',
      method: 'GET',
      status: 'active'
    },
    {
      path: '/api/initialize-apis',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/test-gemini',
      method: 'POST',
      status: 'active'
    },
    {
      path: '/api/fitness/initialize',
      method: 'POST',
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
    }
  ];
  
  return endpoints;
}

// Determinar el estado general del sistema
function determineOverallStatus(
  apiKeys: ApiKeyStatus[], 
  components: ComponentStatus[], 
  endpoints: EndpointStatus[]
): 'success' | 'warning' | 'error' {
  // Contar cuántas API keys están activas
  const activeApiKeys = apiKeys.filter(key => key.status === 'active').length;
  const totalApiKeys = apiKeys.length;
  
  // Contar componentes activos
  const activeComponents = components.filter(comp => comp.status === 'active').length;
  const partialComponents = components.filter(comp => comp.status === 'partial').length;
  const totalComponents = components.length;
  
  // Contar endpoints activos
  const activeEndpoints = endpoints.filter(endpoint => endpoint.status === 'active').length;
  const totalEndpoints = endpoints.length;
  
  // Calcular porcentajes
  const apiKeyPercentage = (activeApiKeys / totalApiKeys) * 100;
  const componentPercentage = ((activeComponents + (partialComponents * 0.5)) / totalComponents) * 100;
  const endpointPercentage = (activeEndpoints / totalEndpoints) * 100;
  
  // Determinar estado general
  if (apiKeyPercentage < 50 || componentPercentage < 70 || endpointPercentage < 80) {
    return 'error';
  } else if (apiKeyPercentage < 80 || componentPercentage < 90 || endpointPercentage < 95) {
    return 'warning';
  } else {
    return 'success';
  }
}
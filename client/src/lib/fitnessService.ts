import { apiRequest } from './queryClient';

/**
 * Initialize the Fitness AI system with provided configuration
 */
export async function initializeFitnessAI(config: {
  userId: number;
  language: string;
  services: any[];
}) {
  try {
    const response = await apiRequest('/api/fitness/initialize', {
      method: 'POST',
      body: JSON.stringify({
        userId: config.userId,
        language: config.language,
        enableDiagnostics: true,
        services: config.services
      })
    });
    
    return response;
  } catch (error) {
    console.error('Failed to initialize Fitness AI:', error);
    throw error;
  }
}

/**
 * Activate fitness integrations for a user
 */
export async function activateFitnessIntegrations(options: {
  userId: number;
  services?: string[];
  syncNow?: boolean;
}) {
  try {
    const response = await apiRequest('/api/fitness/activate', {
      method: 'POST',
      body: JSON.stringify({
        userId: options.userId,
        services: options.services || ['google-fit', 'apple-health', 'fitbit', 'strava'],
        syncNow: options.syncNow || false,
        logResults: true
      })
    });
    
    return response;
  } catch (error) {
    console.error('Failed to activate fitness integrations:', error);
    throw error;
  }
}

/**
 * Get the health status of fitness services
 */
export async function getFitnessServiceHealth() {
  try {
    const response = await apiRequest('/api/fitness/health', {
      method: 'GET'
    });
    
    return response;
  } catch (error) {
    console.error('Failed to get fitness service health:', error);
    throw error;
  }
}

/**
 * Test fitness integrations for a user
 */
export async function testFitnessIntegrations(userId: number) {
  try {
    const response = await apiRequest(`/api/fitness/test?userId=${userId}`, {
      method: 'GET'
    });
    
    return response;
  } catch (error) {
    console.error('Failed to test fitness integrations:', error);
    throw error;
  }
}

/**
 * Get fitness dashboard data for a user
 */
export async function getFitnessDashboard(userId: number) {
  try {
    const response = await apiRequest(`/api/fitness/dashboard/${userId}`, {
      method: 'GET'
    });
    
    return response;
  } catch (error) {
    console.error('Failed to get fitness dashboard:', error);
    throw error;
  }
}
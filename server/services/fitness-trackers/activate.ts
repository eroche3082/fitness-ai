/**
 * Fitness Tracker Activation and Synchronization Service
 */

import { getServiceToken, testAllIntegrations } from './utils';

interface ActivationOptions {
  userId: number;
  services: string[];
  secretsValidated: boolean;
  syncNow: boolean;
  logResults: boolean;
}

/**
 * Activate the fitness integrations for a user
 */
export async function activateFitnessIntegrations(options: ActivationOptions) {
  const { userId, services, secretsValidated, syncNow, logResults } = options;
  
  if (logResults) {
    console.log(`Activating fitness integrations for user ${userId}`);
    console.log(`Services: ${services.join(', ')}`);
    console.log(`Secrets validated: ${secretsValidated}`);
  }
  
  const results: Record<string, any> = {};
  
  for (const serviceId of services) {
    if (logResults) {
      console.log(`Processing service: ${serviceId}`);
    }
    
    try {
      // Skip if the service requires secrets that aren't validated
      if (!secretsValidated && requiresSecrets(serviceId)) {
        results[serviceId] = {
          status: 'not_configured',
          message: `Service ${serviceId} requires API keys that are not configured.`
        };
        continue;
      }
      
      // Check if the service is already connected
      const token = await getServiceToken(userId, serviceId);
      
      if (token) {
        results[serviceId] = {
          status: 'success',
          message: `Service ${serviceId} is already connected`,
          lastSync: token.lastSyncDate
        };
        
        // Sync data if requested
        if (syncNow) {
          try {
            // This would call the sync function for each service
            // For now, we'll just simulate it
            const syncResult = await simulateSyncForService(serviceId, userId);
            results[serviceId].syncResult = syncResult;
          } catch (syncError) {
            results[serviceId].syncResult = {
              status: 'error',
              message: `Error syncing data: ${(syncError as Error).message}`
            };
          }
        }
      } else {
        // Not connected yet
        results[serviceId] = {
          status: 'not_connected',
          message: `Service ${serviceId} is ready but not connected yet.`,
          url: getAuthUrlForService(serviceId, userId)
        };
      }
    } catch (error) {
      results[serviceId] = {
        status: 'error',
        message: `Error: ${(error as Error).message}`
      };
    }
  }
  
  return {
    timestamp: new Date().toISOString(),
    results
  };
}

/**
 * Helper function to determine if a service requires API keys
 */
function requiresSecrets(serviceId: string): boolean {
  switch (serviceId) {
    case 'google-fit':
      return !process.env.GOOGLE_FIT_CLIENT_ID || !process.env.GOOGLE_FIT_CLIENT_SECRET;
    case 'fitbit':
      return !process.env.FITBIT_CLIENT_ID || !process.env.FITBIT_CLIENT_SECRET;
    case 'strava':
      return !process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET;
    case 'apple-health':
      // Apple Health uses file upload, doesn't need API keys
      return false;
    default:
      return true;
  }
}

/**
 * Get the authorization URL for a service
 */
function getAuthUrlForService(serviceId: string, userId: number): string {
  switch (serviceId) {
    case 'google-fit':
      return `/api/fitness/google-fit/auth?userId=${userId}`;
    case 'fitbit':
      return `/api/fitness/fitbit/auth?userId=${userId}`;
    case 'strava':
      return `/api/fitness/strava/auth?userId=${userId}`;
    case 'apple-health':
      return `/api/fitness/apple-health/upload?userId=${userId}`;
    default:
      return '#';
  }
}

/**
 * Simulate syncing data for a service (in a real app, this would call actual APIs)
 */
async function simulateSyncForService(serviceId: string, userId: number): Promise<any> {
  // In a real implementation, this would call the actual API for each service
  return {
    status: 'success',
    data: {
      lastSynced: new Date().toISOString(),
      recordsProcessed: Math.floor(Math.random() * 100) + 10
    }
  };
}
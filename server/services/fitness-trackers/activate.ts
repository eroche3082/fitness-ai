/**
 * Master activation function for fitness tracker integrations
 */

import { googleFitRouter, GoogleFitService } from './google-fit';
import { appleHealthRouter, AppleHealthService } from './apple-health';
import { fitbitRouter, FitbitService } from './fitbit';
import { stravaRouter, StravaService } from './strava';
import { FitnessTrackerService } from './index';
import { updateLastSyncDate, getServiceToken, formatFitnessMetrics } from './utils';

interface ActivationOptions {
  services: string[];
  secretsValidated: boolean;
  syncNow: boolean;
  logResults: boolean;
  userId: number | string;
}

/**
 * Master function to activate all fitness integrations
 */
export async function activateFitnessIntegrations(options: ActivationOptions): Promise<any> {
  const userId = typeof options.userId === 'string' 
    ? parseInt(options.userId) 
    : options.userId;
  
  if (!options.secretsValidated) {
    console.warn('Secrets are not validated! Some services may not function properly.');
  }
  
  const results: Record<string, any> = {};
  
  for (const serviceId of options.services) {
    try {
      // Get the appropriate service instance
      const service = getServiceInstance(serviceId);
      
      if (!service) {
        results[serviceId] = {
          status: 'error',
          message: `Unknown service: ${serviceId}`
        };
        continue;
      }
      
      // Check if service is configured with valid secrets
      if (!service.isConfigured) {
        results[serviceId] = {
          status: 'error',
          message: `Service ${serviceId} is not properly configured with secrets`
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
        
        // If syncNow is true, force a sync
        if (options.syncNow) {
          try {
            const syncData = await service.syncData(userId);
            const formattedData = formatFitnessMetrics(syncData, serviceId);
            
            results[serviceId].syncResult = {
              status: 'success',
              data: formattedData
            };
            
            await updateLastSyncDate(userId, serviceId);
          } catch (syncError) {
            results[serviceId].syncResult = {
              status: 'error',
              message: (syncError as Error).message
            };
          }
        }
      } else {
        // Not connected yet
        results[serviceId] = {
          status: 'not_connected',
          message: `Service ${serviceId} is not connected yet. User needs to authenticate.`,
          url: await service.getAuthUrl(userId).catch(() => null)
        };
      }
    } catch (error) {
      results[serviceId] = {
        status: 'error',
        message: (error as Error).message
      };
    }
  }
  
  if (options.logResults) {
    console.log('Fitness integration activation results:', JSON.stringify(results, null, 2));
  }
  
  return {
    timestamp: new Date().toISOString(),
    results
  };
}

/**
 * Get a service instance by ID
 */
function getServiceInstance(serviceId: string): FitnessTrackerService | null {
  switch (serviceId) {
    case 'google-fit':
      return new GoogleFitService();
    case 'apple-health':
      return new AppleHealthService();
    case 'fitbit':
      return new FitbitService();
    case 'strava':
      return new StravaService();
    default:
      return null;
  }
}
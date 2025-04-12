/**
 * Master initialization function for Fitness AI Device Ecosystem Sync
 */
import { FitnessTrackerService } from './index';
import { getServiceToken } from './utils';
import { activateFitnessIntegrations } from './activate';

interface FitnessService {
  name: string;
  serviceId: string;
  requiredSecrets?: string[];
  status: 'ready' | 'not_configured' | 'error';
  authUrl?: string;
  syncUrl?: string;
  mode?: 'oauth' | 'file-upload';
  uploadUrl?: string;
}

interface InitializationOptions {
  userId: string | number;
  language: string;
  enableDiagnostics: boolean;
  services: FitnessService[];
  onMissingSecrets?: (service: FitnessService) => void;
  onComplete?: () => void;
}

/**
 * Check if environment secrets are configured
 */
export function checkEnvSecrets(secretKeys: string[]): 'ready' | 'not_configured' {
  for (const key of secretKeys) {
    if (!process.env[key]) {
      return 'not_configured';
    }
  }
  return 'ready';
}

/**
 * Notify user of system status
 */
export function notifyUser(message: string): void {
  console.log(`[Fitness AI Notification]: ${message}`);
  // In a real implementation, this would send a notification to the user
  // through a WebSocket, push notification, or email
}

/**
 * Initialize the Fitness AI System
 */
export async function initializeFitnessAISystem(options: InitializationOptions): Promise<any> {
  console.log(`Initializing Fitness AI System for user: ${options.userId}`);
  
  const userId = typeof options.userId === 'string' 
    ? parseInt(options.userId) 
    : options.userId;
  
  const results: Record<string, any> = {};
  const missingSecrets: FitnessService[] = [];
  
  // Check each service
  for (const service of options.services) {
    if (service.status === 'not_configured' && options.onMissingSecrets) {
      missingSecrets.push(service);
      options.onMissingSecrets(service);
      
      results[service.serviceId] = {
        status: 'not_configured',
        message: `Service ${service.name} is not properly configured. Missing secrets.`
      };
      continue;
    }
    
    if (service.status === 'error') {
      results[service.serviceId] = {
        status: 'error',
        message: `Service ${service.name} has configuration errors.`
      };
      continue;
    }
    
    // Check if the service is already connected
    try {
      const token = await getServiceToken(userId, service.serviceId);
      
      if (token) {
        results[service.serviceId] = {
          status: 'success',
          message: `Service ${service.name} is already connected`,
          lastSync: token.lastSyncDate
        };
      } else {
        // Not connected yet
        results[service.serviceId] = {
          status: 'not_connected',
          message: `Service ${service.name} is ready but not connected yet.`,
          connectionUrl: service.authUrl || service.uploadUrl
        };
      }
    } catch (error) {
      results[service.serviceId] = {
        status: 'error',
        message: `Error checking ${service.name} connection: ${(error as Error).message}`
      };
    }
  }
  
  // Enable diagnostics if requested
  if (options.enableDiagnostics) {
    console.log('Fitness AI System Diagnostics:');
    console.log(JSON.stringify(results, null, 2));
    
    console.log('Missing Secrets:', missingSecrets.map(s => s.name).join(', ') || 'None');
    
    const serviceIds = options.services.map(s => s.serviceId);
    
    // Activate all services that are configured
    if (serviceIds.length > 0) {
      try {
        const activationResult = await activateFitnessIntegrations({
          userId,
          services: serviceIds,
          secretsValidated: missingSecrets.length === 0,
          syncNow: false,
          logResults: true
        });
        
        console.log('Activation Results:', JSON.stringify(activationResult, null, 2));
      } catch (error) {
        console.error('Error during activation:', error);
      }
    }
  }
  
  // Call the completion callback if provided
  if (options.onComplete) {
    options.onComplete();
  }
  
  return {
    timestamp: new Date().toISOString(),
    language: options.language,
    results,
    missingSecrets: missingSecrets.map(s => s.requiredSecrets).flat()
  };
}
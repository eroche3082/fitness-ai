/**
 * Main entry point for Fitness Tracker Services
 */

import { fitnessRouter } from './routes';
import { initializeFitnessAISystem, checkEnvSecrets, notifyUser } from './initialize';
import { activateFitnessIntegrations } from './activate';
import { 
  getServiceToken, 
  storeServiceToken, 
  updateLastSyncDate,
  deleteServiceToken,
  testAllIntegrations
} from './utils';

// Unified interface for all fitness tracker services
export interface FitnessTrackerService {
  id: string;
  name: string;
  description: string;
  apiDocumentation: string;
  requiredSecrets: string[];
  
  // Service methods
  isConfigured(): boolean;
  getAuthUrl(userId: number, redirectUri: string): string;
  exchangeCodeForToken(code: string, userId: number): Promise<any>;
  getData(userId: number, dataType: string, startDate?: string, endDate?: string): Promise<any>;
  syncData(userId: number): Promise<any>;
}

// Export all the necessary functions and components
export {
  fitnessRouter,
  initializeFitnessAISystem,
  checkEnvSecrets,
  notifyUser,
  activateFitnessIntegrations,
  getServiceToken,
  storeServiceToken,
  updateLastSyncDate,
  deleteServiceToken,
  testAllIntegrations
};
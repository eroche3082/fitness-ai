import { Router } from 'express';
import { googleFitRouter } from './google-fit';
import { appleHealthRouter } from './apple-health';
import { fitbitRouter } from './fitbit';
import { stravaRouter } from './strava';

/**
 * Base interface for all fitness tracker services
 */
export interface FitnessTrackerService {
  name: string;
  id: string;
  isConfigured: boolean;
  getAuthUrl(userId: number): Promise<string>;
  handleCallback(userId: number, code: string): Promise<boolean>;
  syncData(userId: number): Promise<any>;
  disconnect(userId: number): Promise<boolean>;
}

/**
 * Register all fitness tracker routes
 * @param router Express router
 */
export function registerFitnessTrackerRoutes(router: Router): void {
  // Main health endpoint for all services
  router.get('/fitness-trackers/health', (req, res) => {
    // Check which services are available
    const availableServices = {
      'google-fit': process.env.GOOGLE_API_KEY !== undefined,
      'apple-health': false, // Requires iOS app
      'fitbit': process.env.FITBIT_CLIENT_ID !== undefined,
      'strava': process.env.STRAVA_CLIENT_ID !== undefined
    };
    
    res.json({
      status: 'ok',
      availableServices
    });
  });
  
  // Register each service router
  router.use('/fitness-trackers/google-fit', googleFitRouter);
  router.use('/fitness-trackers/apple-health', appleHealthRouter);
  router.use('/fitness-trackers/fitbit', fitbitRouter);
  router.use('/fitness-trackers/strava', stravaRouter);
}
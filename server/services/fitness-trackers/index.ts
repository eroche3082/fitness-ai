import { Router } from 'express';
import { googleFitRouter } from './google-fit';
import { appleHealthRouter } from './apple-health';
import { fitbitRouter } from './fitbit';
import { stravaRouter } from './strava';
import { fitnessRouter } from './routes';

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
  // Register the main fitness API router 
  router.use('/fitness', fitnessRouter);
  
  // Register each service router
  router.use('/fitness-trackers/google-fit', googleFitRouter);
  router.use('/fitness-trackers/apple-health', appleHealthRouter);
  router.use('/fitness-trackers/fitbit', fitbitRouter);
  router.use('/fitness-trackers/strava', stravaRouter);
}
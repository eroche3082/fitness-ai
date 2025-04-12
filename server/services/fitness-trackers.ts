/**
 * Main integration point for fitness trackers
 */

import { Router } from 'express';
import { fitnessRouter } from './fitness-trackers/routes';

export function registerFitnessTrackerRoutes(apiRouter: Router): void {
  // Mount the fitness router under the /fitness path
  apiRouter.use('/fitness', fitnessRouter);
  
  console.log('Fitness tracker routes registered successfully');
}
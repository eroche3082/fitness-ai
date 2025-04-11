import { Request, Response, Router } from 'express';
import * as googleFit from './google-fit';
import * as appleHealth from './apple-health';
import * as fitbit from './fitbit';
import * as strava from './strava';

// Create router for fitness tracker APIs
export const fitnessTrackerRouter = Router();

// Google Fit routes
fitnessTrackerRouter.get('/google-fit/auth', googleFit.handleGoogleFitAuth);
fitnessTrackerRouter.get('/google-fit/callback', googleFit.handleGoogleFitCallback);
fitnessTrackerRouter.post('/google-fit/data', googleFit.handleGetFitnessData);

// Apple Health routes - mainly receives data from the client
fitnessTrackerRouter.post('/apple-health/sync', appleHealth.handleAppleHealthSync);

// Fitbit routes
fitnessTrackerRouter.get('/fitbit/auth', fitbit.handleFitbitAuth);
fitnessTrackerRouter.get('/fitbit/callback', fitbit.handleFitbitCallback);
fitnessTrackerRouter.post('/fitbit/data', fitbit.handleGetFitbitData);

// Strava routes
fitnessTrackerRouter.get('/strava/auth', strava.handleStravaAuth);
fitnessTrackerRouter.get('/strava/callback', strava.handleStravaCallback);
fitnessTrackerRouter.post('/strava/data', strava.handleGetStravaData);

// Health check endpoint
fitnessTrackerRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    availableServices: {
      googleFit: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
      appleHealth: true, // Client side integration, always available
      fitbit: !!process.env.FITBIT_CLIENT_ID && !!process.env.FITBIT_CLIENT_SECRET,
      strava: !!process.env.STRAVA_CLIENT_ID && !!process.env.STRAVA_CLIENT_SECRET
    }
  });
});

// Function to register fitness tracker routes with main Express app
export function registerFitnessTrackerRoutes(router: Router) {
  router.use('/fitness-trackers', fitnessTrackerRouter);
}

// Export all fitness tracker services
export {
  googleFit,
  appleHealth,
  fitbit,
  strava
};
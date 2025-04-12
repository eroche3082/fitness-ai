/**
 * API routes for fitness tracker activation and management
 */

import { Router, Request, Response } from 'express';
import { activateFitnessIntegrations } from './activate';
import { testAllIntegrations } from './utils';
import { initializeFitnessAISystem, checkEnvSecrets, notifyUser } from './initialize';

const fitnessRouter = Router();

/**
 * Health endpoint for all fitness trackers
 */
fitnessRouter.get('/health', (req, res) => {
  // Check which services are available
  const availableServices = {
    'google-fit': process.env.GOOGLE_FIT_CLIENT_ID !== undefined,
    'apple-health': false, // Requires iOS app
    'fitbit': process.env.FITBIT_CLIENT_ID !== undefined,
    'strava': process.env.STRAVA_CLIENT_ID !== undefined
  };
  
  res.json({
    status: 'ok',
    availableServices
  });
});

/**
 * Master activation endpoint
 */
fitnessRouter.post('/activate', async (req, res) => {
  try {
    const { 
      services = ['google-fit', 'apple-health', 'fitbit', 'strava'], 
      syncNow = false,
      logResults = true,
      userId = 1
    } = req.body;
    
    // Check if secrets are configured
    const secretsValidated = process.env.GOOGLE_FIT_CLIENT_ID !== undefined || 
                           process.env.FITBIT_CLIENT_ID !== undefined ||
                           process.env.STRAVA_CLIENT_ID !== undefined;
    
    const result = await activateFitnessIntegrations({
      services,
      secretsValidated,
      syncNow,
      logResults,
      userId
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error activating fitness integrations:', error);
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

/**
 * Test endpoint for all integrations
 */
fitnessRouter.get('/test', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
    const results = await testAllIntegrations(userId);
    
    res.json({
      status: 'ok',
      results
    });
  } catch (error) {
    console.error('Error testing fitness integrations:', error);
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

/**
 * Initialize the Fitness AI System
 */
fitnessRouter.post('/initialize', async (req, res) => {
  try {
    const { 
      userId = 1, 
      language = 'en',
      enableDiagnostics = true,
      services = []
    } = req.body;
    
    // Process the services to check their status
    const processedServices = services.map((service: any) => {
      if (service.requiredSecrets && Array.isArray(service.requiredSecrets)) {
        return {
          ...service,
          status: checkEnvSecrets(service.requiredSecrets)
        };
      }
      return service;
    });
    
    const result = await initializeFitnessAISystem({
      userId,
      language,
      enableDiagnostics,
      services: processedServices,
      onMissingSecrets: (service) => {
        console.warn(`${service.name} is not fully configured. Please provide missing secrets.`);
      },
      onComplete: () => {
        console.log("✅ All services initialized and dashboard components are synced.");
        notifyUser("All systems go! You can now connect and sync your fitness data.");
      }
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error initializing Fitness AI System:', error);
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

/**
 * Dashboard data endpoint
 */
fitnessRouter.get('/dashboard/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user ID'
      });
    }
    
    // In a real implementation, you would fetch aggregated data from the database
    // For now, we'll return some sample data
    const dashboard = {
      summary: {
        dailyAvgSteps: 8500,
        weeklyActiveMinutes: 210,
        totalWorkouts: 12,
        caloriesBurned: 4250,
        sleepAvg: 7.2 // hours
      },
      devices: {
        connected: await testAllIntegrations(userId)
      },
      recentActivities: [
        {
          type: 'Running',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          duration: 35, // minutes
          distance: 5.2, // km
          calories: 450,
          source: 'strava'
        },
        {
          type: 'Cycling',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 45, // minutes
          distance: 15, // km
          calories: 380,
          source: 'fitbit'
        }
      ]
    };
    
    res.json(dashboard);
  } catch (error) {
    console.error('Error getting fitness dashboard:', error);
    res.status(500).json({
      status: 'error',
      message: (error as Error).message
    });
  }
});

export { fitnessRouter };
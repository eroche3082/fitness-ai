import { Router } from 'express';
import { FitnessTrackerService } from './index';
import { storage } from '../../storage';
import fetch from 'node-fetch';

const router = Router();

// Fitbit API endpoints
const FITBIT_API_BASE = 'https://api.fitbit.com/1';
const FITBIT_AUTH_URL = 'https://www.fitbit.com/oauth2/authorize';
const FITBIT_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';

// Fitbit OAuth scopes
const SCOPES = [
  'activity',
  'heartrate',
  'location',
  'nutrition',
  'profile',
  'settings',
  'sleep',
  'weight'
].join(' ');

/**
 * Fitbit fitness tracker service
 */
class FitbitService implements FitnessTrackerService {
  name = 'Fitbit';
  id = 'fitbit';
  
  get isConfigured(): boolean {
    return process.env.FITBIT_CLIENT_ID !== undefined && 
           process.env.FITBIT_CLIENT_SECRET !== undefined;
  }
  
  /**
   * Generate OAuth URL for Fitbit
   */
  async getAuthUrl(userId: number): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('Fitbit integration is not configured');
    }
    
    const redirectUri = `${process.env.APP_URL || 'http://localhost:5000'}/api/fitness-trackers/fitbit/callback`;
    const state = `user-${userId}`;
    
    const authUrl = `${FITBIT_AUTH_URL}?response_type=code&client_id=${process.env.FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(SCOPES)}&state=${state}`;
    
    return authUrl;
  }
  
  /**
   * Handle OAuth callback from Fitbit
   */
  async handleCallback(userId: number, code: string): Promise<boolean> {
    try {
      if (!this.isConfigured) {
        throw new Error('Fitbit integration is not configured');
      }
      
      const redirectUri = `${process.env.APP_URL || 'http://localhost:5000'}/api/fitness-trackers/fitbit/callback`;
      
      // Exchange code for access token
      const authString = Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64');
      
      const response = await fetch(FITBIT_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri
        }).toString()
      });
      
      if (!response.ok) {
        throw new Error(`Failed to exchange code: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store tokens in database (in a real app)
      console.log(`Received Fitbit tokens for user ${userId}`);
      
      return true;
    } catch (error) {
      console.error('Error exchanging code for Fitbit tokens:', error);
      return false;
    }
  }
  
  /**
   * Sync data from Fitbit
   */
  async syncData(userId: number): Promise<any> {
    try {
      if (!this.isConfigured) {
        throw new Error('Fitbit integration is not configured');
      }
      
      // In a real implementation, you would:
      // 1. Get user's token from database
      // 2. Fetch data from Fitbit API
      // 3. Process and store data
      
      // This is a simplified example:
      // Fetch user's activity data for today
      const today = new Date().toISOString().split('T')[0];
      
      /*
      const response = await fetch(`${FITBIT_API_BASE}/user/-/activities/date/${today}.json`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Fitbit data: ${response.statusText}`);
      }
      
      const data = await response.json();
      */
      
      // Simulated response for demonstration
      const simulatedData = {
        activities: [
          {
            activityName: 'Running',
            duration: 1800000, // 30 minutes in milliseconds
            distance: 5.2, // kilometers
            calories: 450
          }
        ],
        summary: {
          steps: 8245,
          floors: 12,
          calories: 1850
        }
      };
      
      return simulatedData;
    } catch (error) {
      console.error('Error syncing Fitbit data:', error);
      throw error;
    }
  }
  
  /**
   * Disconnect from Fitbit
   */
  async disconnect(userId: number): Promise<boolean> {
    try {
      if (!this.isConfigured) {
        throw new Error('Fitbit integration is not configured');
      }
      
      // In a real implementation, you would:
      // 1. Get user's token from database
      // 2. Revoke the token with Fitbit API
      // 3. Remove token from database
      
      // This is a simplified example:
      // const response = await fetch('https://api.fitbit.com/oauth2/revoke', {...});
      
      console.log(`Disconnected Fitbit for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error disconnecting from Fitbit:', error);
      return false;
    }
  }
}

// Create service instance
const fitbitService = new FitbitService();

// Configure routes
router.get('/auth', async (req, res) => {
  try {
    // In a real app, get userId from session
    const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
    
    if (!fitbitService.isConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Fitbit integration is not configured'
      });
    }
    
    const authUrl = await fitbitService.getAuthUrl(userId);
    
    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    console.error('Error generating Fitbit auth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authorization URL'
    });
  }
});

router.get('/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code || !state) {
      return res.status(400).json({
        success: false,
        message: 'Invalid callback parameters'
      });
    }
    
    // Extract userId from state
    const stateStr = state as string;
    const userId = parseInt(stateStr.replace('user-', ''));
    
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid state parameter'
      });
    }
    
    const success = await fitbitService.handleCallback(userId, code as string);
    
    if (success) {
      // Redirect to the fitness trackers page with success message
      res.redirect(`/?provider=fitbit&connected=true`);
    } else {
      res.redirect(`/?provider=fitbit&error=true`);
    }
  } catch (error) {
    console.error('Error handling Fitbit callback:', error);
    res.redirect(`/?provider=fitbit&error=true`);
  }
});

router.get('/sync', async (req, res) => {
  try {
    // In a real app, get userId from session
    const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
    
    if (!fitbitService.isConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Fitbit integration is not configured'
      });
    }
    
    const data = await fitbitService.syncData(userId);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error syncing Fitbit data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync data from Fitbit'
    });
  }
});

router.post('/disconnect', async (req, res) => {
  try {
    // In a real app, get userId from session
    const userId = req.body.userId ? parseInt(req.body.userId) : 1;
    
    if (!fitbitService.isConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Fitbit integration is not configured'
      });
    }
    
    const success = await fitbitService.disconnect(userId);
    
    res.json({
      success
    });
  } catch (error) {
    console.error('Error disconnecting from Fitbit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect from Fitbit'
    });
  }
});

// Health check endpoint
router.get('/status', (req, res) => {
  res.json({
    service: fitbitService.name,
    id: fitbitService.id,
    configured: fitbitService.isConfigured
  });
});

export { router as fitbitRouter, FitbitService };
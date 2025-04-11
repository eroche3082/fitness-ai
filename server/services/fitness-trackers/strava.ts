import { Router } from 'express';
import { FitnessTrackerService } from './index';
import { storage } from '../../storage';
import fetch from 'node-fetch';

const router = Router();

// Strava API endpoints
const STRAVA_API_BASE = 'https://www.strava.com/api/v3';
const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';

// Strava OAuth scopes
const SCOPES = [
  'read',
  'activity:read',
  'read_all'
].join(',');

/**
 * Strava fitness tracker service
 */
class StravaService implements FitnessTrackerService {
  name = 'Strava';
  id = 'strava';
  
  get isConfigured(): boolean {
    return process.env.STRAVA_CLIENT_ID !== undefined && 
           process.env.STRAVA_CLIENT_SECRET !== undefined;
  }
  
  /**
   * Generate OAuth URL for Strava
   */
  async getAuthUrl(userId: number): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('Strava integration is not configured');
    }
    
    const redirectUri = `${process.env.APP_URL || 'http://localhost:5000'}/api/fitness-trackers/strava/callback`;
    const state = `user-${userId}`;
    
    const authUrl = `${STRAVA_AUTH_URL}?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=${encodeURIComponent(SCOPES)}&state=${state}`;
    
    return authUrl;
  }
  
  /**
   * Handle OAuth callback from Strava
   */
  async handleCallback(userId: number, code: string): Promise<boolean> {
    try {
      if (!this.isConfigured) {
        throw new Error('Strava integration is not configured');
      }
      
      // Exchange code for access token
      const response = await fetch(STRAVA_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to exchange code: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store tokens in database (in a real app)
      console.log(`Received Strava tokens for user ${userId}`);
      
      return true;
    } catch (error) {
      console.error('Error exchanging code for Strava tokens:', error);
      return false;
    }
  }
  
  /**
   * Sync data from Strava
   */
  async syncData(userId: number): Promise<any> {
    try {
      if (!this.isConfigured) {
        throw new Error('Strava integration is not configured');
      }
      
      // In a real implementation, you would:
      // 1. Get user's token from database
      // 2. Fetch data from Strava API
      // 3. Process and store data
      
      // This is a simplified example:
      // Fetch user's recent activities
      /*
      const response = await fetch(`${STRAVA_API_BASE}/athlete/activities?per_page=10`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Strava data: ${response.statusText}`);
      }
      
      const data = await response.json();
      */
      
      // Simulated response for demonstration
      const simulatedData = {
        activities: [
          {
            id: 1234567890,
            type: 'Run',
            name: 'Morning Run',
            distance: 5280, // meters
            moving_time: 1800, // seconds
            elapsed_time: 1900, // seconds
            total_elevation_gain: 50, // meters
            start_date: new Date().toISOString(),
            average_speed: 2.93, // meters per second
            max_speed: 4.5 // meters per second
          },
          {
            id: 9876543210,
            type: 'Ride',
            name: 'Evening Bike Ride',
            distance: 15280, // meters
            moving_time: 2700, // seconds
            elapsed_time: 3000, // seconds
            total_elevation_gain: 120, // meters
            start_date: new Date(Date.now() - 86400000).toISOString(), // yesterday
            average_speed: 5.66, // meters per second
            max_speed: 8.2 // meters per second
          }
        ]
      };
      
      return simulatedData;
    } catch (error) {
      console.error('Error syncing Strava data:', error);
      throw error;
    }
  }
  
  /**
   * Disconnect from Strava
   */
  async disconnect(userId: number): Promise<boolean> {
    try {
      if (!this.isConfigured) {
        throw new Error('Strava integration is not configured');
      }
      
      // In a real implementation, you would:
      // 1. Get user's token from database
      // 2. Revoke the token with Strava API
      // 3. Remove token from database
      
      // This is a simplified example:
      // const response = await fetch(`${STRAVA_API_BASE}/oauth/deauthorize`, {...});
      
      console.log(`Disconnected Strava for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Error disconnecting from Strava:', error);
      return false;
    }
  }
}

// Create service instance
const stravaService = new StravaService();

// Configure routes
router.get('/auth', async (req, res) => {
  try {
    // In a real app, get userId from session
    const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
    
    if (!stravaService.isConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Strava integration is not configured'
      });
    }
    
    const authUrl = await stravaService.getAuthUrl(userId);
    
    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    console.error('Error generating Strava auth URL:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authorization URL'
    });
  }
});

router.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    
    if (error) {
      return res.redirect(`/?provider=strava&error=${error}`);
    }
    
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
    
    const success = await stravaService.handleCallback(userId, code as string);
    
    if (success) {
      // Redirect to the fitness trackers page with success message
      res.redirect(`/?provider=strava&connected=true`);
    } else {
      res.redirect(`/?provider=strava&error=true`);
    }
  } catch (error) {
    console.error('Error handling Strava callback:', error);
    res.redirect(`/?provider=strava&error=true`);
  }
});

router.get('/sync', async (req, res) => {
  try {
    // In a real app, get userId from session
    const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
    
    if (!stravaService.isConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Strava integration is not configured'
      });
    }
    
    const data = await stravaService.syncData(userId);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error syncing Strava data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync data from Strava'
    });
  }
});

router.post('/disconnect', async (req, res) => {
  try {
    // In a real app, get userId from session
    const userId = req.body.userId ? parseInt(req.body.userId) : 1;
    
    if (!stravaService.isConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Strava integration is not configured'
      });
    }
    
    const success = await stravaService.disconnect(userId);
    
    res.json({
      success
    });
  } catch (error) {
    console.error('Error disconnecting from Strava:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect from Strava'
    });
  }
});

// Health check endpoint
router.get('/status', (req, res) => {
  res.json({
    service: stravaService.name,
    id: stravaService.id,
    configured: stravaService.isConfigured
  });
});

export { router as stravaRouter, StravaService };
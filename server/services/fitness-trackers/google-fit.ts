import { Router } from 'express';
import { FitnessTrackerService } from './index';
import { storage } from '../../storage';
import { google } from 'googleapis';

const router = Router();

// Google Fit API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read'
];

// OAuth2 client configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_FIT_CLIENT_ID,
  process.env.GOOGLE_FIT_CLIENT_SECRET,
  `${process.env.APP_URL || 'http://localhost:5000'}/api/fitness-trackers/google-fit/callback`
);

/**
 * Google Fit fitness tracker service
 */
class GoogleFitService implements FitnessTrackerService {
  name = 'Google Fit';
  id = 'google-fit';
  
  get isConfigured(): boolean {
    return process.env.GOOGLE_FIT_CLIENT_ID !== undefined && 
           process.env.GOOGLE_FIT_CLIENT_SECRET !== undefined;
  }
  
  /**
   * Generate OAuth URL for Google Fit
   */
  async getAuthUrl(userId: number): Promise<string> {
    // Store state to verify callback
    const state = `user-${userId}`;
    
    // Generate authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: state
    });
    
    return authUrl;
  }
  
  /**
   * Handle OAuth callback from Google Fit
   */
  async handleCallback(userId: number, code: string): Promise<boolean> {
    try {
      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      
      // Store tokens in database (in a real app)
      console.log(`Received tokens for user ${userId}`);
      
      return true;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      return false;
    }
  }
  
  /**
   * Sync data from Google Fit
   */
  async syncData(userId: number): Promise<any> {
    try {
      // In a real implementation, you would:
      // 1. Get user's token from database
      // 2. Set token in oauth2Client
      // 3. Create fitness client and fetch data
      // 4. Process and store data
      
      // This is a simplified example:
      const fitness = google.fitness({ version: 'v1', auth: oauth2Client });
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Example of fetching steps data
      const response = await fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: {
          aggregateBy: [{
            dataTypeName: 'com.google.step_count.delta'
          }],
          bucketByTime: { durationMillis: 86400000 },
          startTimeMillis: yesterday.getTime(),
          endTimeMillis: now.getTime()
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error syncing Google Fit data:', error);
      throw error;
    }
  }
  
  /**
   * Disconnect from Google Fit
   */
  async disconnect(userId: number): Promise<boolean> {
    try {
      // In a real implementation, you would:
      // 1. Get user's token from database
      // 2. Revoke the token
      // 3. Remove token from database
      
      // This is a simplified example:
      // await oauth2Client.revokeToken(token);
      console.log(`Disconnected Google Fit for user ${userId}`);
      
      return true;
    } catch (error) {
      console.error('Error disconnecting from Google Fit:', error);
      return false;
    }
  }
}

// Create service instance
const googleFitService = new GoogleFitService();

// Configure routes
router.get('/auth', async (req, res) => {
  try {
    // In a real app, get userId from session
    const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
    
    if (!googleFitService.isConfigured) {
      return res.status(503).json({
        success: false,
        message: 'Google Fit integration is not configured'
      });
    }
    
    const authUrl = await googleFitService.getAuthUrl(userId);
    
    res.json({
      success: true,
      authUrl
    });
  } catch (error) {
    console.error('Error generating auth URL:', error);
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
    
    const success = await googleFitService.handleCallback(userId, code as string);
    
    if (success) {
      // Redirect to the fitness trackers page with success message
      res.redirect(`/?provider=google-fit&connected=true`);
    } else {
      res.redirect(`/?provider=google-fit&error=true`);
    }
  } catch (error) {
    console.error('Error handling callback:', error);
    res.redirect(`/?provider=google-fit&error=true`);
  }
});

router.get('/sync', async (req, res) => {
  try {
    // In a real app, get userId from session
    const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
    
    const data = await googleFitService.syncData(userId);
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync data from Google Fit'
    });
  }
});

router.post('/disconnect', async (req, res) => {
  try {
    // In a real app, get userId from session
    const userId = req.body.userId ? parseInt(req.body.userId) : 1;
    
    const success = await googleFitService.disconnect(userId);
    
    res.json({
      success
    });
  } catch (error) {
    console.error('Error disconnecting:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disconnect from Google Fit'
    });
  }
});

// Health check endpoint
router.get('/status', (req, res) => {
  res.json({
    service: googleFitService.name,
    id: googleFitService.id,
    configured: googleFitService.isConfigured
  });
});

export { router as googleFitRouter, GoogleFitService };
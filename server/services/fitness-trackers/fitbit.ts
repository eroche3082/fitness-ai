import { Request, Response } from 'express';
import fetch from 'node-fetch';

// Configure OAuth client details for Fitbit
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID;
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET;
const FITBIT_REDIRECT_URI = process.env.REDIRECT_URL || 'http://localhost:5000/api/fitbit/callback';
const FITBIT_API_URL = 'https://api.fitbit.com';

// Get authentication URL for Fitbit
export function getFitbitAuthUrl() {
  const scopes = [
    'activity',
    'heartrate',
    'location',
    'nutrition',
    'profile',
    'settings',
    'sleep',
    'weight'
  ];
  
  const authUrl = new URL('https://www.fitbit.com/oauth2/authorize');
  authUrl.searchParams.append('client_id', FITBIT_CLIENT_ID || '');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('redirect_uri', FITBIT_REDIRECT_URI);
  
  return authUrl.toString();
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string) {
  try {
    if (!FITBIT_CLIENT_ID || !FITBIT_CLIENT_SECRET) {
      throw new Error('Fitbit client ID or secret not configured');
    }
    
    const authString = Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: FITBIT_REDIRECT_URI
      }).toString()
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Fitbit API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      tokens: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type
      }
    };
  } catch (error) {
    console.error('Error exchanging code for Fitbit token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string) {
  try {
    if (!FITBIT_CLIENT_ID || !FITBIT_CLIENT_SECRET) {
      throw new Error('Fitbit client ID or secret not configured');
    }
    
    const authString = Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }).toString()
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Fitbit API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      tokens: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type
      }
    };
  } catch (error) {
    console.error('Error refreshing Fitbit token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get user profile from Fitbit
export async function getFitbitProfile(accessToken: string) {
  try {
    const response = await fetch(`${FITBIT_API_URL}/1/user/-/profile.json`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Fitbit API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      profile: data.user
    };
  } catch (error) {
    console.error('Error fetching Fitbit profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get activity data from Fitbit
export async function getActivityData(accessToken: string, date: string = 'today') {
  try {
    const response = await fetch(`${FITBIT_API_URL}/1/user/-/activities/date/${date}.json`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Fitbit API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      activities: data
    };
  } catch (error) {
    console.error('Error fetching Fitbit activity data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get sleep data from Fitbit
export async function getSleepData(accessToken: string, date: string = 'today') {
  try {
    const response = await fetch(`${FITBIT_API_URL}/1.2/user/-/sleep/date/${date}.json`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Fitbit API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      sleep: data
    };
  } catch (error) {
    console.error('Error fetching Fitbit sleep data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Express route handler for Fitbit authentication
export async function handleFitbitAuth(req: Request, res: Response) {
  try {
    if (!FITBIT_CLIENT_ID || !FITBIT_CLIENT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Fitbit integration not configured'
      });
    }
    
    const authUrl = getFitbitAuthUrl();
    res.json({ success: true, authUrl });
  } catch (error) {
    console.error('Fitbit auth error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Express route handler for Fitbit callback
export async function handleFitbitCallback(req: Request, res: Response) {
  try {
    const { code } = req.query;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Authorization code not provided'
      });
    }
    
    const result = await exchangeCodeForToken(code);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error
      });
    }
    
    // Get user profile to identify the user
    const profileResult = await getFitbitProfile(result.tokens.access_token);
    
    if (!profileResult.success) {
      return res.status(500).json({
        success: false,
        message: profileResult.error
      });
    }
    
    // In a real app, you would save the tokens and user profile to your database
    // and associate them with the user's account
    
    // Redirect to a success page
    res.redirect('/fitness-tracker-connected?provider=fitbit');
  } catch (error) {
    console.error('Fitbit callback error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Express route handler for fetching Fitbit data
export async function handleGetFitbitData(req: Request, res: Response) {
  try {
    const { accessToken, dataType, date } = req.body;
    
    if (!accessToken || !dataType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: accessToken, dataType'
      });
    }
    
    let result;
    
    switch (dataType) {
      case 'profile':
        result = await getFitbitProfile(accessToken);
        break;
      case 'activity':
        result = await getActivityData(accessToken, date || 'today');
        break;
      case 'sleep':
        result = await getSleepData(accessToken, date || 'today');
        break;
      default:
        return res.status(400).json({
          success: false,
          message: `Invalid data type: ${dataType}`
        });
    }
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error
      });
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching Fitbit data:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
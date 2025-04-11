import { Request, Response } from 'express';
import fetch from 'node-fetch';

// Configure OAuth client details for Strava
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = process.env.REDIRECT_URL || 'http://localhost:5000/api/strava/callback';
const STRAVA_API_URL = 'https://www.strava.com/api/v3';

// Get authentication URL for Strava
export function getStravaAuthUrl() {
  const scopes = ['read', 'activity:read', 'profile:read_all'];
  
  const authUrl = new URL('https://www.strava.com/oauth/authorize');
  authUrl.searchParams.append('client_id', STRAVA_CLIENT_ID || '');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', STRAVA_REDIRECT_URI);
  authUrl.searchParams.append('scope', scopes.join(','));
  
  return authUrl.toString();
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string) {
  try {
    if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
      throw new Error('Strava client ID or secret not configured');
    }
    
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Strava API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      tokens: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        athlete: data.athlete
      }
    };
  } catch (error) {
    console.error('Error exchanging code for Strava token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string) {
  try {
    if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
      throw new Error('Strava client ID or secret not configured');
    }
    
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Strava API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      tokens: {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at
      }
    };
  } catch (error) {
    console.error('Error refreshing Strava token:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get athlete profile from Strava
export async function getAthleteProfile(accessToken: string) {
  try {
    const response = await fetch(`${STRAVA_API_URL}/athlete`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Strava API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      profile: data
    };
  } catch (error) {
    console.error('Error fetching Strava athlete profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get activities from Strava
export async function getActivities(accessToken: string, params: {
  before?: number;
  after?: number;
  page?: number;
  per_page?: number;
} = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.before) queryParams.append('before', params.before.toString());
    if (params.after) queryParams.append('after', params.after.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    
    const url = `${STRAVA_API_URL}/athlete/activities?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Strava API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      activities: data
    };
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get activity detail from Strava
export async function getActivityDetail(accessToken: string, activityId: string) {
  try {
    const response = await fetch(`${STRAVA_API_URL}/activities/${activityId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Strava API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      activity: data
    };
  } catch (error) {
    console.error('Error fetching Strava activity detail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Get athlete stats from Strava
export async function getAthleteStats(accessToken: string, athleteId: number) {
  try {
    const response = await fetch(`${STRAVA_API_URL}/athletes/${athleteId}/stats`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Strava API error: ${errorData}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      stats: data
    };
  } catch (error) {
    console.error('Error fetching Strava athlete stats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Express route handler for Strava authentication
export async function handleStravaAuth(req: Request, res: Response) {
  try {
    if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Strava integration not configured'
      });
    }
    
    const authUrl = getStravaAuthUrl();
    res.json({ success: true, authUrl });
  } catch (error) {
    console.error('Strava auth error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Express route handler for Strava callback
export async function handleStravaCallback(req: Request, res: Response) {
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
    
    // In a real app, you would save the tokens and athlete data to your database
    // and associate them with the user's account
    
    // Redirect to a success page
    res.redirect('/fitness-tracker-connected?provider=strava');
  } catch (error) {
    console.error('Strava callback error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Express route handler for fetching Strava data
export async function handleGetStravaData(req: Request, res: Response) {
  try {
    const { accessToken, dataType, activityId, athleteId, params } = req.body;
    
    if (!accessToken || !dataType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: accessToken, dataType'
      });
    }
    
    let result;
    
    switch (dataType) {
      case 'profile':
        result = await getAthleteProfile(accessToken);
        break;
      case 'activities':
        result = await getActivities(accessToken, params || {});
        break;
      case 'activity':
        if (!activityId) {
          return res.status(400).json({
            success: false,
            message: 'Missing required parameter: activityId'
          });
        }
        result = await getActivityDetail(accessToken, activityId);
        break;
      case 'stats':
        if (!athleteId) {
          return res.status(400).json({
            success: false,
            message: 'Missing required parameter: athleteId'
          });
        }
        result = await getAthleteStats(accessToken, athleteId);
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
    console.error('Error fetching Strava data:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
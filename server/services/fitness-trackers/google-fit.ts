import { Request, Response } from 'express';
import { google, oauth2_v2 } from 'googleapis';

// Configure OAuth2 client
function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
}

// Get authentication URL for Google Fit
export function getGoogleFitAuthUrl() {
  const oauth2Client = getOAuth2Client();
  
  // Scopes for reading fitness data
  const scopes = [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.body.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.location.read',
    'https://www.googleapis.com/auth/fitness.sleep.read',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ];
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true
  });
  
  return authUrl;
}

// Exchange auth code for tokens
export async function exchangeCodeForTokens(authCode: string) {
  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(authCode);
    oauth2Client.setCredentials(tokens);
    
    return {
      success: true,
      tokens
    };
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return {
      success: false,
      error: 'Failed to exchange authorization code for tokens'
    };
  }
}

// Get user info 
export async function getUserInfo(accessToken: string) {
  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    
    const userInfo = await oauth2.userinfo.get();
    return {
      success: true,
      userInfo: userInfo.data
    };
  } catch (error) {
    console.error('Error getting user info:', error);
    return {
      success: false,
      error: 'Failed to get user information'
    };
  }
}

// Fetch fitness data from Google Fit
export async function fetchFitnessData(accessToken: string, dataType: string, startTime: string, endTime: string) {
  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const fitness = google.fitness({
      version: 'v1',
      auth: oauth2Client
    });
    
    // Convert data type to Google Fit data source ID
    const dataSourceId = getDataSourceId(dataType);
    
    // Convert date strings to timestamps
    const startTimeMillis = new Date(startTime).getTime();
    const endTimeMillis = new Date(endTime).getTime();
    
    // Fetch data
    const response = await fitness.users.dataSources.datasets.get({
      userId: 'me',
      dataSourceId,
      datasetId: `${startTimeMillis}-${endTimeMillis}`
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching fitness data:', error);
    return {
      success: false,
      error: 'Failed to fetch fitness data from Google Fit'
    };
  }
}

// Express route handler for Google Fit authentication
export async function handleGoogleFitAuth(req: Request, res: Response) {
  try {
    const authUrl = getGoogleFitAuthUrl();
    res.json({ success: true, authUrl });
  } catch (error) {
    console.error('Google Fit auth error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate authentication URL for Google Fit'
    });
  }
}

// Express route handler for Google Fit callback
export async function handleGoogleFitCallback(req: Request, res: Response) {
  try {
    const { code } = req.query;
    
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Authorization code not provided'
      });
    }
    
    const result = await exchangeCodeForTokens(code);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error
      });
    }
    
    // Get user info to identify the user
    const userInfoResult = await getUserInfo(result.tokens.access_token as string);
    
    if (!userInfoResult.success) {
      return res.status(500).json({
        success: false,
        message: userInfoResult.error
      });
    }
    
    // In a real app, you would save the tokens and user info to your database
    // and associate them with the user's account
    
    // Redirect to a success page
    res.redirect('/fitness-tracker-connected?provider=google-fit');
  } catch (error) {
    console.error('Google Fit callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process Google Fit authentication callback'
    });
  }
}

// Express route handler for fetching fitness data
export async function handleGetFitnessData(req: Request, res: Response) {
  try {
    const { accessToken, dataType, startTime, endTime } = req.body;
    
    if (!accessToken || !dataType || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: accessToken, dataType, startTime, endTime'
      });
    }
    
    const result = await fetchFitnessData(accessToken, dataType, startTime, endTime);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error
      });
    }
    
    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    console.error('Error fetching fitness data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fitness data from Google Fit'
    });
  }
}

// Helper function to convert data type to Google Fit data source ID
function getDataSourceId(dataType: string): string {
  const dataSourceMap: Record<string, string> = {
    'steps': 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
    'calories': 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended',
    'distance': 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta',
    'activeMinutes': 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes',
    'weight': 'derived:com.google.weight:com.google.android.gms:merge_weight',
    'heartRate': 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm',
    'sleep': 'derived:com.google.sleep.segment:com.google.android.gms:merged'
  };
  
  return dataSourceMap[dataType] || dataType;
}
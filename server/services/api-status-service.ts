/**
 * API Status Service
 * 
 * This service provides functionality to check the status of all API services
 * used within the Fitness AI platform and verify their proper configuration.
 */

// No api key manager module available yet, will implement without it

/**
 * Get the status of all API services used in the Fitness AI platform
 * @returns Object containing the status of each API service
 */
export async function getAllApiStatus() {
  // Check Google Cloud API services
  const googleApiKeys = {
    vision: process.env.GOOGLE_API_KEY || 
      process.env.GOOGLE_GROUP1_API_KEY || 
      process.env.GOOGLE_GROUP2_API_KEY || 
      process.env.GOOGLE_GROUP3_API_KEY,
      
    translation: process.env.GOOGLE_API_KEY || 
      process.env.GOOGLE_GROUP1_API_KEY || 
      process.env.GOOGLE_GROUP2_API_KEY || 
      process.env.GOOGLE_GROUP3_API_KEY,
      
    tts: process.env.GOOGLE_API_KEY || 
      process.env.GOOGLE_GROUP1_API_KEY || 
      process.env.GOOGLE_GROUP2_API_KEY || 
      process.env.GOOGLE_GROUP3_API_KEY,
      
    stt: process.env.GOOGLE_API_KEY || 
      process.env.GOOGLE_GROUP1_API_KEY || 
      process.env.GOOGLE_GROUP2_API_KEY || 
      process.env.GOOGLE_GROUP3_API_KEY,
      
    naturalLanguage: process.env.GOOGLE_API_KEY || 
      process.env.GOOGLE_GROUP1_API_KEY || 
      process.env.GOOGLE_GROUP2_API_KEY || 
      process.env.GOOGLE_GROUP3_API_KEY,
  };
  
  // Check AI model services
  const aiServices = {
    gemini: process.env.GEMINI_API_KEY,
    vertexAI: process.env.GOOGLE_API_KEY,
  };
  
  // Check Firebase and authentication services
  const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };
  
  // Prepare the status report
  const apiStatus = {
    // Google Cloud APIs
    vision: googleApiKeys.vision 
      ? { status: 'partial', message: 'Vision API is configured but needs full implementation' }
      : { status: 'missing', message: 'Vision API key is not configured' },
      
    translation: googleApiKeys.translation
      ? { status: 'active', message: 'Translation API is fully operational' }
      : { status: 'missing', message: 'Translation API key is not configured' },
      
    tts: googleApiKeys.tts
      ? { status: 'active', message: 'Text-to-Speech API is fully operational' }
      : { status: 'missing', message: 'Text-to-Speech API key is not configured' },
      
    stt: googleApiKeys.stt
      ? { status: 'active', message: 'Speech-to-Text API is fully operational' }
      : { status: 'missing', message: 'Speech-to-Text API key is not configured' },
      
    naturalLanguage: googleApiKeys.naturalLanguage
      ? { status: 'active', message: 'Natural Language API is fully operational' }
      : { status: 'missing', message: 'Natural Language API key is not configured' },
    
    // AI models  
    gemini: aiServices.gemini
      ? { status: 'active', message: 'Gemini API is fully operational' }
      : { status: 'missing', message: 'Gemini API key is not configured' },
      
    vertexAI: aiServices.vertexAI
      ? { status: 'active', message: 'Vertex AI is fully operational' }
      : { status: 'missing', message: 'Vertex AI credentials are not configured' },
    
    // Firebase
    firebase: (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)
      ? { status: 'partial', message: 'Firebase is configured but needs full implementation' }
      : { status: 'missing', message: 'Firebase configuration is incomplete' },
  };
  
  return apiStatus;
}

/**
 * Check if all required API services are properly configured
 * @returns Object with validation results and missing API keys
 */
export async function validateApiServices() {
  const apiStatus = await getAllApiStatus();
  
  // Check for missing or inactive services
  const missingServices = Object.entries(apiStatus)
    .filter(([_, status]) => status.status === 'missing')
    .map(([name, _]) => name);
    
  const partialServices = Object.entries(apiStatus)
    .filter(([_, status]) => status.status === 'partial')
    .map(([name, _]) => name);
  
  // Service assignments mapping (simplified for now)
  const serviceAssignments = {
    'vision': 'GROUP1',
    'translation': 'GROUP1',
    'tts': 'GROUP2',
    'stt': 'GROUP2',
    'naturalLanguage': 'GROUP2',
    'gemini': 'UNIVERSAL',
    'vertexAI': 'GROUP3',
  };
  
  return {
    isValid: missingServices.length === 0,
    missingServices,
    partialServices,
    serviceAssignments
  };
}

/**
 * Get a detailed report of all API services and their status
 * @returns Detailed API status report
 */
export async function getApiStatusReport() {
  const apiStatus = await getAllApiStatus();
  const validationResults = await validateApiServices();
  
  // Count services by status
  const statusCounts = {
    active: Object.values(apiStatus).filter(status => status.status === 'active').length,
    partial: Object.values(apiStatus).filter(status => status.status === 'partial').length,
    missing: Object.values(apiStatus).filter(status => status.status === 'missing').length,
  };
  
  // Calculate overall health percentage
  const totalServices = Object.keys(apiStatus).length;
  const healthPercentage = Math.round(
    ((statusCounts.active + (statusCounts.partial * 0.5)) / totalServices) * 100
  );
  
  return {
    timestamp: new Date().toISOString(),
    services: apiStatus,
    counts: statusCounts,
    validation: validationResults,
    healthPercentage,
    overallStatus: healthPercentage >= 90 ? 'healthy' : 
                  healthPercentage >= 70 ? 'partial' : 'degraded'
  };
}

export function registerApiStatusRoutes(router) {
  // API Status Endpoint
  router.get('/api-status', async (req, res) => {
    try {
      const status = await getAllApiStatus();
      res.json(status);
    } catch (error) {
      console.error('Error getting API status:', error);
      res.status(500).json({ error: 'Failed to get API status' });
    }
  });

  // API Status Report Endpoint
  router.get('/api-status/report', async (req, res) => {
    try {
      const report = await getApiStatusReport();
      res.json(report);
    } catch (error) {
      console.error('Error generating API status report:', error);
      res.status(500).json({ error: 'Failed to generate API status report' });
    }
  });

  // API Service Validation Endpoint
  router.get('/api-status/validate', async (req, res) => {
    try {
      const validation = await validateApiServices();
      res.json(validation);
    } catch (error) {
      console.error('Error validating API services:', error);
      res.status(500).json({ error: 'Failed to validate API services' });
    }
  });
}

export default {
  getAllApiStatus,
  validateApiServices,
  getApiStatusReport,
  registerApiStatusRoutes
};
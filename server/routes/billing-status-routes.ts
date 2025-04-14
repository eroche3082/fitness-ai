import { Router } from 'express';
import { BillingStatusService } from '../services/billing-status';
import { aiConfig } from '../config/api-keys';

const router = Router();
const billingStatusService = new BillingStatusService();

// Global variable to store the current active API key for testing
let activeApiKey: string | undefined;

// Get the status of Vertex AI API
router.get('/vertex', async (req, res) => {
  try {
    const status = await billingStatusService.checkVertexApiStatus();
    res.json(status);
  } catch (error: any) {
    console.error('Error checking Vertex API status:', error);
    res.status(500).json({
      isActive: false,
      message: 'Failed to check Vertex API status',
      error: error.message
    });
  }
});

// Get the status of Vision API
router.get('/vision', async (req, res) => {
  try {
    const status = await billingStatusService.checkVisionApiStatus();
    res.json(status);
  } catch (error: any) {
    console.error('Error checking Vision API status:', error);
    res.status(500).json({
      isActive: false,
      message: 'Failed to check Vision API status',
      error: error.message
    });
  }
});

// Get the status of Gemini API
router.get('/gemini', async (req, res) => {
  try {
    const status = await billingStatusService.checkGeminiApiStatus();
    res.json(status);
  } catch (error: any) {
    console.error('Error checking Gemini API status:', error);
    res.status(500).json({
      isActive: false,
      message: 'Failed to check Gemini API status',
      error: error.message
    });
  }
});

// Get the status of Speech API
router.get('/speech', async (req, res) => {
  try {
    const status = await billingStatusService.checkSpeechApiStatus();
    res.json(status);
  } catch (error: any) {
    console.error('Error checking Speech API status:', error);
    res.status(500).json({
      isActive: false,
      message: 'Failed to check Speech API status',
      error: error.message
    });
  }
});

// Get overall API key status (available APIs, missing APIs, etc.)
router.get('/api-key-status', async (req, res) => {
  try {
    const status = await billingStatusService.getApiKeyStatus();
    res.json(status);
  } catch (error: any) {
    console.error('Error checking API key status:', error);
    res.status(500).json({
      message: 'Failed to check API key status',
      error: error.message
    });
  }
});

// Endpoint to switch to a specific API key for testing
router.post('/switch-key', async (req, res) => {
  try {
    const { keyName } = req.body;
    
    if (!keyName || typeof keyName !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing keyName parameter'
      });
    }
    
    // Check if the requested key exists in the environment
    if (!process.env[keyName]) {
      return res.status(404).json({
        success: false,
        message: `API key ${keyName} not found in environment variables`
      });
    }
    
    // Update aiConfig directly (both properties)
    aiConfig.apiKey = process.env[keyName];
    aiConfig.activeKeyName = keyName;
    
    // Store for reference
    activeApiKey = process.env[keyName];
    
    // Force reinitialize the service with the new key
    billingStatusService.reinitialize(activeApiKey);
    
    console.log(`Switched to API key: ${keyName}`);
    
    res.json({
      success: true,
      message: `Switched to API key: ${keyName}`,
      keyName: keyName,
      keyPrefix: process.env[keyName]?.substring(0, 5) + '...'
    });
  } catch (error: any) {
    console.error('Error switching API key:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to switch API key',
      error: error.message
    });
  }
});

// Check the current API key being used
router.get('/current-key', async (req, res) => {
  try {
    // List all API keys present in the environment
    const apiKeys = {
      GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY,
      VERTEX_API_KEY: !!process.env.VERTEX_API_KEY,
      GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
      GOOGLE_GROUP1_API_KEY: !!process.env.GOOGLE_GROUP1_API_KEY,
      GOOGLE_GROUP2_API_KEY: !!process.env.GOOGLE_GROUP2_API_KEY,
      GOOGLE_GROUP3_API_KEY: !!process.env.GOOGLE_GROUP3_API_KEY
    };
    
    // Get the key name based on the actual API key value
    let detectedKeySource = 'Unknown';
    if (aiConfig.apiKey) {
      if (process.env.GOOGLE_API_KEY && aiConfig.apiKey === process.env.GOOGLE_API_KEY) detectedKeySource = 'GOOGLE_API_KEY';
      else if (process.env.VERTEX_API_KEY && aiConfig.apiKey === process.env.VERTEX_API_KEY) detectedKeySource = 'VERTEX_API_KEY';
      else if (process.env.GEMINI_API_KEY && aiConfig.apiKey === process.env.GEMINI_API_KEY) detectedKeySource = 'GEMINI_API_KEY';
      else if (process.env.GOOGLE_GROUP1_API_KEY && aiConfig.apiKey === process.env.GOOGLE_GROUP1_API_KEY) detectedKeySource = 'GOOGLE_GROUP1_API_KEY';
      else if (process.env.GOOGLE_GROUP2_API_KEY && aiConfig.apiKey === process.env.GOOGLE_GROUP2_API_KEY) detectedKeySource = 'GOOGLE_GROUP2_API_KEY';
      else if (process.env.GOOGLE_GROUP3_API_KEY && aiConfig.apiKey === process.env.GOOGLE_GROUP3_API_KEY) detectedKeySource = 'GOOGLE_GROUP3_API_KEY';
    }
    
    // Get the API key currently being used
    const keyInfo = {
      usingKey: !!aiConfig.apiKey,
      keySource: detectedKeySource,
      activeKeyName: aiConfig.activeKeyName || 'Not set',
      projectId: aiConfig.projectId,
      region: aiConfig.region,
      availableKeys: apiKeys,
      envData: process.env.GOOGLE_GROUP1_API_KEY ? 'GROUP1 set' : 'GROUP1 missing',
      configValue: aiConfig.apiKey ? aiConfig.apiKey.substring(0, 5) + "..." : 'No key'
    };
    
    res.json(keyInfo);
  } catch (error: any) {
    console.error('Error checking current API key:', error);
    res.status(500).json({
      message: 'Failed to check current API key',
      error: error.message
    });
  }
});

export default router;
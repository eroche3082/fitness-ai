import { Router } from 'express';
import { BillingStatusService } from '../services/billing-status';

const router = Router();
const billingStatusService = new BillingStatusService();

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

export default router;
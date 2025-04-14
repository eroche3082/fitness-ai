import { Router } from 'express';
import { checkBillingStatus } from '../services/billing-status';

const router = Router();

/**
 * GET /api/billing-status
 * Returns the current billing status for the Google Cloud APIs
 */
router.get('/billing-status', async (req, res) => {
  try {
    const billingStatus = await checkBillingStatus();
    res.json(billingStatus);
  } catch (error) {
    console.error('Error checking billing status:', error);
    res.status(500).json({ 
      isActive: false,
      projectId: "Unknown",
      error: "Failed to check billing status" 
    });
  }
});

/**
 * GET /api/api-key-status
 * Returns the status of all configured API keys
 */
router.get('/api-key-status', async (req, res) => {
  try {
    // Note: We would typically call a function to check all API key statuses
    // For now, we'll just use the billing status check as a proxy
    const billingStatus = await checkBillingStatus();
    
    res.json({
      vertex: billingStatus.isActive,
      message: billingStatus.message || billingStatus.error || "API status check completed"
    });
  } catch (error) {
    console.error('Error checking API keys:', error);
    res.status(500).json({ 
      error: "Failed to check API key status" 
    });
  }
});

export default router;
/**
 * Billing Status API Routes
 * 
 * These routes provide diagnostic information about Google Cloud API billing status,
 * quota limits, usage, and credit remaining.
 */

import express from 'express';
import { getBillingStatus } from '../services/billing-status';

const router = express.Router();

// GET /api/billing-status
router.get('/', async (req, res) => {
  try {
    const billingStatus = await getBillingStatus();
    res.json(billingStatus);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to retrieve billing status',
      message: error.message
    });
  }
});

export default router;
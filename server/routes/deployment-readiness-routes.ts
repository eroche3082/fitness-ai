/**
 * Deployment Readiness Routes
 * 
 * These routes provide access to the deployment readiness assessment service,
 * which evaluates the platform's readiness for production deployment.
 */

import express from 'express';
import { generateDeploymentReadinessReport } from '../services/deployment-readiness';

const router = express.Router();

/**
 * @route GET /api/deployment/readiness
 * @desc Get a comprehensive deployment readiness report
 * @access Admin only (to be implemented)
 */
router.get('/api/deployment/readiness', async (req, res) => {
  try {
    const report = await generateDeploymentReadinessReport();
    res.json(report);
  } catch (error) {
    console.error('Error generating deployment readiness report:', error);
    res.status(500).json({ 
      error: 'Failed to generate deployment readiness report',
      message: error.message
    });
  }
});

/**
 * @route GET /api/deployment/readiness/summary
 * @desc Get a simplified summary of deployment readiness
 * @access Admin only (to be implemented)
 */
router.get('/api/deployment/readiness/summary', async (req, res) => {
  try {
    const report = await generateDeploymentReadinessReport();
    
    // Extract just the key metrics for a simplified view
    const summary = {
      timestamp: report.timestamp,
      readyForLaunch: report.readyForLaunch,
      deploymentReadiness: report.deploymentReadiness,
      apiServicesActive: Object.values(report.apiStatus).filter(status => status === 'active').length,
      apiServicesTotal: Object.keys(report.apiStatus).length,
      missingComponentsCount: report.missing.length,
      securitySuggestionsCount: report.securitySuggestions.length
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Error generating deployment readiness summary:', error);
    res.status(500).json({ 
      error: 'Failed to generate deployment readiness summary',
      message: error.message
    });
  }
});

export default router;
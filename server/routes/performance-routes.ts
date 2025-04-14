/**
 * Performance Analytics Routes
 * 
 * Routes for accessing and updating performance analytics data for the admin dashboard.
 */

import { Router, Request, Response } from 'express';
import { getPerformanceAnalytics, recordSystemMetric } from '../services/performance-analytics-service';

const router = Router();

/**
 * Get comprehensive performance analytics
 * 
 * @route GET /api/performance/analytics
 * @group Performance - Performance analytics operations
 * @returns {Object} 200 - Comprehensive performance analytics data
 * @returns {Error} 500 - Unexpected error
 */
router.get('/api/performance/analytics', async (req: Request, res: Response) => {
  try {
    const analytics = await getPerformanceAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching performance analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

/**
 * Get performance data for a specific time range
 * 
 * @route GET /api/performance/timerange
 * @group Performance - Performance analytics operations
 * @param {string} start.query - Start date (ISO string)
 * @param {string} end.query - End date (ISO string)
 * @param {string} category.query - Optional category filter
 * @returns {Object} 200 - Performance data for the specified time range
 * @returns {Error} 400 - Invalid parameters
 * @returns {Error} 500 - Unexpected error
 */
router.get('/api/performance/timerange', async (req: Request, res: Response) => {
  try {
    const { start, end, category } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start and end dates are required' 
      });
    }
    
    const startDate = new Date(start as string);
    const endDate = new Date(end as string);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid date format' 
      });
    }
    
    // Call the service to get analytics for the specified time range
    // For this demo, we'll return the full analytics regardless of time range
    const analytics = await getPerformanceAnalytics();
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching performance data for time range:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

/**
 * Record a new system metric
 * 
 * @route POST /api/performance/metric
 * @group Performance - Performance analytics operations
 * @param {Object} request.body - The metric to record
 * @returns {Object} 200 - The recorded metric
 * @returns {Error} 400 - Invalid metric data
 * @returns {Error} 500 - Unexpected error
 */
router.post('/api/performance/metric', async (req: Request, res: Response) => {
  try {
    const { category, name, value, unit } = req.body;
    
    if (!category || !name || value === undefined || !unit) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: category, name, value, and unit are required' 
      });
    }
    
    const metric = await recordSystemMetric({ category, name, value, unit });
    
    res.json({ 
      success: true, 
      metric 
    });
  } catch (error) {
    console.error('Error recording system metric:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

/**
 * Get service health status
 * 
 * @route GET /api/performance/health
 * @group Performance - Performance analytics operations
 * @returns {Object} 200 - Service health status
 * @returns {Error} 500 - Unexpected error
 */
router.get('/api/performance/health', async (req: Request, res: Response) => {
  try {
    const analytics = await getPerformanceAnalytics();
    res.json(analytics.serviceHealth);
  } catch (error) {
    console.error('Error fetching service health:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

/**
 * Get resource utilization
 * 
 * @route GET /api/performance/resources
 * @group Performance - Performance analytics operations
 * @returns {Object} 200 - Resource utilization data
 * @returns {Error} 500 - Unexpected error
 */
router.get('/api/performance/resources', async (req: Request, res: Response) => {
  try {
    const analytics = await getPerformanceAnalytics();
    res.json(analytics.resourceUtilization);
  } catch (error) {
    console.error('Error fetching resource utilization:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

/**
 * Get user activity metrics
 * 
 * @route GET /api/performance/users
 * @group Performance - Performance analytics operations
 * @returns {Object} 200 - User activity metrics
 * @returns {Error} 500 - Unexpected error
 */
router.get('/api/performance/users', async (req: Request, res: Response) => {
  try {
    const analytics = await getPerformanceAnalytics();
    
    // Combine user activity and metrics for a more comprehensive view
    const userMetrics = {
      ...analytics.userActivity,
      ...analytics.userMetrics
    };
    
    res.json(userMetrics);
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

/**
 * Get improvement recommendations
 * 
 * @route GET /api/performance/recommendations
 * @group Performance - Performance analytics operations
 * @returns {Object} 200 - Improvement recommendations
 * @returns {Error} 500 - Unexpected error
 */
router.get('/api/performance/recommendations', async (req: Request, res: Response) => {
  try {
    const analytics = await getPerformanceAnalytics();
    res.json({ recommendations: analytics.recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
});

export default router;
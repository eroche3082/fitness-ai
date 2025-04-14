/**
 * Smart Patch System API Routes
 * 
 * This file defines the API endpoints for the Smart Patch System, handling
 * diagnosis, recommendations, and patch history.
 */

import { diagnosePatchNeeds, getAllPatches, getPatchHistory } from '../services/patch-diagnosis-service';
import { recommendPatches, getPatchDetails } from '../services/patch-recommendation-service';
import { Request, Response, Express } from 'express';

/**
 * Get all available patches
 */
async function handleGetAllPatches(req: Request, res: Response) {
  try {
    // Get all available patches
    const allPatches = getAllPatches();
    
    // Return the patches
    res.json({
      success: true,
      patches: allPatches
    });
  } catch (error) {
    console.error('Error getting all patches:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve patches'
    });
  }
}

/**
 * Get details for a specific patch
 */
async function handleGetPatchDetails(req: Request, res: Response) {
  try {
    const { patchId } = req.params;
    
    if (!patchId) {
      return res.status(400).json({
        success: false,
        error: 'Patch ID is required'
      });
    }
    
    // Get the patch details
    const patchDetails = getPatchDetails(patchId);
    
    if (!patchDetails) {
      return res.status(404).json({
        success: false,
        error: 'Patch not found'
      });
    }
    
    // Return the patch details
    res.json({
      success: true,
      patch: patchDetails
    });
  } catch (error) {
    console.error('Error getting patch details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve patch details'
    });
  }
}

/**
 * Diagnose user's current state
 */
async function handleDiagnosis(req: Request, res: Response) {
  try {
    const { userId, userInput } = req.body;
    
    if (!userId || !userInput) {
      return res.status(400).json({
        success: false,
        error: 'User ID and input text are required'
      });
    }
    
    // Perform the diagnosis
    const diagnosis = await diagnosePatchNeeds(parseInt(userId), userInput);
    
    // Return the diagnosis result
    res.json({
      success: true,
      diagnosis
    });
  } catch (error) {
    console.error('Error performing diagnosis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze user state'
    });
  }
}

/**
 * Get personalized patch recommendations
 */
async function handleRecommendations(req: Request, res: Response) {
  try {
    const { userId, userInput } = req.body;
    
    if (!userId || !userInput) {
      return res.status(400).json({
        success: false,
        error: 'User ID and input text are required'
      });
    }
    
    // Generate personalized recommendations
    const recommendations = await recommendPatches(parseInt(userId), userInput);
    
    // Return the recommendations
    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
}

/**
 * Get user's patch history
 */
async function handleGetPatchHistory(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }
    
    // Get the user's patch history
    const history = await getPatchHistory(parseInt(userId));
    
    // Return the history
    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error getting patch history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve patch history'
    });
  }
}

/**
 * Save user feedback on patch effectiveness
 */
async function handleSaveFeedback(req: Request, res: Response) {
  try {
    const { userId, patchId, effectiveness, notes } = req.body;
    
    if (!userId || !patchId || effectiveness === undefined) {
      return res.status(400).json({
        success: false,
        error: 'User ID, patch ID, and effectiveness rating are required'
      });
    }
    
    // In a real implementation, this would save to a database
    console.log(`Saving feedback for user ${userId}, patch ${patchId}: ${effectiveness}/10`);
    
    // TODO: Implement actual storage mechanism
    
    // Return success
    res.json({
      success: true,
      message: 'Feedback saved successfully'
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save feedback'
    });
  }
}

/**
 * Register all patch system routes
 */
export function registerPatchRoutes(app: Express) {
  // Get all available patches
  app.get('/api/patches', handleGetAllPatches);
  
  // Get details for a specific patch
  app.get('/api/patches/:patchId', handleGetPatchDetails);
  
  // Diagnose user's current state
  app.post('/api/patches/diagnose', handleDiagnosis);
  
  // Get personalized patch recommendations
  app.post('/api/patches/recommend', handleRecommendations);
  
  // Get user's patch history
  app.get('/api/patches/history/:userId', handleGetPatchHistory);
  
  // Save user feedback on patch effectiveness
  app.post('/api/patches/feedback', handleSaveFeedback);
}
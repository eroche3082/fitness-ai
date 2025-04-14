/**
 * Smart Patch Diagnosis Service
 * 
 * This service analyzes user data from multiple sources to determine their
 * current physical, emotional, and cognitive state, and then recommends
 * appropriate patches to restore balance or enhance performance.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { storage } from '../storage';
import { generateGeminiResponse } from '../gemini';

// Calculate __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load patch data from JSON files
const patchesDataPath = path.join(__dirname, '../data/patch_data/patches.json');
const patchesData = JSON.parse(fs.readFileSync(patchesDataPath, 'utf8'));

// Define the type for patch states
type PatchState = 'focus_needed' | 'low_energy' | 'emotional_imbalance' | 'creative_block' | 'sleep_issue' | 'recovery_needed' | 'high_stress';

// Define the type for statePatches
interface StatePatchesMap {
  [key: string]: string[];
}

// Mapping of states to recommended patches
const statePatches: StatePatchesMap = {
  focus_needed: [
    'alpha-focus', 
    'healy-mental', 
    'apollo-focus'
  ],
  low_energy: [
    'ignite-energy', 
    'lwenergy', 
    'healy-gold', 
    'apollo-energy'
  ],
  emotional_imbalance: [
    'soma-calm', 
    'healy-relax', 
    'apollo-calm', 
    'apollo-social'
  ],
  creative_block: [
    'aether-creative'
  ],
  sleep_issue: [
    'drift-sleep', 
    'lwsilent', 
    'healy-deep', 
    'apollo-sleep'
  ],
  recovery_needed: [
    'shield-immune', 
    'lwx39', 
    'lwicewave', 
    'lwglutathione', 
    'apollo-recover'
  ],
  high_stress: [
    'terra-ground', 
    'soma-calm', 
    'apollo-calm'
  ]
};

/**
 * Analyze text input to detect sentiment and emotional state
 * @param text Text input from the user
 */
async function analyzeSentiment(text: string) {
  try {
    // Use Gemini to analyze sentiment
    const prompt = `
      Analyze the following text and determine the emotional state of the user.
      Consider phrases that indicate fatigue, stress, anxiety, mental fog, difficulty sleeping, or other physical/emotional states.
      
      User text: "${text}"
      
      Respond with a JSON object with two fields:
      1. sentiment: a number from -1 (very negative) to 1 (very positive)
      2. states: an array of states detected from the following options: focus_needed, low_energy, emotional_imbalance, creative_block, sleep_issue, recovery_needed, high_stress
      
      Format the response as valid JSON only, with no additional text.
    `;
    
    const response = await generateGeminiResponse([
      { role: "user", content: prompt }
    ]);
    
    // Parse the response to extract sentiment and emotional states
    try {
      const parsedResponse = JSON.parse(response);
      return {
        sentiment: parsedResponse.sentiment,
        detectedStates: parsedResponse.states
      };
    } catch (err) {
      console.error('Error parsing Gemini sentiment response:', err);
      return {
        sentiment: 0,
        detectedStates: []
      };
    }
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return {
      sentiment: 0,
      detectedStates: []
    };
  }
}

/**
 * Gets recent fitness data for a user
 * @param userId User ID
 */
async function getFitnessMetrics(userId: number) {
  try {
    // Get last 7 days of metrics for different types
    const sleepData = await storage.getHealthMetrics(userId, 'sleep', 7);
    const heartRateData = await storage.getHealthMetrics(userId, 'heart_rate', 7);
    const activityData = await storage.getHealthMetrics(userId, 'activity', 7);
    
    // Calculate average metrics
    const avgSleep = sleepData.length > 0 ? 
      sleepData.reduce((sum, item) => sum + item.value, 0) / sleepData.length : 
      0;
    
    const avgHeartRate = heartRateData.length > 0 ? 
      heartRateData.reduce((sum, item) => sum + item.value, 0) / heartRateData.length : 
      0;
    
    const avgActivity = activityData.length > 0 ? 
      activityData.reduce((sum, item) => sum + item.value, 0) / activityData.length : 
      0;
    
    return {
      sleep: avgSleep,
      heartRate: avgHeartRate,
      activity: avgActivity
    };
  } catch (error) {
    console.error('Error getting fitness metrics:', error);
    return {
      sleep: 0,
      heartRate: 0,
      activity: 0
    };
  }
}

// Define a type for the patch object
interface Patch {
  id: string;
  name: string;
  [key: string]: any;
}

/**
 * Find best matching patches based on user state
 * @param states Array of detected states
 */
function findMatchingPatches(states: string[]): Patch[] {
  if (!states || states.length === 0) {
    // Default recommendations if no states detected
    return [
      patchesData.standardPatches[0],
      patchesData.standardPatches[1],
      patchesData.standardPatches[2]
    ];
  }
  
  const recommendations: Patch[] = [];
  
  // For each detected state, add relevant patches
  for (const state of states) {
    const patchIds = statePatches[state as keyof typeof statePatches] || [];
    
    for (const patchId of patchIds) {
      // Check in standard patches
      const standardPatch = patchesData.standardPatches.find((p: Patch) => p.id === patchId);
      if (standardPatch && !recommendations.includes(standardPatch)) {
        recommendations.push(standardPatch);
      }
      
      // Check in LifeWave products
      const lifewavePatch = patchesData.lifewaveProducts.find((p: Patch) => p.id === patchId);
      if (lifewavePatch && !recommendations.includes(lifewavePatch)) {
        recommendations.push(lifewavePatch);
      }
      
      // Check in Healy frequencies
      const healyPatch = patchesData.healyFrequencies.find((p: Patch) => p.id === patchId);
      if (healyPatch && !recommendations.includes(healyPatch)) {
        recommendations.push(healyPatch);
      }
      
      // Check in Apollo modes
      const apolloPatch = patchesData.apolloModes.find((p: Patch) => p.id === patchId);
      if (apolloPatch && !recommendations.includes(apolloPatch)) {
        recommendations.push(apolloPatch);
      }
    }
  }
  
  // Limit to top 5 recommendations
  return recommendations.slice(0, 5);
}

/**
 * Diagnose user state and recommend patches
 * @param userId User ID
 * @param userInput Text input describing how the user feels
 */
export async function diagnosePatchNeeds(userId: number, userInput: string) {
  try {
    // Get sentiment analysis and detected states
    const sentimentAnalysis = await analyzeSentiment(userInput);
    const { sentiment, detectedStates } = sentimentAnalysis;
    
    // Get fitness metrics to supplement analysis
    const fitnessMetrics = await getFitnessMetrics(userId);
    
    // Add additional states based on fitness metrics
    const allStates = [...detectedStates];
    
    if (fitnessMetrics.sleep < 7) {
      // If average sleep is less than 7 hours
      if (!allStates.includes('sleep_issue')) {
        allStates.push('sleep_issue');
      }
    }
    
    if (fitnessMetrics.activity > 8000 && fitnessMetrics.heartRate > 75) {
      // If high activity and elevated heart rate, possibly needs recovery
      if (!allStates.includes('recovery_needed')) {
        allStates.push('recovery_needed');
      }
    }
    
    if (fitnessMetrics.activity < 2000 && sentiment < -0.3) {
      // If low activity and negative sentiment, possibly low energy
      if (!allStates.includes('low_energy')) {
        allStates.push('low_energy');
      }
    }
    
    // Find matching patches based on detected states
    const recommendations = findMatchingPatches(allStates);
    
    // Save this diagnosis to history
    await saveDiagnosisHistory(userId, {
      timestamp: new Date().toISOString(),
      userInput,
      detectedStates: allStates,
      recommendations: recommendations.map(r => r.id)
    });
    
    return {
      timestamp: new Date().toISOString(),
      sentiment,
      detectedStates: allStates,
      fitnessMetrics,
      recommendations
    };
  } catch (error) {
    console.error('Error diagnosing patch needs:', error);
    throw error;
  }
}

// Define an interface for diagnosis history
interface DiagnosisHistory {
  timestamp: string;
  userInput: string;
  detectedStates: string[];
  recommendations: string[];
  [key: string]: any;
}

/**
 * Save diagnosis history to storage
 */
async function saveDiagnosisHistory(userId: number, diagnosis: DiagnosisHistory) {
  // This would normally be saved to a database
  console.log(`Saved diagnosis for user ${userId}:`, diagnosis);
  
  // TODO: Implement actual storage mechanism
  
  return true;
}

/**
 * Get user's patch recommendation history
 * @param userId User ID
 */
export async function getPatchHistory(userId: number) {
  try {
    return await storage.getUserPatchHistory(userId);
  } catch (error) {
    console.error('Error getting patch history:', error);
    return [];
  }
}

/**
 * Get all available patches
 */
export function getAllPatches() {
  return patchesData;
}

export default {
  diagnosePatchNeeds,
  getPatchHistory,
  getAllPatches
};
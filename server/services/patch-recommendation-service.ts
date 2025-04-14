/**
 * Smart Patch Recommendation Service
 * 
 * This service provides recommendations for smart patches based on user's current state
 * and historical data, integrating with the diagnosis service to create personalized
 * recommendations.
 */

import { storage } from '../storage';
import { diagnosePatchNeeds, getAllPatches } from './patch-diagnosis-service';
import { generateGeminiResponse } from '../gemini';

// Recommendation context templates
const recommendationContextTemplates = {
  focus: "This patch is designed to enhance your mental clarity and focus. The ALPHA patch works by stimulating specific neural pathways responsible for attention and cognitive processing. Apply it when you need to concentrate on important tasks or feel mentally foggy.",
  
  emotional_balance: "The SOMA patch helps restore emotional equilibrium by calming the nervous system and promoting a sense of inner peace. It's especially effective during times of emotional turbulence or when you feel overwhelmed by strong emotions.",
  
  creativity: "Your AETHER patch activates the brain's creative centers, helping you overcome creative blocks and access innovative thinking. Use it when you need inspiration or fresh perspectives on challenges you're facing.",
  
  energy: "The IGNITE patch provides a natural energy boost without the crash associated with caffeine. It works by optimizing cellular energy production and is perfect for combating fatigue or low physical energy states.",
  
  sleep: "Your DRIFT patch signals to your body that it's time to prepare for deep, restorative sleep. It helps regulate your natural sleep cycle and promotes the production of sleep-inducing neurochemicals. Apply it 30-60 minutes before bedtime.",
  
  protection: "The SHIELD patch strengthens your energetic boundaries and supports immune function. It's ideal for times when you feel vulnerable to external influences or need to reinforce your natural defenses."
};

/**
 * Generate a personalized recommendation for a patch
 * @param userId User ID
 * @param patchId Patch ID
 * @param userState Current user state description
 */
async function generatePersonalizedRecommendation(userId: number, patchId: string, userState: string) {
  try {
    // Get user profile information
    const user = await storage.getUser(userId);
    
    // Get the patch details
    const allPatches = getAllPatches();
    let patch = null;
    
    // Search in all patch categories
    if (!patch) patch = allPatches.standardPatches.find(p => p.id === patchId);
    if (!patch) patch = allPatches.lifewaveProducts.find(p => p.id === patchId);
    if (!patch) patch = allPatches.healyFrequencies.find(p => p.id === patchId);
    if (!patch) patch = allPatches.apolloModes.find(p => p.id === patchId);
    
    if (!patch) {
      throw new Error(`Patch with ID ${patchId} not found`);
    }
    
    // Get base context template based on patch type
    let contextTemplate = '';
    if (patchId.startsWith('alpha')) {
      contextTemplate = recommendationContextTemplates.focus;
    } else if (patchId.startsWith('soma')) {
      contextTemplate = recommendationContextTemplates.emotional_balance;
    } else if (patchId.startsWith('aether')) {
      contextTemplate = recommendationContextTemplates.creativity;
    } else if (patchId.startsWith('ignite') || patchId.startsWith('lwenergy') || patchId.includes('energy')) {
      contextTemplate = recommendationContextTemplates.energy;
    } else if (patchId.startsWith('drift') || patchId.includes('sleep')) {
      contextTemplate = recommendationContextTemplates.sleep;
    } else if (patchId.startsWith('shield') || patchId.includes('protect')) {
      contextTemplate = recommendationContextTemplates.protection;
    }
    
    // Generate personalized recommendation using Gemini
    const geminiPrompt = `
      You are an intelligent fitness and wellness AI assistant specializing in personalized patch therapy.
      
      USER PROFILE:
      Name: ${user?.name || 'User'}
      Fitness Goal: ${user?.fitnessGoal || 'General wellness'}
      
      CURRENT STATE:
      ${userState}
      
      RECOMMENDATION CONTEXT:
      ${contextTemplate}
      
      PATCH DETAILS:
      Name: ${patch.name}
      Description: ${patch.description}
      Benefits: ${patch.benefits ? patch.benefits.join(', ') : 'Various benefits'}
      
      Please generate a personalized recommendation for using this patch that addresses the user's current state.
      The recommendation should be motivating, grounded, and slightly mystical in tone.
      Include specific placement instructions and expected effects.
      Keep your response between 3-4 sentences only.
    `;
    
    const personalizedRecommendation = await generateGeminiResponse([
      { role: "user", content: geminiPrompt }
    ]);
    
    return personalizedRecommendation;
  } catch (error) {
    console.error('Error generating personalized recommendation:', error);
    // Fallback to generic recommendation if AI generation fails
    return `Apply the patch on the recommended placement area for optimal results. It should help address your current needs and restore balance to your system. Follow the instructions provided with the patch for best results.`;
  }
}

/**
 * Recommend patches based on user input and saved preferences
 * @param userId User ID
 * @param userInput Text input describing how the user feels
 */
export async function recommendPatches(userId: number, userInput: string) {
  try {
    // Diagnose user's state and get initial recommendations
    const diagnosis = await diagnosePatchNeeds(userId, userInput);
    
    // Get user preferences and history to enhance recommendations
    const patchHistory = await storage.getUserPatchHistory(userId);
    
    // Sort recommendations based on user history and preferences
    const enhancedRecommendations = [];
    
    for (const patch of diagnosis.recommendations) {
      // Generate a personalized recommendation for this patch
      const personalizedMessage = await generatePersonalizedRecommendation(
        userId,
        patch.id,
        userInput + ' ' + diagnosis.detectedStates.join(' ')
      );
      
      // Add to enhanced recommendations
      enhancedRecommendations.push({
        ...patch,
        personalizedMessage,
        relevanceScore: calculateRelevanceScore(patch, diagnosis.detectedStates, patchHistory)
      });
    }
    
    // Sort by relevance score
    enhancedRecommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Save this recommendation to history
    await saveRecommendationHistory(userId, {
      timestamp: new Date().toISOString(),
      userInput,
      recommendations: enhancedRecommendations.map(r => r.id)
    });
    
    return {
      timestamp: new Date().toISOString(),
      userState: {
        input: userInput,
        detectedStates: diagnosis.detectedStates
      },
      recommendations: enhancedRecommendations
    };
  } catch (error) {
    console.error('Error recommending patches:', error);
    throw error;
  }
}

/**
 * Calculate relevance score based on user history and detected states
 */
function calculateRelevanceScore(patch: any, detectedStates: string[], patchHistory: any[]) {
  let score = 0;
  
  // Base score from the number of matching states
  if (patch.target_state && detectedStates.includes(patch.target_state)) {
    score += 5;
  }
  
  // Additional points for each matching state
  detectedStates.forEach(state => {
    if (state.includes(patch.id)) score += 2;
  });
  
  // Adjust score based on user history
  const historyEntry = patchHistory.find(h => h.patchId === patch.id);
  if (historyEntry) {
    // Boost score if user has had good results with this patch before
    if (historyEntry.effectiveness > 7) {
      score += 3;
    } else if (historyEntry.effectiveness > 5) {
      score += 1;
    } else if (historyEntry.effectiveness < 3) {
      // Reduce score if user has had poor results
      score -= 2;
    }
  }
  
  return score;
}

/**
 * Save recommendation history
 */
async function saveRecommendationHistory(userId: number, recommendation: any) {
  try {
    // This would save to a database in a real implementation
    console.log(`Saved recommendation for user ${userId}:`, recommendation);
    
    // TODO: Implement actual storage mechanism
    
    return true;
  } catch (error) {
    console.error('Error saving recommendation history:', error);
    return false;
  }
}

/**
 * Get specific patch details
 * @param patchId Patch ID
 */
export function getPatchDetails(patchId: string) {
  const allPatches = getAllPatches();
  
  // Search in all patch categories
  let patch = null;
  if (!patch) patch = allPatches.standardPatches.find(p => p.id === patchId);
  if (!patch) patch = allPatches.lifewaveProducts.find(p => p.id === patchId);
  if (!patch) patch = allPatches.healyFrequencies.find(p => p.id === patchId);
  if (!patch) patch = allPatches.apolloModes.find(p => p.id === patchId);
  
  return patch;
}

export default {
  recommendPatches,
  getPatchDetails
};
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

// Define the Patch interface
interface Patch {
  id: string;
  name: string;
  description?: string;
  benefits?: string[];
  target_state?: string;
  [key: string]: any;
}

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
    if (!patch) patch = allPatches.standardPatches.find((p: Patch) => p.id === patchId);
    if (!patch) patch = allPatches.lifewaveProducts.find((p: Patch) => p.id === patchId);
    if (!patch) patch = allPatches.healyFrequencies.find((p: Patch) => p.id === patchId);
    if (!patch) patch = allPatches.apolloModes.find((p: Patch) => p.id === patchId);
    
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
    
    // First prepare a good fallback message in case the AI fails
    const fallbackMessage = generateFallbackMessage(patch, userState);
    
    try {
      // Try to generate personalized recommendation using Gemini
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
    } catch (aiError) {
      console.error('Error with Gemini API:', aiError);
      // Return the prepared fallback message
      return fallbackMessage;
    }
  } catch (error) {
    console.error('Error generating personalized recommendation:', error);
    // Fallback to generic recommendation if everything else fails
    return `Apply the patch on the recommended placement area for optimal results. It should help address your current needs and restore balance to your system. Follow the instructions provided with the patch for best results.`;
  }
}

/**
 * Generate a fallback message when AI services are unavailable
 * @param patch The patch details
 * @param userState The user's current state description
 */
function generateFallbackMessage(patch: Patch, userState: string): string {
  // Determine which state the user is likely experiencing
  const lowercaseState = userState.toLowerCase();
  let detectedState = 'general';
  
  if (lowercaseState.includes('tired') || lowercaseState.includes('fatigue') || 
      lowercaseState.includes('energy') || lowercaseState.includes('exhausted')) {
    detectedState = 'energy';
  } else if (lowercaseState.includes('focus') || lowercaseState.includes('concentrate') || 
      lowercaseState.includes('attention') || lowercaseState.includes('distract')) {
    detectedState = 'focus';
  } else if (lowercaseState.includes('sleep') || lowercaseState.includes('insomnia') || 
      lowercaseState.includes('rest') || lowercaseState.includes('tired')) {
    detectedState = 'sleep';
  } else if (lowercaseState.includes('stress') || lowercaseState.includes('anxious') || 
      lowercaseState.includes('nervous') || lowercaseState.includes('overwhelm')) {
    detectedState = 'stress';
  } else if (lowercaseState.includes('pain') || lowercaseState.includes('sore') || 
      lowercaseState.includes('recover') || lowercaseState.includes('heal')) {
    detectedState = 'recovery';
  }
  
  // Predefined template messages for different states
  const templates: {[key: string]: string[]} = {
    energy: [
      `Based on how you're feeling, the ${patch.name} can help restore your natural energy flow. Apply it to the ${patch.placement || 'recommended area'} for 4-6 hours daily, preferably in the morning.`,
      `The ${patch.name} is particularly effective for boosting vitality when you're feeling depleted. Place it on the ${patch.placement || 'recommended area'} and you should notice effects within 30-60 minutes.`,
      `For your current low energy state, I recommend using the ${patch.name} on the ${patch.placement || 'recommended area'} first thing in the morning. This may help sustain your energy throughout the day.`
    ],
    focus: [
      `To enhance concentration, apply the ${patch.name} to the ${patch.placement || 'recommended area'} about 30 minutes before you need peak mental performance. It works by supporting optimal neural communication.`,
      `The ${patch.name} can help clear mental fog and sharpen focus. Place it on the ${patch.placement || 'recommended area'} during work or study sessions for best results.`,
      `When attention is scattered, the ${patch.name} may help center your thoughts. Apply to the ${patch.placement || 'recommended area'} and practice a few deep breaths to activate its full potential.`
    ],
    sleep: [
      `For improved rest, apply the ${patch.name} to the ${patch.placement || 'recommended area'} about an hour before bedtime. It helps signal to your body that it's time to transition to sleep mode.`,
      `The ${patch.name} works with your body's natural rhythm to promote deeper sleep. Place it on the ${patch.placement || 'recommended area'} and establish a calming bedtime routine for best results.`,
      `To address your sleep concerns, the ${patch.name} can be applied to the ${patch.placement || 'recommended area'} in the evening. It's designed to support your body's natural sleep cycle.`
    ],
    stress: [
      `During stressful periods, the ${patch.name} can help restore emotional balance. Apply to the ${patch.placement || 'recommended area'} and take a few moments to breathe deeply.`,
      `The ${patch.name} supports your body's ability to respond to stress more effectively. Place it on the ${patch.placement || 'recommended area'} during challenging situations.`,
      `For emotional harmony, the ${patch.name} works by regulating your nervous system response. Apply to the ${patch.placement || 'recommended area'} at the first sign of tension.`
    ],
    recovery: [
      `To support your body's healing process, apply the ${patch.name} to the ${patch.placement || 'recommended area or near the affected region'}. It's most effective when used consistently over several days.`,
      `The ${patch.name} can accelerate your recovery by supporting cellular regeneration. Place on the ${patch.placement || 'recommended area'} and ensure you're staying hydrated.`,
      `For recovery support, the ${patch.name} works best when applied to the ${patch.placement || 'recommended area'} after exertion. Combine with adequate rest for optimal results.`
    ],
    general: [
      `The ${patch.name} is designed to help restore balance to your system. Apply to the ${patch.placement || 'recommended area'} according to the included instructions for best results.`,
      `For optimal benefits, place the ${patch.name} on the ${patch.placement || 'recommended area'} at a time when you can be mindful of the subtle shifts in your wellbeing.`,
      `The ${patch.name} works in harmony with your body's natural processes. Apply to the ${patch.placement || 'recommended area'} and notice how your body responds over the next few hours.`
    ]
  };
  
  // Select a random template from the appropriate category
  const categoryTemplates = templates[detectedState];
  const randomIndex = Math.floor(Math.random() * categoryTemplates.length);
  return categoryTemplates[randomIndex];
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

// Define a history entry interface
interface PatchHistoryEntry {
  patchId: string;
  effectiveness: number;
  [key: string]: any;
}

/**
 * Calculate relevance score based on user history and detected states
 */
function calculateRelevanceScore(patch: Patch, detectedStates: string[], patchHistory: PatchHistoryEntry[]): number {
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

// Define recommendation history interface
interface RecommendationHistory {
  timestamp: string;
  userInput: string;
  recommendations: string[];
  [key: string]: any;
}

/**
 * Save recommendation history
 */
async function saveRecommendationHistory(userId: number, recommendation: RecommendationHistory): Promise<boolean> {
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
 * @returns The patch details or null if not found
 */
export function getPatchDetails(patchId: string): Patch | null {
  const allPatches = getAllPatches();
  
  // Search in all patch categories
  let patch: Patch | null = null;
  if (!patch) patch = allPatches.standardPatches.find((p: Patch) => p.id === patchId);
  if (!patch) patch = allPatches.lifewaveProducts.find((p: Patch) => p.id === patchId);
  if (!patch) patch = allPatches.healyFrequencies.find((p: Patch) => p.id === patchId);
  if (!patch) patch = allPatches.apolloModes.find((p: Patch) => p.id === patchId);
  
  return patch;
}

export default {
  recommendPatches,
  getPatchDetails
};
/**
 * User Service
 * 
 * This service manages user data, leads generation and tracking,
 * and code-based authentication/access.
 */

import { UserProfile } from './userCodeGenerator';
import vertexAIService from './vertexAIService';

/**
 * Local storage key for storing user data
 */
const USER_STORAGE_KEY = 'fitness_ai_user_data';

/**
 * Lead information interface for lead capture
 */
export interface LeadInfo {
  name: string;
  email: string;
  uniqueCode: string;
  category: string;
  date: string;
  preferences: Record<string, any>;
  source: string;
}

/**
 * Save user profile data to localStorage
 * 
 * @param profile User profile to save
 * @returns Saved user profile
 */
export function saveUserProfile(profile: UserProfile): UserProfile {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
  return profile;
}

/**
 * Get user profile from localStorage
 * 
 * @returns User profile or null if not found
 */
export function getUserProfile(): UserProfile | null {
  const data = localStorage.getItem(USER_STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Clear user profile from localStorage
 */
export function clearUserProfile(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Create a lead from user data for lead tracking
 * 
 * @param profile User profile data
 * @param source Source of the lead (default: 'chatbot')
 * @returns Lead information object
 */
export function createLead(profile: UserProfile, source: string = 'chatbot'): LeadInfo {
  return {
    name: profile.name,
    email: profile.email,
    uniqueCode: profile.uniqueCode || '',
    category: profile.category || 'BEG',
    date: new Date().toISOString(),
    preferences: {
      fitnessLevel: profile.fitnessLevel,
      fitnessGoals: profile.fitnessGoals,
      limitations: profile.limitations,
      workoutFrequency: profile.workoutFrequency,
      dietPreference: profile.dietPreference,
    },
    source
  };
}

/**
 * Save lead to backend system for tracking and marketing
 * In a production app, this would make an API call to the server
 * 
 * @param lead Lead information to save
 * @returns Promise resolving to success status
 */
export async function saveLead(lead: LeadInfo): Promise<boolean> {
  // Simulated API call
  console.log('Saving lead to system:', lead);
  
  // In a real app, this would be an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Store lead in localStorage for demonstration
  const existingLeads = JSON.parse(localStorage.getItem('fitness_ai_leads') || '[]');
  existingLeads.push(lead);
  localStorage.setItem('fitness_ai_leads', JSON.stringify(existingLeads));
  
  return true;
}

/**
 * Check if a unique code is valid and exists in the system
 * 
 * @param code Unique code to validate
 * @returns Promise resolving to validation result
 */
export async function validateCode(code: string): Promise<{
  valid: boolean;
  profile?: UserProfile;
  error?: string;
}> {
  // Simulated API call
  console.log('Validating code:', code);
  
  // In a real app, this would verify against the database
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // First check saved user in localStorage
  const savedUser = getUserProfile();
  if (savedUser && savedUser.uniqueCode === code) {
    return { valid: true, profile: savedUser };
  }
  
  // Then check format
  const codePattern = /^FIT-(BEG|INT|ADV|PRO|VIP)-\d{4}$/;
  if (!codePattern.test(code)) {
    return { valid: false, error: 'Invalid code format' };
  }
  
  // If code matches pattern but not found
  return { valid: false, error: 'Code not found in system' };
}

/**
 * Generate QR code data for a unique user code
 * 
 * @param code Unique user code
 * @returns QR code data URL or null if invalid
 */
export function generateQRCodeForUser(code: string): string | null {
  // In a real app, this would use a QR code library
  // For now, we'll return a placeholder
  if (!code || !code.match(/^FIT-(BEG|INT|ADV|PRO|VIP)-\d{4}$/)) {
    return null;
  }
  
  // Generate a simple SVG QR code (this is just a placeholder)
  // In a real app, use a proper QR code generator library
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 29 29">
    <rect width="100%" height="100%" fill="white"/>
    <text x="5" y="12" font-family="monospace" font-size="2" fill="black">${code}</text>
    <rect x="4" y="4" width="5" height="5" fill="black"/>
    <rect x="20" y="4" width="5" height="5" fill="black"/>
    <rect x="4" y="20" width="5" height="5" fill="black"/>
  </svg>`;
}

/**
 * Analyze user data with Vertex AI to enhance profiling
 * This mimics the AI-powered user profiling capability
 * 
 * @param userProfile User profile data
 * @returns Enhanced user profile with AI insights
 */
export async function enhanceProfileWithAI(userProfile: UserProfile): Promise<UserProfile & { aiInsights: any }> {
  try {
    // Convert user profile to the format expected by Vertex AI
    const userData = {
      name: userProfile.name,
      email: userProfile.email,
      fitnessLevel: userProfile.fitnessLevel,
      fitnessGoals: userProfile.fitnessGoals,
      limitations: userProfile.limitations,
      workoutFrequency: userProfile.workoutFrequency,
      preferredTime: userProfile.preferredTime,
      dietPreference: userProfile.dietPreference,
      sleepHours: userProfile.sleepHours,
      waterIntake: userProfile.waterIntake,
    };
    
    // Get AI analysis
    const analysis = await vertexAIService.analyzeWithVertexAI({
      type: 'user_categorization',
      userData
    });
    
    // Enhance profile with AI insights
    return {
      ...userProfile,
      aiInsights: {
        categoryReasoning: analysis.reasoning || [],
        recommendedActions: analysis.recommendedActions || [],
        confidence: analysis.confidence || 0,
        result: analysis.result || {}
      }
    };
  } catch (error) {
    console.error('Error enhancing profile with AI:', error);
    // Return original profile if AI enhancement fails
    return {
      ...userProfile,
      aiInsights: {
        categoryReasoning: ['Basic categorization without AI'],
        recommendedActions: ['Continue with standard onboarding'],
        confidence: 0.7,
        result: {}
      }
    };
  }
}

export default {
  saveUserProfile,
  getUserProfile,
  clearUserProfile,
  createLead,
  saveLead,
  validateCode,
  generateQRCodeForUser,
  enhanceProfileWithAI
};
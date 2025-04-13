/**
 * User Code Generator and Categorization System
 * 
 * This module handles:
 * 1. Analyzing user onboarding answers
 * 2. Categorizing users into specific levels/types
 * 3. Generating unique alphanumeric codes based on category and session
 * 4. Creating QR codes for dashboard access
 */

export type UserCategory = 'BEG' | 'INT' | 'ADV' | 'PRO' | 'VIP';

export interface UserProfile {
  name: string;
  email: string;
  fitnessLevel: string;
  fitnessGoals: string[];
  limitations: string;
  workoutFrequency: string;
  preferredTime: string;
  dietPreference: string;
  sleepHours: string;
  waterIntake: string;
  uniqueCode?: string; 
  category?: UserCategory;
}

/**
 * Categorize user based on their answers to onboarding questions
 * 
 * @param answers Record of user answers from onboarding
 * @returns User category code (3 letters)
 */
export function categorizeUser(answers: Record<number, any>): UserCategory {
  // In a real implementation, this would use Vertex AI for more advanced categorization
  
  // Basic categorization based on fitness level (question 3) and frequency (question 6)
  const fitnessLevel = answers[3]?.toString().toLowerCase() || '';
  const workoutFrequency = answers[6]?.toString().toLowerCase() || '';
  
  if (fitnessLevel.includes('advanced')) {
    return workoutFrequency.includes('frequent') ? 'PRO' : 'ADV';
  } else if (fitnessLevel.includes('intermediate')) {
    return 'INT';
  } else {
    return 'BEG';
  }
}

/**
 * Generate a unique code for user based on their category and random numbers
 * 
 * @param category User category code
 * @returns Unique identifier code in format: FIT-[CATEGORY]-[4-DIGIT]
 */
export function generateUniqueCode(category: UserCategory): string {
  // Generate random 4-digit number
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  
  // Create code in format: FIT-[CATEGORY]-[4-DIGIT]
  return `FIT-${category}-${randomDigits}`;
}

/**
 * Analyze user answers and create a full user profile with category and code
 * 
 * @param answers Record of user answers from onboarding
 * @returns Complete user profile with category and unique code
 */
export function createUserProfile(answers: Record<number, any>): UserProfile {
  // Map answers to profile properties
  const profile: UserProfile = {
    name: answers[1] || '',
    email: answers[2] || '',
    fitnessLevel: answers[3] || '',
    fitnessGoals: Array.isArray(answers[4]) ? answers[4] : [answers[4] || ''],
    limitations: answers[5] || '',
    workoutFrequency: answers[6] || '',
    preferredTime: answers[7] || '',
    dietPreference: answers[8] || '',
    sleepHours: answers[9] || '',
    waterIntake: answers[10] || '',
  };
  
  // Add category and unique code
  const category = categorizeUser(answers);
  profile.category = category;
  profile.uniqueCode = generateUniqueCode(category);
  
  return profile;
}

/**
 * Extract important information about user based on their category
 * 
 * @param category User category
 * @returns Description of the user category
 */
export function getCategoryDescription(category: UserCategory): string {
  switch (category) {
    case 'BEG':
      return 'Beginner level with foundational fitness programs';
    case 'INT':
      return 'Intermediate level with progressive workout plans';
    case 'ADV':
      return 'Advanced level with complex fitness routines';
    case 'PRO':
      return 'Professional level with athlete-grade training';
    case 'VIP':
      return 'VIP member with premium coaching and personalized plans';
    default:
      return 'Standard fitness member';
  }
}

/**
 * Get available features based on user category
 * 
 * @param category User category
 * @returns List of features available to this user category
 */
export function getAvailableFeatures(category: UserCategory): string[] {
  const baseFeatures = [
    'Personalized Workout Plans',
    'Progress Tracking',
    'Basic Nutrition Advice',
  ];
  
  switch (category) {
    case 'BEG':
      return baseFeatures;
    case 'INT':
      return [...baseFeatures, 'Video Instruction Library', 'Community Access'];
    case 'ADV':
      return [...baseFeatures, 'Video Instruction Library', 'Community Access', 'Advanced Analytics'];
    case 'PRO':
      return [...baseFeatures, 'Video Instruction Library', 'Community Access', 'Advanced Analytics', 'Priority Support'];
    case 'VIP':
      return [...baseFeatures, 'Video Instruction Library', 'Community Access', 'Advanced Analytics', 'Priority Support', '1-on-1 Coaching', 'Premium Content'];
    default:
      return baseFeatures;
  }
}

/**
 * Get locked features that user needs to upgrade to access
 * 
 * @param category User category
 * @returns List of features locked for this user category
 */
export function getLockedFeatures(category: UserCategory): string[] {
  const allFeatures = [
    'Personalized Workout Plans',
    'Progress Tracking',
    'Basic Nutrition Advice',
    'Video Instruction Library',
    'Community Access',
    'Advanced Analytics',
    'Priority Support',
    '1-on-1 Coaching',
    'Premium Content',
  ];
  
  const available = getAvailableFeatures(category);
  return allFeatures.filter(feature => !available.includes(feature));
}

export default {
  categorizeUser,
  generateUniqueCode,
  createUserProfile,
  getCategoryDescription,
  getAvailableFeatures,
  getLockedFeatures,
};
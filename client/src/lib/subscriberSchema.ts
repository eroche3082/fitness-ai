/**
 * Fitness AI - Subscriber Schema
 * Defines the structure of user profiles collected during onboarding
 */

export interface HealthMetrics {
  height?: number;
  weight?: number;
  age?: number;
  bmi?: number;
  bodyFat?: number;
  restingHeartRate?: number;
}

export interface Preferences {
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoals?: string[];
  preferredActivities?: string[];
  dietPreferences?: string[];
  usedDevices?: string[];
  exerciseLocation?: 'home' | 'gym' | 'outdoors' | 'varies';
  workoutTimePreference?: 'morning' | 'afternoon' | 'evening' | 'flexible';
}

export interface FitnessStats {
  activeHoursPerWeek?: number;
  averageSteps?: number;
  activeMinutesPerDay?: number;
  weeklyWorkouts?: number;
  sleepHoursPerNight?: number;
  streakDays?: number;
}

export interface SubscriberProfile {
  // Base information
  userId: number;
  name?: string;
  email?: string;
  language: string;
  
  // Preferences and settings
  preferences: Preferences;
  
  // Health data
  healthMetrics?: HealthMetrics;
  
  // Fitness statistics
  stats?: FitnessStats;
  
  // Connected services
  connectedServices?: {
    googleFit?: boolean;
    appleHealth?: boolean;
    fitbit?: boolean;
    strava?: boolean;
    garmin?: boolean;
  };
  
  // Feature flags
  features?: {
    sleepTracking: boolean;
    nutritionTracking: boolean;
    workoutReminders: boolean;
    progressPhotos: boolean;
    hydrationTracking: boolean;
  };
  
  // System data
  system: {
    onboardingCompleted: boolean;
    onboardingStep: number;
    agentType: 'fitness' | 'nutrition' | 'mental_wellness';
    createdAt: Date;
    lastUpdated: Date;
    lastActive: Date;
  };
}

// Default profile for new users
export const defaultProfile: Partial<SubscriberProfile> = {
  language: 'en',
  preferences: {},
  system: {
    onboardingCompleted: false,
    onboardingStep: 1,
    agentType: 'fitness',
    createdAt: new Date(),
    lastUpdated: new Date(),
    lastActive: new Date(),
  }
};

/**
 * Create a minimal valid subscriber profile
 * @param userId User ID
 * @returns Minimal valid subscriber profile
 */
export function createMinimalProfile(userId: number): SubscriberProfile {
  return {
    userId,
    language: 'en',
    preferences: {},
    system: {
      onboardingCompleted: false,
      onboardingStep: 1,
      agentType: 'fitness',
      createdAt: new Date(),
      lastUpdated: new Date(),
      lastActive: new Date(),
    }
  };
}

/**
 * Validate if a profile has the required fields
 * @param profile Profile to validate
 * @returns True if valid, false otherwise
 */
export function validateProfile(profile: any): boolean {
  if (!profile) return false;
  
  // Check required fields
  if (profile.userId === undefined || profile.language === undefined) {
    return false;
  }
  
  // Check system object
  if (!profile.system || 
      profile.system.onboardingCompleted === undefined || 
      profile.system.agentType === undefined) {
    return false;
  }
  
  // Check preferences object
  if (!profile.preferences) {
    return false;
  }
  
  return true;
}

export default {
  createMinimalProfile,
  validateProfile,
  defaultProfile
};
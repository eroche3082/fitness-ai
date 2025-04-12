/**
 * Fitness AI - Profile Service
 * Handles all interactions with user profiles including storage, retrieval, and updates
 */

import { SubscriberProfile, createMinimalProfile } from '@/lib/subscriberSchema';

/**
 * Fetch user profile from the server
 * @param userId User ID
 * @returns User profile or null if not found
 */
export async function fetchUserProfile(userId: number): Promise<SubscriberProfile | null> {
  try {
    const response = await fetch(`/api/users/${userId}/profile`);
    
    if (!response.ok) {
      // If 404, create a new profile
      if (response.status === 404) {
        const newProfile = createMinimalProfile(userId);
        return saveUserProfile(userId, newProfile);
      }
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }
    
    const profileData = await response.json();
    
    // Convert to SubscriberProfile format
    return adaptProfileFormat(userId, profileData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Save user profile to the server
 * @param userId User ID
 * @param profile User profile
 * @returns Updated user profile or null if failed
 */
export async function saveUserProfile(userId: number, profile: Partial<SubscriberProfile>): Promise<SubscriberProfile | null> {
  try {
    // Update last updated timestamp
    const updatedProfile = {
      ...profile,
      system: {
        ...(profile.system || {}),
        lastUpdated: new Date()
      }
    };
    
    const response = await fetch(`/api/users/${userId}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProfile)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save user profile: ${response.statusText}`);
    }
    
    const savedProfile = await response.json();
    
    // Convert to SubscriberProfile format
    return adaptProfileFormat(userId, savedProfile);
  } catch (error) {
    console.error('Error saving user profile:', error);
    return null;
  }
}

/**
 * Update specific fields in user profile
 * @param userId User ID
 * @param updates Partial updates to apply to profile
 * @returns Updated user profile or null if failed
 */
export async function updateUserProfile(userId: number, updates: Partial<SubscriberProfile>): Promise<SubscriberProfile | null> {
  try {
    // Fetch current profile first
    const currentProfile = await fetchUserProfile(userId);
    
    if (!currentProfile) {
      throw new Error('User profile not found');
    }
    
    // Merge updates with current profile
    const updatedProfile = deepMerge(currentProfile, updates);
    
    // Update last updated timestamp
    updatedProfile.system.lastUpdated = new Date();
    updatedProfile.system.lastActive = new Date();
    
    // Save the updated profile
    return saveUserProfile(userId, updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

/**
 * Reset onboarding progress
 * @param userId User ID
 * @returns Reset user profile or null if failed
 */
export async function resetOnboarding(userId: number): Promise<SubscriberProfile | null> {
  try {
    const response = await fetch(`/api/users/${userId}/profile/reset`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to reset onboarding: ${response.statusText}`);
    }
    
    const resetProfile = await response.json();
    
    // Convert to SubscriberProfile format
    return adaptProfileFormat(userId, resetProfile);
  } catch (error) {
    console.error('Error resetting onboarding:', error);
    return null;
  }
}

/**
 * Check if user has completed onboarding
 * @param userId User ID
 * @returns True if completed, false otherwise
 */
export async function hasCompletedOnboarding(userId: number): Promise<boolean> {
  try {
    const profile = await fetchUserProfile(userId);
    return profile?.system?.onboardingCompleted || false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

/**
 * Update onboarding step for a user
 * @param userId User ID
 * @param step Onboarding step number
 * @returns Updated user profile or null if failed
 */
export async function updateOnboardingStep(userId: number, step: number): Promise<SubscriberProfile | null> {
  return updateUserProfile(userId, {
    system: {
      onboardingStep: step,
      lastUpdated: new Date()
    } as any
  });
}

/**
 * Complete onboarding for a user
 * @param userId User ID
 * @returns Updated user profile or null if failed
 */
export async function completeOnboarding(userId: number): Promise<SubscriberProfile | null> {
  return updateUserProfile(userId, {
    system: {
      onboardingCompleted: true,
      lastUpdated: new Date()
    } as any
  });
}

/**
 * Helper function to adapt profile from API to SubscriberProfile format
 * @param userId User ID
 * @param apiProfile Profile from API
 * @returns Subscriber profile
 */
function adaptProfileFormat(userId: number, apiProfile: any): SubscriberProfile {
  // Handle legacy profile format
  if (apiProfile.onboardingCompleted !== undefined) {
    // This is the old format, convert to new format
    return {
      userId,
      language: apiProfile.language || 'en',
      name: apiProfile.name,
      email: apiProfile.email,
      preferences: {
        fitnessLevel: apiProfile.fitnessLevel,
        fitnessGoals: apiProfile.fitnessGoals,
        preferredActivities: apiProfile.preferredActivities,
        dietPreferences: apiProfile.dietPreferences,
        usedDevices: apiProfile.usedDevices,
        exerciseLocation: apiProfile.exerciseLocation,
        workoutTimePreference: apiProfile.workoutTimePreference
      },
      healthMetrics: apiProfile.healthMetrics,
      stats: {
        activeHoursPerWeek: apiProfile.activeHoursPerWeek
      },
      system: {
        onboardingCompleted: apiProfile.onboardingCompleted || false,
        onboardingStep: apiProfile.onboardingStep || 1,
        agentType: apiProfile.agentType || 'fitness',
        createdAt: apiProfile.createdAt ? new Date(apiProfile.createdAt) : new Date(),
        lastUpdated: apiProfile.lastUpdated ? new Date(apiProfile.lastUpdated) : new Date(),
        lastActive: apiProfile.lastActive ? new Date(apiProfile.lastActive) : new Date()
      }
    };
  }
  
  // Return new format with any missing properties
  return {
    userId,
    language: apiProfile.language || 'en',
    name: apiProfile.name,
    email: apiProfile.email,
    preferences: apiProfile.preferences || {},
    healthMetrics: apiProfile.healthMetrics,
    stats: apiProfile.stats,
    connectedServices: apiProfile.connectedServices,
    features: apiProfile.features,
    system: {
      onboardingCompleted: apiProfile.system?.onboardingCompleted || false,
      onboardingStep: apiProfile.system?.onboardingStep || 1,
      agentType: apiProfile.system?.agentType || 'fitness',
      createdAt: apiProfile.system?.createdAt ? new Date(apiProfile.system.createdAt) : new Date(),
      lastUpdated: apiProfile.system?.lastUpdated ? new Date(apiProfile.system.lastUpdated) : new Date(),
      lastActive: apiProfile.system?.lastActive ? new Date(apiProfile.system.lastActive) : new Date()
    }
  };
}

/**
 * Helper function to deep merge objects
 * @param target Target object
 * @param source Source object
 * @returns Merged object
 */
function deepMerge(target: any, source: any): any {
  const output = Object.assign({}, target);
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Helper function to check if a value is an object
 * @param item Value to check
 * @returns True if object, false otherwise
 */
function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export default {
  fetchUserProfile,
  saveUserProfile,
  updateUserProfile,
  resetOnboarding,
  hasCompletedOnboarding,
  updateOnboardingStep,
  completeOnboarding
};
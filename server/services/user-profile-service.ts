import { Router, Request, Response } from 'express';
import { storage } from '../storage';

// Define the structure of a user profile
interface UserProfile {
  name?: string;
  email?: string;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  fitnessGoals?: string[];
  preferredActivities?: string[];
  healthMetrics?: {
    height?: number;
    weight?: number;
    age?: number;
  };
  dietPreferences?: string[];
  sleepTracking?: boolean;
  activeHoursPerWeek?: number;
  usedDevices?: string[];
  language: string;
  onboardingCompleted: boolean;
  onboardingStep: number;
}

// Default profile for new users
const defaultProfile: UserProfile = {
  language: 'en',
  onboardingCompleted: false,
  onboardingStep: 0
};

/**
 * Register user profile routes
 * @param router Express router
 */
export function registerUserProfileRoutes(router: Router): void {
  /**
   * Get user profile
   * GET /api/users/:id/profile
   */
  router.get('/users/:id/profile', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If user doesn't have a profile yet, create and return a default one
      if (!user.profile) {
        // Update the user with the default profile
        const updatedUser = await storage.updateUser(userId, { profile: defaultProfile });
        if (!updatedUser) {
          return res.status(500).json({ error: 'Failed to create user profile' });
        }
        
        return res.json(defaultProfile);
      }

      return res.json(user.profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * Update user profile
   * PUT /api/users/:id/profile
   */
  router.put('/users/:id/profile', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedProfile: Partial<UserProfile> = req.body;
      
      // Validate profile data
      if (updatedProfile.fitnessLevel && 
          !['beginner', 'intermediate', 'advanced'].includes(updatedProfile.fitnessLevel)) {
        return res.status(400).json({ error: 'Invalid fitness level' });
      }

      if (updatedProfile.language && typeof updatedProfile.language !== 'string') {
        return res.status(400).json({ error: 'Invalid language' });
      }

      if (updatedProfile.onboardingStep !== undefined && 
          (typeof updatedProfile.onboardingStep !== 'number' || updatedProfile.onboardingStep < 0)) {
        return res.status(400).json({ error: 'Invalid onboarding step' });
      }

      if (updatedProfile.onboardingCompleted !== undefined && 
          typeof updatedProfile.onboardingCompleted !== 'boolean') {
        return res.status(400).json({ error: 'Invalid onboarding completed flag' });
      }

      // Merge with existing profile or create a new one
      const currentProfile = user.profile || defaultProfile;
      const mergedProfile = { ...currentProfile, ...updatedProfile };

      // Update the user with the new profile
      const updatedUser = await storage.updateUser(userId, { profile: mergedProfile });
      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to update user profile' });
      }

      return res.json(mergedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * Reset user profile and onboarding
   * POST /api/users/:id/profile/reset
   */
  router.post('/users/:id/profile/reset', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Reset only the onboarding status while keeping other profile settings
      const currentProfile = user.profile || defaultProfile;
      const resetProfile = { 
        ...currentProfile, 
        onboardingCompleted: false, 
        onboardingStep: 0 
      };

      // Update the user with the reset profile
      const updatedUser = await storage.updateUser(userId, { profile: resetProfile });
      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to reset user profile' });
      }

      return res.json(resetProfile);
    } catch (error) {
      console.error('Error resetting user profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
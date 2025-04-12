import { Request, Response, Router } from 'express';
import { storage } from '../storage';
import { validateFirebaseConfig, initializeFirebase } from './firebase-service';
import { z } from 'zod';

/**
 * UserProfile Service
 * 
 * This service handles user profiles including:
 * - Onboarding flow for new users
 * - Storing and retrieving profile data
 * - Personalizing user experience
 */

// Profile validation schema
const profileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  fitnessGoals: z.array(z.string()).optional(),
  preferredActivities: z.array(z.string()).optional(),
  healthMetrics: z.object({
    height: z.number().optional(),
    weight: z.number().optional(),
    age: z.number().optional(),
  }).optional(),
  dietPreferences: z.array(z.string()).optional(),
  sleepTracking: z.boolean().optional(),
  activeHoursPerWeek: z.number().optional(),
  usedDevices: z.array(z.string()).optional(),
  language: z.string().default('en'),
  onboardingCompleted: z.boolean().default(false),
  onboardingStep: z.number().default(0),
});

type UserProfile = z.infer<typeof profileSchema>;

// Define the onboarding questions
const onboardingQuestions = [
  {
    id: 'name',
    question: "Hi! I'm Fitness AI, your personal fitness assistant. What's your name?",
    fieldName: 'name',
    responseType: 'text',
  },
  {
    id: 'email',
    question: "Nice to meet you, {{name}}! What's your email address?",
    fieldName: 'email',
    responseType: 'email',
  },
  {
    id: 'fitnessLevel',
    question: "Thanks {{name}}! To personalize your fitness plan, could you tell me your current fitness level?",
    fieldName: 'fitnessLevel',
    responseType: 'select',
    options: ['beginner', 'intermediate', 'advanced'],
  },
  {
    id: 'fitnessGoals',
    question: "What are your main fitness goals?",
    fieldName: 'fitnessGoals',
    responseType: 'multiselect',
    options: ['weight loss', 'muscle gain', 'endurance', 'flexibility', 'general health', 'sports performance'],
  },
  {
    id: 'preferredActivities',
    question: "What types of physical activities do you enjoy?",
    fieldName: 'preferredActivities',
    responseType: 'multiselect',
    options: ['running', 'swimming', 'cycling', 'weight lifting', 'yoga', 'pilates', 'team sports', 'hiking', 'dancing'],
  },
  {
    id: 'healthMetrics.age',
    question: "What's your age?",
    fieldName: 'healthMetrics.age',
    responseType: 'number',
  },
  {
    id: 'healthMetrics.height',
    question: "What's your height in cm?",
    fieldName: 'healthMetrics.height',
    responseType: 'number',
  },
  {
    id: 'healthMetrics.weight',
    question: "What's your current weight in kg?",
    fieldName: 'healthMetrics.weight',
    responseType: 'number',
  },
  {
    id: 'dietPreferences',
    question: "Do you have any dietary preferences or restrictions?",
    fieldName: 'dietPreferences',
    responseType: 'multiselect',
    options: ['vegetarian', 'vegan', 'keto', 'paleo', 'gluten-free', 'dairy-free', 'none'],
  },
  {
    id: 'sleepTracking',
    question: "Would you like to track your sleep patterns?",
    fieldName: 'sleepTracking',
    responseType: 'boolean',
  },
  {
    id: 'activeHoursPerWeek',
    question: "How many hours per week do you currently spend exercising?",
    fieldName: 'activeHoursPerWeek',
    responseType: 'number',
  },
  {
    id: 'usedDevices',
    question: "Which fitness tracking devices or apps do you use?",
    fieldName: 'usedDevices',
    responseType: 'multiselect',
    options: ['Apple Watch', 'Fitbit', 'Garmin', 'Google Fit', 'Samsung Health', 'Strava', 'None'],
  },
  {
    id: 'language',
    question: "What's your preferred language for the app?",
    fieldName: 'language',
    responseType: 'select',
    options: ['en', 'es', 'fr', 'pt'],
    optionLabels: ['English', 'Español', 'Français', 'Português'],
  },
];

// Get the onboarding question based on step
function getOnboardingQuestion(step: number, profile: Partial<UserProfile>): { question: string; options?: string[]; optionLabels?: string[] } {
  if (step >= onboardingQuestions.length) {
    return { question: "Thank you! Your profile is complete. How can I help you today?" };
  }
  
  const questionObj = onboardingQuestions[step];
  let question = questionObj.question;
  
  // Replace placeholders with actual values
  if (profile.name && question.includes('{{name}}')) {
    question = question.replace('{{name}}', profile.name);
  }
  
  return { 
    question, 
    options: questionObj.options, 
    optionLabels: questionObj.optionLabels 
  };
}

// Update user profile with onboarding answer
function updateProfileWithAnswer(profile: Partial<UserProfile>, step: number, answer: any): Partial<UserProfile> {
  if (step >= onboardingQuestions.length) {
    return profile;
  }
  
  const questionObj = onboardingQuestions[step];
  const fieldName = questionObj.fieldName;
  
  // Handle nested fields
  if (fieldName.includes('.')) {
    const [parent, child] = fieldName.split('.');
    if (!profile[parent]) {
      profile[parent] = {};
    }
    profile[parent][child] = answer;
  } else {
    profile[fieldName] = answer;
  }
  
  // Update onboarding step
  profile.onboardingStep = step + 1;
  
  // Check if onboarding is complete
  if (step + 1 >= onboardingQuestions.length) {
    profile.onboardingCompleted = true;
  }
  
  return profile;
}

// Generate personalized welcome message
function generateWelcomeMessage(profile: Partial<UserProfile>): string {
  let message = `Welcome to Fitness AI, ${profile.name || 'fitness enthusiast'}!`;
  
  // Add personalized elements based on profile
  if (profile.fitnessLevel) {
    message += ` As a ${profile.fitnessLevel} fitness practitioner, `;
    
    if (profile.fitnessLevel === 'beginner') {
      message += `I'll help you build a solid foundation and develop good exercise habits.`;
    } else if (profile.fitnessLevel === 'intermediate') {
      message += `I'll help you optimize your workouts and reach new personal bests.`;
    } else if (profile.fitnessLevel === 'advanced') {
      message += `I'll provide advanced training strategies and performance optimization techniques.`;
    }
  }
  
  // Add goal-oriented message
  if (profile.fitnessGoals && profile.fitnessGoals.length > 0) {
    message += ` Based on your goals of ${profile.fitnessGoals.join(', ')}, I'll tailor your fitness recommendations.`;
  }
  
  // Add activity preferences
  if (profile.preferredActivities && profile.preferredActivities.length > 0) {
    message += ` I see you enjoy ${profile.preferredActivities.join(', ')}. I'll focus on these activities in your plan.`;
  }
  
  // Add device integration message
  if (profile.usedDevices && profile.usedDevices.length > 0 && !profile.usedDevices.includes('None')) {
    message += ` We'll connect with your ${profile.usedDevices.join(', ')} to track your progress.`;
  }
  
  message += ` Your personal dashboard has been created and customized to your preferences. You can ask me anything about fitness, nutrition, or wellness. I'm here to help you achieve your goals!`;
  
  return message;
}

// Register routes for user profile service
export function registerUserProfileRoutes(router: Router): void {
  // Get user profile
  router.get('/users/:userId/profile', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get or create profile from storage
      // In a real system, this would be stored in Firestore/DB
      const profile = user.profile || {};
      
      res.json(profile);
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Update user profile
  router.patch('/users/:userId/profile', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Update profile
      const currentProfile = user.profile || {};
      const updatedProfile = { ...currentProfile, ...req.body };
      
      // In a real system, we'd validate this with zod
      
      // Update user with new profile
      await storage.updateUser(userId, { profile: updatedProfile });
      
      res.json(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get current onboarding question
  router.get('/users/:userId/onboarding/question', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const profile = user.profile || {};
      const step = profile.onboardingStep || 0;
      
      // Get question for current step
      const questionData = getOnboardingQuestion(step, profile);
      
      res.json({
        step,
        ...questionData,
        totalSteps: onboardingQuestions.length,
        completed: profile.onboardingCompleted || false
      });
    } catch (error) {
      console.error('Error getting onboarding question:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Answer current onboarding question
  router.post('/users/:userId/onboarding/answer', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const { answer } = req.body;
      
      if (answer === undefined) {
        return res.status(400).json({ error: 'Answer is required' });
      }
      
      const profile = user.profile || {};
      const step = profile.onboardingStep || 0;
      
      // Update profile with answer
      const updatedProfile = updateProfileWithAnswer(profile, step, answer);
      
      // Update user with new profile
      await storage.updateUser(userId, { profile: updatedProfile });
      
      // Get next question or completion message
      const nextStep = updatedProfile.onboardingStep || 0;
      const questionData = getOnboardingQuestion(nextStep, updatedProfile);
      
      // If onboarding is complete, generate welcome message
      let welcomeMessage = null;
      if (updatedProfile.onboardingCompleted) {
        welcomeMessage = generateWelcomeMessage(updatedProfile);
      }
      
      res.json({
        step: nextStep,
        ...questionData,
        totalSteps: onboardingQuestions.length,
        completed: updatedProfile.onboardingCompleted || false,
        welcomeMessage
      });
    } catch (error) {
      console.error('Error processing onboarding answer:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Reset onboarding (for testing)
  router.post('/users/:userId/onboarding/reset', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Reset onboarding state
      const profile = user.profile || {};
      profile.onboardingStep = 0;
      profile.onboardingCompleted = false;
      
      // Update user with reset profile
      await storage.updateUser(userId, { profile });
      
      // Get first question
      const questionData = getOnboardingQuestion(0, profile);
      
      res.json({
        step: 0,
        ...questionData,
        totalSteps: onboardingQuestions.length,
        completed: false
      });
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}
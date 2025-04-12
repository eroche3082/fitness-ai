import { useState, useEffect, useCallback } from 'react';

interface OnboardingQuestion {
  step: number;
  question: string;
  options?: string[];
  optionLabels?: string[];
  totalSteps: number;
  completed: boolean;
  welcomeMessage?: string;
}

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
  language?: string;
  onboardingCompleted?: boolean;
  onboardingStep?: number;
}

// These are the onboarding questions that will be asked to the user
const onboardingQuestions: OnboardingQuestion[] = [
  {
    step: 0,
    question: "What's your name?",
    totalSteps: 8,
    completed: false
  },
  {
    step: 1,
    question: "What's your email address?",
    totalSteps: 8,
    completed: false
  },
  {
    step: 2,
    question: "What's your fitness level?",
    options: ['beginner', 'intermediate', 'advanced'],
    optionLabels: ['Beginner - New to fitness', 'Intermediate - Workout regularly', 'Advanced - Experienced athlete'],
    totalSteps: 8,
    completed: false
  },
  {
    step: 3,
    question: "What are your fitness goals?",
    options: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'overall_health', 'sports_performance'],
    optionLabels: [
      'Weight Loss', 
      'Muscle Gain', 
      'Improve Endurance', 
      'Increase Flexibility', 
      'Overall Health', 
      'Sports Performance'
    ],
    totalSteps: 8,
    completed: false
  },
  {
    step: 4,
    question: "What activities do you prefer?",
    options: ['running', 'weightlifting', 'yoga', 'swimming', 'cycling', 'hiit', 'team_sports', 'other'],
    optionLabels: [
      'Running', 
      'Weightlifting', 
      'Yoga', 
      'Swimming', 
      'Cycling', 
      'HIIT Workouts', 
      'Team Sports', 
      'Other'
    ],
    totalSteps: 8,
    completed: false
  },
  {
    step: 5,
    question: "Would you like to track your sleep patterns?",
    totalSteps: 8,
    completed: false
  },
  {
    step: 6,
    question: "How many active hours do you typically spend per week exercising?",
    totalSteps: 8,
    completed: false
  },
  {
    step: 7,
    question: "Which fitness trackers or devices do you use?",
    options: ['none', 'fitbit', 'apple_watch', 'garmin', 'google_fit', 'samsung', 'strava', 'other'],
    optionLabels: [
      'None', 
      'Fitbit', 
      'Apple Watch', 
      'Garmin', 
      'Google Fit', 
      'Samsung Health', 
      'Strava', 
      'Other'
    ],
    totalSteps: 8,
    completed: false
  }
];

// Generate a personalized welcome message based on the user's profile
const generateWelcomeMessage = (profile: UserProfile): string => {
  const name = profile.name || 'there';
  const fitnessLevel = profile.fitnessLevel || 'beginner';
  const mainGoal = profile.fitnessGoals?.[0] || 'overall_health';
  const mainActivity = profile.preferredActivities?.[0] || 'running';
  
  let goalText = '';
  switch(mainGoal) {
    case 'weight_loss':
      goalText = 'lose weight';
      break;
    case 'muscle_gain':
      goalText = 'build muscle';
      break;
    case 'endurance':
      goalText = 'increase your endurance';
      break;
    case 'flexibility':
      goalText = 'improve your flexibility';
      break;
    case 'sports_performance':
      goalText = 'enhance your sports performance';
      break;
    default:
      goalText = 'improve your overall health';
  }
  
  let activityText = '';
  switch(mainActivity) {
    case 'weightlifting':
      activityText = 'strength training';
      break;
    case 'yoga':
      activityText = 'yoga and flexibility exercises';
      break;
    case 'swimming':
      activityText = 'swimming and water workouts';
      break;
    case 'cycling':
      activityText = 'cycling workouts';
      break;
    case 'hiit':
      activityText = 'high-intensity interval training';
      break;
    case 'team_sports':
      activityText = 'team sports and group activities';
      break;
    default:
      activityText = 'running and cardio exercises';
  }
  
  let levelText = '';
  switch(fitnessLevel) {
    case 'beginner':
      levelText = 'beginner-friendly';
      break;
    case 'intermediate':
      levelText = 'intermediate-level';
      break;
    case 'advanced':
      levelText = 'advanced';
      break;
  }
  
  return `Welcome, ${name}! 👋 Based on your profile, I've personalized Fitness AI to help you ${goalText} through ${levelText} ${activityText}. I'll provide customized workout plans, nutrition advice, and progress tracking tailored to your goals and preferences. You can ask me anything about fitness, health, or wellness at any time!`;
};

export function useUserProfile(userId: number = 1) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<OnboardingQuestion | null>(null);

  // Fetch the user profile from the server
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/profile`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // If the user doesn't exist or has no profile, create one
          const createUserResponse = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: `user${userId}`,
              password: 'password123',
              name: null,
              email: null,
              language: 'en'
            })
          });
          
          if (!createUserResponse.ok) {
            throw new Error('Failed to create user');
          }
          
          // Start onboarding
          setIsOnboarding(true);
          setCurrentQuestion(onboardingQuestions[0]);
          setProfile({
            language: 'en',
            onboardingCompleted: false,
            onboardingStep: 0
          });
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } else {
        const data = await response.json();
        setProfile(data);
        
        // Check if onboarding is completed or in progress
        if (data.onboardingCompleted === false) {
          setIsOnboarding(true);
          const currentStep = data.onboardingStep || 0;
          if (currentStep < onboardingQuestions.length) {
            setCurrentQuestion({
              ...onboardingQuestions[currentStep],
              completed: false
            });
          } else {
            completeOnboarding();
          }
        } else {
          setIsOnboarding(false);
          setCurrentQuestion(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load profile data');
      
      // Create a default profile and start onboarding
      setIsOnboarding(true);
      setCurrentQuestion(onboardingQuestions[0]);
      setProfile({
        language: 'en',
        onboardingCompleted: false,
        onboardingStep: 0
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Submit an answer to the current onboarding question
  const submitAnswer = useCallback(async (answer: any) => {
    if (!currentQuestion || !profile) return;
    
    try {
      setLoading(true);
      
      // Update the profile based on the current question and answer
      const updatedProfile = { ...profile };
      
      // Process the answer based on the current step
      switch (currentQuestion.step) {
        case 0: // Name
          updatedProfile.name = answer;
          break;
        case 1: // Email
          updatedProfile.email = answer;
          break;
        case 2: // Fitness level
          updatedProfile.fitnessLevel = answer as 'beginner' | 'intermediate' | 'advanced';
          break;
        case 3: // Fitness goals
          updatedProfile.fitnessGoals = Array.isArray(answer) ? answer : [answer];
          break;
        case 4: // Preferred activities
          updatedProfile.preferredActivities = Array.isArray(answer) ? answer : [answer];
          break;
        case 5: // Sleep tracking
          updatedProfile.sleepTracking = Boolean(answer);
          break;
        case 6: // Active hours per week
          updatedProfile.activeHoursPerWeek = Number(answer);
          break;
        case 7: // Used devices
          updatedProfile.usedDevices = Array.isArray(answer) ? answer : [answer];
          break;
      }
      
      // Update the onboarding step
      const nextStep = currentQuestion.step + 1;
      updatedProfile.onboardingStep = nextStep;
      
      // Check if this was the last question
      if (nextStep >= onboardingQuestions.length) {
        updatedProfile.onboardingCompleted = true;
      }
      
      // Save the updated profile
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setProfile(updatedProfile);
      
      // Move to the next question or complete onboarding
      if (nextStep < onboardingQuestions.length) {
        setCurrentQuestion({
          ...onboardingQuestions[nextStep],
          completed: false
        });
      } else {
        // Complete onboarding
        const welcomeMessage = generateWelcomeMessage(updatedProfile);
        setCurrentQuestion({
          ...onboardingQuestions[onboardingQuestions.length - 1],
          completed: true,
          welcomeMessage
        });
        setIsOnboarding(false);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to save your answer');
    } finally {
      setLoading(false);
    }
  }, [currentQuestion, profile, userId]);

  // Complete the onboarding process
  const completeOnboarding = useCallback(async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      
      const updatedProfile = {
        ...profile,
        onboardingCompleted: true,
        onboardingStep: onboardingQuestions.length
      };
      
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }
      
      setProfile(updatedProfile);
      setIsOnboarding(false);
      setCurrentQuestion({
        ...onboardingQuestions[onboardingQuestions.length - 1],
        completed: true,
        welcomeMessage: generateWelcomeMessage(updatedProfile)
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  }, [profile, userId]);

  // Reset the onboarding process
  const resetOnboarding = useCallback(async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      
      const updatedProfile = {
        ...profile,
        onboardingCompleted: false,
        onboardingStep: 0
      };
      
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset onboarding');
      }
      
      setProfile(updatedProfile);
      setIsOnboarding(true);
      setCurrentQuestion(onboardingQuestions[0]);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      setError('Failed to reset onboarding');
    } finally {
      setLoading(false);
    }
  }, [profile, userId]);

  // Load the profile on component mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    isOnboarding,
    currentQuestion,
    submitAnswer,
    resetOnboarding,
    refreshProfile: fetchProfile
  };
}
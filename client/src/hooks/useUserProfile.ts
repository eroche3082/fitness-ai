import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';

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

export function useUserProfile(userId: number = 1) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<OnboardingQuestion | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`/api/users/${userId}/profile`, {
        method: 'GET',
      });
      setProfile(data);
      
      // Check if onboarding is complete
      if (data && (!data.onboardingCompleted || data.onboardingStep === 0)) {
        setIsOnboarding(true);
        fetchCurrentQuestion();
      } else {
        setIsOnboarding(false);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch current onboarding question
  const fetchCurrentQuestion = useCallback(async () => {
    try {
      const data = await apiRequest(`/api/users/${userId}/onboarding/question`, {
        method: 'GET',
      });
      setCurrentQuestion(data);
      
      // If onboarding is complete, update the flag
      if (data.completed) {
        setIsOnboarding(false);
      }
    } catch (err) {
      console.error('Error fetching onboarding question:', err);
      setError('Failed to load onboarding question');
    }
  }, [userId]);

  // Submit answer to current question
  const submitAnswer = useCallback(async (answer: any) => {
    try {
      const data = await apiRequest(`/api/users/${userId}/onboarding/answer`, {
        method: 'POST',
        body: JSON.stringify({ answer }),
      });
      
      setCurrentQuestion(data);
      
      // If onboarding is complete, update profile and flag
      if (data.completed) {
        fetchProfile();
      }
      
      return data;
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError('Failed to submit answer');
      throw err;
    }
  }, [userId, fetchProfile]);

  // Update profile
  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    try {
      const data = await apiRequest(`/api/users/${userId}/profile`, {
        method: 'PATCH',
        body: JSON.stringify(profileData),
      });
      
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      throw err;
    }
  }, [userId]);

  // Reset onboarding (for testing)
  const resetOnboarding = useCallback(async () => {
    try {
      const data = await apiRequest(`/api/users/${userId}/onboarding/reset`, {
        method: 'POST',
      });
      
      setCurrentQuestion(data);
      setIsOnboarding(true);
      
      return data;
    } catch (err) {
      console.error('Error resetting onboarding:', err);
      setError('Failed to reset onboarding');
      throw err;
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    isOnboarding,
    currentQuestion,
    fetchProfile,
    updateProfile,
    submitAnswer,
    resetOnboarding,
  };
}
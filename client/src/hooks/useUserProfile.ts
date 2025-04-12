import { useState, useEffect, useCallback } from 'react';
import { AgentType, getOnboardingQuestions, OnboardingQuestion as OnboardingQuestionType } from '@/lib/onboardingFlow';
import profileService from '@/services/profileService';
import promptService from '@/services/promptService';
import { SubscriberProfile } from '@/lib/subscriberSchema';

// Simplified OnboardingQuestion for backward compatibility
interface OnboardingQuestion {
  step: number;
  question: string;
  options?: string[];
  optionLabels?: string[];
  totalSteps: number;
  completed: boolean;
  welcomeMessage?: string;
}

// Convert from OnboardingQuestionType to OnboardingQuestion
function convertQuestion(q: OnboardingQuestionType, totalSteps: number): OnboardingQuestion {
  return {
    step: q.order,
    question: q.label,
    options: q.options,
    optionLabels: q.optionLabels,
    totalSteps,
    completed: false
  };
}

export function useUserProfile(userId: number = 1, agentType: AgentType = 'fitness') {
  const [profile, setProfile] = useState<SubscriberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the full set of onboarding questions based on agent type
  const fullOnboardingQuestions = getOnboardingQuestions(agentType);
  
  // Convert to simplified format for backward compatibility
  const onboardingQuestions: OnboardingQuestion[] = fullOnboardingQuestions.map(q => 
    convertQuestion(q, fullOnboardingQuestions.length)
  );

  // Get current question based on onboarding step
  const currentQuestion = profile?.system?.onboardingStep 
    ? onboardingQuestions.find(q => q.step === profile.system.onboardingStep) || onboardingQuestions[0]
    : onboardingQuestions[0];

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const userProfile = await profileService.fetchUserProfile(userId);
      setProfile(userProfile);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<SubscriberProfile>) => {
    try {
      setLoading(true);
      const updatedProfile = await profileService.updateUserProfile(userId, updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setError(null);
      }
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating user profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Reset onboarding
  const resetOnboarding = useCallback(async () => {
    try {
      setLoading(true);
      const resetProfile = await profileService.resetOnboarding(userId);
      if (resetProfile) {
        setProfile(resetProfile);
        setError(null);
      }
      return resetProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error resetting onboarding:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update onboarding step
  const updateOnboardingStep = useCallback(async (step: number) => {
    return profileService.updateOnboardingStep(userId, step);
  }, [userId]);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    try {
      const completedProfile = await profileService.completeOnboarding(userId);
      
      if (completedProfile) {
        setProfile(completedProfile);
        const welcomeMessage = promptService.generateWelcomeMessage(completedProfile);
        return welcomeMessage;
      }
      
      return "Welcome to Fitness AI! How can I help you today?";
    } catch (err) {
      console.error('Error completing onboarding:', err);
      return "Welcome to Fitness AI! How can I help you today?";
    }
  }, [userId]);

  // Helper function to generate welcome message
  const generateWelcomeMessage = useCallback(() => {
    if (!profile) return "Welcome to Fitness AI! How can I help you today?";
    return promptService.generateWelcomeMessage(profile);
  }, [profile]);

  // Helper function to generate system prompt for AI
  const generateSystemPrompt = useCallback(() => {
    if (!profile) return "You are Fitness AI, a real-time interactive health and fitness assistant.";
    return promptService.generateSystemPrompt(profile);
  }, [profile]);

  // Check if user has completed onboarding
  const hasCompletedOnboarding = useCallback(async () => {
    return profileService.hasCompletedOnboarding(userId);
  }, [userId]);

  // Initial profile fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Calculate if user is in onboarding process
  const isOnboarding = !profile?.system?.onboardingCompleted && profile?.system?.onboardingStep !== undefined;

  return {
    profile,
    loading,
    error,
    isOnboarding,
    updateProfile,
    resetOnboarding,
    updateOnboardingStep,
    completeOnboarding,
    hasCompletedOnboarding,
    onboardingQuestions,
    currentQuestion,
    generateWelcomeMessage,
    generateSystemPrompt,
    refreshProfile: fetchProfile
  };
}
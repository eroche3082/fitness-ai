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

const initialProfileState: UserProfile = {
  language: 'en',
  onboardingCompleted: false,
  onboardingStep: 1
};

// Get a personalized welcome message based on the user's profile
const generateWelcomeMessage = (profile: UserProfile): string => {
  const { name, fitnessLevel, fitnessGoals, preferredActivities, activeHoursPerWeek, language } = profile;

  // Multilingual welcome messages
  const welcomeIntros = {
    en: `Welcome${name ? ', ' + name : ''}! I'm your personal Fitness AI assistant.`,
    es: `¡Bienvenido${name ? ', ' + name : ''}! Soy tu asistente personal de Fitness AI.`,
    fr: `Bienvenue${name ? ', ' + name : ''}! Je suis votre assistant personnel Fitness AI.`,
    pt: `Bem-vindo${name ? ', ' + name : ''}! Sou seu assistente pessoal de Fitness AI.`
  };

  const fitnessLevelTexts = {
    en: {
      beginner: "I see you're just starting your fitness journey.",
      intermediate: "I see you're already experienced with fitness.",
      advanced: "I see you're at an advanced fitness level."
    },
    es: {
      beginner: "Veo que estás comenzando tu viaje de fitness.",
      intermediate: "Veo que ya tienes experiencia con el fitness.",
      advanced: "Veo que estás en un nivel avanzado de fitness."
    },
    fr: {
      beginner: "Je vois que vous commencez tout juste votre parcours de remise en forme.",
      intermediate: "Je vois que vous avez déjà de l'expérience en fitness.",
      advanced: "Je vois que vous êtes à un niveau avancé de fitness."
    },
    pt: {
      beginner: "Vejo que você está apenas começando sua jornada de fitness.",
      intermediate: "Vejo que você já tem experiência com fitness.",
      advanced: "Vejo que você está em um nível avançado de fitness."
    }
  };

  const activityHoursTexts = {
    en: `You've indicated that you can dedicate about ${activeHoursPerWeek} hours per week to exercise.`,
    es: `Has indicado que puedes dedicar aproximadamente ${activeHoursPerWeek} horas por semana al ejercicio.`,
    fr: `Vous avez indiqué que vous pouvez consacrer environ ${activeHoursPerWeek} heures par semaine à l'exercice.`,
    pt: `Você indicou que pode dedicar cerca de ${activeHoursPerWeek} horas por semana ao exercício.`
  };

  const goalTexts = {
    en: "Based on your goals",
    es: "Basado en tus objetivos",
    fr: "En fonction de vos objectifs",
    pt: "Com base em seus objetivos"
  };

  const activitiesTexts = {
    en: "and preferred activities",
    es: "y actividades preferidas",
    fr: "et activités préférées",
    pt: "e atividades preferidas"
  };

  const planTexts = {
    en: "I'll help you create personalized workout plans and track your progress effectively.",
    es: "Te ayudaré a crear planes de entrenamiento personalizados y a seguir tu progreso de manera efectiva.",
    fr: "Je vous aiderai à créer des plans d'entraînement personnalisés et à suivre vos progrès efficacement.",
    pt: "Vou ajudá-lo a criar planos de treino personalizados e acompanhar seu progresso de forma eficaz."
  };

  const askTexts = {
    en: "What would you like to do today?",
    es: "¿Qué te gustaría hacer hoy?",
    fr: "Que souhaitez-vous faire aujourd'hui?",
    pt: "O que você gostaria de fazer hoje?"
  };

  // Current language or fallback to English
  const currentLang = (language && language in welcomeIntros) ? language : 'en';

  // Build personalized welcome message
  let welcomeMessage = welcomeIntros[currentLang as keyof typeof welcomeIntros];

  // Add fitness level if available
  if (fitnessLevel && fitnessLevelTexts[currentLang as keyof typeof fitnessLevelTexts]) {
    welcomeMessage += ' ' + fitnessLevelTexts[currentLang as keyof typeof fitnessLevelTexts][fitnessLevel as keyof typeof fitnessLevelTexts['en']];
  }

  // Add activity hours if available
  if (activeHoursPerWeek && activeHoursPerWeek > 0) {
    welcomeMessage += ' ' + activityHoursTexts[currentLang as keyof typeof activityHoursTexts];
  }

  // Add goals and activities if available
  if (fitnessGoals && fitnessGoals.length > 0 && preferredActivities && preferredActivities.length > 0) {
    welcomeMessage += ' ' + goalTexts[currentLang as keyof typeof goalTexts] + ' ' + 
                      activitiesTexts[currentLang as keyof typeof activitiesTexts] + ', ';
  } else if (fitnessGoals && fitnessGoals.length > 0) {
    welcomeMessage += ' ' + goalTexts[currentLang as keyof typeof goalTexts] + ', ';
  } else if (preferredActivities && preferredActivities.length > 0) {
    welcomeMessage += ' ' + activitiesTexts[currentLang as keyof typeof activitiesTexts] + ', ';
  }

  // Add plan text
  welcomeMessage += ' ' + planTexts[currentLang as keyof typeof planTexts];

  // Add final question
  welcomeMessage += '\n\n' + askTexts[currentLang as keyof typeof askTexts];

  return welcomeMessage;
};

export function useUserProfile(userId: number = 1) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Onboarding questions sequence
  const onboardingQuestions: OnboardingQuestion[] = [
    {
      step: 1,
      question: "What's your name?",
      totalSteps: 8,
      completed: false
    },
    {
      step: 2,
      question: "What's your fitness level?",
      totalSteps: 8,
      completed: false
    },
    {
      step: 3,
      question: "What are your fitness goals?",
      options: [
        'lose_weight', 
        'build_muscle', 
        'improve_endurance', 
        'increase_flexibility', 
        'reduce_stress', 
        'better_sleep', 
        'improve_overall_health'
      ],
      optionLabels: [
        'Lose Weight', 
        'Build Muscle', 
        'Improve Endurance', 
        'Increase Flexibility', 
        'Reduce Stress',
        'Better Sleep',
        'Improve Overall Health'
      ],
      totalSteps: 8,
      completed: false
    },
    {
      step: 4,
      question: "What activities do you prefer?",
      options: [
        'running', 
        'weightlifting', 
        'cycling', 
        'swimming', 
        'yoga', 
        'hiit', 
        'pilates', 
        'team_sports', 
        'walking'
      ],
      optionLabels: [
        'Running',
        'Weightlifting',
        'Cycling',
        'Swimming',
        'Yoga',
        'HIIT',
        'Pilates',
        'Team Sports',
        'Walking'
      ],
      totalSteps: 8,
      completed: false
    },
    {
      step: 5,
      question: "How many hours per week can you dedicate to exercise?",
      totalSteps: 8,
      completed: false
    },
    {
      step: 6,
      question: "What language do you prefer?",
      totalSteps: 8,
      completed: false
    },
    {
      step: 7,
      question: "Which fitness trackers or devices do you use?",
      options: [
        'google_fit', 
        'apple_health', 
        'fitbit', 
        'strava', 
        'garmin', 
        'samsung_health', 
        'none'
      ],
      optionLabels: [
        'Google Fit',
        'Apple Health',
        'Fitbit',
        'Strava',
        'Garmin',
        'Samsung Health',
        'None'
      ],
      totalSteps: 8,
      completed: false
    },
    {
      step: 8,
      question: "Ready to start your personalized fitness journey?",
      totalSteps: 8,
      completed: false
    }
  ];

  // Get current question based on onboarding step
  const currentQuestion = profile?.onboardingStep 
    ? onboardingQuestions.find(q => q.step === profile.onboardingStep) || onboardingQuestions[0]
    : onboardingQuestions[0];

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/profile`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const data = await response.json();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setError(null);
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
      const response = await fetch(`/api/users/${userId}/profile/reset`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset onboarding');
      }
      
      const resetProfile = await response.json();
      setProfile(resetProfile);
      setError(null);
      return resetProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error resetting onboarding:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    try {
      const updatedProfile = await updateProfile({ 
        onboardingCompleted: true,
        onboardingStep: onboardingQuestions.length
      });
      
      if (updatedProfile) {
        const welcomeMessage = generateWelcomeMessage(updatedProfile);
        return welcomeMessage;
      }
      
      return "Welcome to Fitness AI! How can I help you today?";
    } catch (err) {
      console.error('Error completing onboarding:', err);
      return "Welcome to Fitness AI! How can I help you today?";
    }
  }, [updateProfile, onboardingQuestions.length]);

  // Helper function to generate welcome message
  const welcomeMessageGenerator = useCallback(() => {
    if (!profile) return "Welcome to Fitness AI! How can I help you today?";
    return generateWelcomeMessage(profile);
  }, [profile]);

  // Initial profile fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Calculate if user is in onboarding process
  const isOnboarding = !profile?.onboardingCompleted && profile?.onboardingStep !== undefined;

  return {
    profile,
    loading,
    error,
    isOnboarding,
    updateProfile,
    resetOnboarding,
    completeOnboarding,
    onboardingQuestions,
    currentQuestion,
    generateWelcomeMessage: welcomeMessageGenerator
  };
}
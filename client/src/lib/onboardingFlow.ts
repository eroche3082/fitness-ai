/**
 * Fitness AI Onboarding Flow System
 * Dynamic question flow for personalized onboarding experience
 */

export type QuestionType = 'text' | 'multipleChoice' | 'checkbox' | 'slider' | 'boolean' | 'file' | 'voice';

export interface OnboardingQuestion {
  id: string;
  label: string;
  field: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  optionLabels?: string[];
  validation?: RegExp | ((value: any) => boolean);
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
  order: number; // For sorting questions in the right order
}

// Fitness-specific onboarding questions based on MEGAPROMPT requirements
const fitnessOnboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'name',
    label: 'What\'s your name?',
    field: 'name',
    type: 'text',
    required: true,
    order: 1,
    helpText: 'We\'ll use this to personalize your fitness journey.'
  },
  {
    id: 'email',
    label: 'What\'s your email address?',
    field: 'email',
    type: 'text',
    required: true,
    order: 2,
    helpText: 'We\'ll use this to send you personalized workout plans and updates.',
    validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  {
    id: 'fitnessGoals',
    label: 'What are your main fitness goals?',
    field: 'fitnessGoals',
    type: 'checkbox',
    options: [
      'build_muscle', 
      'lose_weight', 
      'improve_endurance', 
      'increase_flexibility', 
      'general_wellness'
    ],
    optionLabels: [
      'Build muscle', 
      'Lose weight', 
      'Improve endurance', 
      'Increase flexibility', 
      'General wellness'
    ],
    required: true,
    order: 3,
    helpText: 'Select all that apply. We\'ll focus your program on these areas.'
  },
  {
    id: 'preferredWorkouts',
    label: 'Which type of workouts do you prefer?',
    field: 'preferredWorkouts',
    type: 'checkbox',
    options: [
      'strength_training', 
      'crossfit', 
      'hiit', 
      'cardio', 
      'yoga', 
      'pilates'
    ],
    optionLabels: [
      'Strength Training', 
      'CrossFit', 
      'HIIT', 
      'Cardio', 
      'Yoga', 
      'Pilates'
    ],
    required: true,
    order: 4,
    helpText: 'Select all that you enjoy. We\'ll include these in your workout plans.'
  },
  {
    id: 'usedDevices',
    label: 'Do you use any fitness trackers or wearables?',
    field: 'usedDevices',
    type: 'checkbox',
    options: [
      'apple_watch', 
      'fitbit', 
      'google_fit', 
      'whoop', 
      'none'
    ],
    optionLabels: [
      'Apple Watch', 
      'Fitbit', 
      'Google Fit', 
      'WHOOP', 
      'None'
    ],
    required: true,
    order: 5,
    helpText: 'We\'ll help you connect these devices to track your progress.'
  },
  {
    id: 'workoutDays',
    label: 'What days are best for working out?',
    field: 'workoutDays',
    type: 'checkbox',
    options: [
      'weekdays', 
      'weekends', 
      'flexible'
    ],
    optionLabels: [
      'Monday to Friday', 
      'Weekends', 
      'Flexible schedule'
    ],
    required: true,
    order: 6,
    helpText: 'We\'ll create a workout schedule based on your availability.'
  },
  {
    id: 'sessionDuration',
    label: 'What\'s your ideal session duration?',
    field: 'sessionDuration',
    type: 'multipleChoice',
    options: [
      '15_30_minutes', 
      '30_45_minutes', 
      '60_plus_minutes'
    ],
    optionLabels: [
      '15–30 minutes', 
      '30–45 minutes', 
      '60+ minutes'
    ],
    required: true,
    order: 7,
    helpText: 'We\'ll design workouts to fit your available time.'
  },
  {
    id: 'intensityLevel',
    label: 'What level of intensity do you want?',
    field: 'intensityLevel',
    type: 'multipleChoice',
    options: [
      'low', 
      'medium', 
      'high', 
      'adaptive'
    ],
    optionLabels: [
      'Low', 
      'Medium', 
      'High', 
      'Adaptive AI-based'
    ],
    required: true,
    order: 8,
    helpText: 'This helps us set the right difficulty level for your workouts.'
  },
  {
    id: 'nutritionAdvice',
    label: 'Do you want personalized nutrition advice?',
    field: 'nutritionAdvice',
    type: 'boolean',
    required: true,
    order: 9,
    helpText: 'We can provide meal plans and nutrition tips alongside your workouts.'
  },
  {
    id: 'coachingPreference',
    label: 'Would you like voice coaching or video guidance?',
    field: 'coachingPreference',
    type: 'boolean',
    required: true,
    order: 10,
    helpText: 'You can receive real-time audio coaching or follow video demonstrations.'
  }
];

// Nutrition-specific onboarding questions
const nutritionOnboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'name',
    label: 'What\'s your name?',
    field: 'name',
    type: 'text',
    required: true,
    order: 1,
    helpText: 'We\'ll use this to personalize your nutrition plans.'
  },
  {
    id: 'dietGoals',
    label: 'What are your nutrition goals?',
    field: 'dietGoals',
    type: 'checkbox',
    options: [
      'weight_loss',
      'muscle_gain',
      'maintenance',
      'energy_boost',
      'better_digestion',
      'reduced_inflammation',
      'hormonal_balance'
    ],
    optionLabels: [
      'Weight Loss',
      'Muscle Gain',
      'Weight Maintenance',
      'Energy Boost',
      'Better Digestion',
      'Reduced Inflammation',
      'Hormonal Balance'
    ],
    required: true,
    order: 2,
    helpText: 'Select all that apply. We\'ll focus your meal plans on these goals.'
  },
  // More nutrition questions...
];

// Mental wellness onboarding questions
const mentalWellnessOnboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'name',
    label: 'What\'s your name?',
    field: 'name',
    type: 'text',
    required: true,
    order: 1,
    helpText: 'We\'ll use this to personalize your mental wellness program.'
  },
  {
    id: 'stressLevel',
    label: 'How would you rate your current stress level?',
    field: 'stressLevel',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    required: true,
    order: 2,
    helpText: '1 = Very Low, 10 = Very High'
  },
  // More mental wellness questions...
];

// Define different agent types
export type AgentType = 'fitness' | 'nutrition' | 'mental_wellness';

/**
 * Get onboarding questions based on agent type
 * @param agentType The type of agent
 * @returns Array of onboarding questions
 */
export function getOnboardingQuestions(agentType: AgentType = 'fitness'): OnboardingQuestion[] {
  switch (agentType) {
    case 'fitness':
      return [...fitnessOnboardingQuestions].sort((a, b) => a.order - b.order);
    case 'nutrition':
      return [...nutritionOnboardingQuestions].sort((a, b) => a.order - b.order);
    case 'mental_wellness':
      return [...mentalWellnessOnboardingQuestions].sort((a, b) => a.order - b.order);
    default:
      return [...fitnessOnboardingQuestions].sort((a, b) => a.order - b.order);
  }
}

/**
 * Get specific onboarding question by ID and agent type
 * @param id Question ID
 * @param agentType Agent type
 * @returns Onboarding question or undefined if not found
 */
export function getQuestionById(id: string, agentType: AgentType = 'fitness'): OnboardingQuestion | undefined {
  const questions = getOnboardingQuestions(agentType);
  return questions.find(q => q.id === id);
}

/**
 * Get the next question in the onboarding flow
 * @param currentId Current question ID
 * @param agentType Agent type
 * @returns Next question or undefined if at the end
 */
export function getNextQuestion(currentId: string, agentType: AgentType = 'fitness'): OnboardingQuestion | undefined {
  const questions = getOnboardingQuestions(agentType);
  const currentIndex = questions.findIndex(q => q.id === currentId);
  
  if (currentIndex >= 0 && currentIndex < questions.length - 1) {
    return questions[currentIndex + 1];
  }
  
  return undefined;
}

/**
 * Get the previous question in the onboarding flow
 * @param currentId Current question ID
 * @param agentType Agent type
 * @returns Previous question or undefined if at the beginning
 */
export function getPreviousQuestion(currentId: string, agentType: AgentType = 'fitness'): OnboardingQuestion | undefined {
  const questions = getOnboardingQuestions(agentType);
  const currentIndex = questions.findIndex(q => q.id === currentId);
  
  if (currentIndex > 0) {
    return questions[currentIndex - 1];
  }
  
  return undefined;
}

/**
 * Check if a value passes validation for a question
 * @param question Onboarding question
 * @param value Value to validate
 * @returns True if valid, false otherwise
 */
export function validateAnswer(question: OnboardingQuestion, value: any): boolean {
  // Required field validation
  if (question.required && (value === undefined || value === null || value === '')) {
    return false;
  }
  
  // If not required and no value, it's valid
  if (!question.required && (value === undefined || value === null || value === '')) {
    return true;
  }
  
  // Type-specific validation
  switch (question.type) {
    case 'text':
      if (question.validation instanceof RegExp) {
        return question.validation.test(value);
      } else if (typeof question.validation === 'function') {
        return question.validation(value);
      }
      return true;
      
    case 'multipleChoice':
      return question.options?.includes(value) ?? false;
      
    case 'checkbox':
      if (!Array.isArray(value)) {
        return false;
      }
      return value.every(v => question.options?.includes(v) ?? false);
      
    case 'slider':
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return false;
      }
      return (question.min === undefined || numValue >= question.min) && 
             (question.max === undefined || numValue <= question.max);
      
    case 'boolean':
      return typeof value === 'boolean';
      
    default:
      return true;
  }
}

export default {
  getOnboardingQuestions,
  getQuestionById,
  getNextQuestion,
  getPreviousQuestion,
  validateAnswer
};
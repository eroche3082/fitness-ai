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

// Fitness-specific onboarding questions
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
    id: 'fitnessLevel',
    label: 'What\'s your fitness level?',
    field: 'fitnessLevel',
    type: 'multipleChoice',
    options: ['beginner', 'intermediate', 'advanced'],
    optionLabels: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
    order: 2,
    helpText: 'This helps us recommend exercises appropriate for your experience.'
  },
  {
    id: 'fitnessGoals',
    label: 'What are your fitness goals?',
    field: 'fitnessGoals',
    type: 'checkbox',
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
    required: true,
    order: 3,
    helpText: 'Select all that apply. We\'ll focus your program on these areas.'
  },
  {
    id: 'preferredActivities',
    label: 'What activities do you prefer?',
    field: 'preferredActivities',
    type: 'checkbox',
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
    required: true,
    order: 4,
    helpText: 'Select all that you enjoy. We\'ll include these in your workout plans.'
  },
  {
    id: 'activeHoursPerWeek',
    label: 'How many hours per week can you dedicate to exercise?',
    field: 'activeHoursPerWeek',
    type: 'slider',
    min: 0,
    max: 20,
    step: 1,
    required: true,
    order: 5,
    helpText: 'This helps us build a realistic schedule for you.'
  },
  {
    id: 'healthMetrics',
    label: 'Would you like to track health metrics?',
    field: 'trackHealthMetrics',
    type: 'boolean',
    required: false,
    order: 6,
    helpText: 'Includes weight, BMI, body fat percentage, etc.'
  },
  {
    id: 'dietPreferences',
    label: 'Do you have any dietary preferences?',
    field: 'dietPreferences',
    type: 'checkbox',
    options: [
      'vegetarian', 
      'vegan', 
      'keto', 
      'paleo', 
      'mediterranean', 
      'low_carb', 
      'high_protein',
      'none'
    ],
    optionLabels: [
      'Vegetarian', 
      'Vegan', 
      'Keto', 
      'Paleo', 
      'Mediterranean', 
      'Low Carb',
      'High Protein',
      'No Specific Diet'
    ],
    required: false,
    order: 7,
    helpText: 'We\'ll tailor nutrition advice to match your preferences.'
  },
  {
    id: 'language',
    label: 'What language do you prefer?',
    field: 'language',
    type: 'multipleChoice',
    options: ['en', 'es', 'fr', 'pt'],
    optionLabels: ['English', 'Spanish', 'French', 'Portuguese'],
    required: true,
    order: 8,
    helpText: 'We\'ll communicate with you in this language.'
  },
  {
    id: 'usedDevices',
    label: 'Which fitness trackers or devices do you use?',
    field: 'usedDevices',
    type: 'checkbox',
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
    required: true,
    order: 9,
    helpText: 'We\'ll help you connect these devices to track your progress.'
  },
  {
    id: 'sleepTracking',
    label: 'Would you like to monitor your sleep patterns?',
    field: 'sleepTracking',
    type: 'boolean',
    required: false,
    order: 10,
    helpText: 'Sleep quality affects fitness performance and recovery.'
  },
  {
    id: 'location',
    label: 'Where do you typically exercise? (Optional)',
    field: 'exerciseLocation',
    type: 'multipleChoice',
    options: ['home', 'gym', 'outdoors', 'varies'],
    optionLabels: ['At Home', 'At the Gym', 'Outdoors', 'It Varies'],
    required: false,
    order: 11,
    helpText: 'This helps us suggest equipment-appropriate workouts.'
  },
  {
    id: 'workoutTimePreference',
    label: 'When do you prefer to work out?',
    field: 'workoutTimePreference',
    type: 'multipleChoice',
    options: ['morning', 'afternoon', 'evening', 'flexible'],
    optionLabels: ['Morning', 'Afternoon', 'Evening', 'Flexible'],
    required: false,
    order: 12,
    helpText: 'We\'ll schedule reminders at your preferred time.'
  },
  {
    id: 'confirmation',
    label: 'Ready to start your personalized fitness journey?',
    field: 'confirmation',
    type: 'boolean',
    required: true,
    order: 13,
    helpText: 'Let\'s get started on your fitness goals!'
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
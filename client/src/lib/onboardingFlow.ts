// Define agent types
export type AgentType = 'fitness' | 'nutrition' | 'wellness' | 'general';

// Define question types
export type QuestionType = 'text' | 'email' | 'select' | 'multiselect';

// Interface for question options (for select and multiselect)
export interface QuestionOption {
  label: string;
  value: string;
}

// Interface for simplified onboarding questions
export interface OnboardingQuestion {
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  validation?: (value: any) => boolean;
  errorMessage?: string;
}

// Interface for enhanced onboarding question format (for backward compatibility)
export interface EnhancedOnboardingQuestion {
  order: number;
  label: string;
  type: QuestionType;
  key: string;
  options?: string[];
  optionLabels?: string[];
  required?: boolean;
  placeholder?: string;
}

// Function to get onboarding questions based on agent type
export const getOnboardingQuestions = (agentType: AgentType): EnhancedOnboardingQuestion[] => {
  // Convert our standard questions to the enhanced format
  const enhancedQuestions: EnhancedOnboardingQuestion[] = onboardingQuestions.map((q, index) => {
    return {
      order: index + 1,
      label: q.text,
      type: q.type,
      key: `question_${index + 1}`,
      options: q.options ? q.options.map(opt => opt.value) : undefined,
      optionLabels: q.options ? q.options.map(opt => opt.label) : undefined,
      required: !!q.validation,
      placeholder: q.placeholder
    };
  });

  // Return the questions, possibly filtered by agent type
  switch (agentType) {
    case 'nutrition':
      // Filter for nutrition-related questions
      return enhancedQuestions.filter(q => 
        q.key.includes('diet') || 
        q.key.includes('nutrition') || 
        q.key.includes('allergies') ||
        q.order <= 2 // Keep name and email
      );
    case 'wellness':
      // Filter for wellness-related questions
      return enhancedQuestions.filter(q => 
        q.key.includes('wellness') || 
        q.key.includes('health') || 
        q.key.includes('sleep') ||
        q.order <= 2 // Keep name and email
      );
    case 'fitness':
    default:
      // Return all questions for fitness or default
      return enhancedQuestions;
  }
};

// Onboarding flow questions
export const onboardingQuestions: OnboardingQuestion[] = [
  // Question 1: Name
  {
    text: "What's your name?",
    type: 'text',
    placeholder: 'Enter your name',
    validation: (value) => value.length > 0,
    errorMessage: 'Please enter your name'
  },
  
  // Question 2: Email
  {
    text: "What's your email address?",
    type: 'email',
    placeholder: 'your@email.com',
    validation: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    errorMessage: 'Please enter a valid email address'
  },
  
  // Question 3: Fitness Level
  {
    text: "What's your current fitness level?",
    type: 'select',
    options: [
      { label: 'Beginner - New to fitness', value: 'beginner' },
      { label: 'Intermediate - Regular exerciser', value: 'intermediate' },
      { label: 'Advanced - Experienced fitness enthusiast', value: 'advanced' }
    ]
  },
  
  // Question 4: Fitness Goals
  {
    text: "What are your main fitness goals? (Select all that apply)",
    type: 'multiselect',
    options: [
      { label: 'Build muscle', value: 'build_muscle' },
      { label: 'Lose weight', value: 'lose_weight' },
      { label: 'Improve cardiovascular health', value: 'improve_cardio' },
      { label: 'Increase flexibility', value: 'increase_flexibility' },
      { label: 'Improve athletic performance', value: 'improve_performance' },
      { label: 'General health and wellness', value: 'general_health' }
    ]
  },
  
  // Question 5: Limitations
  {
    text: "Do you have any physical limitations or health concerns?",
    type: 'select',
    options: [
      { label: 'None', value: 'none' },
      { label: 'Back pain or injury', value: 'back_pain' },
      { label: 'Joint issues (knees, shoulders, etc.)', value: 'joint_issues' },
      { label: 'Cardiovascular condition', value: 'cardio_condition' },
      { label: 'Limited mobility', value: 'limited_mobility' },
      { label: 'Other health concern', value: 'other' }
    ]
  },
  
  // Question 6: Workout Frequency
  {
    text: "How many days per week can you commit to working out?",
    type: 'select',
    options: [
      { label: '1-2 days per week', value: '1-2' },
      { label: '3-4 days per week', value: '3-4' },
      { label: '5-6 days per week', value: '5-6' },
      { label: 'Daily', value: 'daily' }
    ]
  },
  
  // Question 7: Workout Location
  {
    text: "Where do you primarily work out?",
    type: 'select',
    options: [
      { label: 'At a gym', value: 'gym' },
      { label: 'At home with equipment', value: 'home_equipment' },
      { label: 'At home with minimal/no equipment', value: 'home_minimal' },
      { label: 'Outdoors', value: 'outdoors' },
      { label: 'Varies/Multiple locations', value: 'varies' }
    ]
  },
  
  // Question 8: Diet Preference
  {
    text: "What is your dietary preference?",
    type: 'select',
    options: [
      { label: 'No specific diet', value: 'no_preference' },
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'Vegan', value: 'vegan' },
      { label: 'Keto/Low-carb', value: 'keto' },
      { label: 'Paleo', value: 'paleo' },
      { label: 'Mediterranean', value: 'mediterranean' },
      { label: 'Other', value: 'other' }
    ]
  },
  
  // Question 9: Preferred workout style
  {
    text: "What types of workouts do you enjoy most? (Select all that apply)",
    type: 'multiselect',
    options: [
      { label: 'Weight Training', value: 'weights' },
      { label: 'HIIT/Circuit Training', value: 'hiit' },
      { label: 'Cardio (running, cycling, etc.)', value: 'cardio' },
      { label: 'Yoga/Pilates', value: 'yoga' },
      { label: 'Calisthenics/Bodyweight', value: 'calisthenics' },
      { label: 'Sports and Outdoor Activities', value: 'sports' },
      { label: 'Group Fitness Classes', value: 'group_classes' }
    ]
  },
  
  // Question 10: Motivation
  {
    text: "What motivates you most to stay consistent with exercise?",
    type: 'select',
    options: [
      { label: 'Tracking progress and seeing results', value: 'progress' },
      { label: 'Having a structured plan to follow', value: 'structure' },
      { label: 'Social support and accountability', value: 'social' },
      { label: 'Challenging myself with new goals', value: 'challenge' },
      { label: 'Feeling better physically and mentally', value: 'wellbeing' },
      { label: 'Competing with others or myself', value: 'competition' }
    ]
  }
];

// Process answers from onboarding flow
export const processOnboardingAnswers = (answers: Record<number, any>): Record<string, any> => {
  // Map question indices to more descriptive keys
  const processedData: Record<string, any> = {
    name: answers[1],
    email: answers[2],
    fitnessLevel: answers[3],
    fitnessGoals: answers[4],
    limitations: answers[5],
    workoutFrequency: answers[6],
    workoutLocation: answers[7],
    dietPreference: answers[8],
    preferredWorkouts: answers[9],
    motivation: answers[10]
  };
  
  return processedData;
};
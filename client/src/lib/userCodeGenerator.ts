// Define user categories
export type UserCategory = 'BEG' | 'INT' | 'ADV' | 'PRO' | 'VIP';

export interface UserProfile {
  name: string;
  email: string;
  uniqueCode?: string;
  category?: UserCategory;
  preferences?: Record<string, any>;
}

// Generate a unique user code based on category
export const generateUserCode = (category: UserCategory): string => {
  // Format: FIT-[CATEGORY]-[4-DIGIT NUMBER]
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `FIT-${category}-${randomNum}`;
};

// Determine user category based on questionnaire answers
export const determineUserCategory = (answers: Record<string, any>): UserCategory => {
  // Extract fitness level from answers
  const fitnessLevel = answers.fitnessLevel || 'beginner';
  
  // Determine category based on fitness level
  let category: UserCategory = 'BEG';
  
  if (fitnessLevel === 'advanced') {
    category = 'ADV';
  } else if (fitnessLevel === 'intermediate') {
    category = 'INT';
  }
  
  // Other factors that could influence category
  const workoutFrequency = answers.workoutFrequency || '';
  const isFrequentTrainer = workoutFrequency === '5-6' || workoutFrequency === 'daily';
  
  // Adjust category for frequent trainers
  if (category === 'INT' && isFrequentTrainer) {
    category = 'ADV';
  } else if (category === 'BEG' && isFrequentTrainer) {
    category = 'INT';
  }
  
  return category;
};

// Get descriptive text for a user category
export const getCategoryDescription = (category: UserCategory): string => {
  switch(category) {
    case 'BEG':
      return 'Beginner: Focus on building consistency, learning proper form, and establishing fitness habits.';
    case 'INT':
      return 'Intermediate: Ready for more challenging workouts, increased intensity, and specialized training.';
    case 'ADV':
      return 'Advanced: Experienced fitness enthusiast ready for complex training protocols and higher intensity.';
    case 'PRO':
      return 'Professional: Elite-level training with advanced periodization and competition-specific programming.';
    case 'VIP':
      return 'VIP Member: Complete access to personalized coaching, premium features, and exclusive content.';
    default:
      return 'Beginner: Focus on building consistency, learning proper form, and establishing fitness habits.';
  }
};

// Get available features for a user category
export const getAvailableFeatures = (category: UserCategory): string[] => {
  const baseFeatures = [
    'Personalized workout plans',
    'Exercise library',
    'Progress tracking',
    'Basic nutrition guidance'
  ];
  
  switch(category) {
    case 'BEG':
      return baseFeatures;
    case 'INT':
      return [
        ...baseFeatures,
        'Customized nutrition plans',
        'Advanced workout variations',
        'Recovery recommendations'
      ];
    case 'ADV':
      return [
        ...baseFeatures,
        'Customized nutrition plans',
        'Advanced workout variations',
        'Recovery recommendations',
        'Training periodization',
        'Performance analytics'
      ];
    case 'PRO':
      return [
        ...baseFeatures,
        'Customized nutrition plans',
        'Advanced workout variations',
        'Recovery recommendations',
        'Training periodization',
        'Performance analytics',
        'One-on-one coaching',
        'Competition preparation'
      ];
    case 'VIP':
      return [
        ...baseFeatures,
        'Customized nutrition plans',
        'Advanced workout variations',
        'Recovery recommendations',
        'Training periodization',
        'Performance analytics',
        'One-on-one coaching',
        'Competition preparation',
        'Priority support',
        'Premium content access',
        'Exclusive community access'
      ];
    default:
      return baseFeatures;
  }
};

// Get locked features for a user category
export const getLockedFeatures = (category: UserCategory): string[] => {
  const allFeatures = [
    'Personalized workout plans',
    'Exercise library',
    'Progress tracking',
    'Basic nutrition guidance',
    'Customized nutrition plans',
    'Advanced workout variations',
    'Recovery recommendations',
    'Training periodization',
    'Performance analytics',
    'One-on-one coaching',
    'Competition preparation',
    'Priority support',
    'Premium content access',
    'Exclusive community access'
  ];
  
  const available = getAvailableFeatures(category);
  return allFeatures.filter(feature => !available.includes(feature));
};

// Generate comprehensive analysis for a user
export const analyzeUserData = (userProfile: UserProfile): { 
  code: string;
  category: UserCategory;
  analysisResults: string;
} => {
  // Determine category if not already set
  const category = userProfile.category || determineUserCategory(userProfile.preferences || {});
  
  // Generate unique code
  const code = userProfile.uniqueCode || generateUserCode(category);
  
  // Generate analysis text
  const categoryDesc = getCategoryDescription(category);
  const availableFeatures = getAvailableFeatures(category).join(', ');
  
  const analysisResults = `
User Analysis:
Name: ${userProfile.name}
Email: ${userProfile.email}
Fitness Category: ${category}
${categoryDesc}

Available Features:
${getAvailableFeatures(category).map(feature => `- ${feature}`).join('\n')}

Upgrade to unlock:
${getLockedFeatures(category).map(feature => `- ${feature}`).join('\n')}
  `.trim();
  
  return {
    code,
    category,
    analysisResults
  };
};
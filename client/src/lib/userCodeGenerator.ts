// userCodeGenerator.ts
// Provides functions to generate unique user access codes based on fitness assessment

// Define possible user categories
export enum UserCategory {
  Beginner = 'BEG',
  Intermediate = 'INT',
  Advanced = 'ADV',
  Professional = 'PRO',
  VIP = 'VIP'
}

// Define user profile interface
export interface UserProfile {
  name: string;
  email: string;
  uniqueCode: string;
  category: UserCategory;
  onboardingCompleted: boolean;
  fitnessGoals: string[];
  preferredActivities: string[];
}

// Generate a random 4-digit number
const generateRandomDigits = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Generate a unique user code
export const generateUserCode = (
  category: UserCategory,
  existingCodes: string[] = []
): string => {
  // Create the base code with format: FIT-[CATEGORY]-XXXX
  let code: string;
  let attempts = 0;
  const maxAttempts = 10;
  
  do {
    const randomDigits = generateRandomDigits();
    code = `FIT-${category}-${randomDigits}`;
    attempts++;
    
    // Avoid infinite loops by limiting attempts
    if (attempts >= maxAttempts) {
      // Add timestamp to ensure uniqueness in worst case
      const timestamp = Date.now().toString().slice(-4);
      code = `FIT-${category}-${timestamp}`;
      break;
    }
  } while (existingCodes.includes(code));
  
  return code;
};

// Determine user category based on assessment results
export const determineUserCategory = (
  assessmentScore: number,
  experienceYears: number,
  trainingFrequency: number
): UserCategory => {
  // Simple scoring system - in a real app would be more sophisticated
  const totalScore = assessmentScore + (experienceYears * 5) + (trainingFrequency * 3);
  
  if (totalScore >= 80) {
    return UserCategory.Professional;
  } else if (totalScore >= 60) {
    return UserCategory.Advanced;
  } else if (totalScore >= 40) {
    return UserCategory.Intermediate;
  } else {
    return UserCategory.Beginner;
  }
};

// Create a new user profile
export const createUserProfile = (
  name: string,
  email: string,
  category: UserCategory,
  fitnessGoals: string[],
  preferredActivities: string[],
  existingCodes: string[] = []
): UserProfile => {
  const uniqueCode = generateUserCode(category, existingCodes);
  
  return {
    name,
    email,
    uniqueCode,
    category,
    onboardingCompleted: true,
    fitnessGoals,
    preferredActivities
  };
};

export default {
  generateUserCode,
  determineUserCategory,
  createUserProfile
};
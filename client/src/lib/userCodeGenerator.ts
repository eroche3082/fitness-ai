import { UserCategory } from '../shared/types';

/**
 * Generates a unique code for a user based on their fitness category
 * Format: FIT-[CATEGORY]-[4-DIGIT NUMBER]
 * Examples: FIT-BEG-1234, FIT-INT-5678, FIT-ADV-9012
 */
export function generateUniqueCode(category: UserCategory): string {
  // Create prefix based on category
  let prefix = '';
  
  switch (category) {
    case 'beginner':
      prefix = 'BEG';
      break;
    case 'intermediate':
      prefix = 'INT';
      break;
    case 'advanced':
      prefix = 'ADV';
      break;
    case 'professional':
      prefix = 'PRO';
      break;
    default:
      // Default to VIP for special categories
      prefix = 'VIP';
  }
  
  // Generate random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  // Combine to create unique code
  return `FIT-${prefix}-${randomNum}`;
}

/**
 * Extracts the category from a code
 * @param code Format: FIT-[CATEGORY]-[4-DIGIT NUMBER]
 * @returns UserCategory or null if invalid
 */
export function getCategoryFromCode(code: string): UserCategory | null {
  if (!code || typeof code !== 'string') {
    return null;
  }

  const parts = code.split('-');
  if (parts.length !== 3 || parts[0] !== 'FIT') {
    return null;
  }

  const categoryCode = parts[1];
  
  // Map category code to UserCategory
  switch (categoryCode) {
    case 'BEG':
      return 'beginner';
    case 'INT':
      return 'intermediate';
    case 'ADV':
      return 'advanced';
    case 'PRO':
      return 'professional';
    default:
      return null;
  }
}

/**
 * Validates if a code is in the correct format
 * @param code Format: FIT-[CATEGORY]-[4-DIGIT NUMBER]
 * @returns boolean
 */
export function isValidCode(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }
  
  // Check format
  const regex = /^FIT-(BEG|INT|ADV|PRO|VIP)-\d{4}$/;
  return regex.test(code);
}

export default {
  generateUniqueCode,
  getCategoryFromCode,
  isValidCode
};
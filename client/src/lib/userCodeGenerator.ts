import { UserCategory } from '../shared/types';

/**
 * Generates a unique code for a user based on their fitness category
 * Format: FIT-[CATEGORY]-[4-DIGIT NUMBER]
 * Examples: FIT-BEG-1234, FIT-INT-5678, FIT-ADV-9012
 */
export function generateUniqueCode(category: UserCategory): string {
  // Create prefix based on category - already using correct prefix codes 
  // as our UserCategory type is now already defined as BEG, INT, etc.
  const prefix = category;
  
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

  const categoryCode = parts[1] as UserCategory;
  
  // Validate that the category code is a valid UserCategory
  if (['BEG', 'INT', 'ADV', 'PRO', 'VIP'].includes(categoryCode)) {
    return categoryCode;
  }
  
  return null;
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
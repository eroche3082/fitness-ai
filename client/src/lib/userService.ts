// userService.ts
// This service handles user profiles, leads, and code validation

import { UserProfile, generateUserCode, UserCategory } from './userCodeGenerator';

// Define LeadInfo interface
export interface LeadInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  uniqueCode: string;
  category: string;
  date: string;
  source: string;
}

// Simple in-memory storage for demo purposes
let storedLeads: LeadInfo[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '555-123-4567',
    uniqueCode: 'FIT-BEG-1234',
    category: 'BEG',
    date: '2025-04-10T14:30:00.000Z',
    source: 'Website'
  },
  {
    id: '2',
    name: 'Sarah Jones',
    email: 'sarah@example.com',
    uniqueCode: 'FIT-ADV-5678',
    category: 'ADV',
    date: '2025-04-11T09:15:00.000Z',
    source: 'Mobile App'
  },
  {
    id: '3',
    name: 'Alex Wong',
    email: 'alex@example.com',
    phone: '555-987-6543',
    uniqueCode: 'FIT-INT-9012',
    category: 'INT',
    date: '2025-04-12T16:45:00.000Z',
    source: 'Partner Referral'
  }
];

// Store the current user profile
let currentUserProfile: UserProfile | null = null;

const userService = {
  // Lead Management
  saveLead: (leadInfo: LeadInfo): void => {
    // Check if lead already exists by email
    const existingLeadIndex = storedLeads.findIndex(lead => lead.email === leadInfo.email);
    
    if (existingLeadIndex >= 0) {
      // Update existing lead
      storedLeads[existingLeadIndex] = {
        ...storedLeads[existingLeadIndex],
        ...leadInfo,
        date: new Date().toISOString() // Update timestamp
      };
    } else {
      // Create new lead
      storedLeads.push({
        ...leadInfo,
        id: String(storedLeads.length + 1),
        date: new Date().toISOString()
      });
    }
  },
  
  getLeads: (): LeadInfo[] => {
    return [...storedLeads]; // Return a copy to avoid direct mutations
  },
  
  // User Profile Management
  saveUserProfile: (profile: UserProfile): void => {
    // In a real app, this would save to a database and might link to a user account
    currentUserProfile = { ...profile };
    
    // Also create a lead record for this user
    const leadInfo: LeadInfo = {
      id: String(storedLeads.length + 1),
      name: profile.name,
      email: profile.email,
      uniqueCode: profile.uniqueCode,
      category: profile.category,
      date: new Date().toISOString(),
      source: 'Assessment'
    };
    
    userService.saveLead(leadInfo);
  },
  
  getUserProfile: (): UserProfile | null => {
    // In a real app, this would fetch from a database or API
    return currentUserProfile ? { ...currentUserProfile } : null;
  },
  
  clearUserProfile: (): void => {
    currentUserProfile = null;
  },
  
  // Access Code Validation
  validateCode: async (code: string): Promise<{ valid: boolean; userProfile?: UserProfile }> => {
    // In a real app, this would validate against a database
    // For demo purposes, check against stored leads
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const matchingLead = storedLeads.find(lead => lead.uniqueCode === code);
    
    if (matchingLead) {
      // Create a user profile from the lead
      const userProfile: UserProfile = {
        name: matchingLead.name,
        email: matchingLead.email,
        uniqueCode: matchingLead.uniqueCode,
        category: matchingLead.category as UserCategory,
        onboardingCompleted: true,
        fitnessGoals: ['Strength', 'Endurance'],
        preferredActivities: ['Running', 'Weight Training']
      };
      
      // Store the current user
      currentUserProfile = userProfile;
      
      return {
        valid: true,
        userProfile
      };
    }
    
    return {
      valid: false
    };
  },
  
  // Update user profile
  updateUserProfile: (updates: Partial<UserProfile>): UserProfile | null => {
    if (!currentUserProfile) {
      return null;
    }
    
    currentUserProfile = {
      ...currentUserProfile,
      ...updates
    };
    
    return { ...currentUserProfile };
  }
};

export default userService;
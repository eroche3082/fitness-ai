// User profile and lead management service
import { UserCategory, UserProfile, LeadInfo } from '../shared/types';
import { generateUniqueCode } from './userCodeGenerator';

// Storage keys for localStorage
const STORAGE_KEYS = {
  LEADS: 'fitness_ai_leads',
  USER_PROFILE: 'fitness_ai_user_profile',
};

// In-memory user service with localStorage persistence
const userService = {
  // Create a new lead object
  createLead: (userInfo: {
    name: string;
    email: string;
    category: UserCategory;
    uniqueCode: string;
    phone?: string;
    source?: string;
  }): LeadInfo => {
    // Generate a unique ID
    const id = Math.random().toString(36).substring(2, 11);
    
    // Create lead object
    const lead: LeadInfo = {
      id,
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      uniqueCode: userInfo.uniqueCode,
      category: userInfo.category,
      date: new Date().toISOString(),
      source: userInfo.source || 'Chatbot',
    };
    
    return lead;
  },
  
  // Save a new lead to the system
  saveLead: (leadInfo: LeadInfo): void => {
    // Get existing leads
    const existingLeads = userService.getLeads();
    
    // Add new lead
    existingLeads.push(leadInfo);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(existingLeads));
  },
  
  // Get all leads
  getLeads: (): LeadInfo[] => {
    // Get from localStorage or return empty array
    const leadsJson = localStorage.getItem(STORAGE_KEYS.LEADS);
    return leadsJson ? JSON.parse(leadsJson) : [];
  },
  
  // Save user profile
  saveUserProfile: (profile: UserProfile): void => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },
  
  // Get user profile
  getUserProfile: (): UserProfile | null => {
    const profileJson = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profileJson ? JSON.parse(profileJson) : null;
  },
  
  // Clear user profile (logout)
  clearUserProfile: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  },
  
  // Validate an access code
  validateCode: async (code: string): Promise<{ 
    valid: boolean, 
    userProfile?: UserProfile 
  }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get all leads
    const allLeads = userService.getLeads();
    
    // Find lead with matching code
    const matchingLead = allLeads.find(lead => 
      lead.uniqueCode.toLowerCase() === code.toLowerCase()
    );
    
    if (!matchingLead) {
      // If using mock data and no leads exist yet, accept any FIT- code that matches pattern
      if (allLeads.length === 0 && code.match(/^FIT-[A-Z]{3}-\d{4}$/)) {
        // Create a mock lead for demo purposes
        const parts = code.split('-');
        const category = parts[1];
        
        const mockProfile: UserProfile = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          uniqueCode: code.toUpperCase(),
          category: category as UserCategory,
          onboardingCompleted: true,
          fitnessGoals: ['Lose weight', 'Build strength'],
          preferredActivities: ['Running', 'Weight training'],
          dateCreated: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        
        // Save the profile
        userService.saveUserProfile(mockProfile);
        
        // Create a corresponding lead
        const mockLead: LeadInfo = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          uniqueCode: code.toUpperCase(),
          category,
          date: new Date().toISOString(),
          source: 'Demo',
        };
        
        userService.saveLead(mockLead);
        
        return { valid: true, userProfile: mockProfile };
      }
      
      return { valid: false };
    }
    
    // Create or update user profile from lead info
    const userProfile: UserProfile = {
      id: matchingLead.id,
      name: matchingLead.name,
      email: matchingLead.email,
      phone: matchingLead.phone,
      uniqueCode: matchingLead.uniqueCode,
      category: matchingLead.category as UserCategory,
      onboardingCompleted: true,
      fitnessGoals: [],
      preferredActivities: [],
      dateCreated: matchingLead.date,
      lastLogin: new Date().toISOString(),
    };
    
    // Save the profile
    userService.saveUserProfile(userProfile);
    
    return { valid: true, userProfile };
  },
  
  // Update user profile with partial data
  updateUserProfile: (updates: Partial<UserProfile>): UserProfile | null => {
    const currentProfile = userService.getUserProfile();
    
    if (!currentProfile) {
      return null;
    }
    
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      lastLogin: new Date().toISOString(),
    };
    
    userService.saveUserProfile(updatedProfile);
    
    return updatedProfile;
  },
  
  // Generate a new unique code for a user
  generateAccessCode: (category: UserCategory): string => {
    return generateUniqueCode(category);
  },
};

// Initialize with sample data for demo purposes
const initializeSampleData = () => {
  // Only initialize if no data exists
  if (userService.getLeads().length === 0) {
    const sampleLeads: LeadInfo[] = [
      {
        id: '1',
        name: 'Carlos Rodriguez',
        email: 'carlos@example.com',
        phone: '+34 612 345 678',
        uniqueCode: 'FIT-INT-1234',
        category: 'INT',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        source: 'Website',
      },
      {
        id: '2',
        name: 'Maria Garcia',
        email: 'maria@example.com',
        uniqueCode: 'FIT-BEG-5678',
        category: 'BEG',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        source: 'Mobile App',
      },
      {
        id: '3',
        name: 'Ana Martinez',
        email: 'ana@example.com',
        phone: '+34 632 456 789',
        uniqueCode: 'FIT-ADV-9012',
        category: 'ADV',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        source: 'Referral',
      },
      {
        id: '4',
        name: 'Javier Lopez',
        email: 'javier@example.com',
        uniqueCode: 'FIT-PRO-3456',
        category: 'PRO',
        date: new Date().toISOString(), // Today
        source: 'Social Media',
      },
      {
        id: '5',
        name: 'Laura Fernandez',
        email: 'laura@example.com',
        phone: '+34 654 321 987',
        uniqueCode: 'FIT-VIP-7890',
        category: 'VIP',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        source: 'Partner Gym',
      },
    ];
    
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(sampleLeads));
  }
};

// Initialize sample data
initializeSampleData();

export default userService;
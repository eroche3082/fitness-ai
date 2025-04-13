import { UserProfile, UserCategory, generateUserCode } from './userCodeGenerator';

// Interface for lead information
export interface LeadInfo {
  name: string;
  email: string;
  uniqueCode: string;
  category: UserCategory;
  date: string;
  source: string;
  preferences: Record<string, any>;
}

// Keys for localStorage
const USER_PROFILE_KEY = 'fitness_ai_user_profile';
const LEADS_KEY = 'fitness_ai_leads';

// UserService for managing user data and leads
const userService = {
  // Store a new lead
  saveLead: (leadInfo: LeadInfo): void => {
    // Get existing leads or initialize empty array
    const existingLeads = userService.getLeads();
    
    // Add new lead to array
    existingLeads.push(leadInfo);
    
    // Save to localStorage
    localStorage.setItem(LEADS_KEY, JSON.stringify(existingLeads));
    
    console.log('Lead saved:', leadInfo);
  },
  
  // Get all leads
  getLeads: (): LeadInfo[] => {
    const leadsJson = localStorage.getItem(LEADS_KEY);
    return leadsJson ? JSON.parse(leadsJson) : [];
  },
  
  // Save user profile
  saveUserProfile: (profile: UserProfile): void => {
    // Ensure code is generated if not present
    if (!profile.uniqueCode && profile.category) {
      profile.uniqueCode = generateUserCode(profile.category);
    }
    
    // Save to localStorage
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    
    console.log('User profile saved:', profile);
  },
  
  // Get user profile
  getUserProfile: (): UserProfile | null => {
    const profileJson = localStorage.getItem(USER_PROFILE_KEY);
    return profileJson ? JSON.parse(profileJson) : null;
  },
  
  // Clear user profile
  clearUserProfile: (): void => {
    localStorage.removeItem(USER_PROFILE_KEY);
    console.log('User profile cleared');
  },
  
  // Validate access code
  validateCode: async (code: string): Promise<{ valid: boolean; profile?: UserProfile }> => {
    // In a real app, this would be an API call to validate on server
    // For now, we simulate with localStorage
    
    // Check if the code exists in any lead
    const leads = userService.getLeads();
    const matchedLead = leads.find(lead => lead.uniqueCode === code);
    
    if (matchedLead) {
      // If code matches, create a user profile from the lead
      const profile: UserProfile = {
        name: matchedLead.name,
        email: matchedLead.email,
        uniqueCode: matchedLead.uniqueCode,
        category: matchedLead.category,
        preferences: matchedLead.preferences
      };
      
      // Store the profile
      userService.saveUserProfile(profile);
      
      return { valid: true, profile };
    }
    
    // Simulate server delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Code not found
    return { valid: false };
  },
  
  // Update user profile with partial data
  updateUserProfile: (updates: Partial<UserProfile>): UserProfile | null => {
    const currentProfile = userService.getUserProfile();
    
    if (!currentProfile) {
      console.error('Cannot update: No user profile found');
      return null;
    }
    
    // Merge updates with current profile
    const updatedProfile = {
      ...currentProfile,
      ...updates
    };
    
    // Save updated profile
    userService.saveUserProfile(updatedProfile);
    
    return updatedProfile;
  }
};

export default userService;
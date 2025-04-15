import { 
  type User, 
  type InsertUser, 
  type Conversation, 
  type InsertConversation, 
  type Message, 
  type InsertMessage,
  type Workout,
  type InsertWorkout,
  type Progress,
  type InsertProgress,
  type Avatar,
  type InsertAvatar,
  type UserProfile,
  type InsertUserProfile
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User & { profile?: UserProfile } | undefined>;
  getUserByUsername(username: string): Promise<User & { profile?: UserProfile } | undefined>;
  getUserByAccessCode(accessCode: string): Promise<User & { profile?: UserProfile } | undefined>;
  getUserById(id: string): Promise<User & { profile?: UserProfile } | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User profile operations
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(userProfile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: number, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  // Smart Patch System operations
  getHealthMetrics(userId: number, type: string, days?: number): Promise<any[]>;
  getUserPatchHistory(userId: number): Promise<any[]>;
  updateUser(id: number | string, data: Partial<InsertUser> & { 
    profile?: any, 
    unlockedLevels?: string[], 
    premiumFeatures?: string[],
    paymentStatus?: string,
    stripePaymentId?: string,
    referredBy?: string,
    referralCount?: number
  }): Promise<User & { profile?: UserProfile } | undefined>;
  
  // Conversation operations
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationsByUserId(userId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  
  // Message operations
  getMessagesByConversationId(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Workout operations
  getWorkout(id: number): Promise<Workout | undefined>;
  getWorkoutsByUserId(userId: number): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: number, data: Partial<InsertWorkout>): Promise<Workout | undefined>;
  
  // Progress operations
  getProgressByUserId(userId: number): Promise<Progress[]>;
  getProgressByUserIdAndType(userId: number, type: string): Promise<Progress[]>;
  createProgress(progress: InsertProgress): Promise<Progress>;
  
  // Access code operations
  getAccessCodeActivity(accessCode: string): Promise<any>;
  recordAccessCodeActivity(accessCode: string, activity: {
    type: string,
    level?: string,
    payment?: string,
    referredBy?: string
  }): Promise<any>;
  
  // Avatar operations
  getAvatarsByUserId(userId: number): Promise<Avatar[]>;
  getAvatarById(avatarId: string): Promise<Avatar | undefined>;
  createAvatar(avatar: InsertAvatar): Promise<Avatar>;
  deleteAvatar(avatarId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private workouts: Map<number, Workout>;
  private progresses: Map<number, Progress>;
  private accessCodeActivities: Map<string, any[]>;
  private healthMetrics: Map<number, any[]>;
  private patchHistory: Map<number, any[]>;
  private userProfiles: Map<number, UserProfile>;
  private avatars: Map<string, Avatar>;
  
  private userId: number = 1;
  private conversationId: number = 1;
  private messageId: number = 1;
  private workoutId: number = 1;
  private progressId: number = 1;
  
  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.workouts = new Map();
    this.progresses = new Map();
    this.accessCodeActivities = new Map();
    this.healthMetrics = new Map();
    this.patchHistory = new Map();
    this.userProfiles = new Map();
    this.avatars = new Map();
    
    // Create a default user for testing
    const defaultUser: User = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      username: 'testuser',
      language: 'en',
      workoutPreference: null,
      fitnessGoal: null,
      lastActive: new Date(),
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      subscriptionStatus: null,
      subscriptionPlan: 'free'
    };
    
    // Create a default profile for the user
    const defaultProfile: UserProfile = {
      id: 1,
      userId: 1,
      activeAvatarId: null,
      avatarUrl: null,
      preferredTheme: 'dark',
      preferredLanguage: 'es',
      settings: {},
      preferences: {},
      lastUpdated: new Date()
    };
    
    this.users.set(1, defaultUser);
    this.userProfiles.set(1, defaultProfile);
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, lastActive: now };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, data: Partial<InsertUser> & { profile?: any }): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    // Handle profile separately to avoid TypeScript errors
    const { profile, ...restData } = data;
    
    // Create a copy of the user to update
    const updatedUser: any = { ...user, ...restData };
    
    // Merge profile if it exists
    if (profile) {
      updatedUser.profile = {
        ...(updatedUser.profile || {}),
        ...profile
      };
    }
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Conversation operations
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
  
  async getConversationsByUserId(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conversation) => conversation.userId === userId
    );
  }
  
  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationId++;
    const now = new Date();
    const conversation: Conversation = { ...insertConversation, id, createdAt: now };
    this.conversations.set(id, conversation);
    return conversation;
  }
  
  // Message operations
  async getMessagesByConversationId(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.conversationId === conversationId
    ).sort((a, b) => {
      return (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0);
    });
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const now = new Date();
    const message: Message = { ...insertMessage, id, timestamp: now };
    this.messages.set(id, message);
    return message;
  }
  
  // Workout operations
  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }
  
  async getWorkoutsByUserId(userId: number): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(
      (workout) => workout.userId === userId
    );
  }
  
  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const id = this.workoutId++;
    const now = new Date();
    const workout: Workout = { ...insertWorkout, id, createdAt: now };
    this.workouts.set(id, workout);
    return workout;
  }
  
  async updateWorkout(id: number, data: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const workout = await this.getWorkout(id);
    if (!workout) return undefined;
    
    const updatedWorkout: Workout = { ...workout, ...data };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }
  
  // Progress operations
  async getProgressByUserId(userId: number): Promise<Progress[]> {
    return Array.from(this.progresses.values()).filter(
      (progress) => progress.userId === userId
    );
  }
  
  async getProgressByUserIdAndType(userId: number, type: string): Promise<Progress[]> {
    return Array.from(this.progresses.values()).filter(
      (progress) => progress.userId === userId && progress.type === type
    );
  }
  
  async createProgress(insertProgress: InsertProgress): Promise<Progress> {
    const id = this.progressId++;
    const progress: Progress = { ...insertProgress, id };
    this.progresses.set(id, progress);
    return progress;
  }
  
  // Access code operations
  async getUserByAccessCode(accessCode: string): Promise<User & { profile?: any } | undefined> {
    // Find the user with the matching access code
    return Array.from(this.users.values()).find(
      (user: any) => user.profile?.uniqueCode === accessCode
    );
  }
  
  async getUserById(id: string): Promise<User & { profile?: any } | undefined> {
    // Convert string id to number
    const numId = parseInt(id, 10);
    return this.users.get(numId);
  }
  
  async getAccessCodeActivity(accessCode: string): Promise<any> {
    // Return access code activities or create a new array
    return this.accessCodeActivities.get(accessCode) || [];
  }
  
  async recordAccessCodeActivity(accessCode: string, activity: {
    type: string,
    level?: string,
    payment?: string,
    referredBy?: string
  }): Promise<any> {
    // Get existing activities or create a new array
    const activities = await this.getAccessCodeActivity(accessCode);
    
    // Add the new activity with timestamp
    const newActivity = {
      ...activity,
      timestamp: new Date(),
    };
    
    activities.push(newActivity);
    this.accessCodeActivities.set(accessCode, activities);
    
    return newActivity;
  }
  
  // Smart Patch System operations
  
  async getHealthMetrics(userId: number, type: string, days: number = 30): Promise<any[]> {
    // Get metrics for a specific user and type, created within the specified days
    const userMetrics = this.healthMetrics.get(userId) || [];
    
    // Filter by type and time range
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);
    
    return userMetrics.filter(metric => {
      return metric.type === type && 
             new Date(metric.timestamp) >= startDate;
    });
  }
  
  async getUserPatchHistory(userId: number): Promise<any[]> {
    // Return patch history for a user
    return this.patchHistory.get(userId) || [];
  }
  
  // User Profile methods
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return this.userProfiles.get(userId);
  }

  async createUserProfile(userProfile: InsertUserProfile): Promise<UserProfile> {
    const id = userProfile.userId; // Use the userId as the profile id for simplicity
    const profile: UserProfile = { ...userProfile, id, lastUpdated: new Date() };
    this.userProfiles.set(id, profile);
    return profile;
  }

  async updateUserProfile(userId: number, data: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const profile = await this.getUserProfile(userId);
    if (!profile) {
      // If profile doesn't exist, create a new one
      return this.createUserProfile({
        userId,
        activeAvatarId: data.activeAvatarId || null,
        avatarUrl: data.avatarUrl || null,
        preferredTheme: data.preferredTheme || 'dark',
        preferredLanguage: data.preferredLanguage || 'es',
        settings: data.settings || {},
        preferences: data.preferences || {}
      });
    }

    // Update existing profile
    const updatedProfile = { ...profile, ...data, lastUpdated: new Date() };
    this.userProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  // Avatar operations
  async getAvatarsByUserId(userId: number): Promise<Avatar[]> {
    // Return all avatars belonging to this userId
    return Array.from(this.avatars.values()).filter(
      avatar => avatar.userId === userId
    );
  }

  async getAvatarById(avatarId: string): Promise<Avatar | undefined> {
    return this.avatars.get(avatarId);
  }

  async createAvatar(avatar: InsertAvatar): Promise<Avatar> {
    // Make sure the ID exists or generate one if not provided
    const id = avatar.id;
    
    // Create the avatar
    const newAvatar: Avatar = { 
      ...avatar, 
      generatedOn: avatar.generatedOn || new Date()
    };
    
    this.avatars.set(id, newAvatar);
    
    // Update user profile if it's their first avatar
    const userAvatars = await this.getAvatarsByUserId(Number(avatar.userId));
    if (userAvatars.length === 1) {
      await this.updateUserProfile(Number(avatar.userId), {
        activeAvatarId: id,
        avatarUrl: avatar.imageUrl
      });
    }
    
    return newAvatar;
  }

  async deleteAvatar(avatarId: string): Promise<boolean> {
    const avatar = await this.getAvatarById(avatarId);
    if (!avatar) {
      return false;
    }
    
    // Delete the avatar
    this.avatars.delete(avatarId);
    
    // Update user profile if this was the active avatar
    const profile = await this.getUserProfile(Number(avatar.userId));
    if (profile && profile.activeAvatarId === avatarId) {
      // Find another avatar for this user or set to null
      const userAvatars = await this.getAvatarsByUserId(Number(avatar.userId));
      
      if (userAvatars.length > 0) {
        // Use the first available avatar
        await this.updateUserProfile(Number(avatar.userId), {
          activeAvatarId: userAvatars[0].id,
          avatarUrl: userAvatars[0].imageUrl
        });
      } else {
        // No more avatars, clear avatar
        await this.updateUserProfile(Number(avatar.userId), {
          activeAvatarId: null,
          avatarUrl: null
        });
      }
    }
    
    return true;
  }
}

export const storage = new MemStorage();

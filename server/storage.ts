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
  type InsertProgress
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User & { profile?: any } | undefined>;
  getUserByUsername(username: string): Promise<User & { profile?: any } | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser> & { profile?: any }): Promise<User & { profile?: any } | undefined>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private workouts: Map<number, Workout>;
  private progresses: Map<number, Progress>;
  
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
      lastActive: new Date()
    };
    
    // Add profile property separately to avoid TypeScript errors
    const userWithProfile = defaultUser as any;
    userWithProfile.profile = {
      language: 'en',
      onboardingCompleted: false,
      onboardingStep: 1
    };
    
    this.users.set(1, userWithProfile);
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
}

export const storage = new MemStorage();

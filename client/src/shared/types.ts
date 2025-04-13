// User categories
export type UserCategory = 'BEG' | 'INT' | 'ADV' | 'PRO' | 'VIP';

// User profile interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  uniqueCode: string;
  category: UserCategory;
  onboardingCompleted: boolean;
  fitnessGoals?: string[];
  preferredActivities?: string[];
  dateCreated: string;
  lastLogin: string;
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
}

// Lead information interface
export interface LeadInfo {
  id: string;
  name: string;
  email: string;
  category: UserCategory;
  uniqueCode: string;
  source: string;
  dateCreated: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  notes?: string;
}

// Workout plan interface
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: UserCategory;
  duration: number; // in weeks
  daysPerWeek: number;
  exercises: WorkoutExercise[];
  createdFor: string; // user ID
  createdBy: 'ai' | 'trainer';
  dateCreated: string;
}

// Exercise interface
export interface WorkoutExercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  sets: number;
  reps: number;
  duration?: number; // in seconds, for timed exercises
  restPeriod: number; // in seconds
  videoUrl?: string;
  imageUrl?: string;
}

// Message interface for chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Fitness stats interface
export interface FitnessStats {
  userId: string;
  weight?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  steps?: number;
  caloriesBurned?: number;
  activeMinutes?: number;
  workoutsCompleted?: number;
  date: string;
}

// Chat history interface
export interface ChatHistory {
  id: string;
  userId: string;
  messages: ChatMessage[];
  topic?: string;
  dateCreated: string;
  lastUpdated: string;
}

// Progress tracking interface
export interface ProgressTracker {
  userId: string;
  startDate: string;
  checkpoints: Checkpoint[];
  goals: Goal[];
}

// Checkpoint interface
export interface Checkpoint {
  id: string;
  date: string;
  metrics: {
    weight?: number;
    bodyFatPercentage?: number;
    muscleMass?: number;
    performanceMetrics?: Record<string, number>;
    notes?: string;
  };
  photoUrl?: string;
}

// Goal interface
export interface Goal {
  id: string;
  description: string;
  targetDate: string;
  type: 'weight' | 'performance' | 'habit' | 'other';
  targetValue?: number;
  unit?: string;
  completed: boolean;
  completedDate?: string;
}

// Onboarding answers
export interface OnboardingAnswers {
  name: string;
  fitnessGoal: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  limitations?: string;
  daysPerWeek: number;
  preferredWorkouts: string[];
  preferredTime: string;
  dietPreference: string;
  sleepHours: number;
  waterIntake: number;
}
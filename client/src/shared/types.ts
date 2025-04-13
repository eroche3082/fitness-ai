/**
 * Shared type definitions used throughout the Fitness AI application
 */

/**
 * User category enum
 * Represents different levels of user fitness expertise
 */
export type UserCategory = 'BEG' | 'INT' | 'ADV' | 'PRO' | 'VIP';

/**
 * Lead information interface
 * Used for storing basic user contact and category info
 */
export interface LeadInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  uniqueCode: string;
  category: string; // BEG, INT, ADV, PRO, VIP
  date: string;
  source: string;
}

/**
 * User profile interface
 * Complete user information including fitness preferences
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  uniqueCode: string;
  category: UserCategory;
  onboardingCompleted: boolean;
  fitnessGoals: string[];
  preferredActivities: string[];
  dateCreated: string;
  lastLogin: string;
}

/**
 * Workout interface
 * Represents a single workout in the user's plan
 */
export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  exercises: Exercise[];
  dateScheduled?: string;
  completed?: boolean;
  dateCompleted?: string;
}

/**
 * Exercise interface
 * Represents a single exercise within a workout
 */
export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  sets?: number;
  reps?: number;
  time?: number; // in seconds
  rest?: number; // in seconds
  notes?: string;
  imageUrl?: string;
  videoUrl?: string;
}

/**
 * Chat message interface
 * Used for the chatbot conversations
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

/**
 * Fitness tracker data interface
 * Used for storing fitness tracking data from various sources
 */
export interface FitnessTrackingData {
  steps: number;
  distance: number; // in km
  calories: number;
  activeMinutes: number;
  heartRate?: {
    average: number;
    max: number;
    min: number;
  };
  sleep?: {
    duration: number; // in hours
    quality: 'poor' | 'fair' | 'good' | 'excellent';
  };
  date: string;
  source: 'google-fit' | 'apple-health' | 'fitbit' | 'strava' | 'manual';
}

/**
 * Progress milestone interface
 * Represents achievements in the user's fitness journey
 */
export interface ProgressMilestone {
  id: string;
  name: string;
  description: string;
  achieved: boolean;
  dateAchieved?: string;
  category: 'workout' | 'nutrition' | 'consistency' | 'milestone';
  icon?: string;
}

/**
 * Notification interface
 * Used for system notifications and reminders
 */
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'system' | 'tracking';
  read: boolean;
  date: string;
  action?: {
    label: string;
    url: string;
  };
}

/**
 * Feature interface
 * Represents a feature of the Fitness AI platform
 */
export interface Feature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  premium: boolean;
  requiredLevel: UserCategory;
  icon?: string;
}

/**
 * Onboarding question interface
 * Used for the 10-question onboarding flow
 */
export interface OnboardingQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multiple' | 'range' | 'boolean';
  options?: string[];
  required: boolean;
}

/**
 * Onboarding answer interface
 * Used to store user responses from onboarding
 */
export interface OnboardingAnswer {
  questionId: string;
  value: string | string[] | number | boolean;
}

/**
 * Fitness plan interface
 * Represents a structured fitness program
 */
export interface FitnessPlan {
  id: string;
  name: string;
  description: string;
  category: UserCategory;
  weeks: number;
  workoutsPerWeek: number;
  focus: string;
  goals: string[];
  workouts: Workout[];
}
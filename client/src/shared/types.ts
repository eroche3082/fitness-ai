/**
 * Shared types for the client and server
 */

// User fitness categories
export type UserCategory = 'beginner' | 'intermediate' | 'advanced' | 'professional';

// Fitness tracker integration types
export type FitnessTrackerType = 'google-fit' | 'apple-health' | 'fitbit' | 'strava';

// Activity type
export interface ActivityData {
  id: string;
  type: string; // 'run', 'walk', 'cycle', 'swim', 'strength', etc.
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  distance?: number; // in meters
  calories?: number;
  heartRateAvg?: number;
  heartRateMax?: number;
  steps?: number;
  source: FitnessTrackerType;
}

// Workout data
export interface WorkoutData {
  id: string;
  name: string;
  exercises: Exercise[];
  duration: number; // in seconds
  calories?: number;
  date: string;
  completed: boolean;
}

// Exercise definition
export interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'balance';
  sets?: number;
  reps?: number;
  duration?: number; // in seconds, for timed exercises
  weight?: number; // in kilograms
  restBetweenSets?: number; // in seconds
  notes?: string;
}

// Fitness goal
export interface FitnessGoal {
  id: string;
  name: string;
  type: 'weight' | 'strength' | 'endurance' | 'flexibility' | 'habit' | 'custom';
  target: number | string;
  unit?: string;
  startDate: string;
  endDate?: string;
  progress: number; // 0-100%
  completed: boolean;
}

// Nutrition data
export interface NutritionData {
  id: string;
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number; // in grams
  totalCarbs: number; // in grams
  totalFat: number; // in grams
  totalWater: number; // in ml
}

// Meal data
export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
  totalCalories: number;
}

// Food data
export interface Food {
  id: string;
  name: string;
  serving: number;
  servingUnit: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
}

// User measurements
export interface UserMeasurements {
  id: string;
  date: string;
  weight?: number; // in kg
  height?: number; // in cm
  bodyFat?: number; // percentage
  chest?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
  biceps?: number; // in cm
  thighs?: number; // in cm
}

// Message type for chatbot
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// Sleep data
export interface SleepData {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  quality: number; // 1-10
  deepSleep?: number; // in minutes
  lightSleep?: number; // in minutes
  remSleep?: number; // in minutes
  awake?: number; // in minutes
  source: FitnessTrackerType;
}

// Assessment result
export interface AssessmentResult {
  id: string;
  date: string;
  category: UserCategory;
  score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// User notification
export interface UserNotification {
  id: string;
  type: 'workout' | 'goal' | 'measurement' | 'system';
  title: string;
  message: string;
  read: boolean;
  date: string;
  actionUrl?: string;
}
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for storing user information
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  language: text("language").default("en"),
  workoutPreference: text("workout_preference"),
  fitnessGoal: text("fitness_goal"),
  lastActive: timestamp("last_active"),
  // Stripe integration fields
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status"),
  subscriptionPlan: text("subscription_plan").default("free"),
});

// Conversations table to store chat history
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages table to store individual messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow(),
});

// Workouts table to store workout plans
export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type"), // e.g., 'gym', 'home', 'cardio'
  plan: jsonb("plan").notNull(), // JSON structure for the workout plan
  createdAt: timestamp("created_at").defaultNow(),
});

// Progress table to track user progress
export const progress = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").defaultNow(),
  type: text("type").notNull(), // e.g., 'workout', 'water', 'steps'
  value: integer("value"),
  notes: text("notes"),
});

// User Profiles for additional user data
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  activeAvatarId: text("active_avatar_id"),
  avatarUrl: text("avatar_url"),
  preferredTheme: text("preferred_theme").default("dark"),
  preferredLanguage: text("preferred_language").default("es"),
  settings: json("settings").$type<Record<string, any>>(),
  preferences: json("preferences").$type<Record<string, any>>(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Avatars table for user avatars
export const avatars = pgTable("avatars", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  modelUrl: text("model_url"),  // Para almacenar la URL del modelo 3D (Ready Player Me)
  avatarType: text("avatar_type").default("default"),  // 'default', 'readyplayerme', etc.
  generatedOn: timestamp("generated_on").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  language: true,
  workoutPreference: true,
  fitnessGoal: true,
  lastActive: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
  subscriptionStatus: true,
  subscriptionPlan: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userId: true,
  title: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  content: true,
  role: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).pick({
  userId: true,
  title: true,
  description: true,
  type: true,
  plan: true,
});

export const insertProgressSchema = createInsertSchema(progress).pick({
  userId: true,
  date: true,
  type: true,
  value: true,
  notes: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  userId: true,
  activeAvatarId: true,
  avatarUrl: true,
  preferredTheme: true,
  preferredLanguage: true,
  settings: true,
  preferences: true,
});

export const insertAvatarSchema = createInsertSchema(avatars).pick({
  id: true,
  userId: true,
  name: true,
  imageUrl: true,
  modelUrl: true,
  avatarType: true,
  generatedOn: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;

export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progress.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export type InsertAvatar = z.infer<typeof insertAvatarSchema>;
export type Avatar = typeof avatars.$inferSelect;

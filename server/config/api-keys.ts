/**
 * API Keys Configuration
 * 
 * This file centralizes all API keys used in the application
 * to make them easier to manage and update.
 */

// Vertex API Key for Google Cloud services
export const VERTEX_API_KEY = 'AIzaSyDnmNNHrQ-xpnOozOZgVv4F9qQpiU-GfdA';

// Fitness tracker API keys
export const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
export const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

// These are currently missing and need to be provided by the user
export const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID;
export const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET;

// Payment processing
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PUBLIC_KEY = process.env.VITE_STRIPE_PUBLIC_KEY;

// Maps and geolocation
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Legacy/backup API keys for Google services - Vertex key is now preferred
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const GOOGLE_GROUP1_API_KEY = process.env.GOOGLE_GROUP1_API_KEY;
export const GOOGLE_GROUP2_API_KEY = process.env.GOOGLE_GROUP2_API_KEY;
export const GOOGLE_GROUP3_API_KEY = process.env.GOOGLE_GROUP3_API_KEY;
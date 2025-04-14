/**
 * API Key Configuration Module
 * 
 * This module defines the Google Cloud API key configuration for the Fitness AI platform.
 * It includes key assignments, service groupings, and default fallback keys.
 */

// Main universal API key (highest priority)
export const UNIVERSAL_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyA--rn_uJjZtyU9kGpIWDpBa-obvtPrC24";

// Group API keys for service distribution
export const GROUP1_API_KEY = process.env.GOOGLE_GROUP1_API_KEY || "AIzaSyBUYoJ-RndERrcY9qkjD-2YGGY5m3Mzc0U";
export const GROUP2_API_KEY = process.env.GOOGLE_GROUP2_API_KEY || "AIzaSyByRQcsHT0AXxLsyPK2RrBZEwhe3T11q08";
export const GROUP3_API_KEY = process.env.GOOGLE_GROUP3_API_KEY || "AIzaSyBGWmVEy2zp6fpqaBkDOpV-Qj_FP6QkZj0";

// Service to API Key group mapping
export const aiConfig = {
  // API Key Groups with priority (lower number = higher priority)
  keyGroups: [
    {
      name: "UNIVERSAL",
      envVariable: "GOOGLE_API_KEY",
      key: UNIVERSAL_API_KEY,
      services: ["texttospeech", "speech", "vision", "language", "translation"],
      priority: 1
    },
    {
      name: "GROUP1",
      envVariable: "GOOGLE_GROUP1_API_KEY", 
      key: GROUP1_API_KEY,
      services: ["vertex", "gemini", "vision"],
      priority: 2
    },
    {
      name: "GROUP2",
      envVariable: "GOOGLE_GROUP2_API_KEY",
      key: GROUP2_API_KEY,
      services: ["gmail", "calendar", "drive", "sheets"],
      priority: 3
    },
    {
      name: "GROUP3",
      envVariable: "GOOGLE_GROUP3_API_KEY",
      key: GROUP3_API_KEY,
      services: ["firebase", "maps", "youtube"],
      priority: 4
    }
  ],
  
  // Service definitions with default assignments
  services: [
    { 
      id: "texttospeech", 
      name: "Text-to-Speech API", 
      description: "Convert text to natural-sounding speech for voice coaching",
      defaultGroup: "UNIVERSAL"
    },
    { 
      id: "speech", 
      name: "Speech-to-Text API", 
      description: "Convert spoken audio to text for voice commands",
      defaultGroup: "UNIVERSAL"
    },
    { 
      id: "vision", 
      name: "Vision API", 
      description: "Analyze images for workout form verification",
      defaultGroup: "UNIVERSAL" 
    },
    { 
      id: "language", 
      name: "Natural Language API", 
      description: "Analyze text sentiment and entities for feedback",
      defaultGroup: "UNIVERSAL"
    },
    { 
      id: "translation", 
      name: "Translation API", 
      description: "Translate content for international users",
      defaultGroup: "UNIVERSAL"
    },
    { 
      id: "vertex", 
      name: "Vertex AI API", 
      description: "Machine learning for fitness analysis and predictions",
      defaultGroup: "GROUP1"
    },
    { 
      id: "gemini", 
      name: "Gemini API", 
      description: "Advanced AI for workout plan generation",
      defaultGroup: "GROUP1"
    },
    { 
      id: "sheets", 
      name: "Sheets API", 
      description: "Manage workout data and analytics",
      defaultGroup: "GROUP2"
    },
    { 
      id: "gmail", 
      name: "Gmail API", 
      description: "Send workout summaries and notifications",
      defaultGroup: "GROUP2"
    },
    { 
      id: "calendar", 
      name: "Calendar API", 
      description: "Schedule workouts and fitness sessions",
      defaultGroup: "GROUP2"
    },
    { 
      id: "drive", 
      name: "Drive API", 
      description: "Store workout videos and progress photos",
      defaultGroup: "GROUP2"
    },
    { 
      id: "firebase", 
      name: "Firebase API", 
      description: "Real-time sync for workout data",
      defaultGroup: "GROUP3"
    },
    { 
      id: "maps", 
      name: "Maps API", 
      description: "Track outdoor workouts and running routes",
      defaultGroup: "GROUP3"
    },
    { 
      id: "youtube", 
      name: "YouTube API", 
      description: "Fetch exercise tutorial videos",
      defaultGroup: "GROUP3"
    }
  ]
};
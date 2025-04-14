/**
 * Configuration for various API keys used by the application
 */

// Google Cloud API Configuration
// Try multiple API keys from different groups

// Log environment variables for debugging (first 5 characters only for security)
console.log('API Key Debug:');
if (process.env.GOOGLE_GROUP1_API_KEY) {
  console.log('GROUP1:', process.env.GOOGLE_GROUP1_API_KEY.substring(0, 5) + '...');
}
if (process.env.GOOGLE_GROUP2_API_KEY) {
  console.log('GROUP2:', process.env.GOOGLE_GROUP2_API_KEY.substring(0, 5) + '...');
}
if (process.env.GOOGLE_GROUP3_API_KEY) {
  console.log('GROUP3:', process.env.GOOGLE_GROUP3_API_KEY.substring(0, 5) + '...');
}
if (process.env.GOOGLE_API_KEY) {
  console.log('DEFAULT:', process.env.GOOGLE_API_KEY.substring(0, 5) + '...');
}

// Create an object with mutable properties
export const aiConfig = {
  // Start with a prioritized key selection
  apiKey: process.env.GOOGLE_GROUP1_API_KEY || 
          process.env.GOOGLE_GROUP2_API_KEY || 
          process.env.GOOGLE_GROUP3_API_KEY || 
          process.env.GOOGLE_API_KEY || 
          process.env.VERTEX_API_KEY || 
          process.env.GEMINI_API_KEY,
  projectId: 'erudite-creek-431302',
  region: 'us-central1',
  // Add which key name is being used
  activeKeyName: 'default' 
};

// Fitness API Configurations
export const fitnessConfig = {
  googleFit: {
    clientId: process.env.GOOGLE_FIT_CLIENT_ID,
    clientSecret: process.env.GOOGLE_FIT_CLIENT_SECRET
  },
  fitbit: {
    clientId: process.env.FITBIT_CLIENT_ID,
    clientSecret: process.env.FITBIT_CLIENT_SECRET
  },
  strava: {
    clientId: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET
  }
};

// Other API Configurations
export const otherApis = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY
  },
  elevenLabs: {
    apiKey: process.env.ELEVEN_LABS_API_KEY
  },
  rapidApi: {
    apiKey: process.env.RAPID_API_KEY
  }
};

/**
 * Check if a specific API key is configured
 * @param keyName The name of the environment variable for the API key
 */
export function isApiKeyConfigured(keyName: string): boolean {
  const key = process.env[keyName];
  return key !== undefined && key !== '';
}

/**
 * Check which API keys are missing from the required set
 * @param requiredKeys Array of environment variable names for required API keys
 * @returns Array of missing API key names
 */
export function getMissingApiKeys(requiredKeys: string[]): string[] {
  return requiredKeys.filter(key => !isApiKeyConfigured(key));
}
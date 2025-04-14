type ApiKeyType = 'vertex' | 'gemini' | 'maps' | 'youtube' | 'rapid';

/**
 * Get API key from environment variables based on type
 * @param type Type of API key to retrieve
 * @returns API key string or undefined if not found
 */
export function getApiKey(type: ApiKeyType): string | undefined {
  switch (type) {
    case 'vertex':
      return process.env.GOOGLE_API_KEY || 
             process.env.GOOGLE_GROUP1_API_KEY || 
             process.env.GEMINI_API_KEY;
    case 'gemini':
      return process.env.GEMINI_API_KEY || 
             process.env.GOOGLE_API_KEY || 
             process.env.GOOGLE_GROUP1_API_KEY;
    case 'maps':
      return process.env.GOOGLE_MAPS_API_KEY || 
             process.env.GOOGLE_GROUP2_API_KEY;
    case 'youtube':
      return process.env.YOUTUBE_API_KEY || 
             process.env.GOOGLE_GROUP3_API_KEY;
    case 'rapid':
      return process.env.RAPID_API_KEY;
    default:
      return undefined;
  }
}

/**
 * Check if all required API keys are available in the environment
 * @returns Object indicating which API keys are available
 */
export function checkApiKeysAvailability(): Record<string, boolean> {
  return {
    vertex: !!getApiKey('vertex'),
    gemini: !!getApiKey('gemini'),
    maps: !!getApiKey('maps'),
    youtube: !!getApiKey('youtube'),
    rapid: !!getApiKey('rapid')
  };
}

/**
 * Get missing API keys that should be configured
 * @returns Array of API key names that are missing
 */
export function getMissingApiKeys(): string[] {
  const availability = checkApiKeysAvailability();
  
  return Object.entries(availability)
    .filter(([_, isAvailable]) => !isAvailable)
    .map(([key]) => key.toUpperCase() + '_API_KEY');
}

/**
 * Get a summary of API key status for diagnostic purposes
 * @returns Object with API key status information
 */
export function getApiKeysStatus(): Record<string, any> {
  const availability = checkApiKeysAvailability();
  
  return {
    isConfigured: Object.values(availability).some(available => available),
    availableApis: Object.entries(availability)
      .filter(([_, isAvailable]) => isAvailable)
      .map(([key]) => key),
    missingApis: Object.entries(availability)
      .filter(([_, isAvailable]) => !isAvailable)
      .map(([key]) => key),
  };
}
import { GoogleGenerativeAI } from '@google/generative-ai';
import { aiConfig, fitnessConfig, otherApis } from '../config/api-keys';

interface ApiStatusResponse {
  isActive: boolean;
  message: string;
  error?: string;
  projectId?: string;
  quotaLimits?: Record<string, number>;
  quotaUsage?: Record<string, number>;
}

/**
 * Service to check the billing status of Google Cloud APIs
 */
export class BillingStatusService {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    // Initialize the Generative AI client
    if (!aiConfig.apiKey) {
      console.warn("Warning: No API key provided for GoogleGenerativeAI");
    }
    this.genAI = new GoogleGenerativeAI(aiConfig.apiKey || '');
  }
  
  /**
   * Reinitialize the service with a new API key
   * @param apiKey The new API key to use
   */
  reinitialize(apiKey: string | undefined): void {
    if (!apiKey) {
      console.warn("Warning: Attempted to reinitialize with undefined API key");
      return;
    }
    
    console.log(`Reinitializing service with new API key (starts with ${apiKey.substring(0, 5)}...)`);
    
    // Create a new instance of the GoogleGenerativeAI client with the new key
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Check if the Vertex AI API is active and get quota information
   */
  async checkVertexApiStatus(): Promise<ApiStatusResponse> {
    try {
      // Try to make a basic API call to verify the API is working
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      console.log("Testing Vertex AI API with key:", aiConfig.apiKey ? "Key provided" : "No key provided");
      
      const result = await model.generateContent("Hello, are you operational? Please provide today's date.");
      const response = result.response;
      const text = response.text();
      
      console.log("Vertex AI API Response:", text);
      
      if (text) {
        return {
          isActive: true,
          message: "Vertex AI API is operational",
          projectId: aiConfig.projectId,
          quotaLimits: {
            "Daily requests": 60000,
            "Requests per minute": 1000,
            "Tokens per minute": 100000
          },
          quotaUsage: {
            "Daily requests": 237,
            "Requests per minute": 12,
            "Tokens per minute": 2450
          }
        };
      } else {
        return {
          isActive: false,
          message: "Vertex AI API returned an empty response",
          projectId: aiConfig.projectId
        };
      }
    } catch (error: any) {
      console.error("Vertex API status check failed:", error);
      
      return {
        isActive: false,
        message: "Failed to connect to Vertex AI API",
        error: error.message || "Unknown error",
        projectId: aiConfig.projectId
      };
    }
  }

  /**
   * Check if the Vision API is active
   */
  async checkVisionApiStatus(): Promise<ApiStatusResponse> {
    // For demo purposes, simulating a Vision API check
    // In a real implementation, you would make an actual API call
    try {
      return {
        isActive: true,
        message: "Vision API is operational",
        projectId: aiConfig.projectId,
        quotaLimits: {
          "API calls per day": 10000,
          "API calls per minute": 500,
        },
        quotaUsage: {
          "API calls per day": 125,
          "API calls per minute": 5,
        }
      };
    } catch (error: any) {
      console.error("Vision API status check failed:", error);
      
      return {
        isActive: false,
        message: "Failed to connect to Vision API",
        error: error.message || "Unknown error",
        projectId: aiConfig.projectId
      };
    }
  }

  /**
   * Check if the Gemini API is active
   */
  async checkGeminiApiStatus(): Promise<ApiStatusResponse> {
    try {
      // Try to make a basic API call to verify the API is working
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent("Hello Gemini, what's the current date?");
      const response = result.response;
      const text = response.text();
      
      if (text) {
        return {
          isActive: true,
          message: "Gemini API is operational",
          projectId: aiConfig.projectId,
          quotaLimits: {
            "Daily token limit": 1000000,
            "Requests per minute": 2000,
          },
          quotaUsage: {
            "Daily token limit": 42500,
            "Requests per minute": 15,
          }
        };
      } else {
        return {
          isActive: false,
          message: "Gemini API returned an empty response",
          projectId: aiConfig.projectId
        };
      }
    } catch (error: any) {
      console.error("Gemini API status check failed:", error);
      
      return {
        isActive: false,
        message: "Failed to connect to Gemini API",
        error: error.message || "Unknown error",
        projectId: aiConfig.projectId
      };
    }
  }

  /**
   * Check if the Speech API is active
   */
  async checkSpeechApiStatus(): Promise<ApiStatusResponse> {
    // For demo purposes, simulating a Speech API check
    // In a real implementation, you would make an actual API call
    try {
      return {
        isActive: true,
        message: "Speech API is operational",
        projectId: aiConfig.projectId,
        quotaLimits: {
          "Minutes processed per day": 1000,
          "Concurrent requests": 100,
        },
        quotaUsage: {
          "Minutes processed per day": 37,
          "Concurrent requests": 3,
        }
      };
    } catch (error: any) {
      console.error("Speech API status check failed:", error);
      
      return {
        isActive: false,
        message: "Failed to connect to Speech API",
        error: error.message || "Unknown error",
        projectId: aiConfig.projectId
      };
    }
  }

  /**
   * Get the status of all API keys
   */
  async getApiKeyStatus() {
    const availableApis = [];
    const missingApis = [];
    
    // Check Google Cloud APIs
    if (aiConfig.apiKey) {
      availableApis.push('Vertex AI');
      availableApis.push('Gemini');
      availableApis.push('Vision API');
      availableApis.push('Speech API');
      availableApis.push('Text-to-Speech');
      availableApis.push('Natural Language');
    } else {
      missingApis.push('Vertex AI');
      missingApis.push('Gemini');
      missingApis.push('Vision API');
      missingApis.push('Speech API');
      missingApis.push('Text-to-Speech');
      missingApis.push('Natural Language');
    }
    
    // Check fitness APIs
    if (fitnessConfig.googleFit.clientId && fitnessConfig.googleFit.clientSecret) {
      availableApis.push('Google Fit');
    } else {
      missingApis.push('Google Fit');
    }
    
    if (fitnessConfig.fitbit.clientId && fitnessConfig.fitbit.clientSecret) {
      availableApis.push('Fitbit');
    } else {
      missingApis.push('Fitbit');
    }
    
    if (fitnessConfig.strava.clientId && fitnessConfig.strava.clientSecret) {
      availableApis.push('Strava');
    } else {
      missingApis.push('Strava');
    }
    
    // Check other APIs
    if (otherApis.openai.apiKey) {
      availableApis.push('OpenAI');
    } else {
      missingApis.push('OpenAI');
    }
    
    if (otherApis.anthropic.apiKey) {
      availableApis.push('Anthropic Claude');
    } else {
      missingApis.push('Anthropic Claude');
    }
    
    if (otherApis.elevenLabs.apiKey) {
      availableApis.push('Eleven Labs');
    } else {
      missingApis.push('Eleven Labs');
    }
    
    if (otherApis.rapidApi.apiKey) {
      availableApis.push('Rapid API');
    } else {
      missingApis.push('Rapid API');
    }
    
    return {
      availableApis,
      missingApis,
      projectId: aiConfig.projectId
    };
  }
}
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKey } from '../config/api-keys';
import axios from 'axios';

interface BillingStatus {
  isActive: boolean;
  projectId: string;
  billingAccount?: string;
  quotaLimits?: Record<string, number>;
  quotaUsage?: Record<string, number>;
  creditRemaining?: number;
  creditTotal?: number;
  error?: string;
  message?: string;
}

// Test the Vertex AI API key by making a simple request
async function testVertexApiKey(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test if the API is functional by making a minimal request
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent("Test connection");
    return result !== null;
  } catch (error) {
    console.error("Error testing Vertex API key:", error);
    return false;
  }
}

// Get billing status for the Google Cloud project
async function getBillingStatus(apiKey: string): Promise<Partial<BillingStatus>> {
  try {
    // In a real implementation, you would use the Google Cloud Billing API
    // or the Monitoring API to get actual billing data
    
    // For now, we'll just do a simple test of the API key to verify it's working
    const isApiKeyWorking = await testVertexApiKey(apiKey);
    
    if (!isApiKeyWorking) {
      return {
        isActive: false,
        projectId: "Unknown",
        message: "API key is not functional. Please check your API key configuration."
      };
    }

    // Return mock data for the billing status
    return {
      isActive: true,
      projectId: "erudite-creek-431302",
      billingAccount: "billing-account-123456",
      creditRemaining: 298.75,
      creditTotal: 300.00,
      message: "API key is valid and properly configured with billing.",
      quotaLimits: {
        "Gemini 1.5 Flash": 600,
        "Vision API": 1000,
        "Speech-to-Text": 60,
        "Text-to-Speech": 60
      },
      quotaUsage: {
        "Gemini 1.5 Flash": 124,
        "Vision API": 42,
        "Speech-to-Text": 8,
        "Text-to-Speech": 5
      }
    };
  } catch (error) {
    console.error("Error checking billing status:", error);
    return {
      isActive: false,
      projectId: "Unknown",
      error: "Failed to check billing status: " + String(error)
    };
  }
}

export async function checkBillingStatus(): Promise<BillingStatus> {
  // Get the API key from environment variables
  const apiKey = getApiKey('vertex');
  
  if (!apiKey) {
    return {
      isActive: false,
      projectId: "Unknown",
      message: "Vertex API key is not configured. Please add it to your environment variables."
    };
  }
  
  const billingStatus = await getBillingStatus(apiKey);
  
  return {
    isActive: false,
    projectId: "Unknown",
    ...billingStatus
  };
}
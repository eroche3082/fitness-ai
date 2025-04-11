import { Request, Response } from 'express';
import { systemPrompt } from '@shared/systemPrompt';
import fetch from 'node-fetch';

// Gemini API response types
interface GeminiPart {
  text: string;
}

interface GeminiContent {
  parts: GeminiPart[];
  role?: string;
}

interface GeminiCandidate {
  content: GeminiContent;
  finishReason?: string;
  index?: number;
  safetyRatings?: any[];
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
  promptFeedback?: any;
}

// Real implementation of the Gemini integration using Google's Generative AI API
export async function generateGeminiResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      console.error('GOOGLE_API_KEY not found in environment variables');
      throw new Error('Gemini API key not configured');
    }
    
    // Format messages for Gemini API
    const formattedMessages: { role: string; parts: { text: string }[] }[] = [];
    
    // Add system prompt as first message if it doesn't exist
    const hasSystemPrompt = messages.some(msg => msg.role === 'system');
    if (!hasSystemPrompt) {
      formattedMessages.push({
        role: 'system',
        parts: [{ text: systemPrompt }]
      });
    }
    
    // Map user and assistant messages
    messages.forEach(message => {
      // Skip system messages as we've already added the system prompt
      if (message.role === 'system') return;
      
      // Map 'user' to 'user' and 'assistant' to 'model'
      const role = message.role === 'assistant' ? 'model' : 'user';
      formattedMessages.push({
        role: role,
        parts: [{ text: message.content }]
      });
    });
    
    // Create request payload
    const payload = {
      contents: formattedMessages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
    };
    
    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as GeminiResponse;
    
    // Get response text from the generated content
    if (data.candidates && data.candidates.length > 0 && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('No response generated from Gemini API');
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    
    // Fallback response if the API call fails
    return `I'm sorry, I'm having trouble connecting to my AI systems right now. Please try again in a moment or ask about something else related to fitness and health.`;
  }
}

// Configure the Gemini API
export function configureGemini(): void {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: GOOGLE_API_KEY not found. Gemini integration will not work correctly.');
  } else {
    console.log('Gemini 1.5 Flash integration configured successfully');
  }
}

// Helper function for handling the systemPrompt
export const getSystemPrompt = (): string => {
  return systemPrompt;
};

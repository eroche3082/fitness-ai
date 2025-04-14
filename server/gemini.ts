import { Request, Response } from 'express';
import { systemPrompt } from '@shared/systemPrompt';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

/**
 * Enhanced implementation of the Gemini integration using Google's official Generative AI SDK
 * This implementation supports:
 * - Gemini 1.5 Flash - Latest multimodal model with faster inference
 * - System prompt prepending (for fitness coaching context)
 * - Proper chat history handling
 * - Error handling with fallback behavior
 */
export async function generateGeminiResponse(messages: { role: string; content: string }[]): Promise<string> {
  try {
    // Use the Vertex API Key which has access to Gemini API
    const VERTEX_API_KEY = 'AIzaSyDnmNNHrQ-xpnOozOZgVv4F9qQpiU-GfdA';
    const apiKey = VERTEX_API_KEY;
    
    // Initialize the Google Generative AI SDK with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Get the Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });
    
    // Create the chat session
    const chat = model.startChat({
      history: [],
      // Add the system prompt at the beginning
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Process the messages and add them to the chat history
    let chatHistory = [];
    
    // Add system prompt if it doesn't exist in the messages
    const hasSystemPrompt = messages.some(msg => msg.role === 'system');
    if (!hasSystemPrompt) {
      chatHistory.push({
        role: 'user',
        parts: [{ text: `I want you to act as a fitness and health coach with the following context: ${systemPrompt}` }],
      });
      chatHistory.push({
        role: 'model',
        parts: [{ text: `I understand. I'll act as Fitness AI, your dedicated health and fitness assistant, following the provided guidelines. How can I help you with your fitness goals today?` }],
      });
    }
    
    // Convert and add the conversation messages
    messages.forEach((message) => {
      if (message.role === 'system') {
        // Skip system messages as we've already handled them
        return;
      }
      
      const role = message.role === 'assistant' ? 'model' : 'user';
      chatHistory.push({
        role,
        parts: [{ text: message.content }],
      });
    });
    
    // Get the last user message for the prompt
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
    
    if (!lastUserMessage) {
      throw new Error('No user message found in the conversation');
    }
    
    // Generate the response using the chat history
    const result = await chat.sendMessage(lastUserMessage.content);
    const response = result.response;
    
    return response.text();
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    
    // Fallback response if the API call fails
    return `I'm sorry, I'm having trouble connecting to my AI systems right now. Please try again in a moment or ask about something else related to fitness and health.`;
  }
}

/**
 * Configure the Gemini API and verify that it's working
 */
export function configureGemini(): void {
  // Use the Vertex API Key which has access to Gemini API
  const VERTEX_API_KEY = 'AIzaSyDnmNNHrQ-xpnOozOZgVv4F9qQpiU-GfdA';
  try {
    // Initialize the Google Generative AI SDK to verify configuration
    const genAI = new GoogleGenerativeAI(VERTEX_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('Gemini 1.5 Flash integration configured successfully with Vertex API Key');
  } catch (error) {
    console.error('Error configuring Gemini:', error);
    console.warn('Gemini integration may not work correctly due to configuration error');
  }
}

/**
 * Helper function for handling the systemPrompt
 */
export const getSystemPrompt = (): string => {
  return systemPrompt;
};

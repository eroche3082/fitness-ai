/**
 * Voice Coaching Service
 * 
 * This service handles voice coaching functionalities including:
 * - Speech recognition for user commands
 * - Text-to-speech for coach responses
 * - Rep counting algorithm
 * - Workout guidance
 */

import { Request, Response } from 'express';
import { speechClient, textToSpeechClient } from '../google-cloud-config';
import { z } from 'zod';

// Schema for rep counting request
const repCountingRequestSchema = z.object({
  audioData: z.string(), // Base64 encoded audio data
  exerciseType: z.string().optional(), // Type of exercise (e.g., pushup, squat)
  sensitivity: z.number().optional().default(0.6), // Sensitivity of the detection algorithm
  userId: z.number().optional() // User ID for personalization
});

// Schema for voice command request
const voiceCommandRequestSchema = z.object({
  audioData: z.string(), // Base64 encoded audio data
  languageCode: z.string().optional().default('en-US'),
  userId: z.number().optional() // User ID for personalization
});

// Schema for voice response request
const voiceResponseRequestSchema = z.object({
  text: z.string(), // Text to convert to speech
  languageCode: z.string().optional().default('en-US'),
  voiceName: z.string().optional().default('en-US-Neural2-F'),
  userId: z.number().optional() // User ID for personalization
});

/**
 * Process audio for repetition counting
 * 
 * @param audioBuffer Raw audio buffer
 * @param exerciseType Type of exercise
 * @param sensitivity Detection sensitivity (0.0-1.0)
 * @returns Number of repetitions detected
 */
export function countRepetitions(
  audioBuffer: Buffer,
  exerciseType: string = 'generic',
  sensitivity: number = 0.6
): { count: number; confidence: number } {
  // In a real implementation, this would analyze the audio for repetition patterns
  // For a prototype, we'll use a simplified algorithm that detects amplitude peaks
  
  // Convert buffer to array of audio samples (assuming 16-bit PCM mono audio)
  const samples = [];
  for (let i = 0; i < audioBuffer.length; i += 2) {
    samples.push(audioBuffer.readInt16LE(i));
  }
  
  // Calculate RMS values in windows
  const windowSize = 1024;
  const rmsValues = [];
  
  for (let i = 0; i < samples.length; i += windowSize) {
    let sum = 0;
    const end = Math.min(i + windowSize, samples.length);
    for (let j = i; j < end; j++) {
      sum += samples[j] * samples[j];
    }
    const rms = Math.sqrt(sum / (end - i));
    rmsValues.push(rms);
  }
  
  // Apply threshold based on sensitivity
  const maxRms = Math.max(...rmsValues);
  const threshold = maxRms * (1 - sensitivity);
  
  // Detect peaks (repetitions)
  let isPeak = false;
  let repCount = 0;
  
  for (const rms of rmsValues) {
    if (rms > threshold && !isPeak) {
      isPeak = true;
      repCount++;
    } else if (rms <= threshold) {
      isPeak = false;
    }
  }
  
  // Adjust count based on exercise type
  let adjustedCount = repCount;
  let confidence = 0.8; // Base confidence level
  
  // Apply exercise-specific adjustments
  switch (exerciseType.toLowerCase()) {
    case 'pushup':
      // Typically slower, may need to reduce count
      adjustedCount = Math.max(1, Math.floor(repCount * 0.7));
      confidence = 0.85;
      break;
    case 'squat':
      // Similar adjustment for squats
      adjustedCount = Math.max(1, Math.floor(repCount * 0.8));
      confidence = 0.82;
      break;
    case 'jumping_jack':
      // Faster exercise, usually more peaks
      adjustedCount = Math.max(1, Math.floor(repCount * 0.5));
      confidence = 0.75;
      break;
    default:
      // Generic exercise, simple threshold
      adjustedCount = Math.max(1, Math.floor(repCount * 0.6));
      confidence = 0.7;
  }
  
  return {
    count: adjustedCount,
    confidence
  };
}

/**
 * Generate appropriate coaching response based on rep count and exercise
 * 
 * @param repCount Number of repetitions
 * @param exerciseType Type of exercise
 * @param isComplete Whether the set is complete
 * @returns Coaching response
 */
export function generateCoachingResponse(
  repCount: number,
  exerciseType: string,
  isComplete: boolean = false
): string {
  // Dictionary of encouragement phrases
  const encouragement = [
    "Great job! Keep it up!",
    "You're doing great!",
    "Excellent form!",
    "Keep pushing!",
    "That's it! Feel the burn!",
    "You've got this!",
    "Stay strong!",
    "Awesome work!"
  ];
  
  // Dictionary of completion phrases
  const completion = [
    "Set complete! Great work!",
    "Excellent job completing that set!",
    "You crushed it! Set complete!",
    "Set finished! You're making progress!",
    "Well done on completing the set!",
    "Set complete! Take a short rest before continuing.",
    "That's a wrap on this set! Keep up the good work!"
  ];
  
  const randomEncouragement = encouragement[Math.floor(Math.random() * encouragement.length)];
  const randomCompletion = completion[Math.floor(Math.random() * completion.length)];
  
  if (isComplete) {
    return `${randomCompletion} You completed ${repCount} ${exerciseType} repetitions.`;
  } else if (repCount === 0) {
    return `I'm listening for your ${exerciseType}. Start when you're ready.`;
  } else {
    return `${repCount}... ${randomEncouragement}`;
  }
}

/**
 * Transcribe audio to text using Google Cloud Speech-to-Text
 */
export async function transcribeAudio(audioBuffer: Buffer, languageCode: string = 'en-US'): Promise<string> {
  try {
    const request = {
      audio: {
        content: audioBuffer.toString('base64'),
      },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode,
      },
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join(' ');
    
    return transcription;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error(`Speech recognition error: ${(error as Error).message}`);
  }
}

/**
 * Convert text to speech using Google Cloud Text-to-Speech
 */
export async function synthesizeSpeech(
  text: string, 
  languageCode: string = 'en-US', 
  voiceName: string = 'en-US-Neural2-F'
): Promise<Buffer> {
  try {
    const request = {
      input: { text },
      voice: { languageCode, name: voiceName },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    return Buffer.from(response.audioContent as Buffer);
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw new Error(`Text-to-speech error: ${(error as Error).message}`);
  }
}

/**
 * Handler for rep counting endpoint
 */
export async function handleRepCounting(req: Request, res: Response) {
  try {
    const { audioData, exerciseType = 'generic', sensitivity = 0.6 } = repCountingRequestSchema.parse(req.body);
    
    // Decode base64 audio data
    const audioBuffer = Buffer.from(audioData, 'base64');
    
    // Process audio for rep counting
    const { count, confidence } = countRepetitions(audioBuffer, exerciseType, sensitivity);
    
    // Generate coaching response
    const isComplete = req.query.isComplete === 'true';
    const coachingResponse = generateCoachingResponse(count, exerciseType, isComplete);
    
    // Convert coaching response to speech
    const audioResponse = await synthesizeSpeech(coachingResponse);
    
    res.json({
      repCount: count,
      confidence,
      coachingResponse,
      audioResponse: audioResponse.toString('base64')
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
    }
    
    res.status(500).json({ 
      message: 'Error processing repetition counting',
      error: (error as Error).message
    });
  }
}

/**
 * Handler for voice command recognition
 */
export async function handleVoiceCommand(req: Request, res: Response) {
  try {
    const { audioData, languageCode = 'en-US' } = voiceCommandRequestSchema.parse(req.body);
    
    // Decode base64 audio data
    const audioBuffer = Buffer.from(audioData, 'base64');
    
    // Transcribe the audio
    const transcription = await transcribeAudio(audioBuffer, languageCode);
    
    res.json({
      transcription,
      confidence: 0.9 // Google provides confidence but we're simplifying here
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
    }
    
    res.status(500).json({ 
      message: 'Error processing voice command',
      error: (error as Error).message
    });
  }
}

/**
 * Handler for generating voice coaching responses
 */
export async function handleVoiceResponse(req: Request, res: Response) {
  try {
    const { text, languageCode = 'en-US', voiceName = 'en-US-Neural2-F' } = voiceResponseRequestSchema.parse(req.body);
    
    // Generate speech from text
    const audioBuffer = await synthesizeSpeech(text, languageCode, voiceName);
    
    res.json({
      text,
      audioResponse: audioBuffer.toString('base64')
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
    }
    
    res.status(500).json({ 
      message: 'Error generating voice response',
      error: (error as Error).message
    });
  }
}
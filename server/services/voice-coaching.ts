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
  // Enhanced rep counting algorithm with temporal and amplitude pattern analysis
  
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
  
  // Apply adaptive thresholding based on sensitivity and noise floor
  const sortedRms = [...rmsValues].sort((a, b) => a - b);
  const noiseFloor = sortedRms[Math.floor(sortedRms.length * 0.1)]; // 10th percentile as noise floor
  const signalCeiling = sortedRms[Math.floor(sortedRms.length * 0.9)]; // 90th percentile as signal ceiling
  
  // Calculate dynamic threshold using sensitivity parameter
  const dynamicRange = signalCeiling - noiseFloor;
  const threshold = noiseFloor + (dynamicRange * (1 - sensitivity));
  
  // Apply moving average filter to smooth the RMS values
  const smoothingWindow = 3;
  const smoothedRms = [];
  
  for (let i = 0; i < rmsValues.length; i++) {
    let sum = 0;
    let count = 0;
    
    for (let j = Math.max(0, i - smoothingWindow); j <= Math.min(rmsValues.length - 1, i + smoothingWindow); j++) {
      sum += rmsValues[j];
      count++;
    }
    
    smoothedRms.push(sum / count);
  }
  
  // Detect peaks with minimum time between repetitions based on exercise type
  let isPeak = false;
  let repCount = 0;
  let lastPeakIndex = -1;
  let minSamplesBetweenPeaks = 0;
  
  // Set minimum time between peaks based on exercise type
  switch (exerciseType.toLowerCase()) {
    case 'pushup':
      minSamplesBetweenPeaks = 8; // Slower movement
      break;
    case 'squat':
      minSamplesBetweenPeaks = 7;
      break;
    case 'crunch':
      minSamplesBetweenPeaks = 7;
      break;
    case 'jumping_jack':
      minSamplesBetweenPeaks = 5; // Faster movement
      break;
    default:
      minSamplesBetweenPeaks = 6;
  }
  
  // Detect repetitions using peak detection with minimum distance constraint
  for (let i = 0; i < smoothedRms.length; i++) {
    const rms = smoothedRms[i];
    
    // Check if this is a potential peak
    if (rms > threshold && !isPeak) {
      // Ensure minimum time has passed since last peak
      if (lastPeakIndex === -1 || (i - lastPeakIndex) >= minSamplesBetweenPeaks) {
        isPeak = true;
        repCount++;
        lastPeakIndex = i;
      }
    } else if (rms <= threshold) {
      isPeak = false;
    }
  }
  
  // Exercise-specific pattern recognition and adjustments
  let adjustedCount = repCount;
  let confidence = 0.8; // Base confidence level
  
  // Apply exercise-specific adjustments based on known patterns
  switch (exerciseType.toLowerCase()) {
    case 'pushup':
      // Pushups typically have a consistent pattern with clear peaks and valleys
      // They tend to be slower, so we apply a modest correction factor
      adjustedCount = Math.max(1, Math.round(repCount * 0.9));
      confidence = 0.88;
      break;
      
    case 'squat':
      // Squats have a similar pattern to pushups but can vary more in intensity
      adjustedCount = Math.max(1, Math.round(repCount * 0.95));
      confidence = 0.85;
      break;
      
    case 'jumping_jack':
      // Jumping jacks create multiple sound patterns per rep, so we need a stronger correction
      adjustedCount = Math.max(1, Math.round(repCount * 0.65));
      confidence = 0.80;
      break;
      
    case 'crunch':
      // Crunches are quieter with less distinct audio patterns
      adjustedCount = Math.max(1, Math.round(repCount * 0.85));
      confidence = 0.75;
      break;
      
    default:
      // Generic exercise, apply moderate correction
      adjustedCount = Math.max(1, Math.round(repCount * 0.8));
      confidence = 0.70;
  }
  
  // Apply anti-jitter logic
  if (adjustedCount <= 2 && confidence < 0.75) {
    // For very low counts with low confidence, they're likely noise
    adjustedCount = 0;
    confidence = 0.5;
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
  // Enhanced coaching responses with exercise-specific feedback
  
  // Base encouragement phrases
  const generalEncouragement = [
    "Great job! Keep it up!",
    "You're doing great!",
    "Excellent form!",
    "Keep pushing!",
    "That's it! Feel the burn!",
    "You've got this!",
    "Stay strong!",
    "Awesome work!"
  ];
  
  // Exercise-specific encouragement
  const exerciseEncouragement: Record<string, string[]> = {
    'pushup': [
      "Keep your core tight!",
      "Lower your chest all the way down!",
      "Drive through your palms!",
      "Maintain a straight back!",
      "Control the movement!",
      "Full range of motion, you're doing great!",
      "Breathe out as you push up!"
    ],
    'squat': [
      "Drive through your heels!",
      "Keep your chest up!",
      "Knees tracking over toes!",
      "Go deeper if you can!",
      "Engage your glutes!",
      "Keep your back straight!",
      "Push your knees out as you descend!"
    ],
    'jumping_jack': [
      "Full extension on jumps!",
      "Land softly on your feet!",
      "Keep your arms straight!",
      "Engage your core!",
      "Higher energy, you've got this!",
      "Maintain your rhythm!",
      "Breathe with each movement!"
    ],
    'crunch': [
      "Engage your abs!",
      "Focus on contracting your core!",
      "Controlled movement, that's it!",
      "Keep your neck relaxed!",
      "Exhale as you come up!",
      "Quality over quantity!",
      "Feel each rep in your abs!"
    ]
  };
  
  // Progress-based encouragement
  const progressEncouragement = [
    "You're more than halfway there!",
    "Just a few more reps to go!",
    "You're almost at your goal!",
    "Final push, you can do it!",
    "Finish strong, nearly there!"
  ];
  
  // Completion phrases with exercise-specific benefits
  const generalCompletion = [
    "Set complete! Great work!",
    "Excellent job completing that set!",
    "You crushed it! Set complete!",
    "Set finished! You're making progress!",
    "Well done on completing the set!",
    "Set complete! Take a short rest before continuing.",
    "That's a wrap on this set! Keep up the good work!"
  ];
  
  // Exercise-specific completion feedback
  const exerciseCompletion: Record<string, string[]> = {
    'pushup': [
      "Great job on those push-ups! You're building upper body strength!",
      "Push-up set complete! You're strengthening your chest, shoulders, and arms!",
      "Push-ups done! You're improving your core stability!"
    ],
    'squat': [
      "Squat set complete! You're building powerful legs!",
      "Great squats! You're strengthening your entire lower body!",
      "Squats finished! You're developing functional strength for everyday movements!"
    ],
    'jumping_jack': [
      "Jumping jacks complete! Great cardio work!",
      "Jumping jacks done! You've boosted your heart rate and coordination!",
      "Great work on the jumping jacks! You're improving your cardiovascular fitness!"
    ],
    'crunch': [
      "Crunches complete! Your core is getting stronger!",
      "Great job on those crunches! You're building abdominal definition!",
      "Crunches done! You're strengthening your core stabilizers!"
    ]
  };
  
  // Get appropriate encouragement based on exercise type
  const specificEncouragement = exerciseEncouragement[exerciseType.toLowerCase()] || generalEncouragement;
  
  // Select random encouragement phrase from the specific list or general list
  const allEncouragementOptions = [...specificEncouragement, ...generalEncouragement];
  const randomEncouragement = allEncouragementOptions[Math.floor(Math.random() * allEncouragementOptions.length)];
  
  // Get appropriate completion feedback based on exercise type
  const specificCompletion = exerciseCompletion[exerciseType.toLowerCase()] || [];
  
  // Select random completion phrase from combined list
  const allCompletionOptions = [...specificCompletion, ...generalCompletion];
  const randomCompletion = allCompletionOptions[Math.floor(Math.random() * allCompletionOptions.length)];
  
  // Format the exercise type for better speech
  const formattedExerciseType = exerciseType.toLowerCase()
    .replace('_', ' ')
    .replace('pushup', 'push-up')
    .replace('jumping_jack', 'jumping jack');
  
  if (isComplete) {
    return `${randomCompletion} You completed ${repCount} ${formattedExerciseType} repetitions.`;
  } else if (repCount === 0) {
    // Starting guidance
    return `I'm listening for your ${formattedExerciseType}s. Start when you're ready.`;
  } else if (repCount % 5 === 0) {
    // Milestone encouragement (every 5 reps)
    return `${repCount}! ${progressEncouragement[Math.floor(Math.random() * progressEncouragement.length)]}`;
  } else {
    // Regular counting with encouragement
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
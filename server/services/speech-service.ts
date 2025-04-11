import { speechClient, textToSpeechClient } from '../google-cloud-config';
import { Request, Response } from 'express';
import { protos } from '@google-cloud/speech';

interface TranscriptionResult {
  text: string;
  confidence: number;
  language: string;
}

/**
 * Transcribes audio to text using Google Cloud Speech-to-Text API
 * 
 * @param audioBuffer Audio buffer to transcribe
 * @param languageCode Language code (default: en-US)
 * @param sampleRateHertz Sample rate in Hertz (default: 16000)
 * @returns Transcription result
 */
export async function transcribeAudio(
  audioBuffer: Buffer,
  languageCode: string = 'en-US',
  sampleRateHertz: number = 16000
): Promise<TranscriptionResult> {
  try {
    const audio = {
      content: audioBuffer.toString('base64'),
    };
    
    const encoding = 'LINEAR16';
    const config = {
      encoding: encoding as unknown as protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
      model: 'default',
      useEnhanced: true,
      enableAutomaticPunctuation: true,
    };
    
    const request = {
      audio: audio,
      config: config,
    };

    // Detects speech in the audio file
    const [response] = await speechClient.recognize(request);
    
    if (!response.results || response.results.length === 0) {
      throw new Error('No speech detected in audio');
    }
    
    const transcription = response.results
      .map(result => result.alternatives?.[0]?.transcript || '')
      .join(' ');
      
    const confidence = response.results[0].alternatives?.[0]?.confidence || 0;
    
    return {
      text: transcription,
      confidence,
      language: languageCode
    };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

/**
 * Converts text to speech using Google Cloud Text-to-Speech API
 * 
 * @param text Text to convert to speech
 * @param languageCode Language code (default: en-US)
 * @param voiceName Voice name (default: en-US-Neural2-F)
 * @returns Audio buffer in MP3 format
 */
export async function synthesizeSpeech(
  text: string,
  languageCode: string = 'en-US',
  voiceName: string = 'en-US-Neural2-F'
): Promise<Buffer> {
  try {
    const request = {
      input: { text },
      voice: {
        languageCode,
        name: voiceName,
        ssmlGender: 'FEMALE' as const,
      },
      audioConfig: { audioEncoding: 'MP3' as const },
    };

    const [response] = await textToSpeechClient.synthesizeSpeech(request);
    return Buffer.from(response.audioContent as Buffer);
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
}

/**
 * Detects exercise repetitions from audio
 * This is a simplified implementation for demonstration purposes
 * In a real application, this would use more advanced audio processing
 */
export function detectExerciseReps(audioBuffer: Buffer): number {
  // This is where we would implement rep counting from audio patterns
  // For demo purposes, we'll return a simulated count
  return Math.floor(Math.random() * 10) + 5; // Random count between 5-15
}

// Express route handler for speech-to-text
export async function handleSpeechToText(req: Request, res: Response) {
  try {
    // Check if audio was provided
    if (!req.body.audio) {
      return res.status(400).json({ 
        success: false, 
        message: 'No audio provided' 
      });
    }
    
    // Extract audio data (base64 encoded)
    const audioData = req.body.audio.split(';base64,').pop();
    const audioBuffer = Buffer.from(audioData, 'base64');
    
    // Get language from request if available
    const languageCode = req.body.languageCode || 'en-US';
    const sampleRate = req.body.sampleRate || 16000;
    
    // Transcribe audio
    const result = await transcribeAudio(audioBuffer, languageCode, sampleRate);
    
    // Return transcription results
    return res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred during speech recognition'
    });
  }
}

// Express route handler for text-to-speech
export async function handleTextToSpeech(req: Request, res: Response) {
  try {
    // Check if text was provided
    if (!req.body.text) {
      return res.status(400).json({ 
        success: false, 
        message: 'No text provided' 
      });
    }
    
    // Get parameters from request
    const text = req.body.text;
    const languageCode = req.body.languageCode || 'en-US';
    const voiceName = req.body.voiceName || 'en-US-Neural2-F';
    
    // Generate speech
    const audioBuffer = await synthesizeSpeech(text, languageCode, voiceName);
    
    // Set response headers
    res.set('Content-Type', 'audio/mp3');
    res.set('Content-Disposition', 'attachment; filename=speech.mp3');
    
    // Send audio data
    return res.send(audioBuffer);
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred during speech synthesis'
    });
  }
}
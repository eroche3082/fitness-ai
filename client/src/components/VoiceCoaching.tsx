import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, MicOff, Volume2, Play, Pause, SkipForward, Dumbbell, Activity, RefreshCw } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { apiRequest } from '@/lib/queryClient';

// Exercise types with metadata
const exerciseTypes = [
  { id: 'pushup', name: 'Push-ups', repGoal: 10, restTime: 60, icon: <Dumbbell className="h-5 w-5 text-green-500" /> },
  { id: 'squat', name: 'Squats', repGoal: 15, restTime: 60, icon: <Dumbbell className="h-5 w-5 text-blue-500" /> },
  { id: 'jumping_jack', name: 'Jumping Jacks', repGoal: 30, restTime: 30, icon: <Activity className="h-5 w-5 text-orange-500" /> },
  { id: 'crunch', name: 'Crunches', repGoal: 20, restTime: 45, icon: <Dumbbell className="h-5 w-5 text-purple-500" /> },
  { id: 'generic', name: 'Generic Exercise', repGoal: 12, restTime: 60, icon: <Activity className="h-5 w-5 text-gray-500" /> },
];

// Exercise set state
interface ExerciseSet {
  exerciseType: string;
  repGoal: number;
  repsCompleted: number;
  restTime: number; // in seconds
}

// Define coaching state types
type CoachingState = 'idle' | 'recording' | 'processing' | 'resting' | 'completed';

export default function VoiceCoaching() {
  const { user } = useUser();
  const [coachingState, setCoachingState] = useState<CoachingState>('idle');
  const [selectedExercise, setSelectedExercise] = useState('pushup');
  const [repCount, setRepCount] = useState(0);
  const [voiceMessage, setVoiceMessage] = useState<string>('Select an exercise to begin.');
  const [sensitivity, setSensitivity] = useState(60); // 0-100 scale
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Audio processing
  const audioContext = useRef<AudioContext | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  
  // Setup audio element for playback
  useEffect(() => {
    audioElement.current = new Audio();
    
    return () => {
      if (audioElement.current) {
        audioElement.current.pause();
        audioElement.current.src = '';
      }
    };
  }, []);
  
  // Handle rest timer countdown
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (coachingState === 'resting' && restTimer > 0) {
      timerId = setTimeout(() => {
        setRestTimer(restTimer - 1);
        
        // Provide voice feedback at certain intervals
        if (restTimer === 30 || restTimer === 15 || restTimer === 5) {
          speakText(`${restTimer} seconds remaining.`);
        }
      }, 1000);
    } else if (coachingState === 'resting' && restTimer === 0) {
      // Rest period completed, prepare for next set
      speakText('Rest complete. Ready for the next set.');
      setCoachingState('idle');
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [coachingState, restTimer]);
  
  // Initialize workout sets
  const initializeWorkout = () => {
    setError(null);
    
    const exercise = exerciseTypes.find(ex => ex.id === selectedExercise);
    if (!exercise) return;
    
    // Create 3 sets of the selected exercise
    const sets: ExerciseSet[] = Array(3).fill(null).map(() => ({
      exerciseType: exercise.id,
      repGoal: exercise.repGoal,
      repsCompleted: 0,
      restTime: exercise.restTime
    }));
    
    setExerciseSets(sets);
    setCurrentSetIndex(0);
    setCoachingState('idle');
    setRepCount(0);
    
    // Initial voice guidance
    speakText(`Starting ${exercise.name} workout. You'll do 3 sets of ${exercise.repGoal} repetitions each. Select Start when ready.`);
  };
  
  // Start recording for rep counting
  const startRecording = async () => {
    try {
      setError(null);
      
      // Initialize audio context if needed
      if (!audioContext.current) {
        audioContext.current = new AudioContext();
      }
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup media recorder
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      // Collect audio data
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      
      // Process audio when recording stops
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await processAudioForRepCounting(audioBlob);
      };
      
      // Start recording
      mediaRecorder.current.start(1000); // Capture in 1-second chunks
      setCoachingState('recording');
      
      // Say a starting message
      speakText(`Starting ${exerciseTypes.find(ex => ex.id === selectedExercise)?.name || 'exercise'}. I'll count your reps.`);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setError(`Microphone access denied or error: ${(error as Error).message}`);
      setCoachingState('idle');
    }
  };
  
  // Stop recording and process audio
  const stopRecording = async () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      setCoachingState('processing');
      mediaRecorder.current.stop();
      
      // Stop all tracks in the stream
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  // Process audio for rep counting
  const processAudioForRepCounting = async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        // Remove the data URL prefix (e.g., data:audio/wav;base64,)
        const base64Audio = base64data.split(',')[1];
        
        // Current exercise
        const exerciseType = selectedExercise;
        const normalizedSensitivity = sensitivity / 100; // Convert from 0-100 to 0-1
        
        // Call the API
        const response = await apiRequest('/api/voice-coaching/rep-counting', {
          method: 'POST',
          body: JSON.stringify({
            audioData: base64Audio,
            exerciseType,
            sensitivity: normalizedSensitivity,
            userId: user?.id
          })
        });
        
        if (response.repCount !== undefined) {
          // Update rep count
          setRepCount(response.repCount);
          
          // Update the current set
          const updatedSets = [...exerciseSets];
          updatedSets[currentSetIndex].repsCompleted = response.repCount;
          setExerciseSets(updatedSets);
          
          // Check if set is complete
          const currentSet = updatedSets[currentSetIndex];
          if (response.repCount >= currentSet.repGoal) {
            completeSet();
          } else {
            setCoachingState('idle');
          }
          
          // Play the coaching response
          if (response.audioResponse) {
            playAudioBase64(response.audioResponse);
          } else {
            speakText(response.coachingResponse || `You completed ${response.repCount} reps.`);
          }
        }
      };
    } catch (error) {
      console.error('Error processing audio for rep counting:', error);
      setError(`Error counting reps: ${(error as Error).message}`);
      setCoachingState('idle');
    }
  };
  
  // Complete the current set
  const completeSet = () => {
    // Check if this was the last set
    if (currentSetIndex === exerciseSets.length - 1) {
      // Workout complete
      setCoachingState('completed');
      speakText('Congratulations! You\'ve completed all sets. Great workout!');
    } else {
      // Start rest period
      setCoachingState('resting');
      const nextRestTime = exerciseSets[currentSetIndex].restTime;
      setRestTimer(nextRestTime);
      speakText(`Great job! Set complete. Take a ${nextRestTime} second rest.`);
      
      // Prepare for next set
      setCurrentSetIndex(currentSetIndex + 1);
    }
  };
  
  // Skip the current set
  const skipSet = () => {
    if (currentSetIndex < exerciseSets.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
      setRepCount(0);
      setCoachingState('idle');
      speakText('Skipping to next set. Select Start when ready.');
    } else {
      // No more sets to skip to
      speakText('This is the last set. Complete it or finish the workout.');
    }
  };
  
  // Reset the workout
  const resetWorkout = () => {
    // Stop any active recording
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
    
    setExerciseSets([]);
    setCurrentSetIndex(0);
    setCoachingState('idle');
    setRepCount(0);
    setRestTimer(0);
    setError(null);
    speakText('Workout reset. Select an exercise to begin again.');
  };
  
  // Speak text using the Web Speech API (fallback if TTS API fails)
  const speakText = async (text: string) => {
    // Store the message in state for UI display
    setVoiceMessage(text);
    
    try {
      // Call our TTS API
      const response = await apiRequest('/api/voice-coaching/response', {
        method: 'POST',
        body: JSON.stringify({
          text,
          languageCode: 'en-US',
          voiceName: 'en-US-Neural2-F',
        })
      });
      
      if (response.audioResponse) {
        playAudioBase64(response.audioResponse);
        return;
      }
    } catch (error) {
      console.error('Error using TTS API, falling back to Web Speech API:', error);
    }
    
    // Fallback: Use browser's speech synthesis if available
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Play base64 audio
  const playAudioBase64 = (base64Audio: string) => {
    if (!audioElement.current) return;
    
    const audioSrc = `data:audio/mp3;base64,${base64Audio}`;
    audioElement.current.src = audioSrc;
    audioElement.current.play().catch(err => {
      console.error('Error playing audio:', err);
    });
  };
  
  // Calculate progress percentage for current set
  const calculateProgress = (): number => {
    if (exerciseSets.length === 0 || currentSetIndex >= exerciseSets.length) return 0;
    
    const currentSet = exerciseSets[currentSetIndex];
    return Math.min(100, (repCount / currentSet.repGoal) * 100);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice Coaching
        </CardTitle>
        <CardDescription>
          Get real-time voice coaching and rep counting for your workouts
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Exercise Selection */}
        <div className="space-y-2">
          <Label htmlFor="exercise-select">Select Exercise</Label>
          <Select
            value={selectedExercise}
            onValueChange={(value) => setSelectedExercise(value)}
            disabled={coachingState !== 'idle' || exerciseSets.length > 0}
          >
            <SelectTrigger id="exercise-select" className="w-full">
              <SelectValue placeholder="Select an exercise" />
            </SelectTrigger>
            <SelectContent>
              {exerciseTypes.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  <div className="flex items-center gap-2">
                    {exercise.icon}
                    <span>{exercise.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Sensitivity Adjustment */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sensitivity">Detection Sensitivity</Label>
            <span className="text-sm text-muted-foreground">{sensitivity}%</span>
          </div>
          <Slider
            id="sensitivity"
            min={10}
            max={100}
            step={5}
            defaultValue={[60]}
            value={[sensitivity]}
            onValueChange={(values) => setSensitivity(values[0])}
            disabled={coachingState !== 'idle'}
          />
          <p className="text-xs text-muted-foreground">
            Higher sensitivity may detect more subtle movements but can cause false positives
          </p>
        </div>
        
        {/* Exercise Progress */}
        {exerciseSets.length > 0 && (
          <div className="space-y-4">
            {/* Set Information */}
            <div className="flex justify-between">
              <Badge variant="outline">
                Set {currentSetIndex + 1} of {exerciseSets.length}
              </Badge>
              <Badge variant="secondary">
                {exerciseTypes.find(ex => ex.id === selectedExercise)?.name || 'Exercise'}
              </Badge>
            </div>
            
            {/* Rep Counter */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-4xl font-bold">
                {repCount} / {exerciseSets[currentSetIndex]?.repGoal || 0}
              </div>
              <div className="text-sm text-muted-foreground">Repetitions</div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={calculateProgress()} className="h-2" />
              <div className="text-xs text-muted-foreground text-right">
                {Math.round(calculateProgress())}% complete
              </div>
            </div>
            
            {/* Voice Message */}
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm italic">"{voiceMessage}"</p>
            </div>
            
            {/* Rest Timer */}
            {coachingState === 'resting' && (
              <div className="flex flex-col items-center space-y-2 p-4 border rounded-md">
                <div className="text-lg font-medium">Rest Period</div>
                <div className="text-3xl font-bold">{restTimer}s</div>
                <div className="text-sm text-muted-foreground">
                  Next set will begin after rest
                </div>
              </div>
            )}
          </div>
        )}
        
        {coachingState === 'completed' && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Workout Complete!</h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              Great job! You've completed all your sets.
            </p>
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={resetWorkout}>
                Start New Workout
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="space-x-2">
          {exerciseSets.length === 0 ? (
            <Button onClick={initializeWorkout} disabled={coachingState !== 'idle'}>
              Start Workout
            </Button>
          ) : (
            <>
              {coachingState === 'idle' && (
                <Button onClick={startRecording}>
                  <Mic className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}
              
              {coachingState === 'recording' && (
                <Button variant="destructive" onClick={stopRecording}>
                  <MicOff className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              )}
              
              {coachingState === 'processing' && (
                <Button disabled>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </Button>
              )}
            </>
          )}
        </div>
        
        <div className="space-x-2">
          {exerciseSets.length > 0 && coachingState !== 'completed' && (
            <>
              <Button 
                variant="outline" 
                onClick={skipSet}
                disabled={coachingState === 'recording' || coachingState === 'processing' || coachingState === 'resting'}
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Skip Set
              </Button>
              
              <Button 
                variant="secondary" 
                onClick={resetWorkout}
              >
                Reset
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
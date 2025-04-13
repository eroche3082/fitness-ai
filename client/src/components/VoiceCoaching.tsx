import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Mic, MicOff, Volume2, Play, Pause, SkipForward, Dumbbell, 
  Activity, RefreshCw, BarChart, Timer, Award, Flame,
  CheckCircle, ListChecks, Vibrate
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { apiRequest } from '@/lib/queryClient';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Enhanced exercise types with metadata
const exerciseTypes = [
  { 
    id: 'pushup', 
    name: 'Push-ups', 
    repGoal: 10, 
    restTime: 60, 
    icon: <Dumbbell className="h-5 w-5 text-green-500" />,
    description: 'Builds chest, shoulder, and tricep strength',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    difficulty: 'Moderate',
    formTips: [
      'Keep your back straight',
      'Lower chest to ground',
      'Fully extend arms at top'
    ]
  },
  { 
    id: 'squat', 
    name: 'Squats', 
    repGoal: 15, 
    restTime: 60, 
    icon: <Dumbbell className="h-5 w-5 text-blue-500" />,
    description: 'Strengthens lower body and core',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Glutes'],
    difficulty: 'Moderate',
    formTips: [
      'Keep weight in heels',
      'Lower until thighs are parallel to floor',
      'Keep chest up and back straight'
    ]
  },
  { 
    id: 'jumping_jack', 
    name: 'Jumping Jacks', 
    repGoal: 30, 
    restTime: 30, 
    icon: <Activity className="h-5 w-5 text-orange-500" />,
    description: 'Full-body cardio exercise',
    muscleGroups: ['Shoulders', 'Hips', 'Cardiovascular'],
    difficulty: 'Easy',
    formTips: [
      'Fully extend arms and legs',
      'Land softly on feet',
      'Maintain consistent rhythm'
    ]
  },
  { 
    id: 'crunch', 
    name: 'Crunches', 
    repGoal: 20, 
    restTime: 45, 
    icon: <Dumbbell className="h-5 w-5 text-purple-500" />,
    description: 'Targets abdominal muscles',
    muscleGroups: ['Abs', 'Core'],
    difficulty: 'Easy',
    formTips: [
      'Focus on contracting abs',
      'Keep neck relaxed',
      'Breathe out on the way up'
    ]
  },
  { 
    id: 'generic', 
    name: 'Generic Exercise', 
    repGoal: 12, 
    restTime: 60, 
    icon: <Activity className="h-5 w-5 text-gray-500" />,
    description: 'Custom exercise for any movement',
    muscleGroups: ['Full Body'],
    difficulty: 'Varies',
    formTips: [
      'Focus on proper form',
      'Maintain consistent pace',
      'Complete full range of motion'
    ]
  },
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
              <div className="text-6xl font-bold text-primary">
                {repCount} <span className="text-2xl text-muted-foreground">/ {exerciseSets[currentSetIndex]?.repGoal || 0}</span>
              </div>
              <div className="text-sm text-muted-foreground">Repetitions</div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={calculateProgress()} className="h-3" 
                       style={{
                         background: calculateProgress() < 30 ? '#f3f4f6' : 
                                    calculateProgress() < 70 ? '#dbeafe' : 
                                    '#dcfce7'
                       }}
              />
              <div className="flex justify-between text-xs">
                <span>0</span>
                <span className="font-medium">{Math.round(calculateProgress())}% complete</span>
                <span>{exerciseSets[currentSetIndex]?.repGoal || 0}</span>
              </div>
            </div>
            
            {/* Exercise Info Card */}
            <div className="p-3 border rounded-md bg-card">
              <div className="flex justify-between mb-2">
                <h4 className="font-medium flex items-center gap-1">
                  {exerciseTypes.find(ex => ex.id === selectedExercise)?.icon}
                  {exerciseTypes.find(ex => ex.id === selectedExercise)?.name}
                </h4>
                <Badge variant={coachingState === 'recording' ? "destructive" : "outline"}>
                  {coachingState === 'recording' ? 'Recording' : 
                   coachingState === 'processing' ? 'Processing' : 
                   coachingState === 'resting' ? 'Resting' : 'Ready'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {exerciseTypes.find(ex => ex.id === selectedExercise)?.description}
              </p>
              
              {/* Form Visualization - Animated SVG guidance */}
              <div className="bg-muted/30 rounded-md p-2 mb-2 border border-muted">
                <h5 className="text-xs font-medium mb-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Proper Form Guide
                </h5>
                <div className="relative h-20 overflow-hidden rounded">
                  {selectedExercise === 'pushup' && (
                    <div className="flex justify-center h-full items-center">
                      <div className="relative w-16 h-6 bg-primary/10 rounded">
                        <div className="absolute left-0 w-3 h-4 bg-primary/20 rounded-sm animate-[bounce_2s_ease-in-out_infinite]" 
                             style={{transformOrigin: 'bottom left'}} />
                        <div className="absolute right-0 w-3 h-4 bg-primary/20 rounded-sm animate-[bounce_2s_ease-in-out_infinite]"
                             style={{transformOrigin: 'bottom right'}} />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-primary/50 rounded-full" />
                      </div>
                    </div>
                  )}
                  {selectedExercise === 'squat' && (
                    <div className="flex justify-center h-full items-center">
                      <div className="relative w-6 h-14">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary/30 rounded-full" />
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-primary/20"
                             style={{animation: 'squatMove 2s ease-in-out infinite'}} />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-primary/20 rounded-sm animate-[squatLeg_2s_ease-in-out_infinite]" />
                        <style jsx>{`
                          @keyframes squatMove {
                            0%, 100% { transform: translateY(0) translateX(-50%); }
                            50% { transform: translateY(3px) translateX(-50%); }
                          }
                          @keyframes squatLeg {
                            0%, 100% { transform: translateX(-50%) scaleY(1); }
                            50% { transform: translateX(-50%) scaleY(0.6); }
                          }
                        `}</style>
                      </div>
                    </div>
                  )}
                  {selectedExercise === 'jumping_jack' && (
                    <div className="flex justify-center h-full items-center">
                      <div className="relative h-16 w-10">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary/30 rounded-full" />
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-1 h-5 bg-primary/20" />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rotate-45 w-1 h-6 bg-primary/20 animate-[jumpingJackLeg1_1s_ease-in-out_infinite]" 
                             style={{transformOrigin: 'top center'}} />
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 -rotate-45 w-1 h-6 bg-primary/20 animate-[jumpingJackLeg2_1s_ease-in-out_infinite]"
                             style={{transformOrigin: 'top center'}} />
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 rotate-45 w-1 h-5 bg-primary/20 animate-[jumpingJackArm1_1s_ease-in-out_infinite]"
                             style={{transformOrigin: 'top center'}} />
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 -rotate-45 w-1 h-5 bg-primary/20 animate-[jumpingJackArm2_1s_ease-in-out_infinite]"
                             style={{transformOrigin: 'top center'}} />
                        <style jsx>{`
                          @keyframes jumpingJackLeg1 {
                            0%, 100% { transform: translateX(-50%) rotate(20deg); }
                            50% { transform: translateX(-50%) rotate(45deg); }
                          }
                          @keyframes jumpingJackLeg2 {
                            0%, 100% { transform: translateX(-50%) rotate(-20deg); }
                            50% { transform: translateX(-50%) rotate(-45deg); }
                          }
                          @keyframes jumpingJackArm1 {
                            0%, 100% { transform: translateX(-50%) rotate(20deg); }
                            50% { transform: translateX(-50%) rotate(80deg); }
                          }
                          @keyframes jumpingJackArm2 {
                            0%, 100% { transform: translateX(-50%) rotate(-20deg); }
                            50% { transform: translateX(-50%) rotate(-80deg); }
                          }
                        `}</style>
                      </div>
                    </div>
                  )}
                  {selectedExercise === 'crunch' && (
                    <div className="flex justify-center h-full items-center">
                      <div className="relative w-14 h-5 bg-primary/10 rounded">
                        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary/20 rounded-full animate-[crunchMove_2s_ease-in-out_infinite]" />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-primary/50 rounded-full" />
                        <style jsx>{`
                          @keyframes crunchMove {
                            0%, 100% { transform: translate(-50%, -50%); }
                            50% { transform: translate(-50%, 30%); }
                          }
                        `}</style>
                      </div>
                    </div>
                  )}
                  {selectedExercise === 'generic' && (
                    <div className="flex justify-center h-full items-center">
                      <p className="text-xs text-muted-foreground italic">Select a specific exercise to see form guidance</p>
                    </div>
                  )}
                </div>
                <div className="mt-1">
                  <h6 className="text-xs font-medium">Form Tips:</h6>
                  <ul className="list-disc text-xs pl-4 text-muted-foreground pt-1 space-y-0.5">
                    {exerciseTypes.find(ex => ex.id === selectedExercise)?.formTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  <span>Rest between sets: {exerciseTypes.find(ex => ex.id === selectedExercise)?.restTime}s</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  <span>Difficulty: {exerciseTypes.find(ex => ex.id === selectedExercise)?.difficulty}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {exerciseTypes.find(ex => ex.id === selectedExercise)?.muscleGroups.map(muscle => (
                    <Badge key={muscle} variant="secondary" className="text-xs py-0">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Voice Coach Message */}
            <div className="rounded-md bg-primary/5 p-3 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Volume2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Voice Coach Says:</span>
              </div>
              <p className="text-sm italic">"{voiceMessage}"</p>
            </div>
            
            {/* Rest Timer */}
            {coachingState === 'resting' && (
              <div className="flex flex-col items-center space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-blue-500" />
                  <div className="text-lg font-medium text-blue-700 dark:text-blue-300">Rest Period</div>
                </div>
                
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#e0e7ff" 
                      strokeWidth="8" 
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="45" 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="8" 
                      strokeDasharray="283" 
                      strokeDashoffset={283 * (1 - restTimer / exerciseSets[currentSetIndex - 1]?.restTime)} 
                      strokeLinecap="round" 
                      transform="rotate(-90 50 50)" 
                    />
                  </svg>
                  <div className="absolute text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {restTimer}
                  </div>
                </div>
                
                <div className="text-sm text-blue-600 dark:text-blue-300">
                  Next set will begin after rest
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-blue-500 flex items-center gap-1 bg-blue-100 dark:bg-blue-800/30 px-3 py-1 rounded-full">
                        <Vibrate className="h-3 w-3" />
                        <span>Recovery tips</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1 max-w-xs">
                        <p className="font-medium">Effective Rest Period Tips:</p>
                        <ul className="text-xs space-y-1 list-disc pl-4">
                          <li>Take deep breaths to stabilize heart rate</li>
                          <li>Gently stretch the muscles you just worked</li>
                          <li>Stay hydrated with small sips of water</li>
                          <li>Maintain good posture while resting</li>
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        )}
        
        {coachingState === 'completed' && (
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-md border border-green-200 dark:border-green-800">
            <div className="flex flex-col items-center mb-4">
              <div className="bg-green-100 dark:bg-green-800/50 rounded-full p-2 mb-2">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">Workout Complete!</h3>
              <p className="text-sm text-green-600 dark:text-green-400 text-center mt-1">
                Great job! You've successfully completed all your sets.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white dark:bg-green-800/20 rounded-md p-3 border border-green-100 dark:border-green-800 flex flex-col items-center">
                <ListChecks className="h-5 w-5 text-green-500 mb-1" />
                <div className="text-lg font-semibold">{exerciseSets.length}</div>
                <div className="text-xs text-muted-foreground text-center">Sets Completed</div>
              </div>
              
              <div className="bg-white dark:bg-green-800/20 rounded-md p-3 border border-green-100 dark:border-green-800 flex flex-col items-center">
                <Flame className="h-5 w-5 text-orange-500 mb-1" />
                <div className="text-lg font-semibold">
                  {exerciseSets.reduce((total, set) => total + set.repsCompleted, 0)}
                </div>
                <div className="text-xs text-muted-foreground text-center">Total Reps</div>
              </div>
              
              <div className="bg-white dark:bg-green-800/20 rounded-md p-3 border border-green-100 dark:border-green-800 flex flex-col items-center">
                <BarChart className="h-5 w-5 text-blue-500 mb-1" />
                <div className="text-lg font-semibold">
                  {Math.round(exerciseSets.reduce((avg, set) => avg + (set.repsCompleted / set.repGoal * 100), 0) / exerciseSets.length)}%
                </div>
                <div className="text-xs text-muted-foreground text-center">Goal Achievement</div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-green-800/10 rounded-md p-3 border border-green-100 dark:border-green-800 mb-4">
              <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Workout Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Exercise Type:</span>
                  <span className="font-medium">{exerciseTypes.find(ex => ex.id === selectedExercise)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Muscles Worked:</span>
                  <span className="font-medium">{exerciseTypes.find(ex => ex.id === selectedExercise)?.muscleGroups.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Reps Per Set:</span>
                  <span className="font-medium">
                    {Math.round(exerciseSets.reduce((total, set) => total + set.repsCompleted, 0) / exerciseSets.length)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button variant="default" onClick={resetWorkout}>
                <Play className="h-4 w-4 mr-2" />
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
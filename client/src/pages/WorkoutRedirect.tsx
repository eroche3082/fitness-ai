import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Loader2, PlayCircle, Award, Dumbbell, Clock } from 'lucide-react';

// Define exercise type
interface Exercise {
  name: string;
  sets: number;
  reps?: number;
  duration?: string;
  rest: number;
  video: string;
}

// Define workout type
interface WorkoutData {
  name: string;
  description: string;
  exercises: Exercise[];
}

// Define workouts object with proper type
interface WorkoutsMap {
  [key: string]: WorkoutData;
}

// Workout types by level
const workouts: WorkoutsMap = {
  'BEG': {
    name: 'Beginner Program',
    description: 'A starter workout program perfect for beginners',
    exercises: [
      { name: 'Body Weight Squats', sets: 3, reps: 10, rest: 60, video: 'https://www.youtube.com/embed/aclHkVaku9U' },
      { name: 'Push-ups (or Modified Push-ups)', sets: 3, reps: 8, rest: 60, video: 'https://www.youtube.com/embed/IODxDxX7oi4' },
      { name: 'Plank', sets: 3, duration: '30 seconds', rest: 60, video: 'https://www.youtube.com/embed/pSHjTRCQxIw' },
      { name: 'Walking Lunges', sets: 2, reps: 10, rest: 60, video: 'https://www.youtube.com/embed/3XDriUn0udo' },
      { name: 'Seated Rows with Resistance Band', sets: 3, reps: 12, rest: 60, video: 'https://www.youtube.com/embed/xQNrFHEMhI4' }
    ]
  },
  'ADV': {
    name: 'Advanced Full-Body Program',
    description: 'A challenging workout for experienced fitness enthusiasts',
    exercises: [
      { name: 'Barbell Squats', sets: 4, reps: 8, rest: 90, video: 'https://www.youtube.com/embed/ultWZbUMPL8' },
      { name: 'Pull-ups', sets: 4, reps: 8, rest: 90, video: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
      { name: 'Bench Press', sets: 4, reps: 8, rest: 90, video: 'https://www.youtube.com/embed/SCVCLChPQFY' },
      { name: 'Deadlifts', sets: 4, reps: 6, rest: 120, video: 'https://www.youtube.com/embed/op9kVnSso6Q' },
      { name: 'Overhead Press', sets: 3, reps: 8, rest: 90, video: 'https://www.youtube.com/embed/2yjwXTZQDDI' },
      { name: 'Plank with Shoulder Taps', sets: 3, duration: '45 seconds', rest: 60, video: 'https://www.youtube.com/embed/QOCn3_iOAro' }
    ]
  },
  'VIP': {
    name: 'Elite Performance Program',
    description: 'Our premium program with advanced techniques for maximum results',
    exercises: [
      { name: 'Bulgarian Split Squats', sets: 4, reps: 10, rest: 90, video: 'https://www.youtube.com/embed/2C-uNgKwPLE' },
      { name: 'Weighted Pull-ups', sets: 4, reps: 6, rest: 90, video: 'https://www.youtube.com/embed/v_b0L2MFGkA' },
      { name: 'Dumbbell Bench Press', sets: 4, reps: 8, rest: 75, video: 'https://www.youtube.com/embed/VmB1G1K7v94' },
      { name: 'Barbell Hip Thrusts', sets: 4, reps: 12, rest: 90, video: 'https://www.youtube.com/embed/Zp26q4BY5HE' },
      { name: 'Kettlebell Swings', sets: 3, reps: 15, rest: 60, video: 'https://www.youtube.com/embed/YSxHifyI6s8' },
      { name: 'TRX Row', sets: 3, reps: 12, rest: 60, video: 'https://www.youtube.com/embed/XZV9IwluPjw' },
      { name: 'Hanging Leg Raises', sets: 3, reps: 12, rest: 60, video: 'https://www.youtube.com/embed/Pr1ieGZ5atk' }
    ]
  }
};

const WorkoutRedirect: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState<WorkoutData | null>(null);
  const [videoPlaying, setVideoPlaying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse the URL to get the workout code
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');
    
    if (!code) {
      setError('No workout code provided');
      setLoading(false);
      return;
    }
    
    // Format: FIT-[LEVEL]-[NUMBER]
    const parts = code.split('-');
    if (parts.length !== 3 || parts[0] !== 'FIT') {
      setError('Invalid workout code format');
      setLoading(false);
      return;
    }
    
    const level = parts[1];
    
    // Check if we have a workout for this level
    if (!workouts[level]) {
      setError(`No workout found for level: ${level}`);
      setLoading(false);
      return;
    }
    
    // Simulate loading data
    setTimeout(() => {
      setWorkout(workouts[level]);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 text-green-500 animate-spin mb-4" />
        <h1 className="text-2xl font-bold mb-2">Loading Your Workout</h1>
        <p className="text-gray-400">Please wait while we prepare your personalized training session</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/30 flex items-center justify-center">
            <Dumbbell className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Workout Not Found</h1>
          <p className="text-gray-400 mb-8">{error}</p>
          <Button 
            className="bg-green-500 text-black hover:bg-green-600"
            onClick={() => setLocation('/')}
          >
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (!workout) {
    return null; // Typescript safety check
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="bg-gradient-to-b from-green-900/20 to-transparent py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{workout.name}</h1>
          <p className="text-xl text-gray-300 mb-8">{workout.description}</p>
          <div className="flex items-center gap-2 text-green-500 mb-8">
            <Award className="h-5 w-5" />
            <span>Fitness AI Verified Workout</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-6">
          {workout.exercises.map((exercise: Exercise, index: number) => (
            <div key={index} className="border border-gray-800 rounded-lg p-6 bg-gray-900/30">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{exercise.name}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-green-500">{exercise.sets}</span> sets
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-500">{exercise.reps || exercise.duration}</span> {exercise.reps ? 'reps' : ''}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>{exercise.rest}s rest</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                  onClick={() => setVideoPlaying(exercise.video)}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Watch Exercise
                </Button>
              </div>

              {videoPlaying === exercise.video && (
                <div className="mt-4 aspect-video rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={exercise.video}
                    title={exercise.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            className="bg-green-500 text-black hover:bg-green-600 px-8 py-6 text-lg"
            onClick={() => alert('Training session started!')}
          >
            Start Workout Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutRedirect;
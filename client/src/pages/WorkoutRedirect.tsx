import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Clock, 
  FlameIcon, 
  Play, 
  Dumbbell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Define workout types (same as in workout pages)
interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  videoUrl: string;
  thumbnail: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  calories: number;
}

interface Workout {
  id: string;
  title: string;
  description: string;
  level: string;
  type: string;
  duration: number;
  calories: number;
  exercises: Exercise[];
  thumbnail: string;
  qrCode: string;
  featured: boolean;
  tags: string[];
}

// Mock data for workouts (same as in workout pages)
const workouts: Workout[] = [
  {
    id: 'w1',
    title: 'Full Body Strength',
    description: 'A comprehensive full-body workout targeting all major muscle groups for balanced strength development.',
    level: 'advanced',
    type: 'strength',
    duration: 45,
    calories: 450,
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29ya291dHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    qrCode: 'FIT-ADV-4287',
    featured: true,
    tags: ['strength', 'full-body', 'barbell'],
    exercises: [
      {
        id: 'e1',
        name: 'Barbell Squats',
        description: 'A compound exercise that builds strength in the legs, core, and lower back.',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core'],
        equipment: ['barbell', 'squat rack'],
        videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8',
        thumbnail: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3F1YXRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        duration: 8,
        difficulty: 'intermediate',
        calories: 80
      },
      {
        id: 'e2',
        name: 'Deadlifts',
        description: 'A compound movement that targets the posterior chain and builds overall strength.',
        muscleGroups: ['hamstrings', 'glutes', 'lower back', 'traps'],
        equipment: ['barbell'],
        videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q',
        thumbnail: 'https://images.unsplash.com/photo-1598971639058-bb01300d0b3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVhZGxpZnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        duration: 8,
        difficulty: 'advanced',
        calories: 100
      },
      {
        id: 'e3',
        name: 'Bench Press',
        description: 'The king of chest exercises, building upper body pushing strength.',
        muscleGroups: ['chest', 'triceps', 'shoulders'],
        equipment: ['bench', 'barbell'],
        videoUrl: 'https://www.youtube.com/embed/SCVCLChPQFY',
        thumbnail: 'https://images.unsplash.com/photo-1597452485677-d661670d9640?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVuY2glMjBwcmVzc3xlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=500&q=60',
        duration: 7,
        difficulty: 'intermediate',
        calories: 70
      },
      {
        id: 'e4',
        name: 'Pull-ups',
        description: 'A bodyweight exercise that builds a strong back and biceps.',
        muscleGroups: ['lats', 'biceps', 'upper back'],
        equipment: ['pull-up bar'],
        videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
        thumbnail: 'https://images.unsplash.com/photo-1598266320474-5e154ffc9771?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVsbCUyMHVwfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        duration: 6,
        difficulty: 'advanced',
        calories: 60
      }
    ]
  },
  {
    id: 'w2',
    title: 'Beginner Fitness Fundamentals',
    description: 'Perfect for those just starting their fitness journey with essential movement patterns.',
    level: 'beginner',
    type: 'bodyweight',
    duration: 30,
    calories: 280,
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVnaW5uZXIlMjBmaXRuZXNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    qrCode: 'FIT-BEG-2748',
    featured: false,
    tags: ['beginner', 'bodyweight', 'fundamentals'],
    exercises: [
      {
        id: 'e5',
        name: 'Body Weight Squats',
        description: 'A fundamental movement pattern for building leg strength without equipment.',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
        equipment: ['none'],
        videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
        thumbnail: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9keXdlaWdodCUyMHNxdWF0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        duration: 5,
        difficulty: 'beginner',
        calories: 50
      },
      {
        id: 'e6',
        name: 'Push-ups',
        description: 'The classic upper body exercise for building chest, shoulder and arm strength.',
        muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
        equipment: ['none'],
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
        thumbnail: 'https://images.unsplash.com/photo-1598971639058-bb01300d0b3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVzaHVwc3xlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=500&q=60',
        duration: 5,
        difficulty: 'beginner',
        calories: 40
      },
      {
        id: 'e7',
        name: 'Plank',
        description: 'An isometric core exercise that builds stability and strength.',
        muscleGroups: ['core', 'shoulders', 'back'],
        equipment: ['none'],
        videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw',
        thumbnail: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGxhbmt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        duration: 3,
        difficulty: 'beginner',
        calories: 30
      }
    ]
  },
  {
    id: 'w3',
    title: 'Elite Performance Training',
    description: 'Advanced training methods for experienced athletes looking to push their limits.',
    level: 'expert',
    type: 'athletic',
    duration: 60,
    calories: 650,
    thumbnail: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZWxpdGUlMjBhdGhsZXRlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    qrCode: 'FIT-VIP-9872',
    featured: true,
    tags: ['advanced', 'athletic', 'performance'],
    exercises: [
      {
        id: 'e8',
        name: 'Bulgarian Split Squats',
        description: 'An advanced unilateral leg exercise for building strength and balance.',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings', 'core'],
        equipment: ['bench', 'dumbbells'],
        videoUrl: 'https://www.youtube.com/embed/2C-uNgKwPLE',
        thumbnail: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVsZ2FyaWFuJTIwc3BsaXQlMjBzcXVhdHxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=500&q=60',
        duration: 8,
        difficulty: 'expert',
        calories: 80
      },
      {
        id: 'e9',
        name: 'Weighted Pull-ups',
        description: 'An advanced variation of the pull-up for building serious back strength.',
        muscleGroups: ['lats', 'biceps', 'upper back'],
        equipment: ['pull-up bar', 'weight belt'],
        videoUrl: 'https://www.youtube.com/embed/v_b0L2MFGkA',
        thumbnail: 'https://images.unsplash.com/photo-1598266320474-5e154ffc9771?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VpZ2h0ZWQlMjBwdWxsJTIwdXB8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        duration: 7,
        difficulty: 'expert',
        calories: 85
      },
      {
        id: 'e10',
        name: 'Kettlebell Swings',
        description: 'A dynamic hip-hinge movement for building power and endurance.',
        muscleGroups: ['glutes', 'hamstrings', 'back', 'shoulders'],
        equipment: ['kettlebell'],
        videoUrl: 'https://www.youtube.com/embed/YSxHifyI6s8',
        thumbnail: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2V0dGxlYmVsbCUyMHN3aW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        duration: 6,
        difficulty: 'advanced',
        calories: 75
      }
    ]
  }
];

// Función para procesar el código QR y determinar el tipo de entrenamiento
const getWorkoutByCode = (code: string): Workout | null => {
  // Busqueda exacta por código QR
  const exactMatch = workouts.find(w => w.qrCode === code);
  if (exactMatch) return exactMatch;
  
  // Procesamiento inteligente de códigos
  if (code.includes('BEG') || code.toLowerCase().includes('beginner')) {
    return workouts.find(w => w.level === 'beginner') || null;
  } else if (code.includes('ADV') || code.toLowerCase().includes('advanced')) {
    return workouts.find(w => w.level === 'advanced') || null;
  } else if (code.includes('VIP') || code.toLowerCase().includes('expert')) {
    return workouts.find(w => w.level === 'expert') || null;
  }
  
  // Si no hay coincidencia, devolver el primero por defecto
  return workouts[0];
};

// Componente principal
const WorkoutRedirect: React.FC = () => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // QR code parameter
  const [, params] = useRoute('/workout');
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');
  
  useEffect(() => {
    // Detect if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Process QR code and find matching workout
    setTimeout(() => {
      if (code) {
        const matchedWorkout = getWorkoutByCode(code);
        setWorkout(matchedWorkout);
        
        if (matchedWorkout) {
          toast({
            title: "Workout Found",
            description: `Loading ${matchedWorkout.title}`,
            variant: "default",
          });
        } else {
          toast({
            title: "Workout Not Found",
            description: "The QR code didn't match any available workout.",
            variant: "destructive",
          });
        }
      }
      
      setLoading(false);
    }, 1000); // Simulando una carga
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [code, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Loading Your Workout</h1>
          <div className="flex flex-col items-center space-y-4 w-full max-w-md">
            <Skeleton className="h-12 w-3/4 bg-gray-800" />
            <Skeleton className="h-6 w-1/2 bg-gray-800" />
            <Skeleton className="h-40 w-full bg-gray-800 rounded-md" />
            <div className="grid grid-cols-2 gap-4 w-full">
              <Skeleton className="h-6 bg-gray-800 rounded" />
              <Skeleton className="h-6 bg-gray-800 rounded" />
            </div>
            <Skeleton className="h-12 w-full bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!workout) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Workout Not Found</h1>
          <p className="text-gray-400 mb-8">
            We couldn't find a workout matching the QR code: <span className="font-mono bg-gray-900 px-2 py-1 rounded">{code || 'No code provided'}</span>
          </p>
          <Button 
            onClick={() => setLocation('/workout-library')}
            className="bg-green-500 text-black hover:bg-green-600"
          >
            Browse Workouts
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Hero Section */}
      <div className="relative h-72">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${workout.thumbnail})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className="bg-green-500 text-black">
                {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
              </Badge>
              <Badge variant="outline" className="border-gray-500 text-gray-300">
                {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-2">{workout.title}</h1>
            <p className="text-lg text-gray-300 mb-4">{workout.description}</p>
            
            <div className="flex flex-wrap gap-6 text-gray-300">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-green-500 mr-2" />
                <span>{workout.duration} minutes</span>
              </div>
              <div className="flex items-center">
                <FlameIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>{workout.calories} calories</span>
              </div>
              <div className="flex items-center">
                <Dumbbell className="h-5 w-5 text-green-500 mr-2" />
                <span>{workout.exercises.length} exercises</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Workout details */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle>Workout Details</CardTitle>
            <CardDescription className="text-gray-400">
              Scanned from QR Code: <span className="font-mono bg-black text-green-500 py-1 px-2 rounded">{workout.qrCode}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">About this workout</h3>
                <p className="text-gray-300">{workout.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {workout.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="border-green-500/30 text-green-400">
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">What to expect</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>{workout.exercises.length} exercises to complete</li>
                  <li>Approximately {workout.duration} minutes to complete</li>
                  <li>You'll burn around {workout.calories} calories</li>
                  <li>Difficulty level: {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-4">
            <Button 
              className="w-full sm:w-auto bg-green-500 text-black hover:bg-green-600"
              onClick={() => setLocation(`/workout-details/${workout.id}`)}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Workout
            </Button>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
              onClick={() => setLocation('/workout-library')}
            >
              Browse Other Workouts
            </Button>
          </CardFooter>
        </Card>
        
        {/* Exercise preview */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Exercise Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workout.exercises.map((exercise, index) => (
              <Card key={exercise.id} className="bg-gray-900 border-gray-800 overflow-hidden flex flex-col">
                <div className="aspect-video relative">
                  <img 
                    src={exercise.thumbnail} 
                    alt={exercise.name} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="flex justify-between items-center">
                      <Badge 
                        className={`${
                          exercise.difficulty === 'beginner' ? 'bg-green-500' :
                          exercise.difficulty === 'intermediate' ? 'bg-yellow-500' :
                          exercise.difficulty === 'advanced' ? 'bg-orange-500' :
                          'bg-red-500'
                        } text-black`}
                      >
                        {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                      </Badge>
                      <div className="flex items-center text-white text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{exercise.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-black bg-opacity-50 p-3">
                      <Play className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </div>
                <CardContent className="flex-grow p-4">
                  <h3 className="font-bold text-lg mb-1">{index + 1}. {exercise.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{exercise.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center">
            <Button 
              className="py-6 px-8 text-lg bg-green-500 text-black hover:bg-green-600"
              onClick={() => setLocation(`/workout-details/${workout.id}`)}
            >
              <Play className="h-5 w-5 mr-3" />
              Start Workout Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutRedirect;
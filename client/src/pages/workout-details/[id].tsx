import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  RefreshCw, 
  Share, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  Dumbbell,
  Heart,
  Printer,
  BarChart2
} from 'lucide-react';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Define workout types (same as in workout-library.tsx)
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

// Mock data for workouts (same as in workout-library.tsx)
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

// Workout Details Component
const WorkoutDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // States
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  
  // Effects
  useEffect(() => {
    // Simulate API call to fetch workout details
    setTimeout(() => {
      const found = workouts.find(w => w.id === params.id);
      if (found) {
        setWorkout(found);
        // Auto-expand first exercise
        setExpandedExercises([found.exercises[0].id]);
      }
      setLoading(false);
    }, 800);
  }, [params.id]);
  
  // Handlers
  const handleExerciseToggle = (exerciseId: string) => {
    setExpandedExercises(prev => 
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };
  
  const handleExerciseComplete = (exerciseId: string) => {
    if (completed.includes(exerciseId)) {
      setCompleted(prev => prev.filter(id => id !== exerciseId));
    } else {
      setCompleted(prev => [...prev, exerciseId]);
      
      // Show toast when exercise is completed
      toast({
        title: 'Exercise completed!',
        description: 'Great job! Keep up the good work.',
        variant: 'default',
      });
      
      // If all exercises are completed, show congratulations
      if (workout && completed.length === workout.exercises.length - 1) {
        setTimeout(() => {
          toast({
            title: 'Workout Completed!',
            description: 'Congratulations on finishing your workout!',
            variant: 'success',
          });
        }, 1000);
      }
    }
  };
  
  const startWorkout = () => {
    setIsPlaying(true);
    toast({
      title: 'Workout Started',
      description: 'Your workout session has begun. Let\'s get moving!',
      variant: 'default',
    });
  };
  
  const pauseWorkout = () => {
    setIsPlaying(false);
  };
  
  const resetWorkout = () => {
    setCurrentExerciseIndex(0);
    setCompleted([]);
    setIsPlaying(false);
    toast({
      title: 'Workout Reset',
      description: 'Your workout progress has been reset.',
      variant: 'default',
    });
  };
  
  const nextExercise = () => {
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setExpandedExercises([workout.exercises[currentExerciseIndex + 1].id]);
    }
  };
  
  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      if (workout) {
        setExpandedExercises([workout.exercises[currentExerciseIndex - 1].id]);
      }
    }
  };
  
  const shareWorkout = () => {
    // In a real application, this would use the Web Share API
    toast({
      title: 'Workout Shared',
      description: 'A link to this workout has been copied to your clipboard.',
      variant: 'default',
    });
  };
  
  const printWorkout = () => {
    window.print();
  };
  
  // If loading, show skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="container mx-auto py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-800 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-800 rounded w-1/2 mb-10"></div>
            
            <div className="aspect-video bg-gray-800 rounded mb-8"></div>
            
            {[1, 2, 3].map(i => (
              <div key={i} className="mb-6">
                <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // If workout not found
  if (!workout) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4">Workout Not Found</h1>
          <p className="text-gray-400 mb-8">
            The workout you're looking for doesn't exist or has been removed.
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
  
  // Current exercise
  const currentExercise = workout.exercises[currentExerciseIndex];
  
  // Completion progress
  const progressPercentage = (completed.length / workout.exercises.length) * 100;
  
  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Hero Section */}
      <div className="relative h-72 md:h-96">
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
              {workout.tags.map(tag => (
                <Badge key={tag} variant="outline" className="border-gray-500 text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{workout.title}</h1>
            <p className="text-xl text-gray-300 mb-4">{workout.description}</p>
            
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Workout player and controls */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800 overflow-hidden mb-8">
              <div className="aspect-video relative">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={currentExercise.videoUrl}
                  title={currentExercise.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{currentExercise.name}</h2>
                    <p className="text-gray-400">{currentExerciseIndex + 1} of {workout.exercises.length}</p>
                  </div>
                  <Badge 
                    className={`${
                      currentExercise.difficulty === 'beginner' ? 'bg-green-500' :
                      currentExercise.difficulty === 'intermediate' ? 'bg-yellow-500' :
                      currentExercise.difficulty === 'advanced' ? 'bg-orange-500' :
                      'bg-red-500'
                    } text-black`}
                  >
                    {currentExercise.difficulty.charAt(0).toUpperCase() + currentExercise.difficulty.slice(1)}
                  </Badge>
                </div>
                
                <p className="text-gray-300 mb-6">{currentExercise.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">MUSCLE GROUPS</p>
                    <div className="flex flex-wrap gap-2">
                      {currentExercise.muscleGroups.map(muscle => (
                        <Badge key={muscle} variant="outline" className="border-green-500/30 text-green-400">
                          {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 mb-1">EQUIPMENT</p>
                    <div className="flex flex-wrap gap-2">
                      {currentExercise.equipment.map(eq => (
                        <Badge key={eq} variant="outline" className="border-gray-500 text-gray-300">
                          {eq.charAt(0).toUpperCase() + eq.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Video controls */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={prevExercise}
                      disabled={currentExerciseIndex === 0}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    
                    {isPlaying ? (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={pauseWorkout}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={startWorkout}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={nextExercise}
                      disabled={currentExerciseIndex === workout.exercises.length - 1}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={resetWorkout}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={shareWorkout}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={printWorkout}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white print:hidden"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold">Workout Progress</h2>
                <p className="text-gray-400">
                  {completed.length} of {workout.exercises.length} exercises completed
                </p>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-gray-800" indicatorClassName="bg-green-500" />
            </div>
            
            <div className="print:block">
              <h2 className="text-xl font-bold mb-4">Workout Plan</h2>
              <div className="space-y-4">
                {workout.exercises.map((exercise, index) => {
                  const isExpanded = expandedExercises.includes(exercise.id);
                  const isComplete = completed.includes(exercise.id);
                  const isCurrent = index === currentExerciseIndex;
                  
                  return (
                    <Card 
                      key={exercise.id} 
                      className={`bg-gray-900 border-gray-800 
                        ${isCurrent ? 'ring-2 ring-green-500 ring-opacity-50' : ''} 
                        ${isComplete ? 'border-green-500/30' : ''}
                      `}
                    >
                      <CardHeader className="p-4 cursor-pointer" onClick={() => handleExerciseToggle(exercise.id)}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-4 text-sm font-medium">
                              {isComplete ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                            <div>
                              <CardTitle className={`text-lg ${isComplete ? 'text-green-500' : 'text-white'}`}>
                                {exercise.name}
                              </CardTitle>
                              <CardDescription className="text-gray-400">
                                {exercise.duration} min • {exercise.calories} cal
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExerciseComplete(exercise.id);
                              }}
                              className={`mr-2 ${isComplete ? 'text-green-500' : 'text-gray-400'}`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentExerciseIndex(index);
                              }}
                              className="text-gray-400 hover:text-white mr-2"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      
                      {isExpanded && (
                        <CardContent className="px-4 pt-0 pb-4">
                          <div className="pl-12">
                            <p className="text-gray-300 mb-3">{exercise.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">MUSCLE GROUPS</p>
                                <div className="flex flex-wrap gap-2">
                                  {exercise.muscleGroups.map(muscle => (
                                    <Badge key={muscle} variant="outline" className="border-green-500/30 text-green-400">
                                      {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-xs text-gray-500 mb-1">EQUIPMENT</p>
                                <div className="flex flex-wrap gap-2">
                                  {exercise.equipment.map(eq => (
                                    <Badge key={eq} variant="outline" className="border-gray-500 text-gray-300">
                                      {eq.charAt(0).toUpperCase() + eq.slice(1)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setCurrentExerciseIndex(index)}
                                className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Watch Video
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleExerciseComplete(exercise.id)}
                                className={`
                                  ${isComplete 
                                    ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-black' 
                                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                                `}
                              >
                                {isComplete ? (
                                  <>
                                    <span className="mr-2">✓</span>
                                    Mark as Incomplete
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Complete
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Right column - Workout stats and QR code */}
          <div>
            <Card className="bg-gray-900 border-gray-800 mb-6 sticky top-4">
              <CardHeader>
                <CardTitle>Start Your Workout</CardTitle>
                <CardDescription>
                  Scan the QR code with your phone to access this workout on any device
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <QRCodeDisplay 
                  code={workout.qrCode} 
                  size={200}
                  foreground="#10b981" // green-500
                  background="#000000"
                />
                <div className="mt-4 text-center">
                  <p className="font-mono bg-black text-green-500 py-1 px-3 rounded text-sm inline-block">
                    {workout.qrCode}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button 
                  className="w-full bg-green-500 text-black hover:bg-green-600 py-6 text-lg"
                  onClick={startWorkout}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Workout
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                  onClick={shareWorkout}
                >
                  <Share className="h-5 w-5 mr-2" />
                  Share Workout
                </Button>
              </CardFooter>
            </Card>
            
            {/* Workout Stats */}
            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardHeader>
                <CardTitle>Workout Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-300">Duration</span>
                  </div>
                  <span className="font-semibold">{workout.duration} minutes</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FlameIcon className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-300">Calories</span>
                  </div>
                  <span className="font-semibold">{workout.calories} cal</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Dumbbell className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-300">Exercises</span>
                  </div>
                  <span className="font-semibold">{workout.exercises.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-300">Intensity</span>
                  </div>
                  <Badge className={`
                    ${workout.level === 'beginner' ? 'bg-green-500' : 
                      workout.level === 'intermediate' ? 'bg-yellow-500' : 
                      workout.level === 'advanced' ? 'bg-orange-500' : 
                      'bg-red-500'} 
                    text-black
                  `}>
                    {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart2 className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-300">Completion</span>
                  </div>
                  <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Related Workouts */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Similar Workouts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workouts
                  .filter(w => w.id !== workout.id && w.tags.some(tag => workout.tags.includes(tag)))
                  .slice(0, 2)
                  .map(w => (
                    <div key={w.id} className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={w.thumbnail} 
                          alt={w.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-white">{w.title}</h3>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{w.duration} min</span>
                          <span className="mx-2">•</span>
                          <Badge className="text-xs" variant="outline">
                            {w.level.charAt(0).toUpperCase() + w.level.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <Link href={`/workout-details/${w.id}`}>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                
                <Link href="/workout-library">
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    Browse All Workouts
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetails;
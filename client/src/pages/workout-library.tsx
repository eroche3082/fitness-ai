import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Play, Clock, FlameIcon, Filter, Search, Activity, Heart, Zap, BarChart } from 'lucide-react';
import QRCodeDisplay from '@/components/QRCodeDisplay';

// Define workout types
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

// Mock data for workouts
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

// Component for displaying a workout
const WorkoutCard: React.FC<{ workout: Workout }> = ({ workout }) => {
  return (
    <Card className="bg-black border border-gray-800 overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-green-500 hover:shadow-xl hover:shadow-green-900/20 group">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={workout.thumbnail} 
          alt={workout.title} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-90"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-black/50 border-green-500 text-green-500">
              {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
            </Badge>
            <div className="flex items-center space-x-2 text-xs text-white">
              <Clock className="w-3 h-3 text-green-500" />
              <span>{workout.duration} min</span>
            </div>
          </div>
        </div>
        
        {workout.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-green-500 text-black hover:bg-green-600">Featured</Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-white text-xl group-hover:text-green-500 transition-colors duration-300">
          {workout.title}
        </CardTitle>
        <CardDescription className="text-gray-400 line-clamp-2">
          {workout.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {workout.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="bg-gray-900 text-gray-300 hover:bg-gray-800">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <div className="flex items-center">
            <Dumbbell className="w-4 h-4 mr-1 text-green-500" />
            <span>{workout.exercises.length} exercises</span>
          </div>
          <div className="flex items-center">
            <FlameIcon className="w-4 h-4 mr-1 text-green-500" />
            <span>{workout.calories} cal</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link href={`/workout-details/${workout.id}`}>
          <Button className="bg-green-500 text-black hover:bg-green-600">
            <Play className="w-4 h-4 mr-2" />
            Start Workout
          </Button>
        </Link>
        <Link href={`/workout?code=${workout.qrCode}`}>
          <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black">
            View Plan
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Workout Library Page Component
const WorkoutLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>(workouts);
  
  // Filter workouts based on search term and filters
  useEffect(() => {
    let result = workouts;
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(workout => 
        workout.title.toLowerCase().includes(lowerCaseSearch) ||
        workout.description.toLowerCase().includes(lowerCaseSearch) ||
        workout.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch))
      );
    }
    
    // Apply type filter
    if (selectedTypes.length > 0) {
      result = result.filter(workout => selectedTypes.includes(workout.type));
    }
    
    // Apply level filter
    if (selectedLevels.length > 0) {
      result = result.filter(workout => selectedLevels.includes(workout.level));
    }
    
    setFilteredWorkouts(result);
  }, [searchTerm, selectedTypes, selectedLevels]);
  
  // Toggle selection of a filter
  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };
  
  const toggleLevelFilter = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };
  
  // Get unique workout types and levels for filter options
  const workoutTypes = Array.from(new Set(workouts.map(w => w.type)));
  const workoutLevels = Array.from(new Set(workouts.map(w => w.level)));
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative bg-black py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-green-500">AI-Powered</span> Workouts
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Personalized training plans adapted to your goals, fitness level, and available equipment.
              Access your workouts anywhere with our mobile-friendly QR codes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#featured-workouts">
                <Button className="bg-green-500 text-black hover:bg-green-600 py-6 px-8 text-lg">
                  Explore Workouts
                </Button>
              </Link>
              <Link href="/fitness-assessment">
                <Button variant="outline" className="border-green-500 text-white hover:bg-green-500 hover:text-black py-6 px-8 text-lg">
                  Take Fitness Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search and Filter Section */}
      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search workouts..."
                className="pl-10 bg-black border-gray-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-2/3">
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-2 flex items-center">
                  <Filter className="h-4 w-4 mr-1" /> Filter by Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {workoutTypes.map(type => (
                    <Badge 
                      key={type}
                      variant={selectedTypes.includes(type) ? "default" : "outline"}
                      className={
                        selectedTypes.includes(type) 
                          ? "bg-green-500 text-black hover:bg-green-600 cursor-pointer" 
                          : "border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-500 cursor-pointer"
                      }
                      onClick={() => toggleTypeFilter(type)}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-2 flex items-center">
                  <Activity className="h-4 w-4 mr-1" /> Filter by Level
                </p>
                <div className="flex flex-wrap gap-2">
                  {workoutLevels.map(level => (
                    <Badge 
                      key={level}
                      variant={selectedLevels.includes(level) ? "default" : "outline"}
                      className={
                        selectedLevels.includes(level) 
                          ? "bg-green-500 text-black hover:bg-green-600 cursor-pointer" 
                          : "border-gray-600 text-gray-400 hover:border-green-500 hover:text-green-500 cursor-pointer"
                      }
                      onClick={() => toggleLevelFilter(level)}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Workouts */}
      <section id="featured-workouts" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-white">Featured <span className="text-green-500">Workouts</span></h2>
            <Link href="/workout-library">
              <Button variant="link" className="text-green-500 hover:text-green-400">
                View All
              </Button>
            </Link>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-gray-900 p-1 mb-8">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
              >
                All Workouts
              </TabsTrigger>
              <TabsTrigger 
                value="strength"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
              >
                <Dumbbell className="h-4 w-4 mr-2" />
                Strength
              </TabsTrigger>
              <TabsTrigger 
                value="cardio"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
              >
                <Heart className="h-4 w-4 mr-2" />
                Cardio
              </TabsTrigger>
              <TabsTrigger 
                value="hiit"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
              >
                <Zap className="h-4 w-4 mr-2" />
                HIIT
              </TabsTrigger>
              <TabsTrigger 
                value="mobility"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-black"
              >
                <BarChart className="h-4 w-4 mr-2" />
                Mobility
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkouts.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
              
              {filteredWorkouts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No workouts match your search criteria.</p>
                  <Button 
                    variant="link" 
                    className="text-green-500 mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedLevels([]);
                      setSelectedTypes([]);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="strength" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts
                  .filter(workout => workout.tags.includes('strength'))
                  .map(workout => (
                    <WorkoutCard key={workout.id} workout={workout} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="cardio" className="mt-0">
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">Cardio workouts coming soon!</p>
                <Link href="/workout-library">
                  <Button variant="link" className="text-green-500 mt-4">
                    View All Workouts
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="hiit" className="mt-0">
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">HIIT workouts coming soon!</p>
                <Link href="/workout-library">
                  <Button variant="link" className="text-green-500 mt-4">
                    View All Workouts
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="mobility" className="mt-0">
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">Mobility workouts coming soon!</p>
                <Link href="/workout-library">
                  <Button variant="link" className="text-green-500 mt-4">
                    View All Workouts
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Workout QR Codes */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Access Workouts <span className="text-green-500">On The Go</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Scan these QR codes with your mobile device to instantly access your workout routines
              from anywhere, complete with video instructions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {workouts.map(workout => (
              <Card key={workout.id} className="bg-black border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-green-500">{workout.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    Level: {workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}
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
                    <p className="font-mono bg-gray-900 text-green-500 py-1 px-3 rounded text-sm inline-block">
                      {workout.qrCode}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Personal Training CTA */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="bg-gray-900 rounded-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Need Personalized <span className="text-green-500">Guidance?</span>
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Our AI coach can create custom workout plans tailored to your specific goals, 
                  fitness level, and available equipment. Get started with a free fitness assessment.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/fitness-assessment">
                    <Button className="bg-green-500 text-black hover:bg-green-600">
                      Start Assessment
                    </Button>
                  </Link>
                  <Link href="/ai-coach">
                    <Button variant="outline" className="border-green-500 text-white hover:bg-green-500 hover:text-black">
                      Chat with AI Coach
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="relative w-64 h-64 rounded-full border-4 border-green-500 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-green-500 mx-auto" />
                      <p className="text-green-500 font-bold mt-2">AI-Powered Coaching</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkoutLibrary;
import React, { useState } from 'react';
import { CalendarIcon, Filter, BarChart, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock workout history data
const mockWorkoutHistory = [
  {
    id: 1,
    date: new Date('2025-04-10'),
    title: 'Full Body Circuit',
    duration: 45,
    calories: 385,
    exercises: [
      { name: 'Push-ups', sets: 3, reps: 15, weight: null },
      { name: 'Squats', sets: 4, reps: 20, weight: null },
      { name: 'Plank', sets: 3, duration: '60s', weight: null },
      { name: 'Lunges', sets: 3, reps: 12, weight: null }
    ],
    notes: 'Felt strong today! Increased reps on push-ups.',
    rating: 4
  },
  {
    id: 2,
    date: new Date('2025-04-08'),
    title: 'Upper Body Focus',
    duration: 35,
    calories: 310,
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 10, weight: '135lbs' },
      { name: 'Pull-ups', sets: 3, reps: 8, weight: null },
      { name: 'Shoulder Press', sets: 3, reps: 12, weight: '30lbs' },
      { name: 'Tricep Dips', sets: 3, reps: 15, weight: null }
    ],
    notes: 'Struggled with the last set of pull-ups.',
    rating: 3
  },
  {
    id: 3,
    date: new Date('2025-04-05'),
    title: 'Leg Day',
    duration: 50,
    calories: 420,
    exercises: [
      { name: 'Squats', sets: 4, reps: 15, weight: '95lbs' },
      { name: 'Deadlifts', sets: 3, reps: 10, weight: '135lbs' },
      { name: 'Leg Press', sets: 3, reps: 12, weight: '180lbs' },
      { name: 'Calf Raises', sets: 3, reps: 20, weight: '45lbs' }
    ],
    notes: 'Great session! Added more weight to deadlifts.',
    rating: 5
  },
  {
    id: 4,
    date: new Date('2025-04-02'),
    title: 'HIIT Cardio',
    duration: 30,
    calories: 350,
    exercises: [
      { name: 'Jumping Jacks', sets: 1, duration: '60s', weight: null },
      { name: 'Burpees', sets: 1, duration: '45s', weight: null },
      { name: 'Mountain Climbers', sets: 1, duration: '60s', weight: null },
      { name: 'High Knees', sets: 1, duration: '45s', weight: null }
    ],
    notes: 'Intense session! Kept rest periods short.',
    rating: 4
  }
];

// Workout History Page Component
const WorkoutHistoryPage: React.FC = () => {
  const [workouts, setWorkouts] = useState(mockWorkoutHistory);
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'calories'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<string>('all');
  
  // Sort workouts
  const sortedWorkouts = [...workouts].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc' 
        ? a.date.getTime() - b.date.getTime() 
        : b.date.getTime() - a.date.getTime();
    } else if (sortBy === 'duration') {
      return sortDirection === 'asc' 
        ? a.duration - b.duration 
        : b.duration - a.duration;
    } else {
      return sortDirection === 'asc' 
        ? a.calories - b.calories 
        : b.calories - a.calories;
    }
  });
  
  // Handle sorting
  const handleSort = (newSortBy: 'date' | 'duration' | 'calories') => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc'); // Default to descending when changing sort field
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Workout History</h1>
      
      <Tabs defaultValue="list" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-4">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-grow max-w-xs">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter workouts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Workouts</SelectItem>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSort('date')}
                className="flex items-center gap-1"
              >
                Date {sortBy === 'date' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSort('duration')}
                className="flex items-center gap-1"
              >
                Duration {sortBy === 'duration' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSort('calories')}
                className="flex items-center gap-1"
              >
                Calories {sortBy === 'calories' && (sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {sortedWorkouts.map((workout) => (
              <Card key={workout.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50 dark:bg-slate-800 pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{workout.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {workout.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-6 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{workout.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Calories</p>
                      <p className="font-medium">{workout.calories} kcal</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-lg ${i < workout.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-1">Exercise</th>
                          <th className="text-center py-2 px-1">Sets</th>
                          <th className="text-center py-2 px-1">Reps/Duration</th>
                          <th className="text-center py-2 px-1">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workout.exercises.map((exercise, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 px-1 font-medium">{exercise.name}</td>
                            <td className="text-center py-2 px-1">{exercise.sets}</td>
                            <td className="text-center py-2 px-1">{exercise.reps || exercise.duration}</td>
                            <td className="text-center py-2 px-1">{exercise.weight || 'Bodyweight'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {workout.notes && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="italic">{workout.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-4 gap-2">
                    <Button variant="outline" size="sm">
                      Repeat Workout
                    </Button>
                    <Button variant="default" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center p-12 space-y-4">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-medium">Calendar View Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  We're working on a calendar view to make tracking your workouts even easier.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Workout Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workout Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48">
                <BarChart className="h-24 w-24 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Calories Burned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48">
                <BarChart className="h-24 w-24 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workout Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48">
                <BarChart className="h-24 w-24 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkoutHistoryPage;
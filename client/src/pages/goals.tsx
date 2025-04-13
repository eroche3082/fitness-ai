import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Plus, 
  BarChart3, 
  TrendingUp, 
  Award, 
  Calendar, 
  Dumbbell, 
  Weight, 
  Heart, 
  Clock, 
  Check, 
  ChevronUp, 
  ChevronDown,
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types
interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Weight' | 'Strength' | 'Cardio' | 'Habit' | 'Nutrition';
  target: number;
  unit: string;
  startValue: number;
  currentValue: number;
  startDate: Date;
  targetDate: Date;
  frequency?: string;
  progress?: number;
  status: 'In Progress' | 'Completed' | 'Pending';
  reminderEnabled?: boolean;
  reminderTime?: string;
  notes?: string;
}

// Form schema
const goalSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  category: z.enum(['Weight', 'Strength', 'Cardio', 'Habit', 'Nutrition']),
  target: z.number({ required_error: "Target value is required" }).positive(),
  unit: z.string().min(1, { message: "Unit is required" }),
  startValue: z.number().default(0),
  targetDate: z.date({ required_error: "Target date is required" }),
  frequency: z.string().optional(),
  reminderEnabled: z.boolean().default(false),
  reminderTime: z.string().optional(),
  notes: z.string().optional()
});

// Sample goals data
const sampleGoals: Goal[] = [
  {
    id: 'goal-1',
    title: 'Weight Loss Goal',
    description: 'Reduce body weight while maintaining muscle mass',
    category: 'Weight',
    target: 160,
    unit: 'lbs',
    startValue: 185,
    currentValue: 172,
    startDate: new Date('2025-02-01'),
    targetDate: new Date('2025-06-30'),
    status: 'In Progress',
    progress: 52
  },
  {
    id: 'goal-2',
    title: 'Bench Press Strength',
    description: 'Increase bench press max',
    category: 'Strength',
    target: 225,
    unit: 'lbs',
    startValue: 185,
    currentValue: 200,
    startDate: new Date('2025-03-15'),
    targetDate: new Date('2025-07-15'),
    status: 'In Progress',
    progress: 37
  },
  {
    id: 'goal-3',
    title: '5K Run Time',
    description: 'Improve 5K running time',
    category: 'Cardio',
    target: 22,
    unit: 'minutes',
    startValue: 28,
    currentValue: 25,
    startDate: new Date('2025-03-01'),
    targetDate: new Date('2025-05-31'),
    status: 'In Progress',
    progress: 50
  },
  {
    id: 'goal-4',
    title: 'Daily Protein Intake',
    description: 'Consistently hit protein targets',
    category: 'Nutrition',
    target: 150,
    unit: 'g/day',
    startValue: 100,
    currentValue: 130,
    startDate: new Date('2025-04-01'),
    targetDate: new Date('2025-04-30'),
    frequency: 'Daily',
    status: 'In Progress',
    progress: 60
  },
  {
    id: 'goal-5',
    title: 'Morning Workout Habit',
    description: 'Establish consistent morning workout routine',
    category: 'Habit',
    target: 20,
    unit: 'sessions',
    startValue: 0,
    currentValue: 8,
    startDate: new Date('2025-04-01'),
    targetDate: new Date('2025-04-30'),
    frequency: '4x per week',
    status: 'In Progress',
    progress: 40
  }
];

// Component for a single goal card
const GoalCard: React.FC<{ 
  goal: Goal, 
  onUpdate: (id: string, newValue: number) => void 
}> = ({ goal, onUpdate }) => {
  const [value, setValue] = useState<number>(goal.currentValue);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Weight': return <Weight className="h-5 w-5" />;
      case 'Strength': return <Dumbbell className="h-5 w-5" />;
      case 'Cardio': return <Heart className="h-5 w-5" />;
      case 'Habit': return <RefreshCw className="h-5 w-5" />;
      case 'Nutrition': return <Utensils className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };
  
  const daysRemaining = Math.ceil((goal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const formattedStartDate = goal.startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const formattedTargetDate = goal.targetDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full 
              ${goal.category === 'Weight' ? 'bg-blue-100 text-blue-700' : ''} 
              ${goal.category === 'Strength' ? 'bg-red-100 text-red-700' : ''} 
              ${goal.category === 'Cardio' ? 'bg-green-100 text-green-700' : ''} 
              ${goal.category === 'Habit' ? 'bg-purple-100 text-purple-700' : ''} 
              ${goal.category === 'Nutrition' ? 'bg-yellow-100 text-yellow-700' : ''}
            `}>
              {getCategoryIcon(goal.category)}
            </div>
            <CardTitle className="text-lg">{goal.title}</CardTitle>
          </div>
          <Badge variant={
            goal.status === 'Completed' ? 'default' : 
            goal.status === 'In Progress' ? 'outline' : 'secondary'
          }>
            {goal.status}
          </Badge>
        </div>
        <CardDescription>{goal.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Current</p>
            <p className="font-medium">{goal.currentValue} {goal.unit}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="font-medium">{goal.target} {goal.unit}</p>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="text-sm">{formattedStartDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Date</p>
                <p className="text-sm">{formattedTargetDate}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className="text-sm">{daysRemaining > 0 ? daysRemaining : 'Overdue'}</p>
              </div>
              {goal.frequency && (
                <div>
                  <p className="text-sm text-muted-foreground">Frequency</p>
                  <p className="text-sm">{goal.frequency}</p>
                </div>
              )}
            </div>
            
            {goal.notes && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm">{goal.notes}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {isExpanded ? 'Less' : 'More'}
          </Button>
          
          <Button variant="ghost" size="sm">
            <MessageCircle className="h-4 w-4 mr-1" />
            Notes
          </Button>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="flex items-center rounded-md border border-input">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 rounded-r-none px-2" 
              onClick={() => setValue(prev => Math.max(0, prev - 1))}
            >
              -
            </Button>
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="h-8 w-16 rounded-none border-0"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 rounded-l-none px-2" 
              onClick={() => setValue(prev => prev + 1)}
            >
              +
            </Button>
          </div>
          <Button 
            size="sm" 
            onClick={() => onUpdate(goal.id, value)}
          >
            Update
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Goals summary component showing achievements
const GoalsSummary: React.FC<{ goals: Goal[] }> = ({ goals }) => {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'In Progress').length;
  
  // Calculate average progress
  const avgProgress = goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / totalGoals;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className="mb-2 p-3 bg-blue-100 rounded-full text-blue-700">
            <Target className="h-6 w-6" />
          </div>
          <p className="text-2xl font-bold mb-1">{totalGoals}</p>
          <p className="text-sm text-muted-foreground">Total Goals</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className="mb-2 p-3 bg-green-100 rounded-full text-green-700">
            <Check className="h-6 w-6" />
          </div>
          <p className="text-2xl font-bold mb-1">{completedGoals}</p>
          <p className="text-sm text-muted-foreground">Completed Goals</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <div className="mb-2 p-3 bg-amber-100 rounded-full text-amber-700">
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="text-2xl font-bold mb-1">{avgProgress.toFixed(0)}%</p>
          <p className="text-sm text-muted-foreground">Average Progress</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Goals Page Component
const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(sampleGoals);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  
  // Filter goals based on active tab
  const filteredGoals = activeTab === 'all' 
    ? goals 
    : goals.filter(goal => {
        if (activeTab === 'completed') return goal.status === 'Completed';
        return goal.category === activeTab;
      });
  
  // Form setup
  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Weight',
      target: 0,
      unit: '',
      startValue: 0,
      targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      reminderEnabled: false
    }
  });
  
  // Handle goal update
  const handleGoalUpdate = (id: string, newValue: number) => {
    setGoals(prev => 
      prev.map(goal => {
        if (goal.id === id) {
          // Calculate progress percentage
          const range = Math.abs(goal.target - goal.startValue);
          const current = Math.abs(newValue - goal.startValue);
          let progress = 0;
          
          if (goal.target > goal.startValue) {
            // For increasing goals (like building strength)
            progress = Math.min(100, Math.round((current / range) * 100));
          } else {
            // For decreasing goals (like weight loss)
            progress = Math.min(100, Math.round((current / range) * 100));
          }
          
          return {
            ...goal,
            currentValue: newValue,
            progress,
            status: progress >= 100 ? 'Completed' : 'In Progress'
          };
        }
        return goal;
      })
    );
  };
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof goalSchema>) => {
    const newGoal: Goal = {
      id: `goal-${goals.length + 1}`,
      title: values.title,
      description: values.description || '',
      category: values.category,
      target: values.target,
      unit: values.unit,
      startValue: values.startValue,
      currentValue: values.startValue,
      startDate: new Date(),
      targetDate: values.targetDate,
      frequency: values.frequency,
      status: 'In Progress',
      progress: 0,
      reminderEnabled: values.reminderEnabled,
      reminderTime: values.reminderTime,
      notes: values.notes
    };
    
    setGoals(prev => [...prev, newGoal]);
    setIsAddGoalOpen(false);
    form.reset();
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold">Fitness Goals</h1>
        
        <div className="flex mt-4 md:mt-0">
          <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogDescription>
                  Set a specific, measurable goal to track your fitness progress.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 'Lose 10 pounds'" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of your goal" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Weight">Weight</SelectItem>
                              <SelectItem value="Strength">Strength</SelectItem>
                              <SelectItem value="Cardio">Cardio</SelectItem>
                              <SelectItem value="Habit">Habit</SelectItem>
                              <SelectItem value="Nutrition">Nutrition</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="targetDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              onChange={(e) => field.onChange(new Date(e.target.value))}
                              value={field.value instanceof Date ? field.value.toISOString().substr(0, 10) : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="startValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Value</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="target"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Value</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., lbs, km, reps" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Daily, 3x per week" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Create Goal</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <GoalsSummary goals={goals} />
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Weight">Weight</TabsTrigger>
          <TabsTrigger value="Strength">Strength</TabsTrigger>
          <TabsTrigger value="Cardio">Cardio</TabsTrigger>
          <TabsTrigger value="Habit">Habits</TabsTrigger>
          <TabsTrigger value="Nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            {filteredGoals.length > 0 ? (
              filteredGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal} onUpdate={handleGoalUpdate} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <Target className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No goals found</p>
                  <p className="text-muted-foreground text-center mb-4">
                    {activeTab === 'all' 
                      ? "You haven't created any goals yet." 
                      : activeTab === 'completed'
                        ? "You haven't completed any goals yet."
                        : `You don't have any ${activeTab} goals yet.`}
                  </p>
                  <Button onClick={() => setIsAddGoalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create a Goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Utensils: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
      <path d="M7 2v20"></path>
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
    </svg>
  );
};

export default GoalsPage;
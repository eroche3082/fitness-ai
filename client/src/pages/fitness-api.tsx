import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import RapidApiStatus from "@/components/RapidApiStatus";
import { Dumbbell, Scale, Utensils, Activity } from 'lucide-react';

const bmiFormSchema = z.object({
  weight: z.string().min(1, 'Weight is required'),
  height: z.string().min(1, 'Height is required'),
  system: z.enum(['metric', 'imperial'])
});

const exerciseFormSchema = z.object({
  bodyPart: z.string().min(1, 'Body part is required'),
  equipment: z.string().min(1, 'Equipment is required')
});

const foodAnalysisFormSchema = z.object({
  imageUrl: z.string().url('Must be a valid URL')
});

const fitnessMetricsFormSchema = z.object({
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  age: z.string().min(1, 'Age is required'),
  gender: z.enum(['male', 'female']),
  activity: z.enum(['none', 'little', 'moderate', 'active', 'very_active']),
  neck: z.string().optional(),
  waist: z.string().optional(),
  hip: z.string().optional()
});

const oneRepMaxFormSchema = z.object({
  weight_lifted: z.string().min(1, 'Weight lifted is required'),
  reps: z.string().min(1, 'Repetitions is required')
});

export default function FitnessApiPage() {
  const [bmiResult, setBmiResult] = useState<any>(null);
  const [exerciseResult, setExerciseResult] = useState<any>(null);
  const [foodResult, setFoodResult] = useState<any>(null);
  const [fitnessResult, setFitnessResult] = useState<any>(null);
  const [loading, setLoading] = useState<{
    bmi: boolean;
    exercise: boolean;
    food: boolean;
    fitness: boolean;
  }>({
    bmi: false,
    exercise: false,
    food: false,
    fitness: false
  });

  const bmiForm = useForm<z.infer<typeof bmiFormSchema>>({
    resolver: zodResolver(bmiFormSchema),
    defaultValues: {
      weight: '',
      height: '',
      system: 'metric'
    }
  });

  const exerciseForm = useForm<z.infer<typeof exerciseFormSchema>>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: {
      bodyPart: '',
      equipment: ''
    }
  });

  const foodForm = useForm<z.infer<typeof foodAnalysisFormSchema>>({
    resolver: zodResolver(foodAnalysisFormSchema),
    defaultValues: {
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Breakfast_foods.jpg'
    }
  });

  const fitnessForm = useForm<z.infer<typeof fitnessMetricsFormSchema>>({
    resolver: zodResolver(fitnessMetricsFormSchema),
    defaultValues: {
      height: '',
      weight: '',
      age: '',
      gender: 'male',
      activity: 'little',
      neck: '',
      waist: '',
      hip: ''
    }
  });

  const onBmiSubmit = async (data: z.infer<typeof bmiFormSchema>) => {
    setLoading(prev => ({ ...prev, bmi: true }));
    try {
      const endpoint = data.system === 'metric' 
        ? `/api/rapid-api/bmi/metric?weight=${data.weight}&height=${data.height}` 
        : `/api/rapid-api/bmi/standard?feet=${data.height.split("'")[0]}&inches=${data.height.split("'")[1] || 0}&lbs=${data.weight}`;
      
      const result = await apiRequest(endpoint);
      setBmiResult(result.data);
    } catch (error) {
      console.error('Error calculating BMI:', error);
    } finally {
      setLoading(prev => ({ ...prev, bmi: false }));
    }
  };

  const onExerciseSubmit = async (data: z.infer<typeof exerciseFormSchema>) => {
    setLoading(prev => ({ ...prev, exercise: true }));
    try {
      const result = await apiRequest(
        `/api/rapid-api/gym-fit/exercises?bodyPart=${data.bodyPart}&equipment=${data.equipment}`
      );
      setExerciseResult(result.data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(prev => ({ ...prev, exercise: false }));
    }
  };

  const onFoodSubmit = async (data: z.infer<typeof foodAnalysisFormSchema>) => {
    setLoading(prev => ({ ...prev, food: true }));
    try {
      const result = await apiRequest('/api/rapid-api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      setFoodResult(result.data);
    } catch (error) {
      console.error('Error analyzing food:', error);
    } finally {
      setLoading(prev => ({ ...prev, food: false }));
    }
  };

  const onFitnessSubmit = async (data: z.infer<typeof fitnessMetricsFormSchema>) => {
    setLoading(prev => ({ ...prev, fitness: true }));
    try {
      const result = await apiRequest('/api/rapid-api/fitness-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          height: data.height,
          weight: data.weight,
          age: data.age,
          gender: data.gender,
          exercise: data.activity,
          neck: data.neck,
          waist: data.waist,
          hip: data.hip,
          goal: 'maintenance',
          deficit: '500',
          goalWeight: data.weight
        })
      });
      setFitnessResult(result.data);
    } catch (error) {
      console.error('Error calculating fitness metrics:', error);
    } finally {
      setLoading(prev => ({ ...prev, fitness: false }));
    }
  };

  const bodyParts = ['Back', 'Cardio', 'Chest', 'Lower arms', 'Lower legs', 'Neck', 'Shoulders', 'Upper arms', 'Upper legs', 'Waist'];
  const equipmentTypes = ['Barbell', 'Body weight', 'Dumbbell', 'Cable', 'Kettlebell', 'Machine', 'Resistance band', 'Stability ball', 'TRX'];
  const activityLevels = [
    { value: 'none', label: 'Sedentary (little or no exercise)' },
    { value: 'little', label: 'Lightly active (light exercise 1-3 days/week)' },
    { value: 'moderate', label: 'Moderately active (moderate exercise 3-5 days/week)' },
    { value: 'active', label: 'Very active (hard exercise 6-7 days/week)' },
    { value: 'very_active', label: 'Extra active (very hard exercise and physical job)' }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fitness APIs</h2>
          <p className="text-muted-foreground">
            Test the integrated Rapid API fitness and nutrition services
          </p>
        </div>
        
        <RapidApiStatus />
        
        <Tabs defaultValue="bmi" className="mt-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="bmi" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              <span>BMI Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="exercises" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              <span>Exercise Database</span>
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              <span>Food Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="fitness" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Fitness Metrics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bmi" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calculate Body Mass Index</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...bmiForm}>
                    <form onSubmit={bmiForm.handleSubmit(onBmiSubmit)} className="space-y-4">
                      <FormField
                        control={bmiForm.control}
                        name="system"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Measurement System</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select measurement system" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="metric">Metric (kg, m)</SelectItem>
                                <SelectItem value="imperial">Imperial (lbs, ft'in")</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={bmiForm.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Weight ({bmiForm.watch('system') === 'metric' ? 'kg' : 'lbs'})
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter weight" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={bmiForm.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Height ({bmiForm.watch('system') === 'metric' ? 'm' : "ft'in\""})
                            </FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder={
                                  bmiForm.watch('system') === 'metric' 
                                    ? "e.g., 1.75" 
                                    : "e.g., 5'10"
                                } 
                              />
                            </FormControl>
                            <FormDescription>
                              {bmiForm.watch('system') === 'imperial' && "Format: feet'inches (e.g., 5'10)"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={loading.bmi}>
                        {loading.bmi ? 'Calculating...' : 'Calculate BMI'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.bmi ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : bmiResult ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold">{bmiResult.bmi?.toFixed(1) || bmiResult.value?.toFixed(1) || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">BMI Value</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/10 p-3 rounded-md">
                          <div className="font-semibold">{bmiResult.weightCategory || bmiResult.category || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">Weight Category</div>
                        </div>
                        
                        <div className="bg-primary/10 p-3 rounded-md">
                          <div className="font-semibold">{bmiResult.idealWeightRange || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">Ideal Weight Range</div>
                        </div>
                      </div>
                      
                      {bmiResult.riskLevel && (
                        <div className="mt-4">
                          <div className="font-semibold">Health Risk: {bmiResult.riskLevel}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                      <Scale className="h-12 w-12 mb-2 opacity-30" />
                      <p>Enter your details to calculate BMI</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="exercises" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Find Exercises</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...exerciseForm}>
                    <form onSubmit={exerciseForm.handleSubmit(onExerciseSubmit)} className="space-y-4">
                      <FormField
                        control={exerciseForm.control}
                        name="bodyPart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Body Part</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select body part" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bodyParts.map(part => (
                                  <SelectItem key={part} value={part}>{part}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={exerciseForm.control}
                        name="equipment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Equipment</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select equipment" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {equipmentTypes.map(equipment => (
                                  <SelectItem key={equipment} value={equipment}>{equipment}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" disabled={loading.exercise}>
                        {loading.exercise ? 'Searching...' : 'Find Exercises'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Exercise Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.exercise ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : exerciseResult ? (
                    <div className="space-y-4">
                      {exerciseResult.exercises && exerciseResult.exercises.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {exerciseResult.exercises.slice(0, 6).map((exercise: any, index: number) => (
                            <Card key={index} className="overflow-hidden">
                              <div className="aspect-video bg-muted flex items-center justify-center">
                                {exercise.gifUrl ? (
                                  <img 
                                    src={exercise.gifUrl} 
                                    alt={exercise.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Dumbbell className="h-12 w-12 opacity-30" />
                                )}
                              </div>
                              <CardContent className="p-3">
                                <h3 className="font-medium">{exercise.name}</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Badge variant="outline">{exercise.bodyPart}</Badge>
                                  <Badge variant="outline">{exercise.equipment}</Badge>
                                  <Badge variant="outline">{exercise.target}</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground p-4">
                          No exercises found for the selected criteria
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <Dumbbell className="h-12 w-12 mb-2 opacity-30" />
                      <p>Select body part and equipment to find exercises</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="food" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyze Food Plate</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...foodForm}>
                    <form onSubmit={foodForm.handleSubmit(onFoodSubmit)} className="space-y-4">
                      <FormField
                        control={foodForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Food Image URL</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter image URL" />
                            </FormControl>
                            <FormDescription>
                              URL to an image of a food plate for nutritional analysis
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {foodForm.watch('imageUrl') && (
                        <div className="mt-2 aspect-video bg-muted rounded-md overflow-hidden">
                          <img 
                            src={foodForm.watch('imageUrl')} 
                            alt="Food preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL'}
                          />
                        </div>
                      )}
                      
                      <Button type="submit" disabled={loading.food}>
                        {loading.food ? 'Analyzing...' : 'Analyze Food'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Nutritional Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.food ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : foodResult ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-primary/10 rounded-md">
                        <h3 className="font-semibold mb-1">Food Items Detected:</h3>
                        <ul className="space-y-1">
                          {foodResult.foods?.map((food: any, index: number) => (
                            <li key={index} className="text-sm">• {food.name}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {foodResult.nutritionalInfo && (
                        <div className="space-y-3">
                          <h3 className="font-semibold">Nutritional Information:</h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-primary/10 rounded-md">
                              <div className="text-lg font-semibold">{foodResult.nutritionalInfo.calories || 'N/A'}</div>
                              <div className="text-xs text-muted-foreground">Calories</div>
                            </div>
                            
                            <div className="p-3 bg-primary/10 rounded-md">
                              <div className="text-lg font-semibold">{foodResult.nutritionalInfo.protein || 'N/A'}</div>
                              <div className="text-xs text-muted-foreground">Protein</div>
                            </div>
                            
                            <div className="p-3 bg-primary/10 rounded-md">
                              <div className="text-lg font-semibold">{foodResult.nutritionalInfo.carbs || 'N/A'}</div>
                              <div className="text-xs text-muted-foreground">Carbohydrates</div>
                            </div>
                            
                            <div className="p-3 bg-primary/10 rounded-md">
                              <div className="text-lg font-semibold">{foodResult.nutritionalInfo.fats || 'N/A'}</div>
                              <div className="text-xs text-muted-foreground">Fats</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {foodResult.healthScore && (
                        <div className="p-3 bg-primary/10 rounded-md">
                          <div className="text-lg font-semibold">Health Score: {foodResult.healthScore}/10</div>
                          <div className="text-sm mt-1">{foodResult.healthRecommendation || ''}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <Utensils className="h-12 w-12 mb-2 opacity-30" />
                      <p>Submit a food image to see nutritional analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="fitness" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Calculate Fitness Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...fitnessForm}>
                    <form onSubmit={fitnessForm.handleSubmit(onFitnessSubmit)} className="space-y-4">
                      <FormField
                        control={fitnessForm.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 175" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={fitnessForm.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 75" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={fitnessForm.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 30" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={fitnessForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={fitnessForm.control}
                        name="activity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Level</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select activity level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {activityLevels.map(level => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-2 border-t border-border">
                        <p className="text-sm font-medium mb-2">Body Measurements (optional)</p>
                        <div className="grid grid-cols-3 gap-3">
                          <FormField
                            control={fitnessForm.control}
                            name="neck"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Neck (cm)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., 38" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={fitnessForm.control}
                            name="waist"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Waist (cm)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., 85" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={fitnessForm.control}
                            name="hip"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Hip (cm)</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., 90" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" disabled={loading.fitness}>
                        {loading.fitness ? 'Calculating...' : 'Calculate Metrics'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Fitness Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.fitness ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : fitnessResult ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-primary/10 p-4 rounded-md">
                          <div className="text-lg font-semibold">{fitnessResult.tdee || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">Total Daily Energy Expenditure (kcal)</div>
                        </div>
                        
                        <div className="bg-primary/10 p-4 rounded-md">
                          <div className="text-lg font-semibold">{fitnessResult.bmr || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">Basal Metabolic Rate (kcal)</div>
                        </div>
                        
                        <div className="bg-primary/10 p-4 rounded-md">
                          <div className="text-lg font-semibold">{fitnessResult.bmi?.toFixed(1) || 'N/A'}</div>
                          <div className="text-xs text-muted-foreground">Body Mass Index</div>
                        </div>
                        
                        {fitnessResult.bodyFat && (
                          <div className="bg-primary/10 p-4 rounded-md">
                            <div className="text-lg font-semibold">{fitnessResult.bodyFat?.toFixed(1)}%</div>
                            <div className="text-xs text-muted-foreground">Body Fat Percentage</div>
                          </div>
                        )}
                        
                        {fitnessResult.lbm && (
                          <div className="bg-primary/10 p-4 rounded-md">
                            <div className="text-lg font-semibold">{fitnessResult.lbm?.toFixed(1)} kg</div>
                            <div className="text-xs text-muted-foreground">Lean Body Mass</div>
                          </div>
                        )}
                        
                        {fitnessResult.ibw && (
                          <div className="bg-primary/10 p-4 rounded-md">
                            <div className="text-lg font-semibold">{fitnessResult.ibw?.toFixed(1)} kg</div>
                            <div className="text-xs text-muted-foreground">Ideal Body Weight</div>
                          </div>
                        )}
                      </div>
                      
                      {fitnessResult.macros && (
                        <div>
                          <h3 className="font-semibold mb-3">Recommended Macronutrients</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-primary/10 p-4 rounded-md">
                              <div className="text-lg font-semibold">{fitnessResult.macros.protein} g</div>
                              <div className="text-xs text-muted-foreground">Protein</div>
                            </div>
                            
                            <div className="bg-primary/10 p-4 rounded-md">
                              <div className="text-lg font-semibold">{fitnessResult.macros.carbs} g</div>
                              <div className="text-xs text-muted-foreground">Carbohydrates</div>
                            </div>
                            
                            <div className="bg-primary/10 p-4 rounded-md">
                              <div className="text-lg font-semibold">{fitnessResult.macros.fats} g</div>
                              <div className="text-xs text-muted-foreground">Fats</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {fitnessResult.calories && (
                        <div className="mt-4">
                          <h3 className="font-semibold mb-2">Calorie Targets</h3>
                          <div className="space-y-2">
                            {Object.entries(fitnessResult.calories).map(([goal, value]: [string, any]) => (
                              <div key={goal} className="flex justify-between items-center p-2 border-b">
                                <span className="capitalize">{goal} Goal:</span>
                                <span className="font-medium">{value} kcal/day</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                      <Activity className="h-12 w-12 mb-2 opacity-30" />
                      <p>Fill out the form to calculate your personalized fitness metrics</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
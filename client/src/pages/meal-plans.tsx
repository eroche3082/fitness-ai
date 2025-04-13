import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Utensils, Apple, Coffee, Soup, Calendar, Download, Share2, Plus, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define types for meal plan data
interface MealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  image?: string;
}

interface DailyMeal {
  title: string;
  icon: React.ReactNode;
  items: MealItem[];
}

interface MealPlan {
  id: string;
  title: string;
  description: string;
  category: 'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Performance';
  dailyCalories: number;
  macros: { protein: number; carbs: number; fat: number };
  days: {
    [key: string]: {
      meals: DailyMeal[];
      totalNutrition: { calories: number; protein: number; carbs: number; fat: number };
    }
  };
}

// Sample data
const sampleMealPlans: MealPlan[] = [
  {
    id: 'weight-loss-plan',
    title: 'Fat Loss Focus',
    description: 'Designed for moderate calorie deficit with high protein to preserve muscle mass.',
    category: 'Weight Loss',
    dailyCalories: 1800,
    macros: { protein: 40, carbs: 30, fat: 30 },
    days: {
      'Monday': {
        meals: [
          {
            title: 'Breakfast',
            icon: <Coffee className="h-5 w-5" />,
            items: [
              {
                name: 'Greek Yogurt with Berries',
                calories: 280,
                protein: 22,
                carbs: 30,
                fat: 8,
                portion: '1 cup yogurt, 1/2 cup berries'
              },
              {
                name: 'Almonds',
                calories: 160,
                protein: 6,
                carbs: 6,
                fat: 14,
                portion: '1 oz (23 almonds)'
              }
            ]
          },
          {
            title: 'Lunch',
            icon: <Utensils className="h-5 w-5" />,
            items: [
              {
                name: 'Grilled Chicken Salad',
                calories: 350,
                protein: 35,
                carbs: 20,
                fat: 15,
                portion: '4 oz chicken, 2 cups mixed greens, 1 tbsp dressing'
              }
            ]
          },
          {
            title: 'Dinner',
            icon: <Soup className="h-5 w-5" />,
            items: [
              {
                name: 'Baked Salmon with Vegetables',
                calories: 420,
                protein: 38,
                carbs: 25,
                fat: 18,
                portion: '5 oz salmon, 1 cup roasted vegetables'
              },
              {
                name: 'Quinoa',
                calories: 120,
                protein: 4,
                carbs: 21,
                fat: 2,
                portion: '1/2 cup cooked'
              }
            ]
          },
          {
            title: 'Snacks',
            icon: <Apple className="h-5 w-5" />,
            items: [
              {
                name: 'Protein Shake',
                calories: 150,
                protein: 25,
                carbs: 5,
                fat: 3,
                portion: '1 scoop protein, water'
              },
              {
                name: 'Apple',
                calories: 95,
                protein: 0,
                carbs: 25,
                fat: 0,
                portion: '1 medium'
              }
            ]
          }
        ],
        totalNutrition: { calories: 1795, protein: 130, carbs: 132, fat: 60 }
      },
      'Tuesday': {
        meals: [
          {
            title: 'Breakfast',
            icon: <Coffee className="h-5 w-5" />,
            items: [
              {
                name: 'Veggie Egg White Omelette',
                calories: 250,
                protein: 20,
                carbs: 15,
                fat: 12,
                portion: '4 egg whites, 1/2 cup vegetables, 1 tbsp cheese'
              },
              {
                name: 'Whole Grain Toast',
                calories: 80,
                protein: 3,
                carbs: 15,
                fat: 1,
                portion: '1 slice'
              }
            ]
          },
          {
            title: 'Lunch',
            icon: <Utensils className="h-5 w-5" />,
            items: [
              {
                name: 'Turkey and Avocado Wrap',
                calories: 380,
                protein: 25,
                carbs: 30,
                fat: 18,
                portion: '4 oz turkey, 1/4 avocado, whole wheat wrap'
              }
            ]
          },
          {
            title: 'Dinner',
            icon: <Soup className="h-5 w-5" />,
            items: [
              {
                name: 'Lean Beef Stir Fry',
                calories: 420,
                protein: 35,
                carbs: 30,
                fat: 17,
                portion: '4 oz lean beef, 2 cups vegetables, sauce'
              },
              {
                name: 'Brown Rice',
                calories: 150,
                protein: 3,
                carbs: 32,
                fat: 1,
                portion: '3/4 cup cooked'
              }
            ]
          },
          {
            title: 'Snacks',
            icon: <Apple className="h-5 w-5" />,
            items: [
              {
                name: 'Cottage Cheese',
                calories: 120,
                protein: 14,
                carbs: 3,
                fat: 5,
                portion: '1/2 cup'
              },
              {
                name: 'Pear',
                calories: 100,
                protein: 1,
                carbs: 25,
                fat: 0,
                portion: '1 medium'
              }
            ]
          }
        ],
        totalNutrition: { calories: 1780, protein: 133, carbs: 135, fat: 54 }
      }
    }
  },
  {
    id: 'muscle-building-plan',
    title: 'Muscle Building',
    description: 'High protein, calorie surplus plan designed to support muscle growth and recovery.',
    category: 'Muscle Gain',
    dailyCalories: 2800,
    macros: { protein: 35, carbs: 45, fat: 20 },
    days: {
      'Monday': {
        meals: [
          {
            title: 'Breakfast',
            icon: <Coffee className="h-5 w-5" />,
            items: [
              {
                name: 'Protein Oatmeal with Banana',
                calories: 420,
                protein: 28,
                carbs: 65,
                fat: 8,
                portion: '1 cup oats, 1 scoop protein, 1 banana'
              }
            ]
          },
          {
            title: 'Lunch',
            icon: <Utensils className="h-5 w-5" />,
            items: [
              {
                name: 'Chicken & Rice Bowl',
                calories: 650,
                protein: 45,
                carbs: 80,
                fat: 15,
                portion: '6 oz chicken, 1.5 cups rice, vegetables'
              }
            ]
          },
          {
            title: 'Dinner',
            icon: <Soup className="h-5 w-5" />,
            items: [
              {
                name: 'Steak with Sweet Potato',
                calories: 580,
                protein: 40,
                carbs: 45,
                fat: 25,
                portion: '6 oz steak, 1 large sweet potato'
              },
              {
                name: 'Broccoli',
                calories: 55,
                protein: 3,
                carbs: 10,
                fat: 0,
                portion: '1 cup'
              }
            ]
          },
          {
            title: 'Snacks',
            icon: <Apple className="h-5 w-5" />,
            items: [
              {
                name: 'Mass Gainer Shake',
                calories: 650,
                protein: 50,
                carbs: 80,
                fat: 10,
                portion: '2 scoops powder, 1 cup milk, 1 tbsp peanut butter'
              },
              {
                name: 'Trail Mix',
                calories: 440,
                protein: 12,
                carbs: 40,
                fat: 28,
                portion: '2/3 cup'
              }
            ]
          }
        ],
        totalNutrition: { calories: 2795, protein: 242, carbs: 320, fat: 86 }
      }
    }
  }
];

const MealPlansPage: React.FC = () => {
  const [activePlan, setActivePlan] = useState<string>(sampleMealPlans[0].id);
  const [activeDay, setActiveDay] = useState<string>('Monday');
  const [category, setCategory] = useState<string>('all');
  
  const currentPlan = sampleMealPlans.find(plan => plan.id === activePlan) || sampleMealPlans[0];
  const days = Object.keys(currentPlan.days);
  const dailyPlan = currentPlan.days[activeDay];
  
  const filteredPlans = category === 'all' 
    ? sampleMealPlans 
    : sampleMealPlans.filter(plan => plan.category === category);
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Meal Plans</h1>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar with meal plan options */}
        <div className="w-full lg:w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Meal Plans</CardTitle>
              <CardDescription>Choose a plan that matches your fitness goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredPlans.map((plan) => (
                    <Card 
                      key={plan.id} 
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        activePlan === plan.id ? 'bg-primary/10 border-primary' : ''
                      }`}
                      onClick={() => {
                        setActivePlan(plan.id);
                        setActiveDay(Object.keys(plan.days)[0]);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{plan.title}</h3>
                          <Badge variant="outline">{plan.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Calories</p>
                            <p className="font-medium">{plan.dailyCalories}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Protein</p>
                            <p className="font-medium">{plan.macros.protein}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Carbs</p>
                            <p className="font-medium">{plan.macros.carbs}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Plan
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main meal plan display */}
        <div className="w-full lg:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>{currentPlan.title}</CardTitle>
                  <CardDescription className="mt-1">{currentPlan.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">Select Day</h3>
                </div>
                <Tabs value={activeDay} onValueChange={setActiveDay}>
                  <TabsList className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7">
                    {days.map(day => (
                      <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meals for the day */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Utensils className="h-5 w-5 mr-2 text-primary" />
                    Daily Meals
                  </h3>
                  
                  {dailyPlan.meals.map((meal, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center">
                          {meal.icon}
                          <span className="ml-2">{meal.title}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {meal.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="mb-3 pb-3 border-b last:border-0 last:mb-0 last:pb-0">
                            <div className="flex justify-between mb-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <span className="text-sm">{item.calories} cal</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{item.portion}</p>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <span>Protein: {item.protein}g</span>
                              <span>Carbs: {item.carbs}g</span>
                              <span>Fat: {item.fat}g</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Daily summary */}
                <div>
                  <h3 className="font-semibold text-lg flex items-center mb-4">
                    <BarChart className="h-5 w-5 mr-2 text-primary" />
                    Nutrition Summary
                  </h3>
                  
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-primary/10 rounded-lg">
                          <h4 className="text-sm text-muted-foreground mb-1">Total Calories</h4>
                          <p className="text-2xl font-bold">{dailyPlan.totalNutrition.calories}</p>
                        </div>
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <h4 className="text-sm text-muted-foreground mb-1">Meals</h4>
                          <p className="text-2xl font-bold">{dailyPlan.meals.length}</p>
                        </div>
                      </div>
                      
                      <h4 className="font-medium mb-2">Macronutrients</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Protein</span>
                            <span className="text-sm">{dailyPlan.totalNutrition.protein}g</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${(dailyPlan.totalNutrition.protein * 100) / (dailyPlan.totalNutrition.protein + dailyPlan.totalNutrition.carbs + dailyPlan.totalNutrition.fat)}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Carbs</span>
                            <span className="text-sm">{dailyPlan.totalNutrition.carbs}g</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full" 
                              style={{ width: `${(dailyPlan.totalNutrition.carbs * 100) / (dailyPlan.totalNutrition.protein + dailyPlan.totalNutrition.carbs + dailyPlan.totalNutrition.fat)}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Fat</span>
                            <span className="text-sm">{dailyPlan.totalNutrition.fat}g</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500 rounded-full" 
                              style={{ width: `${(dailyPlan.totalNutrition.fat * 100) / (dailyPlan.totalNutrition.protein + dailyPlan.totalNutrition.carbs + dailyPlan.totalNutrition.fat)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">AI Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <Badge className="mt-0.5 mr-2">Tip</Badge>
                          <span>Consider drinking water before meals to help with portion control.</span>
                        </li>
                        <li className="flex items-start">
                          <Badge className="mt-0.5 mr-2">Tip</Badge>
                          <span>Prep tomorrow's breakfast tonight to save time in the morning.</span>
                        </li>
                        <li className="flex items-start">
                          <Badge className="mt-0.5 mr-2">Tip</Badge>
                          <span>Add extra vegetables to increase fiber intake and nutrient density.</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Get More Recommendations</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const BarChart: React.FC<{ className?: string }> = ({ className }) => {
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
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
      <line x1="2" y1="20" x2="22" y2="20"></line>
    </svg>
  );
};

export default MealPlansPage;
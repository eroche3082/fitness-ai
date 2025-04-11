import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  Dumbbell, 
  DropletsIcon, 
  Footprints, 
  Activity,
  Trophy, 
  TrendingUp, 
  Calendar 
} from "lucide-react";

// Sample data - in production this would come from the API
const weeklyWorkouts = [
  { day: "Mon", count: 1 },
  { day: "Tue", count: 0 },
  { day: "Wed", count: 1 },
  { day: "Thu", count: 0 },
  { day: "Fri", count: 1 },
  { day: "Sat", count: 0 },
  { day: "Sun", count: 0 },
];

const monthlyProgress = [
  { name: "Week 1", weight: 185, strength: 65, endurance: 40 },
  { name: "Week 2", weight: 183, strength: 68, endurance: 45 },
  { name: "Week 3", weight: 181, strength: 72, endurance: 52 },
  { name: "Week 4", weight: 180, strength: 75, endurance: 60 },
];

const exerciseDistribution = [
  { name: "Cardio", value: 35 },
  { name: "Strength", value: 45 },
  { name: "Flexibility", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function ProgressDashboard() {
  const [currentTab, setCurrentTab] = useState("overview");
  
  const hydrationPercent = 70; // 70% of daily goal
  const stepsPercent = 85; // 85% of daily goal
  const workoutsPercent = 60; // 60% of weekly goal
  const streakDays = 12; // 12 day streak
  
  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>This Month</span>
          </Button>
        </div>
        
        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
                <TrendingUp className="h-8 w-8 text-primary mb-1" />
                <span className="text-2xl font-semibold">{streakDays}</span>
                <span className="text-sm text-muted-foreground text-center">Day Streak</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
                <DropletsIcon className="h-8 w-8 text-blue-500 mb-1" />
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Hydration</span>
                    <span className="text-sm font-medium">{hydrationPercent}%</span>
                  </div>
                  <Progress value={hydrationPercent} className="h-2 bg-blue-100" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
                <Dumbbell className="h-8 w-8 text-orange-500 mb-1" />
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Workouts</span>
                    <span className="text-sm font-medium">3/5</span>
                  </div>
                  <Progress value={workoutsPercent} className="h-2 bg-orange-100" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center gap-1">
                <Footprints className="h-8 w-8 text-green-500 mb-1" />
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Steps</span>
                    <span className="text-sm font-medium">8,500/10,000</span>
                  </div>
                  <Progress value={stepsPercent} className="h-2 bg-green-100" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weekly activity chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Your workout frequency for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyWorkouts}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis ticks={[0, 1, 2]} domain={[0, 2]} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Progress trends */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>Track your fitness journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#ff7300" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="strength" stroke="#387908" />
                    <Line yAxisId="right" type="monotone" dataKey="endurance" stroke="#389088" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Distribution</CardTitle>
              <CardDescription>Breakdown of your workout types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={exerciseDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {exerciseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-center gap-4 mt-4">
                {exerciseDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Body Metrics</CardTitle>
                <CardDescription>Your key physical measurements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Weight</span>
                    <span className="font-medium">180 lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Body Fat</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BMI</span>
                    <span className="font-medium">24.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resting Heart Rate</span>
                    <span className="font-medium">65 bpm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fitness Achievements</CardTitle>
                <CardDescription>Your latest milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">10 Workouts Completed</p>
                      <p className="text-sm text-muted-foreground">Earned 2 days ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">5lb Weight Loss</p>
                      <p className="text-sm text-muted-foreground">Earned 1 week ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">7-Day Streak</p>
                      <p className="text-sm text-muted-foreground">Earned 5 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Your recent activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => {
                  const daysAgo = index;
                  const date = new Date();
                  date.setDate(date.getDate() - daysAgo);
                  
                  return (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-medium">
                            {index === 0 ? "Upper Body Strength" : 
                             index === 1 ? "HIIT Cardio" : 
                             index === 2 ? "Rest Day" :
                             index === 3 ? "Lower Body Strength" :
                             "Full Body Workout"}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {daysAgo === 0 ? "Today" : 
                             daysAgo === 1 ? "Yesterday" : 
                             date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {index === 2 ? "Recovery day - no workout performed" :
                           `${Math.floor(Math.random() * 20) + 30} minutes • ${Math.floor(Math.random() * 200) + 200} calories`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
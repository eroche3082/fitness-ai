import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Activity, Timer, Flame, Heart, TrendingUp } from 'lucide-react';

interface DashboardData {
  summary: {
    dailyAvgSteps: number;
    weeklyActiveMinutes: number;
    totalWorkouts: number;
    caloriesBurned: number;
    sleepAvg: number;
  };
  devices: {
    connected: Array<{
      service: string;
      connected: boolean;
      lastSync: string | null;
      error: string | null;
    }>;
  };
  recentActivities: Array<{
    type: string;
    date: string;
    duration: number;
    distance: number;
    calories: number;
    source: string;
  }>;
}

export default function FitnessDashboard() {
  const { user } = useUser();
  const userId = user?.id || 1;
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/fitness/dashboard/${userId}`],
    queryFn: getQueryFn<DashboardData>({ on401: 'returnNull' }),
    enabled: !!userId
  });
  
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load fitness dashboard. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!data) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No fitness data available. Connect a fitness tracker to see your stats.
        </AlertDescription>
      </Alert>
    );
  }
  
  const { summary, recentActivities, devices } = data;
  const connectedDevices = devices.connected.filter(d => d.connected).length;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Daily goal metrics (example)
  const stepGoal = 10000;
  const stepProgress = Math.min(100, Math.round((summary.dailyAvgSteps / stepGoal) * 100));
  
  const activeMinutesGoal = 150; // Weekly goal
  const activeMinutesProgress = Math.min(100, Math.round((summary.weeklyActiveMinutes / activeMinutesGoal) * 100));
  
  const sleepGoal = 8; // Daily hours
  const sleepProgress = Math.min(100, Math.round((summary.sleepAvg / sleepGoal) * 100));
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Fitness Summary</h2>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Steps
              </CardTitle>
              <CardDescription>Daily average</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.dailyAvgSteps.toLocaleString()}</div>
              <div className="mt-2">
                <Progress value={stepProgress} className={getProgressColor(stepProgress)} />
                <div className="text-xs text-muted-foreground mt-1">
                  {stepProgress}% of daily goal ({stepGoal.toLocaleString()})
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Timer className="h-5 w-5 mr-2 text-primary" />
                Active Minutes
              </CardTitle>
              <CardDescription>Weekly total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.weeklyActiveMinutes} min</div>
              <div className="mt-2">
                <Progress value={activeMinutesProgress} className={getProgressColor(activeMinutesProgress)} />
                <div className="text-xs text-muted-foreground mt-1">
                  {activeMinutesProgress}% of weekly goal ({activeMinutesGoal} min)
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Flame className="h-5 w-5 mr-2 text-primary" />
                Calories
              </CardTitle>
              <CardDescription>Total burned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.caloriesBurned.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">
                From {summary.totalWorkouts} workouts
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest workouts</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start border-b pb-3 last:border-0">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        {activity.type === 'Running' ? (
                          <TrendingUp className="h-5 w-5 text-primary" />
                        ) : (
                          <Activity className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-medium">{activity.type}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(activity.date)}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-1 text-sm">
                          <div>
                            <div className="text-muted-foreground">Duration</div>
                            <div>{activity.duration} min</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Distance</div>
                            <div>{activity.distance} km</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Calories</div>
                            <div>{activity.calories}</div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          via {activity.source.charAt(0).toUpperCase() + activity.source.slice(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No recent activities recorded
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>
                {connectedDevices} of {devices.connected.length} services connected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices.connected.map((device, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full mr-3 ${device.connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div>
                        <div className="font-medium capitalize">
                          {device.service.replace(/-/g, ' ')}
                        </div>
                        {device.connected && device.lastSync && (
                          <div className="text-xs text-muted-foreground">
                            Last sync: {formatDate(device.lastSync)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm">
                      {device.connected ? 'Connected' : 'Not connected'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
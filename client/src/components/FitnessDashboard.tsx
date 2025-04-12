import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertCircle, Activity, Timer, Flame, Heart, TrendingUp, RefreshCw, 
  CheckCircle, XCircle, Clock, Smartphone 
} from 'lucide-react';

interface SyncStatus {
  lastSyncDate?: string;
  status?: string;
  dataTypes?: string[];
  hasSyncedData?: boolean;
}

interface ConnectedDevice {
  service: string;
  connected: boolean;
  lastSync: string | null;
  error: string | null;
  syncedData?: SyncStatus | null;
}

interface DashboardData {
  summary: {
    dailyAvgSteps: number;
    weeklyActiveMinutes: number;
    totalWorkouts: number;
    caloriesBurned: number;
    sleepAvg: number;
  };
  devices: {
    connected: Array<ConnectedDevice>;
    syncStatus?: Record<string, any>;
  };
  recentActivities: Array<{
    type: string;
    date: string;
    duration: number;
    distance: number;
    calories: number;
    source: string;
  }>;
  dataLastUpdated?: string | null;
}

export default function FitnessDashboard() {
  const { user } = useUser();
  const userId = user?.id || 1;
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
  const [syncingService, setSyncingService] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/fitness/dashboard/${userId}`],
    queryFn: getQueryFn<DashboardData>({ on401: 'returnNull' }),
    enabled: !!userId,
    refetchInterval: 60000 // Refetch every minute
  });
  
  // Sync a specific fitness service
  const syncMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      return apiRequest(`/api/fitness/sync/${serviceId}`, {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
    },
    onMutate: (serviceId) => {
      setSyncingService(serviceId);
      toast({
        title: 'Syncing data',
        description: `Syncing your ${serviceId.replace(/-/g, ' ')} data...`,
        duration: 2000
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: 'Sync successful',
          description: 'Your fitness data has been updated',
          variant: 'default',
          duration: 3000
        });
        // Refetch dashboard data to get the latest stats
        queryClient.invalidateQueries({ queryKey: [`/api/fitness/dashboard/${userId}`] });
      } else {
        toast({
          title: 'Sync partially completed',
          description: data.error || 'Some data types could not be synced',
          variant: 'destructive',
          duration: 5000
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Sync failed',
        description: 'Could not synchronize your fitness data',
        variant: 'destructive',
        duration: 5000
      });
      console.error('Sync error:', error);
    },
    onSettled: () => {
      setSyncingService(null);
    }
  });
  
  // Function to sync all connected services
  const syncAllMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/fitness/sync-all', {
        method: 'POST',
        body: JSON.stringify({ userId })
      });
    },
    onMutate: () => {
      setSyncingService('all');
      toast({
        title: 'Syncing all data',
        description: 'Fetching latest data from all connected trackers...',
        duration: 2000
      });
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        toast({
          title: 'All devices synced',
          description: 'Your fitness data has been fully updated',
          variant: 'default',
          duration: 3000
        });
      } else if (data.status === 'partial') {
        toast({
          title: 'Sync partially completed',
          description: 'Some devices were synced successfully',
          variant: 'default',
          duration: 3000
        });
      } else {
        toast({
          title: 'Sync issues',
          description: 'There were problems syncing your data',
          variant: 'destructive',
          duration: 5000
        });
      }
      // Refetch dashboard data
      queryClient.invalidateQueries({ queryKey: [`/api/fitness/dashboard/${userId}`] });
    },
    onError: (error) => {
      toast({
        title: 'Sync failed',
        description: 'Could not synchronize your fitness data',
        variant: 'destructive',
        duration: 5000
      });
      console.error('Sync error:', error);
    },
    onSettled: () => {
      setSyncingService(null);
    }
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Connected Devices</CardTitle>
                  <CardDescription>
                    {connectedDevices} of {devices.connected.length} services connected
                  </CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => syncAllMutation.mutate()}
                  disabled={syncingService !== null || connectedDevices === 0}
                >
                  <RefreshCw className={`h-4 w-4 ${syncingService === 'all' ? 'animate-spin' : ''}`} />
                  Sync All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.connected.map((device, index) => (
                  <div key={index} className="flex flex-col border-b pb-3 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-3 ${device.connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div>
                          <div className="font-medium capitalize">
                            {device.service.replace(/-/g, ' ')}
                          </div>
                          {device.connected && device.lastSync && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last sync: {formatDate(device.lastSync)}
                            </div>
                          )}
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              size="sm" 
                              variant={device.connected ? "outline" : "secondary"}
                              disabled={!device.connected || syncingService !== null}
                              onClick={() => device.connected && syncMutation.mutate(device.service)}
                              className="flex items-center gap-1"
                            >
                              {syncingService === device.service ? (
                                <>
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                  Syncing...
                                </>
                              ) : device.connected ? (
                                <>
                                  <RefreshCw className="h-3 w-3" />
                                  Sync
                                </>
                              ) : (
                                'Not Connected'
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {device.connected 
                              ? "Sync latest fitness data from this service" 
                              : "Connect this service to sync fitness data"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {device.connected && device.syncedData && (
                      <div className="mt-2 pl-6">
                        <div className="flex flex-wrap gap-1 text-xs">
                          {device.syncedData.dataTypes && device.syncedData.dataTypes.map((dataType: string) => (
                            <Badge key={dataType} variant="outline" className="capitalize">
                              {dataType}
                            </Badge>
                          ))}
                          {(!device.syncedData.dataTypes || device.syncedData.dataTypes.length === 0) && (
                            <span className="text-xs text-muted-foreground">No data synced yet</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            {data.dataLastUpdated && (
              <CardFooter className="flex justify-between items-center pt-0 text-xs text-muted-foreground border-t">
                <span>Data last updated: {formatDate(data.dataLastUpdated)} </span>
              </CardFooter>
            )}
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
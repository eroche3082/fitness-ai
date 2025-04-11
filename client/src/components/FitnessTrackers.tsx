import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle, Activity, Watch, Map, RefreshCcw } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';

type TrackerStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

interface TrackerInfo {
  name: string;
  id: string;
  icon: React.ReactNode;
  description: string;
  status: TrackerStatus;
  lastSync?: string;
  connectUrl?: string;
  features: string[];
}

export default function FitnessTrackers() {
  const { user } = useUser();
  const [activeTracker, setActiveTracker] = useState<string>('google-fit');
  
  // Fetch available trackers and their status
  const { data: trackers, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/fitness-trackers/health'],
    queryFn: getQueryFn<any>({ on401: 'returnNull' }),
    enabled: !!user
  });
  
  // Fetch tracker authentication URL
  const getAuthUrl = async (trackerId: string) => {
    try {
      const response = await apiRequest(`/api/fitness-trackers/${trackerId}/auth`, {
        method: 'GET'
      });
      
      if (response.success && response.authUrl) {
        window.location.href = response.authUrl;
      }
    } catch (error) {
      console.error(`Error getting auth URL for ${trackerId}:`, error);
    }
  };
  
  // Define trackers configuration
  const trackerConfig: Record<string, Omit<TrackerInfo, 'status' | 'connectUrl'>> = {
    'google-fit': {
      name: 'Google Fit',
      id: 'google-fit',
      icon: <Activity className="h-6 w-6 text-blue-500" />,
      description: 'Connect with Google Fit to sync your activity, workouts, sleep data and more.',
      features: ['Steps', 'Activity', 'Sleep', 'Heart Rate', 'Workout History']
    },
    'apple-health': {
      name: 'Apple Health',
      id: 'apple-health',
      icon: <Activity className="h-6 w-6 text-red-500" />,
      description: 'Sync your Apple Health data through the iOS app. Note: requires iOS device.',
      features: ['Steps', 'Activity', 'Sleep', 'Nutrition', 'Vitals', 'Workout History']
    },
    'fitbit': {
      name: 'Fitbit',
      id: 'fitbit',
      icon: <Watch className="h-6 w-6 text-teal-500" />,
      description: 'Connect your Fitbit device to sync activity, sleep, and heart rate data.',
      features: ['Steps', 'Activity', 'Sleep', 'Heart Rate', 'Workout History']
    },
    'strava': {
      name: 'Strava',
      id: 'strava',
      icon: <Map className="h-6 w-6 text-orange-500" />,
      description: 'Connect with Strava to import your runs, rides, and other activities.',
      features: ['Running', 'Cycling', 'Swimming', 'GPS Routes', 'Workout History']
    }
  };
  
  // Combine API data with config data
  const trackersData: TrackerInfo[] = Object.values(trackerConfig).map(tracker => {
    const apiData = trackers?.availableServices ? {
      status: trackers.availableServices[tracker.id] ? 'disconnected' : 'error'
    } : {
      status: 'disconnected'
    };
    
    return {
      ...tracker,
      ...apiData
    };
  });
  
  const selectedTracker = trackersData.find(t => t.id === activeTracker);
  
  const handleConnect = (trackerId: string) => {
    getAuthUrl(trackerId);
  };
  
  const handleDisconnect = (trackerId: string) => {
    // Implement disconnect logic
    console.log(`Disconnecting ${trackerId}`);
  };
  
  // Check if we're returning from an OAuth flow
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const provider = urlParams.get('provider');
    
    if (provider) {
      // Update UI to show connected status
      // In a real app, you'd verify the connection on the server
      setActiveTracker(provider);
      
      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Fitness Trackers</h2>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load fitness trackers. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue={activeTracker} onValueChange={setActiveTracker} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            {trackersData.map(tracker => (
              <TabsTrigger key={tracker.id} value={tracker.id} className="relative">
                {tracker.name}
                {tracker.status === 'connected' && (
                  <Badge variant="outline" className="absolute -top-2 -right-2">
                    <Check className="h-3 w-3 text-green-500" />
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {trackersData.map(tracker => (
            <TabsContent key={tracker.id} value={tracker.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    {tracker.icon}
                    <div>
                      <CardTitle>{tracker.name}</CardTitle>
                      <CardDescription>{tracker.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Status</h4>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            tracker.status === 'connected' ? 'default' :
                            tracker.status === 'error' ? 'destructive' : 'outline'
                          }
                        >
                          {tracker.status === 'connected' ? 'Connected' :
                           tracker.status === 'connecting' ? 'Connecting...' :
                           tracker.status === 'error' ? 'Unavailable' : 'Not Connected'}
                        </Badge>
                        
                        {tracker.status === 'connected' && tracker.lastSync && (
                          <span className="text-xs text-muted-foreground">
                            Last synced: {new Date(tracker.lastSync).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Available Data</h4>
                      <div className="flex flex-wrap gap-2">
                        {tracker.features.map(feature => (
                          <Badge key={feature} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {tracker.status === 'disconnected' ? (
                    <Button 
                      onClick={() => handleConnect(tracker.id)}
                      disabled={tracker.status === 'error'}
                    >
                      Connect {tracker.name}
                    </Button>
                  ) : tracker.status === 'connected' ? (
                    <>
                      <Button variant="outline" onClick={() => {}}>
                        Sync Now
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDisconnect(tracker.id)}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : null}
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle, Activity, Watch, Map, RefreshCcw, Key } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { getQueryFn, apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

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
    queryKey: ['/api/fitness/status'],
    queryFn: getQueryFn<any>({ on401: 'returnNull' }),
    enabled: !!user,
    retry: 2,
    refetchOnWindowFocus: false
  });
  
  // Fetch tracker authentication URL
  const getAuthUrl = async (trackerId: string) => {
    try {
      const response = await apiRequest(`/api/fitness/${trackerId}/auth`, {
        method: 'GET'
      });
      
      if (response.url) {
        window.location.href = response.url;
      } else {
        toast({
          title: `Connection Error`,
          description: `Unable to connect to ${trackerConfig[trackerId].name}. Please try again later.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error getting auth URL for ${trackerId}:`, error);
      toast({
        title: `Connection Error`,
        description: `Failed to connect to ${trackerConfig[trackerId].name}. Please check your network connection and try again.`,
        variant: "destructive"
      });
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
    // For type safety, explicitly define the status as TrackerStatus
    const status: TrackerStatus = trackers?.availableServices && !trackers.availableServices[tracker.id] 
      ? 'error' 
      : 'disconnected';
    
    return {
      ...tracker,
      status
    };
  });
  
  const selectedTracker = trackersData.find(t => t.id === activeTracker);
  
  const handleConnect = (trackerId: string) => {
    // Check if the service is available first
    if (trackers?.availableServices && !trackers.availableServices[trackerId]) {
      // Service requires API keys, show a message to the user
      toast({
        title: `${trackerConfig[trackerId].name} API Keys Required`,
        description: `To connect with ${trackerConfig[trackerId].name}, we need API keys. Please contact the administrator to set up this integration.`,
        variant: "destructive"
      });
      
      const requiredSecrets = getRequiredSecrets(trackerId);
      if (requiredSecrets.length > 0) {
        console.log(`Service ${trackerId} requires the following API keys:`, requiredSecrets);
      }
      
      return;
    }
    
    getAuthUrl(trackerId);
  };
  
  const handleDisconnect = (trackerId: string) => {
    // Implement disconnect logic
    console.log(`Disconnecting ${trackerId}`);
    
    toast({
      title: `${trackerConfig[trackerId].name} Disconnected`,
      description: `Your ${trackerConfig[trackerId].name} account has been disconnected successfully.`,
    });
  };
  
  // Helper to determine required secrets for each service
  const getRequiredSecrets = (trackerId: string): string[] => {
    switch (trackerId) {
      case 'google-fit':
        return ['GOOGLE_FIT_CLIENT_ID', 'GOOGLE_FIT_CLIENT_SECRET'];
      case 'fitbit':
        return ['FITBIT_CLIENT_ID', 'FITBIT_CLIENT_SECRET'];
      case 'strava':
        return ['STRAVA_CLIENT_ID', 'STRAVA_CLIENT_SECRET'];
      case 'apple-health':
        return []; // Apple Health uses file upload, no API keys needed
      default:
        return [];
    }
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
                      disabled={tracker.status !== 'disconnected'}
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
                  ) : tracker.status === 'error' ? (
                    <div className="flex flex-col gap-2 items-end">
                      <span className="text-xs text-muted-foreground">
                        This service requires API keys to function
                      </span>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                        onClick={() => {
                          const requiredSecrets = getRequiredSecrets(tracker.id);
                          toast({
                            title: `${tracker.name} API Keys Required`,
                            description: `Required secrets for ${tracker.name}: ${requiredSecrets.join(', ')}`,
                            variant: "default"
                          });
                          console.log(`To enable ${tracker.name}, add these API keys:`, requiredSecrets);
                        }}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Add API Keys
                      </Button>
                    </div>
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
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check, AlertTriangle, RefreshCw, Power } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ActivationResult {
  timestamp: string;
  results: Record<string, {
    status: string;
    message: string;
    url?: string;
    lastSync?: string;
    syncResult?: {
      status: string;
      data?: any;
      message?: string;
    };
  }>;
}

export default function FitnessDeviceManager() {
  const { user } = useUser();
  const userId = user?.id || 1;
  const queryClient = useQueryClient();
  const [activationResult, setActivationResult] = useState<ActivationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Mutation for activating fitness integrations
  const { mutate: activateIntegrations, isPending: isActivating } = useMutation({
    mutationFn: async () => {
      try {
        setErrorMessage(null);
        const response = await apiRequest('/api/fitness/activate', {
          method: 'POST',
          body: JSON.stringify({
            userId,
            services: ['google-fit', 'apple-health', 'fitbit', 'strava'],
            syncNow: true,
            logResults: true
          })
        });
        setActivationResult(response);
        return response;
      } catch (error) {
        setErrorMessage('Failed to activate fitness integrations. Please try again.');
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate queries that might be affected
      queryClient.invalidateQueries({ queryKey: ['/api/fitness/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/fitness-trackers/health'] });
    }
  });
  
  // Mutation for testing fitness integrations
  const { mutate: testIntegrations, isPending: isTesting } = useMutation({
    mutationFn: async () => {
      try {
        setErrorMessage(null);
        const response = await apiRequest(`/api/fitness/test?userId=${userId}`, {
          method: 'GET'
        });
        return response;
      } catch (error) {
        setErrorMessage('Failed to test fitness integrations. Please try again.');
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Test results:', data);
      // You could display these results in the UI
    }
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fitness Device Management</CardTitle>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-sm text-muted-foreground mb-4">
          <p className="mb-2">
            Use these controls to manage your fitness device connections and data synchronization.
          </p>
          <p>
            <strong>Activate All:</strong> Checks and activates all connected fitness services.
          </p>
          <p>
            <strong>Test Connections:</strong> Verifies that all your device connections are working properly.
          </p>
        </div>
        
        {activationResult && (
          <div className="mb-4 border rounded-md p-4">
            <h3 className="text-sm font-medium mb-2">Activation Results</h3>
            {Object.entries(activationResult.results).map(([service, result]) => (
              <div key={service} className="flex items-center mb-2 text-sm">
                <div className="mr-2">
                  {result.status === 'success' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : result.status === 'not_connected' ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <span className="font-medium capitalize">{service.replace(/-/g, ' ')}: </span>
                  <span>{result.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button
          onClick={() => activateIntegrations()}
          disabled={isActivating}
          className="flex items-center"
        >
          {isActivating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Power className="h-4 w-4 mr-2" />
          )}
          Activate All Services
        </Button>
        
        <Button
          variant="outline"
          onClick={() => testIntegrations()}
          disabled={isTesting}
          className="flex items-center"
        >
          {isTesting ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Test Connections
        </Button>
      </CardFooter>
    </Card>
  );
}
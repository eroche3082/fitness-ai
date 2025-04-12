import React, { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { initializeFitnessAI } from '@/lib/fitnessService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function FitnessSystemInitializer() {
  const { user } = useUser();
  const [initializing, setInitializing] = useState(false);
  const [initializationResult, setInitializationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      if (!user) return;
      
      setInitializing(true);
      setError(null);
      
      try {
        // Define the fitness services with their required configuration
        const services = [
          {
            name: "Google Fit",
            serviceId: "google-fit",
            requiredSecrets: ["GOOGLE_FIT_CLIENT_ID", "GOOGLE_FIT_CLIENT_SECRET"],
            authUrl: "/api/fitness/google-fit/auth",
            syncUrl: "/api/fitness/google-fit/sync",
          },
          {
            name: "Apple Health",
            serviceId: "apple-health",
            mode: "file-upload",
            uploadUrl: "/api/fitness/apple-health/upload",
          },
          {
            name: "Fitbit",
            serviceId: "fitbit",
            requiredSecrets: ["FITBIT_CLIENT_ID", "FITBIT_CLIENT_SECRET"],
            authUrl: "/api/fitness/fitbit/auth",
            syncUrl: "/api/fitness/fitbit/sync",
          },
          {
            name: "Strava",
            serviceId: "strava",
            requiredSecrets: ["STRAVA_CLIENT_ID", "STRAVA_CLIENT_SECRET"],
            authUrl: "/api/fitness/strava/auth",
            syncUrl: "/api/fitness/strava/sync",
          },
        ];

        // Call the initialization API with user data and service configurations
        const result = await initializeFitnessAI({
          userId: user.id,
          language: user.language || 'en',
          services
        });

        setInitializationResult(result);
        console.log("✅ Fitness AI System initialized:", result);

        // Check for missing secrets that might need to be provided
        if (result.missingSecrets && result.missingSecrets.length > 0) {
          console.warn("Some fitness services require API keys:", result.missingSecrets);
        }
      } catch (err) {
        setError(`Failed to initialize Fitness AI system: ${(err as Error).message}`);
        console.error("Error initializing Fitness AI:", err);
      } finally {
        setInitializing(false);
      }
    }

    initialize();
  }, [user]);

  // This component doesn't render anything visible except error messages
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Initialization Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (initializing) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">Initializing fitness tracking system...</span>
      </div>
    );
  }

  // Render nothing if everything is fine
  return null;
}
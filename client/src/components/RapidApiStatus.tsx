import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Shield } from "lucide-react";

interface ApiStatus {
  name: string;
  status: 'active' | 'inactive' | 'error';
  description: string;
}

export default function RapidApiStatus() {
  const [status, setStatus] = useState<{ apis: Record<string, any> } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ status: string; apis: Record<string, any> }>('/api/rapid-api/status');
      setStatus(response);
    } catch (err) {
      setError('Error al verificar el estado de las APIs');
      console.error('Error fetching Rapid API status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiStatus();
  }, []);

  // Lista de APIs disponibles
  const availableApis: ApiStatus[] = [
    {
      name: 'Exercise Database',
      status: status?.apis?.exerciseDb ? 'active' : 'inactive',
      description: 'Comprehensive database of exercises with details and images'
    },
    {
      name: 'Nutrition Analysis',
      status: 'active',
      description: 'Food plate analysis and nutritional information'
    },
    {
      name: 'BMI Calculator',
      status: 'active',
      description: 'Body Mass Index calculation in metric and imperial units'
    },
    {
      name: 'Fitness Metrics',
      status: 'active',
      description: 'Advanced fitness calculations including TDEE, body fat, and more'
    },
    {
      name: 'Gym-Fit Exercise Search',
      status: 'active',
      description: 'Search exercises by body part, equipment, and more'
    },
    {
      name: 'Motivation Quotes',
      status: 'active',
      description: 'Inspirational fitness and wellness quotes'
    },
    {
      name: 'Health Calculator',
      status: 'active',
      description: 'Various health metrics calculators including HOMA-IR'
    },
    {
      name: 'Muscle Group Visualization',
      status: 'active',
      description: 'Visual representation of muscle groups for exercise targeting'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Rapid API Integrations</CardTitle>
            <CardDescription>
              Third-party fitness and nutrition APIs status
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchApiStatus}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableApis.map((api, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{api.name}</CardTitle>
                  <Badge className={api.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>
                    {api.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex items-start space-x-2">
                  {api.status === 'active' ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                  )}
                  <p className="text-xs text-muted-foreground">
                    {api.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <Separator className="mb-3" />
        <div className="flex items-center text-xs text-muted-foreground">
          <Shield className="h-4 w-4 mr-2 text-primary" />
          <span>
            All API requests are secured and authenticated with your Rapid API key.
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
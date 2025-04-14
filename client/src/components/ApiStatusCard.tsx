import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleCheck, CircleX, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface ApiStatusCardProps {
  title: string;
  apiName: string;
  description?: string;
  showQuota?: boolean;
}

export default function ApiStatusCard({ 
  title, 
  apiName, 
  description,
  showQuota = false
}: ApiStatusCardProps) {
  // Use React Query to fetch the status
  const { 
    data: status, 
    isLoading, 
    error, 
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['/api/billing-status'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  // Determine the status based on the API response
  const isActive = status?.isActive || false;
  const message = status?.message || '';
  const errorMessage = status?.error || (error ? 'Failed to fetch API status' : '');
  const quotaInfo = status?.quotaLimits && status?.quotaUsage ? {
    limits: status.quotaLimits,
    usage: status.quotaUsage
  } : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge 
            variant={isActive ? "default" : "destructive"}
            className={`ml-2 ${isActive ? "bg-green-500" : ""}`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <CardDescription>{description || `Status of the ${apiName} API integration`}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-start">
            {isActive ? (
              <CircleCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <CircleX className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium">
                {isActive ? 'API is operational' : 'API is not operational'}
              </p>
              <p className="text-sm text-muted-foreground">
                {message || (isActive ? 'The API is responding correctly.' : 'Check your API configuration.')}
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-start mt-2">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
            </div>
          )}

          {showQuota && quotaInfo && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium mb-2">API Quota Usage</h4>
              {Object.keys(quotaInfo.limits).map(key => {
                const limit = quotaInfo.limits[key];
                const usage = quotaInfo.usage[key] || 0;
                const percentage = Math.round((usage / limit) * 100);
                
                return (
                  <div key={key} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>{key}</span>
                      <span>{usage} / {limit} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          percentage > 80 ? 'bg-red-500' : 
                          percentage > 50 ? 'bg-amber-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          Project ID: {status?.projectId || 'Unknown'}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
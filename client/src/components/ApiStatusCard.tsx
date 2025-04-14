/**
 * API Status Card Component
 * 
 * This component displays status information for a Google Cloud API service,
 * including quota limits, usage, and error details.
 */

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Check, AlertTriangle, HelpCircle, ExternalLink, RefreshCw } from 'lucide-react';

// Define interfaces for component props
interface ApiStatus {
  isActive: boolean;
  message: string;
  error?: string;
  quotaLimits?: Record<string, number>;
  quotaUsage?: Record<string, number>;
  projectId?: string;
}

interface ServiceAssignment {
  group: string;
}

interface ApiDetails {
  id: string;
  name: string;
  description: string;
  status: ApiStatus;
  assignment: ServiceAssignment;
}

interface ApiStatusCardProps {
  api: ApiDetails;
  groupName: string;
  onInitialize: () => void;
}

export default function ApiStatusCard({ api, groupName, onInitialize }: ApiStatusCardProps) {
  const getCardBorderClass = () => {
    if (!api.status.isActive) {
      return 'border-amber-300';
    }
    return '';
  };

  const getStatusBadge = () => {
    if (api.status.isActive) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Check className="h-3 w-3 mr-1" /> Active
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <AlertTriangle className="h-3 w-3 mr-1" /> Limited
        </Badge>
      );
    }
  };

  // Calculate total quota usage in percentage
  const calculateTotalUsage = () => {
    if (!api.status.quotaLimits || !api.status.quotaUsage) {
      return 0;
    }

    let totalUsage = 0;
    let totalLimit = 0;

    Object.keys(api.status.quotaLimits).forEach(key => {
      const limit = api.status.quotaLimits?.[key] || 0;
      const usage = api.status.quotaUsage?.[key] || 0;
      
      totalUsage += usage;
      totalLimit += limit;
    });

    return totalLimit > 0 ? Math.min(100, Math.round((totalUsage / totalLimit) * 100)) : 0;
  };

  const totalUsagePercent = calculateTotalUsage();

  return (
    <TooltipProvider>
      <Card className={`overflow-hidden ${getCardBorderClass()}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base">{api.name}</CardTitle>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-muted-foreground">{api.id}</p>
        </CardHeader>
        
        <CardContent className="pb-3">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Badge 
                  variant="outline"
                  className="mr-2"
                >
                  {groupName}
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">This service is assigned to the {groupName} API key group</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div>
                {api.status.projectId && (
                  <span className="text-xs text-muted-foreground">
                    Project: {api.status.projectId}
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-sm">{api.description}</p>
            
            {!api.status.isActive && api.status.error && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-2 text-xs text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5 inline-block mr-1" />
                {api.status.error}
              </div>
            )}
            
            {api.status.quotaLimits && Object.keys(api.status.quotaLimits).length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Quota Usage</span>
                  <span className="text-xs font-medium">{totalUsagePercent}%</span>
                </div>
                <Progress value={totalUsagePercent} className="h-1.5" />
                
                <div className="space-y-1 text-xs">
                  {Object.entries(api.status.quotaLimits).map(([key, limit]) => {
                    const usage = api.status.quotaUsage?.[key] || 0;
                    const usagePercent = Math.min(100, Math.round((usage / limit) * 100));
                    
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}</span>
                        <span>{usage} / {limit}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <div className="flex justify-between w-full gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onInitialize}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Reinitialize
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open(`https://console.cloud.google.com/apis/api/${api.id}/overview`, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Console
            </Button>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
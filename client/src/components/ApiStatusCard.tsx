/**
 * API Status Card Component
 * 
 * This component displays status information for a Google Cloud API service,
 * including quota limits, usage, and error details.
 */

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Banknote, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp, 
  CloudOff, 
  Key, 
  RotateCw, 
  ShieldAlert 
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

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

const ApiStatusCard: React.FC<ApiStatusCardProps> = ({ 
  api, 
  groupName, 
  onInitialize 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const { id, name, description, status } = api;
  const { isActive, message, error, quotaLimits, quotaUsage, projectId } = status;
  
  // Format the quota limits and usage for display
  const formatQuota = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };
  
  // Calculate quota usage percentages
  const getQuotaPercentage = (key: string): number => {
    if (!quotaLimits || !quotaUsage || !quotaLimits[key] || !quotaUsage[key]) {
      return 0;
    }
    
    return Math.min(100, Math.round((quotaUsage[key] / quotaLimits[key]) * 100));
  };
  
  // Handle the initialize button click
  const handleInitialize = async () => {
    try {
      setIsInitializing(true);
      await onInitialize();
    } finally {
      setIsInitializing(false);
    }
  };
  
  // Toggle the expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <Card className={`border ${isActive ? 'border-green-200' : 'border-red-200'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base flex items-start gap-2">
              {isActive ? (
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
              ) : (
                <CloudOff className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
              )}
              <div>
                <span>{name}</span>
                <div className="text-xs font-normal text-muted-foreground">
                  {id}
                </div>
              </div>
            </CardTitle>
          </div>
          <Badge 
            variant={isActive ? "outline" : "secondary"} 
            className="text-xs"
          >
            <Key className="h-3 w-3 mr-1" />
            {groupName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground mb-2">
          {description}
        </div>
        
        <div className="text-sm">
          <div className={`${isActive ? 'text-green-600' : 'text-red-600'} font-medium`}>
            {message}
          </div>
          {error && (
            <div className="text-xs text-red-500 mt-1 flex items-center">
              <ShieldAlert className="h-3 w-3 mr-1 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        {/* Quota Information (only shown if active) */}
        {isActive && quotaLimits && quotaUsage && Object.keys(quotaLimits).length > 0 && (
          <div className="mt-3">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="quota">
                <AccordionTrigger className="py-2 text-xs font-medium">
                  <span className="flex items-center">
                    <Banknote className="h-3 w-3 mr-1" />
                    Quota Usage
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {Object.keys(quotaLimits).map((key) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{key}</span>
                          <span>
                            {quotaUsage[key] ? formatQuota(quotaUsage[key]) : '0'} / {formatQuota(quotaLimits[key])}
                          </span>
                        </div>
                        <Progress value={getQuotaPercentage(key)} className="h-1" />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
        
        {/* Additional details (shown when expanded) */}
        {isExpanded && (
          <div className="mt-3 border-t pt-3 text-xs">
            <ScrollArea className="h-32">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Status:</span> {isActive ? 'Active' : 'Inactive'}
                </div>
                <div>
                  <span className="font-medium">Service ID:</span> {id}
                </div>
                <div>
                  <span className="font-medium">API Key Group:</span> {groupName}
                </div>
                {projectId && (
                  <div>
                    <span className="font-medium">Project ID:</span> {projectId}
                  </div>
                )}
                {message && (
                  <div>
                    <span className="font-medium">Message:</span> {message}
                  </div>
                )}
                {error && (
                  <div>
                    <span className="font-medium">Error:</span> {error}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-1 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              More
            </>
          )}
        </Button>
        
        <Button
          variant={isActive ? "outline" : "default"}
          size="sm"
          className="h-8 px-3"
          onClick={handleInitialize}
          disabled={isInitializing}
        >
          <RotateCw className={`h-3 w-3 mr-1 ${isInitializing ? 'animate-spin' : ''}`} />
          {isActive ? 'Refresh' : 'Initialize'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiStatusCard;
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";

// Billing status interface
interface BillingStatus {
  isActive: boolean;
  projectId: string;
  billingAccount?: string;
  quotaLimits?: Record<string, number>;
  quotaUsage?: Record<string, number>;
  creditRemaining?: number;
  creditTotal?: number;
  error?: string;
  message?: string;
}

export function ApiStatusCard() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBillingStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest('GET', '/api/billing-status');
      const data = await response.json();
      
      setStatus(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch API status:', err);
      setError(err.message || 'Failed to fetch API status');
      setLoading(false);
      
      toast({
        title: "Error checking API status",
        description: err.message || 'Failed to fetch API status',
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBillingStatus();
  }, []);

  const handleRefresh = () => {
    fetchBillingStatus();
    toast({
      title: "Refreshing API Status",
      description: "Checking current billing and quota status...",
    });
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
            API Status Check
          </CardTitle>
          <CardDescription>
            Checking Google Cloud API status and billing information...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 size={32} className="animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <XCircle className="h-4 w-4 mr-2" /> 
            API Status Error
          </CardTitle>
          <CardDescription>
            There was a problem checking the API status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" /> Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <Card className={`w-full ${status.isActive ? 'border-green-400' : 'border-destructive'}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {status.isActive ? (
              <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
            ) : (
              <XCircle className="h-4 w-4 mr-2 text-destructive" />
            )}
            Google Cloud API Status
          </CardTitle>
          <Badge variant={status.isActive ? "outline" : "destructive"} className={status.isActive ? "bg-green-100 text-green-800 border-green-200" : ""}>
            {status.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardDescription>
          Project ID: {status.projectId}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {status.message && (
          <div className="bg-muted p-3 rounded-md text-sm">
            {status.message}
          </div>
        )}
        
        {status.creditTotal && status.creditRemaining && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">API Credits</span>
              <span className="text-sm font-medium">
                ${status.creditRemaining.toFixed(2)} / ${status.creditTotal.toFixed(2)}
              </span>
            </div>
            <Progress 
              value={(status.creditRemaining / status.creditTotal) * 100} 
              className="h-2"
            />
          </div>
        )}
        
        {status.quotaLimits && status.quotaUsage && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">API Quota Usage</h4>
            
            {Object.entries(status.quotaLimits).map(([api, limit]) => {
              const usage = status.quotaUsage?.[api] || 0;
              const percentUsage = Math.min(100, (usage / limit) * 100);
              
              return (
                <div key={api} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>{api}</span>
                    <span>{usage} / {limit}</span>
                  </div>
                  <Progress value={percentUsage} className="h-1" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      <Separator />
      
      <CardFooter className="pt-4">
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh Status
        </Button>
      </CardFooter>
    </Card>
  );
}
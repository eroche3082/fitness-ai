import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";

interface CurrentKeyInfo {
  usingKey: boolean;
  keySource: string;
  activeKeyName: string;
  projectId: string;
  region: string;
  availableKeys: Record<string, boolean>;
  envData: string;
  configValue: string;
}

interface ApiUsage {
  name: string;
  usage: number;
  limit: number;
}

interface ApiKeyManagerProps {
  className?: string;
}

export function ApiKeyManager({ className }: ApiKeyManagerProps) {
  const [currentKey, setCurrentKey] = useState<CurrentKeyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [usageData, setUsageData] = useState<Record<string, ApiUsage[]>>({});
  const { toast } = useToast();

  const fetchCurrentKey = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/billing-status/current-key');
      const data = await response.json();
      setCurrentKey(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch current key info:", error);
      toast({
        title: "Error",
        description: "Failed to fetch API key information",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchApiUsage = async () => {
    try {
      // For each API key, fetch usage metrics
      const vertexResponse = await fetch('/api/billing-status/vertex');
      const vertexData = await vertexResponse.json();
      
      if (vertexData.isActive && vertexData.quotaLimits && vertexData.quotaUsage) {
        const usageMetrics: ApiUsage[] = [];
        
        Object.keys(vertexData.quotaLimits).forEach(metric => {
          usageMetrics.push({
            name: metric,
            usage: vertexData.quotaUsage[metric] || 0,
            limit: vertexData.quotaLimits[metric] || 0
          });
        });
        
        setUsageData(prev => ({
          ...prev,
          [currentKey?.activeKeyName || 'default']: usageMetrics
        }));
      }
    } catch (error) {
      console.error("Failed to fetch API usage:", error);
    }
  };

  const switchApiKey = async (keyName: string) => {
    try {
      setSwitching(true);
      const response = await fetch('/api/billing-status/switch-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyName }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `Switched to API key: ${keyName}`,
          variant: "default"
        });
        
        // Refresh key info
        await fetchCurrentKey();
        // After switching, fetch usage data for the new key
        await fetchApiUsage();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to switch API key",
          variant: "destructive",
        });
      }
      setSwitching(false);
    } catch (error) {
      console.error("Failed to switch API key:", error);
      toast({
        title: "Error",
        description: "Failed to switch API key",
        variant: "destructive",
      });
      setSwitching(false);
    }
  };

  useEffect(() => {
    fetchCurrentKey();
  }, []);

  useEffect(() => {
    if (currentKey) {
      fetchApiUsage();
    }
  }, [currentKey]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>API Key Manager</CardTitle>
          <CardDescription>Loading API key information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>API Key Manager</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchCurrentKey} 
            disabled={loading || switching}
            title="Refresh API Key Information"
          >
            <RefreshCw className={`h-4 w-4 ${loading || switching ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
        <CardDescription>
          Manage your Google Cloud API keys to optimize quota usage
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentKey && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Active API Key</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="px-2 py-1 text-xs font-medium">
                  {currentKey.activeKeyName}
                </Badge>
                {currentKey.usingKey ? (
                  <Badge variant="outline" className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="px-2 py-1 text-xs font-medium">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Project ID: {currentKey.projectId} • Region: {currentKey.region}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">Available API Keys</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(currentKey.availableKeys).map(([keyName, available]) => (
                  <Button
                    key={keyName}
                    size="sm"
                    variant={currentKey.activeKeyName === keyName ? "default" : "outline"}
                    className={`justify-start ${!available ? 'opacity-50' : ''}`}
                    disabled={!available || currentKey.activeKeyName === keyName || switching}
                    onClick={() => available && switchApiKey(keyName)}
                  >
                    <span className="truncate">{keyName}</span>
                    {switching && currentKey.activeKeyName !== keyName && (
                      <RefreshCw className="ml-2 h-3 w-3 animate-spin" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {usageData[currentKey.activeKeyName] && (
              <div className="space-y-4 mt-4">
                <h3 className="text-sm font-medium">API Usage Metrics</h3>
                <div className="space-y-3">
                  {usageData[currentKey.activeKeyName].map((usage, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{usage.name}</span>
                        <span>{usage.usage} / {usage.limit}</span>
                      </div>
                      <Progress 
                        value={(usage.usage / usage.limit) * 100} 
                        className={`h-2 ${
                          (usage.usage / usage.limit) > 0.8 
                            ? "[&>div]:bg-red-500" 
                            : (usage.usage / usage.limit) > 0.5 
                              ? "[&>div]:bg-amber-500" 
                              : ""
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
/**
 * API Key Manager Component
 * 
 * This component manages Google Cloud API keys and service assignments.
 * It displays the status of all available APIs and allows reassignment to different key groups.
 */

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Check, AlertTriangle, X } from 'lucide-react';
import ApiStatusCard from './ApiStatusCard';
import ServiceAssignmentManager from './ServiceAssignmentManager';
import { apiRequest } from '../lib/queryClient';

// Define interface for API status
interface ApiStatus {
  isActive: boolean;
  message: string;
  error?: string;
  quotaLimits?: Record<string, number>;
  quotaUsage?: Record<string, number>;
  projectId?: string;
}

// Define interface for service assignment
interface ServiceAssignment {
  group: string;
}

// Define interface for API details
interface ApiDetails {
  id: string;
  name: string;
  description: string;
  status: ApiStatus;
  assignment: ServiceAssignment;
}

// Define interface for API key group
interface ApiKeyGroup {
  name: string;
  priority: number;
  services: string[];
}

export default function ApiKeyManager() {
  // State for API data
  const [availableApis, setAvailableApis] = useState<ApiDetails[]>([]);
  const [missingApis, setMissingApis] = useState<ApiDetails[]>([]);
  const [apiKeyGroups, setApiKeyGroups] = useState<ApiKeyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch API data on component mount
  useEffect(() => {
    fetchApiData();
  }, []);

  // Function to fetch API data
  const fetchApiData = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('GET', '/api/google-cloud/services');
      const data = await response.json();
      
      setAvailableApis(data.availableServices || []);
      setMissingApis(data.missingServices || []);
      setApiKeyGroups(data.apiKeyGroups || []);
    } catch (error) {
      console.error('Error fetching API data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to refresh API data
  const refreshApiData = async () => {
    setRefreshing(true);
    await fetchApiData();
    setRefreshing(false);
  };

  // Function to handle API service assignment change
  const handleAssignmentChange = async (serviceId: string, groupName: string) => {
    try {
      await apiRequest('POST', '/api/google-cloud/services/assign', {
        serviceId,
        groupName
      });
      
      // Update local state to reflect the change
      setAvailableApis(prev => prev.map(api => {
        if (api.id === serviceId) {
          return {
            ...api,
            assignment: { group: groupName }
          };
        }
        return api;
      }));
    } catch (error) {
      console.error('Error assigning service:', error);
    }
  };

  // Function to initialize a missing service
  const handleInitializeService = async (serviceId: string) => {
    try {
      await apiRequest('POST', '/api/google-cloud/services/initialize', {
        serviceId
      });
      
      // Refresh data after initializing
      await fetchApiData();
    } catch (error) {
      console.error('Error initializing service:', error);
    }
  };

  // Group available APIs by their assignment group
  const apisByGroup = availableApis.reduce((acc, api) => {
    const group = api.assignment.group;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(api);
    return acc;
  }, {} as Record<string, ApiDetails[]>);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading API status...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">API Key Status</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {availableApis.length} services active, {missingApis.length} services unavailable
              </p>
            </div>
            <Button 
              onClick={refreshApiData} 
              variant="outline" 
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>

          <div className="space-y-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="all">All Services</TabsTrigger>
                <TabsTrigger value="assignment">Service Assignment</TabsTrigger>
                <TabsTrigger value="quotas">Quota Usage</TabsTrigger>
                <TabsTrigger value="missing">
                  Missing Services
                  {missingApis.length > 0 && (
                    <Badge variant="destructive" className="ml-2">{missingApis.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6 pt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">All Google Cloud Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableApis.map(api => (
                      <ApiStatusCard 
                        key={api.id} 
                        api={api} 
                        groupName={api.assignment.group}
                        onInitialize={() => handleInitializeService(api.id)}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="assignment" className="pt-4">
                <ServiceAssignmentManager
                  availableApis={availableApis}
                  missingApis={missingApis}
                  apiKeyGroups={apiKeyGroups}
                  onAssignmentChange={handleAssignmentChange}
                  onInitializeService={handleInitializeService}
                />
              </TabsContent>

              <TabsContent value="quotas" className="pt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quota Usage by Service</h3>
                  <div className="space-y-6">
                    {Object.entries(apisByGroup).map(([group, apis]) => (
                      <div key={group} className="space-y-4">
                        <h4 className="text-md font-medium flex items-center">
                          <Badge className="mr-2">{group}</Badge>
                          <span>Group Services ({apis.length})</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {apis.map(api => (
                            <div key={api.id} className="border rounded-lg p-4 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium">{api.name}</h5>
                                {api.status.isActive ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <Check className="h-3 w-3 mr-1" /> Active
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    <AlertTriangle className="h-3 w-3 mr-1" /> Limited
                                  </Badge>
                                )}
                              </div>
                              
                              {api.status.quotaLimits && (
                                <div className="space-y-2 mt-4">
                                  <p className="text-xs text-muted-foreground">Quota Usage</p>
                                  {Object.entries(api.status.quotaLimits).map(([key, limit]) => {
                                    const usage = api.status.quotaUsage?.[key] || 0;
                                    const percentUsed = Math.min(100, Math.round((usage / limit) * 100));
                                    
                                    return (
                                      <div key={key} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                          <span>{key}</span>
                                          <span>{usage} / {limit} ({percentUsed}%)</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full ${percentUsed > 80 ? 'bg-red-500' : 'bg-primary'}`}
                                            style={{ width: `${percentUsed}%` }}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="missing" className="pt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Missing or Inactive Services</h3>
                  {missingApis.length === 0 ? (
                    <div className="border rounded-lg p-8 text-center">
                      <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-lg font-medium">All services are operational</p>
                      <p className="text-sm text-muted-foreground mt-1">No missing or inactive services detected</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {missingApis.map(api => (
                        <div key={api.id} className="border rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{api.name}</h5>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <X className="h-3 w-3 mr-1" /> Inactive
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{api.description}</p>
                          <p className="text-xs text-red-600 mb-4">{api.status.error || "Service not initialized"}</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleInitializeService(api.id)}
                            className="w-full"
                          >
                            Initialize Service
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}
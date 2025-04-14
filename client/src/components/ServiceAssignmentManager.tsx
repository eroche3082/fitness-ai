/**
 * Service Assignment Manager Component
 * 
 * This component allows administrators to assign Google Cloud services to different API key groups
 * for optimal quota management and load balancing.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define interfaces for component props
interface ApiKeyGroup {
  name: string;
  priority: number;
  services: string[];
}

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

interface ServiceAssignmentManagerProps {
  availableApis: ApiDetails[];
  missingApis: ApiDetails[];
  apiKeyGroups: ApiKeyGroup[];
  onAssignmentChange: (serviceId: string, groupName: string) => void;
  onInitializeService: (serviceId: string) => void;
}

export default function ServiceAssignmentManager({
  availableApis,
  missingApis,
  apiKeyGroups,
  onAssignmentChange,
  onInitializeService
}: ServiceAssignmentManagerProps) {
  const [pendingAssignments, setPendingAssignments] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // Group services by their current assignment
  const servicesByGroup = availableApis.reduce((acc, api) => {
    const group = api.assignment.group;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(api);
    return acc;
  }, {} as Record<string, ApiDetails[]>);

  // Get total services per group
  const serviceCountByGroup = Object.entries(servicesByGroup).reduce((acc, [group, apis]) => {
    acc[group] = apis.length;
    return acc;
  }, {} as Record<string, number>);

  // Function to handle group selection change
  const handleGroupChange = (serviceId: string, newGroup: string) => {
    setPendingAssignments(prev => ({
      ...prev,
      [serviceId]: newGroup
    }));
  };

  // Function to apply a pending assignment change
  const applyAssignment = async (serviceId: string) => {
    const newGroup = pendingAssignments[serviceId];
    if (!newGroup) return;
    
    setSaving(prev => ({ ...prev, [serviceId]: true }));
    await onAssignmentChange(serviceId, newGroup);
    
    // Remove from pending assignments after successful change
    setPendingAssignments(prev => {
      const newPending = { ...prev };
      delete newPending[serviceId];
      return newPending;
    });
    
    setSaving(prev => ({ ...prev, [serviceId]: false }));
  };

  // Function to initialize a missing service
  const handleInitialize = (serviceId: string) => {
    onInitializeService(serviceId);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {apiKeyGroups.map(group => (
          <Card key={group.name} className={
            group.name === 'UNIVERSAL' 
              ? 'border-primary/30 bg-primary/5'
              : ''
          }>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Badge variant={group.name === 'UNIVERSAL' ? 'default' : 'outline'} className="mr-2">
                  {group.name}
                </Badge>
                Priority: {group.priority}
              </CardTitle>
              <CardDescription>
                {serviceCountByGroup[group.name] || 0} services assigned
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-muted-foreground mb-2">
                {group.name === 'UNIVERSAL' 
                  ? 'Primary API key with highest quota limits' 
                  : 'Secondary API key group with specialized quotas'}
              </p>
              {servicesByGroup[group.name] && servicesByGroup[group.name].length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-2">
                  {servicesByGroup[group.name].map(api => (
                    <Badge key={api.id} variant="secondary" className="text-xs">
                      {api.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No services assigned</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-4">Service Assignments</h3>
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Group</TableHead>
                <TableHead>New Group</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableApis.map(api => (
                <TableRow key={api.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{api.name}</span>
                      <span className="text-xs text-muted-foreground">{api.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {api.status.isActive ? (
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{api.status.message}</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-sm">Limited</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{api.assignment.group}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={pendingAssignments[api.id] || api.assignment.group}
                      onValueChange={(value) => handleGroupChange(api.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                      <SelectContent>
                        {apiKeyGroups.map(group => (
                          <SelectItem key={group.name} value={group.name}>
                            {group.name} (Priority: {group.priority})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    {pendingAssignments[api.id] && pendingAssignments[api.id] !== api.assignment.group ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => applyAssignment(api.id)}
                        disabled={saving[api.id]}
                        className="ml-2"
                      >
                        {saving[api.id] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span className="ml-1">Apply</span>
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">No changes</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Missing APIs section */}
              {missingApis.length > 0 && (
                <>
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/50">
                      <div className="font-semibold py-1">
                        Missing/Inactive Services
                      </div>
                    </TableCell>
                  </TableRow>
                  {missingApis.map(api => (
                    <TableRow key={api.id} className="bg-red-50/30">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{api.name}</span>
                          <span className="text-xs text-muted-foreground">{api.id}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <X className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-sm text-red-700">Inactive</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{api.status.error || "Service not initialized"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50">None</Badge>
                      </TableCell>
                      <TableCell>
                        <Select disabled={true} value="none">
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Not available" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleInitialize(api.id)}
                          className="text-red-700 border-red-300 hover:bg-red-50"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Initialize
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Google Cloud Console Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">API Keys Management</CardTitle>
              <CardDescription>
                Create and manage Google Cloud API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open GCP Credentials
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">API Quota Monitoring</CardTitle>
              <CardDescription>
                Monitor usage and adjust quotas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('https://console.cloud.google.com/apis/dashboard', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open GCP API Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
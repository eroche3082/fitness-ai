/**
 * Service Assignment Manager Component
 * 
 * This component allows administrators to assign Google Cloud services to different API key groups
 * for optimal quota management and load balancing.
 */

import React, { useMemo, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Cpu, 
  PlayCircle, 
  RefreshCcw, 
  ShieldAlert, 
  XCircle 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

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

const ServiceAssignmentManager: React.FC<ServiceAssignmentManagerProps> = ({
  availableApis,
  missingApis,
  apiKeyGroups,
  onAssignmentChange,
  onInitializeService
}) => {
  const [filter, setFilter] = useState('');
  
  // Combine all APIs
  const allApis = useMemo(() => {
    return [...availableApis, ...missingApis].sort((a, b) => a.name.localeCompare(b.name));
  }, [availableApis, missingApis]);
  
  // Filter APIs based on search input
  const filteredApis = useMemo(() => {
    if (!filter) return allApis;
    
    const lowerFilter = filter.toLowerCase();
    return allApis.filter(api => 
      api.name.toLowerCase().includes(lowerFilter) || 
      api.id.toLowerCase().includes(lowerFilter) ||
      api.description.toLowerCase().includes(lowerFilter) ||
      api.assignment.group.toLowerCase().includes(lowerFilter)
    );
  }, [allApis, filter]);
  
  // Handle assignment change
  const handleAssignmentChange = (serviceId: string, groupName: string) => {
    onAssignmentChange(serviceId, groupName);
  };
  
  // Handle initialize service
  const handleInitialize = (serviceId: string) => {
    onInitializeService(serviceId);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium flex items-center">
          <Cpu className="mr-2 h-4 w-4" />
          Service Assignments
        </h3>
        <div className="flex-1 max-w-sm ml-4">
          <Input
            placeholder="Filter services..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>
      
      <div className="border rounded-md">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[180px]">API Key Group</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApis.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No services found matching your filter criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredApis.map((api) => (
                  <TableRow key={api.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{api.name}</span>
                        <span className="text-xs text-muted-foreground">({api.id})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{api.description}</span>
                    </TableCell>
                    <TableCell>
                      {api.status.isActive ? (
                        <Badge variant="success" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                          <CheckCircle className="h-3 w-3" />
                          <span>Active</span>
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          <span>Inactive</span>
                        </Badge>
                      )}
                      {api.status.error && (
                        <div className="text-xs text-red-500 mt-1 flex items-center">
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          {api.status.error.length > 30 
                            ? `${api.status.error.substring(0, 30)}...` 
                            : api.status.error}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={api.assignment.group}
                        onValueChange={(value) => handleAssignmentChange(api.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          {apiKeyGroups.map((group) => (
                            <SelectItem key={group.name} value={group.name}>
                              <div className="flex items-center">
                                <span>{group.name}</span>
                                <Badge 
                                  variant="outline" 
                                  className="ml-2 text-xs"
                                >
                                  {group.priority}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleInitialize(api.id)}
                        className="h-8 px-3"
                      >
                        {api.status.isActive ? (
                          <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                        ) : (
                          <PlayCircle className="h-3.5 w-3.5 mr-1" />
                        )}
                        {api.status.isActive ? 'Refresh' : 'Initialize'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        <p>
          <span className="font-medium">Total services:</span> {allApis.length} | 
          <span className="font-medium text-green-600"> Active:</span> {availableApis.length} | 
          <span className="font-medium text-red-600"> Inactive:</span> {missingApis.length}
        </p>
      </div>
    </div>
  );
};

export default ServiceAssignmentManager;
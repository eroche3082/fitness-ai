import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw, Server } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ServiceAssignment {
  service: string;
  assignedGroup: string;
  status: 'active' | 'failed' | 'pending';
  timestamp: string;
}

interface ServiceAssignmentResponse {
  count: number;
  assignments: ServiceAssignment[];
}

interface ServiceAssignmentManagerProps {
  className?: string;
}

const availableServices = [
  { id: 'gemini', label: 'Gemini AI' },
  { id: 'vertex', label: 'Vertex AI' },
  { id: 'vision', label: 'Vision AI' },
  { id: 'speech', label: 'Speech Services' },
  { id: 'maps', label: 'Maps Platform' },
  { id: 'firebase', label: 'Firebase' },
  { id: 'bigquery', label: 'BigQuery' },
  { id: 'storage', label: 'Cloud Storage' },
];

export function ServiceAssignmentManager({ className }: ServiceAssignmentManagerProps) {
  const [assignments, setAssignments] = useState<ServiceAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/billing-status/service-assignments');
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: ServiceAssignmentResponse = await response.json();
      setAssignments(data.assignments);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch service assignments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch service assignments",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const initializeServices = async () => {
    try {
      if (selectedServices.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one service",
          variant: "destructive",
        });
        return;
      }
      
      setInitializing(true);
      const response = await fetch('/api/billing-status/initialize-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ services: selectedServices }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Warning",
          description: data.message,
          variant: "destructive",
        });
      }
      
      setOpen(false);
      fetchAssignments(); // Refresh assignments
      setInitializing(false);
    } catch (error) {
      console.error("Failed to initialize services:", error);
      toast({
        title: "Error",
        description: "Failed to initialize services",
        variant: "destructive",
      });
      setInitializing(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Group assignments by assigned API key group
  const assignmentsByGroup = assignments.reduce<Record<string, ServiceAssignment[]>>(
    (acc, assignment) => {
      if (!acc[assignment.assignedGroup]) {
        acc[assignment.assignedGroup] = [];
      }
      acc[assignment.assignedGroup].push(assignment);
      return acc;
    }, 
    {}
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Service Assignments</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchAssignments}
              disabled={loading}
              title="Refresh Service Assignments"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Initialize Services
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Initialize Google Cloud Services</DialogTitle>
                  <DialogDescription>
                    Select the services you need to initialize with the most optimal API keys.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div>
                      <Label>Services</Label>
                      <ScrollArea className="h-[200px] border rounded-md p-2 mt-1">
                        <div className="space-y-2">
                          {availableServices.map((service) => (
                            <div key={service.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={service.id}
                                checked={selectedServices.includes(service.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedServices([...selectedServices, service.id]);
                                  } else {
                                    setSelectedServices(selectedServices.filter(s => s !== service.id));
                                  }
                                }}
                              />
                              <Label htmlFor={service.id} className="flex-1 cursor-pointer">
                                {service.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={initializeServices}
                    disabled={initializing || selectedServices.length === 0}
                  >
                    {initializing && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                    Initialize
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription>
          Google Cloud services and their assigned API keys
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center p-6 border rounded-md">
            <Server className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base font-medium">No Service Assignments</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Initialize services to assign optimal API keys
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(assignmentsByGroup).map(([group, assignments]) => (
              <div key={group} className="space-y-2">
                <h3 className="text-sm font-medium flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {group}
                  </Badge>
                  API Key Group
                </h3>
                <div className="space-y-1">
                  {assignments.map((assignment, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <div className="flex items-center">
                        <span className="text-sm">{assignment.service}</span>
                      </div>
                      <Badge className={`${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
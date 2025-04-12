import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

// Tab status data
const tabStatus = {
  "tabs": [
    {
      "name": "Dashboard",
      "route": "/dashboard",
      "status": "✅",
      "api_connection": "✅",
      "responsive": "✅",
      "components_functional": "✅",
      "chatbot_context": "✅",
      "suggestions": [
        "Add activity summary filters",
        "Implement goal completion animation",
        "Add shareable achievement cards"
      ]
    },
    {
      "name": "Analytics",
      "route": "/analytics",
      "status": "❌",
      "api_connection": "❌",
      "responsive": "❌",
      "components_functional": "❌",
      "chatbot_context": "❌",
      "suggestions": [
        "Create data visualization components",
        "Implement progress tracking charts",
        "Add comparison view between time periods",
        "Connect to fitness tracker APIs"
      ]
    },
    {
      "name": "Explore",
      "route": "/explore",
      "status": "❌",
      "api_connection": "❌",
      "responsive": "❌",
      "components_functional": "❌",
      "chatbot_context": "❌",
      "suggestions": [
        "Implement exercise library with search",
        "Add workout routines browser",
        "Create workout plan generator",
        "Include video demonstrations"
      ]
    },
    {
      "name": "Profile",
      "route": "/profile",
      "status": "⚠️",
      "api_connection": "✅",
      "responsive": "✅",
      "components_functional": "⚠️",
      "chatbot_context": "⚠️",
      "suggestions": [
        "Complete settings section",
        "Add profile image upload capability",
        "Implement preferences saving",
        "Create notification settings"
      ]
    },
    {
      "name": "Smart Tools",
      "route": "/tools",
      "status": "❌",
      "api_connection": "❌",
      "responsive": "❌",
      "components_functional": "❌",
      "chatbot_context": "❌",
      "suggestions": [
        "Create AI-powered workout generator",
        "Implement meal planner with nutrition tracking",
        "Add body composition analyzer",
        "Include sleep quality tracker"
      ]
    }
  ]
};

// Status icons
const StatusIcon = ({ status }: { status: string }) => {
  if (status === "✅") {
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  } else if (status === "⚠️") {
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  } else {
    return <XCircle className="h-5 w-5 text-red-500" />;
  }
};

// Get status text
const getStatusText = (status: string): string => {
  if (status === "✅") return "Working";
  if (status === "⚠️") return "Partial";
  return "Not Working";
};

// Get status badge
const StatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "secondary" | "destructive" = "default";
  let text = "Working";
  
  if (status === "⚠️") {
    variant = "secondary";
    text = "Partial";
  } else if (status === "❌") {
    variant = "destructive";
    text = "Not Working";
  }
  
  return <Badge variant={variant}>{text}</Badge>;
};

// Calculate completion percentage
const calculateTabCompletion = (): number => {
  const statusValues = {
    "✅": 1,
    "⚠️": 0.5,
    "❌": 0
  };
  
  const tabs = tabStatus.tabs;
  const totalTabs = tabs.length;
  
  const completionSum = tabs.reduce((sum, tab) => {
    return sum + statusValues[tab.status as keyof typeof statusValues];
  }, 0);
  
  return Math.round((completionSum / totalTabs) * 100);
};

export default function TabStatusTracker() {
  const completionPercentage = calculateTabCompletion();
  
  return (
    <div className="w-full">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tab Status Tracker</span>
            <Badge>
              {completionPercentage}% Complete
            </Badge>
          </CardTitle>
          <CardDescription>
            Status verification for all tabs in the Main Menu (Side Panel)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="details">Detailed View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tab Name</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>API Connection</TableHead>
                    <TableHead>Responsive</TableHead>
                    <TableHead className="hidden md:table-cell">Components</TableHead>
                    <TableHead className="hidden md:table-cell">Chatbot</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tabStatus.tabs.map((tab) => (
                    <TableRow key={tab.name}>
                      <TableCell className="font-medium">{tab.name}</TableCell>
                      <TableCell className="font-mono text-xs">{tab.route}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <StatusIcon status={tab.status} />
                          <span className="hidden md:inline">{getStatusText(tab.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell><StatusIcon status={tab.api_connection} /></TableCell>
                      <TableCell><StatusIcon status={tab.responsive} /></TableCell>
                      <TableCell className="hidden md:table-cell"><StatusIcon status={tab.components_functional} /></TableCell>
                      <TableCell className="hidden md:table-cell"><StatusIcon status={tab.chatbot_context} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="details" className="mt-4 space-y-6">
              {tabStatus.tabs.map((tab) => (
                <Card key={tab.name} className="overflow-hidden">
                  <CardHeader className={`${
                    tab.status === "✅" ? "bg-green-50" : 
                    tab.status === "⚠️" ? "bg-yellow-50" : "bg-red-50"
                  }`}>
                    <CardTitle className="flex items-center justify-between">
                      <span>{tab.name}</span>
                      <StatusBadge status={tab.status} />
                    </CardTitle>
                    <CardDescription>
                      Route: <span className="font-mono">{tab.route}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <StatusIcon status={tab.api_connection} />
                          <span>API Connection</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusIcon status={tab.responsive} />
                          <span>Responsive UI</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusIcon status={tab.components_functional} />
                          <span>Functional Components</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusIcon status={tab.chatbot_context} />
                          <span>Chatbot Integration</span>
                        </div>
                      </div>
                      
                      {tab.suggestions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Suggestions:</h4>
                          <ul className="list-disc pl-5 text-sm space-y-1">
                            {tab.suggestions.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
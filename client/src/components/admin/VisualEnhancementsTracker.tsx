import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Visual enhancements data for each tab
const visualEnhancements = [
  {
    "tab": "Dashboard",
    "loading_state": "✅",
    "data_integration": "✅",
    "chatbot_context_linked": "✅",
    "responsive_ui": "✅",
    "enhancements": [
      "Added skeleton loading states for widgets",
      "Implemented activity summary with real-time data",
      "Added animated progress bars for goals",
      "Integrated workout history with timeline view",
      "Added fitness score widget with trend line"
    ],
    "suggestions": [
      "Add tooltip explanations to fitness metrics",
      "Implement drag-and-drop widget rearrangement",
      "Add export functionality for dashboard data"
    ]
  },
  {
    "tab": "Profile",
    "loading_state": "✅",
    "data_integration": "✅",
    "chatbot_context_linked": "⚠️",
    "responsive_ui": "✅",
    "enhancements": [
      "Added profile image upload capability",
      "Implemented save/cancel buttons for profile edits",
      "Created fitness preferences section",
      "Added fitness tracker connection cards",
      "Implemented language selection dropdown"
    ],
    "suggestions": [
      "Complete chatbot context integration",
      "Add notification preferences section",
      "Implement theme selection (light/dark mode)",
      "Add data export/import functionality"
    ]
  },
  {
    "tab": "Analytics",
    "loading_state": "❌",
    "data_integration": "❌",
    "chatbot_context_linked": "❌",
    "responsive_ui": "❌",
    "enhancements": [],
    "suggestions": [
      "Create data visualization components",
      "Implement progress tracking charts",
      "Add comparison view between time periods",
      "Connect to fitness tracker APIs for real-time data"
    ]
  },
  {
    "tab": "Explore",
    "loading_state": "❌",
    "data_integration": "❌",
    "chatbot_context_linked": "❌",
    "responsive_ui": "❌",
    "enhancements": [],
    "suggestions": [
      "Implement exercise library with search",
      "Add workout routines browser",
      "Create workout plan generator",
      "Include video demonstrations"
    ]
  },
  {
    "tab": "Smart Tools",
    "loading_state": "❌",
    "data_integration": "❌",
    "chatbot_context_linked": "❌",
    "responsive_ui": "❌",
    "enhancements": [],
    "suggestions": [
      "Create AI-powered workout generator",
      "Implement meal planner with nutrition tracking",
      "Add body composition analyzer",
      "Include sleep quality tracker"
    ]
  }
];

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
  if (status === "✅") return "Completed";
  if (status === "⚠️") return "Partial";
  return "Not Started";
};

// Get status badge
const StatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "secondary" | "destructive" = "default";
  let text = "Completed";
  
  if (status === "⚠️") {
    variant = "secondary";
    text = "Partial";
  } else if (status === "❌") {
    variant = "destructive";
    text = "Not Started";
  }
  
  return <Badge variant={variant}>{text}</Badge>;
};

// Calculate completion percentage for each tab
const calculateTabCompletion = (tab: any): number => {
  const statusValues = {
    "✅": 1,
    "⚠️": 0.5,
    "❌": 0
  };
  
  const fields = ["loading_state", "data_integration", "chatbot_context_linked", "responsive_ui"];
  const totalFields = fields.length;
  
  const completionSum = fields.reduce((sum, field) => {
    return sum + statusValues[tab[field] as keyof typeof statusValues];
  }, 0);
  
  return Math.round((completionSum / totalFields) * 100);
};

// Calculate overall completion
const calculateOverallCompletion = (): number => {
  const tabCompletions = visualEnhancements.map(tab => calculateTabCompletion(tab));
  const totalCompletions = tabCompletions.reduce((sum, completion) => sum + completion, 0);
  return Math.round(totalCompletions / visualEnhancements.length);
};

export default function VisualEnhancementsTracker() {
  const completionPercentage = calculateOverallCompletion();
  
  return (
    <div className="w-full">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Visual Enhancements Tracker</span>
            <Badge>
              {completionPercentage}% Complete
            </Badge>
          </CardTitle>
          <CardDescription>
            Visual and dynamic functionality enhancements for each tab
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
                    <TableHead>Loading</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Chatbot</TableHead>
                    <TableHead>UI</TableHead>
                    <TableHead>Completion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visualEnhancements.map((tab) => (
                    <TableRow key={tab.tab}>
                      <TableCell className="font-medium">{tab.tab}</TableCell>
                      <TableCell><StatusIcon status={tab.loading_state} /></TableCell>
                      <TableCell><StatusIcon status={tab.data_integration} /></TableCell>
                      <TableCell><StatusIcon status={tab.chatbot_context_linked} /></TableCell>
                      <TableCell><StatusIcon status={tab.responsive_ui} /></TableCell>
                      <TableCell>
                        <Badge variant="outline">{calculateTabCompletion(tab)}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="details" className="mt-4 space-y-6">
              <Accordion type="multiple" className="w-full">
                {visualEnhancements.map((tab) => (
                  <AccordionItem key={tab.tab} value={tab.tab} className="border-b">
                    <AccordionTrigger className="py-2">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-medium">{tab.tab}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{calculateTabCompletion(tab)}%</Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Loading State:</span>
                              <StatusBadge status={tab.loading_state} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Data Integration:</span>
                              <StatusBadge status={tab.data_integration} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Chatbot Context:</span>
                              <StatusBadge status={tab.chatbot_context_linked} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Responsive UI:</span>
                              <StatusBadge status={tab.responsive_ui} />
                            </div>
                          </div>
                        </div>
                        
                        {tab.enhancements.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Completed Enhancements:</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {tab.enhancements.map((enhancement, index) => (
                                <li key={index}>{enhancement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {tab.suggestions.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Suggestions:</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {tab.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
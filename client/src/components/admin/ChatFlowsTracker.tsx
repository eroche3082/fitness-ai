import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Chatbot flows data for each tab
const chatFlows = [
  {
    "tab": "Dashboard",
    "chatbot_context": "✅",
    "smart_flows_enabled": "✅ (Fitness Progress Analysis Flow)",
    "triggers_recognized": [
      "analyze my progress", 
      "show my stats", 
      "how am I doing", 
      "track my workouts",
      "compare my activity",
      "set new fitness goals"
    ],
    "actions_available": [
      "Display weekly activity summary chart",
      "Show progress toward fitness goals",
      "Compare current vs. previous week metrics",
      "Generate personalized workout recommendations",
      "Analyze sleep quality trends"
    ],
    "fallbacks": [
      "If no activity data, suggest connecting fitness trackers",
      "If goals not set, offer goal-setting guidance flow",
      "If insufficient data for comparison, show single-point metrics"
    ],
    "suggestions": [
      "Add AI-powered fitness insights based on tracked data",
      "Enable workout planning through conversation",
      "Implement nutrition tracking and meal planning flow"
    ]
  },
  {
    "tab": "Profile",
    "chatbot_context": "⚠️",
    "smart_flows_enabled": "⚠️ (Profile Completion Flow)",
    "triggers_recognized": [
      "update my profile", 
      "change my settings", 
      "connect fitness device", 
      "update my goals", 
      "change language"
    ],
    "actions_available": [
      "Guide through profile completion steps",
      "Help connect fitness tracking devices",
      "Update fitness goals and preferences",
      "Change application language",
      "Manage notification settings"
    ],
    "fallbacks": [
      "If device connection fails, provide troubleshooting steps",
      "If profile update fails, save draft in local storage",
      "Offer manual data entry option if automatic sync unavailable"
    ],
    "suggestions": [
      "Complete integration with ChatContext for fluid conversations",
      "Add voice-guided profile setup",
      "Implement profile sharing capabilities",
      "Add fitness level assessment flow" 
    ]
  },
  {
    "tab": "Analytics",
    "chatbot_context": "❌",
    "smart_flows_enabled": "❌",
    "triggers_recognized": [],
    "actions_available": [],
    "fallbacks": [],
    "suggestions": [
      "Create data analysis conversation flows",
      "Implement comparison queries between time periods",
      "Enable natural language queries for workout data",
      "Add predictive fitness trends analysis",
      "Implement goal projection conversations"
    ]
  },
  {
    "tab": "Explore",
    "chatbot_context": "❌",
    "smart_flows_enabled": "❌",
    "triggers_recognized": [],
    "actions_available": [],
    "fallbacks": [],
    "suggestions": [
      "Create exercise discovery conversation flow",
      "Implement workout recommendation dialogue",
      "Add exercise technique guidance conversations",
      "Enable natural language workout search",
      "Create workout planning assistant flow"
    ]
  },
  {
    "tab": "Smart Tools",
    "chatbot_context": "❌",
    "smart_flows_enabled": "❌",
    "triggers_recognized": [],
    "actions_available": [],
    "fallbacks": [],
    "suggestions": [
      "Create AI workout generator conversation flow",
      "Implement meal planning dialogue",
      "Add body composition analysis conversation",
      "Create sleep quality improvement assistant",
      "Implement recovery optimization dialogue"
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
  if (status === "✅") return "Implemented";
  if (status === "⚠️") return "Partial";
  return "Not Implemented";
};

// Get status badge
const StatusBadge = ({ status }: { status: string }) => {
  let variant: "default" | "secondary" | "destructive" = "default";
  let text = "Implemented";
  
  if (status === "⚠️") {
    variant = "secondary";
    text = "Partial";
  } else if (status === "❌") {
    variant = "destructive";
    text = "Not Implemented";
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
  
  const fields = ["chatbot_context", "smart_flows_enabled"];
  const totalFields = fields.length;
  
  const completionSum = fields.reduce((sum, field) => {
    return sum + statusValues[tab[field].split(' ')[0] as keyof typeof statusValues];
  }, 0);
  
  // Add weight for recognized triggers
  const triggerWeight = tab.triggers_recognized.length > 0 ? 1 : 0;
  
  // Add weight for available actions
  const actionWeight = tab.actions_available.length > 0 ? 1 : 0;
  
  // Add weight for fallbacks
  const fallbackWeight = tab.fallbacks.length > 0 ? 1 : 0;
  
  const totalScore = completionSum + (triggerWeight + actionWeight + fallbackWeight) * 0.33;
  const maxScore = totalFields + 1; // Fields + 1 for the combined trigger/action/fallback weight
  
  return Math.round((totalScore / maxScore) * 100);
};

// Calculate overall completion
const calculateOverallCompletion = (): number => {
  const tabCompletions = chatFlows.map(tab => calculateTabCompletion(tab));
  const totalCompletions = tabCompletions.reduce((sum, completion) => sum + completion, 0);
  return Math.round(totalCompletions / chatFlows.length);
};

export default function ChatFlowsTracker() {
  const completionPercentage = calculateOverallCompletion();
  
  return (
    <div className="w-full">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Conversational UI & Smart Flows</span>
            <Badge>
              {completionPercentage}% Complete
            </Badge>
          </CardTitle>
          <CardDescription>
            Contextual conversation flows and smart actions for each tab
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
                    <TableHead>Context</TableHead>
                    <TableHead>Smart Flows</TableHead>
                    <TableHead>Triggers</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Completion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chatFlows.map((tab) => (
                    <TableRow key={tab.tab}>
                      <TableCell className="font-medium">{tab.tab}</TableCell>
                      <TableCell><StatusIcon status={tab.chatbot_context} /></TableCell>
                      <TableCell><StatusIcon status={tab.smart_flows_enabled.split(' ')[0]} /></TableCell>
                      <TableCell>{tab.triggers_recognized.length}</TableCell>
                      <TableCell>{tab.actions_available.length}</TableCell>
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
                {chatFlows.map((tab) => (
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
                              <span className="text-sm font-medium">Chatbot Context:</span>
                              <StatusBadge status={tab.chatbot_context} />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Smart Flows:</span>
                              <StatusBadge status={tab.smart_flows_enabled.split(' ')[0]} />
                            </div>
                          </div>
                        </div>
                        
                        {tab.triggers_recognized.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Trigger Phrases:</h4>
                            <div className="flex flex-wrap gap-2">
                              {tab.triggers_recognized.map((trigger, index) => (
                                <Badge key={index} variant="outline">{trigger}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {tab.actions_available.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Available Actions:</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {tab.actions_available.map((action, index) => (
                                <li key={index}>{action}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {tab.fallbacks.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">Fallback Strategies:</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                              {tab.fallbacks.map((fallback, index) => (
                                <li key={index}>{fallback}</li>
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
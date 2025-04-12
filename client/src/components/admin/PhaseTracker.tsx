import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

const systemDiagnostic = {
  "phase_0_initialization": {
    "app_skeleton_created": "✅",
    "env_and_secrets_loaded": "✅",
    "firebase_connected": "✅",
    "replit_initialized": "✅",
    "github_repo_linked": "❌",
    "suggestions": [
      "Configure GitHub repository connection for version control and collaborative development",
      "Implement CI/CD pipeline for automated testing and deployment"
    ]
  },
  
  "phase_1_layout_ui_base": {
    "header_navbar": "✅",
    "side_panel_menu": "✅",
    "footer_with_admin_panel": "✅",
    "responsive_layout": "⚠️",
    "route_navigation": "✅",
    "suggestions": [
      "Enhance mobile responsiveness, especially for tablets and smaller devices",
      "Add theme toggle for dark/light mode preferences",
      "Improve navigation UI with clearer active state indicators"
    ]
  },
  
  "phase_2_chatbot_core": {
    "chatbot_floating_icon": "✅",
    "fullpage_chatbot": "✅",
    "vertex_ai_connected": "✅",
    "audio_input_output": "✅",
    "multilingual_support": "✅",
    "firebase_context_memory": "⚠️",
    "onboarding_flow": "✅",
    "response_storage": "✅",
    "suggestions": [
      "Complete Firebase context memory implementation for persistent chat history",
      "Add typing indicators during AI response generation",
      "Implement error recovery mechanism for API failures"
    ]
  },
  
  "phase_3_tab_modules": {
    "dashboard_tab": "✅",
    "analytics_tab": "❌",
    "explore_library_tab": "❌",
    "profile_preferences_tab": "⚠️",
    "smart_tools_ai_tab": "❌",
    "suggestions": [
      "Prioritize completion of the Profile/Preferences tab",
      "Begin implementation of Analytics tab with data visualization components",
      "Create content structure for Explore/Library tab"
    ]
  },
  
  "phase_4_user_personalization": {
    "subscriber_profile_system": "✅",
    "firebase_user_data_storage": "✅",
    "personalized_dashboard": "✅",
    "chatbot_personalization": "✅",
    "dynamic_recommendations": "⚠️",
    "suggestions": [
      "Enhance recommendation algorithms based on user activity patterns",
      "Add user preference for notification frequency and types",
      "Implement progress tracking visualization"
    ]
  },
  
  "phase_5_external_integrations": {
    "stripe_connection": "❌",
    "news_youtube_maps_apis": "⚠️",
    "google_cloud_apis": "✅",
    "fitness_tracker_apis": "⚠️",
    "third_party_webhooks": "❌",
    "suggestions": [
      "Add required API keys for Google Fit, Fitbit, and Strava integrations",
      "Implement user-friendly connection flow for each fitness service",
      "Add detailed status indicators for each connected service"
    ]
  },
  
  "phase_6_testing_qa": {
    "mobile_testing": "❌",
    "tablet_testing": "❌",
    "cross_browser_testing": "❌",
    "loading_error_states": "⚠️",
    "chatbot_tab_functionality": "❌",
    "suggestions": [
      "Create test plan covering all major user journeys",
      "Implement comprehensive error boundaries throughout the application",
      "Add automated testing for critical user flows"
    ]
  },
  
  "phase_7_admin_tools": {
    "admin_dashboard": "✅",
    "system_diagnostics": "✅",
    "phase_tracking": "✅",
    "manual_overrides": "✅",
    "suggestions": [
      "Add user management capabilities to Admin Panel",
      "Implement system performance monitoring",
      "Create admin-accessible logs for tracking user interactions"
    ]
  },
  
  "phase_8_prelaunch": {
    "seo_optimization": "❌",
    "privacy_terms_pages": "❌",
    "social_sharing": "❌",
    "contact_form_integration": "❌",
    "suggestions": [
      "Create privacy policy and terms of service pages",
      "Implement proper meta tags for SEO",
      "Add social sharing capabilities for workout achievements"
    ]
  },
  
  "phase_9_deployment": {
    "firebase_hosting": "❌",
    "custom_domain": "❌",
    "ssl_security": "❌",
    "post_deployment_testing": "❌",
    "final_checklist": "❌",
    "suggestions": [
      "Configure Firebase hosting settings",
      "Acquire and set up custom domain",
      "Create deployment pipeline with staging environment"
    ]
  }
};

const projectSummary = {
  "current_phase": "PHASE 4 – User Personalization Implementation",
  "next_focus": "PHASE 3 – Complete Tab Module Implementation",
  "priority_actions": [
    "Complete the Profile/Preferences tab implementation",
    "Configure fitness tracker integrations by providing the required API keys",
    "Begin implementation of Analytics tab with data visualization"
  ],
  "system_status": "WARNING",
  "status_reason": "Core functionality is working, but several key modules are incomplete and fitness tracker integrations require API keys"
};

export default function PhaseTracker() {
  const [expanded, setExpanded] = useState<string[]>([]);

  // Calculate completion percentage for each phase
  const getPhaseCompletion = (phaseName: string) => {
    const phase = systemDiagnostic[phaseName as keyof typeof systemDiagnostic] as any;
    if (!phase) return 0;
    
    const totalItems = Object.keys(phase).filter(key => key !== 'suggestions').length;
    const completedItems = Object.values(phase).filter(value => value === "✅").length;
    
    return Math.round((completedItems / totalItems) * 100);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OK": return "bg-green-500";
      case "WARNING": return "bg-yellow-500";
      case "ERROR": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Format phase name for display
  const formatPhaseName = (phaseName: string) => {
    return phaseName
      .replace(/_/g, ' ')
      .replace(/phase_(\d+)_/, 'Phase $1: ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Generate download of diagnostic report
  const downloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ systemDiagnostic, projectSummary }, null, 2)
    );
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "fitness_ai_diagnostic_report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Fitness AI System Diagnostic</span>
            <Badge className={getStatusColor(projectSummary.system_status)}>
              {projectSummary.system_status}
            </Badge>
          </CardTitle>
          <CardDescription>
            {projectSummary.status_reason}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Current Phase</h3>
            <p className="text-md">{projectSummary.current_phase}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Next Focus</h3>
            <p className="text-md">{projectSummary.next_focus}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Priority Actions</h3>
            <ul className="list-disc pl-5">
              {projectSummary.priority_actions.map((action, index) => (
                <li key={index} className="my-1">{action}</li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={downloadReport} variant="outline" className="ml-auto">
            Export Report
          </Button>
        </CardFooter>
      </Card>

      <Accordion type="multiple" value={expanded} onValueChange={setExpanded} className="mb-4">
        {Object.entries(systemDiagnostic).map(([phaseName, phaseData]: [string, any]) => (
          <AccordionItem value={phaseName} key={phaseName}>
            <AccordionTrigger className="flex items-center">
              <div className="flex items-center justify-between w-full pr-4">
                <span className="font-semibold">{formatPhaseName(phaseName)}</span>
                <div className="flex items-center">
                  <span className="text-sm mr-2">{getPhaseCompletion(phaseName)}% Complete</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${getPhaseCompletion(phaseName)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-1 space-y-3">
                {Object.entries(phaseData)
                  .filter(([key]) => key !== 'suggestions')
                  .map(([taskName, status]) => (
                    <div key={taskName} className="flex items-start space-x-2">
                      <div className="pt-0.5">
                        {status === "✅" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : status === "⚠️" ? (
                          <HelpCircle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Label className="text-sm font-medium capitalize">
                          {taskName.replace(/_/g, ' ')}
                        </Label>
                      </div>
                      <div>
                        <Badge variant={
                          status === "✅" ? "default" : 
                          status === "⚠️" ? "outline" : "destructive"
                        }>
                          {status === "✅" ? "Completed" : 
                           status === "⚠️" ? "In Progress" : "Not Started"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                
                {phaseData.suggestions && phaseData.suggestions.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">Suggestions:</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {phaseData.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="my-1">{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Development Timeline</CardTitle>
          <CardDescription>
            Estimated completion dates and milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            {Object.keys(systemDiagnostic).map((phaseName, index) => (
              <div key={phaseName} className="ml-6 mb-6 relative">
                <div className={`absolute -left-6 w-5 h-5 rounded-full ${
                  getPhaseCompletion(phaseName) === 100 ? 'bg-green-500' :
                  getPhaseCompletion(phaseName) > 0 ? 'bg-yellow-500' : 'bg-gray-300'
                } border-2 border-white`}></div>
                <h3 className="font-bold">{formatPhaseName(phaseName)}</h3>
                <p className="text-sm text-gray-500">
                  {getPhaseCompletion(phaseName) === 100 ? 'Completed' : 
                   getPhaseCompletion(phaseName) > 0 ? `${getPhaseCompletion(phaseName)}% Complete` : 'Not Started'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
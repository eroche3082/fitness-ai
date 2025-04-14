/**
 * Deployment Readiness Dashboard
 * 
 * This page provides administrators with a comprehensive assessment of the platform's readiness
 * for deployment, analyzing all critical components, API connections, and required functionality.
 */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, AlertTriangle, X, RefreshCw, Home, Rocket, Shield, AlertCircle, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { apiRequest } from '../../lib/queryClient';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Define deployment readiness report interface
interface DeploymentReadinessReport {
  timestamp: string;
  
  apiStatus: {
    vision: string;
    translation: string;
    tts: string;
    stt: string;
    naturalLanguage: string;
    gemini: string;
    vertexAI: string;
    firebase: string;
    fitbit: string;
  };
  
  chatbot: string;
  dashboard: string;
  onboarding: string;
  accessCodeSystem: string;
  paymentIntegration: string;
  multilingual: string;
  mobileResponsiveness: string;
  
  missing: string[];
  improvements: string[];
  
  deploymentReadiness: string;
  readyForLaunch: boolean;
  
  securitySuggestions: string[];
}

export default function DeploymentReadinessDashboard() {
  const [report, setReport] = useState<DeploymentReadinessReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Fetch deployment readiness report on component mount
  useEffect(() => {
    fetchDeploymentReport();
  }, []);
  
  // Function to fetch deployment readiness report
  const fetchDeploymentReport = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('GET', '/api/deployment/readiness');
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Error fetching deployment readiness report:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to refresh deployment readiness report
  const refreshReport = async () => {
    setRefreshing(true);
    await fetchDeploymentReport();
    setRefreshing(false);
  };
  
  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'complete':
      case 'functional':
      case 'accessible':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" /> Active
          </Badge>
        );
      case 'partial':
      case 'limited':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Partial
          </Badge>
        );
      case 'missing':
      case 'inactive':
      case 'not_configured':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="h-3 w-3 mr-1" /> Missing
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Unknown
          </Badge>
        );
    }
  };
  
  // Function to get percentage from readiness value
  const getReadinessPercentage = (value: string) => {
    return parseInt(value.replace('%', ''));
  };
  
  // Function to get color class based on percentage
  const getColorClass = (percentage: number) => {
    if (percentage >= 90) return 'text-green-500';
    if (percentage >= 70) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Function to get progress color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="container py-8">
      <Helmet>
        <title>Deployment Readiness | Fitness AI</title>
        <meta name="description" content="Comprehensive assessment of deployment readiness" />
      </Helmet>
      
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-1" />
                <span>Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">
                <Shield className="h-4 w-4 mr-1" />
                <span>Admin</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/deployment-readiness">
                <Rocket className="h-4 w-4 mr-1" />
                <span>Deployment Readiness</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Deployment Readiness Assessment</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive system-wide validation of deployment readiness
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading deployment readiness report...</p>
          </div>
        </div>
      ) : report ? (
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Deployment Status</h2>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
            <Button 
              onClick={refreshReport} 
              variant="outline" 
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Report
            </Button>
          </div>
          
          <Alert className={`${report.readyForLaunch ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            {report.readyForLaunch ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            )}
            <AlertTitle className={report.readyForLaunch ? 'text-green-800' : 'text-amber-800'}>
              {report.readyForLaunch ? 'Ready for Deployment' : 'Not Ready for Deployment'}
            </AlertTitle>
            <AlertDescription className={report.readyForLaunch ? 'text-green-700' : 'text-amber-700'}>
              {report.readyForLaunch 
                ? 'All critical systems are operational and the platform is ready for public launch.' 
                : 'Some critical components require attention before deployment.'}
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Readiness Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-4xl font-bold ${getColorClass(getReadinessPercentage(report.deploymentReadiness))}`}>
                  {report.deploymentReadiness}
                </div>
                <Progress 
                  value={getReadinessPercentage(report.deploymentReadiness)} 
                  className="h-2 mt-2"
                  indicatorClassName={getProgressColor(getReadinessPercentage(report.deploymentReadiness))}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {getReadinessPercentage(report.deploymentReadiness) >= 90
                    ? 'Excellent - Ready for deployment'
                    : getReadinessPercentage(report.deploymentReadiness) >= 70
                    ? 'Good - Minor issues need attention'
                    : 'Needs improvement - Critical issues detected'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">API Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {Object.values(report.apiStatus).filter(status => status === 'active').length} <span className="text-lg text-muted-foreground">/ {Object.keys(report.apiStatus).length}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Active API services</p>
                <div className="mt-4 space-y-1">
                  {Object.values(report.apiStatus).filter(status => status === 'partial').length > 0 && (
                    <div className="flex items-center text-xs">
                      <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                      <span className="text-muted-foreground">
                        {Object.values(report.apiStatus).filter(status => status === 'partial').length} services partially working
                      </span>
                    </div>
                  )}
                  {Object.values(report.apiStatus).filter(status => status === 'missing' || status === 'inactive').length > 0 && (
                    <div className="flex items-center text-xs">
                      <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                      <span className="text-muted-foreground">
                        {Object.values(report.apiStatus).filter(status => status === 'missing' || status === 'inactive').length} services missing or inactive
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Missing Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-amber-500">
                  {report.missing.length}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Components requiring attention</p>
                <div className="mt-2 text-xs">
                  {report.missing.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center py-1">
                      <X className="h-3 w-3 text-red-500 mr-1" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                  {report.missing.length > 2 && (
                    <div className="text-muted-foreground italic">
                      +{report.missing.length - 2} more...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="api" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="api">API Services</TabsTrigger>
              <TabsTrigger value="features">Core Features</TabsTrigger>
              <TabsTrigger value="missing">Issues ({report.missing.length})</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="api" className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">API Integration Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(report.apiStatus).map(([key, status]) => (
                  <Card key={key} className={status === 'missing' ? 'border-red-200' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base capitalize">{key.replace(/([A-Z])/g, ' $1').trim()} API</CardTitle>
                        {getStatusBadge(status)}
                      </div>
                      <CardDescription>
                        {status === 'active' 
                          ? 'Fully operational' 
                          : status === 'partial' 
                          ? 'Partially implemented'
                          : 'Not implemented or missing credentials'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        {status === 'active' && (
                          <p className="text-green-600">
                            <Check className="h-4 w-4 inline mr-1" />
                            Service is working correctly with proper auth
                          </p>
                        )}
                        {status === 'partial' && (
                          <p className="text-amber-600">
                            <AlertTriangle className="h-4 w-4 inline mr-1" />
                            Service works but with limited functionality
                          </p>
                        )}
                        {(status === 'missing' || status === 'inactive') && (
                          <p className="text-red-600">
                            <X className="h-4 w-4 inline mr-1" />
                            {key === 'fitbit' 
                              ? 'Missing API credentials (FITBIT_CLIENT_ID, FITBIT_CLIENT_SECRET)'
                              : 'Service not properly implemented or configured'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Core Feature Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Chatbot</CardTitle>
                      {getStatusBadge(report.chatbot)}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>AI chatbot powered by Gemini, providing workout guidance and fitness advice.</p>
                    {report.chatbot !== 'functional' && (
                      <p className="text-amber-600 mt-2">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        Limited multilingual support
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Dashboard</CardTitle>
                      {getStatusBadge(report.dashboard)}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>User dashboard for tracking workouts, progress, and accessing fitness tools.</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Onboarding</CardTitle>
                      {getStatusBadge(report.onboarding)}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>User onboarding flow with fitness assessment and goal setting.</p>
                    {report.onboarding === 'partial' && (
                      <p className="text-amber-600 mt-2">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        7/10 steps implemented
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Access Code System</CardTitle>
                      {getStatusBadge(report.accessCodeSystem)}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>System for generating and validating access codes for different membership tiers.</p>
                    {report.accessCodeSystem === 'partial' && (
                      <p className="text-amber-600 mt-2">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        Code shareability needs implementation
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Payment Integration</CardTitle>
                      {getStatusBadge(report.paymentIntegration)}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Stripe integration for processing subscription and one-time payments.</p>
                    {report.paymentIntegration === 'partial' && (
                      <p className="text-amber-600 mt-2">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        Webhook handling needs improvement
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Multilingual Support</CardTitle>
                      {getStatusBadge(report.multilingual)}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Multi-language support using Google Translation API.</p>
                    {report.multilingual === 'partial' && (
                      <p className="text-amber-600 mt-2">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        Limited to UI elements only
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">Mobile Responsiveness</CardTitle>
                      {getStatusBadge(report.mobileResponsiveness)}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Responsive design for optimal experience on mobile devices.</p>
                    {report.mobileResponsiveness === 'partial' && (
                      <p className="text-amber-600 mt-2">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        Some UI elements need optimization
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="missing" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Missing Components</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-2">
                        {report.missing.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Improvement Recommendations</h3>
                  <Card className="h-[calc(100%-32px)]">
                    <CardContent className="pt-6 h-full overflow-auto">
                      <Accordion type="multiple" className="w-full">
                        {report.improvements.map((item, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-sm hover:no-underline">
                              {item.split(' - ')[0]}
                            </AccordionTrigger>
                            <AccordionContent>
                              {item.split(' - ')[1] || 'Implement this feature to enhance the platform.'}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Security & Compliance</h3>
              <Card>
                <CardHeader>
                  <CardTitle>Security Recommendations</CardTitle>
                  <CardDescription>
                    Implement these security measures before public deployment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {report.securitySuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start border-b pb-3 last:border-0 last:pb-0">
                        <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{suggestion}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {index === 0 && "Critical for handling personal data and ensuring compliance with privacy regulations."}
                            {index === 1 && "Required for GDPR compliance and ethical data collection practices."}
                            {index === 2 && "Necessary feature for user data sovereignty and regulatory compliance."}
                            {index === 3 && "Important for protecting sensitive health and fitness information."}
                            {index === 4 && "Helps prevent unauthorized access to sensitive admin functions."}
                            {index === 5 && "Establishes regular security maintenance procedures."}
                            {index === 6 && "Prevents API abuse and helps manage resource allocation."}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="bg-muted/50 border-t px-6 py-4">
                  <div className="flex justify-between items-center w-full">
                    <div className="text-sm font-medium">Security Compliance Status</div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      <AlertTriangle className="h-3 w-3 mr-1" /> Needs Attention
                    </Badge>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center border-t pt-6 mt-8">
            <div>
              <p className="text-sm text-muted-foreground">
                Report generated at {new Date(report.timestamp).toLocaleString()}
              </p>
            </div>
            <Button onClick={() => window.print()} variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load deployment readiness report. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
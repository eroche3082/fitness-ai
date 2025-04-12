import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  CloudCog, 
  Server, 
  Layers, 
  LayoutGrid,
  MessageSquare
} from "lucide-react";

// Interfaces para el informe de auditoría
interface ApiKeyStatus {
  name: string;
  status: 'active' | 'inactive' | 'error' | 'missing';
  description: string;
  errorMessage?: string;
}

interface ComponentStatus {
  name: string;
  status: 'active' | 'inactive' | 'error' | 'partial';
  description: string;
  details?: string;
}

interface EndpointStatus {
  path: string;
  method: string;
  status: 'active' | 'error';
  responseTime?: number;
  error?: string;
}

interface SystemPhase {
  stage: 'development' | 'beta' | 'production';
  complete: string[];
  inProgress: string[];
  planned: string[];
}

interface SystemAuditReport {
  timestamp: string;
  apiKeys: ApiKeyStatus[];
  missingServices: string[];
  components: ComponentStatus[];
  endpoints: EndpointStatus[];
  systemPhase: SystemPhase;
  suggestedIntegrations: string[];
  overallStatus: 'success' | 'warning' | 'error';
}

export default function SystemAuditPage() {
  const [report, setReport] = useState<SystemAuditReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest<SystemAuditReport>('/api/agent-status');
      setReport(response);
    } catch (err) {
      setError('Error al obtener el informe de auditoría del sistema');
      console.error('Error fetching system audit report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditReport();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactive':
      case 'missing':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'partial':
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return <Badge className="bg-green-500">✅ Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">❌ Inactive</Badge>;
      case 'error':
        return <Badge variant="destructive">❌ Error</Badge>;
      case 'missing':
        return <Badge variant="outline" className="bg-gray-200">❌ Missing</Badge>;
      case 'partial':
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">⚠️ Partial</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Calcular estadísticas
  const calculateStats = (report: SystemAuditReport) => {
    const activeApiKeys = report.apiKeys.filter(key => key.status === 'active').length;
    const totalApiKeys = report.apiKeys.length;
    const apiKeyPercentage = Math.round((activeApiKeys / totalApiKeys) * 100);

    const activeComponents = report.components.filter(comp => comp.status === 'active').length;
    const partialComponents = report.components.filter(comp => comp.status === 'partial').length;
    const totalComponents = report.components.length;
    const componentPercentage = Math.round(((activeComponents + (partialComponents * 0.5)) / totalComponents) * 100);

    const activeEndpoints = report.endpoints.filter(endpoint => endpoint.status === 'active').length;
    const totalEndpoints = report.endpoints.length;
    const endpointPercentage = Math.round((activeEndpoints / totalEndpoints) * 100);

    const systemHealth = Math.round((apiKeyPercentage + componentPercentage + endpointPercentage) / 3);

    return {
      apiKeyPercentage,
      componentPercentage,
      endpointPercentage,
      systemHealth
    };
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 space-y-4 p-4 md:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">System Audit</h2>
            <p className="text-muted-foreground">
              Full system diagnostic and status report
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchAuditReport} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && !report ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading system audit report...</span>
          </div>
        ) : report ? (
          <>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {getStatusBadge(report.overallStatus)}
                    </div>
                    <div>
                      {getStatusIcon(report.overallStatus)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Last updated: {new Date(report.timestamp).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">API Keys</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active:</span>
                      <span className="font-medium">
                        {report.apiKeys.filter(key => key.status === 'active').length}/{report.apiKeys.length}
                      </span>
                    </div>
                    <Progress 
                      value={calculateStats(report).apiKeyPercentage}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Components</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active:</span>
                      <span className="font-medium">
                        {report.components.filter(c => c.status === 'active').length}/{report.components.length}
                      </span>
                    </div>
                    <Progress 
                      value={calculateStats(report).componentPercentage}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active:</span>
                      <span className="font-medium">
                        {report.endpoints.filter(e => e.status === 'active').length}/{report.endpoints.length}
                      </span>
                    </div>
                    <Progress 
                      value={calculateStats(report).endpointPercentage}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="api-keys" className="space-y-4">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                <TabsTrigger value="api-keys" className="flex items-center gap-2">
                  <CloudCog className="h-4 w-4" />
                  <span>API Keys</span>
                </TabsTrigger>
                <TabsTrigger value="components" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>Components</span>
                </TabsTrigger>
                <TabsTrigger value="endpoints" className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  <span>Endpoints</span>
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  <span>Services</span>
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Integrations</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="api-keys" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Status of all API keys required for system functionality
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.apiKeys.map((key, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardHeader className="flex flex-row items-center justify-between py-3">
                            <CardTitle className="text-sm font-medium">{key.name}</CardTitle>
                            {getStatusBadge(key.status)}
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="flex items-start space-x-2">
                              {getStatusIcon(key.status)}
                              <p className="text-xs text-muted-foreground">
                                {key.description}
                              </p>
                            </div>
                            {key.errorMessage && (
                              <p className="text-xs text-red-500 mt-1">{key.errorMessage}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="components" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Components</CardTitle>
                    <CardDescription>
                      Status of all system components and modules
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.components.map((component, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardHeader className="flex flex-row items-center justify-between py-3">
                            <CardTitle className="text-sm font-medium">{component.name}</CardTitle>
                            {getStatusBadge(component.status)}
                          </CardHeader>
                          <CardContent className="py-2">
                            <div className="flex items-start space-x-2">
                              {getStatusIcon(component.status)}
                              <p className="text-xs text-muted-foreground">
                                {component.description}
                              </p>
                            </div>
                            {component.details && (
                              <p className="text-xs mt-2 border-t pt-2 border-gray-100">
                                {component.details}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="endpoints" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>API Endpoints</CardTitle>
                    <CardDescription>
                      Status of all API endpoints and routes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Path</th>
                            <th className="text-left py-2 font-medium">Method</th>
                            <th className="text-left py-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {report.endpoints.map((endpoint, index) => (
                            <tr key={index}>
                              <td className="py-2 font-mono text-xs">{endpoint.path}</td>
                              <td className="py-2">
                                <Badge variant="outline" className="uppercase text-xs">
                                  {endpoint.method}
                                </Badge>
                              </td>
                              <td className="py-2">
                                <div className="flex items-center">
                                  {getStatusIcon(endpoint.status)}
                                  <span className="ml-2">
                                    {endpoint.status === 'active' ? 'OK' : 'Error'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Phase</CardTitle>
                    <CardDescription>
                      Current development phase and completion status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className="uppercase">{report.systemPhase.stage}</Badge>
                      <span className="text-muted-foreground text-sm">
                        System is in {report.systemPhase.stage} phase
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Completed Features</h3>
                      <ul className="space-y-1">
                        {report.systemPhase.complete.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">In Progress</h3>
                      <ul className="space-y-1">
                        {report.systemPhase.inProgress.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <RefreshCw className="h-4 w-4 text-blue-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Planned Features</h3>
                      <ul className="space-y-1">
                        {report.systemPhase.planned.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="h-4 w-4 border rounded-full flex items-center justify-center text-xs">
                              ·
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Missing Services</CardTitle>
                    <CardDescription>
                      Services that are referenced but not configured
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {report.missingServices.length > 0 ? (
                      <ul className="space-y-2">
                        {report.missingServices.map((service, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <XCircle className="h-4 w-4 text-red-500" />
                            {service}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No missing services detected</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="suggestions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Suggested Integrations</CardTitle>
                    <CardDescription>
                      Recommended services and APIs to enhance system functionality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.suggestedIntegrations.map((integration, i) => (
                        <div key={i} className="border rounded-md p-3">
                          <p className="text-sm">{integration}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </main>
    </div>
  );
}
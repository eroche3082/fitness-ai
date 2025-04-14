import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import ApiStatusCard from '@/components/ApiStatusCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check, X } from 'lucide-react';

export default function AdminApiStatusPage() {
  // Fetch the API keys status
  const { 
    data: apiKeysStatus, 
    isLoading: isLoadingKeys,
    error: apiKeysError,
  } = useQuery({
    queryKey: ['/api/api-key-status'],
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  return (
    <AdminLayout title="API Status Dashboard">
      <div className="space-y-6">
        {/* Overview section */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys Overview</CardTitle>
            <CardDescription>
              Status of all configured Google Cloud API keys used by the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingKeys ? (
              <div className="animate-pulse h-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            ) : apiKeysError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load API keys status. Please try again later.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4 p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Available APIs</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {apiKeysStatus?.availableApis?.map((api: string) => (
                        <span 
                          key={api}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs rounded-full flex items-center"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          {api}
                        </span>
                      ))}
                      {!apiKeysStatus?.availableApis?.length && (
                        <span className="text-gray-500 text-sm">
                          No APIs available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Missing APIs</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {apiKeysStatus?.missingApis?.map((api: string) => (
                        <span 
                          key={api}
                          className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-xs rounded-full flex items-center"
                        >
                          <X className="h-3 w-3 mr-1" />
                          {api}
                        </span>
                      ))}
                      {!apiKeysStatus?.missingApis?.length && (
                        <span className="text-gray-500 text-sm">
                          All required APIs are configured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Status Cards */}
        <Tabs defaultValue="vertex">
          <TabsList className="mb-4">
            <TabsTrigger value="vertex">Vertex AI</TabsTrigger>
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
            <TabsTrigger value="vision">Vision API</TabsTrigger>
            <TabsTrigger value="speech">Speech Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vertex" className="space-y-4">
            <ApiStatusCard 
              title="Vertex AI Status" 
              apiName="Vertex AI"
              description="Google Cloud Vertex AI platform integration status"
              showQuota={true}
            />
          </TabsContent>
          
          <TabsContent value="gemini" className="space-y-4">
            <ApiStatusCard 
              title="Gemini AI Status" 
              apiName="Gemini"
              description="Google Gemini 1.5 Flash model integration status"
              showQuota={true}
            />
          </TabsContent>
          
          <TabsContent value="vision" className="space-y-4">
            <ApiStatusCard 
              title="Vision API Status" 
              apiName="Vision"
              description="Google Cloud Vision AI services integration status"
              showQuota={true}
            />
          </TabsContent>
          
          <TabsContent value="speech" className="space-y-4">
            <ApiStatusCard 
              title="Speech Services Status" 
              apiName="Speech"
              description="Google Cloud Speech-to-Text and Text-to-Speech integration status"
              showQuota={true}
            />
          </TabsContent>
        </Tabs>
        
        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Information about your Google Cloud billing account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Project ID:</span>
                <span className="font-medium">erudite-creek-431302</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Billing Account:</span>
                <span className="font-medium">billing-account-123456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Credit Remaining:</span>
                <span className="font-medium">$298.75 / $300.00</span>
              </div>
              
              <div className="pt-4">
                <div className="text-sm font-medium mb-2">Credit Usage</div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-3 bg-blue-500 rounded-full" 
                    style={{ width: `${(298.75 / 300) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>Used: $1.25</span>
                  <span>Remaining: $298.75</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
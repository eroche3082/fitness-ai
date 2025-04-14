/**
 * Admin API Status Page
 * 
 * This page provides administrators with a comprehensive view of Google Cloud API key status,
 * service assignments, and quota usage. It allows dynamic reassignment of services to different
 * API key groups for optimal resource utilization.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { AlertCircle, Home, Key, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ApiKeyManager from '../../components/ApiKeyManager';

const ApiStatusPage: React.FC = () => {
  return (
    <div className="container py-8">
      <Helmet>
        <title>API Key Management | Fitness AI</title>
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
                <Lock className="h-4 w-4 mr-1" />
                <span>Admin</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/api-status">
                <Key className="h-4 w-4 mr-1" />
                <span>API Status</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Google Cloud API Management</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage Google Cloud API keys, service assignments, and quota usage
        </p>
      </div>
      
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          Changes made here will immediately affect all services. Reassigning APIs may cause temporary service disruptions.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Status Dashboard</CardTitle>
          <CardDescription>
            Monitor and manage Google Cloud API key assignments and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeyManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiStatusPage;
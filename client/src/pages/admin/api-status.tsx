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
import { useState, useEffect } from 'react';
import { apiRequest } from '../../lib/queryClient';

const ApiStatusPage: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<{
    activeServices: number;
    totalServiceCount: number;
    totalApiCalls: Record<string, number>;
    healthStatus: 'good' | 'warning' | 'critical';
    lastUpdated: string;
  }>({
    activeServices: 0,
    totalServiceCount: 0,
    totalApiCalls: {},
    healthStatus: 'good',
    lastUpdated: new Date().toISOString()
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch system metrics on component mount
  useEffect(() => {
    const fetchSystemMetrics = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest('GET', '/api/google-cloud/metrics');
        const data = await response.json();
        setSystemMetrics(data);
      } catch (error) {
        console.error('Error fetching system metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemMetrics();

    // Set up auto-refresh every 5 minutes
    const refreshInterval = setInterval(fetchSystemMetrics, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Function to get health status color
  const getHealthStatusColor = () => {
    switch (systemMetrics.healthStatus) {
      case 'good':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="container py-8">
      <Helmet>
        <title>API Key Management | Fitness AI</title>
        <meta name="description" content="Manage Google Cloud API keys, service assignments, and monitor quota usage" />
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

      {/* System Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                `${systemMetrics.activeServices} / ${systemMetrics.totalServiceCount}`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active services</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total API Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                Object.values(systemMetrics.totalApiCalls).reduce((sum, val) => sum + val, 0).toLocaleString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all services (last 24h)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthStatusColor()}`}>
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                systemMetrics.healthStatus.charAt(0).toUpperCase() + systemMetrics.healthStatus.slice(1)
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall system status</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                new Date(systemMetrics.lastUpdated).toLocaleTimeString()
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isLoading ? "Loading..." : new Date(systemMetrics.lastUpdated).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
      
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
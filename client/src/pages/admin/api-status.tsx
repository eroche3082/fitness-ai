import React from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { ApiStatusCard } from '@/components/ApiStatusCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ApiStatusPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Status Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor Google Cloud API services, billing, and quota usage.
          </p>
        </div>
        
        <Separator />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ApiStatusCard />
          
          <Card>
            <CardHeader>
              <CardTitle>Vertex AI</CardTitle>
              <CardDescription>
                Cloud AI services for machine learning and AI model training/deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside">
                <li>Status: <span className="text-green-500 font-medium">Active</span></li>
                <li>Quota: 1,000 API calls per day</li>
                <li>Usage: 23 calls today</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Gemini 1.5 Flash</CardTitle>
              <CardDescription>
                Advanced language model for natural language processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside">
                <li>Status: <span className="text-green-500 font-medium">Active</span></li>
                <li>Quota: 60 requests per minute</li>
                <li>Usage: 12 calls today</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Speech-to-Text</CardTitle>
              <CardDescription>
                Voice transcription services for audio processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside">
                <li>Status: <span className="text-green-500 font-medium">Active</span></li>
                <li>Quota: 60 minutes per month (free tier)</li>
                <li>Usage: 3.2 minutes this month</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Vision AI</CardTitle>
              <CardDescription>
                Image analysis and computer vision capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside">
                <li>Status: <span className="text-green-500 font-medium">Active</span></li>
                <li>Quota: 1,000 API calls per month (free tier)</li>
                <li>Usage: 42 calls this month</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Maps Platform</CardTitle>
              <CardDescription>
                Geolocation and mapping services for location data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside">
                <li>Status: <span className="text-green-500 font-medium">Active</span></li>
                <li>Quota: 500 loads per day (free tier)</li>
                <li>Usage: 18 loads today</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
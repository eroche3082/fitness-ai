import React, { useState } from 'react';
import FitnessTrackers from '../components/FitnessTrackers';
import FitnessDashboard from '../components/FitnessDashboard';
import FitnessDeviceManager from '../components/FitnessDeviceManager';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Activity, BarChart3 } from 'lucide-react';

export default function FitnessTrackersPage() {
  const [activeTab, setActiveTab] = useState<string>('connect');
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">Fitness Tracking</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="connect" className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Connect Devices
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="mb-6">
          {activeTab === 'connect' ? (
            <div className="mb-6">
              <p className="text-muted-foreground mb-6">
                Connect your fitness trackers and wearables to synchronize your activity data with Fitness AI.
                This allows us to provide personalized coaching and insights based on your real-time fitness data.
              </p>
              <div className="grid grid-cols-1 gap-6">
                <FitnessDeviceManager />
                <FitnessTrackers />
              </div>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-muted-foreground mb-6">
                Track your progress and view insights from your connected fitness devices.
                These statistics help Fitness AI provide personalized recommendations for your fitness journey.
              </p>
              <FitnessDashboard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
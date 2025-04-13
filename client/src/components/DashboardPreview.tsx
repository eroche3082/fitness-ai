import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Activity, 
  Headphones, 
  BarChart2, 
  Calendar, 
  ChevronRight, 
  BarChart, 
  Check, 
  ArrowRight,
  Smartphone,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardPreview: React.FC = () => {
  return (
    <div className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful AI-Powered Dashboard</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience a comprehensive fitness platform that adapts to your goals, tracks your progress,
            and provides real-time coaching through advanced AI technology.
          </p>
        </div>

        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-900 rounded-xl shadow-2xl mb-16">
          <div className="absolute top-0 left-0 right-0 h-14 bg-black flex items-center px-4 rounded-t-xl">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="mx-auto bg-gray-800 rounded-full px-4 py-1 text-xs text-gray-400">
              fitness-ai.app/dashboard
            </div>
          </div>
          
          <div className="pt-14 flex">
            {/* Sidebar */}
            <div className="hidden md:block w-64 bg-gray-800 text-white p-4 min-h-[500px]">
              <div className="flex items-center mb-8 px-2">
                <Activity className="text-green-400 mr-2 h-6 w-6" />
                <h3 className="font-bold text-xl">FITNESS AI</h3>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center px-2 py-2 bg-gray-700 rounded-md">
                  <BarChart2 className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Dashboard</span>
                </div>
                
                <div className="flex items-center px-2 py-2 hover:bg-gray-700 rounded-md">
                  <Activity className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Fitness Trackers</span>
                </div>
                
                <div className="flex items-center px-2 py-2 hover:bg-gray-700 rounded-md">
                  <Headphones className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Voice Coaching</span>
                </div>
                
                <div className="flex items-center px-2 py-2 hover:bg-gray-700 rounded-md">
                  <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                  <span>Workout History</span>
                </div>
                
                <div className="flex items-center px-2 py-2 hover:bg-gray-700 rounded-md">
                  <MessageSquare className="h-5 w-5 mr-3 text-gray-400" />
                  <span>AI Assistant</span>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1 p-6 bg-white dark:bg-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Welcome back, Alex</h2>
                <div className="flex items-center">
                  <span className="mr-2 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-semibold">ADV</span>
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-0">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Today's Workout</p>
                      <p className="text-xl font-bold">Upper Body Focus</p>
                      <p className="text-sm">45 min · 6 exercises</p>
                    </div>
                    <Button size="sm" className="h-9 gap-1">
                      Start <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 dark:bg-green-900/20 border-0">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Weekly Progress</p>
                    <p className="text-xl font-bold">72%</p>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-2">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <p className="text-sm mt-1">5/7 workouts completed</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 dark:bg-purple-900/20 border-0">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Streak</p>
                    <div className="flex items-end gap-1">
                      <p className="text-xl font-bold">14</p>
                      <p className="text-sm mb-0.5">days</p>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-6 w-full rounded-sm ${i < 5 ? 'bg-purple-400 dark:bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                        ></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Performance Metrics</h3>
                        <select className="text-xs border rounded px-2 py-1">
                          <option>Last 30 Days</option>
                        </select>
                      </div>
                      <div className="h-48 flex items-end justify-between gap-2 border-b border-t py-4">
                        {Array.from({ length: 7 }).map((_, i) => {
                          const height = 30 + Math.random() * 70;
                          return (
                            <div key={i} className="flex flex-col items-center gap-1 flex-1">
                              <div 
                                className="w-full bg-blue-400 dark:bg-blue-600 rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                              <span className="text-xs">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 pt-2">
                        <span>Apr 7</span>
                        <span>Apr 14</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-4">Upcoming Sessions</h3>
                      <div className="space-y-3">
                        <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-400 mr-3">
                            <BarChart className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">HIIT Session</p>
                            <p className="text-xs text-gray-500">Tomorrow · 8:00 AM</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                        
                        <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
                            <Activity className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Leg Day</p>
                            <p className="text-xs text-gray-500">Wed, Apr 16 · 6:00 PM</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <Card className="border-dashed border-2">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4">
                        <Smartphone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold">Connect Fitness Trackers</h3>
                        <p className="text-sm text-gray-500">Sync with Google Fit, Apple Health, Fitbit or Strava</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1">
                      Connect <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <div className="mb-4 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BarChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Personalized Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Track your fitness journey with detailed metrics and visual reports that adapt to your progress.
            </p>
            <ul className="space-y-2">
              {['Progress tracking', 'Performance insights', 'Goal progress'].map((item, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <div className="mb-4 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Headphones className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Voice Coaching</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get real-time audio guidance, form correction, and rep counting with our AI voice coach.
            </p>
            <ul className="space-y-2">
              {['Audio guidance', 'Rep counting', 'Form correction'].map((item, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <div className="mb-4 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Health Integrations</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Connect with your favorite fitness devices and apps to import activity data automatically.
            </p>
            <ul className="space-y-2">
              {['Google Fit', 'Apple Health', 'Fitbit', 'Strava'].map((item, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
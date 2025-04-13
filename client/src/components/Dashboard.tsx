import React, { useState, useEffect } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import { useLocation } from 'wouter';

export interface DashboardProps {
  userCode: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userCode }) => {
  const [activeTab, setActiveTab] = useState('journey');
  const [, setLocation] = useLocation();
  
  // Mock journey data - would come from API in real app
  const journeySteps = [
    { id: 1, title: 'Assessment Complete', date: '2025-04-10', status: 'completed' },
    { id: 2, title: 'Initial Plan Created', date: '2025-04-11', status: 'completed' },
    { id: 3, title: 'Week 1 Workouts', date: '2025-04-12', status: 'in-progress' },
    { id: 4, title: 'First Milestone', date: '2025-04-17', status: 'upcoming' },
    { id: 5, title: 'Progress Review', date: '2025-04-24', status: 'upcoming' },
  ];
  
  // Mock data for statistics - would come from API in real app
  const stats = [
    { id: 'workouts', label: 'Workouts', value: 4, unit: '', change: '+2', trend: 'up' },
    { id: 'duration', label: 'Avg. Duration', value: 42, unit: 'min', change: '+5', trend: 'up' },
    { id: 'calories', label: 'Calories Burned', value: 1250, unit: 'kcal', change: '+200', trend: 'up' },
    { id: 'streak', label: 'Current Streak', value: 3, unit: 'days', change: '+1', trend: 'up' },
  ];
  
  // Extract category from code (e.g., "FIT-BEG-1234" => "BEG")
  const getCategory = (code: string): string => {
    const parts = code.split('-');
    return parts.length > 1 ? parts[1] : 'N/A';
  };
  
  // Format category name
  const formatCategory = (categoryCode: string): string => {
    const categories: Record<string, string> = {
      'BEG': 'Beginner',
      'INT': 'Intermediate',
      'ADV': 'Advanced',
      'PRO': 'Professional',
      'VIP': 'VIP Member'
    };
    
    return categories[categoryCode] || categoryCode;
  };
  
  // Get category color
  const getCategoryColor = (categoryCode: string): string => {
    const colors: Record<string, string> = {
      'BEG': 'green',
      'INT': 'blue',
      'ADV': 'purple',
      'PRO': 'orange',
      'VIP': 'red'
    };
    
    return colors[categoryCode] || 'gray';
  };
  
  const categoryCode = getCategory(userCode);
  const categoryName = formatCategory(categoryCode);
  const categoryColor = getCategoryColor(categoryCode);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome to Your Fitness Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Track your progress and access personalized workout plans
            </p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="mr-4 text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Your Plan</div>
              <div className={`text-${categoryColor}-600 font-semibold`}>{categoryName}</div>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
              <QRCodeDisplay 
                code={userCode} 
                size={48} 
                background="#f3f4f6" 
                foreground="#111827" 
              />
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'journey'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('journey')}
            >
              Your Journey
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              Statistics
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'plans'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('plans')}
            >
              Workout Plans
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'trackers'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('trackers')}
            >
              Connected Trackers
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        <div>
          {/* Journey Tab */}
          {activeTab === 'journey' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Fitness Journey</h2>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Progress Summary</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You're making great progress! Keep up the good work.
                    </p>
                  </div>
                </div>
                
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div 
                    className="h-2 bg-blue-500 rounded-full" 
                    style={{ width: '35%' }}
                  ></div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
                  35% Complete
                </div>
              </div>
              
              <div className="space-y-4">
                {journeySteps.map((step) => (
                  <div 
                    key={step.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-4 flex items-start"
                  >
                    <div 
                      className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                        step.status === 'completed' 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                          : step.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                            : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : step.status === 'in-progress' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      ) : (
                        <span className="text-xs">{step.id}</span>
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{step.title}</h4>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{step.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {step.status === 'completed' 
                          ? 'Successfully completed on schedule.' 
                          : step.status === 'in-progress'
                            ? 'Currently in progress - keep going!'
                            : 'Coming up next in your journey.'}
                      </p>
                      {step.status === 'in-progress' && (
                        <button 
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          onClick={() => console.log('View details for:', step.id)}
                        >
                          Continue Workout
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Activity Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => (
                  <div 
                    key={stat.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">
                          {stat.value}{stat.unit}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stat.trend === 'up' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {stat.change}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-1 ${
                            stat.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                          } rounded-full`} 
                          style={{ width: `${Math.min(100, stat.value * 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h3 className="font-medium mb-3">Activity Over Time</h3>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Detailed charts and analytics will appear here as you log more workouts.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Workout Plans</h2>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Personalized Plan: {categoryName} Program</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your custom fitness plan designed to help you reach your goals. Tailored to your fitness level and preferences.
                </p>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => console.log('View plan')}
                >
                  View Your Plan
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium">This Week's Schedule</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Monday</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Upper Body Strength</div>
                        </div>
                        <div className="text-green-600 dark:text-green-400 text-sm">Completed</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Wednesday</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Lower Body Focus</div>
                        </div>
                        <div className="text-green-600 dark:text-green-400 text-sm">Completed</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Friday</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">HIIT Cardio</div>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 text-sm">Upcoming</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">Sunday</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Active Recovery</div>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 text-sm">Upcoming</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium">Recommended Workouts</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">25-Minute HIIT Challenge</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          High-intensity interval training perfect for your fitness level.
                        </p>
                        <button
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          onClick={() => console.log('View HIIT workout')}
                        >
                          Start Workout →
                        </button>
                      </div>
                      <div>
                        <h4 className="font-medium">Lower Body Strength</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Focus on building leg and core strength with this 30-minute routine.
                        </p>
                        <button
                          className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          onClick={() => console.log('View strength workout')}
                        >
                          Start Workout →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Trackers Tab */}
          {activeTab === 'trackers' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Connect Your Fitness Trackers</h2>
              
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Link your fitness tracking devices and apps to automatically sync your workout data with Fitness AI.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Google Fit</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect your Google Fit account
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium"
                    onClick={() => console.log('Connect Google Fit')}
                  >
                    Connect
                  </button>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Strava</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect your Strava account
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium"
                    onClick={() => console.log('Connect Strava')}
                  >
                    Connect
                  </button>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Fitbit</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect your Fitbit account
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium"
                    onClick={() => console.log('Connect Fitbit')}
                  >
                    Connect
                  </button>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Apple Health</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Connect your Apple Health data
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-full py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium"
                    onClick={() => console.log('Connect Apple Health')}
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center text-blue-600 dark:text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-medium">Schedule Workout</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Plan and schedule your next training session.
          </p>
          <button
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => console.log('Schedule workout')}
          >
            Schedule Now
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center text-purple-600 dark:text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-medium">Log Progress</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Record your workout results and track your progress.
          </p>
          <button
            className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            onClick={() => console.log('Log progress')}
          >
            Log Activity
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center text-green-600 dark:text-green-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-medium">Get AI Coaching</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get personalized advice from our AI fitness coach.
          </p>
          <button
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={() => console.log('Get coaching')}
          >
            Talk to Coach
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import userService from '../lib/userService';
import { UserProfile, getAvailableFeatures, getLockedFeatures, getCategoryDescription } from '../lib/userCodeGenerator';
import QRCodeDisplay from './QRCodeDisplay';

interface DashboardProps {
  userCode?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userCode }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'trackers' | 'settings'>('overview');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Fetch user profile on component mount
  useEffect(() => {
    const profile = userService.getUserProfile();
    if (profile) {
      setUserProfile(profile);
    }
  }, []);

  // Get user code from props or from profile
  const displayCode = userCode || userProfile?.uniqueCode || 'No Code Found';
  
  // Parse the user category from the code if available
  const getUserCategory = () => {
    if (userProfile?.category) {
      return userProfile.category;
    }
    
    if (displayCode.includes('-')) {
      const parts = displayCode.split('-');
      if (parts.length >= 2) {
        return parts[1] as any;
      }
    }
    
    return 'BEG'; // Default to beginner if no category found
  };

  const userCategory = getUserCategory();
  
  // Get available and locked features
  const availableFeatures = getAvailableFeatures(userCategory);
  const lockedFeatures = getLockedFeatures(userCategory);
  const categoryDescription = getCategoryDescription(userCategory);

  // Calculate completion percentage (based on user category)
  const getCompletionPercentage = () => {
    switch (userCategory) {
      case 'BEG': return 20;
      case 'INT': return 40;
      case 'ADV': return 60;
      case 'PRO': return 80;
      case 'VIP': return 100;
      default: return 10;
    }
  };

  const completionPercentage = getCompletionPercentage();
  
  // Journey milestones based on user category
  const journeyMilestones = [
    { level: 'BEG', completed: userCategory !== 'BEG' || completionPercentage >= 20, label: 'Beginner' },
    { level: 'INT', completed: ['INT', 'ADV', 'PRO', 'VIP'].includes(userCategory), label: 'Intermediate' },
    { level: 'ADV', completed: ['ADV', 'PRO', 'VIP'].includes(userCategory), label: 'Advanced' },
    { level: 'PRO', completed: ['PRO', 'VIP'].includes(userCategory), label: 'Professional' },
    { level: 'VIP', completed: userCategory === 'VIP', label: 'VIP Member' }
  ];

  // Tracker connection statuses (simulated - would come from API)
  const trackerStatuses = [
    { name: 'Google Fit', connected: false, icon: '🔄' },
    { name: 'Apple Health', connected: false, icon: '❤️' },
    { name: 'Fitbit', connected: false, icon: '⌚' },
    { name: 'Strava', connected: false, icon: '🏃' }
  ];

  return (
    <div className="dashboard-container p-4 md:p-6 max-w-6xl mx-auto">
      {/* User Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{userProfile?.name || 'Fitness Enthusiast'}</h1>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium">
                {userCategory}
              </span>
              <span className="text-gray-500 dark:text-gray-400">{userProfile?.email || 'user@example.com'}</span>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-500 dark:text-gray-400">Access Code</span>
              <span className="font-mono font-bold">{displayCode}</span>
            </div>
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-2 overflow-x-auto p-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'overview'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('journey')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'journey'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Your Journey
            </button>
            <button
              onClick={() => setActiveTab('trackers')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'trackers'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Fitness Trackers
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'settings'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Your Fitness Level</h2>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{categoryDescription}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-medium mb-2">Available Features</h2>
                  <ul className="space-y-2">
                    {availableFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-2 text-green-500">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium mb-2">Locked Features</h2>
                  <ul className="space-y-2">
                    {lockedFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center opacity-60">
                        <span className="mr-2">🔒</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link href="/membership">
                  <a className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Upgrade Membership
                  </a>
                </Link>
              </div>
            </div>
          )}

          {/* Journey Tab */}
          {activeTab === 'journey' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Your Fitness Journey</h2>
              
              <div className="relative">
                {/* Journey Path */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 transform -translate-y-1/2 z-0"></div>
                
                {/* Milestones */}
                <div className="relative z-10 flex justify-between">
                  {journeyMilestones.map((milestone, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center
                        ${milestone.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}
                      `}>
                        {milestone.completed ? '✓' : index + 1}
                      </div>
                      <span className="mt-2 text-sm font-medium">{milestone.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <h3 className="text-md font-medium">Recommended Next Steps</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium">Complete Your Profile</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Add your measurements and fitness goals to get personalized recommendations.
                    </p>
                    <button className="mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded text-sm">
                      Update Profile
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium">Connect Fitness Trackers</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Sync your data from fitness devices for better insights.
                    </p>
                    <button className="mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded text-sm">
                      Connect Devices
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trackers Tab */}
          {activeTab === 'trackers' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Fitness Tracker Connections</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {trackerStatuses.map((tracker, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{tracker.icon}</span>
                        <div>
                          <h4 className="font-medium">{tracker.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tracker.connected ? 'Connected' : 'Not Connected'}
                          </p>
                        </div>
                      </div>
                      <button className={`px-3 py-1 rounded text-sm ${
                        tracker.connected
                          ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100'
                          : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100'
                      }`}>
                        {tracker.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-md font-medium mb-2">Sync Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Auto-sync data</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sync frequency</span>
                    <select className="bg-gray-100 dark:bg-gray-700 border-none rounded py-1 px-2">
                      <option>Every hour</option>
                      <option>Every 3 hours</option>
                      <option>Every 6 hours</option>
                      <option>Once a day</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-lg font-medium mb-4">Account Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    defaultValue={userProfile?.name || ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    defaultValue={userProfile?.email || ''}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Notification Preferences</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Workout reminders</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Progress updates</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>New features and updates</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Share Your Access Code</h2>
            
            <div className="flex flex-col items-center mb-4">
              <QRCodeDisplay code={displayCode} />
              <p className="mt-2 text-center font-mono font-bold">{displayCode}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Copy Link
              </button>
              <button className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                WhatsApp
              </button>
              <button className="p-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition">
                Email
              </button>
            </div>
            
            <button 
              onClick={() => setShowShareModal(false)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
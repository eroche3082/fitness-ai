import React, { useState, useEffect } from 'react';
import { UserProfile, UserCategory, getAvailableFeatures, getLockedFeatures, getCategoryDescription } from '../lib/userCodeGenerator';
import userService from '../lib/userService';
import QRCodeDisplay from './QRCodeDisplay';

interface DashboardProps {
  userCode: string;
  category: UserCategory;
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userCode, category, userName }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'journey' | 'workouts' | 'nutrition'>('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Get available and locked features based on user category
  const availableFeatures = getAvailableFeatures(category);
  const lockedFeatures = getLockedFeatures(category);
  
  // Description of user's fitness level
  const categoryDescription = getCategoryDescription(category);
  
  // Format category name for display
  const getCategoryFullName = (cat: UserCategory): string => {
    switch (cat) {
      case 'BEG': return 'Beginner';
      case 'INT': return 'Intermediate';
      case 'ADV': return 'Advanced';
      case 'PRO': return 'Professional';
      case 'VIP': return 'VIP';
      default: return 'Member';
    }
  };
  
  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(userCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Header with user info */}
      <header className="bg-gray-800 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
            <p className="text-gray-400">Your Fitness AI Dashboard</p>
          </div>
          
          <div className="mt-4 sm:mt-0 bg-gray-700 px-4 py-2 rounded-lg flex flex-col sm:flex-row items-center">
            <div className="mr-0 sm:mr-4 mb-2 sm:mb-0 text-center">
              <div className="text-xs text-gray-400">YOUR UNIQUE CODE</div>
              <div className="font-mono text-lg font-bold text-green-400">{userCode}</div>
            </div>
            <button 
              onClick={() => setShowShareModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </header>
      
      {/* Navigation tabs */}
      <nav className="bg-gray-800 border-t border-gray-700 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex overflow-x-auto">
            <button 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-white border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'journey' ? 'text-white border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('journey')}
            >
              Your Journey
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'workouts' ? 'text-white border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('workouts')}
            >
              Workouts
            </button>
            <button 
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'nutrition' ? 'text-white border-b-2 border-green-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('nutrition')}
            >
              Nutrition
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main content area */}
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Fitness Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-400">Fitness Level</div>
                    <div className="text-lg font-medium">{getCategoryFullName(category)}</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-400">Profile</div>
                    <div className="text-lg">{categoryDescription}</div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center">
                      <span className="text-2xl font-bold">{category}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                      {availableFeatures.length}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-center text-gray-400">
                    Features Unlocked
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="font-medium mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Today's Goal
                </h3>
                <p className="text-gray-400 text-sm">Complete your first workout session to earn points and track progress on your journey.</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="font-medium mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  Progress
                </h3>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">25% towards your next level</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="font-medium mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  Recent Activity
                </h3>
                <ul className="text-sm text-gray-400">
                  <li className="mb-1 pb-1 border-b border-gray-700">Completed registration</li>
                  <li className="mb-1 pb-1 border-b border-gray-700">Received fitness profile analysis</li>
                  <li>Unlocked beginner level features</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Journey Tab Content */}
        {activeTab === 'journey' && (
          <div>
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Fitness Journey</h2>
              <p className="text-gray-400 mb-4">Track your progress, unlock new features, and reach your fitness goals.</p>
              
              <div className="relative">
                <div className="absolute left-[15px] top-0 h-full w-1 bg-gray-700"></div>
                
                {/* Level indicators with locked/unlocked state */}
                <div className="mb-8 relative pl-10">
                  <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-green-500 z-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Beginner Level</h3>
                    <p className="text-gray-400">You are here! Complete beginner workouts to move to the next level.</p>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableFeatures.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-8 relative pl-10">
                  <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-gray-600 z-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-500">Intermediate Level</h3>
                    <p className="text-gray-500">Locked - Complete 10 beginner workouts to unlock.</p>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableFeatures.slice(3, 5).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-8 relative pl-10">
                  <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-gray-600 z-10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-500">Advanced Level</h3>
                    <p className="text-gray-500">Locked - Complete 20 intermediate workouts to unlock.</p>
                    
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lockedFeatures.slice(0, 2).map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">Want to unlock all features?</h3>
                <p className="text-sm text-gray-400 mb-3">Upgrade to VIP level and access all premium features instantly.</p>
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700">
                  Upgrade to VIP Level
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Workouts Tab - Simplified Placeholder */}
        {activeTab === 'workouts' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Workout Plan</h2>
            <p className="text-gray-400 mb-6">Personalized workouts based on your fitness level and goals.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-green-400 mb-1">RECOMMENDED FOR YOU</div>
                <h3 className="font-medium mb-2">Beginner Full Body Strength</h3>
                <p className="text-sm text-gray-400 mb-3">A balanced workout targeting all major muscle groups, perfect for building baseline strength.</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">25 min • Low impact</span>
                  <button className="text-green-400 hover:text-green-300">Start Workout</button>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">Guided Stretching Routine</h3>
                <p className="text-sm text-gray-400 mb-3">Improve flexibility and reduce injury risk with this gentle stretching session.</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">15 min • Recovery</span>
                  <button className="text-green-400 hover:text-green-300">Start Workout</button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                View More Workouts
              </button>
            </div>
          </div>
        )}
        
        {/* Nutrition Tab - Simplified Placeholder */}
        {activeTab === 'nutrition' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Nutrition Guidelines</h2>
            <p className="text-gray-400 mb-6">Personalized nutrition advice based on your fitness goals.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">2200</div>
                <div className="text-sm text-gray-400">Daily Calorie Target</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">130g</div>
                <div className="text-sm text-gray-400">Protein Goal</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">2.5L</div>
                <div className="text-sm text-gray-400">Water Intake</div>
              </div>
            </div>
            
            <h3 className="font-medium mb-3">Meal Recommendations</h3>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <h4 className="font-medium mb-2">Breakfast Options</h4>
              <ul className="text-sm text-gray-400 list-disc pl-5 space-y-1">
                <li>Protein oatmeal with berries</li>
                <li>Greek yogurt with honey and nuts</li>
                <li>Veggie omelet with whole grain toast</li>
              </ul>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400 mb-3">Want personalized meal plans and nutrition tracking?</p>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
                Upgrade Your Nutrition Plan
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Share Your Fitness Code</h3>
              <button onClick={() => setShowShareModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <QRCodeDisplay code={userCode} size={200} />
              <div className="mt-4 text-center">
                <p className="font-mono text-lg mb-2">{userCode}</p>
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm flex items-center mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                    <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                  </svg>
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Share via</h4>
              <div className="grid grid-cols-4 gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded flex flex-col items-center text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mb-1">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded flex flex-col items-center text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mb-1">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded flex flex-col items-center text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mb-1">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885a9.865 9.865 0 017.021 2.91 9.788 9.788 0 012.909 6.99c-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/>
                  </svg>
                  WhatsApp
                </button>
                <button className="bg-blue-800 hover:bg-blue-900 text-white p-2 rounded flex flex-col items-center text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mb-1">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </button>
              </div>
              
              <div className="pt-3 border-t border-gray-700">
                <h4 className="font-medium text-sm mb-2">Or send via email</h4>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    className="flex-1 p-2 rounded border border-gray-700 bg-gray-900 text-white text-sm"
                  />
                  <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
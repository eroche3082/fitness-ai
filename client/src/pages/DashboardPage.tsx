import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import Dashboard from '../components/Dashboard';
import ChatbotDemo from '../components/ChatbotDemo';
import userService from '../lib/userService';

/**
 * Dashboard page component that checks for a valid user profile
 * before displaying the Dashboard component
 */
const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if user is authenticated with a valid profile
    const profile = userService.getUserProfile();
    
    if (!profile) {
      // No valid profile found, redirect to access code page
      setLocation('/access');
      return;
    }
    
    setUserProfile(profile);
    setLoading(false);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <div
                onClick={() => setLocation('/')}
                className="cursor-pointer flex items-center space-x-2"
              >
                <span className="text-2xl">🏋️</span>
                <span className="font-bold text-xl">Fitness AI</span>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <div
                className="cursor-pointer px-3 py-2 text-sm font-medium rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
              >
                Dashboard
              </div>
              <div
                onClick={() => setLocation('/profile')}
                className="cursor-pointer px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Profile
              </div>
              <div
                onClick={() => setLocation('/membership')}
                className="cursor-pointer px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Membership
              </div>
              <div
                onClick={() => {
                  userService.clearUserProfile();
                  setLocation('/');
                }}
                className="cursor-pointer px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign Out
              </div>
            </nav>
            
            <div className="md:hidden">
              {/* Mobile menu button */}
              <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Dashboard userCode={userProfile.uniqueCode} />
            <ChatbotDemo />
          </>
        )}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-8 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 Fitness AI. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-6">
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
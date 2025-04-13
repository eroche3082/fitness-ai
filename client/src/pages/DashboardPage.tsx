import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import Dashboard from '../components/Dashboard';
import userService from '../lib/userService';
import { UserProfile } from '../lib/userCodeGenerator';

const DashboardPage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [, setLocation] = useLocation();
  
  // Fetch user profile on component mount
  useEffect(() => {
    const profile = userService.getUserProfile();
    
    if (profile) {
      setUserProfile(profile);
    } else {
      // Redirect to access code page if no profile is found
      setLocation('/access');
    }
  }, [setLocation]);
  
  // If no profile is found, show loading state
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center space-x-2">
                  <span className="text-2xl">🏋️</span>
                  <span className="font-bold text-xl">Fitness AI</span>
                </a>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard">
                <a className="px-3 py-2 text-sm font-medium rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100">
                  Dashboard
                </a>
              </Link>
              <Link href="/workouts">
                <a className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Workouts
                </a>
              </Link>
              <Link href="/nutrition">
                <a className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Nutrition
                </a>
              </Link>
              <Link href="/membership">
                <a className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Membership
                </a>
              </Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <div className="border-l border-gray-200 dark:border-gray-700 h-6"></div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="ml-2 text-sm font-medium hidden md:block">
                  {userProfile.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <Dashboard userCode={userProfile.uniqueCode} />
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
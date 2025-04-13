import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import Dashboard from '../components/Dashboard';
import AdminPanel from '../components/AdminPanel';
import userService from '../lib/userService';
import { UserProfile, UserCategory } from '../lib/userCodeGenerator';

const DashboardPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, params] = useRoute('/dashboard/:code');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Load user profile from localStorage or URL parameter
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true);
      
      let profile = userService.getUserProfile();
      
      // If code is provided in URL, validate and fetch profile
      if (params && params.code) {
        try {
          const validation = await userService.validateCode(params.code);
          if (validation.valid && validation.profile) {
            profile = validation.profile;
            userService.saveUserProfile(profile);
          }
        } catch (error) {
          console.error('Error validating code:', error);
        }
      }
      
      // If no profile, redirect to home page
      if (!profile) {
        setLocation('/');
        return;
      }
      
      setUserProfile(profile);
      
      // Admin password check - in a real app, this would use proper authentication
      // For demo, "admin" as code suffix enables admin panel
      if (profile.uniqueCode && profile.uniqueCode.toLowerCase().includes('admin')) {
        setIsAdmin(true);
      }
      
      setIsLoading(false);
    };
    
    loadUserProfile();
  }, [params, setLocation]);
  
  // Handle logout
  const handleLogout = () => {
    userService.clearUserProfile();
    setLocation('/');
  };
  
  // Toggle admin panel view
  const toggleAdminPanel = () => {
    setShowAdminPanel(!showAdminPanel);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
          <p className="mt-4 text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!userProfile) {
    return null; // This shouldn't happen due to redirect, but just in case
  }
  
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation bar */}
      <nav className="bg-green-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-white text-xl font-bold">Fitness AI</span>
              </div>
            </div>
            
            <div className="flex items-center">
              {isAdmin && (
                <button
                  onClick={toggleAdminPanel}
                  className="mr-4 px-4 py-2 rounded bg-green-600 hover:bg-green-800 text-white text-sm font-medium"
                >
                  {showAdminPanel ? 'View Dashboard' : 'Admin Panel'}
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="ml-3 px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main>
        {showAdminPanel && isAdmin ? (
          <AdminPanel />
        ) : (
          <Dashboard 
            userCode={userProfile.uniqueCode || 'CODE-NOT-FOUND'} 
            category={(userProfile.category || 'BEG') as UserCategory}
            userName={userProfile.name}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
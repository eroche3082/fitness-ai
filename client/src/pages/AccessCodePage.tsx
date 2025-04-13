import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import AccessCodeScreen from '../components/AccessCodeScreen';
import userService from '../lib/userService';

/**
 * Page component for access code validation
 * Handles redirection and user code validation
 */
const AccessCodePage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [, setLocation] = useLocation();
  
  // Check if user profile already exists
  useEffect(() => {
    const userProfile = userService.getUserProfile();
    if (userProfile) {
      // User already has a profile, redirect to dashboard
      setLocation('/dashboard');
    }
  }, [setLocation]);
  
  // Handle successful code validation
  const handleCodeSuccess = async (code: string) => {
    try {
      // Validate code with service
      const result = await userService.validateCode(code);
      
      if (result.valid && result.userProfile) {
        // Code is valid, redirect to dashboard
        setLocation(`/dashboard`);
      } else {
        // Code validation failed
        console.error('Code validation failed');
        // In a real app, show an error message
      }
    } catch (err) {
      console.error('Error validating code:', err);
      // In a real app, show an error message
    }
  };
  
  // Handle registration request
  const handleRegisterRequest = () => {
    setIsRegistering(true);
    // In a real app, show registration form or redirect to registration page
    // For now, just toggle state for demo
    setTimeout(() => {
      alert('Registration would redirect to onboarding flow in a real app.');
      setIsRegistering(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
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
            
            <div>
              <button
                onClick={() => setLocation('/admin')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 
                  hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex items-center justify-center p-4">
        {isRegistering ? (
          <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Loading Registration...</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Please wait while we prepare the registration form.
              </p>
            </div>
          </div>
        ) : (
          <AccessCodeScreen
            onSuccess={handleCodeSuccess}
            onRegister={handleRegisterRequest}
          />
        )}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-sm py-6">
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

export default AccessCodePage;
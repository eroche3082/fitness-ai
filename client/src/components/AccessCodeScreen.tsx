import React, { useState } from 'react';
import { useLocation } from 'wouter';
import userService from '../lib/userService';
import QRCodeDisplay from './QRCodeDisplay';

const AccessCodeScreen: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  // Handle code validation
  const handleValidateCode = async () => {
    // Check if code is provided
    if (!code.trim()) {
      setError('Please enter your access code');
      return;
    }
    
    // Reset states
    setError(null);
    setLoading(true);
    
    try {
      // Validate code using userService
      const result = await userService.validateCode(code.trim());
      
      if (result.valid) {
        // Redirect to dashboard if valid
        setLocation('/dashboard');
      } else {
        // Show error if invalid
        setError('Invalid access code. Please check and try again.');
      }
    } catch (err) {
      console.error('Error validating code:', err);
      setError('An error occurred while validating your code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase for better readability
    setCode(e.target.value.toUpperCase());
    
    // Clear error when typing
    if (error) {
      setError(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidateCode();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Enter Access Code</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your unique access code to continue to your personalized fitness program.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="access-code" className="block text-sm font-medium mb-1">
              Access Code
            </label>
            <input
              id="access-code"
              type="text"
              placeholder="e.g. FIT-BEG-1234"
              value={code}
              onChange={handleCodeChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md font-mono bg-white dark:bg-gray-800"
              disabled={loading}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-md bg-blue-600 text-white font-medium ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Validating...' : 'Continue'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center mb-4">
            <h2 className="text-lg font-medium">Don't have a code?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete the fitness assessment to get your personalized access code.
            </p>
          </div>
          
          <button
            onClick={() => setLocation('/')}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium"
          >
            Take Assessment
          </button>
        </div>
      </div>
      
      {/* Example Codes for Demo */}
      <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-lg font-medium mb-3">Sample Access Codes</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          For demonstration purposes only:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex items-center">
            <div className="w-16 h-16 mr-3">
              <QRCodeDisplay code="FIT-BEG-1234" size={64} background="#f9fafb" />
            </div>
            <div>
              <div className="font-mono font-medium">FIT-BEG-1234</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Beginner</div>
            </div>
          </div>
          
          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-md flex items-center">
            <div className="w-16 h-16 mr-3">
              <QRCodeDisplay code="FIT-ADV-5678" size={64} background="#f9fafb" />
            </div>
            <div>
              <div className="font-mono font-medium">FIT-ADV-5678</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Advanced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCodeScreen;
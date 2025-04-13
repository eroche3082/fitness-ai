import React, { useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import { isValidCode } from '../lib/userCodeGenerator';
import { UserCategory } from '../shared/types';

interface AccessCodeScreenProps {
  onSuccess: (code: string) => void;
  onRegister: () => void;
}

const AccessCodeScreen: React.FC<AccessCodeScreenProps> = ({ onSuccess, onRegister }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validatedCode, setValidatedCode] = useState('');
  
  // Handle code input change
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value.toUpperCase();
    setCode(newCode);
    setError('');
  };
  
  // Validate the entered code
  const validateCode = async () => {
    setIsValidating(true);
    setError('');
    
    // Simple validation for demo
    if (!code) {
      setError('Please enter an access code');
      setIsValidating(false);
      return;
    }
    
    // Check if code matches the expected format
    if (!isValidCode(code)) {
      setError('Invalid code format. Expected format: FIT-XXX-0000');
      setIsValidating(false);
      return;
    }
    
    // Simulate API call to validate code
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setValidatedCode(code);
      setShowSuccess(true);
      setIsValidating(false);
      
      // Call the onSuccess callback with the validated code
      // This will happen after showing the success animation
      setTimeout(() => {
        onSuccess(code);
      },
      2000);
    } catch (err) {
      setError('Error validating code. Please try again.');
      setIsValidating(false);
    }
  };
  
  // Format the code for better readability as user types
  const formatCodeForDisplay = (inputCode: string) => {
    if (!inputCode) return '';
    
    // Replace any existing hyphens
    let formatted = inputCode.replace(/-/g, '');
    
    // Add hyphens at positions 3 and 7 if the code is long enough
    if (formatted.length > 3) {
      formatted = formatted.slice(0, 3) + '-' + formatted.slice(3);
    }
    if (formatted.length > 7) {
      formatted = formatted.slice(0, 7) + '-' + formatted.slice(7);
    }
    
    return formatted;
  };
  
  // Get feedback text color class based on code validity
  const getCodeValidityClass = () => {
    if (!code) return 'text-gray-500';
    if (isValidCode(code)) return 'text-green-600';
    return 'text-red-600';
  };
  
  // Get the category name from code
  const getCategoryFromCode = (code: string): string => {
    const parts = code.split('-');
    if (parts.length !== 3) return '';
    
    const categoryCode = parts[1];
    
    switch (categoryCode) {
      case 'BEG':
        return 'Beginner';
      case 'INT':
        return 'Intermediate';
      case 'ADV':
        return 'Advanced';
      case 'PRO':
        return 'Professional';
      default:
        return 'Unknown';
    }
  };
  
  // If showing success screen
  if (showSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6 animate-bounce">
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Access Code Verified!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You're being redirected to your personalized dashboard...
          </p>
          
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <QRCodeDisplay code={validatedCode} size={180} />
            </div>
          </div>
          
          <div className="text-gray-600 dark:text-gray-400">
            <div className="font-medium text-xl mb-1">{validatedCode}</div>
            <div className="text-sm opacity-75">
              Category: {getCategoryFromCode(validatedCode)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Main access code entry screen
  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-blue-600 p-6 text-white">
        <h1 className="text-xl font-bold">Welcome to Fitness AI</h1>
        <p className="opacity-80 mt-1">Enter your access code to continue</p>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <label
            htmlFor="accessCode"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Access Code
          </label>
          <input
            type="text"
            id="accessCode"
            value={code}
            onChange={handleCodeChange}
            placeholder="FIT-XXX-0000"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white
              placeholder-gray-400 transition-colors"
            maxLength={12}
          />
          <div className={`mt-2 text-sm ${getCodeValidityClass()}`}>
            {code ? (
              isValidCode(code)
                ? 'Valid code format'
                : 'Expected format: FIT-XXX-0000'
            ) : (
              'Enter the code from your trainer or receipt'
            )}
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <button
            type="button"
            onClick={validateCode}
            disabled={isValidating}
            className="flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validating...
              </>
            ) : (
              'Validate Code'
            )}
          </button>
          
          <button
            type="button"
            onClick={onRegister}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
              rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Need a Code?
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            If you have any issues with your access code, please contact support at{' '}
            <a
              href="mailto:support@fitness-ai.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              support@fitness-ai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessCodeScreen;
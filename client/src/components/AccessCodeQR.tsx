import React, { useEffect, useState } from 'react';
import { UserProfile } from '../shared/types';
import QRCodeDisplay from './QRCodeDisplay';

interface AccessCodeQRProps {
  userProfile: UserProfile;
}

const AccessCodeQR: React.FC<AccessCodeQRProps> = ({ userProfile }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [copied]);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(userProfile.uniqueCode);
    setCopied(true);
  };
  
  const toggleQRCode = () => {
    setShowQR(!showQR);
  };
  
  const getAccessLevel = () => {
    switch (userProfile.category) {
      case 'BEG': return 'Basic';
      case 'INT': return 'Intermediate';
      case 'ADV': return 'Advanced';
      case 'PRO': return 'Professional';
      case 'VIP': return 'VIP';
      default: return 'Basic';
    }
  };
  
  const isPremium = userProfile.paymentStatus === 'paid' || userProfile.unlockedLevels.length > 0;
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Personal Access Code</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your unique access code provides you with seamless access to all features and services you've unlocked.
        </p>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your Access Code:</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl font-bold tracking-wide">{userProfile.uniqueCode}</span>
              <button 
                onClick={copyToClipboard}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mb-4">
            <button 
              onClick={toggleQRCode}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>
          </div>
          
          {showQR && (
            <div className="flex justify-center p-4 bg-white rounded-lg shadow-inner">
              <QRCodeDisplay code={userProfile.uniqueCode} size={200} />
            </div>
          )}
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{getAccessLevel()} Tier</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isPremium ? 'Premium Access' : 'Free Access'}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 py-1 px-3 rounded-full">
              <span className="text-green-800 dark:text-green-300 text-sm font-medium">
                {userProfile.paymentStatus === 'paid' ? 'Active' : 'Free'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Access Code Benefits</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Your access code unlocks premium features and enables secure collaboration.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="mt-1 mr-4 flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Secure Access</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your personal code ensures secure access to all your fitness data and premium features.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mt-1 mr-4 flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Quick Login</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Scan your QR code for instant access on any device without entering credentials.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mt-1 mr-4 flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Coach Sharing</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Share your code with your fitness coach to enable collaborative workout planning.
              </p>
            </div>
          </div>
          
          {isPremium && (
            <div className="flex items-start">
              <div className="mt-1 mr-4 flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Premium Features</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Unlocks access to advanced training plans, AI routines, and exclusive content.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {userProfile.referralCount !== undefined && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Referrals</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Share your access code with friends and earn benefits when they join.
          </p>
          
          <div className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium">Total Referrals</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You've referred {userProfile.referralCount} friends
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {userProfile.referralCount}
            </div>
          </div>
          
          <div className="mt-4">
            <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Share Your Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessCodeQR;
import React, { useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import { UserCategory } from '../lib/userCodeGenerator';
import userService from '../lib/userService';

interface AccessCodeScreenProps {
  code: string;
  category: UserCategory;
  userName: string;
  onContinue: () => void;
}

/**
 * Screen that shows the user's unique access code and QR code
 * for accessing their personalized dashboard
 */
const AccessCodeScreen: React.FC<AccessCodeScreenProps> = ({ 
  code, 
  category, 
  userName,
  onContinue
}) => {
  const [copied, setCopied] = useState(false);
  
  // Helper function to get category name from code
  const getCategoryName = (cat: UserCategory): string => {
    switch (cat) {
      case 'BEG': return 'Beginner';
      case 'INT': return 'Intermediate';
      case 'ADV': return 'Advanced';
      case 'PRO': return 'Professional';
      case 'VIP': return 'VIP';
      default: return 'Standard';
    }
  };
  
  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="access-code-screen bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        Welcome, {userName}!
      </h2>
      
      <div className="mb-6 text-center">
        <p className="text-gray-300 mb-4">
          Your personalized fitness dashboard is ready. You've been classified as:
        </p>
        <div className="bg-green-900 rounded-lg p-3 mb-4">
          <span className="text-xl font-bold">{getCategoryName(category)} Level</span>
        </div>
        <p className="text-sm text-gray-400">
          This is based on your fitness profile and goals.
        </p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-center text-lg font-semibold mb-2">Your Unique Access Code</h3>
        <div className="flex justify-center mb-3">
          <div className="bg-gray-700 px-4 py-2 rounded-lg font-mono text-xl">
            {code}
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={copyToClipboard}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
            </svg>
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
      
      <div className="flex justify-center mb-6">
        <QRCodeDisplay code={code} size={180} />
      </div>
      
      <div className="text-center text-sm text-gray-400 mb-6">
        <p>Scan this QR code with your phone's camera or enter the code manually to access your dashboard.</p>
      </div>
      
      <div className="flex justify-center">
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          onClick={onContinue}
        >
          Access Your Dashboard
        </button>
      </div>
    </div>
  );
};

export default AccessCodeScreen;
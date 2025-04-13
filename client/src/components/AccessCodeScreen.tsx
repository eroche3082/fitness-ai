import React, { useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import { UserCategory } from '../lib/userCodeGenerator';

interface AccessCodeScreenProps {
  code: string;
  category: UserCategory;
  userName: string;
  onContinue: () => void;
}

const AccessCodeScreen: React.FC<AccessCodeScreenProps> = ({ 
  code, 
  category, 
  userName,
  onContinue
}) => {
  const [copied, setCopied] = useState(false);
  
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
  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Generate dashboard URL
  const getDashboardURL = () => {
    return `${window.location.origin}/dashboard/${code}`;
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4 h-full">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-white mb-1">
          Welcome to Fitness AI, {userName}!
        </h3>
        <p className="text-sm text-gray-300">
          Your {getCategoryFullName(category)} level dashboard is ready
        </p>
      </div>
      
      <div className="bg-white p-3 rounded-lg mb-4">
        <QRCodeDisplay 
          code={code} 
          size={150}
          backgroundColor="#FFFFFF"
          foregroundColor="#000000"
        />
      </div>
      
      <div className="bg-gray-800 rounded-lg p-3 w-full text-center mb-4">
        <div className="text-xs text-gray-400 mb-1">YOUR UNIQUE ACCESS CODE</div>
        <div className="font-mono text-xl text-green-400 font-bold mb-2">{code}</div>
        <div className="flex justify-center space-x-2">
          <button 
            onClick={copyCode}
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
              <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
            </svg>
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          <a 
            href={getDashboardURL()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            Open in New Tab
          </a>
        </div>
      </div>
      
      <div className="text-sm text-gray-300 text-center mb-4">
        <p>Use this code to access your personalized fitness dashboard anytime.</p>
        <p>You can share it with others to show your progress.</p>
      </div>
      
      <div className="mt-2">
        <button 
          onClick={onContinue}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Continue to Chat
        </button>
      </div>
    </div>
  );
};

export default AccessCodeScreen;
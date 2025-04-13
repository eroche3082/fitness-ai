import React from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import { UserCategory, UserProfile } from '../shared/types';

interface JourneyTabProps {
  userProfile: UserProfile;
}

interface MilestoneProps {
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  requiredLevel: UserCategory;
  currentLevel: UserCategory;
}

// Milestone component
const Milestone: React.FC<MilestoneProps> = ({
  title,
  description,
  isCompleted,
  isLocked,
  requiredLevel,
  currentLevel
}) => {
  const categoryValues = {
    'BEG': 1,
    'INT': 2,
    'ADV': 3,
    'PRO': 4,
    'VIP': 5
  };
  
  const isCurrent = categoryValues[requiredLevel] === categoryValues[currentLevel];
  const isPast = categoryValues[requiredLevel] < categoryValues[currentLevel];
  const isFuture = categoryValues[requiredLevel] > categoryValues[currentLevel];
  
  return (
    <div 
      className={`
        relative flex items-start p-4 rounded-lg border 
        ${isLocked 
          ? 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50' 
          : isCompleted 
            ? 'border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
            : 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
        }
        ${isCurrent ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400' : ''}
      `}
    >
      <div 
        className={`
          flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-4
          ${isLocked 
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400' 
            : isCompleted 
              ? 'bg-green-500 dark:bg-green-600 text-white' 
              : 'bg-blue-500 dark:bg-blue-600 text-white'
          }
        `}
      >
        {isLocked ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ) : isCompleted ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 
            className={`
              text-lg font-semibold mb-1
              ${isLocked 
                ? 'text-gray-500 dark:text-gray-400' 
                : 'text-gray-900 dark:text-white'
              }
            `}
          >
            {title}
          </h3>
          
          <span 
            className={`
              text-xs font-medium px-2.5 py-0.5 rounded-full
              ${isLocked 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300' 
                : isCompleted 
                  ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100' 
                  : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100'
              }
            `}
          >
            {isLocked ? 'Locked' : isCompleted ? 'Completed' : 'Active'}
          </span>
        </div>
        
        <p 
          className={`
            text-sm
            ${isLocked 
              ? 'text-gray-500 dark:text-gray-400' 
              : 'text-gray-600 dark:text-gray-300'
            }
          `}
        >
          {description}
        </p>
        
        <div className="mt-2 flex items-center text-xs">
          <span 
            className={`
              font-medium mr-2 px-2 py-0.5 rounded
              ${isLocked 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300' 
                : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100'
              }
            `}
          >
            Requires: {getCategoryName(requiredLevel)}
          </span>
          
          {isLocked && (
            <span className="text-gray-500 dark:text-gray-400">
              Upgrade to unlock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get readable category name
const getCategoryName = (category: UserCategory): string => {
  switch (category) {
    case 'BEG':
      return 'Beginner';
    case 'INT':
      return 'Intermediate';
    case 'ADV':
      return 'Advanced';
    case 'PRO':
      return 'Professional';
    case 'VIP':
      return 'VIP';
    default:
      return 'Unknown';
  }
};

// Main Journey Tab Component
const JourneyTab: React.FC<JourneyTabProps> = ({ userProfile }) => {
  const categoryValues = {
    'BEG': 1,
    'INT': 2,
    'ADV': 3,
    'PRO': 4,
    'VIP': 5
  };
  
  const milestones = [
    {
      title: 'Start Your Journey',
      description: 'Complete onboarding and set your initial fitness goals',
      requiredLevel: 'BEG' as UserCategory
    },
    {
      title: 'First Workout Milestone',
      description: 'Complete 10 workouts and record your first metrics',
      requiredLevel: 'BEG' as UserCategory
    },
    {
      title: 'Intermediate Achievement',
      description: 'Reach your first 3 fitness goals and upgrade your plan',
      requiredLevel: 'INT' as UserCategory
    },
    {
      title: 'Advanced Progress',
      description: 'Master complex exercises and create custom workout programs',
      requiredLevel: 'ADV' as UserCategory
    },
    {
      title: 'Professional Status',
      description: 'Maintain consistent progress for over 3 months',
      requiredLevel: 'PRO' as UserCategory
    },
    {
      title: 'VIP Recognition',
      description: 'Unlock all features and join the elite fitness community',
      requiredLevel: 'VIP' as UserCategory
    }
  ];
  
  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(userProfile.uniqueCode)
        .then(() => {
          alert('Access code copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy code:', err);
          // Fallback
          const textArea = document.createElement('textarea');
          textArea.value = userProfile.uniqueCode;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          alert('Access code copied to clipboard!');
        });
    } else {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = userProfile.uniqueCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Access code copied to clipboard!');
    }
  };
  
  return (
    <div className="space-y-8">
      {/* User Access Info Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <QRCodeDisplay 
                code={userProfile.uniqueCode} 
                size={180}
              />
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {userProfile.name}
              </h2>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Access Code</div>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2 font-mono text-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600">
                    {userProfile.uniqueCode}
                  </div>
                  
                  <button
                    onClick={handleCopyCode}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Copy code"
                    title="Copy code"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Current Level</div>
                <div className="flex items-center">
                  <div 
                    className="
                      inline-block rounded-full px-3 py-1 text-sm font-semibold 
                      bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm
                    "
                  >
                    {getCategoryName(userProfile.category)}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Membership Status</div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">Active</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-400">Joined {new Date(userProfile.dateCreated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Journey Progress Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Fitness Journey
            </h2>
            
            <div className="text-sm font-medium px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
              {getCategoryName(userProfile.category)} Level
            </div>
          </div>
          
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const isCompleted = categoryValues[userProfile.category] > categoryValues[milestone.requiredLevel];
              const isLocked = categoryValues[userProfile.category] < categoryValues[milestone.requiredLevel];
              
              return (
                <Milestone
                  key={index}
                  title={milestone.title}
                  description={milestone.description}
                  isCompleted={isCompleted}
                  isLocked={isLocked}
                  requiredLevel={milestone.requiredLevel}
                  currentLevel={userProfile.category}
                />
              );
            })}
          </div>
          
          <div className="mt-6">
            <button 
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none"
            >
              Upgrade Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyTab;
import React, { useState, useEffect } from 'react';
import { UserCategory, UserProfile as UserProfileType } from '../shared/types';
import QRCodeDisplay from './QRCodeDisplay';
import userService from '../lib/userService';
import { generateUniqueCode } from '../lib/userCodeGenerator';
import JourneyTab from './JourneyTab';
import FeaturesGrid from './FeaturesGrid';

interface DashboardProps {
  userCode: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userCode }) => {
  const [activeTab, setActiveTab] = useState('journey');
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fitnessStats, setFitnessStats] = useState({
    workoutsCompleted: 0,
    totalMinutes: 0,
    caloriesBurned: 0,
    currentStreak: 0,
  });
  
  useEffect(() => {
    // Get user profile from service
    const profile = userService.getUserProfile();
    if (profile) {
      setUserProfile(profile);
      
      // In a real app, we would fetch these stats from an API
      // For demo, generate random stats based on user's category
      generateMockStats(profile.category);
    }
  }, [userCode]);
  
  // Generate mock stats for demo purposes
  const generateMockStats = (category: UserCategory) => {
    let multiplier = 1;
    
    switch (category) {
      case 'beginner':
        multiplier = 1;
        break;
      case 'intermediate':
        multiplier = 2;
        break;
      case 'advanced':
        multiplier = 3;
        break;
      case 'professional':
        multiplier = 4;
        break;
      default:
        multiplier = 1;
    }
    
    setFitnessStats({
      workoutsCompleted: Math.floor(5 * multiplier + Math.random() * 5),
      totalMinutes: Math.floor(120 * multiplier + Math.random() * 60),
      caloriesBurned: Math.floor(1200 * multiplier + Math.random() * 300),
      currentStreak: Math.floor(2 * multiplier + Math.random() * 3),
    });
  };
  
  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'journey':
        return renderJourneyTab();
      case 'stats':
        return renderStatsTab();
      case 'plan':
        return renderPlanTab();
      case 'trackers':
        return renderTrackersTab();
      default:
        return renderJourneyTab();
    }
  };
  
  // Journey tab content
  const renderJourneyTab = () => {
    if (!userProfile) return null;
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome Back, {userProfile.name}</h2>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
              <QRCodeDisplay code={userProfile.uniqueCode} size={100} />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Your Fitness AI Code</div>
              <div className="text-lg font-medium">{userProfile.uniqueCode}</div>
              <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {userProfile.category.charAt(0).toUpperCase() + userProfile.category.slice(1)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Daily Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {fitnessStats.currentStreak}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Day Streak</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(fitnessStats.workoutsCompleted * 20)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Goal Progress</div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Today's Focus</h4>
              <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {userProfile.category === 'beginner' 
                    ? 'Focus on your form in each exercise today. Quality over quantity!'
                    : userProfile.category === 'intermediate'
                    ? 'Push yourself with progressive overload today. Try to increase your weights slightly.'
                    : userProfile.category === 'advanced'
                    ? 'Focus on muscle mind connection today. Feel each rep and maintain tension.'
                    : 'Recovery is key today. Focus on mobility work and proper nutrition.'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Weekly Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">Workouts Completed</div>
                <div className="font-medium">{fitnessStats.workoutsCompleted}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Minutes</div>
                <div className="font-medium">{fitnessStats.totalMinutes}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">Calories Burned</div>
                <div className="font-medium">{fitnessStats.caloriesBurned}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Workout Duration</div>
                <div className="font-medium">{Math.round(fitnessStats.totalMinutes / (fitnessStats.workoutsCompleted || 1))} min</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Goal Progress</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{fitnessStats.workoutsCompleted}/5 workouts</span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${Math.min(100, (fitnessStats.workoutsCompleted / 5) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Upcoming Workouts</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-2 mr-4">
                <span className="text-blue-800 dark:text-blue-200 text-xl">💪</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Upper Body Strength</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tomorrow, 45 minutes</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                View
              </button>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="bg-green-100 dark:bg-green-900 rounded-md p-2 mr-4">
                <span className="text-green-800 dark:text-green-200 text-xl">🏃</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">HIIT Cardio Session</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Wednesday, 30 minutes</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                View
              </button>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-md p-2 mr-4">
                <span className="text-purple-800 dark:text-purple-200 text-xl">🧘</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Recovery & Mobility</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Friday, 30 minutes</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Stats tab content
  const renderStatsTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Fitness Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-md p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                {fitnessStats.workoutsCompleted}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Workouts</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900 rounded-md p-4 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-300">
                {fitnessStats.totalMinutes}
              </div>
              <div className="text-sm text-green-800 dark:text-green-200">Minutes</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900 rounded-md p-4 text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-300">
                {fitnessStats.caloriesBurned}
              </div>
              <div className="text-sm text-orange-800 dark:text-orange-200">Calories</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900 rounded-md p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                {fitnessStats.currentStreak}
              </div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Streak</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Workout Distribution</h3>
            <div className="h-64 flex items-end justify-between">
              <div className="w-1/5">
                <div className="bg-blue-600 h-32 rounded-t-md"></div>
                <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">Mon</div>
              </div>
              <div className="w-1/5">
                <div className="bg-blue-600 h-20 rounded-t-md"></div>
                <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">Tue</div>
              </div>
              <div className="w-1/5">
                <div className="bg-blue-600 h-48 rounded-t-md"></div>
                <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">Wed</div>
              </div>
              <div className="w-1/5">
                <div className="bg-blue-600 h-16 rounded-t-md"></div>
                <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">Thu</div>
              </div>
              <div className="w-1/5">
                <div className="bg-blue-600 h-40 rounded-t-md"></div>
                <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">Fri</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">Exercise Types</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Strength</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">65%</div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Cardio</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">25%</div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Flexibility</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">10%</div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Progress Over Time</h3>
          <div className="h-64 flex items-end pt-5 px-5">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="flex-1 mx-1">
                <div 
                  className="bg-blue-600 rounded-t-sm" 
                  style={{ height: `${20 + Math.floor(Math.random() * 80)}%` }}
                ></div>
                <div className="text-center mt-2 text-xs text-gray-600 dark:text-gray-400">
                  Week {i+1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Plan tab content
  const renderPlanTab = () => {
    if (!userProfile) return null;
    
    // Customize plan based on user category
    const plans = {
      beginner: {
        name: 'Foundation Builder',
        weeks: 8,
        focus: 'Building strength and establishing workout routine',
        workoutsPerWeek: 3,
      },
      intermediate: {
        name: 'Progressive Overload',
        weeks: 12,
        focus: 'Increasing strength and conditioning',
        workoutsPerWeek: 4,
      },
      advanced: {
        name: 'Performance Optimization',
        weeks: 16,
        focus: 'Advanced techniques and periodization',
        workoutsPerWeek: 5,
      },
      professional: {
        name: 'Elite Training System',
        weeks: 20,
        focus: 'Specialized training and recovery optimization',
        workoutsPerWeek: 6,
      }
    };
    
    const currentPlan = plans[userProfile.category] || plans.beginner;
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">{currentPlan.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentPlan.weeks} week program • {currentPlan.workoutsPerWeek}x per week
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Week 3 of {currentPlan.weeks}
              </span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2">Program Focus</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {currentPlan.focus}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
                Progressive Overload
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
                Compound Movements
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
                Functional Fitness
              </span>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-800 dark:text-gray-200">
                Recovery Optimization
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">This Week's Workouts</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Monday: Upper Body</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">45 minutes • Strength Focus</p>
                </div>
                <div className="bg-blue-200 dark:bg-blue-800 rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Wednesday: Lower Body</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">50 minutes • Strength & Power</p>
                </div>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                  Start
                </button>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Friday: Full Body HIIT</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">30 minutes • Cardio & Strength</p>
                </div>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Upcoming weeks</h3>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <div className="font-medium">Week 4</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Deload week</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                May 1-7
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <div className="font-medium">Week 5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Strength focus</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                May 8-14
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <div className="font-medium">Week 6</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hypertrophy focus</div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                May 15-21
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Trackers tab content
  const renderTrackersTab = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Connected Fitness Trackers</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-md mr-4">
                  <svg className="h-6 w-6 text-blue-700 dark:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17.5h-2.5v-9h2.5v9zm4 0h-2.5v-9h2.5v9zm-2-11.5c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Google Fit</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Syncs steps, activities, and heart rate
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">
                Connected
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center">
                <div className="bg-gray-200 dark:bg-gray-600 p-3 rounded-md mr-4">
                  <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v-2zm6 0h-4v2h4v-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Apple Health</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Import your Apple Health data
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center">
                <div className="bg-gray-200 dark:bg-gray-600 p-3 rounded-md mr-4">
                  <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 10h-2v2h2v-2zm-4-4h2v2h-2v-2zm10 8h-2v2h2v-2zm-6-6h-2v2h2v-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Fitbit</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sync your Fitbit activity
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                Connect
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex items-center">
                <div className="bg-gray-200 dark:bg-gray-600 p-3 rounded-md mr-4">
                  <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Strava</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Connect your running and cycling activities
                  </p>
                </div>
              </div>
              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                Connect
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Recent Activity From Trackers</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-2 mr-4">
                <span className="text-blue-800 dark:text-blue-200 text-xl">🏃</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Morning Run</h4>
                <div className="flex text-sm text-gray-500 dark:text-gray-400">
                  <span>2.4 km • 15 min • 148 avg bpm</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Today
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-2 mr-4">
                <span className="text-blue-800 dark:text-blue-200 text-xl">⚡</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">HIIT Workout</h4>
                <div className="flex text-sm text-gray-500 dark:text-gray-400">
                  <span>32 min • 320 calories • 156 avg bpm</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Yesterday
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-2 mr-4">
                <span className="text-blue-800 dark:text-blue-200 text-xl">🚶</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Daily Steps</h4>
                <div className="flex text-sm text-gray-500 dark:text-gray-400">
                  <span>8,245 steps • 6.1 km</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Yesterday
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium mb-4">Add Measurements</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Track your progress by regularly updating your measurements
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Add Weight
              </button>
            </div>
            <div>
              <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                Add Measurements
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Tab navigation */}
      <div className="flex overflow-x-auto space-x-1 sm:space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 mb-6">
        <button
          onClick={() => setActiveTab('journey')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors 
            ${activeTab === 'journey'
              ? 'bg-blue-600 text-white' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
        >
          Your Journey
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors 
            ${activeTab === 'stats'
              ? 'bg-blue-600 text-white' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('plan')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors 
            ${activeTab === 'plan'
              ? 'bg-blue-600 text-white' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
        >
          Workout Plan
        </button>
        <button
          onClick={() => setActiveTab('trackers')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors 
            ${activeTab === 'trackers'
              ? 'bg-blue-600 text-white' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
        >
          Fitness Trackers
        </button>
      </div>
      
      {/* Tab content */}
      {renderTabContent()}
    </div>
  );
};

export default Dashboard;
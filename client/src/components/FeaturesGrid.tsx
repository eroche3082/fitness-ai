import React from 'react';
import { UserCategory } from '../shared/types';
import { 
  Activity, BarChart3, BellRing, Calendar, Clock, Dumbbell, Globe, 
  Heart, LineChart, ListChecks, LucideIcon, Mic, Navigation, PieChart, 
  Play, Search, Share2, Smartphone, Users, Zap
} from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isLocked?: boolean;
  isPremium?: boolean;
  onClick?: () => void;
}

interface FeaturesGridProps {
  userCategory: UserCategory;
  searchQuery?: string;
  onFeatureClick?: (featureId: string) => void;
}

const FEATURES_BY_CATEGORY: Record<UserCategory, string[]> = {
  'BEG': [
    'fitness-tracker-integration',
    'personalized-workout-generator',
    'nutrition-analysis',
    'health-metrics-visualization',
    'workout-plan-scheduler',
    'exercise-library-search',
    'sleep-quality-analyzer',
    'training-program-builder'
  ],
  'INT': [
    'fitness-tracker-integration',
    'personalized-workout-generator',
    'nutrition-analysis',
    'ai-form-analysis',
    'health-metrics-visualization',
    'voice-coaching-integration',
    'progress-milestone-alerts',
    'workout-plan-scheduler',
    'exercise-library-search',
    'recovery-recommendation-engine',
    'training-program-builder',
    'sleep-quality-analyzer'
  ],
  'ADV': [
    'fitness-tracker-integration',
    'personalized-workout-generator',
    'nutrition-analysis',
    'ai-form-analysis',
    'health-metrics-visualization',
    'voice-coaching-integration',
    'progress-milestone-alerts',
    'smart-goal-setting-assistant',
    'fitness-device-connection-helper',
    'workout-plan-scheduler',
    'exercise-library-search',
    'recovery-recommendation-engine',
    'training-program-builder',
    'ai-personal-record-tracker',
    'sleep-quality-analyzer'
  ],
  'PRO': [
    'fitness-tracker-integration',
    'personalized-workout-generator',
    'nutrition-analysis',
    'ai-form-analysis',
    'health-metrics-visualization',
    'voice-coaching-integration',
    'progress-milestone-alerts',
    'smart-goal-setting-assistant',
    'fitness-device-connection-helper',
    'workout-plan-scheduler',
    'exercise-library-search',
    'recovery-recommendation-engine',
    'training-program-builder',
    'community-challenge-creator',
    'sleep-quality-analyzer',
    'cross-platform-activity-sync',
    'ai-personal-record-tracker',
    'voice-activated-data-queries'
  ],
  'VIP': [
    'fitness-tracker-integration',
    'personalized-workout-generator',
    'nutrition-analysis',
    'ai-form-analysis',
    'health-metrics-visualization',
    'voice-coaching-integration',
    'progress-milestone-alerts',
    'smart-goal-setting-assistant',
    'fitness-device-connection-helper',
    'workout-plan-scheduler',
    'exercise-library-search',
    'recovery-recommendation-engine',
    'training-program-builder',
    'community-challenge-creator',
    'sleep-quality-analyzer',
    'cross-platform-activity-sync',
    'ai-personal-record-tracker',
    'voice-activated-data-queries',
    'multilingual-fitness-support',
    'workout-session-export'
  ]
};

const ALL_FEATURES: Record<string, {
  title: string;
  description: string;
  icon: LucideIcon;
  premium?: boolean;
}> = {
  'fitness-tracker-integration': {
    title: 'Fitness Tracker Integration',
    description: 'Connect with your favorite fitness trackers and wearables to sync your activity data.',
    icon: Smartphone
  },
  'personalized-workout-generator': {
    title: 'Personalized Workout Generator',
    description: 'Get custom workout routines tailored to your fitness level, goals, and available equipment.',
    icon: Dumbbell
  },
  'nutrition-analysis': {
    title: 'Nutrition Analysis & Recommendations',
    description: 'Track your diet and receive personalized nutrition advice to support your fitness goals.',
    icon: PieChart
  },
  'ai-form-analysis': {
    title: 'AI Form Analysis',
    description: 'Upload videos of your workout and receive AI-powered feedback on your exercise form.',
    icon: Activity,
    premium: true
  },
  'health-metrics-visualization': {
    title: 'Health Metrics Visualization',
    description: 'View comprehensive dashboards of your health and fitness metrics over time.',
    icon: BarChart3
  },
  'voice-coaching-integration': {
    title: 'Voice Coaching Integration',
    description: 'Receive real-time audio guidance during your workouts with AI voice coaching.',
    icon: Mic,
    premium: true
  },
  'progress-milestone-alerts': {
    title: 'Progress Milestone Alerts',
    description: 'Get notified when you reach important fitness milestones and achievements.',
    icon: BellRing
  },
  'smart-goal-setting-assistant': {
    title: 'Smart Goal Setting Assistant',
    description: 'Set realistic, achievable fitness goals with AI-powered guidance and tracking.',
    icon: LineChart,
    premium: true
  },
  'fitness-device-connection-helper': {
    title: 'Fitness Device Connection Helper',
    description: 'Easily connect and configure your fitness devices and smart gym equipment.',
    icon: Zap,
    premium: true
  },
  'workout-plan-scheduler': {
    title: 'Workout Plan Scheduler',
    description: 'Plan and schedule your workout routines with smart calendar integration.',
    icon: Calendar
  },
  'exercise-library-search': {
    title: 'Exercise Library Search',
    description: 'Access a comprehensive database of exercises with video demonstrations and instructions.',
    icon: Search
  },
  'recovery-recommendation-engine': {
    title: 'Recovery Recommendation Engine',
    description: 'Get personalized recovery suggestions based on your workout intensity and physical state.',
    icon: Heart
  },
  'training-program-builder': {
    title: 'Training Program Builder',
    description: 'Create custom training programs spanning weeks or months to achieve your specific goals.',
    icon: ListChecks
  },
  'community-challenge-creator': {
    title: 'Community Challenge Creator',
    description: 'Create and participate in fitness challenges with friends and the Fitness AI community.',
    icon: Users,
    premium: true
  },
  'sleep-quality-analyzer': {
    title: 'Sleep Quality Analyzer',
    description: 'Track and analyze your sleep patterns and receive recommendations for improvement.',
    icon: Clock
  },
  'cross-platform-activity-sync': {
    title: 'Cross-Platform Activity Sync',
    description: 'Sync your fitness data across multiple platforms and applications seamlessly.',
    icon: Share2,
    premium: true
  },
  'ai-personal-record-tracker': {
    title: 'AI Personal Record Tracker',
    description: 'Automatically track your personal records and receive suggestions for improvement.',
    icon: Navigation,
    premium: true
  },
  'voice-activated-data-queries': {
    title: 'Voice-Activated Data Queries',
    description: 'Ask questions about your fitness data and get instant voice responses.',
    icon: Mic,
    premium: true
  },
  'multilingual-fitness-support': {
    title: 'Multilingual Fitness Support',
    description: 'Access all Fitness AI features in multiple languages for global accessibility.',
    icon: Globe,
    premium: true
  },
  'workout-session-export': {
    title: 'Workout Session Export',
    description: 'Export your workout sessions and data in various formats for external analysis.',
    icon: Play,
    premium: true
  }
};

// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  isLocked = false,
  isPremium = false,
  onClick 
}) => {
  return (
    <div 
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden 
        transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700
        ${isLocked ? 'opacity-60 grayscale hover:opacity-70' : 'hover:scale-[1.02]'}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-xs text-white rounded-full px-2 py-0.5 font-medium shadow-sm">
          Premium
        </div>
      )}
      
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/30 backdrop-blur-[1px] z-10">
          <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mr-4">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Features Grid Component
const FeaturesGrid: React.FC<FeaturesGridProps> = ({ 
  userCategory,
  searchQuery = '',
  onFeatureClick = () => {}
}) => {
  // Get the list of unlocked features based on user category
  const unlockedFeatures = FEATURES_BY_CATEGORY[userCategory] || FEATURES_BY_CATEGORY.BEG;
  
  // Filter features by search query
  const filteredFeatures = Object.entries(ALL_FEATURES)
    .filter(([id, feature]) => {
      if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          feature.title.toLowerCase().includes(query) || 
          feature.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by locked status (unlocked first)
      const aIsUnlocked = unlockedFeatures.includes(a[0]);
      const bIsUnlocked = unlockedFeatures.includes(b[0]);
      
      if (aIsUnlocked && !bIsUnlocked) return -1;
      if (!aIsUnlocked && bIsUnlocked) return 1;
      
      // Then alphabetically
      return a[1].title.localeCompare(b[1].title);
    });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredFeatures.map(([id, feature]) => {
        const isUnlocked = unlockedFeatures.includes(id);
        
        return (
          <FeatureCard
            key={id}
            title={feature.title}
            description={feature.description}
            icon={<feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            isLocked={!isUnlocked}
            isPremium={feature.premium}
            onClick={() => onFeatureClick(id)}
          />
        );
      })}
    </div>
  );
};

export default FeaturesGrid;
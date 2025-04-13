import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart,
  TrendingUp,
  Link,
  Headphones,
  Hash,
  CheckCircle,
  Clock,
  Users,
  Timer,
  LineChart,
  MessageCircle,
  Utensils,
  CalendarClock,
  BadgeDollarSign,
  QrCode,
  Video,
  Glasses,
  Target,
  BarChart3,
  FileText
} from 'lucide-react';

// Define feature data
const features = [
  {
    title: 'Smart Workout Analysis',
    description: 'AI-powered analysis of your form and technique to maximize results and prevent injuries.',
    icon: <BarChart className="h-8 w-8 text-primary" />
  },
  {
    title: 'Adaptive Training',
    description: 'Workouts that evolve based on your performance, goals, and feedback for optimal progression.',
    icon: <TrendingUp className="h-8 w-8 text-primary" />
  },
  {
    title: 'Health Tracker Integration',
    description: 'Seamless connections with Google Fit, Apple Health, and other fitness wearables.',
    icon: <Link className="h-8 w-8 text-primary" />
  },
  {
    title: 'Voice-Guided Workouts',
    description: 'Real-time audio coaching that guides you through exercises with proper form cues.',
    icon: <Headphones className="h-8 w-8 text-primary" />
  },
  {
    title: 'Rep Counter',
    description: 'Automatic counting of repetitions using advanced motion detection technology.',
    icon: <Hash className="h-8 w-8 text-primary" />
  },
  {
    title: 'Form Visualizer',
    description: 'Visual feedback on your exercise form with real-time corrections and improvements.',
    icon: <CheckCircle className="h-8 w-8 text-primary" />
  },
  {
    title: 'Recovery Recommendations',
    description: 'Personalized recovery protocols based on workout intensity and physiological markers.',
    icon: <Clock className="h-8 w-8 text-primary" />
  },
  {
    title: 'Community Challenges',
    description: 'Group fitness challenges to boost motivation and accountability among members.',
    icon: <Users className="h-8 w-8 text-primary" />
  },
  {
    title: 'Rest Timer',
    description: 'Customizable rest periods between sets optimized for your training goals.',
    icon: <Timer className="h-8 w-8 text-primary" />
  },
  {
    title: 'Personalized Analytics',
    description: 'Comprehensive metrics and insights tailored to your specific fitness journey.',
    icon: <LineChart className="h-8 w-8 text-primary" />
  },
  {
    title: 'Real-time Feedback',
    description: 'Instant guidance and corrections during workouts to optimize performance.',
    icon: <MessageCircle className="h-8 w-8 text-primary" />
  },
  {
    title: 'AI Nutrition Coach',
    description: 'Smart dietary recommendations aligned with your fitness goals and preferences.',
    icon: <Utensils className="h-8 w-8 text-primary" />
  },
  {
    title: 'Meal Planning System',
    description: 'Weekly meal plans with shopping lists and macro tracking to support your training.',
    icon: <CalendarClock className="h-8 w-8 text-primary" />
  },
  {
    title: 'Subscription Tiers',
    description: 'Flexible membership levels to match your commitment and access premium features.',
    icon: <BadgeDollarSign className="h-8 w-8 text-primary" />
  },
  {
    title: 'QR Code Access System',
    description: 'Unique access codes for quick login and sharing workouts across devices.',
    icon: <QrCode className="h-8 w-8 text-primary" />
  },
  {
    title: 'Workout Video Generator',
    description: 'Create shareable summaries of your workouts with performance highlights.',
    icon: <Video className="h-8 w-8 text-primary" />
  },
  {
    title: 'AR/VR Training Experience',
    description: 'Immersive training environments for guided workouts with virtual trainers.',
    icon: <Glasses className="h-8 w-8 text-primary" />
  },
  {
    title: 'Goal Milestone Tracker',
    description: 'Set fitness objectives with progress tracking and achievement celebrations.',
    icon: <Target className="h-8 w-8 text-primary" />
  },
  {
    title: 'Body Progress Graph',
    description: 'Visual tracking of physical changes, measurements, and transformations over time.',
    icon: <BarChart3 className="h-8 w-8 text-primary" />
  },
  {
    title: 'Exportable Fitness Reports',
    description: 'Comprehensive summaries of your fitness journey to share with trainers or healthcare providers.',
    icon: <FileText className="h-8 w-8 text-primary" />
  }
];

const FeaturesShowcase: React.FC = () => {
  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Advanced Features</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore our comprehensive suite of AI-powered features designed to transform 
            your fitness journey with personalized guidance and tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 h-full"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Dumbbell,
  Activity,
  Utensils,
  Video,
  LineChart,
  Headphones,
  Trophy,
  Target,
  Smartphone,
  Calendar,
  FileText,
  Heart,
  RefreshCw,
  BarChart2,
  Users,
  Moon,
  UploadCloud,
  Award,
  Mic,
  Download,
  Heart as HeartIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../App';

// Import SVG pattern
import patternSvg from '../assets/fitness-pattern.svg';

// App features based on the 20 core features identified
const features = [
  {
    title: "Fitness Tracker Integration",
    description: "Connect and display data from Google Fit, Apple Health, and Strava directly in chat",
    icon: Activity
  },
  {
    title: "Personalized Workout Generator",
    description: "Create custom workouts based on your goals, equipment, and fitness level",
    icon: Dumbbell
  },
  {
    title: "Nutrition Analysis & Recommendations",
    description: "Get nutritional insights and meal plans aligned with your fitness goals",
    icon: Utensils
  },
  {
    title: "AI Form Analysis",
    description: "Upload exercise videos for AI feedback on technique and form correction",
    icon: Video
  },
  {
    title: "Health Metrics Visualization",
    description: "View dynamic charts of your fitness progress and health metrics",
    icon: LineChart
  },
  {
    title: "Voice Coaching Integration",
    description: "Get real-time audio guidance with rep counting and form feedback",
    icon: Headphones
  },
  {
    title: "Progress Milestone Alerts",
    description: "Receive notifications when you achieve fitness milestones or personal records",
    icon: Trophy
  },
  {
    title: "Smart Goal Setting Assistant",
    description: "Create and track SMART fitness goals with adjustments based on performance",
    icon: Target
  },
  {
    title: "Fitness Device Connection Helper",
    description: "Connect and troubleshoot various fitness trackers with guided assistance",
    icon: Smartphone
  },
  {
    title: "Workout Plan Scheduler",
    description: "Schedule personalized workout sessions with reminders and progression",
    icon: Calendar
  },
  {
    title: "Exercise Library Search",
    description: "Access detailed instructions with visual guides for hundreds of exercises",
    icon: FileText
  },
  {
    title: "Recovery Recommendation Engine",
    description: "Get personalized recovery techniques based on workout intensity and sleep data",
    icon: Heart
  },
  {
    title: "Training Program Builder",
    description: "Create adaptive multi-week programs that evolve with your progress",
    icon: BarChart2
  },
  {
    title: "Community Challenge Creator",
    description: "Design and join fitness challenges with friends and the community",
    icon: Users
  },
  {
    title: "Sleep Quality Analyzer",
    description: "Get actionable recommendations to improve sleep quality and recovery",
    icon: Moon
  },
  {
    title: "Cross-Platform Activity Sync",
    description: "Synchronize fitness data across multiple platforms and resolve discrepancies",
    icon: RefreshCw
  },
  {
    title: "AI Personal Record Tracker",
    description: "Automatically identify and celebrate your personal bests across activities",
    icon: Award
  },
  {
    title: "Voice-Activated Data Queries",
    description: "Request specific fitness metrics and comparisons using voice commands",
    icon: Mic
  },
  {
    title: "Multilingual Fitness Support",
    description: "Communicate about fitness in English, Spanish, French, and Portuguese",
    icon: FileText
  },
  {
    title: "Workout Session Export",
    description: "Export your plans and progress in various formats for sharing or reference",
    icon: Download
  }
];

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const loginSuccess = login(username, password);
    if (loginSuccess) {
      setLoginError('');
      setShowLoginModal(false);
      setLocation('/');
    } else {
      setLoginError('Invalid credentials. Try using admin/admin123456');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-4 bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <HeartIcon className="h-6 w-6 text-white animate-pulse" />
          <h1 className="text-xl font-bold text-white">Fitness AI</h1>
        </div>
        <Button 
          onClick={() => setShowLoginModal(true)} 
          variant="secondary"
          className="font-semibold shadow-md hover:shadow-lg"
        >
          Login
        </Button>
      </nav>

      {/* Hero Section */}
      <div 
        className="relative flex flex-col items-center justify-center px-6 py-24"
        style={{
          backgroundImage: `url(${patternSvg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"></div>
        
        <Badge variant="outline" className="relative mb-6 text-sm py-1 px-4 bg-white/10 backdrop-blur-sm border-primary/20">
          <span className="animate-pulse mr-2 text-primary">●</span> Fitness Intelligence Platform
        </Badge>
        
        <h1 className="relative text-4xl md:text-6xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
          Transform Your Fitness Journey with AI
        </h1>
        
        <p className="relative text-xl text-center max-w-3xl mb-8">
          Use the power of artificial intelligence to optimize your workouts, track your progress, and achieve your health goals faster.
        </p>
        
        <div className="relative flex flex-wrap gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => setShowLoginModal(true)}
            className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg"
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => setLocation('/chat')}
            className="border-primary text-primary hover:bg-primary/10"
          >
            Chat with Assistant
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 bg-background">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* About/Mission Section */}
      <div className="py-16 px-6 bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg mb-8">
            Fitness AI combines cutting-edge artificial intelligence with proven fitness science to create a personalized training experience unlike any other. 
            We leverage data from your favorite fitness trackers and devices to provide insights, recommendations, and guidance tailored specifically to your body and goals.
          </p>
          <p className="text-lg">
            Our platform connects with Google Fit, Apple Health, Fitbit, and Strava to give you a comprehensive view of your fitness journey and help you achieve results faster.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 px-6 bg-gradient-to-b from-background to-primary/20 text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to Elevate Your Fitness Journey?</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => setShowLoginModal(true)}
          >
            Get Started
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => window.location.href = "#features"}
          >
            Explore Features
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => setLocation('/chat')}
          >
            Chat with Assistant
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Fitness AI. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Username</label>
                <Input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                {loginError && <p className="text-sm text-destructive mt-1">{loginError}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowLoginModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Login
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
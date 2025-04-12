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
          <Activity className="h-6 w-6 text-white animate-pulse" />
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
      <div className="py-16 px-6 bg-background" id="features">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm py-1 px-4 bg-white/10 backdrop-blur-sm border-primary/20">
            <span className="mr-2 text-primary">●</span>Comprehensive Platform
          </Badge>
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Key Features
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Fitness AI brings together 20 powerful features to transform your fitness journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="h-full group hover:shadow-md transition-all duration-300 hover:border-primary/50 overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors duration-300">
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
      <div className="py-20 px-6 bg-gradient-to-b from-white to-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-sm py-1 px-4 bg-white/10 backdrop-blur-sm border-primary/20">
              <span className="mr-2 text-primary">●</span>Our Vision
            </Badge>
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-4">
              Revolutionizing Fitness Through AI
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Personalized Experience</h3>
                </div>
                <p className="text-gray-600">
                  Our platform combines cutting-edge artificial intelligence with proven fitness science to create a personalized training experience unlike any other.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <RefreshCw className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Seamless Integration</h3>
                </div>
                <p className="text-gray-600">
                  Connect with Google Fit, Apple Health, Fitbit, and Strava to give you a comprehensive view of your fitness journey and help you achieve results faster.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-primary mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-6">
                We believe that everyone deserves access to personalized fitness guidance that adapts to their unique body, goals, and lifestyle.
              </p>
              <p className="text-gray-600 mb-6">
                By leveraging data from your favorite fitness trackers and devices, we provide insights, recommendations, and guidance tailored specifically to you.
              </p>
              <p className="text-gray-600">
                Fitness AI is committed to continuously evolving with the latest research in exercise science, nutrition, and AI technology to provide you with the most effective tools for your fitness journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-20 px-6 relative overflow-hidden" 
        style={{
          backgroundImage: `url(${patternSvg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-primary/5"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-sm py-1 px-4 bg-white/10 backdrop-blur-sm border-primary/20 inline-flex">
            <span className="animate-pulse mr-2 text-primary">●</span>Start Today
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Revolutionize Your <span className="text-primary">Fitness Journey</span>?
          </h2>
          
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of users who have transformed their approach to health and fitness with our AI-powered platform.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowLoginModal(true)}
              className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg px-8 py-6 text-lg"
            >
              Get Started Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => window.location.href = "#features"}
              className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg"
            >
              Explore Features
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">20+ AI Features</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">4 Fitness Trackers</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartIcon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Activity className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-bold text-white">Fitness AI</h3>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Integrations</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Pricing</a>
            </div>
          </div>
          
          <div className="h-px w-full bg-gray-800 my-6"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 Fitness AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">Support</a>
              <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors">Contact</a>
            </div>
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
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
  Heart as HeartIcon,
  Play,
  CalendarDays,
  Clock,
  CheckCircle,
  ChevronRight,
  UserPlus,
  LogIn,
  Menu,
  Zap,
  ArrowRight,
  Share2,
  Flame,
  Sparkles,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../App';
import { SidePanel } from '../components/SidePanel';
import { FitnessSlider } from '../components/FitnessSlider';

// Import SVG assets 
import patternSvg from '../assets/fitness-pattern.svg';
import workoutThumbnail from '../assets/workout-thumbnail.svg';
import nutritionThumbnail from '../assets/nutrition-thumbnail.svg';
import trackingThumbnail from '../assets/tracking-thumbnail.svg';
import runnerSilhouette from '../assets/runner-silhouette.svg';
import weightLifter from '../assets/weight-lifter.svg';
import yogaPose from '../assets/yoga-pose.svg';
import natureBackground from '../assets/nature-background.svg';
import mountainsFitness from '../assets/mountains-fitness.svg';
import beachWorkout from '../assets/beach-workout.svg';
import gymScene from '../assets/gym-scene.svg';

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

// Slider images
const sliderImages = [
  {
    image: gymScene,
    title: "TRANSFORM YOUR WORKOUT ROUTINE",
    description: "Experience AI-powered workout plans designed specifically for your body type and goals."
  },
  {
    image: beachWorkout, 
    title: "TRAIN ANYWHERE, ANYTIME",
    description: "Take your fitness journey with you wherever you go with our adaptive training system."
  },
  {
    image: mountainsFitness,
    title: "PUSH YOUR BOUNDARIES",
    description: "Reach new heights with personalized challenges that evolve as you progress."
  }
];

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      {/* Side Panel */}
      <SidePanel isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Top Navigation */}
      <nav className="site-header flex items-center justify-between p-4 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(true)}
            className="text-primary-dark hover:bg-gray-100 mr-1"
          >
            <Menu className="h-5 w-5" />
          </Button>
        
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary-dark">Fitness AI</h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-dark-text hover:text-primary transition-colors">Features</a>
          <a href="#about" className="text-dark-text hover:text-primary transition-colors">About</a>
          <a href="#pricing" className="text-dark-text hover:text-primary transition-colors">Pricing</a>
          <a href="#contact" className="text-dark-text hover:text-primary transition-colors">Contact</a>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setShowLoginModal(true)} 
            variant="ghost"
            className="text-primary-dark hover:bg-gray-100"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login
          </Button>
          
          <Button 
            onClick={() => setShowSignupModal(true)} 
            className="primary-button font-medium"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Sign Up Free
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="h-full">
            <FitnessSlider slides={sliderImages} autoPlayInterval={6000} />
          </div>
        </div>
        
        <div className="relative flex flex-col items-center justify-center px-6 py-32 md:py-40 lg:py-48 z-10">
          <Badge variant="outline" className="mb-6 text-sm py-1 px-4 bg-white/80 border-primary/20 text-primary-dark">
            <span className="mr-2 text-primary">●</span> Fitness Intelligence Platform
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 text-primary-dark fade-in">
            Transform Your Fitness <span className="text-primary">Journey</span>
          </h1>
          
          <p className="text-xl text-center max-w-3xl mb-10 text-dark-text fade-in-up">
            Use the power of artificial intelligence to optimize your workouts, track your progress, and achieve your health goals faster than ever before.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center slide-in-right">
            <Button 
              size="lg" 
              onClick={() => setShowSignupModal(true)}
              className="primary-button font-medium shadow-md px-8 py-6 text-lg"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setLocation('/chat')}
              className="outline-button px-8 py-6 text-lg"
            >
              <Activity className="mr-2 h-5 w-5" />
              Try AI Coach
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full">
            <div className="stat-card hover-scale">
              <div className="stat-icon blue">
                <Flame className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-dark-text">800+</h3>
              <p className="text-sm text-light-text">Workouts</p>
            </div>
            
            <div className="stat-card hover-scale">
              <div className="stat-icon coral">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-dark-text">15K+</h3>
              <p className="text-sm text-light-text">Active Users</p>
            </div>
            
            <div className="stat-card hover-scale">
              <div className="stat-icon blue">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-dark-text">99%</h3>
              <p className="text-sm text-light-text">Success Rate</p>
            </div>
          </div>
          
          <div className="absolute bottom-5 animate-bounce">
            <ArrowRight className="h-6 w-6 text-primary-dark/70 rotate-90" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-gradient-bg" id="features">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-sm py-1 px-4 bg-white/50 border-primary/20">
            <span className="mr-2 text-primary">●</span>Comprehensive Platform
          </Badge>
          <h2 className="text-4xl font-bold text-primary-dark mb-4">
            Key Features
          </h2>
          <p className="mt-4 text-lg text-light-text max-w-2xl mx-auto">
            Fitness AI brings together powerful features to transform your fitness journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="h-full bg-white hover:shadow-md transition-all duration-300 hover:border-primary/20 overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl text-primary-dark">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-light-text">{feature.description}</CardDescription>
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
        
        {/* Fitness Preview Section with Videos/Live Content */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-sm py-1 px-4 bg-white/10 backdrop-blur-sm border-primary/20">
              <span className="animate-pulse mr-2 text-primary">●</span>Live Fitness Content
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Experience Our Premium Fitness Content</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore professionally designed workout sessions, nutrition plans, and real-time tracking features to maximize your fitness results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
            {/* Workout Preview */}
            <div className="video-preview group hover-scale">
              <div className="relative rounded-xl overflow-hidden">
                <img src={workoutThumbnail} alt="Workout Preview" className="w-full h-auto" />
                <div className="play-button group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Play className="h-6 w-6" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Premium Content</span>
                  </div>
                  <h3 className="text-lg font-bold">HIIT Workout Session</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-gray-300" />
                      <span className="text-xs text-gray-300">New</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-300" />
                      <span className="text-xs text-gray-300">30 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Nutrition Preview */}
            <div className="video-preview group hover-scale">
              <div className="relative rounded-xl overflow-hidden">
                <img src={nutritionThumbnail} alt="Nutrition Preview" className="w-full h-auto" />
                <div className="play-button group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Play className="h-6 w-6" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Live Session</span>
                  </div>
                  <h3 className="text-lg font-bold">Personalized Meal Planning</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-gray-300" />
                      <span className="text-xs text-gray-300">Today</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-300" />
                      <span className="text-xs text-gray-300">45 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Tracking Preview */}
            <div className="video-preview group hover-scale">
              <div className="relative rounded-xl overflow-hidden">
                <img src={trackingThumbnail} alt="Tracking Preview" className="w-full h-auto" />
                <div className="play-button group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Play className="h-6 w-6" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Analytics</span>
                  </div>
                  <h3 className="text-lg font-bold">Advanced Progress Tracking</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4 text-gray-300" />
                      <span className="text-xs text-gray-300">Weekly</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-300" />
                      <span className="text-xs text-gray-300">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              variant="outline" 
              className="hover-purple-text px-8 py-3 text-lg font-medium"
              onClick={() => setShowLoginModal(true)}
            >
              Explore All Content <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
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
              className="glow-button bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg px-8 py-6 text-lg hover-purple"
            >
              Get Started Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => window.location.href = "#features"}
              className="border-primary text-primary hover-purple-text px-8 py-6 text-lg"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">Login to Fitness AI</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowLoginModal(false)}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form onSubmit={handleLogin}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-2 text-gray-700">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12"
                    required
                  />
                  {loginError && (
                    <p className="text-red-500 text-sm mt-1">{loginError}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full energy-button text-white h-12 text-base font-semibold"
                >
                  Login
                </Button>
                
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <p className="text-sm text-gray-400">OR</p>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                      <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="h-12">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"
                      />
                    </svg>
                    Facebook
                  </Button>
                </div>
                
                <div className="text-center text-sm text-gray-500 pt-3">
                  <p>For demo, use: <span className="font-semibold">admin / admin123456</span></p>
                </div>
                
                <div className="text-center text-sm mt-4">
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <button 
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => {
                        setShowLoginModal(false);
                        setShowSignupModal(true);
                      }}
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">Create Your Account</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSignupModal(false)}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // In a real app, this would create a user account
              setShowSignupModal(false);
              setShowLoginModal(true);
            }}>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-gray-700">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      className="h-12"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-gray-700">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      className="h-12"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="h-12"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newUsername" className="block text-sm font-medium mb-2 text-gray-700">
                    Username
                  </label>
                  <Input
                    id="newUsername"
                    type="text"
                    placeholder="Choose a username"
                    className="h-12"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-gray-700">
                    Password
                  </label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Create a strong password"
                    className="h-12"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full energy-button text-white h-12 text-base font-semibold"
                >
                  Create Account
                </Button>
                
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200"></div>
                  <p className="text-sm text-gray-400">OR</p>
                  <div className="flex-1 h-px bg-gray-200"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                      <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="h-12">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"
                      />
                    </svg>
                    Facebook
                  </Button>
                </div>
                
                <div className="text-center text-sm mt-4">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button 
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => {
                        setShowSignupModal(false);
                        setShowLoginModal(true);
                      }}
                    >
                      Log in
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
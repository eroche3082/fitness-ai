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
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../App';
import { SidePanel } from '../components/SidePanel';

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-gradient-bg relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <img src="/src/assets/abstract-bg.svg" alt="" className="w-full h-auto min-h-full object-cover"/>
      </div>
      
      {/* Side Panel */}
      <SidePanel isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Header */}
      <header className="site-header py-4 sticky top-0 z-30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 md:hidden text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white">Fitness AI</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Button variant="link" className="text-white hover:text-primary-light">Features</Button>
              <Button variant="link" className="text-white hover:text-primary-light">Integrations</Button>
              <Button variant="link" className="text-white hover:text-primary-light">Pricing</Button>
              <Button variant="link" className="text-white hover:text-primary-light">Support</Button>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex border-white text-white hover:bg-white/10"
                onClick={() => setShowLoginModal(true)}
              >
                Log in
              </Button>
              <Button
                size="sm"
                className="bg-primary text-white hover:bg-primary-dark"
                onClick={() => setShowSignupModal(true)}
              >
                Sign up
              </Button>
              
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
              <nav className="flex flex-col space-y-4">
                <Button variant="link" className="text-white hover:text-primary-light justify-start px-0">Features</Button>
                <Button variant="link" className="text-white hover:text-primary-light justify-start px-0">Integrations</Button>
                <Button variant="link" className="text-white hover:text-primary-light justify-start px-0">Pricing</Button>
                <Button variant="link" className="text-white hover:text-primary-light justify-start px-0">Support</Button>
                <Button
                  variant="outline"
                  className="w-full mt-2 text-white border-white hover:bg-white/10"
                  onClick={() => {
                    setShowLoginModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Log in
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="fitness-header py-16 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
                <span className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI-Powered Health & Fitness
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your <span className="text-secondary-light">Health</span> With Smart Fitness
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Your personalized AI coach for better workouts, nutrition tracking, and health monitoring - all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  className="bg-white text-primary-dark hover:bg-white/90 font-medium"
                  onClick={() => setShowSignupModal(true)}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Watch Demo
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative mx-auto md:ml-auto h-[400px] w-full max-w-[500px]">
              <div className="fitness-slider rounded-3xl overflow-hidden shadow-xl">
                <div className={`slide ${activeSlide === 0 ? 'active' : ''}`}>
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
                    alt="AI fitness tracking"
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className={`slide ${activeSlide === 1 ? 'active' : ''}`}>
                  <img 
                    src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80"
                    alt="Smart workout planning"
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className={`slide ${activeSlide === 2 ? 'active' : ''}`}>
                  <img 
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2653&q=80"
                    alt="Nutrition tracking"
                    className="object-cover h-full w-full"
                  />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center flex-col">
                <span className="text-primary-dark font-bold text-sm">Powered by</span>
                <span className="text-primary font-bold">Gemini AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-xl font-medium text-light-text mb-6">Integrates with your favorite fitness devices</h2>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <span className="font-medium">Google Fit</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                <span className="font-medium">Apple Health</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-500" />
                <span className="font-medium">Fitbit</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-orange-500" />
                <span className="font-medium">Strava</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="font-medium">Garmin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-bg relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-30">
          <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-blue-200"></div>
          <div className="absolute bottom-1/3 -right-20 w-64 h-64 rounded-full bg-blue-300 opacity-30"></div>
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-primary opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-primary text-sm font-medium mb-4">
              <span className="flex items-center justify-center">
                <Zap className="h-4 w-4 mr-2" />
                Smart Features
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-4">Reinvent Your Fitness Journey</h2>
            <p className="text-xl text-light-text max-w-3xl mx-auto">
              Our AI-powered platform brings cutting-edge technology to your health and fitness routine.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="fitness-card p-6 hover-scale fade-in">
              <div className="stat-icon blue mb-6">
                <Dumbbell className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-dark">Smart Workout Plans</h3>
              <p className="text-light-text">
                AI generates personalized workout routines based on your goals, fitness level, and available equipment.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="fitness-card p-6 hover-scale fade-in">
              <div className="stat-icon primary mb-6">
                <Utensils className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-dark">Nutrition Analysis</h3>
              <p className="text-light-text">
                Track meals with AI food recognition and get personalized nutrition recommendations.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="fitness-card p-6 hover-scale fade-in">
              <div className="stat-icon dark-blue mb-6">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-dark">Health Monitoring</h3>
              <p className="text-light-text">
                Track vital health metrics, sleep patterns, and recovery to optimize your performance.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="fitness-card p-6 hover-scale fade-in">
              <div className="stat-icon blue mb-6">
                <Mic className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-dark">Voice Coaching</h3>
              <p className="text-light-text">
                Get real-time voice guidance and form correction during your workouts with AI rep counting.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="fitness-card p-6 hover-scale fade-in">
              <div className="stat-icon dark-blue mb-6">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-dark">Progress Analytics</h3>
              <p className="text-light-text">
                Visualize your progress with detailed insights and AI-powered improvement suggestions.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="fitness-card p-6 hover-scale fade-in">
              <div className="stat-icon primary mb-6">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-primary-dark">Multi-Device Sync</h3>
              <p className="text-light-text">
                Seamlessly connect and sync with all major fitness trackers, watches and health apps.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button className="bg-[var(--fitness-primary)] text-white hover:bg-[var(--fitness-dark)] py-2 px-6" size="lg">
              Explore All Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-primary text-sm font-medium mb-4">
              <span className="flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                How It Works
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-4">Your Fitness Journey in 3 Simple Steps</h2>
            <p className="text-xl text-light-text max-w-3xl mx-auto">
              Getting started with Fitness AI is easy. Here's how it works.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-dark">Connect Your Devices</h3>
              <p className="text-light-text">
                Link your fitness trackers, smartwatches, or health apps to automatically sync your data.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-dark">Set Your Goals</h3>
              <p className="text-light-text">
                Tell us your fitness goals, preferences, and limitations so our AI can personalize everything.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3 text-primary-dark">Start Your Journey</h3>
              <p className="text-light-text">
                Follow your personalized plans, track your progress, and adjust based on AI recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-bg relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-30">
          <div className="absolute -top-10 right-1/4 w-48 h-48 rounded-full bg-blue-200"></div>
          <div className="absolute top-1/2 -right-10 w-36 h-36 rounded-full bg-blue-300 opacity-30"></div>
          <div className="absolute -bottom-10 left-1/4 w-52 h-52 rounded-full bg-primary opacity-20"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-primary text-sm font-medium mb-4">
              <span className="flex items-center justify-center">
                <Users className="h-4 w-4 mr-2" />
                Success Stories
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-4">Transforming Lives Daily</h2>
            <p className="text-xl text-light-text max-w-3xl mx-auto">
              Join thousands of users who have achieved their fitness goals with our AI-powered platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="fitness-card p-8 hover-scale">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="h-5 w-5"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-light-text mb-6">
                "The AI workout suggestions are spot on! It's like having a personal trainer who knows exactly what I need each day."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden mr-4 flex items-center justify-center text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-dark">Sarah Johnson</h4>
                  <p className="text-sm text-light-text">Lost 25 lbs in 4 months</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="fitness-card p-8 hover-scale">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="h-5 w-5"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-light-text mb-6">
                "The integration with my fitness tracker makes tracking my progress effortless. Best fitness app I've ever used!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden mr-4 flex items-center justify-center text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-dark">Michael Torres</h4>
                  <p className="text-sm text-light-text">Marathon runner</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="fitness-card p-8 hover-scale">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor" 
                      className="h-5 w-5"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-light-text mb-6">
                "The nutrition suggestions are game-changing. I've never felt better, and my performance has improved significantly."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full overflow-hidden mr-4 flex items-center justify-center text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-dark">Emma Rodriguez</h4>
                  <p className="text-sm text-light-text">Crossfit enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-card hover-scale">
              <h3 className="text-4xl font-bold text-primary mb-2">1M+</h3>
              <p className="text-light-text">Active Users</p>
            </div>
            <div className="stat-card hover-scale">
              <h3 className="text-4xl font-bold text-primary mb-2">87%</h3>
              <p className="text-light-text">Goal Achievement</p>
            </div>
            <div className="stat-card hover-scale">
              <h3 className="text-4xl font-bold text-primary mb-2">20+</h3>
              <p className="text-light-text">Device Integrations</p>
            </div>
            <div className="stat-card hover-scale">
              <h3 className="text-4xl font-bold text-primary mb-2">4.9</h3>
              <p className="text-light-text">App Store Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Choose Your Fitness Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect plan for your fitness goals and lifestyle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-0 max-w-5xl mx-auto relative">
            {/* Background line */}
            <div className="absolute hidden md:block top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent z-0"></div>
            
            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 z-10 pt-8 pb-6 px-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Basic</h3>
                <div className="flex items-end justify-center mb-2">
                  <span className="text-4xl font-bold text-gray-800">$9</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 text-sm">Perfect for fitness beginners</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                    <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                  </div>
                  <span className="text-sm">Basic workout plans</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                    <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                  </div>
                  <span className="text-sm">AI-powered nutrition guidance</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                    <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                  </div>
                  <span className="text-sm">Connect 2 fitness devices</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                    <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                  </div>
                  <span className="text-sm">Weekly progress reports</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center mr-3">
                    <X className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Voice coaching</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center mr-3">
                    <X className="h-3 w-3" />
                  </div>
                  <span className="text-sm">Advanced analytics</span>
                </li>
              </ul>
              
              <div className="mt-auto">
                <Button variant="outline" className="w-full border-[var(--fitness-dark)] text-[var(--fitness-dark)] hover:bg-blue-50 py-1.5">Get Started</Button>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-[var(--fitness-dark)] z-20 transform scale-105 relative">
              <div className="pt-8 pb-6 px-8">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Pro</h3>
                  <div className="flex items-end justify-center mb-2">
                    <span className="text-4xl font-bold text-[var(--fitness-primary)]">$19</span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-gray-600 text-sm">Most popular for fitness enthusiasts</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                      <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                    </div>
                    <span className="text-sm">Advanced workout plans</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                      <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                    </div>
                    <span className="text-sm">Personalized meal planning</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                      <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                    </div>
                    <span className="text-sm">Connect 5 fitness devices</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                      <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                    </div>
                    <span className="text-sm">Voice coaching with rep counting</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                      <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                    </div>
                    <span className="text-sm">Detailed progress analytics</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                      <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                    </div>
                    <span className="text-sm">Priority support</span>
                  </li>
                </ul>
                
                <div className="mt-auto">
                  <Button className="w-full bg-[var(--fitness-dark)] text-white hover:bg-[var(--fitness-primary)] py-1.5">Get Pro</Button>
                </div>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 z-10 pt-8 pb-6 px-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Premium</h3>
                <div className="flex items-end justify-center mb-2">
                  <span className="text-4xl font-bold text-gray-800">$29</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 text-sm">For serious athletes and professionals</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                    <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                  </div>
                  <span className="text-sm">Elite workout plans</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                    <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                  </div>
                  <span className="text-sm">Pro nutrition & recovery coaching</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                    <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                  </div>
                  <span className="text-sm">Unlimited device connections</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                    <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                  </div>
                  <span className="text-sm">Advanced voice coaching</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                    <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                  </div>
                  <span className="text-sm">Predictive performance analytics</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center bg-blue-50 mr-3">
                    <Check className="h-3 w-3 text-[var(--fitness-dark)]" />
                  </div>
                  <span className="text-sm">1-on-1 expert consultations</span>
                </li>
              </ul>
              
              <div className="mt-auto">
                <Button variant="outline" className="w-full border-[var(--fitness-dark)] text-[var(--fitness-dark)] hover:bg-blue-50 py-1.5">Get Premium</Button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12 text-gray-500 text-sm">
            <p>All plans include a 14-day free trial. No credit card required to start.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--fitness-bg)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Start Your Fitness Transformation Today</h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of users who have already revolutionized their approach to fitness with<br className="hidden md:block" /> our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-[var(--fitness-dark)] hover:bg-white/95 font-medium py-2 px-6 rounded-full text-sm flex items-center"
                onClick={() => setShowSignupModal(true)}
              >
                Start For Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 py-2 px-6 rounded-full text-sm"
              >
                View Pricing
              </Button>
            </div>
            <p className="text-white/80 mt-6 text-sm">
              No credit card required. Free 14-day trial.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-white">Fitness AI</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your AI-powered fitness companion for personalized workouts, nutrition, and health tracking.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-primary">Workouts</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Nutrition</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Health Tracking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Voice Coaching</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Device Integration</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-primary">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-white">Get the App</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-white/30 bg-black/50 text-white hover:bg-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-2"
                  >
                    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z" />
                    <path d="M10 2c1 .5 2 2 2 5" />
                  </svg>
                  App Store
                </Button>
                <Button variant="outline" className="w-full justify-start border-white/30 bg-black/50 text-white hover:bg-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 mr-2"
                  >
                    <path d="M3 7v10a1 1 0 0 0 1 1h1" />
                    <path d="M19 7v10a1 1 0 0 1-1 1h-1" />
                    <rect x="5" y="5" width="14" height="12" rx="0.5" />
                    <path d="M8 2l8 0" />
                    <path d="M12 2v3" />
                    <path d="M3 16h1" />
                    <path d="M20 16h1" />
                    <circle cx="12" cy="14" r="0.5" />
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Fitness AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary-dark">Log in to Fitness AI</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowLoginModal(false)}
                  className="rounded-full hover:bg-blue-50 text-primary"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  {loginError && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                      {loginError}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-dark-text">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-dark-text">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full primary-button h-12 text-base font-medium"
                  >
                    Log in
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
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-primary-dark">Create your account</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSignupModal(false)}
                  className="rounded-full hover:bg-blue-50 text-primary"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-dark-text">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-dark-text">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="block text-sm font-medium text-dark-text">
                      Password
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-dark-text">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full primary-button h-12 text-base font-medium"
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
        </div>
      )}
    </div>
  );
}
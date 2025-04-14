import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  ArrowRight, 
  Award,
  BarChart2, 
  Calendar, 
  Clock, 
  Compass, 
  Dumbbell, 
  Heart, 
  Layout, 
  MessageSquare, 
  Share2,
  Smartphone, 
  Trophy,
  Users, 
  Zap
} from 'lucide-react';

export default function Features() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header/Navigation */}
      <header className="w-full bg-black py-4 fixed top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div onClick={() => setLocation('/')} className="flex items-center cursor-pointer">
              <h1 className="text-3xl font-bold text-white tracking-tighter">
                <span className="text-white">FITNESS</span>
                <span className="text-green-500">AI</span>
              </h1>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="link" 
              onClick={() => setLocation('/')}
              className="text-white hover:text-green-500 transition-colors uppercase font-medium"
            >
              Home
            </Button>
            <Button 
              variant="link" 
              onClick={() => setLocation('/features')}
              className="text-green-500 hover:text-green-600 transition-colors uppercase font-medium"
            >
              Features
            </Button>
            <Button 
              variant="link" 
              onClick={() => setLocation('/programs')}
              className="text-white hover:text-green-500 transition-colors uppercase font-medium"
            >
              Programs
            </Button>
            <Button 
              variant="link" 
              onClick={() => setLocation('/contact')}
              className="text-white hover:text-green-500 transition-colors uppercase font-medium"
            >
              Contact Us
            </Button>
            <div className="flex space-x-4 ml-8">
              <Button 
                variant="outline" 
                onClick={() => setLocation('/login')}
                className="border-green-500 text-white hover:bg-green-500 hover:text-black"
              >
                LOGIN
              </Button>
              <Button 
                onClick={() => setLocation('/signup')}
                className="bg-green-500 text-black hover:bg-green-600"
              >
                SIGN UP
              </Button>
            </div>
          </nav>
          <button className="md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-transparent"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Features</h1>
              <p className="text-xl text-gray-300 mb-8">
                Discover the powerful AI-driven features that make Fitness AI the ultimate platform for your fitness journey
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-lg text-gray-300">
                Our platform combines cutting-edge AI technology with fitness expertise to deliver an unparalleled experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Dumbbell className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Personalized Workouts</h3>
                <p className="text-gray-300">
                  AI-generated workout plans tailored to your fitness level, goals, and available equipment that adapt as you progress.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <MessageSquare className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Coach Chatbot</h3>
                <p className="text-gray-300">
                  24/7 access to our intelligent fitness coach that answers questions, provides form tips, and motivates you along the way.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Smartphone className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Fitness Tracker Integration</h3>
                <p className="text-gray-300">
                  Seamless synchronization with popular fitness platforms like Google Fit, Apple Health, Fitbit, and Strava.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <BarChart2 className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Progress Analytics</h3>
                <p className="text-gray-300">
                  Detailed tracking and visualization of your performance metrics, helping you identify trends and areas for improvement.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Voice-Guided Workouts</h3>
                <p className="text-gray-300">
                  AI voice coach guides you through exercises, counts reps, and provides real-time feedback on your form and pace.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community Challenges</h3>
                <p className="text-gray-300">
                  Join fitness challenges with other members, share achievements, and stay motivated with community support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Premium Features</h2>
              <p className="text-lg text-gray-300">
                Unlock the full potential of Fitness AI with our premium membership options
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Premium Feature 1 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-green-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Layout className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Advanced Dashboard</h3>
                <p className="text-gray-300">
                  Get deep insights into your fitness journey with comprehensive analytics, body composition tracking, and goal forecasting.
                </p>
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                    Premium
                  </span>
                </div>
              </div>

              {/* Premium Feature 2 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-green-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Calendar className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Nutrition Planning</h3>
                <p className="text-gray-300">
                  AI-generated meal plans customized to your dietary preferences, restrictions, and fitness goals with precise macro tracking.
                </p>
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                    Premium
                  </span>
                </div>
              </div>

              {/* Premium Feature 3 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-green-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Compass className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Advanced Goal Setting</h3>
                <p className="text-gray-300">
                  Set complex fitness goals with AI-powered recommendations and personalized roadmaps to achievement.
                </p>
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                    Premium
                  </span>
                </div>
              </div>

              {/* Premium Feature 4 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-green-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Heart className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Wellness Integration</h3>
                <p className="text-gray-300">
                  Holistic tracking of sleep, stress, and recovery metrics with personalized recommendations for optimal performance.
                </p>
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                    Premium
                  </span>
                </div>
              </div>

              {/* Premium Feature 5 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-green-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Clock className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Recovery Optimization</h3>
                <p className="text-gray-300">
                  Personalized recovery plans based on your workout intensity, sleep quality, and biometric data.
                </p>
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                    Premium
                  </span>
                </div>
              </div>

              {/* Premium Feature 6 */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 border border-green-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Activity className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Access Code System</h3>
                <p className="text-gray-300">
                  Premium members receive unique QR codes for exclusive access to specialized training programs and VIP content.
                </p>
                <div className="mt-6">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold">
                    Premium
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievement Badge System Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Achievement Badge System</h2>
              <p className="text-lg text-gray-300">
                Track your fitness journey milestones and celebrate your accomplishments with our comprehensive badge system
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Badge 1 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-amber-600/20 flex items-center justify-center mb-6">
                  <Award className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Strength Badges</h3>
                <p className="text-gray-300">
                  Earn badges for completing strength training milestones, from your first workout to impressive lifting achievements.
                </p>
              </div>

              {/* Badge 2 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                  <Activity className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Cardio Achievements</h3>
                <p className="text-gray-300">
                  Track your running, cycling, and cardio progress with badges that celebrate distance, speed, and endurance goals.
                </p>
              </div>

              {/* Badge 3 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                  <Trophy className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Nutrition Excellence</h3>
                <p className="text-gray-300">
                  Earn recognition for maintaining balanced nutrition, staying hydrated, and achieving dietary milestones.
                </p>
              </div>

              {/* Badge 4 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
                  <Share2 className="h-7 w-7 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Shareable Badges</h3>
                <p className="text-gray-300">
                  Share your achievements on social media, download badge images, and inspire your friends with your progress.
                </p>
              </div>
            </div>

            <div className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-8 border border-green-500/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Unlock Your Achievement Potential</h3>
                  <p className="text-gray-300 mb-6">
                    Our badge system features multiple levels for each achievement type, from Bronze to Diamond, with visual progress tracking and personalized recommendations to help you reach the next tier.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center mr-3">
                        <span className="text-xs text-white font-bold">B</span>
                      </div>
                      <span>Bronze - First steps in your journey</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center mr-3">
                        <span className="text-xs text-white font-bold">S</span>
                      </div>
                      <span>Silver - Building consistency</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center mr-3">
                        <span className="text-xs text-white font-bold">G</span>
                      </div>
                      <span>Gold - Achieving excellence</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center mr-3">
                        <span className="text-xs text-white font-bold">P</span>
                      </div>
                      <span>Platinum - Advanced milestones</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                        <span className="text-xs text-white font-bold">D</span>
                      </div>
                      <span>Diamond - Elite achievements</span>
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center mb-2">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-sm font-medium">Fuerza Inicial</h4>
                  </div>
                  <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center mb-2">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-sm font-medium">Maratonista</h4>
                  </div>
                  <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center mb-2">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-sm font-medium">Nutrición</h4>
                  </div>
                  <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center mb-2">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-sm font-medium">Consistencia</h4>
                  </div>
                  <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-2">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-sm font-medium">Hitos</h4>
                  </div>
                  <div className="bg-card rounded-lg p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mb-2">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-sm font-medium">Elite</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-500 text-black">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Fitness Journey?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join our community today and discover how AI-powered coaching can help you reach your fitness goals faster.
            </p>
            <Button
              onClick={() => setLocation('/signup')}
              size="lg"
              className="bg-black text-white hover:bg-gray-800"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Activity className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-xl font-bold">
                <span className="text-white">FITNESS</span>
                <span className="text-green-500">AI</span>
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-6 mb-6 md:mb-0">
              <Button 
                variant="link" 
                onClick={() => setLocation('/')}
                className="text-gray-300 hover:text-white"
              >
                Home
              </Button>
              <Button 
                variant="link" 
                onClick={() => setLocation('/features')}
                className="text-gray-300 hover:text-white"
              >
                Features
              </Button>
              <Button 
                variant="link" 
                onClick={() => setLocation('/programs')}
                className="text-gray-300 hover:text-white"
              >
                Programs
              </Button>
              <Button 
                variant="link" 
                onClick={() => setLocation('/contact')}
                className="text-gray-300 hover:text-white"
              >
                Contact Us
              </Button>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Fitness AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
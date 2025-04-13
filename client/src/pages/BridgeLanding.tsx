import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  Dumbbell, 
  Users, 
  ArrowRight, 
  Check, 
  X, 
  Clock, 
  Calendar, 
  Award, 
  Heart, 
  Activity, 
  BarChart2,
  Play,
} from 'lucide-react';

export default function BridgeLanding() {
  return (
    <div className="bg-white w-full overflow-hidden">
      {/* Header/Navigation */}
      <header className="w-full bg-dark py-4 fixed top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-[var(--fitness-primary)]">Fitness</span>AI
            </h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-[var(--fitness-primary)] transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-white hover:text-[var(--fitness-primary)] transition-colors">
              About
            </Link>
            <Link to="/services" className="text-white hover:text-[var(--fitness-primary)] transition-colors">
              Services
            </Link>
            <Link to="/pricing" className="text-white hover:text-[var(--fitness-primary)] transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="text-white hover:text-[var(--fitness-primary)] transition-colors">
              Contact
            </Link>
          </nav>
          <div>
            <Button className="bg-[var(--fitness-primary)] text-white hover:bg-[var(--fitness-dark)]">
              Join Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bridge-hero pt-32 pb-24 relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
        <div className="absolute inset-0 bg-cover bg-center z-[-1]" style={{
          backgroundImage: "url('https://bridge504.qodeinteractive.com/wp-content/uploads/2024/01/h1-slider-img-1.jpg')"
        }}></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1 rounded-full bg-[var(--fitness-primary)] text-white text-sm font-medium mb-6">
              #1 AI Fitness Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Transform Your Body <br />
              <span className="text-[var(--fitness-primary)]">Transform Your Life</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
              Your AI-Powered Fitness Coach for tailored workouts, nutrition plans, and real-time progress tracking
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-[var(--fitness-primary)] hover:bg-[var(--fitness-dark)] text-white py-6 px-8 text-lg rounded-lg">
                Start Your Journey
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 py-6 px-8 text-lg rounded-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h5 className="text-[var(--fitness-primary)] font-bold mb-3 uppercase tracking-wider">What We Offer</h5>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Fitness Reimagined</h2>
            <div className="w-24 h-1 bg-[var(--fitness-primary)] mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining cutting-edge AI technology with fitness expertise to deliver personalized experiences for every body type and goal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="feature-card text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--fitness-primary)]">
              <div className="w-16 h-16 bg-[var(--fitness-primary)] rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <Dumbbell className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">AI-Powered Training</h3>
              <p className="text-gray-600">
                Our intelligent system analyzes your body metrics, fitness level, and goals to create truly personalized workout programs.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="feature-card text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--fitness-primary)]">
              <div className="w-16 h-16 bg-[var(--fitness-primary)] rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Monitor your progress, heart rate, and workout effectiveness with our advanced tracking technologies.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="feature-card text-center p-8 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--fitness-primary)]">
              <div className="w-16 h-16 bg-[var(--fitness-primary)] rounded-full flex items-center justify-center text-white mx-auto mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Nutritional Guidance</h3>
              <p className="text-gray-600">
                Receive tailored meal plans and nutrition advice to complement your fitness regimen and maximize results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Classes/Programs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h5 className="text-[var(--fitness-primary)] font-bold mb-3 uppercase tracking-wider">Our Programs</h5>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Elite Training Programs</h2>
            <div className="w-24 h-1 bg-[var(--fitness-primary)] mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our diverse selection of AI-optimized fitness programs designed to challenge and transform your body
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Program 1 */}
            <div className="program-card relative group overflow-hidden rounded-lg">
              <div className="aspect-square bg-cover bg-center" style={{
                backgroundImage: "url('https://bridge504.qodeinteractive.com/wp-content/uploads/2024/01/h1-img-1.jpg')"
              }}></div>
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--fitness-primary)] transition-colors">Strength Training</h3>
                <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Build muscle, increase strength, and boost your metabolism with our adaptive strength programs.
                </p>
                <div className="mt-4 flex items-center">
                  <span className="flex items-center mr-4">
                    <Clock className="w-4 h-4 mr-1" /> 60 min
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> All levels
                  </span>
                </div>
              </div>
            </div>
            
            {/* Program 2 */}
            <div className="program-card relative group overflow-hidden rounded-lg">
              <div className="aspect-square bg-cover bg-center" style={{
                backgroundImage: "url('https://bridge504.qodeinteractive.com/wp-content/uploads/2024/01/h1-img-2.jpg')"
              }}></div>
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--fitness-primary)] transition-colors">Cardio Conditioning</h3>
                <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Improve endurance, burn calories, and enhance your cardiovascular health with personalized cardio workouts.
                </p>
                <div className="mt-4 flex items-center">
                  <span className="flex items-center mr-4">
                    <Clock className="w-4 h-4 mr-1" /> 45 min
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> All levels
                  </span>
                </div>
              </div>
            </div>
            
            {/* Program 3 */}
            <div className="program-card relative group overflow-hidden rounded-lg">
              <div className="aspect-square bg-cover bg-center" style={{
                backgroundImage: "url('https://bridge504.qodeinteractive.com/wp-content/uploads/2024/01/h1-img-3.jpg')"
              }}></div>
              <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[var(--fitness-primary)] transition-colors">Flexibility & Mobility</h3>
                <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Enhance range of motion, prevent injuries, and recover faster with targeted mobility exercises.
                </p>
                <div className="mt-4 flex items-center">
                  <span className="flex items-center mr-4">
                    <Clock className="w-4 h-4 mr-1" /> 30 min
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" /> All levels
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-[var(--fitness-primary)] hover:bg-[var(--fitness-dark)] text-white px-8 py-3 rounded-lg">
              View All Programs
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h5 className="text-[var(--fitness-primary)] font-bold mb-3 uppercase tracking-wider">Why Choose Us</h5>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">The Ultimate Fitness Experience</h2>
              <div className="w-24 h-1 bg-[var(--fitness-primary)] mb-8"></div>
              <p className="text-xl text-gray-300 mb-8">
                FitnessAI combines cutting-edge technology with proven fitness methodologies to deliver results like never before.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[var(--fitness-primary)] rounded-full flex items-center justify-center shrink-0 mr-4">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Advanced AI Technology</h3>
                    <p className="text-gray-300">Our proprietary algorithms analyze thousands of data points to create truly personalized fitness experiences.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[var(--fitness-primary)] rounded-full flex items-center justify-center shrink-0 mr-4">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Expert-Designed Programs</h3>
                    <p className="text-gray-300">Every workout is crafted by fitness professionals and optimized by our AI for maximum effectiveness.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[var(--fitness-primary)] rounded-full flex items-center justify-center shrink-0 mr-4">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Continuous Adaptation</h3>
                    <p className="text-gray-300">Our system evolves with you, adjusting your program based on performance, feedback, and progress.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden">
                <img 
                  src="https://bridge504.qodeinteractive.com/wp-content/uploads/2024/01/h1-img-4.jpg" 
                  alt="Fitness training" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[var(--fitness-primary)] p-6 rounded-lg text-center">
                <span className="block text-4xl font-bold">10+</span>
                <span className="text-sm uppercase tracking-wider">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h5 className="text-[var(--fitness-primary)] font-bold mb-3 uppercase tracking-wider">Client Success</h5>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Transformation Stories</h2>
            <div className="w-24 h-1 bg-[var(--fitness-primary)] mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real people, real results. See how FitnessAI has helped transform lives and achieve fitness goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="testimonial-card bg-gray-50 p-8 rounded-lg relative">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white">
                  <img 
                    src="https://bridge504.qodeinteractive.com/wp-content/uploads/2024/01/h1-img-7.jpg" 
                    alt="Client" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-yellow-400 flex mb-4 mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "The AI-powered workouts are incredible! My strength has improved dramatically, and the personalized approach keeps me motivated every day."
              </p>
              <div>
                <h4 className="text-lg font-bold">Sarah Johnson</h4>
                <p className="text-[var(--fitness-primary)]">Lost 35 lbs in 6 months</p>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="testimonial-card bg-gray-50 p-8 rounded-lg relative">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white">
                  <img 
                    src="https://bridge504.qodeinteractive.com/wp-content/uploads/2024/01/h1-img-8.jpg" 
                    alt="Client" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-yellow-400 flex mb-4 mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "As a busy professional, I never had time to plan workouts. FitnessAI does it all for me, and I've never been in better shape."
              </p>
              <div>
                <h4 className="text-lg font-bold">Michael Chen</h4>
                <p className="text-[var(--fitness-primary)]">Gained 15 lbs of muscle</p>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="testimonial-card bg-gray-50 p-8 rounded-lg relative">
              <div className="absolute -top-6 left-8">
                <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white">
                  <img 
                    src="https://bridge504.qodeinteractive.com/wp-content/uploads/2024/01/h1-img-6.jpg" 
                    alt="Client" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-yellow-400 flex mb-4 mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "The nutritional guidance changed my relationship with food. I'm eating better, feeling more energetic, and seeing amazing results."
              </p>
              <div>
                <h4 className="text-lg font-bold">Emily Rodriguez</h4>
                <p className="text-[var(--fitness-primary)]">Completed marathon training</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-[var(--fitness-primary)] to-[var(--fitness-dark)] text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Start Your Fitness Journey Today</h2>
            <p className="text-xl mb-8">
              Join thousands of members who are transforming their bodies and lives with FitnessAI's personalized approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[var(--fitness-primary)] hover:bg-gray-100 py-6 px-8 text-lg rounded-lg">
                Join Now & Save 20%
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--fitness-primary)] py-6 px-8 text-lg rounded-lg">
                Book a Free Consultation
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white opacity-10"></div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-2xl font-bold mb-6">
                <span className="text-[var(--fitness-primary)]">Fitness</span>AI
              </h4>
              <p className="text-gray-400 mb-6">
                Revolutionizing fitness with AI-powered personalized training and nutrition programs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--fitness-primary)] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--fitness-primary)] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--fitness-primary)] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-6">Quick Links</h5>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Programs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-6">Programs</h5>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Strength Training</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Cardio & HIIT</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Yoga & Flexibility</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Nutrition Plans</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Weight Loss</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] transition-colors">Muscle Building</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-6">Contact Us</h5>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-3 text-[var(--fitness-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span className="text-gray-400">123 Fitness Street, New York, NY 10001</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-3 text-[var(--fitness-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <span className="text-gray-400">(555) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-3 text-[var(--fitness-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <span className="text-gray-400">info@fitnessai.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mt-0.5 mr-3 text-[var(--fitness-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-gray-400">Mon-Fri: 6am-10pm<br />Sat-Sun: 8am-8pm</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2025 FitnessAI. All rights reserved.</p>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-6">
                  <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] text-sm">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] text-sm">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-[var(--fitness-primary)] text-sm">Cookies Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS */}
      <style jsx>{`
        .bridge-hero {
          min-height: 90vh;
          display: flex;
          align-items: center;
        }
        
        @media (max-width: 768px) {
          .bridge-hero {
            min-height: 80vh;
          }
        }
      `}</style>
    </div>
  );
}
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
import {
  heroBackground,
  hero,
  logoWhite,
  trainer1,
  trainer2,
  trainer3,
  training1,
  training2,
  training3,
  training4,
  training5,
  training6
} from '../assets/images';
import QRCodeDemoSection from '../components/QRCodeDemoSection';
import DashboardPreview from '../components/DashboardPreview';
import FeaturesShowcase from '../components/FeaturesShowcase';

export default function BridgeLanding() {
  return (
    <div className="bridge-theme w-full overflow-hidden bg-black text-white">
      {/* Header/Navigation */}
      <header className="w-full bg-black py-4 fixed top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-3xl font-bold text-white tracking-tighter">
                <span className="text-white">FITNESS</span>
                <span className="text-green-500">AI</span>
              </h1>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-green-500 transition-colors uppercase font-medium">
              Home
            </Link>
            <Link to="/features" className="text-white hover:text-green-500 transition-colors uppercase font-medium">
              Features
            </Link>
            <Link to="/programs" className="text-white hover:text-green-500 transition-colors uppercase font-medium">
              Programs
            </Link>
            <Link to="/contact" className="text-white hover:text-green-500 transition-colors uppercase font-medium">
              Contact Us
            </Link>
            <div className="flex space-x-4 ml-8">
              <Link to="/login">
                <Button variant="outline" className="border-green-500 text-white hover:bg-green-500 hover:text-black">
                  LOGIN
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-green-500 text-black hover:bg-green-600">
                  SIGN UP
                </Button>
              </Link>
            </div>
          </nav>
          <button className="md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bridge-hero min-h-screen flex items-center pt-20 relative bg-black overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black opacity-60"></div>
        <div className="absolute inset-0 z-[-1] bg-black hero-parallax">
          {/* Background image with parallax effect */}
          <div className="w-full h-full transform scale-110 transition-transform duration-10000 animate-subtle-zoom" style={{ 
            backgroundImage: `url(${hero})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="relative">
              <h1 className="bridge-heading text-6xl md:text-[140px] font-bold leading-none tracking-tighter animate-fade-in-up">
                <span className="block">SMART</span>
                <span className="block">FITNESS</span>
                <span className="block text-green-500">COACHING</span>
              </h1>
              <div className="absolute -right-20 top-0 text-green-500 opacity-20 text-9xl font-black">AI</div>
            </div>
            <p className="text-xl mt-8 max-w-xl animate-fade-in-up animation-delay-300">
              Our AI-powered fitness platform revolutionizes how you train, track, and transform your body with personalized coaching and real-time feedback
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up animation-delay-500">
              <Link to="/login">
                <Button className="bridge-button bg-green-500 text-black hover:bg-green-600 py-3 px-8 text-lg rounded-sm transition-all duration-300 transform hover:translate-y-[-3px]">
                  Get Started
                </Button>
              </Link>
              <Link to="/programs">
                <Button variant="outline" className="bridge-button border-green-500 text-white hover:bg-green-500 hover:text-black py-3 px-8 text-lg rounded-sm transition-all duration-300 transform hover:translate-y-[-3px]">
                  Explore Programs
                </Button>
              </Link>
            </div>
            <div className="mt-10 bridge-social flex space-x-4">
              <a href="#" className="bridge-social-icon text-white hover:text-black hover:bg-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="bridge-social-icon text-white hover:text-black hover:bg-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="bridge-social-icon text-white hover:text-black hover:bg-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 right-10 z-20 text-white text-center">
          <div className="border border-white px-6 py-4">
            <div className="text-sm">NOT YOUR</div>
            <div className="text-sm">TYPICAL</div>
            <div className="text-sm">FITNESS</div>
          </div>
        </div>
      </section>

      {/* Featured Trainers Section */}
      <section className="bg-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Trainer 1 */}
          <div className="relative group h-96">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${trainer1})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
            <div className="absolute left-0 bottom-0 transform origin-bottom-left rotate-90 z-10">
              <div className="whitespace-nowrap text-white text-2xl uppercase tracking-wider font-bold py-4 px-6">
                CROSSFIT COACH
              </div>
            </div>
            <div className="absolute bottom-0 right-0 flex flex-col space-y-4 p-4 z-10">
              <a href="#" className="bg-black p-2 transform transition-transform hover:scale-110">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="bg-black p-2 transform transition-transform hover:scale-110">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="bg-black p-2 transform transition-transform hover:scale-110">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Trainer 2 */}
          <div className="relative group h-96">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${trainer2})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
            <div className="absolute left-0 bottom-0 transform origin-bottom-left rotate-90 z-10">
              <div className="whitespace-nowrap text-white text-2xl uppercase tracking-wider font-bold py-4 px-6">
                CARDIO & CONDITIONING
              </div>
            </div>
            <div className="absolute bottom-0 right-0 flex flex-col space-y-4 p-4 z-10">
              <a href="#" className="bg-black p-2 transform transition-transform hover:scale-110">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="bg-black p-2 transform transition-transform hover:scale-110">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="bg-black p-2 transform transition-transform hover:scale-110">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Trainer 3 */}
          <div className="relative group h-96">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${trainer3})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
            <div className="absolute left-0 bottom-0 transform origin-bottom-left rotate-90 z-10">
              <div className="whitespace-nowrap text-white text-2xl uppercase tracking-wider font-bold py-4 px-6">
                MADISON FRONING
              </div>
            </div>
            <div className="absolute bottom-0 right-0 flex flex-col space-y-4 p-4 z-10">
              <a href="#" className="bg-black p-2 transform transition-transform hover:scale-110">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="bg-black p-2 transform transition-transform hover:scale-110">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a href="#" className="bg-black p-2 transform transition-transform hover:scale-110">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Training Power Section */}
      <section className="bg-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="relative h-72 md:h-96 overflow-hidden">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${training1})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-70"></div>
            <div className="absolute top-0 left-0 p-6 z-10">
              <div className="text-white">
                <h3 className="text-xl font-bold uppercase leading-tight">TRAINING</h3>
                <h2 className="text-4xl font-bold uppercase leading-tight">POWER</h2>
              </div>
            </div>
          </div>
          <div className="relative h-72 md:h-96 overflow-hidden">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${training2})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-70"></div>
          </div>
          <div className="relative h-72 md:h-96 overflow-hidden">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${training3})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-70"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="relative h-72 md:h-96 overflow-hidden">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${training4})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-70"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold uppercase">Strength</h3>
            </div>
          </div>
          <div className="relative h-72 md:h-96 overflow-hidden">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${training5})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-70"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold uppercase">Mobility</h3>
            </div>
          </div>
          <div className="relative h-72 md:h-96 overflow-hidden">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `url(${training6})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-70"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold uppercase">Recovery</h3>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <p className="bridge-label text-white text-sm font-bold mb-3 uppercase tracking-wider">AI-POWERED FITNESS</p>
            <h2 className="bridge-subheading text-5xl md:text-8xl font-bold text-white uppercase tracking-tight mb-6">
              FUTURE OF FITNESS
            </h2>
            <div className="w-24 h-[3px] bg-white mx-auto mb-10"></div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16">
              Our cutting-edge AI technology delivers personalized workouts, nutrition plans, and real-time feedback tailored specifically to your body, goals, and progress
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bridge-card text-center p-8 hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black mx-auto mb-6">
                <Dumbbell className="h-8 w-8" />
              </div>
              <h3 className="bridge-label text-xl font-bold mb-4 text-white uppercase">Smart Workout Analysis</h3>
              <p className="text-gray-400">
                Our AI analyzes your form, counts reps, and provides real-time feedback to optimize your training and prevent injuries.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bridge-card text-center p-8 hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black mx-auto mb-6">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="bridge-label text-xl font-bold mb-4 text-white uppercase">Adaptive Training</h3>
              <p className="text-gray-400">
                As you progress, our system automatically adjusts your workout intensity and exercises to keep you challenged and growing.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bridge-card text-center p-8 hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black mx-auto mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="bridge-label text-xl font-bold mb-4 text-white uppercase">Health Integration</h3>
              <p className="text-gray-400">
                Connect with Apple Health, Google Fit, Fitbit, and other platforms to get a comprehensive view of your health and fitness data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join the Revolution section has been removed as requested */}

      {/* Dashboard Preview Section */}
      <DashboardPreview />

      {/* Features Showcase */}
      <FeaturesShowcase />

      {/* QR Code Demo Section */}
      <QRCodeDemoSection />

      {/* Membership Plans Section - Moved before the CTA section */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">Choose Your <span className="text-green-500">Fitness Journey</span></h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-up animation-delay-300">
              Unlock your potential with our personalized AI-powered fitness plans. Select the membership that fits your goals and lifestyle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-bold mb-4">
                  <span className="text-green-500">$0</span>
                  <span className="text-sm text-gray-400">/month</span>
                </div>
                <p className="text-gray-300 mb-6">
                  Begin your fitness journey with basic tracking and AI guidance
                </p>
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Basic workout tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    AI workout suggestions
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Access to community forums
                  </li>
                  <li className="flex items-center text-gray-500">
                    <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    No nutrition tracking
                  </li>
                  <li className="flex items-center text-gray-500">
                    <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    No AI voice coaching
                  </li>
                </ul>
                <Link to="/signup">
                  <Button className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative border-2 border-green-500">
              <div className="absolute top-0 right-0 bg-green-500 text-black font-bold py-1 px-4 text-sm">
                MOST POPULAR
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">
                  <span className="text-green-500">$19.99</span>
                  <span className="text-sm text-gray-400">/month</span>
                </div>
                <p className="text-gray-300 mb-6">
                  Elevate your fitness with smart features and personalized guidance
                </p>
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Full access to smart workouts
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Nutrition tracking & meal planning
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Advanced fitness metrics
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Recovery recommendations
                  </li>
                  <li className="flex items-center text-gray-500">
                    <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    No wearable patch sync
                  </li>
                </ul>
                <Link to="/checkout">
                  <Button className="w-full py-3 bg-green-500 hover:bg-green-600 text-black">
                    Choose Pro
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Elite Plan */}
            <div className="bg-gray-800 rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-700">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Elite</h3>
                <div className="text-4xl font-bold mb-4">
                  <span className="text-green-500">$49.99</span>
                  <span className="text-sm text-gray-400">/month</span>
                </div>
                <p className="text-gray-300 mb-6">
                  Ultimate fitness experience with bleeding-edge technology and AI coaching
                </p>
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Everything in Pro plan
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Wearable patch sync
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Biometric feedback analysis
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    AI voice coaching
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Priority support
                  </li>
                </ul>
                <Link to="/checkout?plan=elite">
                  <Button className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white">
                    Choose Elite
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Block After Memberships */}
      <section className="py-20 bg-green-500 text-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your fitness journey?</h2>
              <p className="text-lg md:text-xl mb-0">
                Join thousands who have already elevated their training with our AI-powered platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button className="py-6 px-8 bg-black text-white hover:bg-gray-800 text-lg font-medium min-w-[200px]">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="py-6 px-8 border-black text-black hover:bg-black hover:text-white text-lg font-medium min-w-[200px]">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-2xl font-bold mb-6 uppercase">
                Fitness AI
              </h4>
              <p className="text-gray-400 mb-6">
                Revolutionizing fitness with AI-powered personalized training and nutrition programs.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-6 uppercase">Programs</h5>
              <ul className="space-y-3">
                <li><Link to="/programs" className="text-gray-400 hover:text-white transition-colors">All Programs</Link></li>
                <li><Link to="/programs?category=strength" className="text-gray-400 hover:text-white transition-colors">Strength Training</Link></li>
                <li><Link to="/programs?category=cardio" className="text-gray-400 hover:text-white transition-colors">Cardio</Link></li>
                <li><Link to="/programs?category=hiit" className="text-gray-400 hover:text-white transition-colors">HIIT Workouts</Link></li>
                <li><Link to="/programs?category=mobility" className="text-gray-400 hover:text-white transition-colors">Mobility</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-6 uppercase">Quick Links</h5>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-6 uppercase">Contact</h5>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-gray-400">Get in touch with our support team</span>
                </li>
                <li className="flex items-start">
                  <Link to="/contact" className="text-green-500 hover:text-white transition-colors">Contact Us</Link>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400">24/7 AI-Powered Support</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2025 Fitness AI. All rights reserved.</p>
              <div className="mt-4 md:mt-0">
                <ul className="flex space-x-6">
                  <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .bridge-theme {
          font-family: 'Poppins', sans-serif;
        }
        
        .bridge-hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }
        
        @media (max-width: 768px) {
          .bridge-hero {
            min-height: 80vh;
          }
        }
      `}} />
    </div>
  );
}
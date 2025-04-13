import React from 'react';
import { Link } from 'wouter';
import AccessCodeScreen from '../components/AccessCodeScreen';

const AccessCodePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="flex items-center space-x-2">
                  <span className="text-2xl">🏋️</span>
                  <span className="font-bold text-xl">Fitness AI</span>
                </a>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <Link href="/">
                <a className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Home
                </a>
              </Link>
              <Link href="/access">
                <a className="px-3 py-2 text-sm font-medium rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100">
                  Access Code
                </a>
              </Link>
              <Link href="/membership">
                <a className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Membership
                </a>
              </Link>
              <Link href="/about">
                <a className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  About
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main>
        <AccessCodeScreen />
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-8 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 Fitness AI. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-6">
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AccessCodePage;
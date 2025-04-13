import React from 'react';
import { useLocation } from 'wouter';
import AdminPanel from '../components/AdminPanel';

/**
 * Admin panel page component
 * Hosts the admin panel for managing users and access codes
 */
const AdminPanelPage: React.FC = () => {
  const [, setLocation] = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <div 
                onClick={() => setLocation('/')}
                className="cursor-pointer flex items-center space-x-2"
              >
                <span className="text-2xl">🏋️</span>
                <span className="font-bold text-xl">Fitness AI</span>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <div
                onClick={() => setLocation('/access')}
                className="cursor-pointer px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Access Code
              </div>
              <div
                onClick={() => setLocation('/dashboard')}
                className="cursor-pointer px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Dashboard
              </div>
              <div
                className="cursor-pointer px-3 py-2 text-sm font-medium rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
              >
                Admin
              </div>
            </nav>
            
            <div className="md:hidden">
              {/* Mobile menu button */}
              <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="py-6">
          <AdminPanel />
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-sm py-6">
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

export default AdminPanelPage;
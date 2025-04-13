import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import AdminPanel from '../components/AdminPanel';

// Simple admin authentication check - would be replaced with real auth in production
const isAdmin = (): boolean => {
  // In a real app, this would check a token, cookie, or server-side auth
  return true; // For demo purposes always return true
};

const AdminPanelPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [, setLocation] = useLocation();
  
  // Check admin status on component mount
  useEffect(() => {
    const adminStatus = isAdmin();
    
    if (adminStatus) {
      setAuthenticated(true);
    } else {
      // Redirect non-admins to the home page
      setLocation('/');
    }
  }, [setLocation]);
  
  // If not authenticated, show loading state
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
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
              <Link href="/dashboard">
                <a className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Dashboard
                </a>
              </Link>
              <Link href="/admin">
                <a className="px-3 py-2 text-sm font-medium rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100">
                  Admin Panel
                </a>
              </Link>
              <Link href="/stats">
                <a className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Analytics
                </a>
              </Link>
              <Link href="/settings">
                <a className="px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Settings
                </a>
              </Link>
            </nav>
            
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                A
              </div>
              <span className="ml-2 text-sm font-medium hidden md:block">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>
      
      <main>
        <AdminPanel />
      </main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-sm mt-8 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 Fitness AI. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-6">
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Admin Documentation</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">API Reference</a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanelPage;
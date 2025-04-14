import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutGrid, 
  BarChart3, 
  CreditCard,
  Users,
  Settings, 
  Database, 
  FileCode
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="mb-4">You need to be logged in to access the admin area.</p>
          <Link href="/login">
            <a className="bg-primary text-white py-2 px-4 rounded hover:bg-primary/90">
              Log In
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 p-4 flex flex-col">
        <div className="text-xl font-bold mb-8 mt-4 flex items-center">
          <LayoutGrid className="mr-2 h-6 w-6 text-primary" />
          <span>Fitness AI Admin</span>
        </div>
        
        <nav className="flex-1">
          <div className="mb-4">
            <p className="text-gray-500 uppercase text-xs font-semibold mb-2 dark:text-gray-400">
              System
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/admin/dashboard">
                  <a className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <BarChart3 className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Dashboard
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/admin/api-status">
                  <a className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <FileCode className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    API Status
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/admin/billing">
                  <a className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <CreditCard className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Billing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/admin/database">
                  <a className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <Database className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Database
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-500 uppercase text-xs font-semibold mb-2 dark:text-gray-400">
              Management
            </p>
            <ul className="space-y-2">
              <li>
                <Link href="/admin/users">
                  <a className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <Users className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Users
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/admin/settings">
                  <a className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <Settings className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Settings
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        
        <div className="mt-auto pb-4">
          <Link href="/">
            <a className="flex items-center p-2 text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              ← Return to Main Site
            </a>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 border-b dark:border-gray-700">
          <h1 className="text-2xl font-bold">{title}</h1>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
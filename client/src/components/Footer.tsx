import React from 'react';
import { Heart } from 'lucide-react';
import AdminPanel from './admin/AdminPanel';

export default function Footer() {
  return (
    <footer className="border-t py-3 px-4 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center mb-2 md:mb-0">
          <span>© {new Date().getFullYear()} Fitness AI</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Contact Us
          </a>
          <div className="flex items-center">
            <span className="mr-1">Made with</span>
            <Heart className="h-3 w-3 text-red-500 mx-0.5" />
            <span>by Fitness AI Team</span>
          </div>
        </div>
        
        {/* Admin Panel is included but will be positioned fixed in bottom left */}
        <AdminPanel />
      </div>
    </footer>
  );
}
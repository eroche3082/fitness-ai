import React, { useState, useEffect } from 'react';
import { X, Activity, Dumbbell, Utensils, LineChart, Heart, Award, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidePanel({ isOpen, onClose }: SidePanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Lock body scroll when panel is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const menuItems = [
    { icon: Activity, label: 'Dashboard', path: '/dashboard' },
    { icon: Dumbbell, label: 'Workouts', path: '/workouts' },
    { icon: Utensils, label: 'Nutrition', path: '/nutrition' },
    { icon: LineChart, label: 'Progress', path: '/progress' },
    { icon: Heart, label: 'Health Metrics', path: '/health' },
    { icon: Award, label: 'Achievements', path: '/achievements' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <>
      <div className={`side-panel-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <div className="flex justify-between items-center p-5 border-b border-green-100 bg-gradient-bg">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-primary-dark">Fitness AI</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full hover:bg-green-100 text-primary"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-base font-medium py-2 text-dark-text hover:text-primary hover:bg-green-50"
                  onClick={() => {
                    console.log(`Navigating to ${item.path}`);
                    onClose();
                  }}
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto p-4 border-t border-green-100">
          <div className="bg-gradient-bg p-4 rounded-lg border border-green-200">
            <h3 className="font-medium text-primary-dark mb-2">Connect Your Fitness Trackers</h3>
            <p className="text-sm text-dark-text mb-3">
              Sync with Google Fit, Apple Health, Fitbit or Strava to enhance your fitness journey with real-time data.
            </p>
            <Button 
              className="w-full primary-button"
              size="sm"
            >
              Connect Devices
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
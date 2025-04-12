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
      <div className={`panel-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">Fitness AI</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-3">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-base font-medium py-3 hover-orange"
                  onClick={() => {
                    console.log(`Navigating to ${item.path}`);
                    onClose();
                  }}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-700 mb-2">Pro Tip</h3>
            <p className="text-sm text-gray-700">
              Connect with Google Fit or Apple Health to automatically sync your fitness data.
            </p>
            <Button 
              className="w-full mt-3 energy-button"
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
import React from 'react';
import { Button } from '@/components/ui/button';

const DashboardPreview: React.FC = () => {
  return (
    <div className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Powerful AI-Powered Dashboard</h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Experience a comprehensive fitness platform that adapts to your goals, tracks your progress,
            and provides real-time coaching through advanced AI technology.
          </p>
        </div>

        {/* Dashboard Image */}
        <div className="max-w-5xl mx-auto shadow-2xl rounded-lg overflow-hidden mb-16">
          <img 
            src="https://fitness-dashboard.vercel.app/dashboard.png" 
            alt="Fitness AI Dashboard" 
            className="w-full h-auto" 
          />
        </div>

        {/* Features Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="bg-black p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-green-500">Personalized Analytics</h3>
            <p className="text-gray-400 mb-4">
              Track your fitness journey with detailed metrics and visual reports that adapt to your progress.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Progress tracking</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Performance insights</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Goal progress</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-black p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-green-500">Voice Coaching</h3>
            <p className="text-gray-400 mb-4">
              Get real-time audio guidance, form correction, and rep counting with our AI voice coach.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Audio guidance</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Rep counting</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Form correction</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-black p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-4 text-green-500">Health Integrations</h3>
            <p className="text-gray-400 mb-4">
              Connect with your favorite fitness devices and apps to import activity data automatically.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Google Fit</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Apple Health</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Fitbit</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>Strava</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
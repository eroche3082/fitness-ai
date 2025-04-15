import React from 'react';

const DashboardPreview: React.FC = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful AI-Powered Dashboard</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Experience a comprehensive fitness platform that adapts to your goals, tracks your progress,
            and provides real-time coaching through advanced AI technology.
          </p>
        </div>

        {/* Dashboard Image */}
        <div className="max-w-5xl mx-auto mb-16">
          <img 
            src="/images/dashboard.png" 
            alt="Fitness AI Dashboard" 
            className="w-full h-auto rounded-lg shadow-lg" 
          />
        </div>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4">Personalized Analytics</h3>
            <p className="text-gray-600 mb-4">
              Track your fitness journey with detailed metrics and visual reports that adapt to your progress.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Progress tracking</li>
              <li>• Performance insights</li>
              <li>• Goal progress</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4">Voice Coaching</h3>
            <p className="text-gray-600 mb-4">
              Get real-time audio guidance, form correction, and rep counting with our AI voice coach.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Audio guidance</li>
              <li>• Rep counting</li>
              <li>• Form correction</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4">Health Integrations</h3>
            <p className="text-gray-600 mb-4">
              Connect with your favorite fitness devices and apps to import activity data automatically.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Google Fit</li>
              <li>• Apple Health</li>
              <li>• Fitbit</li>
              <li>• Strava</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
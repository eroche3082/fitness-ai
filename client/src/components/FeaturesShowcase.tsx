import React from 'react';

const FeaturesShowcase: React.FC = () => {
  // Core features from the image
  const coreFeatures = [
    {
      title: 'Smart Workout Analysis',
      description: 'AI-powered analysis of your form and technique to maximize results and prevent injuries.'
    },
    {
      title: 'Adaptive Training',
      description: 'Workouts that evolve based on your performance, goals, and feedback for optimal progression.'
    },
    {
      title: 'Health Tracker Integration',
      description: 'Seamless connections with Google Fit, Apple Health, and other fitness wearables.'
    },
    {
      title: 'Voice-Guided Workouts',
      description: 'Real-time audio coaching that guides you through exercises with proper form cues.'
    },
    {
      title: 'Rep Counter',
      description: 'Automatic counting of repetitions using advanced motion detection technology.'
    },
    {
      title: 'Form Visualizer',
      description: 'Visual feedback on your exercise form with real-time corrections and improvements.'
    },
    {
      title: 'Recovery Recommendations',
      description: 'Personalized recovery protocols based on workout intensity and physiological markers.'
    },
    {
      title: 'Community Challenges',
      description: 'Group fitness challenges to boost motivation and accountability among members.'
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Advanced Features</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive suite of AI-powered features designed to transform 
            your fitness journey with personalized guidance and tracking.
          </p>
        </div>

        {/* Use actual image from mockup */}
        <div className="max-w-5xl mx-auto mb-16">
          <img 
            src="https://fitness-dashboard.vercel.app/features.png" 
            alt="Fitness AI Features" 
            className="w-full h-auto"
          />
        </div>

        {/* Feature grid representation below image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {coreFeatures.map((feature, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;
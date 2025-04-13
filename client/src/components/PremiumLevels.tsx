import React, { useState } from 'react';
import { UserProfile } from '../shared/types';

interface PremiumLevelsProps {
  userProfile: UserProfile;
  onLevelUnlock: (levelId: string) => void;
}

const PremiumLevels: React.FC<PremiumLevelsProps> = ({ 
  userProfile, 
  onLevelUnlock 
}) => {
  const [activePromo, setActivePromo] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [showPayment, setShowPayment] = useState<string | null>(null);
  
  // Premium level definitions
  const premiumLevels = [
    {
      id: 'level-1',
      name: 'Basic Training',
      description: 'Access to foundational workouts and nutrition plans for beginners.',
      price: 0,
      features: [
        'Beginner workout plans',
        'Basic nutrition guidance',
        'Fitness tracking',
        'Community forum access'
      ],
      included: true
    },
    {
      id: 'level-2',
      name: 'Intermediate Program',
      description: 'Enhanced workouts and personalized plans for consistent progress.',
      price: 9.99,
      features: [
        'Intermediate workout plans',
        'Customized nutrition plans',
        'Progress analytics',
        'Chat support'
      ],
      included: userProfile.category === 'INT' || 
                userProfile.category === 'ADV' || 
                userProfile.category === 'PRO' || 
                userProfile.category === 'VIP'
    },
    {
      id: 'level-3',
      name: 'Advanced Training',
      description: 'Specialized training techniques and detailed analytics for serious athletes.',
      price: 19.99,
      features: [
        'Advanced workout programs',
        'Performance analytics',
        'Video form analysis',
        'Email coaching support'
      ],
      included: userProfile.category === 'ADV' || 
                userProfile.category === 'PRO' || 
                userProfile.category === 'VIP'
    },
    {
      id: 'level-4',
      name: 'Professional Coaching',
      description: 'Elite coaching and custom programs for professional performance.',
      price: 29.99,
      features: [
        'Professional workout systems',
        'AI-powered performance analysis',
        'Nutrition and recovery planning',
        'Priority coaching sessions'
      ],
      included: userProfile.category === 'PRO' || 
                userProfile.category === 'VIP'
    },
    {
      id: 'level-5',
      name: 'Elite VIP Experience',
      description: 'All-inclusive fitness ecosystem with exclusive features and priority service.',
      price: 49.99,
      features: [
        'Custom AI workout creation',
        'Live coaching sessions',
        'Exclusive content and features',
        'Premium 24/7 support'
      ],
      included: userProfile.category === 'VIP'
    }
  ];
  
  const isLevelUnlocked = (levelId: string) => {
    return userProfile.unlockedLevels.includes(levelId);
  };
  
  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    // Mock promo code validation
    const validPromoCodes: {[key: string]: string} = {
      'FITNESSBOOST': 'level-2',
      'ELITETRAINING': 'level-3',
      'PROCOACH': 'level-4',
      'VIPEXPERIENCE': 'level-5'
    };
    
    if (validPromoCodes[promoCode]) {
      const levelId = validPromoCodes[promoCode];
      onLevelUnlock(levelId);
      setActivePromo(levelId);
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
    }
  };
  
  const handlePaymentClick = (levelId: string) => {
    setShowPayment(levelId);
    // In a real implementation, this would redirect to Stripe checkout
    // or show a payment form
  };
  
  const renderPromoCodeForm = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Use Promo Code</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Enter a promo code to unlock premium levels instantly.
        </p>
        
        <form onSubmit={handlePromoSubmit} className="space-y-4">
          <div>
            <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Promo Code
            </label>
            <input
              type="text"
              id="promoCode"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              placeholder="Enter code (e.g. FITNESSBOOST)"
            />
            {promoError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{promoError}</p>
            )}
            {activePromo && (
              <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                Successfully applied promo code!
              </p>
            )}
          </div>
          
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Apply Code
          </button>
        </form>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Premium Status</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Unlock advanced features and personalized training plans with premium levels.
        </p>
        
        <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex-shrink-0 mr-4">
            {userProfile.paymentStatus === 'paid' ? (
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            ) : (
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{userProfile.category} Level Access</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userProfile.unlockedLevels.length > 0 
                ? `You have unlocked ${userProfile.unlockedLevels.length} premium levels` 
                : 'You are currently using the free version'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Promo code section */}
      {renderPromoCodeForm()}
      
      {/* Premium levels */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Available Premium Levels</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Choose the level that matches your fitness goals and experience.
        </p>
        
        <div className="space-y-6">
          {premiumLevels.map((level) => {
            const isUnlocked = isLevelUnlocked(level.id) || level.included;
            
            return (
              <div 
                key={level.id} 
                className={`border ${isUnlocked ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{level.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{level.description}</p>
                  </div>
                  <div>
                    {level.price === 0 ? (
                      <span className="bg-green-100 dark:bg-green-900 py-1 px-3 rounded-full text-green-800 dark:text-green-300 text-sm font-medium">
                        Free
                      </span>
                    ) : (
                      <span className="font-semibold text-lg">${level.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <ul className="space-y-2">
                    {level.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  {isUnlocked ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Unlocked
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePaymentClick(level.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Unlock Now
                    </button>
                  )}
                </div>
                
                {showPayment === level.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium mb-2">Payment Simulation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      In a real implementation, this would redirect to Stripe checkout.
                    </p>
                    <button
                      onClick={() => {
                        onLevelUnlock(level.id);
                        setShowPayment(null);
                      }}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      Simulate Successful Payment
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PremiumLevels;
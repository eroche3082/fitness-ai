import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { UserCategory } from '../shared/types';
import QRCodeDisplay from './QRCodeDisplay';
import userService from '../lib/userService';

interface ChatAccessCodeProps {
  code: string;
  category: UserCategory;
  userName: string;
  onContinue: () => void;
}

/**
 * Component to display the generated access code within the chat interface
 */
const ChatAccessCode: React.FC<ChatAccessCodeProps> = ({ 
  code, 
  category,
  userName,
  onContinue 
}) => {
  const [, setLocation] = useLocation();
  const [isValidating, setIsValidating] = useState(false);
  
  // Get the category name from the code for display
  const getCategoryName = (category: UserCategory): string => {
    switch (category) {
      case 'BEG':
        return 'Beginner';
      case 'INT':
        return 'Intermediate';
      case 'ADV':
        return 'Advanced';
      case 'PRO':
        return 'Professional';
      case 'VIP':
        return 'VIP';
      default:
        return 'Unknown';
    }
  };
  
  // Handle login with the generated code
  const handleLogin = async () => {
    setIsValidating(true);
    
    try {
      // Create a user profile with this code
      const mockProfile = {
        id: Math.random().toString(36).substring(2, 9),
        name: userName || 'New User',
        email: `user-${Date.now()}@example.com`,
        uniqueCode: code,
        category: category,
        onboardingCompleted: true,
        fitnessGoals: ['Lose weight', 'Build strength'],
        preferredActivities: ['Running', 'Weight training'],
        dateCreated: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      
      // Save user profile to localStorage
      userService.saveUserProfile(mockProfile);
      
      // Create and save a lead
      const lead = userService.createLead({
        name: userName || 'New User',
        email: `user-${Date.now()}@example.com`,
        category: category,
        uniqueCode: code,
        source: 'Chatbot'
      });
      
      userService.saveLead(lead);
      
      // Wait a moment before continuing
      setTimeout(() => {
        setIsValidating(false);
        setLocation('/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Error creating user profile:', err);
      setIsValidating(false);
    }
  };
  
  return (
    <div className="bg-gray-900 text-white rounded-lg p-6 w-full">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">¡Código de Acceso Generado!</h3>
        <p className="text-gray-300 mb-4">
          Guarda este código para iniciar sesión en el futuro
        </p>
        
        <div className="bg-white p-4 rounded-lg inline-block mb-4">
          <QRCodeDisplay code={code} size={150} />
        </div>
        
        <div className="flex flex-col items-center space-y-2 mb-4">
          <div className="font-mono text-xl font-bold bg-blue-900 px-4 py-2 rounded-lg">
            {code}
          </div>
          
          <div className="text-sm text-gray-300">
            Categoría: {getCategoryName(category)}
          </div>
        </div>
        
        <p className="text-sm text-gray-400 mb-4">
          Hemos creado un perfil personalizado basado en tus respuestas.
          Tu código de acceso es tu llave a Fitness AI.
        </p>
        
        <button
          onClick={handleLogin}
          disabled={isValidating}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          {isValidating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando Sesión...
            </span>
          ) : (
            'Continuar al Dashboard'
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatAccessCode;
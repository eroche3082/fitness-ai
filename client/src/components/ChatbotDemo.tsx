import React, { useState, useEffect } from 'react';
import ChatbotInterface from './ChatbotInterface';
import ChatAccessCode from './ChatAccessCode';
import { UserCategory } from '../shared/types';
import { generateUniqueCode } from '../lib/userCodeGenerator';

// Message interface
interface Message {
  text: string;
  sender: 'user' | 'bot';
}

// Questions for the onboarding flow
const questions = [
  "¿Cuál es tu nombre?",
  "¿Cuál es tu correo electrónico?",
  "¿Cuál es tu nivel de condición física? (Principiante/Intermedio/Avanzado)",
  "¿Cuáles son tus objetivos de fitness?",
  "¿Tienes alguna limitación física o lesión?",
  "¿Cuántos días a la semana puedes dedicar al ejercicio?",
  "¿Qué tipos de entrenamientos prefieres?",
  "¿Tienes acceso a equipo de gimnasio?",
  "¿Alguna preferencia dietética?",
  "¿Cuándo prefieres entrenar?"
];

const ChatbotDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: '¡Bienvenido a Fitness AI!', sender: 'bot' },
    { text: `Paso 1 de 10: ${questions[0]}`, sender: 'bot' }
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [userCategory, setUserCategory] = useState<UserCategory>('BEG');
  const [showAccessCode, setShowAccessCode] = useState(false);

  // Open the chatbot automatically after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Determine user category based on fitness level answer
  const determineUserCategory = (level: string): UserCategory => {
    const lowerLevel = level.toLowerCase();
    
    if (lowerLevel.includes('principiante') || lowerLevel.includes('beginner') || lowerLevel.includes('prin')) {
      return 'BEG';
    } else if (lowerLevel.includes('intermedio') || lowerLevel.includes('intermediate') || lowerLevel.includes('inter')) {
      return 'INT';
    } else if (lowerLevel.includes('avanzado') || lowerLevel.includes('advanced') || lowerLevel.includes('avan')) {
      return 'ADV';
    } else if (lowerLevel.includes('profesional') || lowerLevel.includes('professional') || lowerLevel.includes('pro')) {
      return 'PRO';
    } else {
      return 'BEG'; // Default to beginner if unclear
    }
  };

  // Generate access code based on user information
  const generateAccessCodeForUser = () => {
    // Determine category from fitness level (question 3)
    const fitnessLevel = answers[3] || '';
    const category = determineUserCategory(fitnessLevel);
    setUserCategory(category);
    
    // Generate unique code
    const code = generateUniqueCode(category);
    setAccessCode(code);
    
    // Show success message
    setMessages(prev => [...prev, { 
      text: '¡Análisis completo! Tu código de acceso personal está listo.', 
      sender: 'bot' 
    }]);
    
    // Show access code component
    setShowAccessCode(true);
  };

  // Handle sending a message
  const handleSendMessage = (text: string) => {
    if (text.trim() === '') return;
    
    // Add user message
    setMessages(prev => [...prev, { text, sender: 'user' }]);
    
    // Save answer
    setAnswers(prev => ({ ...prev, [currentStep]: text }));
    
    // Show loading state
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      // Move to next step or finish
      if (currentStep < questions.length) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        // Add bot message with next question
        setMessages(prev => [...prev, { 
          text: `Paso ${nextStep} de 10: ${questions[nextStep - 1]}`, 
          sender: 'bot' 
        }]);
      } else {
        // Onboarding complete
        setOnboardingComplete(true);
        setMessages(prev => [...prev, { 
          text: '¡Gracias por completar el cuestionario! Tu perfil de fitness personalizado está siendo creado...', 
          sender: 'bot' 
        }]);
        
        // Generate access code after 1.5 seconds
        setTimeout(() => {
          generateAccessCodeForUser();
        }, 1500);
      }
      
      // Clear loading state
      setIsLoading(false);
    }, 1000);
  };

  // Handle continuing to dashboard after access code is generated
  const handleContinueToDashboard = () => {
    // This function is passed to the ChatAccessCode component
    // It will handle navigation to the dashboard
    setShowAccessCode(false);
    setIsOpen(false);
  };

  // Toggle chatbot open/close
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat trigger button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
      
      {/* Chatbot interface */}
      {isOpen && (
        <>
          {showAccessCode ? (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden w-[400px]">
                {/* Header */}
                <div className="bg-green-500 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-white mr-2">
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <span className="font-semibold text-lg">Fitness AI Assistant</span>
                  </div>
                  <button
                    onClick={toggleChat}
                    className="text-white hover:text-gray-200 transition-colors"
                    aria-label="Close chat"
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex">
                  <button className="flex-1 py-4 px-6 font-medium bg-white text-green-600 border-b-2 border-green-500">
                    Chat
                  </button>
                  <button className="flex-1 py-4 px-6 font-medium bg-gray-900 text-gray-300">
                    Workout
                  </button>
                  <button className="flex-1 py-4 px-6 font-medium bg-gray-900 text-gray-300">
                    QR Code
                  </button>
                  <button className="flex-1 py-4 px-6 font-medium bg-gray-900 text-gray-300">
                    AR/VR
                  </button>
                </div>
                
                {/* Access Code */}
                <ChatAccessCode 
                  code={accessCode}
                  category={userCategory}
                  userName={answers[1]}
                  onContinue={handleContinueToDashboard}
                />
              </div>
            </div>
          ) : (
            <ChatbotInterface
              onSendMessage={handleSendMessage}
              messages={messages}
              isLoading={isLoading}
              currentStep={currentStep}
              totalSteps={questions.length}
              currentQuestion={questions[currentStep - 1]}
              onClose={toggleChat}
            />
          )}
        </>
      )}
    </>
  );
};

export default ChatbotDemo;
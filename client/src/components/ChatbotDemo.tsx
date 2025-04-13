import React, { useState, useEffect } from 'react';
import ChatbotInterface from './ChatbotInterface';

// Message interface
interface Message {
  text: string;
  sender: 'user' | 'bot';
}

// Questions for the onboarding flow
const questions = [
  "What's your name?",
  "What's your email address?",
  "What's your fitness level?",
  "What are your fitness goals?",
  "Do you have any physical limitations or injuries?",
  "How many days per week can you dedicate to exercise?",
  "What types of workouts do you prefer?",
  "Do you have access to gym equipment?",
  "Any dietary preferences?",
  "When do you prefer to work out?"
];

const ChatbotDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Welcome to Fitness AI!', sender: 'bot' },
    { text: `Step 1 of 10: ${questions[0]}`, sender: 'bot' }
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Open the chatbot automatically after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1000);
    return () => clearTimeout(timer);
  }, []);

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
          text: `Step ${nextStep} of 10: ${questions[nextStep - 1]}`, 
          sender: 'bot' 
        }]);
      } else {
        // Onboarding complete
        setMessages(prev => [...prev, { 
          text: 'Thanks for completing the onboarding! Your personalized fitness journey is ready.', 
          sender: 'bot' 
        }]);
      }
      
      // Clear loading state
      setIsLoading(false);
    }, 1000);
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
          className="fixed bottom-4 right-4 w-14 h-14 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300"
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
      
      {/* Chatbot interface */}
      {isOpen && (
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
  );
};

export default ChatbotDemo;
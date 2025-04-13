import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, UserCategory } from '../shared/types';
import userService from '../lib/userService';

interface FullscreenChatbotProps {
  onClose: () => void;
  initialUserProfile?: UserProfile;
}

// Define message type
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const FullscreenChatbot: React.FC<FullscreenChatbotProps> = ({ onClose, initialUserProfile }) => {
  // State for user input
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Fitness AI! I\'m here to help you with your fitness journey. What would you like to do today?',
      timestamp: new Date()
    }
  ]);
  const [activeTab, setActiveTab] = useState('chat');
  const [isSending, setIsSending] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, any>>({});
  const [isOnboarding, setIsOnboarding] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Handle message sending
  const handleSendMessage = () => {
    if (!inputValue.trim() || isSending) return;
    
    // Create new user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    // Add user message
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsSending(true);
    
    // Simulate AI response with delay
    setTimeout(() => {
      let responseContent = '';
      
      if (isOnboarding) {
        // Handle onboarding flow
        if (currentStep <= 10) {
          // Store the answer
          setOnboardingAnswers(prev => ({
            ...prev,
            [`question_${currentStep}`]: inputValue.trim()
          }));
          
          // Move to next question
          setCurrentStep(currentStep + 1);
          responseContent = getOnboardingQuestion(currentStep + 1);
          
          // If reached the end of onboarding
          if (currentStep + 1 > 10) {
            // Generate user profile and code
            completeOnboarding();
            setIsOnboarding(false);
          }
        }
      } else {
        // Normal chat flow
        responseContent = `I'm analyzing your request: "${inputValue.trim()}" 
        
This is a placeholder response. In the production version, this would be connected to Gemini AI to provide a smart, personalized response based on your fitness profile and goals.`;
      }
      
      // Create AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      
      // Add AI response
      setMessages(prev => [...prev, aiResponse]);
      setIsSending(false);
    }, 1000);
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Get onboarding question based on step
  const getOnboardingQuestion = (step: number): string => {
    switch (step) {
      case 1:
        return "Welcome to your fitness journey! What's your name?";
      case 2:
        return "Great! What's your fitness goal? (lose weight, build muscle, improve endurance, etc.)";
      case 3:
        return "How would you describe your current fitness level? (beginner, intermediate, advanced)";
      case 4:
        return "Do you have any physical limitations or medical conditions I should know about?";
      case 5:
        return "How many days per week can you dedicate to exercise?";
      case 6:
        return "What types of workouts do you prefer? (cardio, strength training, HIIT, yoga, etc.)";
      case 7:
        return "What time of day do you prefer to workout?";
      case 8:
        return "What's your diet preference? (balanced, vegetarian, vegan, keto, etc.)";
      case 9:
        return "How many hours of sleep do you typically get?";
      case 10:
        return "How much water do you drink daily? (cups/bottles)";
      default:
        return "Thanks for providing all this information! I'm generating your personalized fitness profile now.";
    }
  };
  
  // Complete onboarding process
  const completeOnboarding = () => {
    // Determine user category based on answers
    const fitnessLevel = onboardingAnswers.question_3 || "beginner";
    let category: UserCategory = "BEG";
    
    if (fitnessLevel.toLowerCase().includes("intermediate")) {
      category = "INT";
    } else if (fitnessLevel.toLowerCase().includes("advanced")) {
      category = "ADV";
    } else if (fitnessLevel.toLowerCase().includes("professional")) {
      category = "PRO";
    }
    
    // Generate access code
    const accessCode = userService.generateAccessCode(category);
    
    // Create user profile
    const userProfile: UserProfile = {
      id: Date.now().toString(),
      name: onboardingAnswers.question_1 || "Fitness User",
      email: "user@example.com", // This would be collected in a real app
      uniqueCode: accessCode,
      category,
      onboardingCompleted: true,
      fitnessGoals: [onboardingAnswers.question_2 || "get fit"],
      preferredActivities: [onboardingAnswers.question_6 || "cardio"],
      dateCreated: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    // Save user profile
    userService.saveUserProfile(userProfile);
    
    // Create lead
    const lead = userService.createLead({
      name: userProfile.name,
      email: userProfile.email,
      category,
      uniqueCode: accessCode,
      source: "Chatbot Onboarding"
    });
    
    // Save lead
    userService.saveLead(lead);
    
    // Add completion message with code
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `✅ Onboarding complete! Your personalized access code is: ${accessCode}
        
You can use this code to log in to your account and access your personalized fitness plan. I've analyzed your preferences and created a profile that will help me provide customized recommendations.

What would you like to do next?`,
        timestamp: new Date()
      }
    ]);
  };
  
  // Start onboarding flow
  const handleStartOnboarding = () => {
    setIsOnboarding(true);
    setCurrentStep(1);
    setOnboardingAnswers({});
    
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: getOnboardingQuestion(1),
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  };
  
  // Render message content
  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[90%] h-[90%] max-w-6xl bg-black rounded-xl shadow-xl flex flex-col border border-green-600">
        {/* Header */}
        <div className="bg-green-600 p-3 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="font-semibold text-xl">Fitness AI Assistant</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:bg-green-700 p-1 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800">
          <button 
            className={`flex-1 py-4 px-6 ${activeTab === 'chat' 
              ? 'bg-white text-green-600 font-medium border-b-2 border-green-500' 
              : 'bg-gray-900 text-gray-300 font-medium'}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          <button 
            className={`flex-1 py-4 px-6 ${activeTab === 'workout' 
              ? 'bg-white text-green-600 font-medium border-b-2 border-green-500' 
              : 'bg-gray-900 text-gray-300 font-medium'}`}
            onClick={() => setActiveTab('workout')}
          >
            Workout
          </button>
          <button 
            className={`flex-1 py-4 px-6 ${activeTab === 'qrcode' 
              ? 'bg-white text-green-600 font-medium border-b-2 border-green-500' 
              : 'bg-gray-900 text-gray-300 font-medium'}`}
            onClick={() => setActiveTab('qrcode')}
          >
            QR Code
          </button>
          <button 
            className={`flex-1 py-4 px-6 ${activeTab === 'arvr' 
              ? 'bg-white text-green-600 font-medium border-b-2 border-green-500' 
              : 'bg-gray-900 text-gray-300 font-medium'}`}
            onClick={() => setActiveTab('arvr')}
          >
            AR/VR
          </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'chat' && (
            <>
              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-900"
              >
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-800 text-gray-100'
                        }`}
                      >
                        <div className="text-sm">{renderMessageContent(message.content)}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Input Area */}
              <div className="p-3 border-t border-gray-800 bg-gray-800">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending}
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSending ? (
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  <button 
                    onClick={handleStartOnboarding}
                    className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm whitespace-nowrap hover:bg-gray-600"
                  >
                    Start Onboarding
                  </button>
                  <button 
                    className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm whitespace-nowrap hover:bg-gray-600"
                    onClick={() => {
                      setInputValue("Create a workout plan for me");
                    }}
                  >
                    Create Workout Plan
                  </button>
                  <button 
                    className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm whitespace-nowrap hover:bg-gray-600"
                    onClick={() => {
                      setInputValue("Nutrition advice for weight loss");
                    }}
                  >
                    Nutrition Advice
                  </button>
                  <button 
                    className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm whitespace-nowrap hover:bg-gray-600"
                    onClick={() => {
                      setInputValue("Track my progress");
                    }}
                  >
                    Track Progress
                  </button>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'workout' && (
            <div className="flex-1 p-4 bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white max-w-md">
                <svg className="mx-auto w-16 h-16 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M6 8h-1a4 4 0 0 0 0 8h1"></path>
                  <path d="M8 6h8"></path>
                  <path d="M8 18h8"></path>
                  <path d="M8 6v12"></path>
                  <path d="M16 6v12"></path>
                </svg>
                <h3 className="text-xl font-bold mb-2">Workout Tracking</h3>
                <p className="text-gray-400 mb-4">
                  Track your workouts, count reps, and get form analysis with our advanced AI-powered workout assistant.
                </p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                  Start Workout
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'qrcode' && (
            <div className="flex-1 p-4 bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white max-w-md">
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  {/* Placeholder for QR code */}
                  <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="200" fill="white"/>
                    <rect x="50" y="50" width="100" height="100" fill="black"/>
                    <rect x="60" y="60" width="80" height="80" fill="white"/>
                    <rect x="70" y="70" width="60" height="60" fill="black"/>
                    <rect x="80" y="80" width="40" height="40" fill="white"/>
                    <rect x="90" y="90" width="20" height="20" fill="black"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Your Fitness Profile QR Code</h3>
                <p className="text-gray-400 mb-4">
                  Share this QR code with your trainer or use it to quickly access your profile on other devices.
                </p>
                <div className="flex justify-center gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                    Share
                  </button>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600">
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'arvr' && (
            <div className="flex-1 p-4 bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white max-w-md">
                <svg className="mx-auto w-16 h-16 text-purple-500 mb-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0z"/>
                  <path d="M12 2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1 9 9 0 0 0-9-9z"/>
                </svg>
                <h3 className="text-xl font-bold mb-2">AR/VR Fitness Experience</h3>
                <p className="text-gray-400 mb-4">
                  Experience immersive workouts in augmented and virtual reality. Visualize exercises, get real-time form correction, and work out in virtual environments.
                </p>
                <div className="flex justify-center gap-2">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                    Launch AR
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                    Launch VR
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullscreenChatbot;
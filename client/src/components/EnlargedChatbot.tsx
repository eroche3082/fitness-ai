import React, { useState, useRef, useEffect } from 'react';
import { useCustomChat } from '@/hooks/useCustomChat';
import { UserProfile } from '../shared/types';

interface EnlargedChatbotProps {
  onClose: () => void;
  initialUserProfile?: UserProfile;
}

// Define message interface
interface Message {
  id: string;
  role: 'user' | 'assistant'; 
  content: string;
  timestamp: Date;
}

const EnlargedChatbot: React.FC<EnlargedChatbotProps> = ({ onClose, initialUserProfile }) => {
  // States
  const [activeTab, setActiveTab] = useState('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Fitness AI! I\'m here to help you with your fitness journey. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Send message handler
  const handleSendMessage = () => {
    if (!inputMessage.trim() || isProcessing) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsProcessing(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm analyzing your request: "${inputMessage.trim()}". 

This is where the AI response from Gemini would appear, providing personalized fitness guidance based on your profile and fitness goals.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1000);
  };
  
  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Set workout examples
  const setWorkoutExample = (type: string) => {
    let message = '';
    
    switch (type) {
      case 'cardio':
        message = "Create a cardio workout plan for me";
        break;
      case 'strength':
        message = "I need a strength training program for beginners";
        break;
      case 'hiit':
        message = "Can you design a HIIT workout I can do at home?";
        break;
      case 'yoga':
        message = "Suggest some yoga poses for flexibility";
        break;
      default:
        message = type;
    }
    
    setInputMessage(message);
    inputRef.current?.focus();
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-black rounded-xl shadow-lg flex flex-col border border-green-500">
        {/* Header */}
        <div className="bg-green-500 p-3 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-semibold text-xl">Fitness AI Assistant</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-green-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              {/* Message Display */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
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
                        {message.content.split('\n').map((line, i) => (
                          <div key={i} className={i > 0 ? 'mt-2' : ''}>
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Input Area */}
              <div className="p-4 border-t border-gray-800 bg-gray-800">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isProcessing}
                    className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition"
                  >
                    {isProcessing ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <button 
                    onClick={() => setWorkoutExample('cardio')}
                    className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm hover:bg-gray-600 transition"
                  >
                    Cardio Workout
                  </button>
                  <button 
                    onClick={() => setWorkoutExample('strength')}
                    className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm hover:bg-gray-600 transition"
                  >
                    Strength Training
                  </button>
                  <button 
                    onClick={() => setWorkoutExample('hiit')}
                    className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm hover:bg-gray-600 transition"
                  >
                    HIIT
                  </button>
                  <button 
                    onClick={() => setWorkoutExample('yoga')}
                    className="px-3 py-1 bg-gray-700 text-white rounded-full text-sm hover:bg-gray-600 transition"
                  >
                    Yoga/Pilates
                  </button>
                </div>
              </div>
            </>
          )}
          
          {activeTab === 'workout' && (
            <div className="flex-1 p-6 bg-gray-900 flex flex-col items-center justify-center">
              <div className="max-w-md text-center">
                <div className="p-4 rounded-full bg-green-600 inline-flex mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Workout Tracking</h2>
                <p className="text-gray-300 mb-6">
                  Track your workouts in real-time, count reps automatically, and get instant feedback on your form using our AI-powered analysis.
                </p>
                <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition">
                  Start Workout Session
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'qrcode' && (
            <div className="flex-1 p-6 bg-gray-900 flex flex-col items-center justify-center">
              <div className="text-center max-w-md">
                <div className="bg-white p-6 rounded-lg mb-6 inline-block">
                  {/* Placeholder QR Code */}
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="200" fill="white"/>
                    <rect x="20" y="20" width="40" height="40" fill="black"/>
                    <rect x="70" y="20" width="10" height="10" fill="black"/>
                    <rect x="90" y="20" width="10" height="10" fill="black"/>
                    <rect x="110" y="20" width="10" height="10" fill="black"/>
                    <rect x="140" y="20" width="40" height="40" fill="black"/>
                    <rect x="20" y="70" width="10" height="10" fill="black"/>
                    <rect x="40" y="70" width="10" height="10" fill="black"/>
                    <rect x="80" y="70" width="40" height="10" fill="black"/>
                    <rect x="140" y="70" width="10" height="10" fill="black"/>
                    <rect x="170" y="70" width="10" height="10" fill="black"/>
                    <rect x="20" y="90" width="10" height="10" fill="black"/>
                    <rect x="50" y="90" width="10" height="10" fill="black"/>
                    <rect x="80" y="90" width="10" height="10" fill="black"/>
                    <rect x="110" y="90" width="10" height="10" fill="black"/>
                    <rect x="150" y="90" width="10" height="10" fill="black"/>
                    <rect x="170" y="90" width="10" height="10" fill="black"/>
                    <rect x="20" y="110" width="10" height="10" fill="black"/>
                    <rect x="40" y="110" width="20" height="10" fill="black"/>
                    <rect x="90" y="110" width="10" height="10" fill="black"/>
                    <rect x="110" y="110" width="10" height="10" fill="black"/>
                    <rect x="130" y="110" width="10" height="10" fill="black"/>
                    <rect x="150" y="110" width="10" height="10" fill="black"/>
                    <rect x="170" y="110" width="10" height="10" fill="black"/>
                    <rect x="20" y="140" width="40" height="40" fill="black"/>
                    <rect x="70" y="140" width="10" height="10" fill="black"/>
                    <rect x="100" y="140" width="40" height="10" fill="black"/>
                    <rect x="150" y="140" width="30" height="10" fill="black"/>
                    <rect x="70" y="160" width="10" height="20" fill="black"/>
                    <rect x="90" y="160" width="10" height="10" fill="black"/>
                    <rect x="110" y="160" width="10" height="10" fill="black"/>
                    <rect x="130" y="160" width="40" height="10" fill="black"/>
                    <rect x="90" y="180" width="10" height="10" fill="black"/>
                    <rect x="110" y="180" width="10" height="10" fill="black"/>
                    <rect x="140" y="180" width="10" height="10" fill="black"/>
                    <rect x="160" y="180" width="10" height="10" fill="black"/>
                  </svg>
                </div>
                
                <div className="text-xl font-bold text-white mb-2">FIT-BEG-8644</div>
                <div className="text-gray-400 mb-6">Category: Beginner</div>
                
                <div className="flex space-x-4 justify-center">
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                    Share Code
                  </button>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'arvr' && (
            <div className="flex-1 p-6 bg-gray-900 flex flex-col items-center justify-center">
              <div className="text-center max-w-md">
                <div className="p-4 rounded-full bg-purple-600 inline-flex mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">AR/VR Experience</h2>
                <p className="text-gray-300 mb-6">
                  Experience immersive workouts with augmented and virtual reality. Perfect your form with real-time visual guidance and exercise in stunning virtual environments.
                </p>
                <div className="flex space-x-4 justify-center">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                    AR Workout
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    VR Experience
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

export default EnlargedChatbot;
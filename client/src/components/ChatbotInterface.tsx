import React, { useState, useRef, useEffect } from 'react';
import { UserCategory } from '../shared/types';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotInterfaceProps {
  onSendMessage: (message: string) => void;
  messages: Message[];
  isLoading?: boolean;
  currentStep?: number;
  totalSteps?: number;
  currentQuestion?: string;
  onClose?: () => void;
}

const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({
  onSendMessage,
  messages,
  isLoading = false,
  currentStep = 1,
  totalSteps = 10,
  currentQuestion = "What's your name?",
  onClose
}) => {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'workout' | 'qr' | 'ar'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    scrollToBottom();
  }, [messages]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Send message
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    onSendMessage(input);
    setInput('');
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-xl shadow-2xl overflow-hidden w-[400px] max-h-[600px]">
      {/* Header - Green bar with chat icon */}
      <div className="bg-green-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-white mr-2">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <span className="font-semibold text-lg">Fitness AI Assistant</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close chat"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex">
        <button
          className={`flex-1 py-4 px-6 font-medium ${activeTab === 'chat' 
            ? 'bg-white text-green-600 border-b-2 border-green-500' 
            : 'bg-gray-900 text-gray-300'}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`flex-1 py-4 px-6 font-medium ${activeTab === 'workout' 
            ? 'bg-white text-green-600 border-b-2 border-green-500' 
            : 'bg-gray-900 text-gray-300'}`}
          onClick={() => setActiveTab('workout')}
        >
          Workout
        </button>
        <button
          className={`flex-1 py-4 px-6 font-medium ${activeTab === 'qr' 
            ? 'bg-white text-green-600 border-b-2 border-green-500' 
            : 'bg-gray-900 text-gray-300'}`}
          onClick={() => setActiveTab('qr')}
        >
          QR Code
        </button>
        <button
          className={`flex-1 py-4 px-6 font-medium ${activeTab === 'ar' 
            ? 'bg-white text-green-600 border-b-2 border-green-500' 
            : 'bg-gray-900 text-gray-300'}`}
          onClick={() => setActiveTab('ar')}
        >
          AR/VR
        </button>
      </div>

      {/* Content area - Chat tab */}
      {activeTab === 'chat' && (
        <>
          {/* Messages container with dark background */}
          <div className="h-80 overflow-y-auto bg-gray-900 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-3 max-w-xs ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-900 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Current step display */}
          <div className="bg-gray-800 text-white p-4">
            <div className="mb-2">
              <h2 className="text-lg font-medium">Welcome to Fitness AI</h2>
              <p className="text-gray-300">
                Step {currentStep} of {totalSteps}: {currentQuestion}
              </p>
            </div>
            
            {/* Answer input */}
            <div className="flex rounded-md overflow-hidden border border-gray-700">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Your answer..."
                ref={inputRef}
                className="flex-1 px-4 py-3 bg-gray-800 text-white border-none focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={input.trim() === '' || isLoading}
                className="px-4 py-3 bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Content area - Other tabs (placeholder) */}
      {activeTab !== 'chat' && (
        <div className="h-96 bg-gray-900 flex items-center justify-center">
          <p className="text-white text-lg">
            {activeTab === 'workout' && "Workout tab content coming soon"}
            {activeTab === 'qr' && "QR Code tab content coming soon"}
            {activeTab === 'ar' && "AR/VR tab content coming soon"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatbotInterface;
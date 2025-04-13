import React, { useState, useRef, useEffect } from 'react';

export default function MiniChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Welcome to Fitness AI!', sender: 'bot' },
    { text: 'Step 1 of 10: What\'s your name?', sender: 'bot' }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const sendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    
    // Clear input
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: 'Thanks! Step 2 of 10: What\'s your email address?', 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button 
          onClick={toggleChat}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-green-600 shadow-lg hover:bg-green-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      ) : (
        <div className="w-[350px] h-[500px] bg-black rounded-lg shadow-xl flex flex-col border border-green-600">
          {/* Chat header */}
          <div className="bg-green-600 p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="font-bold">Fitness AI Assistant</span>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Tab navigation */}
          <div className="flex border-b border-gray-800">
            <button className="flex-1 py-2 px-4 bg-white text-green-700 font-medium">Chat</button>
            <button className="flex-1 py-2 px-4 text-gray-300 bg-gray-900">QR Code</button>
            <button className="flex-1 py-2 px-4 text-gray-300 bg-gray-900">AR/VR</button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 bg-black">
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-2 rounded-lg ${
                    msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-800 text-white'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Onboarding input box */}
          <div className="p-3 border-t border-gray-800 bg-gray-900">
            <div className="bg-[#131313] rounded-lg p-3 mb-3">
              <h3 className="text-white text-lg mb-1">Welcome to Fitness AI</h3>
              <p className="text-gray-300 text-sm mb-2">Step 1 of 10: What's your name?</p>
              <input
                className="w-full p-2 rounded border border-gray-700 bg-black text-white"
                placeholder="Your Name"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                ref={inputRef}
              />
              <div className="mt-3 flex justify-start">
                <button className="bg-gray-700 text-white px-3 py-1 rounded text-sm">
                  Back
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 rounded-l-lg border border-gray-700 bg-black text-white"
                placeholder="Message Fitness AI..."
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <button 
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-r-lg"
                onClick={sendMessage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to Fitness AI! How can I help you today with your fitness journey?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate bot response after 1 second
    setTimeout(() => {
      const botResponses = [
        "I'd be happy to help you find the right workout program for your goals!",
        "Our AI-powered training adapts to your progress - would you like me to tell you more?",
        "I can suggest a personalized nutrition plan to complement your workouts.",
        "Do you have specific fitness goals you're trying to achieve?",
        "Our premium plans include real-time form correction and personalized coaching.",
        "Have you tried our Smart Patch system for advanced biometric tracking?"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        sender: "bot",
        text: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-black shadow-lg flex items-center justify-center"
        >
          <MessageCircle size={24} />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-80 md:w-96 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-black p-4 flex justify-between items-center border-b border-gray-800">
            <div>
              <h3 className="font-bold text-white">Fitness AI Assistant</h3>
              <p className="text-xs text-gray-400">We typically reply in a few minutes</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-gray-400 hover:text-white"
            >
              <X size={18} />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-green-500 text-black"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "text-black/70" : "text-gray-400"}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-800 p-4 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 text-white border-none rounded-l-md px-4 py-2 focus:outline-none"
            />
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-black rounded-r-md px-4"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
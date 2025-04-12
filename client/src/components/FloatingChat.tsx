import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, ArrowUpRight, ArrowDownLeft, Send, Image, Mic, MicOff, QrCode, Scan, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; 
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

// Define a simple Message type
type MessageRole = 'user' | 'assistant';

interface Message {
  role: MessageRole;
  content: string;
}

// List of AI models
const AI_MODELS = [
  { id: 'gemini', name: 'Gemini', active: true },
  { id: 'gpt', name: 'GPT', active: false },
  { id: 'claude', name: 'Claude', active: false },
];

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeModel, setActiveModel] = useState('gemini');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Fitness AI assistant. How can I help you with your fitness goals today?" }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Handle opening/closing the chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle toggling fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Simulate sending a message and getting a response
  const sendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;
    
    try {
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content }]);
      setIsProcessing(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get predefined responses based on keywords
      let response: string;
      
      if (content.toLowerCase().includes('workout')) {
        response = "Based on your fitness profile, I recommend a mix of strength training and HIIT for optimal results. Would you like a customized workout plan?";
      } else if (content.toLowerCase().includes('diet') || content.toLowerCase().includes('nutrition')) {
        response = "Nutrition is key to fitness success! Aim for a balanced diet with plenty of protein, complex carbs, and healthy fats. Would you like specific meal recommendations based on your goals?";
      } else if (content.toLowerCase().includes('track') || content.toLowerCase().includes('progress')) {
        response = "Tracking your fitness progress is essential! You can connect your fitness trackers like Google Fit, Apple Health, or Fitbit to automatically sync your data.";
      } else if (content.toLowerCase().includes('goal')) {
        response = "Setting specific, measurable fitness goals is important. Let's break down your main goal into smaller milestones to track progress more effectively.";
      } else {
        response = "I'm here to help with all your fitness needs! You can ask me about workout plans, nutrition advice, progress tracking, or connecting fitness devices.";
      }
      
      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() && !isProcessing) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };
  
  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Toggle voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Simulating voice transcription
      setInputValue("This is a voice transcription example");
    }
  };
  
  // Generate QR code (placeholder)
  const generateQRCode = () => {
    alert('QR Code generation feature - coming soon');
  };
  
  // Scan QR code (placeholder)
  const scanQRCode = () => {
    alert('QR Code scanning feature - coming soon');
  };
  
  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isOpen 
        ? (isFullscreen ? 'inset-0' : 'bottom-6 right-6 w-[400px] h-[600px]') 
        : 'bottom-6 right-6'
    }`}>
      {/* Floating button when chat is closed */}
      {!isOpen && (
        <Button 
          onClick={toggleChat} 
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
          aria-label="Open Chat Assistant"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
      
      {/* Chat interface when open */}
      {isOpen && (
        <Card className={`flex flex-col shadow-xl ${isFullscreen ? 'h-full rounded-none' : 'h-full rounded-lg'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <h3 className="font-medium">Fitness AI Universal Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleFullscreen}
                className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
              >
                {isFullscreen ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat}
                className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Tab navigation - CryptoBot style */}
          <div className="flex border-b">
            <Button 
              variant={activeTab === "chat" ? "ghost" : "ghost"} 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 rounded-none border-b-2 ${activeTab === 'chat' ? 'border-primary' : 'border-transparent'} py-2 px-4`}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span>Chat</span>
            </Button>
            
            <Button 
              variant={activeTab === "qr" ? "ghost" : "ghost"} 
              onClick={() => setActiveTab('qr')}
              className={`flex-1 rounded-none border-b-2 ${activeTab === 'qr' ? 'border-primary' : 'border-transparent'} py-2 px-4`}
            >
              <QrCode className="h-5 w-5 mr-2" />
              <span>Create QR</span>
            </Button>
            
            <Button 
              variant={activeTab === "scan" ? "ghost" : "ghost"} 
              onClick={() => setActiveTab('scan')}
              className={`flex-1 rounded-none border-b-2 ${activeTab === 'scan' ? 'border-primary' : 'border-transparent'} py-2 px-4`}
            >
              <Scan className="h-5 w-5 mr-2" />
              <span>AR View</span>
            </Button>
          </div>
          
          {/* Content container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Content */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-4">
                      <div>
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium text-lg mb-2">Welcome to Fitness AI</h3>
                        <p className="text-muted-foreground">
                          Your personal AI fitness coach. Ask me anything about workouts, nutrition, or health goals!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message, index) => (
                        <div 
                          key={index} 
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`flex max-w-[80%] ${
                              message.role === 'user' 
                                ? 'flex-row-reverse' 
                                : 'flex-row'
                            }`}
                          >
                            <div 
                              className={`rounded-full h-8 w-8 flex items-center justify-center ${
                                message.role === 'user' 
                                  ? 'bg-primary text-primary-foreground ml-2' 
                                  : 'bg-muted mr-2'
                              }`}
                            >
                              {message.role === 'user' ? 'U' : 'AI'}
                            </div>
                            <div 
                              className={`p-3 rounded-lg ${
                                message.role === 'user' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}
                            >
                              <div className="prose prose-sm dark:prose-invert">
                                <ReactMarkdown>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
                
                {/* AI model selector */}
                <div className="flex justify-end p-2 border-t border-b">
                  {AI_MODELS.map(model => (
                    <Button
                      key={model.id}
                      variant={activeModel === model.id ? "default" : "ghost"}
                      size="sm"
                      className="text-xs px-2 py-1 h-auto mx-1"
                      onClick={() => setActiveModel(model.id)}
                      disabled={!model.active && model.id !== 'gemini'}
                    >
                      {model.name}
                    </Button>
                  ))}
                </div>
                
                {/* Input Area */}
                <div className="p-3">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message here..."
                      className="flex-1"
                      disabled={isProcessing}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={toggleRecording}
                            disabled={isProcessing}
                          >
                            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isRecording ? 'Stop recording' : 'Start voice input'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.click();
                            }}
                            disabled={isProcessing}
                          >
                            <Image className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Button 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isProcessing}
                      className="bg-primary"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* QR Code Tab */}
            {activeTab === 'qr' && (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <QrCodeImage />
                  <h3 className="font-medium mt-4 mb-2">QR Code Generator</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Generate QR codes for your workout plans or share with friends
                  </p>
                  <div className="flex flex-col gap-3 max-w-xs mx-auto">
                    <Input 
                      placeholder="Enter content for QR code" 
                      className="mb-2"
                    />
                    <Button onClick={generateQRCode}>Generate QR Code</Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* AR/VR Tab */}
            {activeTab === 'scan' && (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <ArVrImage />
                  <h3 className="font-medium mt-4 mb-2">AR Workout Viewer</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Experience virtual workouts and fitness guidance in augmented reality
                  </p>
                  <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                    <Button onClick={() => alert('AR Mode - Coming soon!')}>Start AR</Button>
                    <Button variant="outline" onClick={() => alert('VR Mode - Coming soon!')}>View Library</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function QrCodeImage() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <rect x="10" y="10" width="140" height="140" rx="8" fill="white" stroke="currentColor" strokeWidth="2" />
      <rect x="30" y="30" width="40" height="40" rx="4" fill="currentColor" />
      <rect x="90" y="30" width="40" height="40" rx="4" fill="currentColor" />
      <rect x="30" y="90" width="40" height="40" rx="4" fill="currentColor" />
      <rect x="90" y="90" width="10" height="10" rx="2" fill="currentColor" />
      <rect x="110" y="90" width="20" height="10" rx="2" fill="currentColor" />
      <rect x="90" y="110" width="10" height="20" rx="2" fill="currentColor" />
      <rect x="110" y="110" width="20" height="20" rx="2" fill="currentColor" />
    </svg>
  );
}

function ArVrImage() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto"
    >
      <rect x="10" y="10" width="140" height="140" rx="8" fill="white" stroke="currentColor" strokeWidth="2" />
      <path d="M30 60 L80 30 L130 60 L80 90 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <path d="M30 100 L80 70 L130 100 L80 130 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="80" cy="80" r="15" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
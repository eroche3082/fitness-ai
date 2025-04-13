import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OnboardingFlow from './OnboardingFlow';
import { useUserProfile } from '@/hooks/useUserProfile';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SimpleChatbot() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to Fitness AI! How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { isOnboarding, currentQuestion } = useUserProfile(1);

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const toggleChatbot = () => {
    setOpen(!open);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
    setInputValue('');
    setIsProcessing(true);

    try {
      // In a real app, this would be an API call to your AI backend
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            content: 'This is a simulated AI response. In the complete version, this would be processed by Gemini AI.' 
          }
        ]);
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Floating chat button */}
      {!open && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={toggleChatbot} 
            className="h-14 w-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white"
            aria-label="Open Fitness AI Assistant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </Button>
        </div>
      )}

      {/* Chatbot interface */}
      {open && (
        <div className="fixed inset-0 z-50 md:inset-auto md:left-auto md:right-4 md:top-4 md:bottom-4 md:w-[420px] flex flex-col bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-green-600 text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h1 className="text-lg font-bold">Fitness AI Assistant</h1>
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChatbot}
                className="text-white hover:bg-green-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>
          </div>

          {/* Main chat interface */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-3 bg-green-50">
                <TabsTrigger value="chat" className="data-[state=active]:bg-white">Chat</TabsTrigger>
                <TabsTrigger value="qr" className="data-[state=active]:bg-white">QR Code</TabsTrigger>
                <TabsTrigger value="ar" className="data-[state=active]:bg-white">AR/VR</TabsTrigger>
              </TabsList>
              
              {/* Chat tab */}
              <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
                {isOnboarding ? (
                  <div className="flex flex-1 items-center justify-center p-4">
                    <OnboardingFlow 
                      userId={1} 
                      onComplete={(welcomeMessage) => {
                        setMessages(prev => [...prev, {
                          role: 'assistant',
                          content: welcomeMessage
                        }]);
                      }} 
                    />
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1 p-4">
                      {messages.map((message, index) => (
                        <div 
                          key={index} 
                          className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                              message.role === 'user' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      ))}
                      
                      {isProcessing && (
                        <div className="mb-4 flex justify-start">
                          <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: '0s' }}></div>
                              <div className="w-2 h-2 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 rounded-full bg-green-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messageEndRef} />
                    </ScrollArea>
                    
                    {/* Message input */}
                    <div className="p-4 border-t mt-auto">
                      <div className="flex gap-2">
                        <Textarea 
                          value={inputValue}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          placeholder="Message Fitness AI..."
                          className="resize-none"
                          rows={1}
                        />
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={!inputValue.trim() || isProcessing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
              
              {/* QR Code tab */}
              <TabsContent value="qr" className="flex-1 h-full p-4 bg-white">
                <div className="flex flex-col items-center justify-center h-full">
                  <h3 className="text-lg font-medium mb-2">QR Code Generator</h3>
                  <p className="text-center text-gray-500 mb-4">
                    Generate a QR code to quickly share your fitness profile with friends or trainers.
                  </p>
                  <div className="w-48 h-48 border-2 border-gray-200 rounded flex items-center justify-center">
                    <p className="text-gray-400">QR placeholder</p>
                  </div>
                </div>
              </TabsContent>
              
              {/* AR/VR tab */}
              <TabsContent value="ar" className="flex-1 h-full p-4 bg-white">
                <div className="flex flex-col items-center justify-center h-full">
                  <h3 className="text-lg font-medium mb-2">AR Exercise Viewer</h3>
                  <p className="text-center text-gray-500 mb-4">
                    View exercises in augmented reality for better form and technique.
                  </p>
                  <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-400">AR viewer placeholder</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, ArrowUpRight, ArrowDownLeft, Send, Image, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; 
import { useChat } from '@/contexts/ChatContext';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const { messages, isProcessing, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle opening/closing the chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle toggling fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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
    // Voice recording implementation would go here
  };
  
  // Generate QR code (placeholder)
  const generateQRCode = () => {
    alert('QR Code generation feature - coming soon');
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
              <MessageSquare className="h-5 w-5" />
              <h3 className="font-medium">Fitness AI Assistant</h3>
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
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-2 pt-2 border-b">
              <TabsList className="w-full">
                <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                <TabsTrigger value="qr" className="flex-1">QR Code</TabsTrigger>
                <TabsTrigger value="ar" className="flex-1">AR/VR</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Chat Content */}
            <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden p-0 m-0">
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
              
              {/* Input Area */}
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
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
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* QR Code Tab */}
            <TabsContent value="qr" className="flex-1 flex items-center justify-center p-4 m-0">
              <div className="text-center">
                <QrCodeImage />
                <h3 className="font-medium mt-4 mb-2">QR Code Generator</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Generate QR codes for your fitness plans or share with friends
                </p>
                <Button onClick={generateQRCode}>Generate QR Code</Button>
              </div>
            </TabsContent>
            
            {/* AR/VR Tab */}
            <TabsContent value="ar" className="flex-1 flex items-center justify-center p-4 m-0">
              <div className="text-center">
                <ArVrImage />
                <h3 className="font-medium mt-4 mb-2">AR/VR Experiences</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Experience virtual workouts and fitness guidance in augmented reality
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => alert('AR Mode - Coming soon!')}>AR Mode</Button>
                  <Button variant="outline" onClick={() => alert('VR Mode - Coming soon!')}>VR Mode</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
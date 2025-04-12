import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ReactMarkdown from 'react-markdown';
import useCustomChat from '../hooks/useChat';

// Import icons
import {
  Mic, MicOff, Image, QrCode, Send, X, Maximize2, Minimize2, 
  Upload, Settings, Copy, Share2, Volume2, VolumeX, Camera
} from 'lucide-react';

interface Message {
  role: string;
  content: string;
  timestamp?: string;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your Fitness AI assistant. How can I help you with your fitness goals today?' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { 
    sending,
    handleVoiceInput,
    isRecording,
    sendMessage
  } = useCustomChat();

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Add user message to the conversation
    const userMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    const messageToBeSent = inputValue.trim();
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Send the message to the main chat interface
      if (sendMessage) {
        sendMessage(messageToBeSent);
      }
      
      // Add AI response to the conversation after a short delay
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I\'m analyzing your fitness data now. Please check the main chat area for a detailed response!' 
        }]);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      }]);
      setIsProcessing(false);
    }
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle voice activation
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };

  // Generate QR code (placeholder)
  const generateQRCode = () => {
    alert('QR Code generation feature will be implemented here');
  };

  // Upload image (placeholder)
  const handleImageUpload = () => {
    alert('Image upload feature will be implemented here');
  };

  // Handle camera access (placeholder)
  const handleCameraAccess = () => {
    alert('Camera access feature will be implemented here');
  };

  // Copy conversation (placeholder)
  const copyConversation = () => {
    const text = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    alert('Conversation copied to clipboard');
  };

  // Share conversation (placeholder)
  const shareConversation = () => {
    alert('Share feature will be implemented here');
  };

  return (
    <div 
      className={`fixed ${isOpen ? 'bottom-4 right-4' : 'bottom-6 right-6'} z-50 transition-all duration-300 ${
        isFullScreen ? 'inset-0 m-0' : ''
      }`}
    >
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
          aria-label="Open Chat Assistant"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.7 12L21.7 8C22.1 7.6 22.1 7 21.7 6.6L17.4 2.3C17 1.9 16.4 1.9 16 2.3L12 6.3L8 2.3C7.6 1.9 7 1.9 6.6 2.3L2.3 6.6C1.9 7 1.9 7.6 2.3 8L6.3 12L2.3 16C1.9 16.4 1.9 17 2.3 17.4L6.6 21.7C7 22.1 7.6 22.1 8 21.7L12 17.7L16 21.7C16.4 22.1 17 22.1 17.4 21.7L21.7 17.4C22.1 17 22.1 16.4 21.7 16L17.7 12Z" fill="currentColor"/>
          </svg>
        </Button>
      ) : (
        <Card className={`flex flex-col ${
          isFullScreen 
            ? 'fixed inset-0 rounded-none h-screen w-screen' 
            : 'w-96 h-[600px] rounded-lg shadow-xl'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b p-3 bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.7 12L21.7 8C22.1 7.6 22.1 7 21.7 6.6L17.4 2.3C17 1.9 16.4 1.9 16 2.3L12 6.3L8 2.3C7.6 1.9 7 1.9 6.6 2.3L2.3 6.6C1.9 7 1.9 7.6 2.3 8L6.3 12L2.3 16C1.9 16.4 1.9 17 2.3 17.4L6.6 21.7C7 22.1 7.6 22.1 8 21.7L12 17.7L16 21.7C16.4 22.1 17 22.1 17.4 21.7L21.7 17.4C22.1 17 22.1 16.4 21.7 16L17.7 12Z" fill="currentColor"/>
              </svg>
              <h3 className="font-bold">Fitness AI Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsFullScreen(!isFullScreen)}
                      className="text-primary-foreground hover:bg-primary/90"
                    >
                      {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsOpen(false)}
                      className="text-primary-foreground hover:bg-primary/90"
                    >
                      <X size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Close
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b">
              <TabsList className="w-full justify-start px-2 h-10">
                <TabsTrigger value="chat" className="data-[state=active]:bg-primary/10">Chat</TabsTrigger>
                <TabsTrigger value="qr" className="data-[state=active]:bg-primary/10">QR Code</TabsTrigger>
                <TabsTrigger value="ar" className="data-[state=active]:bg-primary/10">AR/VR</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              <ScrollArea className="flex-1 p-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="mb-4 flex justify-start">
                    <div className="rounded-lg px-4 py-2 bg-secondary text-secondary-foreground">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messageEndRef} />
              </ScrollArea>
              
              {/* Action Bar */}
              <div className="border-t p-2 flex flex-wrap gap-1 justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={toggleVoice}>
                        {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleVoiceInput} disabled={isRecording || isProcessing}>
                        {isRecording ? <MicOff size={18} className="text-red-500" /> : <Mic size={18} />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isRecording ? 'Stop Recording' : 'Start Voice Input'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleImageUpload} disabled={isProcessing}>
                        <Image size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Upload Image
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleCameraAccess} disabled={isProcessing}>
                        <Camera size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Camera
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={generateQRCode} disabled={isProcessing}>
                        <QrCode size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Generate QR Code
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={copyConversation} disabled={isProcessing}>
                        <Copy size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Copy Conversation
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={shareConversation} disabled={isProcessing}>
                        <Share2 size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Share
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isProcessing}>
                        <Settings size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Settings
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {/* Input Area */}
              <div className="p-2 pt-0 flex gap-2">
                <Textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Message Fitness AI..."
                  className="min-h-[60px] resize-none"
                  disabled={isProcessing}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputValue.trim() || isProcessing} 
                  className="self-end"
                >
                  <Send size={18} />
                </Button>
              </div>
            </TabsContent>
            
            {/* QR Code Tab */}
            <TabsContent value="qr" className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center p-6">
                <QrCode size={120} className="mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">QR Code Generator</h3>
                <p className="text-muted-foreground mb-4">
                  Generate QR codes for fitness profiles, workout plans, and more.
                </p>
                <Button onClick={generateQRCode}>Generate New QR Code</Button>
              </div>
            </TabsContent>
            
            {/* AR/VR Tab */}
            <TabsContent value="ar" className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-primary">
                  <path d="M3 7v4a1 1 0 0 0 1 1h3 M7 7v4 M13 7v4 M17 7v4a1 1 0 0 0 1 1h3 M10 7h4 M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2 M10 16.4l4 2.6 M4.8 15l4.053-6.08a2 2 0 0 1 3.331-.524L19.5 15"/>
                </svg>
                <h3 className="text-lg font-semibold mb-2">AR/VR Experience</h3>
                <p className="text-muted-foreground mb-4">
                  Visualize workouts, fitness data, and environments in augmented reality.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline">Launch AR Mode</Button>
                  <Button>Enter VR Mode</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}
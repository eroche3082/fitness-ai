import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import ReactMarkdown from 'react-markdown';
import { useCustomChat } from '@/hooks/useCustomChat';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Message as ChatMessage } from '@/contexts/ChatContext';
import OnboardingFlow from './OnboardingFlow';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Mic,
  MicOff,
  Send,
  Image,
  Camera,
  QrCode,
  Copy,
  Share2,
  Settings,
  VolumeX,
  Volume2,
  Minimize2,
  Maximize2,
  X,
  Menu,
  User,
  History,
  Upload,
  Globe,
  LogOut,
  ChevronRight,
  ChevronsLeft
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type LanguageOption = {
  value: string;
  label: string;
}

const languages: LanguageOption[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' }
];

interface EnhancedChatbotProps {
  forceOpen?: boolean;
}

export default function EnhancedChatbot({ forceOpen = false }: EnhancedChatbotProps) {
  // Refs
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // States
  const [open, setOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your Fitness AI assistant. How can I help you with your fitness goals today?" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [arModeActive, setArModeActive] = useState(false);
  const [vrModeActive, setVrModeActive] = useState(false);
  
  // User profile integration
  const { 
    profile, 
    loading: profileLoading,
    isOnboarding,
    resetOnboarding
  } = useUserProfile();

  // Get chat context
  const {
    messages: contextMessages,
    sending,
    handleSendMessage: contextSendMessage,
    setInputValue: setContextInputValue,
    isRecording,
    startRecording,
    stopRecording
  } = useCustomChat();
  
  // Voice input handler
  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    // Add user message to the conversation
    const userMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev as Message[], userMessage as Message]);
    const messageToBeSent = inputValue.trim();
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Set the input value in the context and send the message to the main chat interface
      if (contextSendMessage && setContextInputValue) {
        setContextInputValue(messageToBeSent);
        setTimeout(() => {
          contextSendMessage();
        }, 100);
      }
      
      // Add AI response to the conversation after a short delay
      setTimeout(() => {
        setMessages(prev => [...prev as Message[], { 
          role: 'assistant', 
          content: 'I\'m analyzing your fitness data now and preparing a personalized response based on your profile and activity history.' 
        } as Message]);
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev as Message[], { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      } as Message]);
      setIsProcessing(false);
    }
  };

  // Handle forceOpen prop
  useEffect(() => {
    if (forceOpen && !open) {
      setOpen(true);
    }
  }, [forceOpen, open]);

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
    // Add QR code generation for profile or workout
    const userMessage = { role: 'user', content: 'Generate a QR code for my fitness profile' };
    setMessages(prev => [...prev as Message[], userMessage as Message]);
    
    setTimeout(() => {
      setMessages(prev => [...prev as Message[], { 
        role: 'assistant', 
        content: 'I\'ve generated a QR code for your fitness profile. You can scan this to quickly share your profile with trainers or fitness partners.\n\n![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FitnessAI_Profile_123456)' 
      } as Message]);
    }, 1000);

    // Switch to QR tab after generating
    setActiveTab('qr');
  };

  // Upload image (placeholder)
  const handleImageUpload = () => {
    alert('Image upload and analysis feature will be implemented with Google Vision API');
  };

  // Handle camera access (placeholder)
  const handleCameraAccess = () => {
    alert('Camera access for pose detection and form analysis will be implemented');
  };

  // Copy conversation (placeholder)
  const copyConversation = () => {
    const text = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    alert('Conversation copied to clipboard');
  };

  // Share conversation (placeholder)
  const shareConversation = () => {
    alert('Share feature for workout plans and nutrition advice will be implemented');
  };

  // Toggle AR mode
  const toggleARMode = () => {
    setArModeActive(!arModeActive);
    if (!arModeActive) {
      alert('AR Mode activated. You can visualize exercises and correct form in augmented reality.');
      setActiveTab('ar');
    } else {
      setActiveTab('chat');
    }
  };

  // Toggle VR mode
  const toggleVRMode = () => {
    setVrModeActive(!vrModeActive);
    if (!vrModeActive) {
      alert('VR Mode activated. You can experience immersive workout environments.');
      setActiveTab('ar');
    } else {
      setActiveTab('chat');
    }
  };

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setCurrentLanguage(value);
    const languageName = languages.find(lang => lang.value === value)?.label || 'English';
    
    // Add language change message
    const userMessage = { role: 'user', content: `Switch language to ${languageName}` };
    setMessages(prev => [...prev as Message[], userMessage as Message]);
    
    setTimeout(() => {
      let responseMessage = '';
      
      switch(value) {
        case 'es':
          responseMessage = 'He cambiado el idioma a Español. ¿Cómo puedo ayudarte con tus objetivos de fitness hoy?';
          break;
        case 'fr':
          responseMessage = 'J\'ai changé la langue en Français. Comment puis-je vous aider avec vos objectifs de fitness aujourd\'hui?';
          break;
        case 'pt':
          responseMessage = 'Eu mudei o idioma para Português. Como posso ajudá-lo com seus objetivos de fitness hoje?';
          break;
        default:
          responseMessage = 'I\'ve changed the language to English. How can I help you with your fitness goals today?';
      }
      
      setMessages(prev => [...prev as Message[], { 
        role: 'assistant', 
        content: responseMessage 
      } as Message]);
    }, 1000);
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setOpen(!open);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={toggleChatbot} 
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
            aria-label="Open Fitness AI Assistant"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.7 12L21.7 8C22.1 7.6 22.1 7 21.7 6.6L17.4 2.3C17 1.9 16.4 1.9 16 2.3L12 6.3L8 2.3C7.6 1.9 7 1.9 6.6 2.3L2.3 6.6C1.9 7 1.9 7.6 2.3 8L6.3 12L2.3 16C1.9 16.4 1.9 17 2.3 17.4L6.6 21.7C7 22.1 7.6 22.1 8 21.7L12 17.7L16 21.7C16.4 22.1 17 22.1 17.4 21.7L21.7 17.4C22.1 17 22.1 16.4 21.7 16L17.7 12Z" fill="currentColor"/>
            </svg>
          </Button>
        </div>
      )}

      {/* Fullpage chatbot */}
      {open && (
        <div className={`fixed inset-0 z-50 flex flex-col bg-background ${isFullScreen ? 'p-0' : 'p-4'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="mr-2 text-primary-foreground hover:bg-primary/90"
              >
                {isSidebarOpen ? <ChevronsLeft size={20} /> : <Menu size={20} />}
              </Button>
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.7 12L21.7 8C22.1 7.6 22.1 7 21.7 6.6L17.4 2.3C17 1.9 16.4 1.9 16 2.3L12 6.3L8 2.3C7.6 1.9 7 1.9 6.6 2.3L2.3 6.6C1.9 7 1.9 7.6 2.3 8L6.3 12L2.3 16C1.9 16.4 1.9 17 2.3 17.4L6.6 21.7C7 22.1 7.6 22.1 8 21.7L12 17.7L16 21.7C16.4 22.1 17 22.1 17.4 21.7L21.7 17.4C22.1 17 22.1 16.4 21.7 16L17.7 12Z" fill="currentColor"/>
                </svg>
                <h1 className="text-xl font-bold">Fitness AI Assistant</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
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
                      onClick={toggleChatbot}
                      className="text-primary-foreground hover:bg-primary/90"
                    >
                      <X size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Minimize
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-1 overflow-hidden rounded-b-lg border border-t-0">
            {/* Sidebar */}
            {isSidebarOpen && (
              <div className="w-72 border-r bg-muted/30">
                {/* User Profile */}
                <div className="p-4 border-b flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Fitness User</p>
                    <p className="text-sm text-muted-foreground">Active Member</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="py-4">
                  <div className="px-4 mb-2">
                    <h3 className="text-sm font-medium">Tools</h3>
                  </div>
                  <nav className="space-y-1 px-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={() => setActiveTab('chat')}
                    >
                      <div className="flex items-center">
                        <Send className="h-4 w-4 mr-3" />
                        New Conversation
                      </div>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={() => setActiveTab('qr')}
                    >
                      <div className="flex items-center">
                        <QrCode className="h-4 w-4 mr-3" />
                        QR Code Generator
                      </div>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={toggleARMode}
                    >
                      <div className="flex items-center">
                        <Camera className="h-4 w-4 mr-3" />
                        AR Exercise Viewer
                      </div>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={handleImageUpload}
                    >
                      <div className="flex items-center">
                        <Upload className="h-4 w-4 mr-3" />
                        Upload Fitness Data
                      </div>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left"
                    >
                      <div className="flex items-center">
                        <History className="h-4 w-4 mr-3" />
                        Conversation History
                      </div>
                    </Button>
                  </nav>

                  <div className="px-4 mt-6 mb-2">
                    <h3 className="text-sm font-medium">Settings</h3>
                  </div>
                  <div className="p-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Language</label>
                        <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="English" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Voice Enabled</label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={toggleVoice}
                          className={voiceEnabled ? "bg-primary/10" : ""}
                        >
                          {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t mt-auto">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Powered by Vertex AI
                    </p>
                    <p className="text-xs text-muted-foreground">
                      v1.0.2
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="border-b">
                  <TabsList className="w-full justify-start px-4 h-12">
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
                          <Button variant="ghost" size="icon" onClick={handleVoiceInput} disabled={isProcessing}>
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
                          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[60px] h-9">
                              <SelectValue>
                                <Globe size={18} />
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {languages.map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TooltipTrigger>
                        <TooltipContent>
                          Change Language
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  {/* Input Area */}
                  <div className="p-4 pt-2 flex gap-2">
                    <Textarea 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={currentLanguage === 'en' ? "Message Fitness AI..." : 
                                  currentLanguage === 'es' ? "Mensaje a Fitness AI..." :
                                  currentLanguage === 'fr' ? "Message à Fitness AI..." :
                                  "Mensagem para Fitness AI..."}
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
                  <div className="text-center p-6 max-w-md">
                    <QrCode size={150} className="mx-auto mb-4 text-primary" />
                    <h3 className="text-lg font-semibold mb-2">QR Code Generator</h3>
                    <p className="text-muted-foreground mb-4">
                      Generate QR codes for your fitness profile, workout plans, or nutritional guides.
                    </p>
                    <div className="space-y-4">
                      <Button onClick={generateQRCode} className="w-full">Generate Profile QR</Button>
                      <Button variant="outline" className="w-full">Generate Workout QR</Button>
                      <Button variant="outline" className="w-full">Generate Nutrition QR</Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* AR/VR Tab */}
                <TabsContent value="ar" className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-center p-6 max-w-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-primary">
                      <path d="M3 7v4a1 1 0 0 0 1 1h3 M7 7v4 M13 7v4 M17 7v4a1 1 0 0 0 1 1h3 M10 7h4 M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2 M10 16.4l4 2.6 M4.8 15l4.053-6.08a2 2 0 0 1 3.331-.524L19.5 15"/>
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">AR/VR Experience</h3>
                    <p className="text-muted-foreground mb-6">
                      Visualize workouts, fitness data, and exercise environments in augmented or virtual reality.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <h4 className="font-medium mb-2">Augmented Reality</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Overlay exercise form guides and workout instructions in your real environment.
                        </p>
                        <Button 
                          variant={arModeActive ? "default" : "outline"} 
                          onClick={toggleARMode}
                          className="w-full"
                        >
                          {arModeActive ? 'Deactivate AR Mode' : 'Launch AR Mode'}
                        </Button>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <h4 className="font-medium mb-2">Virtual Reality</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Immerse yourself in virtual workout environments with interactive guides.
                        </p>
                        <Button 
                          variant={vrModeActive ? "default" : "outline"} 
                          onClick={toggleVRMode}
                          className="w-full"
                        >
                          {vrModeActive ? 'Exit VR Mode' : 'Enter VR Mode'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
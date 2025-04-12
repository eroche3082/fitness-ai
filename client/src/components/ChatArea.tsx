import { useState, useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ProgressDashboard from "./ProgressDashboard";
import ToolsHeader from "./ToolsHeader";
import FloatingVoiceButton from "./FloatingVoiceButton";
import useCustomChat from "../hooks/useChat";
import { useUserProfile } from '@/hooks/useUserProfile';
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  QrCode, 
  Volume2, 
  VolumeX,
  Mic, 
  MicOff, 
  Send, 
  Image, 
  Camera
} from 'lucide-react';

export default function ChatArea() {
  const { 
    messages, 
    sending, 
    loadingMessages,
    inputValue, 
    handleInputChange, 
    handleSendMessage, 
    handleKeyPress,
    handleVoiceInput,
    isRecording
  } = useCustomChat();
  
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [arModeActive, setArModeActive] = useState(false);
  const [vrModeActive, setVrModeActive] = useState(false);
  
  // User profile integration
  const { 
    profile, 
    loading: profileLoading,
    isOnboarding,
    resetOnboarding
  } = useUserProfile();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Toggle voice activation
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
  };
  
  // Generate QR code (placeholder)
  const generateQRCode = () => {
    // Add QR code generation for profile or workout
    const userMessage = { role: 'user', content: 'Generate a QR code for my fitness profile' };
    
    setTimeout(() => {
      // This is a placeholder. In a real implementation, this would be part of the chat state
      alert('QR Code generation feature - coming soon');
    }, 1000);
  };
  
  // Toggle AR mode
  const toggleARMode = () => {
    setArModeActive(!arModeActive);
    if (!arModeActive) {
      alert('AR Mode activated. You can visualize exercises and correct form in augmented reality.');
    }
  };

  // Toggle VR mode
  const toggleVRMode = () => {
    setVrModeActive(!vrModeActive);
    if (!vrModeActive) {
      alert('VR Mode activated. You can experience immersive workout environments.');
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden relative">
      <ToolsHeader />
      
      <Tabs
        defaultValue="chat"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-4 pt-2">
          <TabsList className="w-full max-w-md mx-auto">
            <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
            <TabsTrigger value="progress" className="flex-1">Progress Dashboard</TabsTrigger>
            <TabsTrigger value="qr" className="flex-1">QR Code</TabsTrigger>
            <TabsTrigger value="ar" className="flex-1">AR/VR</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden mt-0">
          <div className="flex-1 overflow-y-auto p-4" id="chat-messages">
            {loadingMessages ? (
              <div className="space-y-4">
                <div className="flex items-start">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-3 space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[400px]" />
                    <Skeleton className="h-4 w-[300px]" />
                  </div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="mr-3 space-y-2">
                    <Skeleton className="h-4 w-[200px] ml-auto" />
                    <Skeleton className="h-4 w-[150px] ml-auto" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center max-w-md">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No messages</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start a conversation with your AI fitness coach.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message: any, index: number) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={
                    <div className="prose-sm max-w-none">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  }
                />
              ))
            )}
            
            {sending && (
              <div className="flex mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z" />
                  </svg>
                </div>
                <div className="ml-3 chat-bubble avatar-bubble bg-neutral-100 px-4 py-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <ChatInput 
            value={inputValue}
            onChange={handleInputChange}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            onVoiceInput={handleVoiceInput}
            isRecording={isRecording}
            disabled={sending}
          />
        </TabsContent>
        
        <TabsContent value="progress" className="flex-1 overflow-y-auto p-4 mt-0">
          <ProgressDashboard />
        </TabsContent>
        
        {/* QR Code Tab - Imported from EnhancedChatbot */}
        <TabsContent value="qr" className="flex-1 flex flex-col items-center justify-center p-4 mt-0">
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
        
        {/* AR/VR Tab - Imported from EnhancedChatbot */}
        <TabsContent value="ar" className="flex-1 flex flex-col items-center justify-center p-4 mt-0">
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
      
      <FloatingVoiceButton />
    </main>
  );
}

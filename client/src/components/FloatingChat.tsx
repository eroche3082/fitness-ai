import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatArea from './ChatArea';
import useCustomChat from '../hooks/useChat';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Handle opening/closing the chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle toggling fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isOpen 
        ? (isFullscreen ? 'inset-0' : 'bottom-4 right-4 w-[400px] h-[600px]') 
        : 'bottom-4 right-4'
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
          
          {/* Chat content */}
          <div className="flex flex-1 overflow-hidden">
            <ChatArea />
          </div>
        </Card>
      )}
    </div>
  );
}
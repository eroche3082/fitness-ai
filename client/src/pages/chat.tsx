import { useEffect, useState } from "react";
import EnhancedChatbot from "@/components/EnhancedChatbot";

export default function ChatPage() {
  const [forceOpen, setForceOpen] = useState(false);
  
  // Automatically open the chatbot when navigating to this page
  useEffect(() => {
    // Small delay to ensure the component is mounted
    const timer = setTimeout(() => {
      setForceOpen(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="container mx-auto p-4 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Fitness AI Assistant</h1>
        <p className="text-muted-foreground mb-4">
          Your personal AI fitness coach, ready to help with workout plans, nutrition advice, and tracking progress.
        </p>
        {!forceOpen && (
          <p className="text-sm text-muted-foreground animate-pulse">
            Opening chat interface...
          </p>
        )}
      </div>
      
      {/* The EnhancedChatbot is rendered globally in App.tsx */}
      {/* This component passes the forceOpen prop to ensure it's opened when navigating to this page */}
      <EnhancedChatbot forceOpen={forceOpen} />
    </div>
  );
}
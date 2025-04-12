import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Message, useCustomChat } from '@/hooks/useCustomChat';

interface ChatContextProps {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  isProcessing: boolean;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  clearMessages: () => void;
}

export const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { messages, sendMessage, isProcessing, setMessages } = useCustomChat();

  const clearMessages = () => {
    setMessages([{ 
      role: 'assistant', 
      content: "Hello! I'm your Fitness AI assistant. How can I help you with your fitness goals today?" 
    }]);
    // Also clear the conversation ID from localStorage
    localStorage.removeItem('currentConversationId');
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        sendMessage, 
        isProcessing, 
        setMessages,
        clearMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextProps {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export type { Message };
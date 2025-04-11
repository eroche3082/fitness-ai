import { createContext, useContext, ReactNode, useState, useEffect, useRef } from "react";
import { useUser } from "./UserContext";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id?: number;
  conversationId: number;
  content: string;
  role: "user" | "assistant";
  timestamp?: string;
}

interface Conversation {
  id: number;
  userId: number;
  title?: string;
  createdAt: string;
}

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  sending: boolean;
  loadingMessages: boolean;
  createConversation: () => Promise<Conversation | null>;
  selectConversation: (id: number) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  let userContext;
  let user: { id: number; username: string; name?: string; language: string } | null = null;
  try {
    userContext = useUser();
    user = userContext.user;
  } catch (error) {
    console.warn("ChatProvider used outside of UserProvider, some features will be disabled");
  }
  
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // We removed the WebSocket connection initialization to simplify the application

  // Load conversations when user changes
  useEffect(() => {
    if (!user) {
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
      return;
    }

    async function loadConversations() {
      try {
        if (!user || !user.id) {
          console.error('User not available for loading conversations');
          return;
        }
        
        const response = await fetch(`/api/users/${user.id}/conversations`);
        
        if (!response.ok) {
          throw new Error('Failed to load conversations');
        }
        
        const data = await response.json();
        setConversations(data);
        
        // If there are conversations, select the most recent one
        if (data.length > 0) {
          const mostRecent = data.sort((a: Conversation, b: Conversation) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          
          await selectConversation(mostRecent.id);
        } else {
          // Create a new conversation if none exists
          await createConversation();
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
      }
    }

    loadConversations();
  }, [user]);

  const createConversation = async (): Promise<Conversation | null> => {
    if (!user) return null;
    
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          title: 'New Conversation',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }
      
      const newConversation = await response.json();
      setConversations(prev => [...prev, newConversation]);
      setCurrentConversation(newConversation);
      setMessages([]);
      
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create a new conversation",
        variant: "destructive",
      });
      return null;
    }
  };

  const selectConversation = async (id: number): Promise<void> => {
    try {
      setLoadingMessages(true);
      const conversation = conversations.find(c => c.id === id);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      setCurrentConversation(conversation);
      
      // Load messages for this conversation
      const response = await fetch(`/api/conversations/${id}/messages`);
      
      if (!response.ok) {
        throw new Error('Failed to load messages');
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error selecting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation messages",
        variant: "destructive",
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!user || !currentConversation) {
      toast({
        title: "Error",
        description: "Cannot send message at this time",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSending(true);
      
      // Add user message to the UI immediately
      const userMessage: Message = {
        conversationId: currentConversation.id,
        content,
        role: 'user',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send the message via REST API
      const response = await fetch(`/api/conversations/${currentConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          content,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      // Add AI response to messages
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: data.assistantMessage.id,
          conversationId: data.assistantMessage.conversationId,
          content: data.assistantMessage.content,
          role: 'assistant',
          timestamp: data.assistantMessage.timestamp || new Date().toISOString(),
        }
      ]);
      
      setSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      setSending(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        sending,
        loadingMessages,
        createConversation,
        selectConversation,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

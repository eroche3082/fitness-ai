import { useState } from 'react';

// Message type definition
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useCustomChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your Fitness AI assistant. How can I help you with your fitness goals today?" 
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Send message to the fitness AI and get response
  const sendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;

    try {
      // Update UI with user message
      setIsProcessing(true);
      
      // Create conversation if needed
      let conversationId: number;
      
      // Check if we have existing conversation in localStorage
      const storedConversationId = localStorage.getItem('currentConversationId');
      
      if (storedConversationId) {
        conversationId = parseInt(storedConversationId);
      } else {
        // Create new conversation
        const conversationResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: 1,
            title: 'New Conversation'
          })
        });
        
        if (!conversationResponse.ok) {
          throw new Error('Failed to create conversation');
        }
        
        const conversation = await conversationResponse.json();
        conversationId = conversation.id;
        localStorage.setItem('currentConversationId', conversationId.toString());
      }
      
      // Add user message to the UI
      const userMessage: Message = { role: 'user', content };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      
      // Send message to the API
      const messageResponse = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          content
        })
      });
      
      if (!messageResponse.ok) {
        throw new Error('Failed to send message');
      }
      
      const responseData = await messageResponse.json();
      
      // Add assistant response to the UI
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: responseData.assistantMessage.content 
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message to the user
      setMessages((prevMessages) => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: "I'm sorry, I encountered an error processing your request. Please try again." 
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    messages,
    sendMessage,
    isProcessing,
    setMessages
  };
}
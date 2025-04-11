import { useCallback, useState, useEffect } from 'react';
import { useContext } from 'react';
import { ChatContext } from '@/contexts/ChatContext';
import { useUser } from '@/contexts/UserContext';
import { Message } from '@/contexts/ChatContext';

// Custom hook for chat input and UI interactions
export default function useCustomChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useCustomChat must be used within a ChatProvider");
  }
  
  const { 
    messages, 
    sending, 
    sendMessage, 
    currentConversation,
    loadingMessages
  } = context;
  
  const { user } = useUser();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Function to handle sending messages
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || sending || !user) return;
    
    await sendMessage(inputValue.trim());
    setInputValue('');
  }, [inputValue, sending, user, sendMessage]);

  // Function to handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Function to handle voice recording
  const handleVoiceInput = useCallback(() => {
    // This would be implemented with the Web Speech API in a real app
    setIsRecording(prev => !prev);
    
    if (!isRecording) {
      // Start recording
      // Implementation would use navigator.mediaDevices.getUserMedia
      console.log('Starting voice recording...');
    } else {
      // Stop recording and process
      console.log('Stopping voice recording...');
      // In a real implementation, this would process the audio and convert to text
      // Then set the input value and potentially send the message
    }
  }, [isRecording]);

  // Auto-scroll to the bottom of the chat when messages change
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return {
    messages,
    sending,
    loadingMessages,
    inputValue,
    setInputValue,
    isRecording,
    handleSendMessage,
    handleInputChange,
    handleVoiceInput,
    handleKeyPress,
    isConversationActive: !!currentConversation,
  };
}

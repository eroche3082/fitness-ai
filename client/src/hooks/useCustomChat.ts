import { useState, useEffect, useRef } from 'react';
import { useChat, Message } from '@/contexts/ChatContext';

interface UseCustomChatReturn {
  messages: Message[];
  sending: boolean;
  loadingMessages: boolean;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  handleSendMessage: () => void;
  isConversationActive: boolean;
}

export function useCustomChat(): UseCustomChatReturn {
  const chatContext = useChat();
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // For recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Here you would normally send the audio to a speech-to-text service
        // For now we'll just add a placeholder message
        setInputValue('Voice command transcription would appear here');
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      chatContext.sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  // Cancel recording if component unmounts while recording
  useEffect(() => {
    return () => {
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  return {
    messages: chatContext.messages,
    sending: chatContext.sending,
    loadingMessages: chatContext.loadingMessages,
    inputValue,
    setInputValue,
    isRecording,
    startRecording,
    stopRecording,
    handleSendMessage,
    isConversationActive: !!chatContext.currentConversation,
  };
}
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../shared/types';
import userService from '../lib/userService';
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, X, Send, Mic, StopCircle } from 'lucide-react';

interface EnlargedChatbotProps {
  onClose: () => void;
  initialUserProfile?: UserProfile;
}

// Define message interface for the component
interface Message {
  id: string;
  role: 'user' | 'assistant'; 
  content: string;
  timestamp: Date;
}

export default function EnlargedChatbot({ onClose, initialUserProfile }: EnlargedChatbotProps) {
  // State
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de fitness personal. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // Send message
  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isProcessing) return;
    
    // Generate a unique ID for the message
    const userMessageId = `user-${Date.now()}`;
    
    // Add user message to chat
    const newUserMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // Simulate AI processing
      setTimeout(() => {
        // AI response
        const aiResponse: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: getSimulatedResponse(inputValue),
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsProcessing(false);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };
  
  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    // In a real implementation, this would use the Web Speech API or similar
    console.log('Started recording...');
    
    // Simulate recording with timeout
    setTimeout(() => {
      stopRecording();
    }, 5000);
  };
  
  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    console.log('Stopped recording');
    
    // Simulate transcription 
    const simulatedTranscription = "Me gustaría un plan de entrenamiento para aumentar resistencia";
    setInputValue(simulatedTranscription);
  };
  
  // Get simulated response (in a real app, this would be an API call to an AI backend)
  const getSimulatedResponse = (userMessage: string): string => {
    // Basic response logic based on user input
    const userInput = userMessage.toLowerCase();
    
    if (userInput.includes('hola') || userInput.includes('saludos') || userInput.includes('buenos días')) {
      return '¡Hola! ¿Cómo puedo ayudarte con tu entrenamiento hoy?';
    }
    
    if (userInput.includes('plan') || userInput.includes('rutina') || userInput.includes('entrenamiento')) {
      return 'Puedo ayudarte a crear un plan de entrenamiento personalizado. Para empezar, necesitaría saber tu nivel de condición física (principiante, intermedio, avanzado) y tus objetivos principales.';
    }
    
    if (userInput.includes('dieta') || userInput.includes('nutrición') || userInput.includes('comer')) {
      return 'La nutrición es clave para alcanzar tus objetivos fitness. ¿Te gustaría recibir consejos generales de nutrición o un plan más específico basado en tus objetivos de entrenamiento?';
    }
    
    if (userInput.includes('peso') || userInput.includes('adelgazar') || userInput.includes('perder')) {
      return 'Para perder peso de forma saludable, es importante combinar entrenamiento cardiovascular, ejercicios de fuerza y una dieta adecuada. ¿Te gustaría que te sugiera una rutina específica para pérdida de peso?';
    }
    
    if (userInput.includes('músculo') || userInput.includes('fuerza') || userInput.includes('ganar')) {
      return 'Para ganar masa muscular, deberías enfocarte en entrenamientos de hipertrofia con pesos apropiados y asegurar una ingesta adecuada de proteínas. ¿Tienes acceso a un gimnasio o prefieres ejercicios en casa?';
    }
    
    if (userInput.includes('cardio') || userInput.includes('resistencia') || userInput.includes('correr')) {
      return 'El entrenamiento cardiovascular es excelente para mejorar la resistencia y la salud general. Te recomendaría comenzar con 20-30 minutos de actividad moderada 3-4 veces por semana, e ir aumentando gradualmente.';
    }
    
    if (userInput.includes('lesión') || userInput.includes('dolor') || userInput.includes('recuperación')) {
      return 'Si tienes una lesión o experimentas dolor, es importante consultar con un profesional médico. Puedo sugerirte ejercicios de rehabilitación una vez que tengas autorización médica.';
    }
    
    if (userInput.includes('gracias')) {
      return '¡De nada! Estoy aquí para ayudarte con tus objetivos fitness. ¿Hay algo más en lo que pueda asistirte?';
    }
    
    // Default response
    return 'Interesante. ¿Podrías darme más detalles para poder ayudarte mejor con tus objetivos de fitness?';
  };
  
  return (
    <div 
      className={`fixed ${
        isFullScreen ? 'inset-0' : 'bottom-16 right-16 w-[800px] h-[600px]'
      } bg-white dark:bg-black rounded-lg shadow-2xl z-50 flex flex-col border border-primary transition-all duration-300 ease-in-out`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <h1 className="text-xl font-bold">Asistente Fitness AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="text-primary-foreground hover:bg-primary/90"
          >
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary/90"
          >
            <X size={18} />
          </Button>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <p>{message.content}</p>
                <div className="text-xs opacity-70 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={isProcessing ? "Processing..." : "Escribe tu mensaje aquí..."}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              ref={inputRef}
              className="w-full p-3 pr-10 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {isProcessing && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-t-transparent border-primary rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleRecording}
            className={`rounded-full ${isRecording ? 'bg-red-500 text-white' : ''}`}
          >
            {isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === '' || isProcessing}
            className="rounded-full"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Hints or suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button 
            onClick={() => setInputValue("Me gustaría un plan de entrenamiento para principiantes")}
            className="text-xs py-1 px-2.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
          >
            Plan principiante
          </button>
          <button 
            onClick={() => setInputValue("¿Qué debo comer antes de entrenar?")}
            className="text-xs py-1 px-2.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
          >
            Nutrición pre-entrenamiento
          </button>
          <button 
            onClick={() => setInputValue("Ejercicios para ganar masa muscular")}
            className="text-xs py-1 px-2.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
          >
            Ganar masa muscular
          </button>
          <button 
            onClick={() => setInputValue("Rutina para mejorar resistencia cardiovascular")}
            className="text-xs py-1 px-2.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
          >
            Mejorar resistencia
          </button>
        </div>
      </div>
    </div>
  );
}
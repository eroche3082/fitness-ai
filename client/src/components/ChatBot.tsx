import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Icons } from "./ui/icons";
import { Separator } from "./ui/separator";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Initial system message for fitness coaching
const systemPrompt = `
You are Fitness AI, a real-time interactive health and fitness system. Your primary goal is to provide personalized
workout plans, nutritional advice, and track fitness progress based on user goals and fitness level.
Always be supportive, motivating, and provide evidence-based advice. Remember that effective fitness
is built on consistency, proper form, and gradual progression.
`;

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I'm your Fitness AI assistant. How can I help with your fitness journey today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to the conversation
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // We'll organize messages to send to the API
      const messagesToSend = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: inputMessage }
      ];

      // Call Gemini API (or whatever backend AI service we've set up)
      const response = await apiRequest('POST', '/api/chat', { messages: messagesToSend });
      const data = await response.json();

      if (data.content) {
        const aiResponse: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp to be more readable
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="fitness-ai-chatbot w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="fitness-ai-chatbot-header py-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="/images/fitness-ai-avatar.png" alt="Fitness AI" />
            <AvatarFallback className="bg-green-700 text-black">AI</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">Fitness AI</CardTitle>
            <CardDescription className="text-gray-300">
              Your personal AI fitness coach
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center">
            <div className="bg-green-500 h-2 w-2 rounded-full mr-2"></div>
            <span className="text-sm text-green-400">Online</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.role === 'user'
                  ? 'ml-auto chat-bubble user-bubble bg-green-500 text-black'
                  : 'mr-auto chat-bubble avatar-bubble bg-gray-800 text-white'
              } p-3 rounded-lg`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/images/fitness-ai-avatar.png" alt="Fitness AI" />
                  <AvatarFallback className="bg-green-700 text-black">AI</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col">
                <div className="whitespace-pre-wrap">{message.content}</div>
                <span className={`text-xs ${message.role === 'user' ? 'text-green-800' : 'text-gray-400'} self-end mt-1`}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] mr-auto chat-bubble avatar-bubble bg-gray-800 text-white p-3 rounded-lg">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/images/fitness-ai-avatar.png" alt="Fitness AI" />
                <AvatarFallback className="bg-green-700 text-black">AI</AvatarFallback>
              </Avatar>
              <div className="flex space-x-2 items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce delay-0"></div>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce delay-150"></div>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <Separator className="bg-gray-700" />
      
      <CardFooter className="p-4 bg-gray-800">
        <div className="flex w-full items-center gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about workouts, nutrition, or fitness advice..."
            className="flex-1 bg-gray-700 border-gray-600 text-white"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            className="fitness-ai-send-button text-black px-4 py-2"
            disabled={!inputMessage.trim() || isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="h-4 w-4 animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
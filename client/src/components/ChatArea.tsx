import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ProgressDashboard from "./ProgressDashboard";
import useCustomChat from "../hooks/useChat";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <main className="flex-1 flex flex-col bg-gray-50 overflow-hidden relative">
      <ProgressDashboard />
      
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
                <path d="M17.73 12.02l3.98-3.98c.39-.39.39-1.02 0-1.41l-4.34-4.34c-.39-.39-1.02-.39-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63c-.39.39-.39 1.02 0 1.41l3.98 3.98L2.25 16c-.39.39-.39 1.02 0 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.39.39 1.02.39 1.41 0l4.34-4.34c.39-.39.39-1.02 0-1.41l-3.98-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2.66 9.34l-3.63-3.62 3.63-3.63 3.62 3.63-3.62 3.62z"/>
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
    </main>
  );
}

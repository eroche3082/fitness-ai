import { ReactNode } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: ReactNode;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end mb-6">
        <div className="chat-bubble user-bubble bg-primary text-white px-4 py-3">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex mb-6">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.73 12.02l3.98-3.98c.39-.39.39-1.02 0-1.41l-4.34-4.34c-.39-.39-1.02-.39-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63c-.39.39-.39 1.02 0 1.41l3.98 3.98L2.25 16c-.39.39-.39 1.02 0 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.39.39 1.02.39 1.41 0l4.34-4.34c.39-.39.39-1.02 0-1.41l-3.98-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2.66 9.34l-3.63-3.62 3.63-3.63 3.62 3.63-3.62 3.62z"/>
        </svg>
      </div>
      <div className="ml-3 chat-bubble avatar-bubble bg-neutral-100 px-4 py-3">
        {content}
      </div>
    </div>
  );
}

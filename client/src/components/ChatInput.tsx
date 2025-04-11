import { Mic, Smile, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onVoiceInput: () => void;
  isRecording: boolean;
  disabled?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  onVoiceInput,
  isRecording,
  disabled = false,
}: ChatInputProps) {
  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center">
        <Button 
          type="button" 
          size="icon"
          variant={isRecording ? "default" : "ghost"}
          className={`mr-2 rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'text-neutral-500 hover:text-primary hover:bg-primary/10'}`}
          onClick={onVoiceInput}
          disabled={disabled}
        >
          <Mic className="h-6 w-6" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Type your message..."
            className="w-full py-3 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyPress}
            disabled={disabled}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full text-neutral-500 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>
        
        <Button
          type="button"
          size="icon"
          className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors ml-2"
          onClick={onSend}
          disabled={disabled || !value.trim()}
        >
          <Send className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

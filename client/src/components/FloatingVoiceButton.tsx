import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/contexts/ChatContext";
import { useUser } from "@/contexts/UserContext";

// Extended to include Web Speech API types
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function FloatingVoiceButton() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { toast } = useToast();
  const { sendMessage } = useChat();
  const { user } = useUser();
  
  // References for the speech recognition object
  const recognitionRef = useRef<any>(null);
  
  // Setup speech recognition
  const setupSpeechRecognition = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = user?.language === 'es' ? 'es-ES' : 'en-US';
      
      recognition.onstart = () => {
        setIsRecording(true);
        setTranscript("");
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        });
        stopRecording();
      };
      
      recognition.onend = () => {
        setIsRecording(false);
        if (transcript) {
          // If we have a transcript, process it
          processTranscript();
        }
      };
      
      recognitionRef.current = recognition;
      return true;
    }
    
    return false;
  };
  
  // Toggle recording state
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Start recording
  const startRecording = () => {
    if (isProcessing) return;
    
    const hasRecognition = setupSpeechRecognition();
    
    if (hasRecognition) {
      try {
        recognitionRef.current.start();
        toast({
          title: "Voice Input Active",
          description: "Speak now. Your voice will be converted to text.",
        });
      } catch (error) {
        console.error('Failed to start speech recognition', error);
        toast({
          title: "Error",
          description: "Failed to start voice recognition. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Not Supported",
        description: "Voice recognition is not supported in this browser.",
        variant: "destructive",
      });
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition', error);
      }
    }
    
    setIsRecording(false);
  };
  
  // Process the final transcript
  const processTranscript = () => {
    if (!transcript) return;
    
    setIsProcessing(true);
    
    // Send the transcript as a message
    sendMessage(transcript)
      .then(() => {
        setTranscript("");
      })
      .catch(error => {
        console.error('Error sending voice message', error);
        toast({
          title: "Error",
          description: "Failed to send voice message. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className={`fixed bottom-20 right-6 md:bottom-6 md:right-6 z-20 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
              isProcessing ? "bg-yellow-500 hover:bg-yellow-600" :
              isRecording ? "bg-red-500 hover:bg-red-600" : 
              "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={toggleRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : isRecording ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isProcessing ? "Processing..." : 
             isRecording ? "Stop recording" : 
             "Start voice input"}
          </p>
        </TooltipContent>
      </Tooltip>
      
      {transcript && (
        <div className="fixed bottom-36 md:bottom-24 right-6 max-w-xs bg-background border rounded-md shadow-lg p-3 z-20">
          <p className="text-sm font-medium">Transcript:</p>
          <p className="text-sm mt-1">{transcript}</p>
        </div>
      )}
    </TooltipProvider>
  );
}

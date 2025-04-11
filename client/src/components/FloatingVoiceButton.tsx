import { useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FloatingVoiceButton() {
  const [isActive, setIsActive] = useState(false);

  const handleVoiceCoach = () => {
    setIsActive(!isActive);
    // In a real app, this would trigger voice coaching functionality
    if (!isActive) {
      // Start voice coaching
      console.log("Starting voice coaching...");
    } else {
      // Stop voice coaching
      console.log("Stopping voice coaching...");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className={`fixed bottom-20 right-6 md:bottom-6 md:right-6 z-20 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
              isActive ? "bg-red-500 hover:bg-red-600" : "bg-orange-500 hover:bg-orange-600"
            }`}
            onClick={handleVoiceCoach}
          >
            <Volume2 className="h-6 w-6 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isActive ? "Stop voice coaching" : "Start voice coaching"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

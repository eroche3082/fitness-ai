import { Mic, Camera, Plus, BarChart2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileSidebar() {
  const handleToolClick = (tool: string) => {
    console.log(`Mobile tool clicked: ${tool}`);
    // Implement tool functionality
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10 sidebar-mobile">
      <div className="flex justify-around">
        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-neutral-500 hover:text-primary transition-colors"
          onClick={() => handleToolClick("voice")}
        >
          <Mic className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-neutral-500 hover:text-primary transition-colors"
          onClick={() => handleToolClick("camera")}
        >
          <Camera className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-neutral-500 hover:text-primary transition-colors"
          onClick={() => handleToolClick("new")}
        >
          <Plus className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-neutral-500 hover:text-primary transition-colors"
          onClick={() => handleToolClick("stats")}
        >
          <BarChart2 className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-neutral-500 hover:text-primary transition-colors"
          onClick={() => handleToolClick("settings")}
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

import React from "react";
import { Mic, Camera, QrCode, Upload, Dumbbell, ClipboardList, Calendar, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link, useLocation } from "wouter";

interface ToolItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ToolItem = ({ icon, label, href, isActive, onClick }: ToolItemProps) => {
  const ButtonContent = () => (
    <>
      {icon}
      <span className="ml-3 text-sm font-medium hidden md:block">{label}</span>
    </>
  );
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {href ? (
            <Button 
              variant="ghost" 
              className={`flex items-center justify-center md:justify-start w-full p-2 rounded-lg transition-colors
                ${isActive ? 'bg-primary/10 text-primary' : 'text-neutral-600 hover:bg-primary/10 hover:text-primary'}`}
              asChild
            >
              <Link href={href}>
                <ButtonContent />
              </Link>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              className="flex items-center justify-center md:justify-start w-full p-2 rounded-lg text-neutral-600 hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={onClick}
            >
              <ButtonContent />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function Sidebar() {
  const [location] = useLocation();
  
  return (
    <aside className="w-20 md:w-64 bg-white border-r border-gray-200 flex flex-col hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-neutral-500 hidden md:block">TOOLS</h2>
          <div className="mt-3 space-y-2">
            <ToolItem 
              icon={<Mic className="h-6 w-6" />} 
              label="Voice Coach"
              href="/voice-coaching"
              isActive={location === "/voice-coaching"}
            />
            <ToolItem 
              icon={<Camera className="h-6 w-6" />} 
              label="Form Check"
              href="/"
            />
            <ToolItem 
              icon={<QrCode className="h-6 w-6" />} 
              label="QR Scanner"
              href="/"
            />
            <ToolItem 
              icon={<Upload className="h-6 w-6" />} 
              label="Upload File"
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".csv,.xlsx,.pdf";
                input.click();
              }}
            />
          </div>
        </div>
        
        <div className="p-4 mt-4 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-neutral-500 hidden md:block">MODULES</h2>
          <div className="mt-3 space-y-2">
            <ToolItem 
              icon={<Dumbbell className="h-6 w-6" />} 
              label="Workout Plan"
              href="/"
            />
            <ToolItem 
              icon={<ClipboardList className="h-6 w-6" />} 
              label="Nutrition Coach"
              href="/"
            />
            <ToolItem 
              icon={<Calendar className="h-6 w-6" />} 
              label="Habit Builder"
              href="/" 
            />
            <ToolItem 
              icon={<Moon className="h-6 w-6" />} 
              label="Sleep Optimizer"
              href="/"
            />
          </div>
        </div>
        
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="hidden md:block">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-2 text-sm font-medium text-neutral-600">Connected</span>
            </div>
            <p className="text-xs text-neutral-500">Using Gemini 1.5 Flash engine</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

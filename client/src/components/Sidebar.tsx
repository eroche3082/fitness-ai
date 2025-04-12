import React from "react";
import { 
  Mic, 
  Camera, 
  QrCode, 
  Upload, 
  Dumbbell, 
  ClipboardList, 
  Calendar, 
  Moon, 
  LayoutDashboard, 
  Activity, 
  BarChart2, 
  FileDigit, 
  Utensils, 
  Heart,
  Settings
} from "lucide-react";
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
  
  // Main menu items including mandatory links from MainNavigation component
  const mainMenuItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Home",
      href: "/",
      isActive: location === "/"
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: "Fitness Trackers",
      href: "/fitness-trackers",
      isActive: location === "/fitness-trackers"
    },
    {
      icon: <Mic className="h-5 w-5" />,
      label: "Voice Coaching",
      href: "/voice-coaching",
      isActive: location === "/voice-coaching"
    },
    {
      icon: <FileDigit className="h-5 w-5" />,
      label: "API Status",
      href: "/api-status",
      isActive: location === "/api-status"
    },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      label: "System Status",
      href: "/agent-status",
      isActive: location === "/agent-status"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      href: "/fitness-api",
      isActive: location === "/fitness-api"
    }
  ];
  
  // Extra features
  const featuresItems = [
    {
      icon: <Dumbbell className="h-5 w-5" />,
      label: "Workout Plan",
      href: "/workout-plan",
      isActive: location === "/workout-plan"
    },
    {
      icon: <Utensils className="h-5 w-5" />,
      label: "Nutrition",
      href: "/nutrition",
      isActive: location === "/nutrition"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Health Stats",
      href: "/health-stats",
      isActive: location === "/health-stats"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Habit Builder",
      href: "/habits",
      isActive: location === "/habits"
    },
    {
      icon: <Moon className="h-5 w-5" />,
      label: "Sleep Tracking",
      href: "/sleep",
      isActive: location === "/sleep"
    }
  ];
  
  // Tools
  const toolsItems = [
    {
      icon: <Camera className="h-5 w-5" />,
      label: "Form Check",
      href: "/form-check",
      isActive: location === "/form-check"
    },
    {
      icon: <QrCode className="h-5 w-5" />,
      label: "QR Scanner",
      href: "/qr-scanner",
      isActive: location === "/qr-scanner"
    },
    {
      icon: <Upload className="h-5 w-5" />,
      label: "Upload File",
      onClick: () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".csv,.xlsx,.pdf";
        input.click();
      }
    }
  ];
  
  return (
    <aside className="w-20 md:w-64 bg-white border-r border-gray-200 flex flex-col hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-primary/10 p-2 rounded-md">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h1 className="ml-3 text-lg font-semibold hidden md:block">Fitness AI</h1>
          </div>
        </div>
        
        <div className="p-4">
          <h2 className="text-sm font-semibold text-neutral-500 hidden md:block mb-3">MAIN MENU</h2>
          <div className="space-y-1">
            {mainMenuItems.map((item, index) => (
              <ToolItem 
                key={`main-${index}`}
                icon={item.icon} 
                label={item.label}
                href={item.href}
                isActive={item.isActive}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
        
        <div className="p-4 mt-2 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-neutral-500 hidden md:block mb-3">FEATURES</h2>
          <div className="space-y-1">
            {featuresItems.map((item, index) => (
              <ToolItem 
                key={`feature-${index}`}
                icon={item.icon} 
                label={item.label}
                href={item.href}
                isActive={item.isActive}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
        
        <div className="p-4 mt-2 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-neutral-500 hidden md:block mb-3">TOOLS</h2>
          <div className="space-y-1">
            {toolsItems.map((item, index) => (
              <ToolItem 
                key={`tool-${index}`}
                icon={item.icon} 
                label={item.label}
                href={item.href}
                isActive={item.isActive}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="hidden md:block">
            <div className="flex items-center mb-2">
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

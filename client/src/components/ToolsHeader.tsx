import React from "react";
import { Button } from "@/components/ui/button";
import FormCheckAnalyzer from "./FormCheckAnalyzer";
import QRCodeScanner from "./QRCodeScanner";
import { Link, useLocation } from "wouter";
import { 
  BarChartBig, 
  FileUp, 
  ListChecks,
  Dumbbell, 
  Utensils,
  Bed, 
  Heart,
  Mic
} from "lucide-react";

// This component renders a toolbar with all the Fitness AI tools
export default function ToolsHeader() {
  const [location] = useLocation();
  
  // Upload file handler
  const handleFileUpload = () => {
    // In production, this would open a file picker and process the selected file
    console.log("File upload clicked");
    
    // Simulate file upload dialog
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx,.pdf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // In production, this would process the file with appropriate API
        alert(`File "${file.name}" selected. In production, this would process the file.`);
      }
    };
    input.click();
  };
  
  return (
    <div className="w-full bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto py-2 px-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {/* QR Code Scanner */}
          <QRCodeScanner />
          
          {/* Form Check */}
          <FormCheckAnalyzer />
          
          {/* File Upload */}
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleFileUpload}
          >
            <FileUp className="h-4 w-4" />
            <span>Upload</span>
          </Button>
          
          {/* Voice Coaching */}
          <Button 
            variant="outline"
            className={`flex items-center gap-2 ${location === '/voice-coaching' ? 'bg-primary/10 text-primary' : ''}`}
            asChild
          >
            <Link href="/voice-coaching">
              <Mic className="h-4 w-4" />
              <span>Voice Coach</span>
            </Link>
          </Button>
          
          {/* Workout Plan */}
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <Link href="/">
              <Dumbbell className="h-4 w-4" />
              <span>Workouts</span>
            </Link>
          </Button>
          
          {/* Nutrition Coach */}
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <Link href="/">
              <Utensils className="h-4 w-4" />
              <span>Nutrition</span>
            </Link>
          </Button>
          
          {/* Habit Builder */}
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <Link href="/">
              <ListChecks className="h-4 w-4" />
              <span>Habits</span>
            </Link>
          </Button>
          
          {/* Sleep Optimizer */}
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <Link href="/">
              <Bed className="h-4 w-4" />
              <span>Sleep</span>
            </Link>
          </Button>
          
          {/* Progress Dashboard */}
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <Link href="/">
              <BarChartBig className="h-4 w-4" />
              <span>Progress</span>
            </Link>
          </Button>
          
          {/* Fitness Devices */}
          <Button 
            variant="outline"
            className={`flex items-center gap-2 ${location === '/fitness-trackers' ? 'bg-primary/10 text-primary' : ''}`}
            asChild
          >
            <Link href="/fitness-trackers">
              <Heart className="h-4 w-4" />
              <span>Devices</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Check, TrendingUp, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";

// Progress item component
interface ProgressItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  progress?: number;
}

const ProgressItem = ({ icon, title, subtitle, progress }: ProgressItemProps) => (
  <div className="flex items-center">
    {progress !== undefined ? (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-12 h-12" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="16" fill="none" stroke="#E5E7EB" strokeWidth="3"></circle>
          <circle 
            cx="18" 
            cy="18" 
            r="16" 
            fill="none" 
            stroke={title === "Day Streak" ? "#3B82F6" : "#10B981"} 
            strokeWidth="3" 
            strokeDasharray={`${progress} 100`} 
            strokeDashoffset="0" 
            className="progress-ring"
          ></circle>
        </svg>
        <span className="absolute text-xs font-semibold">
          {title === "Day Streak" ? "7" : `${progress}%`}
        </span>
      </div>
    ) : (
      <div className={`w-12 h-12 ${title === "Workouts" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"} rounded-full flex items-center justify-center`}>
        {icon}
      </div>
    )}
    <div className="ml-3">
      <p className="text-sm font-medium text-neutral-700">{title}</p>
      <p className="text-xs text-neutral-500">{subtitle}</p>
    </div>
  </div>
);

export default function ProgressDashboard() {
  const { user } = useUser();
  const [streakProgress, setStreakProgress] = useState(85);
  const [hydrationProgress, setHydrationProgress] = useState(60);

  // Simulate progress data
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For demo purposes, we're using static data
  }, [user]);

  return (
    <div className="bg-white border-b border-gray-200 p-4 hidden md:block">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-neutral-800">Your Progress</h2>
        <Button variant="link" className="text-sm text-primary font-medium p-0 h-auto">
          See Full Dashboard
        </Button>
      </div>
      <div className="flex justify-between space-x-6">
        <ProgressItem 
          title="Day Streak" 
          subtitle="85% to next badge" 
          progress={streakProgress} 
          icon={<Check />}
        />
        
        <ProgressItem 
          title="Workouts" 
          subtitle="3 of 5 this week" 
          icon={<Check className="h-6 w-6" />} 
        />
        
        <ProgressItem 
          title="Hydration" 
          subtitle="1.5L of 2.5L" 
          progress={hydrationProgress} 
          icon={<Droplet />}
        />
        
        <ProgressItem 
          title="Steps" 
          subtitle="7,234 of 10,000" 
          icon={<TrendingUp className="h-6 w-6" />} 
        />
      </div>
    </div>
  );
}

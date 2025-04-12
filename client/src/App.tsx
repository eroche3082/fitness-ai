import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FitnessTrackersPage from "@/pages/fitness-trackers";
import ApiStatusPage from "@/pages/api-status";
import SystemAuditPage from "@/pages/system-audit";
import FitnessApiPage from "@/pages/fitness-api";
import ChatPage from "@/pages/chat";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from "./contexts/ChatContext";
import FitnessSystemInitializer from "./components/FitnessSystemInitializer";

import VoiceCoachingPage from "@/pages/voice-coaching";
import { 
  LayoutDashboard, 
  Activity, 
  BarChart2, 
  FileDigit, 
  Headphones, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// Main navigation for the app
function MainNavigation() {
  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border">
      <Link href="/">
        <Button variant="ghost" size="icon" className="h-10 w-10" title="Home">
          <LayoutDashboard className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="/fitness-trackers">
        <Button variant="ghost" size="icon" className="h-10 w-10" title="Fitness Trackers">
          <Activity className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="/voice-coaching">
        <Button variant="ghost" size="icon" className="h-10 w-10" title="Voice Coaching">
          <Headphones className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="/api-status">
        <Button variant="ghost" size="icon" className="h-10 w-10" title="API Status">
          <FileDigit className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="/agent-status">
        <Button variant="ghost" size="icon" className="h-10 w-10" title="System Status">
          <BarChart2 className="h-5 w-5" />
        </Button>
      </Link>
      <Link href="/fitness-api">
        <Button variant="ghost" size="icon" className="h-10 w-10" title="Settings">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/chat" component={ChatPage}/>
      <Route path="/fitness-trackers" component={FitnessTrackersPage}/>
      <Route path="/voice-coaching" component={VoiceCoachingPage}/>
      <Route path="/api-status" component={ApiStatusPage}/>
      <Route path="/agent-status" component={SystemAuditPage}/>
      <Route path="/fitness-api" component={FitnessApiPage}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ChatProvider>
          {/* System initializer and main application components */}
          <FitnessSystemInitializer />
          <Router />
          <MainNavigation />
          
          {/* Floating chat button is now integrated in each page layout instead */}
        </ChatProvider>
      </UserProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

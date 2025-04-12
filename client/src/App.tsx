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
// Using FullpageChatbot instead of FloatingChatbot based on user feedback
// import FloatingChatbot from "./components/FloatingChatbot";

import VoiceCoachingPage from "@/pages/voice-coaching";
import { MessageSquare, Home as HomeIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Simple navigation component for main pages
function MainNavigation() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <Link href="/">
        <Button variant="default" size="icon" className="h-14 w-14 rounded-full shadow-lg">
          <HomeIcon className="h-6 w-6" />
        </Button>
      </Link>
      <Link href="/chat">
        <Button variant="default" size="icon" className="h-14 w-14 rounded-full shadow-lg">
          <MessageSquare className="h-6 w-6" />
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
          <FitnessSystemInitializer />
          <Router />
          <MainNavigation />
        </ChatProvider>
      </UserProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

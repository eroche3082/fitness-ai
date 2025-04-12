import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FitnessTrackersPage from "@/pages/fitness-trackers";
import ApiStatusPage from "@/pages/api-status";
import SystemAuditPage from "@/pages/system-audit";
import FitnessApiPage from "@/pages/fitness-api";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from "./contexts/ChatContext";
import FitnessSystemInitializer from "./components/FitnessSystemInitializer";

import VoiceCoachingPage from "@/pages/voice-coaching";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
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
        </ChatProvider>
      </UserProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

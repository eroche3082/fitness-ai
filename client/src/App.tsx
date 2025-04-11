import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from "./contexts/ChatContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ChatProvider>
          <Router />
        </ChatProvider>
      </UserProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

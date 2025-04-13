import { useState, useEffect } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LandingPage from "@/pages/newlanding";
import BridgeLanding from "@/pages/BridgeLanding";
import FitnessTrackersPage from "@/pages/fitness-trackers";
import ApiStatusPage from "@/pages/api-status";
import SystemAuditPage from "@/pages/system-audit";
import FitnessApiPage from "@/pages/fitness-api";
import ChatPage from "@/pages/chat";
import DashboardPage from "./pages/DashboardPage";
import AccessCodePage from "./pages/AccessCodePage";
import AdminPanelPage from "./pages/AdminPanelPage";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import AboutPage from "./pages/about";
import ProgramsPage from "./pages/programs";
import ContactPage from "./pages/contact";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from "./contexts/ChatContext";
import FitnessSystemInitializer from "./components/FitnessSystemInitializer";
import MiniChatbot from "./components/MiniChatbot";

// Import CSS para el tema Bridge
import "./assets/bridge-styles.css";

import VoiceCoachingPage from "@/pages/voice-coaching";
import { 
  LayoutDashboard, 
  Activity, 
  BarChart2, 
  FileDigit, 
  Headphones, 
  MessageSquare,
  Info,
  Settings as SettingsIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// Auth context
import { createContext, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Main navigation for the app
function MainNavigation() {
  const { logout } = useAuth();
  
  return (
    <div className="fixed left-0 top-0 h-full w-[260px] z-40 bg-background shadow-lg border-r overflow-y-auto">
      <div className="flex items-center p-4 border-b">
        <Activity className="h-6 w-6 text-primary mr-2" />
        <h1 className="font-bold text-xl">Fitness AI</h1>
      </div>
      
      <div className="p-2">
        <div className="space-y-1">
          <h3 className="text-xs font-medium px-3 py-2">Dashboard</h3>
          <Link href="/">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <LayoutDashboard className="h-5 w-5 mr-3" />
              <span>Home</span>
            </a>
          </Link>
          <Link href="/fitness-trackers">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <Activity className="h-5 w-5 mr-3" />
              <span>Fitness Trackers</span>
            </a>
          </Link>
          <Link href="/voice-coaching">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <Headphones className="h-5 w-5 mr-3" />
              <span>Voice Coaching</span>
            </a>
          </Link>
        </div>
        
        <div className="mt-6 space-y-1">
          <h3 className="text-xs font-medium px-3 py-2">Interaction</h3>
          <Link href="/chat">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <MessageSquare className="h-5 w-5 mr-3" />
              <span>AI Assistant</span>
            </a>
          </Link>
        </div>
        
        <div className="mt-6 space-y-1">
          <h3 className="text-xs font-medium px-3 py-2">System</h3>
          <Link href="/api-status">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <FileDigit className="h-5 w-5 mr-3" />
              <span>API Status</span>
            </a>
          </Link>
          <Link href="/agent-status">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <BarChart2 className="h-5 w-5 mr-3" />
              <span>System Status</span>
            </a>
          </Link>
          <Link href="/fitness-api">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <SettingsIcon className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </a>
          </Link>
        </div>
        
        <div className="mt-6 space-y-1">
          <h3 className="text-xs font-medium px-3 py-2">Account</h3>
          <button 
            onClick={logout}
            className="w-full flex items-center px-3 py-2 rounded-md hover:bg-accent text-left"
          >
            <Info className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Status Routes
function StatusRoute({ path, statusInfo }: { path: string, statusInfo: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Status: {path}</h1>
      <div className="p-4 bg-green-100 rounded-md">
        <p className="text-green-800">{statusInfo}</p>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Check auth status and redirect if needed
  useEffect(() => {
    if (!isAuthenticated && location !== '/landing' && location !== '/bridge' && 
        !location.startsWith('/status/') && 
        location !== '/access' && location !== '/dashboard' && !location.startsWith('/dashboard/')) {
      setLocation('/bridge');
    }
  }, [isAuthenticated, location, setLocation]);
  
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/landing" component={LandingPage} />
      <Route path="/bridge" component={BridgeLanding} />
      
      {/* New Routes - User Journey */}
      <Route path="/access" component={AccessCodePage} />
      <Route path="/dashboard/:code" component={DashboardPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/admin" component={AdminPanelPage} />
      
      {/* Status routes */}
      <Route path="/status/landing">
        {() => <StatusRoute path="landing" statusInfo="Landing page is fully operational" />}
      </Route>
      <Route path="/status/login">
        {() => <StatusRoute path="login" statusInfo="Login system is fully operational" />}
      </Route>
      <Route path="/status/structure">
        {() => <StatusRoute path="structure" statusInfo="Dashboard structure is fully operational" />}
      </Route>
      <Route path="/status/chat">
        {() => <StatusRoute path="chat" statusInfo="AI Assistant Chat is fully operational" />}
      </Route>
      
      {/* Protected routes */}
      {isAuthenticated && (
        <>
          <Route path="/" component={Home}/>
          <Route path="/chat" component={ChatPage}/>
          <Route path="/fitness-trackers" component={FitnessTrackersPage}/>
          <Route path="/voice-coaching" component={VoiceCoachingPage}/>
          <Route path="/api-status" component={ApiStatusPage}/>
          <Route path="/agent-status" component={SystemAuditPage}/>
          <Route path="/fitness-api" component={FitnessApiPage}/>
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin123456') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProvider>
          <ChatProvider>
            {/* System initializer and main application components */}
            <FitnessSystemInitializer />
            <Router />
            {/* Only show navigation for authenticated users */}
            {useAuth().isAuthenticated && <MainNavigation />}
            
            {/* Content with margin for sidebar when authenticated */}
            {useAuth().isAuthenticated && (
              <div style={{ marginLeft: '260px' }} className="p-4">
                {/* Additional content can go here */}
              </div>
            )}
            
            {/* Add the floating chatbot to all pages, according to MEGAPROMPT */}
            <MiniChatbot />
          </ChatProvider>
        </UserProvider>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

import { useState, useEffect } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import LandingPage from "@/pages/newlanding";
import BridgeLanding from "@/pages/BridgeLanding";
import FitnessTrackersPage from "@/pages/fitness-trackers";
import ApiStatusPage from "@/pages/api-status";
import AdminApiStatusPage from "@/pages/admin/api-status";
import DeploymentReadinessDashboard from "@/pages/admin/deployment-readiness";
import SystemAuditPage from "@/pages/system-audit";
import FitnessApiPage from "@/pages/fitness-api";
import ChatPage from "@/pages/chat";
import DashboardPage from "./pages/DashboardPage";
import AccessCodePage from "./pages/AccessCodePage";
import AdminPanelPage from "./pages/AdminPanelPage";
import BadgesPage from "./pages/BadgesPage";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import AboutPage from "./pages/about";
import ProgramsPage from "./pages/programs";
import ContactPage from "./pages/contact";
import FeaturesPage from "./pages/features";
import WorkoutHistoryPage from "./pages/workout-history";
import MealPlansPage from "./pages/meal-plans";
import GoalsPage from "./pages/goals";
import CommunityPage from "./pages/community";
import WorkoutRedirect from "./pages/WorkoutRedirect";
import WorkoutLibrary from "./pages/workout-library";
import WorkoutDetails from "./pages/workout-details/[id]";
// SuperAdmin pages imports
import SuperAdminQRLogin from "./pages/superadmin/SuperAdminQRLogin";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import MobileAuth from "./pages/superadmin/MobileAuth";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from "./contexts/ChatContext";
import FitnessSystemInitializer from "./components/FitnessSystemInitializer";
import MiniChatbot from "./components/MiniChatbot";
import MobileNavigation from "./components/MobileNavigation";
import MobileAppLoader from "./components/MobileAppLoader";

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
  History,
  Utensils,
  Target,
  Users,
  Settings as SettingsIcon,
  Award,
  Medal
} from 'lucide-react';
import { Button } from "@/components/ui/button";

// Auth context
import { createContext, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'admin' | 'manager' | 'user' | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  login: () => false,
  logout: () => {},
});

// Separar la definición de la exportación para evitar problemas con HMR
const useAuth = () => useContext(AuthContext);
export { useAuth };

// Main navigation for the app
function MainNavigation() {
  const { logout, userRole } = useAuth();
  
  return (
    <div className="fixed left-0 top-0 h-full w-[260px] z-40 bg-background shadow-lg border-r overflow-y-auto">
      <div className="flex items-center p-4 border-b">
        <Activity className="h-6 w-6 text-green-500 mr-2" />
        <h1 className="font-bold text-xl">
          Fitness AI
          {userRole === 'manager' && <span className="text-xs ml-2 bg-green-100 text-green-800 px-1 rounded">Admin Manager</span>}
          {userRole === 'admin' && <span className="text-xs ml-2 bg-blue-100 text-blue-800 px-1 rounded">Admin</span>}
        </h1>
      </div>
      
      <div className="p-2">
        {/* Panel de administración - solo visible para admin y manager */}
        {(userRole === 'admin' || userRole === 'manager') && (
          <div className="space-y-1 mb-6">
            <h3 className="text-xs font-medium px-3 py-2 text-green-500">Panel de Administración</h3>
            <Link href="/admin">
              <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent bg-black text-green-500">
                <LayoutDashboard className="h-5 w-5 mr-3" />
                <span>Admin Dashboard</span>
              </a>
            </Link>
            
            {userRole === 'manager' && (
              <>
                <Link href="/admin/platform-operations">
                  <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
                    <SettingsIcon className="h-5 w-5 mr-3" />
                    <span>Platform Operations</span>
                  </a>
                </Link>
                <Link href="/admin/membership-plans">
                  <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
                    <Award className="h-5 w-5 mr-3" />
                    <span>Membership Plans</span>
                  </a>
                </Link>
                <Link href="/admin/users">
                  <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
                    <Users className="h-5 w-5 mr-3" />
                    <span>User Management</span>
                  </a>
                </Link>
                <Link href="/admin/feature-toggles">
                  <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
                    <BarChart2 className="h-5 w-5 mr-3" />
                    <span>Feature Toggles</span>
                  </a>
                </Link>
                <Link href="/admin/system-integrity">
                  <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
                    <Activity className="h-5 w-5 mr-3" />
                    <span>System Integrity</span>
                  </a>
                </Link>
              </>
            )}
            
            <Link href="/admin/api-status">
              <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
                <FileDigit className="h-5 w-5 mr-3" />
                <span>API Status</span>
              </a>
            </Link>
            <Link href="/admin/deployment-readiness">
              <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
                <BarChart2 className="h-5 w-5 mr-3" />
                <span>Deployment Readiness</span>
              </a>
            </Link>
          </div>
        )}
      
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
          <Link href="/workout-history">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <History className="h-5 w-5 mr-3" />
              <span>Workout History</span>
            </a>
          </Link>
          <Link href="/badges">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <Medal className="h-5 w-5 mr-3" />
              <span>Insignias</span>
            </a>
          </Link>
          <Link href="/meal-plans">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <Utensils className="h-5 w-5 mr-3" />
              <span>Meal Plans</span>
            </a>
          </Link>
          <Link href="/goals">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <Target className="h-5 w-5 mr-3" />
              <span>Goals</span>
            </a>
          </Link>
          <Link href="/community">
            <a className="flex items-center px-3 py-2 rounded-md hover:bg-accent">
              <Users className="h-5 w-5 mr-3" />
              <span>Community</span>
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
        
        {userRole !== 'manager' && (
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
        )}
        
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
  const { isAuthenticated, userRole } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Check auth status and redirect if needed
  useEffect(() => {
    const publicRoutes = [
      '/landing', 
      '/bridge', 
      '/login',
      '/signup',
      '/about',
      '/programs',
      '/contact',
      '/features',
      '/access',
      '/workout',
      '/workout-library',
      '/superadmin',
      '/superadmin/mobile-auth'
    ];
    const isPublicRoute = publicRoutes.includes(location) || 
                          location.startsWith('/status/') || 
                          location.startsWith('/dashboard/') ||
                          location === '/dashboard' ||
                          location.startsWith('/workout') ||
                          location.startsWith('/workout-details/');
                          
    // Redirigir a login si no está autenticado y la ruta no es pública
    if (!isAuthenticated && !isPublicRoute) {
      setLocation('/bridge');
      return;
    }
    
    // Verificar permisos específicos para administradores
    if (isAuthenticated && location.startsWith('/admin/')) {
      // Restringir acceso a rutas financieras para Admin Managers
      const restrictedRoutesForManagers = [
        '/admin/billing',
        '/admin/payments',
        '/admin/financial',
        '/admin/bank',
        '/admin/revenue'
      ];
      
      if (userRole === 'manager' && restrictedRoutesForManagers.some(route => location.startsWith(route))) {
        console.log(`[ADMIN SECURITY] Manager attempted to access restricted financial route: ${location}`);
        setLocation('/admin');
        return;
      }
    }
  }, [isAuthenticated, userRole, location, setLocation]);
  
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/landing" component={LandingPage} />
      <Route path="/bridge" component={BridgeLanding} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/programs" component={ProgramsPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/features" component={FeaturesPage} />
      
      {/* New Routes - User Journey */}
      <Route path="/access" component={AccessCodePage} />
      <Route path="/dashboard/:code" component={DashboardPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/admin" component={AdminPanelPage} />
      <Route path="/workout" component={WorkoutRedirect} />
      <Route path="/workout-library" component={WorkoutLibrary} />
      <Route path="/workout-details/:id" component={WorkoutDetails} />
      
      {/* SuperAdmin routes */}
      <Route path="/superadmin" component={SuperAdminQRLogin} />
      <Route path="/superadmin/dashboard" component={SuperAdminDashboard} />
      <Route path="/superadmin/mobile-auth" component={MobileAuth} />
      
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
          <Route path="/workout-history" component={WorkoutHistoryPage}/>
          <Route path="/badges" component={BadgesPage}/>
          <Route path="/meal-plans" component={MealPlansPage}/>
          <Route path="/goals" component={GoalsPage}/>
          <Route path="/community" component={CommunityPage}/>
          <Route path="/api-status" component={ApiStatusPage}/>
          <Route path="/agent-status" component={SystemAuditPage}/>
          <Route path="/fitness-api" component={FitnessApiPage}/>
          
          {/* Admin routes */}
          <Route path="/admin/api-status" component={AdminApiStatusPage}/>
          <Route path="/admin/billing" component={ApiStatusPage}/>
          <Route path="/admin/deployment-readiness" component={DeploymentReadinessDashboard}/>
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'admin' | 'manager' | 'user' | null>(null);
  
  // Función para registrar la actividad del administrador
  const logAdminActivity = (activity: string) => {
    console.log(`[ADMIN LOG] ${new Date().toISOString()}: ${activity}`);
    // En un escenario real, esto enviaría los datos a un endpoint de API
    // para almacenar en una base de datos y posiblemente notificar al SuperAdmin
  };
  
  const login = (username: string, password: string): boolean => {
    // Check if it's the standard admin manager account
    if (username === 'admin' && password === 'Admin3082#') {
      setIsAuthenticated(true);
      setUserRole('manager');
      logAdminActivity(`Admin Manager login: ${username}`);
      return true;
    }
    
    // Check if it's the regular admin account (legacy)
    if (username === 'admin' && password === 'admin123456') {
      setIsAuthenticated(true);
      setUserRole('admin');
      return true;
    }
    
    // Check if it's the demo account (case insensitive username for better UX)
    if (username.toLowerCase() === 'demo' && password === 'demo123') {
      setIsAuthenticated(true);
      setUserRole('user');
      return true;
    }
    
    // Check if it's the test user account
    if (username === 'testuser' && password === 'password') {
      setIsAuthenticated(true);
      setUserRole('user');
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    if (userRole === 'manager') {
      logAdminActivity(`Admin Manager logout`);
    }
    setIsAuthenticated(false);
    setUserRole(null);
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <AuthProvider>
          <UserProvider>
            <ChatProvider>
              {/* App Loading Screen for Mobile */}
              <MobileAppLoader />
              
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
              
              {/* Add mobile navigation for responsive design */}
              <MobileNavigation />
            </ChatProvider>
          </UserProvider>
        </AuthProvider>
        <Toaster />
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;

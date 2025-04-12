import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import MobileSidebar from "./MobileSidebar";
import FloatingVoiceButton from "./FloatingVoiceButton";
import Footer from "./Footer";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function FitnessAI() {
  // Create fallback for when UserContext isn't available
  let user = null;
  let isAuthenticated = false;
  let login: (username: string, password: string) => Promise<void> = 
    async (username, password) => {
      console.log("Login fallback called with:", username, password);
    };
  let loading = false;
  
  try {
    const userContext = useUser();
    user = userContext.user;
    isAuthenticated = userContext.isAuthenticated;
    login = userContext.login;
    loading = userContext.loading;
  } catch (error) {
    console.warn("FitnessAI: UserContext not available, using fallback");
  }
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoginLoading(true);
      await login(username, password);
    } catch (error) {
      // Error is handled in the UserContext
    } finally {
      setLoginLoading(false);
    }
  };

  // Mock login for demo purposes
  const handleDemoLogin = async () => {
    try {
      setLoginLoading(true);
      // Create a demo user if it doesn't exist yet
      const checkUser = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "demo",
          password: "demo123",
          name: "Alex",
          language: "en",
        }),
      }).catch(() => null);
      
      // Log in with demo credentials
      await login("demo", "demo123");
    } catch (error) {
      // Error is handled in UserContext
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <svg className="h-12 w-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.73 12.02l3.98-3.98c.39-.39.39-1.02 0-1.41l-4.34-4.34c-.39-.39-1.02-.39-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63c-.39.39-.39 1.02 0 1.41l3.98 3.98L2.25 16c-.39.39-.39 1.02 0 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.39.39 1.02.39 1.41 0l4.34-4.34c.39-.39.39-1.02 0-1.41l-3.98-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2.66 9.34l-3.63-3.62 3.63-3.63 3.62 3.63-3.62 3.62z"/>
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Fitness AI
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your personal fitness coach powered by Gemini 1.5
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDemoLogin}
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                        Loading demo...
                      </div>
                    ) : (
                      "Use demo account"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ChatArea />
      </div>
      <Footer />
      <MobileSidebar />
      <FloatingVoiceButton />
    </div>
  );
}

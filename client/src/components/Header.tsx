import { useState } from "react";
import { Link } from "wouter";
import LanguageSwitcher from "./LanguageSwitcher";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Activity, Volume2, CloudCog, Gauge, Dumbbell } from "lucide-react";

export default function Header() {
  const { user, logout } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm py-3 px-4 border-b border-gray-200 flex justify-between items-center">
      <div className="flex items-center">
        <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.73 12.02l3.98-3.98c.39-.39.39-1.02 0-1.41l-4.34-4.34c-.39-.39-1.02-.39-1.41 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.25 0-.51.1-.7.29L2.25 6.63c-.39.39-.39 1.02 0 1.41l3.98 3.98L2.25 16c-.39.39-.39 1.02 0 1.41l4.34 4.34c.39.39 1.02.39 1.41 0l3.98-3.98 3.98 3.98c.39.39 1.02.39 1.41 0l4.34-4.34c.39-.39.39-1.02 0-1.41l-3.98-3.98zM12 9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-4.71 1.96L3.66 7.34l3.63-3.63 3.62 3.62-3.62 3.63zM10 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2.66 9.34l-3.63-3.62 3.63-3.63 3.62 3.63-3.62 3.62z"/>
        </svg>
        <h1 className="ml-2 text-xl font-bold text-neutral-800">Fitness AI</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/fitness-trackers" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
          <Activity className="h-4 w-4 mr-1" />
          Devices
        </Link>
        <Link href="/voice-coaching" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
          <Volume2 className="h-4 w-4 mr-1" />
          Voice Coach
        </Link>
        
        <Link href="/api-status" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
          <CloudCog className="h-4 w-4 mr-1" />
          APIs
        </Link>
        
        <Link href="/agent-status" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
          <Gauge className="h-4 w-4 mr-1" />
          System
        </Link>
        
        <Link href="/fitness-api" className="flex items-center text-sm font-medium hover:text-primary transition-colors">
          <Dumbbell className="h-4 w-4 mr-1" />
          Fitness API
        </Link>
        
        <LanguageSwitcher />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <span className="text-sm font-medium mr-2 hidden md:block">
                {user?.name || user?.username || "User"}
              </span>
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                <span className="font-medium text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/fitness-trackers">
                <Activity className="h-4 w-4 mr-2" />
                Fitness Devices
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/voice-coaching">
                <Volume2 className="h-4 w-4 mr-2" />
                Voice Coaching
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/api-status">
                <CloudCog className="h-4 w-4 mr-2" />
                API Status
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/agent-status">
                <Gauge className="h-4 w-4 mr-2" />
                System Audit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/fitness-api">
                <Dumbbell className="h-4 w-4 mr-2" />
                Fitness API
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

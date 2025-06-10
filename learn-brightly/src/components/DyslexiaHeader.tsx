import React, { useState } from 'react';
import { BookOpen, Settings, Volume2, VolumeX, LogOut, User, Bell, Moon, Sun, HelpCircle } from 'lucide-react';
import IconButton from './IconButton';
import TextStyleSettings from './TextStyleSettings';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "./sheet";
import { Button } from './button';
import { Switch } from './switch';
import { Label } from './label';

const DyslexiaHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user;
  };

  // Don't show header on auth page
  if (location.pathname === '/') {
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show success message
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    
    // Redirect to login page
    navigate('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: isDarkMode ? "Light mode enabled" : "Dark mode enabled",
      description: `Switched to ${isDarkMode ? 'light' : 'dark'} mode.`,
    });
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast({
      title: notificationsEnabled ? "Notifications disabled" : "Notifications enabled",
      description: `Notifications have been ${notificationsEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <header className="bg-pastel-blue py-4 px-6 rounded-b-2xl shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-primary animate-float" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">Learn Brightly</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            className="p-2 rounded-full bg-pastel-yellow hover:bg-amber-200 transition-colors"
            title="Read page aloud"
          >
            <Volume2 className="h-6 w-6" />
          </button>
          <TextStyleSettings />
          <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-full bg-pastel-purple hover:bg-purple-200 transition-colors">
                <Settings className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="text-2xl flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Settings
                </SheetTitle>
                <SheetDescription>
                  Customize your learning experience
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={isDarkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      <Label htmlFor="notifications">Notifications</Label>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={toggleNotifications}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-between"
                    onClick={() => navigate('/profile')}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <span>Profile Settings</span>
                    </div>
                    <span className="text-gray-500">→</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-between"
                    onClick={() => navigate('/help')}
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      <span>Help & Support</span>
                    </div>
                    <span className="text-gray-500">→</span>
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-between"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </div>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <button 
            onClick={handleLogout}
            className="p-2 rounded-full bg-pastel-peach hover:bg-orange-200 transition-colors"
            title="Logout"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DyslexiaHeader;

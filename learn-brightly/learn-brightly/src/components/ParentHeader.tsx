import React, { useState, useEffect } from 'react';
import { BookOpen, Settings, LogOut, User, Bell, Moon, Sun, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const ParentHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true';
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Apply dark mode on mount and when it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast({
      title: notificationsEnabled ? "Notifications disabled" : "Notifications enabled",
      description: notificationsEnabled ? "You won't receive notifications" : "You will receive notifications",
    });
  };

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('user');
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    return !!user;
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

  return (
    <header className="bg-pastel-blue py-4 px-6 rounded-b-2xl shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-primary animate-float" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
            Learn Brightly
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Removed text-to-speech button and text styling button for parent dashboard */}
          <Link 
            to="/profile"
            className="p-2 rounded-full bg-pastel-green hover:bg-green-200 transition-colors"
            title="Profile"
          >
            <User className="h-6 w-6" />
          </Link>
          <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 rounded-full bg-pastel-purple hover:bg-purple-200 transition-colors">
                <Settings className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="text-2xl flex items-center gap-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                  <Settings className="h-6 w-6" />
                  Settings
                </SheetTitle>
                <SheetDescription style={{ fontFamily: 'Arial, sans-serif' }}>
                  Customize your learning experience
                </SheetDescription>
              </SheetHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general" style={{ fontFamily: 'Arial, sans-serif' }}>General</TabsTrigger>
                  <TabsTrigger value="help" style={{ fontFamily: 'Arial, sans-serif' }}>Help</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        <Label htmlFor="dark-mode" style={{ fontFamily: 'Arial, sans-serif' }}>Dark Mode</Label>
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
                        <Label htmlFor="notifications" style={{ fontFamily: 'Arial, sans-serif' }}>Notifications</Label>
                      </div>
                      <Switch
                        id="notifications"
                        checked={notificationsEnabled}
                        onCheckedChange={toggleNotifications}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="help" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-between"
                      onClick={() => navigate('/help-support')}
                      style={{ fontFamily: 'Arial, sans-serif' }}
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        <span>Help & Support</span>
                      </div>
                      <span className="text-gray-500">→</span>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="pt-4 border-t mt-6">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-between text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </div>
                </Button>
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

export default ParentHeader;

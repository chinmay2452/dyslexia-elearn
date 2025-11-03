import React, { useState, useEffect } from 'react';
import { BookOpen, Settings, Volume2, LogOut, User, Bell, Moon, Sun, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Button } from './button';
import { Switch } from './switch';
import { Label } from './label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import TextStyleSettings from './TextStyleSettings';
import { supabase } from '../../integrations/supabase/client'; // ✅ Import Supabase client

const DyslexiaHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Redirect unauthenticated users safely
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/') {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // ✅ Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    setTimeout(() => {
      toast({
        title: newState ? "Notifications enabled" : "Notifications disabled",
        description: newState
          ? "You will receive notifications."
          : "You won't receive notifications.",
      });
    }, 0);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('user');
      navigate('/');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "Something went wrong during logout.",
      });
    }
  };

  // ✅ Hide header on login/signup page
  if (location.pathname === '/') return null;

  return (
    <header className="bg-pastel-blue py-4 px-6 rounded-b-2xl shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-primary animate-float" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">Learn Brightly</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            className="p-2 rounded-full bg-pastel-yellow hover:bg-amber-200 transition-colors"
            title="Read page aloud"
          >
            <Volume2 className="h-6 w-6" />
          </button>

          <TextStyleSettings />

          <Link 
            to="/profile"
            className="p-2 rounded-full bg-pastel-green hover:bg-green-200 transition-colors"
            title="Profile"
          >
            <User className="h-6 w-6" />
          </Link>

          {/* Settings */}
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
                <SheetDescription>Customize your learning experience</SheetDescription>
              </SheetHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="help">Help</TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                      </div>
                      <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        <Label htmlFor="notifications">Notifications</Label>
                      </div>
                      <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={toggleNotifications} />
                    </div>
                  </div>
                </TabsContent>

                {/* Help Settings */}
                <TabsContent value="help" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-between"
                      onClick={() => navigate('/help-support')}
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
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </div>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Quick Logout */}
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
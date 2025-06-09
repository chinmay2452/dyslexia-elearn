import React from 'react';
import { BookOpen, Settings, Volume2, VolumeX, LogOut } from 'lucide-react';
import IconButton from './IconButton';
import TextStyleSettings from './TextStyleSettings';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const DyslexiaHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
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
          <button className="p-2 rounded-full bg-pastel-purple hover:bg-purple-200 transition-colors">
            <Settings className="h-6 w-6" />
          </button>
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

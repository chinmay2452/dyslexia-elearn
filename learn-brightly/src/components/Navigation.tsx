import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Puzzle, User, Info, HelpCircle } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Check if user is authenticated and has completed the test
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user;
  };

  // Don't show navigation on auth page or test page
  if (location.pathname === '/' || location.pathname === '/dyslexia-test') {
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    navigate('/');
    return null;
  }
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-pastel-blue py-2 px-4 rounded-t-2xl shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex justify-around items-center">
        <Link to="/dashboard" className={`flex flex-col items-center p-2 ${isActive('/dashboard') ? 'bg-white/30 rounded-xl' : ''}`}>
          <Home className={`h-6 w-6 ${isActive('/dashboard') ? 'text-primary' : ''}`} />
          <span className="text-xs font-bold mt-1">Home</span>
        </Link>
        
        <Link to="/reading" className={`flex flex-col items-center p-2 ${isActive('/reading') ? 'bg-white/30 rounded-xl' : ''}`}>
          <BookOpen className={`h-6 w-6 ${isActive('/reading') ? 'text-primary' : ''}`} />
          <span className="text-xs font-bold mt-1">Reading</span>
        </Link>
        
        <Link to="/games" className={`flex flex-col items-center p-2 ${isActive('/games') ? 'bg-white/30 rounded-xl' : ''}`}>
          <Puzzle className={`h-6 w-6 ${isActive('/games') ? 'text-primary' : ''}`} />
          <span className="text-xs font-bold mt-1">Games</span>
        </Link>
        
        <Link to="/dyslexia" className={`flex flex-col items-center p-2 ${isActive('/dyslexia') ? 'bg-white/30 rounded-xl' : ''}`}>
          <Info className={`h-6 w-6 ${isActive('/dyslexia') ? 'text-primary' : ''}`} />
          <span className="text-xs font-bold mt-1">Dyslexia</span>
        </Link>
        
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex flex-col items-center p-2 ${isActive('/profile') || isActive('/help-support') ? 'bg-white/30 rounded-xl' : ''}`}
          >
            <User className={`h-6 w-6 ${isActive('/profile') || isActive('/help-support') ? 'text-primary' : ''}`} />
            <span className="text-xs font-bold mt-1">Profile</span>
          </button>
          
          {showProfileMenu && (
            <div className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-lg py-2 w-48">
              <Link 
                to="/profile" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowProfileMenu(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
              <Link 
                to="/help-support" 
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowProfileMenu(false)}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

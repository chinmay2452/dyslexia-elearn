import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Puzzle, User, Info, HelpCircle, Users } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('student');
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || 'student');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);
  
  // Check if user is authenticated and has completed the test
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user;
  };

  // Don't show navigation on auth page, test page, or user type page
  if (location.pathname === '/' || location.pathname === '/auth' || location.pathname === '/dyslexia-test') {
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

  // Different navigation for parents vs students
  if (userRole === 'parent') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-pastel-blue py-2 px-4 rounded-t-2xl shadow-lg z-50">
        <div className="max-w-6xl mx-auto flex justify-around items-center">
          <Link to="/parentdashboard" className={`flex flex-col items-center p-2 ${isActive('/parentdashboard') ? 'bg-white/30 rounded-xl' : ''}`}>
            <Home className={`h-6 w-6 ${isActive('/parentdashboard') ? 'text-primary' : ''}`} />
            <span className="text-xs font-bold mt-1">Dashboard</span>
          </Link>
          
          <Link to="/dyslexia" className={`flex flex-col items-center p-2 ${isActive('/dyslexia') ? 'bg-white/30 rounded-xl' : ''}`}>
            <Info className={`h-6 w-6 ${isActive('/dyslexia') ? 'text-primary' : ''}`} />
            <span className="text-xs font-bold mt-1">Dyslexia</span>
          </Link>
          
          <Link to="/help-support" className={`flex flex-col items-center p-2 ${isActive('/help-support') ? 'bg-white/30 rounded-xl' : ''}`}>
            <HelpCircle className={`h-6 w-6 ${isActive('/help-support') ? 'text-primary' : ''}`} />
            <span className="text-xs font-bold mt-1">Help</span>
          </Link>

          <Link to="/profile" className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'bg-white/30 rounded-xl' : ''}`}>
            <User className={`h-6 w-6 ${isActive('/profile') ? 'text-primary' : ''}`} />
            <span className="text-xs font-bold mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Default navigation for students
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

        <Link to="/profile" className={`flex flex-col items-center p-2 ${isActive('/profile') ? 'bg-white/30 rounded-xl' : ''}`}>
          <User className={`h-6 w-6 ${isActive('/profile') ? 'text-primary' : ''}`} />
          <span className="text-xs font-bold mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;

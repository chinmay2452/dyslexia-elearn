import React, { useEffect, useState } from 'react';
import { Button } from "../components/button";
import { Link, useNavigate } from "react-router-dom";
import DyslexiaHeader from '../components/DyslexiaHeader';
import ProgressTracker from '../components/ProgressTracker';
import LearningCategories from '../components/LearningCategories';
import LearningModules from '../components/LearningModules';
import { Lightbulb, Book, Puzzle, User, ClipboardCheck } from 'lucide-react';
import AnimatedIcon from '../components/AnimatedIcon';
import ReadingText from '../components/ReadingText';
import { useToast } from "../hooks/use-toast";

interface UserData {
  username: string;
  email: string;
  role: string;
  dyslexiaScore?: number;
  lastTestDate?: string;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user is a parent to apply normal font styling
  const isParent = userData?.role === 'parent';

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('user');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (!storedUser) {
      navigate('/');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setUserData({
        username: user.full_name || user.fullName || 'User',
        email: user.email || '',
        role: user.role || 'student',
        dyslexiaScore: user.dyslexia_score,
        lastTestDate: user.lastTestDate
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-blue/30 pb-24" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
      <DyslexiaHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="bg-pastel-peach rounded-2xl p-6 mb-8 shadow-lg flex flex-col md:flex-row items-center gap-6 animate-pop">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>Welcome back, {userData?.username || 'User'}!</h1>
            {isParent ? (
              <p className="text-lg mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                Ready to continue your learning adventure? 
                We've got some fun activities just for you today!
              </p>
            ) : (
              <ReadingText size="lg">
                Ready to continue your learning adventure? 
                We've got some fun activities just for you today!
              </ReadingText>
            )}
            <div className="flex flex-wrap gap-3 mt-4">
              <Link to="/reading">
                <Button className="rounded-xl py-6 px-6 text-lg font-bold shadow-md hover:shadow-lg flex items-center gap-2" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
                  <Book className="h-5 w-5" /> Continue Reading
                </Button>
              </Link>
              <Link to="/games">
                <Button variant="outline" className="rounded-xl py-6 px-6 text-lg font-bold shadow-md hover:shadow-lg flex items-center gap-2" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
                  <Puzzle className="h-5 w-5" /> Play Games
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <AnimatedIcon animation="float" size="xl" className="text-8xl">
              <Lightbulb className="text-amber-500 h-24 w-24" />
            </AnimatedIcon>
          </div>
        </div>
        
        {/* Dyslexia Test Banner */}
        <div className="bg-pastel-purple/80 rounded-2xl p-6 mb-8 shadow-lg animate-pop">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2 text-white">Dyslexia Screening Test</h2>
              {userData?.dyslexiaScore !== undefined ? (
                <div className="mb-4">
                  <ReadingText className="text-white opacity-90">
                    Your last test score: <span className="font-bold">{userData.dyslexiaScore}%</span>
                    {userData.lastTestDate && (
                      <span className="text-sm ml-2">
                        (Taken on {new Date(userData.lastTestDate).toLocaleDateString()})
                      </span>
                    )}
                  </ReadingText>
                </div>
              ) : (
                <ReadingText className="text-white opacity-90 mb-4">
                  Take our quick screening test to check if you show signs of dyslexia. 
                  It only takes about 5 minutes to complete!
                </ReadingText>
              )}
              <Link to="/test">
                <Button className="bg-white text-pastel-purple hover:bg-gray-100 rounded-xl py-5 px-6 text-lg font-bold shadow-md hover:shadow-lg flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" /> 
                  {userData?.dyslexiaScore !== undefined ? 'Retake Test' : 'Take Dyslexia Test'}
                </Button>
              </Link>
            </div>
            <div className="w-full md:w-1/4 flex justify-center">
              <AnimatedIcon animation="bounce" size="lg">
                <ClipboardCheck className="text-white h-20 w-20" />
              </AnimatedIcon>
            </div>
          </div>
        </div>
        
        {/* Progress Section */}
        <ProgressTracker />
        
        {/* Categories */}
        <LearningCategories />
        
        {/* Learning Modules */}
        <LearningModules />
        
        {/* Tips Section */}
        <div className="bg-pastel-green rounded-2xl p-6 mt-8 shadow-md">
          <h2 className="text-xl font-bold mb-2">Reading Tip of the Day</h2>
          <ReadingText>
            Try using a ruler or bookmark under each line as you read. 
            This helps your eyes focus on one line at a time!
          </ReadingText>
        </div>
      </main>
      
      <footer className="bg-pastel-purple mt-12 py-6 rounded-t-2xl">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="font-bold">Learn Brightly - Making learning fun for everyone!</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

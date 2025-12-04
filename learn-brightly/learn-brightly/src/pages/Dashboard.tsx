import React, { useEffect, useState } from 'react';
import supabase from '../../supabase';
import { Button } from "../components/button";
import { Link, useNavigate } from "react-router-dom";
import DyslexiaHeader from '../components/DyslexiaHeader';
import ProgressTracker from '../components/ProgressTracker';
import LearningCategories from '../components/LearningCategories';
import LearningModules from '../components/LearningModules';
import { Lightbulb, Book, Puzzle, ClipboardCheck } from 'lucide-react';
import AnimatedIcon from '../components/AnimatedIcon';
import ReadingText from '../components/ReadingText';


interface UserData {
  username: string;
  email: string;
  role: string;
  dyslexiaScore?: number;
  lastTestDate?: string;
  studentCode?: string;
  xp?: number;
  streak?: number;
  gamesPlayed?: number;
  storiesRead?: number;
}

const Index = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const navigate = useNavigate();

  // Check if user is a parent to apply normal font styling
  const isParent = userData?.role === 'parent';



  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/');
      return;
    }

    const fetchUserAndScore = async () => {
      try {
        const user = JSON.parse(storedUser);

        // Fetch fresh user data including student_code
        const { data: freshUserData } = await supabase
          .from('users')
          .select('student_code')
          .eq('id', user.id)
          .single();

        // Fetch score from Supabase
        const { data: scores } = await supabase
          .from('dyslexia_score')
          .select('score, created_at')
          .eq('user', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        // Fetch user progress
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const latestScore = scores && scores.length > 0 ? scores[0] : null;

        setUserData({
          username: user.full_name || user.fullName || 'User',
          email: user.email || '',
          role: user.role || 'student',
          dyslexiaScore: latestScore ? latestScore.score : undefined,
          lastTestDate: latestScore ? latestScore.created_at : undefined,
          studentCode: freshUserData?.student_code,
          xp: progress?.xp || 0,
          streak: progress?.streak || 0,
          gamesPlayed: progress?.games_played || 0,
          storiesRead: progress?.stories_read || 0
        });
      } catch (error) {
        console.error('Error parsing user data or fetching score:', error);
        localStorage.removeItem('user');
        navigate('/');
      }
    };

    fetchUserAndScore();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-blue/30 pb-24" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
      <DyslexiaHeader />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="bg-pastel-peach rounded-2xl p-6 mb-8 shadow-lg flex flex-col md:flex-row items-center gap-6 animate-pop">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>Welcome back, {userData?.username || 'User'}!</h1>

            {userData?.studentCode && (
              <div className="mb-4 bg-white/50 p-3 rounded-xl inline-block">
                <p className="text-sm font-semibold text-gray-600">Your Student Code:</p>
                <p className="text-2xl font-bold text-pastel-purple tracking-widest">{userData.studentCode}</p>
                <p className="text-xs text-gray-500">Share this code with your parent to link accounts</p>
              </div>
            )}

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
              <Link to="/dyslexia-test">
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
        <ProgressTracker
          xp={userData?.xp || 0}
          streak={userData?.streak || 0}
          gamesPlayed={userData?.gamesPlayed || 0}
          storiesRead={userData?.storiesRead || 0}
        />

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

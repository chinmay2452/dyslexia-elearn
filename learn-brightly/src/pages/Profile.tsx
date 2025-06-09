import React, { useEffect, useState } from 'react';
import DyslexiaHeader from '../components/DyslexiaHeader';
import { User, Award, BookOpen, Settings, Bell, Puzzle, Calendar } from 'lucide-react';
import { Button } from "../components/button";
import ReadingText from '../components/ReadingText';
import AnimatedIcon from '../components/AnimatedIcon';
import { useNavigate } from 'react-router-dom';

interface UserData {
  username: string;
  email: string;
  age: string;
  guardianName: string;
  role: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-purple/30 pb-24">
      <DyslexiaHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-pastel-blue rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-white/70 rounded-full flex justify-center items-center shadow-md">
              <User className="h-16 w-16 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{userData?.username || 'Loading...'}</h1>
              <div className="space-y-1">
                <p className="text-lg flex items-center gap-2">
                  <span className="font-semibold">Age:</span>
                  <span>{userData?.age || 'Not set'}</span>
                </p>
                <p className="text-lg flex items-center gap-2">
                  <span className="font-semibold">Guardian:</span>
                  <span>{userData?.guardianName || 'Not set'}</span>
                </p>
                <p className="text-lg flex items-center gap-2">
                  <span className="font-semibold">Email:</span>
                  <span>{userData?.email || 'Not set'}</span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="bg-pastel-yellow px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" /> New Learner
                </span>
                <span className="bg-pastel-green px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <Puzzle className="h-4 w-4 mr-1" /> Getting Started
                </span>
                <span className="bg-pastel-pink px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> Day 1
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-pastel-green rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Award className="mr-2" /> Your Achievements
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/50 rounded-lg p-3 text-center opacity-50">
                <Award className="h-10 w-10 text-gray-400 mx-auto" />
                <div className="mt-2 text-sm font-bold">Reading Pro</div>
              </div>
              <div className="bg-white/50 rounded-lg p-3 text-center opacity-50">
                <Award className="h-10 w-10 text-gray-400 mx-auto" />
                <div className="mt-2 text-sm font-bold">Spelling Bee</div>
              </div>
              <div className="bg-white/50 rounded-lg p-3 text-center opacity-50">
                <Award className="h-10 w-10 text-gray-400 mx-auto" />
                <div className="mt-2 text-sm font-bold">Word Master</div>
              </div>
              <div className="bg-white/50 rounded-lg p-3 text-center opacity-50">
                <Award className="h-10 w-10 text-gray-400 mx-auto" />
                <div className="mt-2 text-sm font-bold">Story Maker</div>
              </div>
              <div className="bg-white/50 rounded-lg p-3 text-center opacity-50">
                <Award className="h-10 w-10 text-gray-400 mx-auto" />
                <div className="mt-2 text-sm font-bold">Game Wizard</div>
              </div>
              <div className="bg-white/50 rounded-lg p-3 text-center opacity-50">
                <Award className="h-10 w-10 text-gray-400 mx-auto" />
                <div className="mt-2 text-sm font-bold">Math Hero</div>
              </div>
            </div>
          </div>
          
          <div className="bg-pastel-yellow rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Calendar className="mr-2" /> Weekly Progress
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold">Reading Time</span>
                  <span className="text-sm font-bold">0 hours</span>
                </div>
                <div className="w-full bg-white/50 h-4 rounded-full">
                  <div className="bg-blue-500 h-4 rounded-full w-0"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold">Games Completed</span>
                  <span className="text-sm font-bold">0/15</span>
                </div>
                <div className="w-full bg-white/50 h-4 rounded-full">
                  <div className="bg-pink-500 h-4 rounded-full w-0"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold">New Words Learned</span>
                  <span className="text-sm font-bold">0/20</span>
                </div>
                <div className="w-full bg-white/50 h-4 rounded-full">
                  <div className="bg-green-500 h-4 rounded-full w-0"></div>
                </div>
              </div>
            </div>
            
            <Button className="w-full mt-6 rounded-xl">View Full Report</Button>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="bg-white/70 rounded-xl p-6 shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg">
              <div className="flex items-center">
                <Settings className="mr-3" />
                <span className="font-bold">Reading Preferences</span>
              </div>
              <Button variant="outline" size="default">Adjust</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg">
              <div className="flex items-center">
                <Bell className="mr-3" />
                <span className="font-bold">Notifications</span>
              </div>
              <Button variant="outline" size="default">Manage</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg">
              <div className="flex items-center">
                <User className="mr-3" />
                <span className="font-bold">Account Settings</span>
              </div>
              <Button variant="outline" size="default">Edit</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

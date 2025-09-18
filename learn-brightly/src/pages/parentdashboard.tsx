import React, { useEffect, useState } from 'react';
import { Button } from "../components/button";
import { Link, useNavigate } from "react-router-dom";
import ParentHeader from '../components/ParentHeader';
import { Lightbulb, Book, Puzzle, User, ClipboardCheck, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { useToast } from "../hooks/use-toast";

interface ParentData {
  username: string;
  email: string;
  role: string;
  children: string[];
}

interface ChildProgress {
  id: string;
  username: string;
  dyslexiaScore?: number;
  lastTestDate?: string;
  readingProgress?: number;
  gamesCompleted?: number;
}

const ParentDashboard: React.FC = () => {
  const [parentData, setParentData] = useState<ParentData | null>(null);
  const [childrenProgress, setChildrenProgress] = useState<ChildProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Call logout endpoint on server
      if (token) {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
          return;
        }

        const userData = JSON.parse(storedUser);
        if (userData.role !== 'parent') {
          navigate('/dashboard');
          return;
        }

        // Fetch parent data
        const userResponse = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
            return;
          }
          throw new Error('Failed to fetch parent data');
        }

        const responseData = await userResponse.json();
        setParentData(responseData.user);

        // Fetch children progress if any children exist
        if (responseData.user.children && responseData.user.children.length > 0) {
          const childrenData = await Promise.all(
            responseData.user.children.map(async (childId: string) => {
              try {
                const scoreResponse = await fetch(`http://localhost:5000/api/auth/dyslexia-score?userId=${childId}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });

                if (scoreResponse.ok) {
                  const scoreData = await scoreResponse.json();
                  return {
                    id: childId,
                    username: `Child ${childId.slice(-4)}`, // Show last 4 chars of ID
                    dyslexiaScore: scoreData.score,
                    lastTestDate: scoreData.lastTestDate,
                    readingProgress: Math.floor(Math.random() * 100), // Mock data for now
                    gamesCompleted: Math.floor(Math.random() * 20) // Mock data for now
                  };
                }
                return null;
              } catch (error) {
                console.error('Error fetching child data:', error);
                return null;
              }
            })
          );

          setChildrenProgress(childrenData.filter(Boolean));
        }

      } catch (error) {
        console.error('Error fetching parent data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchParentData();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A38BFE] mx-auto mb-4"></div>
          <p className="text-[#666]" style={{ fontFamily: 'Arial, sans-serif' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!parentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <ParentHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#444] mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                Welcome back, {parentData.username}! 👋
              </h1>
              <p className="text-[#666] text-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
                Monitor your children's learning progress and achievements
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2" style={{ fontFamily: 'Arial, sans-serif' }}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#666] text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>Total Children</p>
                <p className="text-3xl font-bold text-[#A38BFE]" style={{ fontFamily: 'Arial, sans-serif' }}>{childrenProgress.length}</p>
              </div>
              <Users className="w-8 h-8 text-[#A38BFE]" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#666] text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>Tests Completed</p>
                <p className="text-3xl font-bold text-[#A38BFE]" style={{ fontFamily: 'Arial, sans-serif' }}>
                  {childrenProgress.filter(child => child.dyslexiaScore !== null).length}
                </p>
              </div>
              <ClipboardCheck className="w-8 h-8 text-[#A38BFE]" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#666] text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>Games Played</p>
                <p className="text-3xl font-bold text-[#A38BFE]" style={{ fontFamily: 'Arial, sans-serif' }}>
                  {childrenProgress.reduce((total, child) => total + (child.gamesCompleted || 0), 0)}
                </p>
              </div>
              <Puzzle className="w-8 h-8 text-[#A38BFE]" />
            </div>
          </div>
        </div>

        {/* Children Progress */}
        {childrenProgress.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-[#444] mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>Children's Progress</h2>
            <div className="space-y-4">
              {childrenProgress.map((child) => (
                <div key={child.id} className="border border-[#ECECEC] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>{child.username}</h3>
                    <span className="text-sm text-[#666]" style={{ fontFamily: 'Arial, sans-serif' }}>
                      Last updated: {child.lastTestDate ? new Date(child.lastTestDate).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-[#666]" style={{ fontFamily: 'Arial, sans-serif' }}>Dyslexia Score</p>
                      <p className="text-xl font-bold text-[#A38BFE]" style={{ fontFamily: 'Arial, sans-serif' }}>
                        {child.dyslexiaScore !== null ? `${child.dyslexiaScore}%` : 'Not tested'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[#666]" style={{ fontFamily: 'Arial, sans-serif' }}>Reading Progress</p>
                      <p className="text-xl font-bold text-[#A38BFE]" style={{ fontFamily: 'Arial, sans-serif' }}>{child.readingProgress}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[#666]" style={{ fontFamily: 'Arial, sans-serif' }}>Games Completed</p>
                      <p className="text-xl font-bold text-[#A38BFE]" style={{ fontFamily: 'Arial, sans-serif' }}>{child.gamesCompleted}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Users className="w-16 h-16 text-[#A38BFE] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#444] mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>No Children Added Yet</h3>
            <p className="text-[#666] mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>
              You haven't added any children to your account yet. 
              Children will be automatically linked when they sign up with your email as their guardian.
            </p>
            <Button className="bg-[#A38BFE] hover:bg-[#8B7AFE]" style={{ fontFamily: 'Arial, sans-serif' }}>
              Learn More
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#444] mb-6" style={{ fontFamily: 'Arial, sans-serif' }}>Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/dyslexia" className="block">
              <div className="border border-[#ECECEC] rounded-xl p-4 text-center hover:border-[#A38BFE] transition-colors">
                <Book className="w-8 h-8 text-[#A38BFE] mx-auto mb-2" />
                <p className="font-medium text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Learn About Dyslexia</p>
              </div>
            </Link>
            
            <Link to="/help-support" className="block">
              <div className="border border-[#ECECEC] rounded-xl p-4 text-center hover:border-[#A38BFE] transition-colors">
                <Lightbulb className="w-8 h-8 text-[#A38BFE] mx-auto mb-2" />
                <p className="font-medium text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Get Help & Support</p>
              </div>
            </Link>
            
            <Link to="/profile" className="block">
              <div className="border border-[#ECECEC] rounded-xl p-4 text-center hover:border-[#A38BFE] transition-colors">
                <Settings className="w-8 h-8 text-[#A38BFE] mx-auto mb-2" />
                <p className="font-medium text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Account Settings</p>
              </div>
            </Link>
            
            <div className="border border-[#ECECEC] rounded-xl p-4 text-center">
              <BarChart3 className="w-8 h-8 text-[#A38BFE] mx-auto mb-2" />
              <p className="font-medium text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Detailed Reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

import React, { useEffect, useState } from 'react';
import supabase from '../../supabase';
import { Button } from "../components/button";
import { Link, useNavigate } from "react-router-dom";
import ParentHeader from '../components/ParentHeader';
import { Lightbulb, Book, Puzzle, ClipboardCheck, Users, BarChart3, Settings, User } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import { Progress } from "../components/ui/progress";

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
  xp?: number;
  streak?: number;
  storiesRead?: number;
}

const ParentDashboard: React.FC = () => {
  const [parentData, setParentData] = useState<ParentData | null>(null);
  const [childrenProgress, setChildrenProgress] = useState<ChildProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [studentCode, setStudentCode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCode.trim()) return;

    try {
      // Find student by code
      const { data: student, error: findError } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('student_code', studentCode.trim().toUpperCase())
        .eq('role', 'student')
        .single();

      if (findError || !student) {
        toast({
          title: "Student not found",
          description: "Invalid student code. Please check and try again.",
          variant: "destructive"
        });
        return;
      }

      // Link student to parent (update guardian_name)
      // Note: In a real app, we should probably use parent_id, but we are sticking to guardian_name for now as per plan.
      const { error: updateError } = await supabase
        .from('users')
        .update({ guardian_name: parentData?.username })
        .eq('id', student.id);

      if (updateError) throw updateError;

      toast({
        title: "Child added successfully!",
        description: `${student.full_name} has been linked to your account.`,
      });

      setShowAddChildModal(false);
      setStudentCode("");

      // Fetch new child's score to add to list immediately
      const { data: scores } = await supabase
        .from('dyslexia_score')
        .select('score, created_at')
        .eq('user', student.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Fetch new child's progress
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', student.id)
        .single();

      const newChild: ChildProgress = {
        id: student.id,
        username: student.full_name,
        dyslexiaScore: scores?.[0]?.score,
        lastTestDate: scores?.[0]?.created_at,
        readingProgress: progress?.xp || 0, // Using XP as reading progress for now
        gamesCompleted: progress?.games_played || 0,
        xp: progress?.xp || 0,
        streak: progress?.streak || 0,
        storiesRead: progress?.stories_read || 0
      };

      setChildrenProgress([...childrenProgress, newChild]);

    } catch (error) {
      console.error('Error adding child:', error);
      toast({
        title: "Error",
        description: "Failed to add child. Please try again.",
        variant: "destructive"
      });
    }
  };



  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
          navigate('/');
          return;
        }

        const userData = JSON.parse(storedUser);
        if (userData.role !== 'parent') {
          navigate('/dashboard');
          return;
        }

        // Determine the correct parent name from various possible fields
        const effectiveParentName = userData.parent_name || userData.full_name || userData.fullName || userData.username;

        setParentData({
          username: effectiveParentName,
          email: userData.contact_email || userData.email,
          role: 'parent',
          children: [] // We will fetch children next
        });

        // Fetch children linked to this parent (by guardian name matching parent name)
        const { data: children, error: childrenError } = await supabase
          .from('users')
          .select('id, full_name')
          .eq('guardian_name', effectiveParentName)
          .eq('role', 'student');

        if (childrenError) throw childrenError;

        if (children && children.length > 0) {
          const childrenWithScores = await Promise.all(children.map(async (child) => {
            // Fetch score
            const { data: scores } = await supabase
              .from('dyslexia_score')
              .select('score, created_at')
              .eq('user', child.id)
              .order('created_at', { ascending: false })
              .limit(1);

            // Fetch progress
            const { data: progress } = await supabase
              .from('user_progress')
              .select('*')
              .eq('user_id', child.id)
              .single();

            return {
              id: child.id,
              username: child.full_name,
              dyslexiaScore: scores?.[0]?.score,
              lastTestDate: scores?.[0]?.created_at,
              readingProgress: progress?.xp || 0, // Using XP as reading progress for now
              gamesCompleted: progress?.games_played || 0,
              xp: progress?.xp || 0,
              streak: progress?.streak || 0,
              storiesRead: progress?.stories_read || 0
            };
          }));

          setChildrenProgress(childrenWithScores);
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
          <div>
            <h1 className="text-3xl font-bold text-[#444] mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
              Welcome back, {parentData.username}! 👋
            </h1>
            <p className="text-[#666] text-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
              Monitor your children's learning progress and achievements
            </p>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#444]" style={{ fontFamily: 'Arial, sans-serif' }}>Children's Progress</h2>
              <Button
                onClick={() => setShowAddChildModal(true)}
                variant="outline"
                className="border-[#A38BFE] text-[#A38BFE] hover:bg-[#A38BFE] hover:text-white"
              >
                + Add Child
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {childrenProgress.map((child) => (
                <div key={child.id} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-pastel-blue/20 p-3 rounded-full">
                      <User className="h-8 w-8 text-pastel-blue" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{child.username}</h3>
                      <p className="text-sm text-gray-500">Student</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Dyslexia Risk Score</span>
                        <span className={`font-bold ${!child.dyslexiaScore ? 'text-gray-400' :
                          child.dyslexiaScore < 30 ? 'text-green-500' :
                            child.dyslexiaScore < 60 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                          {child.dyslexiaScore !== undefined ? `${child.dyslexiaScore}%` : 'Not taken'}
                        </span>
                      </div>
                      <Progress
                        value={child.dyslexiaScore || 0}
                        className={`h-2 ${!child.dyslexiaScore ? 'bg-gray-100' :
                          child.dyslexiaScore < 30 ? '[&>div]:bg-green-500' :
                            child.dyslexiaScore < 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'
                          }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-pastel-purple">{child.xp}</div>
                        <div className="text-xs text-gray-500">Total XP</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-pastel-green">{child.streak}</div>
                        <div className="text-xs text-gray-500">Day Streak</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-pastel-blue">{child.gamesCompleted}</div>
                        <div className="text-xs text-gray-500">Games Played</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="text-xl font-bold text-pastel-yellow">{child.storiesRead}</div>
                        <div className="text-xs text-gray-500">Stories Read</div>
                      </div>
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
              Link your child's account using their unique student code.
            </p>
            <Button
              onClick={() => setShowAddChildModal(true)}
              className="bg-[#A38BFE] hover:bg-[#8B7AFE]"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              Add Child
            </Button>
          </div>
        )}

        {/* Add Child Modal */}
        {showAddChildModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
              <h2 className="text-2xl font-bold text-[#444] mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>Add Child</h2>
              <p className="text-[#666] mb-4">Enter the unique code from your child's dashboard.</p>

              <form onSubmit={handleAddChild}>
                <input
                  type="text"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="Enter 6-character code"
                  className="w-full p-3 border border-gray-300 rounded-xl mb-4 text-lg uppercase tracking-widest text-center focus:outline-none focus:border-[#A38BFE]"
                  maxLength={6}
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddChildModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#A38BFE] hover:bg-[#8B7AFE]"
                  >
                    Link Account
                  </Button>
                </div>
              </form>
            </div>
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

import React, { useEffect, useState } from 'react';
import DyslexiaHeader from '../components/DyslexiaHeader';
import { User, Award, BookOpen, Settings, Bell, Puzzle, Calendar, TextCursor, AlignJustify, Type, Mail, UserCircle, BellOff, BellRing, CheckCircle2, Clock } from 'lucide-react';
import { Button } from "../components/button";
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "../components/sheet";
import { Slider } from "../components/slider";
import { Label } from "../components/label";
import { Switch } from "../components/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../components/select";
import { Loader2 } from 'lucide-react';

interface UserData {
  username: string;
  email: string;
  age: string;
  guardianName: string;
  role: string;
}

interface ReadingPreferences {
  fontSize: number;
  lineSpacing: number;
  useDyslexicFont: boolean;
  letterSpacing: number;
}

interface AccountSettings {
  username: string;
  email: string;
  age: string;
  guardianName: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  achievementAlerts: boolean;
  progressUpdates: boolean;
  weeklyReports: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'none';
}

const defaultPreferences: ReadingPreferences = {
  fontSize: 1,
  lineSpacing: 1.5,
  useDyslexicFont: true,
  letterSpacing: 0
};

const ReadingPreferencesSheet = ({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) => {
  const [preferences, setPreferences] = useState<ReadingPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      fetch('http://localhost:5000/api/auth/reading-preferences', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.readingPreferences) {
            setPreferences(data.readingPreferences);
          } else {
            setPreferences(defaultPreferences);
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load preferences');
          setLoading(false);
        });
    }
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/auth/reading-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ preferences })
      });
      if (!res.ok) throw new Error('Failed to save preferences');
      setOpen(false);
    } catch (e) {
      setError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const resetPreferences = () => setPreferences(defaultPreferences);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Reading Preferences
          </SheetTitle>
          <SheetDescription>
            Adjust text appearance for easier reading
          </SheetDescription>
        </SheetHeader>
        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : (
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TextCursor className="h-4 w-4" />
                  <Label htmlFor="font-size">Font Size</Label>
                </div>
                <span className="text-sm font-medium">{Math.round(preferences.fontSize * 100)}%</span>
              </div>
              <Slider
                id="font-size"
                min={0.8}
                max={1.5}
                step={0.05}
                value={[preferences.fontSize]}
                onValueChange={([value]) => setPreferences({ ...preferences, fontSize: value })}
                className="py-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlignJustify className="h-4 w-4" />
                  <Label htmlFor="line-spacing">Line Spacing</Label>
                </div>
                <span className="text-sm font-medium">{Math.round(preferences.lineSpacing * 100)}%</span>
              </div>
              <Slider
                id="line-spacing"
                min={1}
                max={2.5}
                step={0.1}
                value={[preferences.lineSpacing]}
                onValueChange={([value]) => setPreferences({ ...preferences, lineSpacing: value })}
                className="py-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TextCursor className="h-4 w-4" />
                  <Label htmlFor="letter-spacing">Letter Spacing</Label>
                </div>
                <span className="text-sm font-medium">{preferences.letterSpacing}px</span>
              </div>
              <Slider
                id="letter-spacing"
                min={0}
                max={2}
                step={0.1}
                value={[preferences.letterSpacing]}
                onValueChange={([value]) => setPreferences({ ...preferences, letterSpacing: value })}
                className="py-2"
              />
            </div>
            <div className="flex items-center justify-between space-y-0 py-2">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <Label htmlFor="dyslexic-font">Use Dyslexia Font</Label>
              </div>
              <Switch
                id="dyslexic-font"
                checked={preferences.useDyslexicFont}
                onCheckedChange={(checked) => setPreferences({ ...preferences, useDyslexicFont: checked })}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        )}
        <SheetFooter>
          <Button variant="outline" onClick={resetPreferences} disabled={saving}>Reset</Button>
          <Button onClick={handleSave} disabled={saving || loading} className="ml-2">{saving ? 'Saving...' : 'Save'}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

const AccountSettingsSheet = ({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) => {
  const [settings, setSettings] = useState<AccountSettings>({
    username: '',
    email: '',
    age: '',
    guardianName: ''
  });
  const [userRole, setUserRole] = useState<string>('student');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUserRole(userData.role || 'student');
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      fetch('http://localhost:5000/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setSettings({
              username: data.user.username || '',
              email: data.user.email || '',
              age: data.user.age || '',
              guardianName: data.user.guardianName || ''
            });
          }
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load account data');
          setLoading(false);
        });
    }
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    const token = localStorage.getItem('token');
    try {
      const payload = {
        username: settings.username,
        email: settings.email
      };

      // Only include age and guardianName for students
      if (userRole === 'student') {
        Object.assign(payload, {
          age: settings.age,
          guardianName: settings.guardianName
        });
      }

      const res = await fetch('http://localhost:5000/api/auth/update-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSuccess(true);
        // Update local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            const updatedUser = { ...userData, ...payload };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } catch (error) {
            console.error('Error updating local storage:', error);
          }
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Failed to update account');
      }
    } catch (err) {
      setError('Failed to update account');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Account Settings</SheetTitle>
          <SheetDescription>
            Update your account information and preferences.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <input
                  id="username"
                  type="text"
                  value={settings.username}
                  onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                  className="flex-1 p-2 rounded-md border"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="flex-1 p-2 rounded-md border"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Only show age and guardian fields for students */}
            {userRole === 'student' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <input
                      id="age"
                      type="text"
                      value={settings.age}
                      onChange={(e) => setSettings({ ...settings, age: e.target.value })}
                      className="flex-1 p-2 rounded-md border"
                      placeholder="Enter your age"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardian">Guardian Name</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <input
                      id="guardian"
                      type="text"
                      value={settings.guardianName}
                      onChange={(e) => setSettings({ ...settings, guardianName: e.target.value })}
                      className="flex-1 p-2 rounded-md border"
                      placeholder="Enter guardian's name"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">Settings updated successfully!</div>}
        </div>

        <SheetFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading} 
            className="ml-2"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

function NotificationSettingsSheet({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    achievementAlerts: true,
    progressUpdates: true,
    weeklyReports: true,
    reminderFrequency: 'weekly'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/auth/notification-settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
      }
    };

    if (open) {
      fetchSettings();
    }
  }, [open]);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await fetch('http://localhost:5000/api/auth/update-notification-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      setMessage({ type: 'success', text: 'Notification settings updated successfully!' });
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-white">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-900">Notification Settings</SheetTitle>
          <SheetDescription className="text-gray-500">
            Manage how and when you receive notifications
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Achievement Alerts</Label>
                <p className="text-sm text-gray-500">Get notified when you earn achievements</p>
              </div>
              <Switch
                checked={settings.achievementAlerts}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, achievementAlerts: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Progress Updates</Label>
                <p className="text-sm text-gray-500">Receive updates about your learning progress</p>
              </div>
              <Switch
                checked={settings.progressUpdates}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, progressUpdates: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Weekly Reports</Label>
                <p className="text-sm text-gray-500">Get a summary of your weekly progress</p>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Reminder Frequency</Label>
              <Select
                value={settings.reminderFrequency}
                onValueChange={(value: 'daily' | 'weekly' | 'none') => 
                  setSettings(prev => ({ ...prev, reminderFrequency: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const [showPreferences, setShowPreferences] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
  
  // Check if user is a parent to apply normal font styling
  const isParent = userData?.role === 'parent';

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

  const handleUserUpdate = (updatedUser: UserData) => {
    setUserData(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-purple/30 pb-24" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
      <DyslexiaHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-pastel-blue rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-white/70 rounded-full flex justify-center items-center shadow-md">
              <User className="h-16 w-16 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>{userData?.username || 'Loading...'}</h1>
              <div className="space-y-1">
                <p className="text-lg flex items-center gap-2" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
                  <span className="font-semibold">Age:</span>
                  <span>{userData?.age || 'Not set'}</span>
                </p>
                <p className="text-lg flex items-center gap-2" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
                  <span className="font-semibold">Guardian:</span>
                  <span>{userData?.guardianName || 'Not set'}</span>
                </p>
                <p className="text-lg flex items-center gap-2" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
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
              <Button variant="outline" size="default" onClick={() => setShowPreferences(true)}>Adjust</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5" />
                <span className="font-bold">Notifications</span>
              </div>
              <Button
                variant="outline"
                onClick={() => setNotificationSettingsOpen(true)}
                className="border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4"
              >
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg">
              <div className="flex items-center">
                <User className="mr-3" />
                <span className="font-bold">Account Settings</span>
              </div>
              <Button 
                variant="outline" 
                size="default" 
                onClick={() => setShowAccountSettings(true)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </main>
      <ReadingPreferencesSheet open={showPreferences} setOpen={setShowPreferences} />
      <AccountSettingsSheet 
        open={showAccountSettings} 
        setOpen={setShowAccountSettings}
      />
      <NotificationSettingsSheet
        open={notificationSettingsOpen}
        onOpenChange={setNotificationSettingsOpen}
      />
    </div>
  );
};

export default Profile;

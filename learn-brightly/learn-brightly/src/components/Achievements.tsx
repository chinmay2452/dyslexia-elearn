import React from 'react';
import { Trophy, Star, Flame, BookOpen, Zap, Target } from 'lucide-react';
import AnimatedIcon from './AnimatedIcon';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  color: string;
}

interface AchievementsProps {
  xp?: number;
  streak?: number;
  gamesPlayed?: number;
  storiesRead?: number;
}

const Achievements: React.FC<AchievementsProps> = ({ 
  xp = 0, 
  streak = 0, 
  gamesPlayed = 0, 
  storiesRead = 0
}) => {
  
  const achievements: Achievement[] = [
    {
      id: 'first_story',
      title: 'Story Starter',
      description: 'Read your first story',
      icon: <BookOpen className="h-6 w-6" />,
      unlocked: storiesRead >= 1,
      progress: storiesRead,
      maxProgress: 1,
      color: 'bg-blue-100'
    },
    {
      id: 'story_lover',
      title: 'Story Lover',
      description: 'Read 10 stories',
      icon: <BookOpen className="h-6 w-6" />,
      unlocked: storiesRead >= 10,
      progress: Math.min(storiesRead, 10),
      maxProgress: 10,
      color: 'bg-blue-100'
    },
    {
      id: 'master_reader',
      title: 'Master Reader',
      description: 'Read 50 stories',
      icon: <Star className="h-6 w-6" />,
      unlocked: storiesRead >= 50,
      progress: Math.min(storiesRead, 50),
      maxProgress: 50,
      color: 'bg-purple-100'
    },
    {
      id: 'on_fire',
      title: 'On Fire',
      description: 'Maintain a 7-day streak',
      icon: <Flame className="h-6 w-6" />,
      unlocked: streak >= 7,
      progress: streak,
      maxProgress: 7,
      color: 'bg-orange-100'
    },
    {
      id: 'unstoppable',
      title: 'Unstoppable',
      description: 'Reach a 30-day streak',
      icon: <Flame className="h-6 w-6" />,
      unlocked: streak >= 30,
      progress: Math.min(streak, 30),
      maxProgress: 30,
      color: 'bg-orange-100'
    },
    {
      id: 'game_master',
      title: 'Game Master',
      description: 'Play 20 games',
      icon: <Zap className="h-6 w-6" />,
      unlocked: gamesPlayed >= 20,
      progress: Math.min(gamesPlayed, 20),
      maxProgress: 20,
      color: 'bg-yellow-100'
    },
    {
      id: 'xp_grinder',
      title: 'XP Grinder',
      description: 'Earn 500 XP',
      icon: <Target className="h-6 w-6" />,
      unlocked: xp >= 500,
      progress: Math.min(xp, 500),
      maxProgress: 500,
      color: 'bg-green-100'
    },
    {
      id: 'level_10',
      title: 'Level Up Master',
      description: 'Reach Level 10',
      icon: <Trophy className="h-6 w-6" />,
      unlocked: xp >= 1000,
      progress: Math.min(Math.floor(xp / 100), 10),
      maxProgress: 10,
      color: 'bg-yellow-100'
    }
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  // Get milestones for next achievements
  const nextStoriesMilestone = storiesRead < 10 ? 10 : storiesRead < 50 ? 50 : null;
  const nextGamesMilestone = gamesPlayed < 20 ? 20 : null;
  const nextStreakMilestone = streak < 7 ? 7 : streak < 30 ? 30 : null;

  return (
    <div className="bg-gradient-to-br from-pastel-yellow/30 to-pastel-pink/20 rounded-2xl p-6 shadow-md mb-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Achievements
          </h2>
          <div className="bg-amber-500/20 rounded-full px-3 py-1 text-sm font-bold text-amber-700">
            {unlockedCount}/{totalCount} Unlocked
          </div>
        </div>
        
        {/* Unlock Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Milestones Section */}
      {(nextStoriesMilestone || nextGamesMilestone || nextStreakMilestone) && (
        <div className="mb-6 bg-white/60 rounded-xl p-4 border-l-4 border-amber-500">
          <p className="text-sm font-bold text-gray-700 mb-2">Next Milestones:</p>
          <div className="flex flex-wrap gap-3">
            {nextStoriesMilestone && (
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span className="font-semibold">{nextStoriesMilestone - storiesRead} more stories</span>
              </div>
            )}
            {nextGamesMilestone && (
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{nextGamesMilestone - gamesPlayed} more games</span>
              </div>
            )}
            {nextStreakMilestone && (
              <div className="flex items-center gap-2 text-sm">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-semibold">{nextStreakMilestone - streak} more days</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`rounded-xl p-4 flex flex-col items-center text-center transition-all ${
              achievement.unlocked 
                ? `${achievement.color} border-2 border-amber-400 shadow-md` 
                : 'bg-gray-200 opacity-50 grayscale'
            }`}
          >
            <div className="mb-2">
              {achievement.unlocked ? (
                <AnimatedIcon animation="bounce">
                  <div className="text-4xl">{achievement.icon}</div>
                </AnimatedIcon>
              ) : (
                <div className="text-gray-400 opacity-60">{achievement.icon}</div>
              )}
            </div>

            <h3 className="text-sm font-bold mb-1">{achievement.title}</h3>
            <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>

            {achievement.progress !== undefined && achievement.maxProgress && (
              <div className="w-full">
                <div className="text-xs font-semibold mb-1">
                  {achievement.progress}/{achievement.maxProgress}
                </div>
                <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {achievement.unlocked && (
              <div className="mt-2 text-xs font-bold text-amber-600">✓ Unlocked</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;

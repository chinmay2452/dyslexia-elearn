import React from 'react';
import { Progress } from "./ui/progress";
import { CircleCheck, Flame, TrendingUp, Zap } from 'lucide-react';
import AnimatedIcon from './AnimatedIcon';
import ReadingText from './ReadingText';

interface ProgressTrackerProps {
  xp?: number;
  streak?: number;
  gamesPlayed?: number;
  storiesRead?: number;
  previousStoriesRead?: number;
  previousGamesPlayed?: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  xp = 0, 
  streak = 0, 
  gamesPlayed = 0, 
  storiesRead = 0,
  previousStoriesRead = 0,
  previousGamesPlayed = 0
}) => {
  // Calculate level based on XP (e.g., 100 XP per level)
  const level = Math.floor(xp / 100) + 1;
  const xpForNextLevel = level * 100;
  const progressToNextLevel = (xp % 100);

  // Calculate progress trends
  const storiesTrendText = storiesRead - previousStoriesRead;
  const gamesTrendText = gamesPlayed - previousGamesPlayed;

  // Streak status
  const getStreakStatus = () => {
    if (streak >= 30) return { label: '🔥 Unstoppable!', color: 'text-red-600' };
    if (streak >= 14) return { label: '🔥 Amazing Streak!', color: 'text-orange-600' };
    if (streak >= 7) return { label: '🔥 Great Streak!', color: 'text-orange-500' };
    if (streak >= 3) return { label: '⚡ Building Streak!', color: 'text-yellow-600' };
    return { label: '📅 Start Your Streak!', color: 'text-gray-600' };
  };

  const streakStatus = getStreakStatus();

  return (
    <div className="space-y-6 mb-8">
      {/* Main XP & Level Progress */}
      <div className="bg-gradient-to-br from-pastel-purple via-pastel-purple/80 to-pastel-blue/60 rounded-2xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Your Progress (Level {level})
          </h2>
          <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
            <AnimatedIcon animation="bounce">
              <CircleCheck className="text-green-400" />
            </AnimatedIcon>
            <span className="font-bold text-white">{xp} XP Total</span>
          </div>
        </div>

        <div className="mb-1 flex justify-between text-xs text-white/80 font-semibold">
          <span>Level {level}</span>
          <span>Level {level + 1}</span>
        </div>
        <Progress value={progressToNextLevel} className="h-4 bg-white/30 [&>div]:bg-green-400" />
        <p className="text-xs text-white/70 mt-1">{progressToNextLevel}/100 XP to next level</p>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white border border-white/30 hover:bg-white/30 transition-all">
            <div className="text-2xl font-bold">{gamesPlayed}</div>
            <div className="text-xs font-medium">Games Played</div>
            {gamesTrendText > 0 && (
              <div className="text-xs text-green-300 mt-1 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" /> +{gamesTrendText} this week
              </div>
            )}
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white border border-white/30 hover:bg-white/30 transition-all">
            <div className="text-2xl font-bold">{storiesRead}</div>
            <div className="text-xs font-medium">Stories Read</div>
            {storiesTrendText > 0 && (
              <div className="text-xs text-green-300 mt-1 flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" /> +{storiesTrendText} this week
              </div>
            )}
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white border border-white/30 hover:bg-white/30 transition-all">
            <div className="text-2xl font-bold">{xp}</div>
            <div className="text-xs font-medium">Total XP</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-white border border-white/30 hover:bg-white/30 transition-all">
            <div className="text-2xl font-bold">{streak}</div>
            <div className="text-xs font-medium">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Streak Motivational Card */}
      {streak > 0 && (
        <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-6 shadow-md border-2 border-orange-300">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-6 w-6 text-orange-600" />
                <p className={`text-lg font-bold ${streakStatus.color}`}>{streakStatus.label}</p>
              </div>
              <ReadingText className="text-sm">
                You're learning every day! Keep it up for amazing rewards.
              </ReadingText>
            </div>
            <div className="ml-4 text-center">
              <div className="text-4xl font-bold text-orange-600">{streak}</div>
              <div className="text-xs font-semibold text-orange-700">days in a row</div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Activity Summary */}
      {(storiesTrendText > 0 || gamesTrendText > 0) && (
        <div className="bg-gradient-to-br from-pastel-green/40 to-pastel-blue/40 rounded-2xl p-6 shadow-md border-l-4 border-green-500">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            This Week's Progress
          </h3>
          <div className="space-y-2 text-sm">
            {storiesTrendText > 0 && (
              <p className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <span>You've read <span className="font-bold text-green-600">{storiesTrendText} more stories</span> this week!</span>
              </p>
            )}
            {gamesTrendText > 0 && (
              <p className="flex items-center gap-2">
                <span className="text-xl">🎮</span>
                <span>You've played <span className="font-bold text-green-600">{gamesTrendText} more games</span> this week!</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;

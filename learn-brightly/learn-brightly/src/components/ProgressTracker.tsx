import React from 'react';
import { Progress } from "./ui/progress";
import { CircleCheck } from 'lucide-react';
import AnimatedIcon from './AnimatedIcon';

interface ProgressTrackerProps {
  xp?: number;
  streak?: number;
  gamesPlayed?: number;
  storiesRead?: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ xp = 0, streak = 0, gamesPlayed = 0, storiesRead = 0 }) => {
  // Calculate level based on XP (e.g., 100 XP per level)
  const level = Math.floor(xp / 100) + 1;
  const xpForNextLevel = level * 100;
  const progressToNextLevel = (xp % 100);

  return (
    <div className="bg-pastel-purple rounded-2xl p-6 shadow-md mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-white">Your Progress (Level {level})</h2>
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

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white/30 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">{streak}</div>
          <div className="text-sm font-medium">Day Streak</div>
        </div>
        <div className="bg-white/30 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">{xp}</div>
          <div className="text-sm font-medium">Total XP</div>
        </div>
        <div className="bg-white/30 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">{gamesPlayed}</div>
          <div className="text-sm font-medium">Games Played</div>
        </div>
        <div className="bg-white/30 rounded-lg p-3 text-white">
          <div className="text-2xl font-bold">{storiesRead}</div>
          <div className="text-sm font-medium">Stories Read</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;

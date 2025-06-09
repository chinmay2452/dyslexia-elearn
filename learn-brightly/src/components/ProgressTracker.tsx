import React from 'react';
import { Progress } from "./ui/progress";
import { CircleCheck } from 'lucide-react';
import AnimatedIcon from './AnimatedIcon';

const ProgressTracker = () => {
  return (
    <div className="bg-pastel-purple rounded-2xl p-6 shadow-md mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Your Progress</h2>
        <div className="flex items-center gap-1">
          <AnimatedIcon animation="bounce">
            <CircleCheck className="text-green-600" />
          </AnimatedIcon>
          <span className="font-bold">0/10 Complete!</span>
        </div>
      </div>
      
      <Progress value={0} className="h-4 bg-white/50 [&>div]:bg-green-500" />
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div className="bg-white/30 rounded-lg p-3">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm">Days Streak</div>
        </div>
        <div className="bg-white/30 rounded-lg p-3">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm">Stars Earned</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;

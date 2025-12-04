import React from 'react';
import { BookOpen, Zap, PenTool, Gamepad2, TrendingUp } from 'lucide-react';
import { Progress } from "./ui/progress";
import ReadingText from './ReadingText';

interface SkillProgressProps {
  storiesRead?: number;
  gamesPlayed?: number;
  writingActivities?: number;
  spellingAttempts?: number;
  dyslexiaScore?: number;
}

const SkillProgress: React.FC<SkillProgressProps> = ({
  storiesRead = 0,
  gamesPlayed = 0,
  writingActivities = 0,
  spellingAttempts = 0,
  dyslexiaScore = 0
}) => {
  // Define skill levels and goals
  const skills = [
    {
      name: 'Reading',
      icon: <BookOpen className="h-5 w-5" />,
      current: storiesRead,
      goal: 50,
      color: 'blue',
      lightColor: 'bg-blue-100',
      label: 'stories',
      description: 'Reading comprehension and fluency',
      borderColor: 'border-blue-500'
    },
    {
      name: 'Games',
      icon: <Gamepad2 className="h-5 w-5" />,
      current: gamesPlayed,
      goal: 30,
      color: 'purple',
      lightColor: 'bg-purple-100',
      label: 'games',
      description: 'Learning through interactive play',
      borderColor: 'border-purple-500'
    },
    {
      name: 'Writing',
      icon: <PenTool className="h-5 w-5" />,
      current: writingActivities,
      goal: 20,
      color: 'green',
      lightColor: 'bg-green-100',
      label: 'activities',
      description: 'Writing skills development',
      borderColor: 'border-green-500'
    },
    {
      name: 'Spelling',
      icon: <Zap className="h-5 w-5" />,
      current: spellingAttempts,
      goal: 40,
      color: 'orange',
      lightColor: 'bg-orange-100',
      label: 'attempts',
      description: 'Spelling accuracy improvement',
      borderColor: 'border-orange-500'
    }
  ];

  // Calculate overall progress
  const totalCurrent = storiesRead + gamesPlayed + writingActivities + spellingAttempts;
  const totalGoal = skills.reduce((sum, skill) => sum + skill.goal, 0);
  const overallProgress = Math.min((totalCurrent / totalGoal) * 100, 100);

  // Determine skill level based on dyslexia score
  const getSkillLevel = () => {
    if (!dyslexiaScore) return 'Beginner';
    if (dyslexiaScore >= 70) return 'Advanced';
    if (dyslexiaScore >= 40) return 'Intermediate';
    return 'Beginner';
  };

  const getSkillLevelProgress = () => {
    const skillLevel = getSkillLevel();
    if (skillLevel === 'Beginner') {
      return { level: 1, nextLevel: 2, progress: Math.min((totalCurrent / 50) * 100, 100), needed: 50 - totalCurrent };
    } else if (skillLevel === 'Intermediate') {
      return { level: 2, nextLevel: 3, progress: Math.min(((totalCurrent - 50) / 100) * 100, 100), needed: 150 - (totalCurrent - 50) };
    } else {
      return { level: 3, nextLevel: 4, progress: Math.min(((totalCurrent - 150) / 100) * 100, 100), needed: 250 - (totalCurrent - 150) };
    }
  };

  const levelProgress = getSkillLevelProgress();

  const getProgressBarClass = (color: string) => {
    const map: { [key: string]: string } = {
      'blue': '[&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-blue-600',
      'purple': '[&>div]:bg-gradient-to-r [&>div]:from-purple-400 [&>div]:to-purple-600',
      'green': '[&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-600',
      'orange': '[&>div]:bg-gradient-to-r [&>div]:from-orange-400 [&>div]:to-orange-600'
    };
    return map[color] || '[&>div]:bg-gray-400';
  };

  return (
    <div className="bg-gradient-to-br from-pastel-blue/30 to-pastel-purple/20 rounded-2xl p-6 shadow-md mb-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Skill Development
          </h2>
          <div className="bg-white rounded-full px-4 py-2 text-sm font-bold text-blue-700 border-2 border-blue-300">
            Level {levelProgress.level}
          </div>
        </div>

        <div className="bg-white/60 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">
              You are at {Math.round(levelProgress.progress)}% of Level {levelProgress.level}
            </span>
            <span className="text-sm text-gray-600">
              {levelProgress.needed > 0 ? `${levelProgress.needed} more to level up` : 'Ready to level up!'}
            </span>
          </div>
          <Progress value={levelProgress.progress} className="h-3 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-blue-600" />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-700 font-semibold">Overall Progress</span>
          <span className="text-blue-700 font-bold">{totalCurrent}/{totalGoal}</span>
        </div>
        <Progress 
          value={overallProgress} 
          className="h-2 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-green-400 [&>div]:to-green-600" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => {
          const progress = (skill.current / skill.goal) * 100;
          const isGoalMet = skill.current >= skill.goal;
          const remaining = Math.max(0, skill.goal - skill.current);

          return (
            <div key={skill.name} className={`${skill.lightColor} rounded-xl p-4 border-l-4 ${skill.borderColor}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{skill.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-800">{skill.name}</h3>
                    <p className="text-xs text-gray-600">{skill.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{skill.current}</div>
                  <div className="text-xs text-gray-600">/ {skill.goal}</div>
                </div>
              </div>

              <Progress 
                value={Math.min(progress, 100)} 
                className={`h-2 bg-white/50 ${getProgressBarClass(skill.color)}`}
              />

              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isGoalMet ? 'text-green-700' : 'text-gray-700'}`}>
                  {Math.round(progress)}% Complete
                </span>
                {remaining > 0 && (
                  <span className="text-gray-600">
                    {remaining} more {skill.label}
                  </span>
                )}
                {isGoalMet && (
                  <span className="text-green-700 font-bold">Goal Met!</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 border-l-4 border-amber-500">
        <ReadingText className="text-sm">
          {overallProgress >= 100 
            ? '🎉 Incredible work! You have completed all skill goals! Time to set new challenges!'
            : overallProgress >= 75
            ? '🚀 Almost there! Keep pushing to complete all skill goals!'
            : overallProgress >= 50
            ? '💪 Great progress! You are halfway to mastering all skills!'
            : overallProgress >= 25
            ? '⭐ Good start! Keep practicing consistently!'
            : '🌱 Every journey starts with a single step. Lets begin!'}
        </ReadingText>
      </div>
    </div>
  );
};

export default SkillProgress;

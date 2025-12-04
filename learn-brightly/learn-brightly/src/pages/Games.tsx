import React, { useEffect, useState } from 'react';
import DyslexiaHeader from '../components/DyslexiaHeader';
import { Puzzle, Star, Trophy, Clock, Zap, Lightbulb, Lock, AlertCircle } from 'lucide-react';
import AnimatedIcon from '../components/AnimatedIcon';
import ReadingText from '../components/ReadingText';
import LearningCard from '../components/LearningCard';
import { Link } from 'react-router-dom';

interface Game {
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  level: 'Easy' | 'Medium' | 'Hard';
  time: string;
  path: string;
  recommendedFor: 'beginner' | 'intermediate' | 'advanced';
}

const gameOptions: Game[] = [
  {
    title: "Word Match",
    icon: <Puzzle />,
    color: "pink",
    description: "Match words with their pictures. Beat the timer to earn extra points! Perfect for building vocabulary and visual recognition skills.",
    level: "Easy",
    time: "5 min",
    path: "/games/word-match",
    recommendedFor: "beginner"
  },
  {
    title: "Spelling Hero",
    icon: <Zap />,
    color: "yellow",
    description: "Listen to words and spell them correctly. Use hints if you need help!",
    level: "Medium",
    time: "10 min",
    path: "/games/spelling-hero",
    recommendedFor: "intermediate"
  },
  {
    title: "Story Builder",
    icon: <Lightbulb />,
    color: "blue",
    description: "Create a fun story by choosing the right words to fill in the blanks.",
    level: "Medium",
    time: "15 min",
    path: "/games/story-builder",
    recommendedFor: "intermediate"
  },
  {
    title: "Word Bubbles",
    icon: <Star />,
    color: "green",
    description: "Pop word bubbles that match the category before they float away!",
    level: "Hard",
    time: "8 min",
    path: "/games/word-bubbles",
    recommendedFor: "advanced"
  },
];

const Games = () => {
  const [dyslexiaScore, setDyslexiaScore] = useState<number | undefined>(undefined);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Note: Score would typically come from parent or Supabase
      // For now, it will be fetched from the user's Supabase data
    }
  }, []);

  const getSkillLevel = () => {
    if (!dyslexiaScore) return 'beginner';
    if (dyslexiaScore >= 70) return 'advanced';
    if (dyslexiaScore >= 40) return 'intermediate';
    return 'beginner';
  };

  const skillLevel = getSkillLevel();

  const filteredGames = gameOptions.filter(game => {
    if (!dyslexiaScore) return true;
    if (skillLevel === 'advanced') return true;
    if (skillLevel === 'intermediate') return game.recommendedFor !== 'advanced';
    return game.recommendedFor === 'beginner';
  });

  const upcomingGames = gameOptions.filter(game => {
    if (!dyslexiaScore) return false;
    if (skillLevel === 'advanced') return false;
    if (skillLevel === 'intermediate') return game.recommendedFor === 'advanced';
    return game.recommendedFor !== 'beginner';
  });
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-pink/30 pb-24">
      <DyslexiaHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Puzzle className="mr-2 text-primary" />
            Learning Games
          </h1>
          {dyslexiaScore !== undefined && (
            <div className="bg-pastel-yellow rounded-full px-4 py-2 text-sm font-bold">
              {skillLevel === 'advanced' && '🎯 Advanced'}
              {skillLevel === 'intermediate' && '📊 Intermediate'}
              {skillLevel === 'beginner' && '🌱 Beginner'}
            </div>
          )}
        </div>

        {dyslexiaScore && (
          <div className="bg-pastel-blue/20 border-2 border-pastel-blue rounded-2xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-pastel-blue mt-1 flex-shrink-0" />
              <ReadingText className="text-sm">
                You're playing games at the <span className="font-bold">{skillLevel}</span> level. 
                {skillLevel !== 'advanced' && ` Complete more games to unlock harder challenges!`}
              </ReadingText>
            </div>
          </div>
        )}
        
        <div className="bg-pastel-purple rounded-2xl p-6 shadow-md mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Today's Challenge</h2>
              <ReadingText size="lg">
                Complete 3 games today to earn a special badge! 
                You've already finished 1 game.
              </ReadingText>
              <div className="mt-4 bg-white/30 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Progress</span>
                  <span className="font-bold">1/3</span>
                </div>
                <div className="w-full bg-white/50 h-4 rounded-full mt-2">
                  <div className="bg-green-500 h-4 rounded-full w-1/3"></div>
                </div>
              </div>
            </div>
            <div className="w-32 h-32 flex justify-center items-center">
              <AnimatedIcon animation="bounce" size="xl">
                <Trophy className="h-24 w-24 text-amber-500" />
              </AnimatedIcon>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredGames.map((game) => {
            const isRecommended = game.recommendedFor === skillLevel;
            return (
              <Link key={game.title} to={game.path}>
                <LearningCard 
                  title={game.title} 
                  icon={game.icon} 
                  color={game.color as any}
                  className={isRecommended ? 'ring-2 ring-amber-400' : ''}
                >
                  <ReadingText>
                    {game.description}
                  </ReadingText>
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{game.time}</span>
                    </div>
                    <div className="bg-pastel-yellow/30 px-3 py-1 rounded-full text-xs font-bold">
                      {game.level}
                    </div>
                  </div>
                  {isRecommended && (
                    <div className="mt-3 text-center text-xs font-bold text-amber-600">
                      ⭐ Recommended for your level
                    </div>
                  )}
                </LearningCard>
              </Link>
            );
          })}
        </div>

        {upcomingGames.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Unlock More Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {upcomingGames.map((game) => (
                <div key={game.title} className="opacity-60">
                  <LearningCard 
                    title={game.title} 
                    icon={game.icon} 
                    color={game.color as any}
                  >
                    <div className="relative">
                      <ReadingText>
                        {game.description}
                      </ReadingText>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                        <div className="text-center">
                          <Lock className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                          <p className="text-sm font-bold text-gray-600">Unlock at {game.level} level</p>
                        </div>
                      </div>
                    </div>
                  </LearningCard>
                </div>
              ))}
            </div>
          </>
        )}
        
        <div className="mt-8 bg-pastel-peach rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-3">Your Game Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm">Games Played</div>
            </div>
            <div className="bg-white/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">8</div>
              <div className="text-sm">Badges Earned</div>
            </div>
            <div className="bg-white/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">86%</div>
              <div className="text-sm">Avg. Score</div>
            </div>
            <div className="bg-white/50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">3</div>
              <div className="text-sm">Day Streak</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Games;

import React from 'react';
import DyslexiaHeader from '../components/DyslexiaHeader';
import { Puzzle, Star, Trophy, Clock, Zap, Lightbulb } from 'lucide-react';
import AnimatedIcon from '../components/AnimatedIcon';
import ReadingText from '../components/ReadingText';
import LearningCard from '../components/LearningCard';
import { Link } from 'react-router-dom';

const gameOptions = [
  {
    title: "Word Match",
    icon: <Puzzle />,
    color: "pink",
    description: "Match words with their pictures. Beat the timer to earn extra points! Perfect for building vocabulary and visual recognition skills.",
    level: "Easy",
    time: "5 min",
    path: "/games/word-match"
  },
  {
    title: "Spelling Hero",
    icon: <Zap />,
    color: "yellow",
    description: "Listen to words and spell them correctly. Use hints if you need help!",
    level: "Medium",
    time: "10 min",
    path: "/games/spelling-hero"
  },
  {
    title: "Story Builder",
    icon: <Lightbulb />,
    color: "blue",
    description: "Create a fun story by choosing the right words to fill in the blanks.",
    level: "Medium",
    time: "15 min",
    path: "/games/story-builder"
  },
  {
    title: "Word Bubbles",
    icon: <Star />,
    color: "green",
    description: "Pop word bubbles that match the category before they float away!",
    level: "Hard",
    time: "8 min",
    path: "/games/word-bubbles"
  },
];

const Games = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-pink/30 pb-24">
      <DyslexiaHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Puzzle className="mr-2 text-primary" />
          Learning Games
        </h1>
        
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
        
        <h2 className="text-2xl font-bold mb-4">Choose a Game</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gameOptions.map((game, index) => (
            <LearningCard 
              key={index} 
              title={game.title} 
              icon={game.icon} 
              color={game.color as any}
            >
              <ReadingText>
                {game.description}
              </ReadingText>
              <div className="flex justify-between mt-4 mb-2">
                <div className="bg-white/40 rounded-lg px-3 py-1 text-sm flex items-center">
                  <Star className="h-4 w-4 mr-1" /> {game.level}
                </div>
                <div className="bg-white/40 rounded-lg px-3 py-1 text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> {game.time}
                </div>
              </div>
              <Link to={game.path}>
                <button className="w-full mt-2 bg-white/50 hover:bg-white/70 transition-colors rounded-xl py-2 font-bold">
                  Play Now
                </button>
              </Link>
            </LearningCard>
          ))}
        </div>
        
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

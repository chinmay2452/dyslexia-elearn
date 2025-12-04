
import React from 'react';
import LearningCard from '../components/LearningCard';
import ReadingText from './ReadingText';
import { BookOpen, Video, Mic, Puzzle, GraduationCap, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LearningModulesProps {
  dyslexiaScore?: number;
}

const LearningModules: React.FC<LearningModulesProps> = ({ dyslexiaScore }) => {
  // Determine skill level based on dyslexia score
  const getSkillLevel = () => {
    if (!dyslexiaScore) return 'beginner';
    if (dyslexiaScore >= 70) return 'advanced';
    if (dyslexiaScore >= 40) return 'intermediate';
    return 'beginner';
  };

  const skillLevel = getSkillLevel();
  const isBeginner = skillLevel === 'beginner';
  const isIntermediate = skillLevel === 'intermediate';
  const isAdvanced = skillLevel === 'advanced';

  return (
    <div className="py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Today's Learning</h2>
        {dyslexiaScore !== undefined && (
          <div className="bg-pastel-yellow rounded-full px-4 py-2 text-sm font-bold">
            {isAdvanced && '🎯 Advanced Level'}
            {isIntermediate && '📊 Intermediate Level'}
            {isBeginner && '🌱 Beginner Level'}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LearningCard 
          title="Reading Practice" 
          icon={<BookOpen />} 
          color="blue"
        >
          <ReadingText>
            {isBeginner && "Let's start with short, simple stories about everyday things!"}
            {isIntermediate && "Try reading longer stories with more interesting plots!"}
            {isAdvanced && "Challenge yourself with complex stories and detailed descriptions!"}
          </ReadingText>
          <Link to="/reading">
            <button className="w-full mt-2 bg-white/50 hover:bg-white/70 transition-colors rounded-xl py-2 font-bold">
              Start Reading
            </button>
          </Link>
        </LearningCard>
        
        <LearningCard 
          title="Video Lesson" 
          icon={<Video />}
          color="yellow"
        >
          <ReadingText>
            {isBeginner && "Watch short, simple videos with clear explanations."}
            {isIntermediate && "Explore intermediate videos covering reading techniques."}
            {isAdvanced && "Deep dive into advanced dyslexia strategies and research."}
          </ReadingText>
          <Link to="/resources">
            <button className="w-full mt-2 bg-white/50 hover:bg-white/70 transition-colors rounded-xl py-2 font-bold">
              Play Video
            </button>
          </Link>
        </LearningCard>
        
        <LearningCard 
          title="Pronunciation Practice" 
          icon={<Mic />}
          color="pink"
        >
          <ReadingText>
            {isBeginner && "Start with common words and simple pronunciations."}
            {isIntermediate && "Practice medium-difficulty words with varied sounds."}
            {isAdvanced && "Master challenging words and different accents."}
          </ReadingText>
          <Link to="/resources?tab=practice">
            <button className="w-full mt-2 bg-white/50 hover:bg-white/70 transition-colors rounded-xl py-2 font-bold">
              Try Speaking
            </button>
          </Link>
        </LearningCard>
        
        <LearningCard 
          title="Learning Resources" 
          icon={<GraduationCap />}
          color="green"
        >
          <ReadingText>
            Explore our collection of videos, stories, assignments and practice
            sessions designed to help with dyslexia!
          </ReadingText>
          <Link to="/resources">
            <button className="w-full mt-2 bg-white/50 hover:bg-white/70 transition-colors rounded-xl py-2 font-bold">
              Explore Resources
            </button>
          </Link>
        </LearningCard>
      </div>

      {!dyslexiaScore && (
        <div className="mt-6 bg-pastel-purple/20 border-2 border-pastel-purple rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-pastel-purple" />
            <p className="font-bold text-pastel-purple">Personalization Tip</p>
          </div>
          <ReadingText className="text-sm">
            Take the dyslexia test to unlock personalized learning recommendations tailored to your skill level!
          </ReadingText>
        </div>
      )}
    </div>
  );
};

export default LearningModules;

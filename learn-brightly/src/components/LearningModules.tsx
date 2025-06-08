
import React from 'react';
import LearningCard from '../components/LearningCard';
import ReadingText from './ReadingText';
import { BookOpen, Video, Mic, Puzzle, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearningModules = () => {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-6">Today's Learning</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LearningCard 
          title="Reading Practice" 
          icon={<BookOpen />} 
          color="blue"
        >
          <ReadingText>
            Let's practice reading with a fun story about space explorers! 
            Click to start your reading adventure.
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
            Watch a 5-minute video about animals in the rainforest. 
            Learn amazing facts with colorful animations!
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
            Practice saying tricky words out loud. Listen to the correct 
            pronunciation and then try it yourself!
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
    </div>
  );
};

export default LearningModules;

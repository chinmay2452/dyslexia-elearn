
import React from 'react';
import { Book, Lightbulb, PlayCircle, Puzzle, Star, FileText } from 'lucide-react';
import AnimatedIcon from '../components/AnimatedIcon';

const categories = [
  { name: 'Reading', icon: <Book />, color: 'bg-pastel-blue' },
  { name: 'Writing', icon: <FileText />, color: 'bg-pastel-green' },
  { name: 'Videos', icon: <PlayCircle />, color: 'bg-pastel-yellow' },
  { name: 'Games', icon: <Puzzle />, color: 'bg-pastel-pink' },
  { name: 'Tips', icon: <Lightbulb />, color: 'bg-pastel-purple' },
  { name: 'Awards', icon: <Star />, color: 'bg-pastel-peach' },
];

const LearningCategories = () => {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Learning Activities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((category) => (
          <button 
            key={category.name}
            className={`${category.color} rounded-xl p-4 flex flex-col items-center gap-2 shadow hover:shadow-md transition-all hover:scale-105 animate-pop`}
          >
            <AnimatedIcon animation="bounce" size="lg">
              {category.icon}
            </AnimatedIcon>
            <span className="font-bold tracking-wide">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LearningCategories;

import React from 'react';
import { Book, PlayCircle, Puzzle, FileText } from 'lucide-react';
import AnimatedIcon from '../components/AnimatedIcon';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Reading', icon: <Book />, color: 'bg-pastel-blue', path: '/reading' },
  { name: 'Writing', icon: <FileText />, color: 'bg-pastel-green', path: '/writing' },
  { name: 'Videos', icon: <PlayCircle />, color: 'bg-pastel-yellow', path: '/video-section' },
  { name: 'Games', icon: <Puzzle />, color: 'bg-pastel-pink', path: '/games' },
];

const LearningCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Learning Activities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {categories.map((category) => (
          <button 
            key={category.name}
            onClick={() => handleCategoryClick(category.path)}
            className={`${category.color} rounded-xl p-6 flex flex-col items-center gap-3 shadow hover:shadow-md transition-all hover:scale-105 animate-pop`}
          >
            <AnimatedIcon animation="bounce" size="lg">
              {category.icon}
            </AnimatedIcon>
            <span className="font-bold tracking-wide text-lg">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LearningCategories;

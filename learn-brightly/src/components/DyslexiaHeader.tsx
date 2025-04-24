import React from 'react';
import { BookOpen, Settings, Volume2 } from 'lucide-react';
import IconButton from './IconButton';
import TextStyleSettings from './TextStyleSettings';

const DyslexiaHeader = () => {
  return (
    <header className="bg-pastel-blue py-4 px-6 rounded-b-2xl shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-primary animate-float" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">Learn Brightly</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full bg-pastel-yellow hover:bg-amber-200 transition-colors">
            <Volume2 className="h-6 w-6" />
          </button>
          <TextStyleSettings />
          <button className="p-2 rounded-full bg-pastel-purple hover:bg-purple-200 transition-colors">
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DyslexiaHeader;

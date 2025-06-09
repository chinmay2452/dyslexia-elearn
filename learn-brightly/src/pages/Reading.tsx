import React from 'react';
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import DyslexiaHeader from '../components/DyslexiaHeader';
import ReadingText from '../components/ReadingText';
import { BookOpen, Volume2, ArrowRight, Book } from 'lucide-react';
import AnimatedIcon from '../components/AnimatedIcon';

const Reading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-blue/30 pb-24">
      <DyslexiaHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Book className="mr-2 text-primary" />
          Reading Practice
        </h1>
        
        <div className="bg-pastel-yellow rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Today's Story</h2>
            <Button 
              variant="outline" 
              size="default" 
              className="flex items-center gap-2 bg-white/70 hover:bg-white"
            >
              <Volume2 className="h-5 w-5" /> 
              Read Aloud
            </Button>
          </div>
          
          <div className="bg-white/70 rounded-xl p-6 shadow-inner mb-4">
            <ReadingText size="lg">
              <span className="reading-highlight">Once upon a time</span>, in a magical forest, there lived a curious little fox named Luna. 
              Luna loved to explore and learn new things every day. One morning, she found a shiny 
              object near a big oak tree. It was a <span className="reading-highlight">golden key</span>!
            </ReadingText>
            
            <div className="my-6 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80" 
                alt="Magical forest scene" 
                className="rounded-xl shadow-md max-h-64 object-cover"
              />
            </div>
            
            <ReadingText size="lg">
              Luna was very excited! She had never seen such a beautiful key before. 
              She wondered what magical door it might open. With the key in her paw, 
              she set off on a new adventure through the forest.
            </ReadingText>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" className="rounded-xl">Previous Page</Button>
            <Button className="rounded-xl flex items-center gap-2">
              Next Page <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-pastel-green rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-lg mb-2">New Words</h3>
            <ul className="space-y-2">
              <li className="bg-white/50 rounded-lg p-2 flex justify-between items-center">
                <span>Curious</span>
                <Button 
                  size="default" 
                  variant="outline"
                  className="hover:bg-white/70"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </li>
              <li className="bg-white/50 rounded-lg p-2 flex justify-between items-center">
                <span>Magical</span>
                <Button 
                  size="default" 
                  variant="outline"
                  className="hover:bg-white/70"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </li>
              <li className="bg-white/50 rounded-lg p-2 flex justify-between items-center">
                <span>Adventure</span>
                <Button 
                  size="default" 
                  variant="outline"
                  className="hover:bg-white/70"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </li>
            </ul>
          </div>
          
          <div className="bg-pastel-pink rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-lg mb-2">Comprehension</h3>
            <div className="space-y-3">
              <ReadingText>Who is the main character in our story?</ReadingText>
              <Button className="w-full text-left justify-start bg-white/50 hover:bg-white/70">Mia the astronaut</Button>
              <Button className="w-full text-left justify-start bg-white/50 hover:bg-white/70">Tom the alien</Button>
              <Button className="w-full text-left justify-start bg-white/50 hover:bg-white/70">Luna the fox</Button>
            </div>
          </div>
          
          <div className="bg-pastel-purple rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-lg mb-2">Your Reading Stats</h3>
            <div className="space-y-4">
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-sm">Books Read This Week</div>
                <div className="text-2xl font-bold flex items-center">
                  <BookOpen className="mr-2 text-primary" /> 0
                </div>
              </div>
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-sm">Current Streak</div>
                <div className="text-2xl font-bold">0 days</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reading;

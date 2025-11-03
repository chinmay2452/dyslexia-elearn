
import React from 'react';
import DyslexiaHeader from '../components/DyslexiaHeader';
import ReadingText from '../components/ReadingText';
import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { BookOpen, Brain, Book, Lightbulb, HeartHandshake, School } from 'lucide-react';

const DyslexiaInfo = () => {
  // Check if user is a parent to apply normal font styling
  const user = localStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;
  const isParent = userData?.role === 'parent';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-blue/30 pb-24" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
      <DyslexiaHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-pastel-purple rounded-2xl p-6 mb-8 shadow-lg animate-pop">
          <h1 className="text-3xl font-bold mb-4" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>Understanding Dyslexia</h1>
          {isParent ? (
            <p className="text-lg mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
              Dyslexia is a learning difference that affects how people read, write, and spell. 
              It's not related to intelligence - many dyslexic people are very smart and creative! 
              Let's learn more about dyslexia and how we can make reading easier.
            </p>
          ) : (
            <ReadingText size="lg">
              Dyslexia is a learning difference that affects how people read, write, and spell. 
              It's not related to intelligence - many dyslexic people are very smart and creative! 
              Let's learn more about dyslexia and how we can make reading easier.
            </ReadingText>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-pastel-yellow border-amber-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
                <Brain className="h-6 w-6" />
                What is Dyslexia?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReadingText>
                Dyslexia is a common learning difference that makes it harder to recognize and 
                process letters and words. This can make reading slower and more difficult. 
                Between 5-10% of people have dyslexia, which means it's very common!
              </ReadingText>
              <img 
                src="/lovable-uploads/065a89b1-a79d-472d-8840-cf732f0a2c8b.png" 
                alt="Dyslexia font example showing the alphabet" 
                className="w-full rounded-lg mt-4 border-2 border-amber-200"
              />
            </CardContent>
          </Card>
          
          <Card className="bg-pastel-green border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-6 w-6" />
                How Does Dyslexia Feel?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReadingText>
                For many people with dyslexia, letters might appear to move around or flip 
                (like 'b' and 'd'). Words might seem jumbled, and reading can be tiring. 
                Special fonts like the one shown can help make reading easier by making 
                letters more distinct.
              </ReadingText>
              <div className="mt-4 p-4 bg-white/70 rounded-lg border-2 border-green-200">
                <p className="font-dyslexic text-xl font-bold">This is how text looks in a dyslexia-friendly font</p>
                <p className="font-sans text-xl font-bold mt-2">This is how text looks in a regular font</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white/60 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-amber-500" />
            Dyslexia Strengths
          </h2>
          
          <ReadingText size="lg">
            People with dyslexia often have amazing strengths! Many are:
          </ReadingText>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-pastel-blue p-4 rounded-xl shadow">
              <h3 className="font-bold">Creative Thinkers</h3>
              <p>Great at art, design, and coming up with new ideas!</p>
            </div>
            <div className="bg-pastel-pink p-4 rounded-xl shadow">
              <h3 className="font-bold">Problem Solvers</h3>
              <p>Excellent at finding different ways to solve problems</p>
            </div>
            <div className="bg-pastel-peach p-4 rounded-xl shadow">
              <h3 className="font-bold">Big Picture Thinkers</h3>
              <p>Can see how ideas connect in amazing ways</p>
            </div>
            <div className="bg-pastel-yellow p-4 rounded-xl shadow">
              <h3 className="font-bold">Storytellers</h3>
              <p>Often have rich imaginations and tell great stories</p>
            </div>
            <div className="bg-pastel-green p-4 rounded-xl shadow">
              <h3 className="font-bold">Determined</h3>
              <p>Learn to be persistent and never give up</p>
            </div>
            <div className="bg-pastel-purple p-4 rounded-xl shadow">
              <h3 className="font-bold">Entrepreneurial</h3>
              <p>Many successful business people have dyslexia</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-pastel-peach border-orange-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="h-6 w-6" />
                How We Can Help
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReadingText>
                There are many ways to make reading easier for people with dyslexia:
              </ReadingText>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Using special fonts that make letters easier to read</li>
                <li>Adjusting text spacing to reduce visual crowding</li>
                <li>Changing background colors to reduce contrast</li>
                <li>Using text-to-speech to listen while reading</li>
                <li>Taking breaks to prevent eye fatigue</li>
              </ul>
              <div className="mt-4">
                <p className="font-bold">Try our text settings button in the header!</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-pastel-blue border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-6 w-6" />
                Famous People with Dyslexia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReadingText>
                Many successful and brilliant people have dyslexia! Here are just a few:
              </ReadingText>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="font-bold">Albert Einstein</p>
                  <p className="text-sm">Physicist</p>
                </div>
                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="font-bold">Walt Disney</p>
                  <p className="text-sm">Animator</p>
                </div>
                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="font-bold">Steve Jobs</p>
                  <p className="text-sm">Apple founder</p>
                </div>
                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="font-bold">Steven Spielberg</p>
                  <p className="text-sm">Film director</p>
                </div>
                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="font-bold">Whoopi Goldberg</p>
                  <p className="text-sm">Actor</p>
                </div>
                <div className="bg-white/70 p-3 rounded-lg">
                  <p className="font-bold">Richard Branson</p>
                  <p className="text-sm">Entrepreneur</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DyslexiaInfo;

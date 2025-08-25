import React, { useState, useEffect, useRef } from 'react';
import DyslexiaHeader from '../components/DyslexiaHeader';
import ReadingText from '../components/ReadingText';
import { Button } from '../components/button';
import { Volume2, Clock, Trophy, ArrowLeft, Star, Crown, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Story {
  title: string;
  template: string;
  blanks: {
    word: string;
    options: string[];
    hint: string;
  }[];
}

interface GameScore {
  score: number;
  date: string;
  storiesCompleted: number;
}

const stories: Story[] = [
  {
    title: "The Magical Garden",
    template: "In a beautiful garden, there lived a [adjective] butterfly. It loved to [verb] among the [noun] flowers. One day, it found a [adjective] [noun] that sparkled in the sunlight.",
    blanks: [
      {
        word: "colorful",
        options: ["colorful", "tiny", "happy", "sleepy"],
        hint: "Think of a word that describes how something looks"
      },
      {
        word: "dance",
        options: ["dance", "sleep", "eat", "run"],
        hint: "What do butterflies do in gardens?"
      },
      {
        word: "beautiful",
        options: ["beautiful", "tall", "small", "wild"],
        hint: "How would you describe flowers?"
      },
      {
        word: "shiny",
        options: ["shiny", "old", "big", "small"],
        hint: "What word describes something that reflects light?"
      },
      {
        word: "crystal",
        options: ["crystal", "rock", "leaf", "flower"],
        hint: "What kind of object might sparkle in sunlight?"
      }
    ]
  },
  {
    title: "The Friendly Dragon",
    template: "Once upon a time, there was a [adjective] dragon who loved to [verb]. It lived in a [adjective] cave and collected [noun]. One day, it made friends with a [noun].",
    blanks: [
      {
        word: "friendly",
        options: ["friendly", "scary", "big", "small"],
        hint: "What word describes someone who is nice to others?"
      },
      {
        word: "read",
        options: ["read", "sleep", "fly", "eat"],
        hint: "What do you like to do with books?"
      },
      {
        word: "cozy",
        options: ["cozy", "dark", "cold", "wet"],
        hint: "What word describes a comfortable place?"
      },
      {
        word: "books",
        options: ["books", "rocks", "sticks", "leaves"],
        hint: "What do you collect to read?"
      },
      {
        word: "knight",
        options: ["knight", "princess", "wizard", "farmer"],
        hint: "Who might be friends with a dragon in stories?"
      }
    ]
  }
];

const StoryBuilder = () => {
  const navigate = useNavigate();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes per story
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [highScore, setHighScore] = useState<GameScore | null>(null);
  const [storiesCompleted, setStoriesCompleted] = useState(0);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const speechSynthesis = useRef(window.speechSynthesis);

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('storyBuilderHighScore');
    if (savedHighScore) {
      setHighScore(JSON.parse(savedHighScore));
    }

    // Start timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8; // Slightly slower for better understanding
    speechSynthesis.current.speak(utterance);
  };

  const handleAnswer = (answer: string, index: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = answer;
    setUserAnswers(newAnswers);

    // Check if all blanks are filled
    if (newAnswers.filter(Boolean).length === stories[currentStoryIndex].blanks.length) {
      checkStory();
    }
  };

  const checkStory = () => {
    const currentStory = stories[currentStoryIndex];
    let correctAnswers = 0;

    currentStory.blanks.forEach((blank, index) => {
      if (userAnswers[index]?.toLowerCase() === blank.word.toLowerCase()) {
        correctAnswers++;
      }
    });

    const storyScore = Math.round((correctAnswers / currentStory.blanks.length) * 50);
    setScore(prev => prev + storyScore);
    setStoriesCompleted(prev => prev + 1);

    if (currentStoryIndex < stories.length - 1) {
      // Move to next story
      setCurrentStoryIndex(prev => prev + 1);
      setUserAnswers([]);
      setTimeLeft(180);
      setShowHint(null);
    } else {
      setGameWon(true);
      endGame();
    }
  };

  const endGame = () => {
    setGameOver(true);
    
    setHighScore(prevHighScore => {
      const finalScore: GameScore = {
        score,
        date: new Date().toLocaleDateString(),
        storiesCompleted
      };

      if (!prevHighScore || score > prevHighScore.score) {
        localStorage.setItem('storyBuilderHighScore', JSON.stringify(finalScore));
        return finalScore;
      }
      return prevHighScore;
    });
  };

  const restartGame = () => {
    setCurrentStoryIndex(0);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(180);
    setGameOver(false);
    setGameWon(false);
    setShowHint(null);
    setStoriesCompleted(0);
    setFeedback(null);
  };

  const getStoryWithAnswers = () => {
    let story = stories[currentStoryIndex].template;
    stories[currentStoryIndex].blanks.forEach((blank, index) => {
      const answer = userAnswers[index] || '_____';
      story = story.replace(`[${blank.word}]`, answer);
    });
    return story;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-blue/30 pb-24">
      <DyslexiaHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/games')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Games
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/50 rounded-lg px-4 py-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
            <div className="bg-white/50 rounded-lg px-4 py-2 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span className="font-bold">{score} points</span>
            </div>
            {highScore && (
              <div className="bg-white/50 rounded-lg px-4 py-2 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">High: {highScore.score}</span>
              </div>
            )}
          </div>
        </div>

        {gameOver ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <h2 className="text-3xl font-bold mb-4">
              {gameWon ? '🎉 You Win! 🎉' : 'Game Over!'}
            </h2>
            <p className="text-xl mb-2">Your score: {score} points</p>
            <p className="text-lg mb-4">Stories completed: {storiesCompleted}/{stories.length}</p>
            {gameWon && (
              <p className="text-lg mb-4 text-green-600">
                Time remaining: {timeLeft} seconds
              </p>
            )}
            {highScore && (
              <div className="mb-6 p-4 bg-pastel-blue/30 rounded-xl">
                <h3 className="text-lg font-bold mb-2">High Score</h3>
                <p>Score: {highScore.score} points</p>
                <p>Date: {highScore.date}</p>
                <p>Stories Completed: {highScore.storiesCompleted}</p>
              </div>
            )}
            <div className="flex justify-center gap-4">
              <Button onClick={restartGame}>Play Again</Button>
              <Button variant="outline" onClick={() => navigate('/games')}>
                Back to Games
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">{stories[currentStoryIndex].title}</h2>
              <div className="mb-6">
                <ReadingText size="lg">
                  {getStoryWithAnswers()}
                </ReadingText>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakText(getStoryWithAnswers())}
                  className="mt-2"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Read Story
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stories[currentStoryIndex].blanks.map((blank, index) => (
                  <div key={index} className="bg-pastel-blue/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">Blank {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHint(showHint === index ? null : index)}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    {showHint === index && (
                      <p className="text-sm text-gray-600 mb-2">{blank.hint}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      {blank.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(option, index)}
                          className={`p-2 rounded-lg text-center transition-all
                            ${userAnswers[index] === option 
                              ? 'bg-primary text-white' 
                              : 'bg-white/50 hover:bg-white/70'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StoryBuilder; 
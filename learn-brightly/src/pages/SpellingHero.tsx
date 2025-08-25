import React, { useState, useEffect, useRef } from 'react';
import DyslexiaHeader from '../components/DyslexiaHeader';
import ReadingText from '../components/ReadingText';
import { Button } from '../components/button';
import { Volume2, Clock, Trophy, ArrowLeft, Star, Crown, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Word {
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hint: string;
}

const words: Word[] = [
  { word: 'cat', difficulty: 'easy', hint: 'A furry pet that says meow' },
  { word: 'dog', difficulty: 'easy', hint: 'A loyal pet that says woof' },
  { word: 'book', difficulty: 'easy', hint: 'You read this to learn stories' },
  { word: 'tree', difficulty: 'easy', hint: 'Tall plant with leaves' },
  { word: 'house', difficulty: 'medium', hint: 'Where you live' },
  { word: 'school', difficulty: 'medium', hint: 'Where you go to learn' },
  { word: 'friend', difficulty: 'medium', hint: 'Someone you like to play with' },
  { word: 'family', difficulty: 'medium', hint: 'People you live with' },
  { word: 'beautiful', difficulty: 'hard', hint: 'Very pretty' },
  { word: 'elephant', difficulty: 'hard', hint: 'Big animal with a trunk' },
];

interface GameScore {
  score: number;
  date: string;
  wordsCorrect: number;
}

const SpellingHero = () => {
  const navigate = useNavigate();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [highScore, setHighScore] = useState<GameScore | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [wordsCorrect, setWordsCorrect] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const speechSynthesis = useRef(window.speechSynthesis);

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('spellingHeroHighScore');
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

  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(words[currentWordIndex].word);
    utterance.rate = 0.8; // Slightly slower for better understanding
    speechSynthesis.current.speak(utterance);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentWord = words[currentWordIndex].word.toLowerCase();
    const userWord = userInput.toLowerCase().trim();

    if (userWord === currentWord) {
      setScore(prev => prev + 10);
      setWordsCorrect(prev => prev + 1);
      setFeedback('correct');
      
      // Move to next word after a short delay
      setTimeout(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
          setUserInput('');
          setShowHint(false);
          setFeedback(null);
        } else {
          setGameWon(true);
          endGame();
        }
      }, 1000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const endGame = () => {
    setGameOver(true);
    
    // Use a callback to ensure we have the latest state values
    setHighScore(prevHighScore => {
      const finalScore: GameScore = {
        score,
        date: new Date().toLocaleDateString(),
        wordsCorrect
      };

      // Update high score if current score is higher
      if (!prevHighScore || score > prevHighScore.score) {
        localStorage.setItem('spellingHeroHighScore', JSON.stringify(finalScore));
        return finalScore;
      }
      return prevHighScore;
    });
  };

  const restartGame = () => {
    setCurrentWordIndex(0);
    setUserInput('');
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setGameWon(false);
    setShowHint(false);
    setWordsCorrect(0);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-yellow/30 pb-24">
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
            <p className="text-lg mb-4">Words correct: {wordsCorrect}/{words.length}</p>
            {gameWon && (
              <p className="text-lg mb-4 text-green-600">
                Time remaining: {timeLeft} seconds
              </p>
            )}
            {highScore && (
              <div className="mb-6 p-4 bg-pastel-yellow/30 rounded-xl">
                <h3 className="text-lg font-bold mb-2">High Score</h3>
                <p>Score: {highScore.score} points</p>
                <p>Date: {highScore.date}</p>
                <p>Words Correct: {highScore.wordsCorrect}</p>
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
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Spelling Hero</h2>
              <p className="text-lg mb-4">Listen to the word and spell it correctly!</p>
              <div className="flex justify-center gap-4 mb-6">
                <Button onClick={speakWord} className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" /> Hear Word
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="h-5 w-5" /> {showHint ? 'Hide Hint' : 'Show Hint'}
                </Button>
              </div>
              {showHint && (
                <div className="bg-pastel-blue/30 rounded-xl p-4 mb-4">
                  <p className="font-bold">Hint:</p>
                  <p>{words[currentWordIndex].hint}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className={`w-full max-w-md p-4 text-xl text-center rounded-xl border-2 transition-colors
                    ${feedback === 'correct' ? 'border-green-500 bg-green-50' : 
                      feedback === 'incorrect' ? 'border-red-500 bg-red-50' : 
                      'border-gray-200 focus:border-primary'}`}
                  placeholder="Type the word here..."
                  autoFocus
                />
                {feedback === 'correct' && (
                  <p className="text-green-600 mt-2">Correct! 🎉</p>
                )}
                {feedback === 'incorrect' && (
                  <p className="text-red-600 mt-2">Try again! 💪</p>
                )}
              </div>
              <div className="flex justify-center">
                <Button type="submit" className="px-8 py-3 text-lg">
                  Check Spelling
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Word {currentWordIndex + 1} of {words.length}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SpellingHero; 
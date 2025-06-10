import React, { useState, useEffect, useRef } from 'react';
import DyslexiaHeader from '../components/DyslexiaHeader';
import ReadingText from '../components/ReadingText';
import { Button } from '../components/button';
import { Volume2, Clock, Trophy, ArrowLeft, Star, Crown, Target, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WordBubble {
  id: number;
  word: string;
  category: string;
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface Category {
  name: string;
  words: string[];
  color: string;
}

interface GameScore {
  score: number;
  date: string;
  bubblesPopped: number;
  accuracy: number;
}

const categories: Category[] = [
  {
    name: "Animals",
    words: ["cat", "dog", "bird", "fish", "lion", "tiger", "bear", "wolf", "fox", "deer"],
    color: "bg-pastel-green"
  },
  {
    name: "Fruits",
    words: ["apple", "banana", "orange", "grape", "mango", "pear", "peach", "plum", "kiwi", "berry"],
    color: "bg-pastel-red"
  },
  {
    name: "Colors",
    words: ["red", "blue", "green", "yellow", "purple", "pink", "orange", "brown", "black", "white"],
    color: "bg-pastel-blue"
  },
  {
    name: "School",
    words: ["book", "pencil", "desk", "chair", "teacher", "student", "class", "learn", "read", "write"],
    color: "bg-pastel-yellow"
  }
];

const WordBubbles = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [highScore, setHighScore] = useState<GameScore | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category>(categories[0]);
  const [bubbles, setBubbles] = useState<WordBubble[]>([]);
  const [bubblesPopped, setBubblesPopped] = useState(0);
  const [missedBubbles, setMissedBubbles] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameSpeed, setGameSpeed] = useState(1); // 1 is normal speed
  const [isPaused, setIsPaused] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = useRef(window.speechSynthesis);

  useEffect(() => {
    // Load high score and speed preference from localStorage
    const savedHighScore = localStorage.getItem('wordBubblesHighScore');
    const savedSpeed = localStorage.getItem('wordBubblesSpeed');
    if (savedHighScore) {
      setHighScore(JSON.parse(savedHighScore));
    }
    if (savedSpeed) {
      setGameSpeed(parseFloat(savedSpeed));
    }

    // Start timer
    const timer = setInterval(() => {
      if (!isPaused) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    // Start bubble generation
    const bubbleInterval = setInterval(() => {
      if (!gameOver && !isPaused) {
        generateBubble();
      }
    }, 2000 / gameSpeed); // Adjust generation rate based on speed

    return () => {
      clearInterval(timer);
      clearInterval(bubbleInterval);
    };
  }, [gameOver, gameSpeed, isPaused]);

  const generateBubble = () => {
    if (!gameAreaRef.current) return;

    const gameArea = gameAreaRef.current;
    const isCurrentCategory = Math.random() > 0.3;
    const word = isCurrentCategory
      ? currentCategory.words[Math.floor(Math.random() * currentCategory.words.length)]
      : categories[Math.floor(Math.random() * categories.length)].words[
          Math.floor(Math.random() * 10)
        ];

    const bubble: WordBubble = {
      id: Date.now(),
      word,
      category: isCurrentCategory ? currentCategory.name : "other",
      x: Math.random() * (gameArea.clientWidth - 100),
      y: gameArea.clientHeight,
      speed: (1 + Math.random() * 2) * gameSpeed, // Adjust speed based on game speed
      size: 60 + Math.random() * 40
    };

    setBubbles(prev => [...prev, bubble]);

    // Remove bubble if not popped within 10 seconds
    setTimeout(() => {
      setBubbles(prev => {
        const newBubbles = prev.filter(b => b.id !== bubble.id);
        if (newBubbles.length !== prev.length) {
          setMissedBubbles(prev => prev + 1);
          updateAccuracy();
        }
        return newBubbles;
      });
    }, 10000 / gameSpeed); // Adjust timeout based on speed
  };

  const updateBubbles = () => {
    setBubbles(prev => 
      prev.map(bubble => ({
        ...bubble,
        y: bubble.y - bubble.speed
      })).filter(bubble => bubble.y > -100)
    );
  };

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      if (!gameOver) {
        updateBubbles();
      }
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [bubbles, gameOver]);

  const handleBubbleClick = (bubble: WordBubble) => {
    if (bubble.category === currentCategory.name) {
      setScore(prev => prev + 10);
      setBubblesPopped(prev => prev + 1);
      speakWord(bubble.word);
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setMissedBubbles(prev => prev + 1);
    }
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    updateAccuracy();
  };

  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.8;
    speechSynthesis.current.speak(utterance);
  };

  const updateAccuracy = () => {
    const total = bubblesPopped + missedBubbles;
    if (total > 0) {
      setAccuracy(Math.round((bubblesPopped / total) * 100));
    }
  };

  const changeCategory = () => {
    const currentIndex = categories.findIndex(cat => cat.name === currentCategory.name);
    const nextIndex = (currentIndex + 1) % categories.length;
    setCurrentCategory(categories[nextIndex]);
  };

  const endGame = () => {
    setGameOver(true);
    
    setHighScore(prevHighScore => {
      const finalScore: GameScore = {
        score,
        date: new Date().toLocaleDateString(),
        bubblesPopped,
        accuracy
      };

      if (!prevHighScore || score > prevHighScore.score) {
        localStorage.setItem('wordBubblesHighScore', JSON.stringify(finalScore));
        return finalScore;
      }
      return prevHighScore;
    });
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setGameWon(false);
    setBubbles([]);
    setBubblesPopped(0);
    setMissedBubbles(0);
    setAccuracy(100);
    setCurrentCategory(categories[0]);
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(event.target.value);
    setGameSpeed(newSpeed);
    localStorage.setItem('wordBubblesSpeed', newSpeed.toString());
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-blue/30 pb-24">
      <DyslexiaHeader />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
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
            <p className="text-lg mb-2">Bubbles popped: {bubblesPopped}</p>
            <p className="text-lg mb-4">Accuracy: {accuracy}%</p>
            {highScore && (
              <div className="mb-6 p-4 bg-pastel-blue/30 rounded-xl">
                <h3 className="text-lg font-bold mb-2">High Score</h3>
                <p>Score: {highScore.score} points</p>
                <p>Date: {highScore.date}</p>
                <p>Bubbles Popped: {highScore.bubblesPopped}</p>
                <p>Accuracy: {highScore.accuracy}%</p>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Pop the {currentCategory.name}!</h2>
                <div className="flex items-center gap-4">
                  <Button onClick={togglePause} variant="outline">
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button onClick={changeCategory} variant="outline">
                    Change Category
                  </Button>
                </div>
              </div>

              <div className="bg-pastel-blue/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-bold">Current Category: {currentCategory.name}</p>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-primary" />
                    <span className="font-bold">Speed: {gameSpeed.toFixed(1)}x</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Pop bubbles with {currentCategory.name.toLowerCase()} words to earn points!
                  Popping wrong words will lose points.
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold">Slow</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={gameSpeed}
                    onChange={handleSpeedChange}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    disabled={isPaused}
                  />
                  <span className="text-sm font-bold">Fast</span>
                </div>
              </div>
              
              <div 
                ref={gameAreaRef}
                className="relative h-[500px] bg-gradient-to-b from-pastel-blue/20 to-pastel-purple/20 rounded-xl overflow-hidden"
              >
                {bubbles.map(bubble => (
                  <button
                    key={bubble.id}
                    onClick={() => handleBubbleClick(bubble)}
                    className={`absolute transition-all duration-300 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:scale-105
                      ${bubble.category === currentCategory.name ? currentCategory.color : 'bg-gray-400'}`}
                    style={{
                      left: `${bubble.x}px`,
                      top: `${bubble.y}px`,
                      width: `${bubble.size}px`,
                      height: `${bubble.size}px`,
                      fontSize: `${bubble.size / 4}px`
                    }}
                  >
                    {bubble.word}
                  </button>
                ))}
                {isPaused && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white text-4xl font-bold">PAUSED</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WordBubbles; 
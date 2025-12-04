import React, { useState, useEffect } from 'react';
import DyslexiaHeader from '../components/DyslexiaHeader';
import supabase from '../../supabase';
import ReadingText from '../components/ReadingText';
import { Button } from '../components/button';
import { Volume2, Clock, Trophy, ArrowLeft, Star, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WordPair {
  word: string;
  image: string;
  audio: string;
}

interface GameScore {
  score: number;
  date: string;
  timeLeft: number;
}

const wordPairs: WordPair[] = [
  {
    word: 'Apple',
    image: 'https://placehold.co/200x200/FF6B6B/FFFFFF?text=Apple',
    audio: '/audio/apple.mp3'
  },
  {
    word: 'Ball',
    image: 'https://placehold.co/200x200/4ECDC4/FFFFFF?text=Ball',
    audio: '/audio/ball.mp3'
  },
  {
    word: 'Cat',
    image: 'https://placehold.co/200x200/FFD93D/FFFFFF?text=Cat',
    audio: '/audio/cat.mp3'
  },
  {
    word: 'Dog',
    image: 'https://placehold.co/200x200/95E1D3/FFFFFF?text=Dog',
    audio: '/audio/dog.mp3'
  },
  {
    word: 'Elephant',
    image: 'https://placehold.co/200x200/F8B195/FFFFFF?text=Elephant',
    audio: '/audio/elephant.mp3'
  },
  {
    word: 'Fish',
    image: 'https://placehold.co/200x200/6C5B7B/FFFFFF?text=Fish',
    audio: '/audio/fish.mp3'
  },
];

const WordMatch = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [highScore, setHighScore] = useState<GameScore | null>(null);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('wordMatchHighScore');
    if (savedHighScore) {
      setHighScore(JSON.parse(savedHighScore));
    }

    // Shuffle words and images
    const words = wordPairs.map(pair => pair.word);
    const images = wordPairs.map(pair => pair.image);
    setShuffledWords(shuffleArray([...words]));
    setShuffledImages(shuffleArray([...images]));

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

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleWordClick = (word: string) => {
    if (matchedPairs.includes(word)) return;
    setSelectedWord(word);
    checkMatch(word, selectedImage);
  };

  const handleImageClick = (image: string) => {
    if (matchedPairs.includes(image)) return;
    setSelectedImage(image);
    checkMatch(selectedWord, image);
  };

  const checkMatch = (word: string | null, image: string | null) => {
    if (!word || !image) return;

    const wordPair = wordPairs.find(pair => pair.word === word);
    if (wordPair && wordPair.image === image) {
      const newMatchedPairs = [...matchedPairs, word, image];
      setMatchedPairs(newMatchedPairs);
      const newScore = score + 10;
      setScore(newScore);

      // Check if all pairs are matched
      if (newMatchedPairs.length === wordPairs.length * 2) {
        setGameWon(true);
        endGame();
      }

      setSelectedWord(null);
      setSelectedImage(null);
    } else {
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedImage(null);
      }, 1000);
    }
  };

  const endGame = async () => {
    setGameOver(true);
    const finalScore: GameScore = {
      score,
      date: new Date().toLocaleDateString(),
      timeLeft
    };

    // Update high score if current score is higher
    if (!highScore || score > highScore.score) {
      setHighScore(finalScore);
      localStorage.setItem('wordMatchHighScore', JSON.stringify(finalScore));
    }

    // Save progress to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Get current progress
        const { data: currentProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const currentXP = currentProgress?.xp || 0;
        const currentGames = currentProgress?.games_played || 0;

        // 2. Update progress (Add 50 XP for playing, + score)
        const xpEarned = 50 + score;

        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            xp: currentXP + xpEarned,
            games_played: currentGames + 1,
            last_activity_date: new Date().toISOString()
          });

        // 3. Check for achievements
        if (currentGames === 0) {
          await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              achievement_id: 'first_game',
              unlocked_at: new Date().toISOString()
            });
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const playAudio = (word: string) => {
    const pair = wordPairs.find(pair => pair.word === word);
    if (pair) {
      const audio = new Audio(pair.audio);
      audio.play();
    }
  };

  const restartGame = () => {
    setTimeLeft(60);
    setScore(0);
    setSelectedWord(null);
    setSelectedImage(null);
    setMatchedPairs([]);
    setGameOver(false);
    setGameWon(false);

    // Reshuffle words and images
    const words = wordPairs.map(pair => pair.word);
    const images = wordPairs.map(pair => pair.image);
    setShuffledWords(shuffleArray([...words]));
    setShuffledImages(shuffleArray([...images]));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-pink/30 pb-24">
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
                <p>Time Left: {highScore.timeLeft} seconds</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Words Section */}
            <div className="bg-pastel-blue rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Words</h2>
              <div className="grid grid-cols-2 gap-4">
                {shuffledWords.map((word) => (
                  <button
                    key={word}
                    onClick={() => handleWordClick(word)}
                    className={`p-4 rounded-xl text-center font-bold text-lg transition-all
                      ${selectedWord === word ? 'bg-white scale-105' : 'bg-white/50 hover:bg-white/70'}
                      ${matchedPairs.includes(word) ? 'opacity-50 cursor-default' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{word}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(word);
                        }}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-pastel-green rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Pictures</h2>
              <div className="grid grid-cols-2 gap-4">
                {shuffledImages.map((image) => (
                  <button
                    key={image}
                    onClick={() => handleImageClick(image)}
                    className={`p-4 rounded-xl transition-all aspect-square
                      ${selectedImage === image ? 'bg-white scale-105' : 'bg-white/50 hover:bg-white/70'}
                      ${matchedPairs.includes(image) ? 'opacity-50 cursor-default' : ''}`}
                  >
                    <img
                      src={image}
                      alt="Match me!"
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/200x200/FF6B6B/FFFFFF?text=Error';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WordMatch; 
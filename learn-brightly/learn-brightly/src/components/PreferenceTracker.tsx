import React, { useEffect, useState } from 'react';
import { Heart, Flame, Star, TrendingUp } from 'lucide-react';
import ReadingText from './ReadingText';

interface GamePreference {
  gameName: string;
  timesPlayed: number;
  lastPlayed?: string;
}

interface VideoPreference {
  topic: string;
  videosWatched: number;
  lastWatched?: string;
}

interface PreferenceTrackerProps {
  gamesPlayed?: number;
  storiesRead?: number;
}

const PreferenceTracker: React.FC<PreferenceTrackerProps> = () => {
  const [gamePreferences, setGamePreferences] = useState<GamePreference[]>([]);
  const [videoPreferences, setVideoPreferences] = useState<VideoPreference[]>([]);

  useEffect(() => {
    // Load preferences from localStorage
    const savedGamePrefs = localStorage.getItem('gamePreferences');
    const savedVideoPrefs = localStorage.getItem('videoPreferences');

    if (savedGamePrefs) {
      setGamePreferences(JSON.parse(savedGamePrefs));
    } else {
      // Initialize with default games
      setGamePreferences([
        { gameName: 'Word Match', timesPlayed: 0 },
        { gameName: 'Spelling Hero', timesPlayed: 0 },
        { gameName: 'Story Builder', timesPlayed: 0 },
        { gameName: 'Word Bubbles', timesPlayed: 0 }
      ]);
    }

    if (savedVideoPrefs) {
      setVideoPreferences(JSON.parse(savedVideoPrefs));
    } else {
      // Initialize with default topics
      setVideoPreferences([
        { topic: 'Dyslexia Basics', videosWatched: 0 },
        { topic: 'Reading Strategies', videosWatched: 0 },
        { topic: 'Writing Tips', videosWatched: 0 },
        { topic: 'Spelling Help', videosWatched: 0 }
      ]);
    }
  }, []);

  // Track game plays - can be called from game components
  const trackGamePlay = (gameName: string) => {
    const updatedPrefs = gamePreferences.map(game =>
      game.gameName === gameName
        ? { ...game, timesPlayed: game.timesPlayed + 1, lastPlayed: new Date().toISOString() }
        : game
    );
    setGamePreferences(updatedPrefs);
    localStorage.setItem('gamePreferences', JSON.stringify(updatedPrefs));
  };

  // Track video watch - can be called from video components
  const trackVideoWatch = (topic: string) => {
    const updatedPrefs = videoPreferences.map(video =>
      video.topic === topic
        ? { ...video, videosWatched: video.videosWatched + 1, lastWatched: new Date().toISOString() }
        : video
    );
    setVideoPreferences(updatedPrefs);
    localStorage.setItem('videoPreferences', JSON.stringify(updatedPrefs));
  };

  // Export for tracking (can be called from other components)
  React.useEffect(() => {
    (window as any).trackGamePlay = trackGamePlay;
    (window as any).trackVideoWatch = trackVideoWatch;
  }, [trackGamePlay, trackVideoWatch]);

  const topGames = [...gamePreferences]
    .sort((a, b) => b.timesPlayed - a.timesPlayed)
    .slice(0, 3)
    .filter(g => g.timesPlayed > 0);

  const topTopics = [...videoPreferences]
    .sort((a, b) => b.videosWatched - a.videosWatched)
    .slice(0, 3)
    .filter(v => v.videosWatched > 0);

  const totalPlayed = gamePreferences.reduce((sum, game) => sum + game.timesPlayed, 0);
  const totalWatched = videoPreferences.reduce((sum, video) => sum + video.videosWatched, 0);

  return (
    <div className="bg-gradient-to-br from-pastel-pink/30 to-pastel-purple/20 rounded-2xl p-6 shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Heart className="h-6 w-6 text-red-500" />
        Your Preferences
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Favorite Games */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Your Favorite Games
          </h3>

          {topGames.length > 0 ? (
            <div className="space-y-3">
              {topGames.map((game, index) => (
                <div key={game.gameName} className="bg-white/60 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-orange-300 to-orange-500 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{game.gameName}</p>
                      <p className="text-xs text-gray-600">{game.timesPlayed} times played</p>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {index === 0 && '🏆'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/40 rounded-lg p-4 text-center text-gray-600 text-sm">
              <p>Start playing games to see your preferences!</p>
            </div>
          )}

          <div className="mt-4 bg-blue-100 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-800">
              💡 Tip: We'll recommend more games like <span className="font-bold">{topGames[0]?.gameName || 'your favorites'}</span>!
            </p>
          </div>
        </div>

        {/* Favorite Topics */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Your Favorite Topics
          </h3>

          {topTopics.length > 0 ? (
            <div className="space-y-3">
              {topTopics.map((topic, index) => (
                <div key={topic.topic} className="bg-white/60 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{topic.topic}</p>
                      <p className="text-xs text-gray-600">{topic.videosWatched} videos watched</p>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {index === 0 && '🏆'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/40 rounded-lg p-4 text-center text-gray-600 text-sm">
              <p>Watch videos to see your favorite topics!</p>
            </div>
          )}

          <div className="mt-4 bg-purple-100 rounded-lg p-3">
            <p className="text-xs font-semibold text-purple-800">
              💡 Tip: Check out more videos on <span className="font-bold">{topTopics[0]?.topic || 'your favorite topics'}</span>!
            </p>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-4 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <ReadingText className="text-sm">
            You've played <span className="font-bold text-green-700">{totalPlayed} games</span> and watched <span className="font-bold text-blue-700">{totalWatched} videos</span>. 
            Keep exploring to unlock more personalized recommendations!
          </ReadingText>
          <TrendingUp className="h-6 w-6 text-green-600 flex-shrink-0" />
        </div>
      </div>

      {/* Export utility function for tracking */}
      <div className="hidden">
        {/* These would be called from game/video components */}
      </div>
    </div>
  );
};

export default PreferenceTracker;

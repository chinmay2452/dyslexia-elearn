import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X } from 'lucide-react';
import { Button } from './button';

// Add TypeScript types for YouTube IFrame API
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string;
  title: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<YT.Player | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if YouTube API is already loaded
    if (window.YT) {
      initializePlayer();
    } else {
      // Load YouTube IFrame API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Initialize player when API is ready
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    // Update current time every second
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const initializePlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        fs: 0,
      },
      events: {
        onReady: (event) => {
          setDuration(event.target.getDuration());
        },
        onStateChange: (event) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
        onError: (event) => {
          console.error('YouTube Player Error:', event);
        }
      },
    });
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const skipForward = () => {
    if (playerRef.current) {
      const newTime = Math.min(currentTime + 10, duration);
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const skipBackward = () => {
    if (playerRef.current) {
      const newTime = Math.max(currentTime - 10, 0);
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden relative" ref={containerRef}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all hover:scale-110"
          aria-label="Close video"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="relative aspect-video">
          <div id="youtube-player" className="w-full h-full" />
        </div>
        
        <div className="p-4 bg-pastel-yellow">
          <h3 className="text-xl font-bold mb-4">{title}</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 bg-white/50 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                className="bg-white/50 hover:bg-white"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={skipBackward}
                className="bg-white/50 hover:bg-white"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={skipForward}
                className="bg-white/50 hover:bg-white"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
                className="bg-white/50 hover:bg-white"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white/50 hover:bg-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 
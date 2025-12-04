import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Play, Pause, SkipForward, SkipBack, Volume2, Maximize } from 'lucide-react';
import DyslexiaHeader from '../components/DyslexiaHeader';
import ReadingText from '../components/ReadingText';
import { Card, CardContent } from '../components/card';

interface VideoResource {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: 'reading' | 'phonics' | 'spelling' | 'comprehension';
  level: 'beginner' | 'intermediate' | 'expert' | 'advanced';
  youtubeUrl?: string;
  videoUrl?: string; // Local or external video URL
}

const VideoPlayer: React.FC<{ video: VideoResource; onClose: () => void }> = ({ video, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Check if it's a YouTube URL
  const isYouTube = video.videoUrl?.includes('youtube.com') || video.videoUrl?.includes('youtu.be');

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + seconds);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-red-500 hover:bg-red-600 rounded-full p-2 transition-colors"
          title="Close video"
        >
          <span className="text-white text-xl font-bold">✕</span>
        </button>
        <CardContent className="p-0">
          {/* Video Container */}
          <div className="bg-black relative">
            {isYouTube ? (
              // YouTube Embed
              <iframe
                width="100%"
                height="500"
                src={video.videoUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full"
              ></iframe>
            ) : (
              // HTML5 Video
              <>
                <video
                  ref={videoRef}
                  className="w-full aspect-video bg-black"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  controls
                >
                  <source src={video.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Controls for non-YouTube videos */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity group">
                  {/* Progress Bar */}
                  <div className="mb-3 w-full">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={(e) => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = parseFloat(e.target.value);
                        }
                      }}
                      className="w-full h-1 bg-gray-600 rounded cursor-pointer appearance-none"
                      style={{
                        background: `linear-gradient(to right, #A38BFE 0%, #A38BFE ${progressPercent}%, #4B5563 ${progressPercent}%, #4B5563 100%)`
                      }}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Skip Back 10s */}
                      <button
                        onClick={() => handleSkip(-10)}
                        className="bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
                        title="Skip back 10 seconds"
                      >
                        <SkipBack className="w-5 h-5 text-white" />
                      </button>

                      {/* Play/Pause */}
                      <button
                        onClick={handlePlayPause}
                        className="bg-primary hover:bg-primary/90 rounded-full p-3 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white" />
                        )}
                      </button>

                      {/* Skip Forward 10s */}
                      <button
                        onClick={() => handleSkip(10)}
                        className="bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors"
                        title="Skip forward 10 seconds"
                      >
                        <SkipForward className="w-5 h-5 text-white" />
                      </button>

                      {/* Time Display */}
                      <span className="text-white text-sm ml-4">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Video Info */}
          <div className="p-6">
            <div className="flex gap-4">
              <span className="inline-block bg-pastel-blue/30 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {video.category}
              </span>
              <span className="inline-block bg-pastel-peach/30 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {video.level}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface VideoResource {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: 'reading' | 'phonics' | 'spelling' | 'comprehension';
  level: 'beginner' | 'intermediate' | 'expert' | 'advanced';
  youtubeUrl?: string;
  videoUrl?: string; // Local or external video URL
}

const videos: VideoResource[] = [
  // Beginner Videos
  {
    id: '1',
    title: 'Dyslexia: An Explanation for Kids',
    description: 'Easy-to-follow, kid-friendly introduction to dyslexia.',
    duration: '5:30',
    thumbnail: 'https://img.youtube.com/vi/GaouXlmYsfw/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'beginner' as const,
    videoUrl: 'https://www.youtube.com/embed/GaouXlmYsfw',
  },
  {
    id: '2',
    title: 'See Dyslexia Differently',
    description: 'Animated video from a dyslexia-awareness organization.',
    duration: '4:15',
    thumbnail: 'https://img.youtube.com/vi/11r7CFlK2sc/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'beginner' as const,
    videoUrl: 'https://www.youtube.com/embed/11r7CFlK2sc',
  },
  {
    id: '3',
    title: 'Life with Dyslexia: Sophie\'s Story',
    description: 'A child\'s real-life experience with dyslexia.',
    duration: '6:45',
    thumbnail: 'https://img.youtube.com/vi/CfMm1ZVirzA/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'beginner' as const,
    videoUrl: 'https://www.youtube.com/embed/CfMm1ZVirzA',
  },
  {
    id: '4',
    title: 'How to Teach Kids With Dyslexia to Read',
    description: 'Overview of reading strategies for dyslexic children.',
    duration: '8:20',
    thumbnail: 'https://img.youtube.com/vi/7DdrfCj_POE/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'beginner' as const,
    videoUrl: 'https://www.youtube.com/embed/7DdrfCj_POE',
  },
  
  // Intermediate Videos
  {
    id: '5',
    title: 'DYSLEXIA | What Is Dyslexia? | Learning Disability',
    description: 'Basic neuro-explanation and dyslexia awareness.',
    duration: '12:45',
    thumbnail: 'https://img.youtube.com/vi/65psPXWzNic/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'intermediate' as const,
    videoUrl: 'https://www.youtube.com/embed/65psPXWzNic',
  },
  {
    id: '6',
    title: 'What is Dyslexia? - Educational Department',
    description: 'Recent video explaining dyslexia clearly.',
    duration: '10:30',
    thumbnail: 'https://img.youtube.com/vi/JZF1xZxBihc/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'intermediate' as const,
    videoUrl: 'https://www.youtube.com/embed/JZF1xZxBihc',
  },
  {
    id: '7',
    title: 'What is Dyslexia? - Kelli Sandman-Hurley',
    description: 'Explains underlying causes and how it affects reading.',
    duration: '14:20',
    thumbnail: 'https://img.youtube.com/vi/zafiGBrFkRM/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'intermediate' as const,
    videoUrl: 'https://www.youtube.com/embed/zafiGBrFkRM',
  },
  {
    id: '8',
    title: 'Reading & Spelling For Kids With Dyslexia',
    description: 'First-step practical reading and spelling advice.',
    duration: '11:15',
    thumbnail: 'https://img.youtube.com/vi/yHsl3zqayF8/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'intermediate' as const,
    videoUrl: 'https://www.youtube.com/embed/yHsl3zqayF8',
  },
  
  // Expert Videos
  {
    id: '9',
    title: 'What is Dyslexia and Why Is It Often Misunderstood?',
    description: 'Boston Children\'s Hospital - detailed talk about dyslexia, myths, diagnosis, and support.',
    duration: '16:40',
    thumbnail: 'https://img.youtube.com/vi/XFVP_hvx8-s/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'expert' as const,
    videoUrl: 'https://www.youtube.com/embed/XFVP_hvx8-s',
  },
  {
    id: '10',
    title: 'What Is Dyslexia - IDA Oregon',
    description: 'Covers severity range, long-term potential, and strengths.',
    duration: '13:50',
    thumbnail: 'https://img.youtube.com/vi/FvrC3zqk3ao/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'expert' as const,
    videoUrl: 'https://www.youtube.com/embed/FvrC3zqk3ao',
  },
  {
    id: '11',
    title: 'Dyslexia Explained: What\'s It Like Being Dyslexic?',
    description: 'In-depth explanation from The Dyslexia Initiative.',
    duration: '15:25',
    thumbnail: 'https://img.youtube.com/vi/IEpBujdee8M/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'expert' as const,
    videoUrl: 'https://www.youtube.com/embed/IEpBujdee8M',
  },
  {
    id: '12',
    title: 'Dyslexia – Educate Me',
    description: 'Comprehensive overview including schooling, support, and accommodations.',
    duration: '18:10',
    thumbnail: 'https://img.youtube.com/vi/58eqGrGWA94/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'expert' as const,
    videoUrl: 'https://www.youtube.com/embed/58eqGrGWA94',
  },
  
  // Advanced Videos
  {
    id: '13',
    title: 'Dyslexia | How Do Dyslexics Learn?',
    description: 'Explains learning differences and strengths for dyslexic children.',
    duration: '12:30',
    thumbnail: 'https://img.youtube.com/vi/LFExDAggmQY/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'advanced' as const,
    videoUrl: 'https://www.youtube.com/embed/LFExDAggmQY',
  },
  {
    id: '14',
    title: 'Visual Dyslexia Explained – Scotopic Sensitivity',
    description: 'Explains how text appears and reading-experience differences.',
    duration: '9:45',
    thumbnail: 'https://img.youtube.com/vi/RDFkwkSgjtg/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'advanced' as const,
    videoUrl: 'https://www.youtube.com/embed/RDFkwkSgjtg',
  },
  {
    id: '15',
    title: 'What is Dyslexia - Child Mind Institute',
    description: 'Parent and child-focused, includes support and long-term perspective.',
    duration: '11:20',
    thumbnail: 'https://img.youtube.com/vi/leFyIX4e3Xk/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'advanced' as const,
    videoUrl: 'https://www.youtube.com/embed/leFyIX4e3Xk',
  },
  {
    id: '16',
    title: 'How To Help Kids With Dyslexia',
    description: 'Practical support and strategy guidance from Child Mind Institute.',
    duration: '13:55',
    thumbnail: 'https://img.youtube.com/vi/q31SI8l86BM/maxresdefault.jpg',
    category: 'reading' as const,
    level: 'advanced' as const,
    videoUrl: 'https://www.youtube.com/embed/q31SI8l86BM',
  },
];

const VideoCard: React.FC<{ video: VideoResource; onPlayClick: (video: VideoResource) => void }> = ({ video, onPlayClick }) => {
  return (
    <div>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-40 bg-gray-200 overflow-hidden group">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <button
              onClick={() => onPlayClick(video)}
              className="bg-primary hover:bg-primary/90 rounded-full p-3 transition-colors"
            >
              <Play className="w-6 h-6 text-white" />
            </button>
          </div>
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </span>
        </div>
        <CardContent className="p-4">
          <button 
            onClick={() => onPlayClick(video)}
            className="w-full bg-pastel-peach hover:bg-pastel-peach/80 transition-colors py-2 rounded-lg font-semibold text-sm"
          >
            Watch Video
          </button>
        </CardContent>
      </Card>
      <p className="text-sm font-semibold text-gray-800 mt-3">{video.title}</p>
    </div>
  );
};

const LearningResources: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [selectedVideo, setSelectedVideo] = useState<VideoResource | null>(null);

  const filteredVideos = videos.filter(video => video.level === selectedLevel);

  const handlePlayClick = (video: VideoResource) => {
    setSelectedVideo(video);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-pastel-blue/30 pb-24">
      <DyslexiaHeader />
      
      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-primary mb-6 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-pastel-peach rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Learning Resources</h1>
          </div>
          <ReadingText>
            Explore our collection of educational videos designed to help you master reading, 
            phonics, spelling, and comprehension skills. Choose your level and start learning!
          </ReadingText>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-8">
          <h3 className="font-bold text-lg mb-4">Learning Level</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['beginner', 'intermediate', 'expert', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level as 'beginner' | 'intermediate' | 'advanced' | 'expert')}
                className={`px-4 py-3 rounded-lg font-semibold transition-colors capitalize ${
                  selectedLevel === level
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4">
            {filteredVideos.length} Video{filteredVideos.length !== 1 ? 's' : ''} Found
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} onPlayClick={handlePlayClick} />
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No videos found for this level.</p>
              <button
                onClick={() => setSelectedLevel('beginner')}
                className="mt-4 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90"
              >
                Reset to Beginner
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-pastel-blue/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">How to Use These Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">1</div>
              <div>
                <h4 className="font-bold mb-1">Choose Your Level</h4>
                <p className="text-sm text-gray-700">Start with beginner videos if you're new, or pick intermediate/advanced if you want more challenge.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">2</div>
              <div>
                <h4 className="font-bold mb-1">Watch & Learn</h4>
                <p className="text-sm text-gray-700">Watch the video at your own pace. You can pause, rewind, or watch it multiple times.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">3</div>
              <div>
                <h4 className="font-bold mb-1">Practice</h4>
                <p className="text-sm text-gray-700">Use what you learned in our games and reading exercises to reinforce your skills.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningResources;

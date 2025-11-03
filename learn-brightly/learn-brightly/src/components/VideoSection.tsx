import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import ReadingText from './ReadingText';
import LearningCard from './LearningCard';
import VideoPlayer from './VideoPlayer';

const videos = [
  {
    title: "What is Dyslexia? - A Kid's Guide",
    description: "A fun animated video that explains dyslexia in a way that's easy for kids to understand!",
    videoId: "zafiGBrFkRM",
    duration: "5:30",
    thumbnail: "https://img.youtube.com/vi/zafiGBrFkRM/maxresdefault.jpg"
  },
  {
    title: "Dyslexia for Kids - Understanding Your Brain",
    description: "Learn how your amazing brain works differently and why that makes you special!",
    videoId: "3bKuoH8CkFc",
    duration: "4:15",
    thumbnail: "https://img.youtube.com/vi/3bKuoH8CkFc/maxresdefault.jpg"
  }
];

const VideoSection = () => {
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null);

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Fun Learning Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video, index) => (
          <LearningCard
            key={index}
            title={video.title}
            icon={<PlayCircle />}
            color="yellow"
          >
            <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-3 transition-all hover:scale-110"
                >
                  <PlayCircle className="h-8 w-8" />
                </button>
              </div>
            </div>
            <ReadingText>
              {video.description}
            </ReadingText>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm font-medium bg-white/50 px-3 py-1 rounded-full">
                {video.duration}
              </span>
              <button
                onClick={() => setSelectedVideo(video)}
                className="bg-white/50 hover:bg-white/70 transition-colors rounded-xl py-2 px-4 font-bold flex items-center gap-2"
              >
                <PlayCircle className="h-5 w-5" />
                Watch Now
              </button>
            </div>
          </LearningCard>
        ))}
      </div>

      {selectedVideo && (
        <VideoPlayer
          videoId={selectedVideo.videoId}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};

export default VideoSection; 
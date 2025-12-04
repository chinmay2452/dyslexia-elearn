import React, { useState, useRef, useEffect } from 'react';
import { Button } from "../components/button";
import { Link, useNavigate } from "react-router-dom";
import supabase from '../../supabase';
import { useToast } from "../hooks/use-toast";
import DyslexiaHeader from '../components/DyslexiaHeader';
import ReadingText from '../components/ReadingText';
import { BookOpen, Volume2, ArrowRight, Book } from 'lucide-react';
import AnimatedIcon from '../components/AnimatedIcon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";

const stories = [
  {
    id: 1,
    title: "Luna's Golden Key",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
    parts: [
      "Once upon a time, in a magical forest, there lived a curious little fox named Luna.",
      "Luna loved to explore and learn new things every day. One morning, she found a shiny object near a big oak tree. It was a golden key!",
      "Luna was very excited! She had never seen such a beautiful key before. She wondered what magical door it might open. With the key in her paw, she set off on a new adventure through the forest."
    ],
    newWords: [
      { word: "Curious", definition: "Wanting to know or learn about something" },
      { word: "Magical", definition: "Having special powers or enchantment" },
      { word: "Adventure", definition: "An exciting or unusual experience" }
    ]
  },
  {
    id: 2,
    title: "The Friendly Dragon",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    parts: [
      "In a cozy village at the foot of a tall mountain, there lived a small dragon named Spark.",
      "Unlike other dragons, Spark didn't like to breathe fire. Instead, he loved to make tiny, warm flames to help villagers light their candles and cook their food.",
      "One day, a big storm came and knocked out all the village's lights. Spark knew it was his time to shine! He flew from house to house, using his gentle flames to bring light and warmth to everyone."
    ],
    newWords: [
      { word: "Cozy", definition: "Warm, comfortable, and safe" },
      { word: "Village", definition: "A small community of houses" },
      { word: "Storm", definition: "Bad weather with strong winds and rain" }
    ]
  },
  {
    id: 3,
    title: "The Rainbow Bridge",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80",
    parts: [
      "High up in the clouds lived a group of friendly cloud sprites. Their favorite job was to paint rainbows across the sky.",
      "One day, they noticed that the colors in their rainbow paint were running low. They needed to find the magical color crystals to make more.",
      "The sprites set off on a journey through the clouds, meeting helpful birds and playful wind spirits along the way. Together, they found the crystals and created the most beautiful rainbow ever seen!"
    ],
    newWords: [
      { word: "Sprites", definition: "Small, magical creatures" },
      { word: "Rainbow", definition: "A colorful arc in the sky after rain" },
      { word: "Journey", definition: "A trip or adventure" }
    ]
  }
];

const Reading = () => {
  const [readingIndex, setReadingIndex] = useState<number | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [selectedStory, setSelectedStory] = useState(stories[0]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Filter only English voices
      const englishVoices = availableVoices.filter(voice =>
        voice.lang.includes('en') || voice.lang.includes('en-US') || voice.lang.includes('en-GB')
      );
      setVoices(englishVoices);
      // Set default voice to first English voice
      if (englishVoices.length > 0) {
        setSelectedVoice(englishVoices[0].name);
      }
    };

    loadVoices();
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleReadAloud = () => {
    if (isReading) {
      // Stop reading
      synthRef.current?.cancel();
      setIsReading(false);
      setReadingIndex(null);
      return;
    }
    setIsReading(true);
    setReadingIndex(0);
    synthRef.current = window.speechSynthesis;
    readPart(0);
  };

  const readPart = (index: number) => {
    if (index >= selectedStory.parts.length) {
      setIsReading(false);
      setReadingIndex(null);
      return;
    }
    setReadingIndex(index);
    const utter = new window.SpeechSynthesisUtterance(selectedStory.parts[index]);
    utter.rate = 0.95;

    // Set the selected voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utter.voice = voice;
    }

    utter.onend = () => {
      readPart(index + 1);
    };
    utter.onerror = () => {
      setIsReading(false);
      setReadingIndex(null);
    };
    utteranceRef.current = utter;
    synthRef.current?.speak(utter);
  };

  const speakWord = (word: string) => {
    const utter = new window.SpeechSynthesisUtterance(word);
    utter.rate = 0.9; // Slightly slower for better understanding

    // Set the selected voice
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utter.voice = voice;
    }

    window.speechSynthesis.speak(utter);
  };

  const handleStoryChange = (storyId: number) => {
    const story = stories.find(s => s.id === storyId);
    if (story) {
      setSelectedStory(story);
      setIsReading(false);
      setReadingIndex(null);
      synthRef.current?.cancel();
    }
  };

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFinishStory = async () => {
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
        const currentStories = currentProgress?.stories_read || 0;

        // 2. Update progress (Add 30 XP for reading)
        const xpEarned = 30;

        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            xp: currentXP + xpEarned,
            stories_read: currentStories + 1,
            last_activity_date: new Date().toISOString()
          });

        toast({
          title: "Great Job!",
          description: `You finished the story and earned ${xpEarned} XP!`,
        });

        navigate('/dashboard');
      } else {
        toast({
          title: "Not logged in",
          description: "Please log in to save your progress.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error",
        description: "Failed to save progress.",
        variant: "destructive"
      });
    }
  };

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
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Today's Story</h2>
              <Select
                value={selectedStory.id.toString()}
                onValueChange={(value) => handleStoryChange(parseInt(value))}
              >
                <SelectTrigger className="w-[200px] bg-white/90 hover:bg-white text-gray-900">
                  <SelectValue placeholder="Select story" />
                </SelectTrigger>
                <SelectContent>
                  {stories.map((story) => (
                    <SelectItem key={story.id} value={story.id.toString()}>
                      {story.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger className="w-[250px] bg-white/90 hover:bg-white text-gray-900">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="default"
                className={`flex items-center gap-2 bg-white/70 hover:bg-white ${isReading ? 'bg-pastel-green/60' : ''}`}
                onClick={handleReadAloud}
              >
                <Volume2 className="h-5 w-5" />
                {isReading ? 'Stop' : 'Read Aloud'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {selectedStory.parts.map((part, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl transition-colors ${readingIndex === index ? 'bg-white/80' : 'bg-white/50'
                  }`}
              >
                <ReadingText>
                  {part}
                </ReadingText>
                {index === 0 && (
                  <div className="my-6 flex justify-center">
                    <img
                      src={selectedStory.image}
                      alt={`Illustration for ${selectedStory.title}`}
                      className="rounded-xl shadow-md max-h-64 object-cover"
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleFinishStory}
                className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg transform transition hover:scale-105"
              >
                Finish Story & Earn XP!
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-pastel-green rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-lg mb-2">New Words</h3>
            <ul className="space-y-2">
              {selectedStory.newWords.map((wordObj, index) => (
                <li key={index} className="bg-white/50 rounded-lg p-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold">{wordObj.word}</span>
                    <Button
                      size="default"
                      variant="outline"
                      className="hover:bg-white/70"
                      onClick={() => speakWord(wordObj.word)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{wordObj.definition}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 bg-pastel-blue rounded-xl p-4 shadow-md">
            <h3 className="font-bold text-lg mb-2">Reading Tips</h3>
            <ul className="space-y-2">
              <li className="bg-white/50 rounded-lg p-2">
                <ReadingText>
                  Take your time and read at your own pace. It's okay to go slowly!
                </ReadingText>
              </li>
              <li className="bg-white/50 rounded-lg p-2">
                <ReadingText>
                  Use the "Read Aloud" feature to help you follow along with the story.
                </ReadingText>
              </li>
              <li className="bg-white/50 rounded-lg p-2">
                <ReadingText>
                  Click the speaker icon next to new words to hear how they're pronounced.
                </ReadingText>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reading;

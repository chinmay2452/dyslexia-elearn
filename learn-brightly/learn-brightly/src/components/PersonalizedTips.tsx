import React from 'react';
import { Lightbulb, Zap, Brain, BookOpen } from 'lucide-react';
import ReadingText from './ReadingText';
import AnimatedIcon from './AnimatedIcon';

interface PersonalizedTipsProps {
  dyslexiaScore?: number;
  storiesRead?: number;
  gamesPlayed?: number;
  streak?: number;
}

const PersonalizedTips: React.FC<PersonalizedTipsProps> = ({
  dyslexiaScore = 0,
  storiesRead = 0,
  gamesPlayed = 0,
  streak = 0
}) => {
  // Generate tips based on user profile
  const getTips = () => {
    const tips = [];

    // Tips based on dyslexia score
    if (dyslexiaScore && dyslexiaScore >= 60) {
      tips.push({
        icon: <Brain className="h-6 w-6" />,
        title: 'Advanced Reading Strategy',
        message: 'Try using a multi-sensory approach: read out loud while tracing the words with your finger. This helps strengthen neural pathways.',
        color: 'bg-pastel-blue'
      });
    } else if (dyslexiaScore && dyslexiaScore >= 40) {
      tips.push({
        icon: <Brain className="h-6 w-6" />,
        title: 'Reading Tips',
        message: 'Use a ruler or bookmark to focus on one line at a time. This helps reduce visual stress and improves focus.',
        color: 'bg-pastel-green'
      });
    } else if (!dyslexiaScore) {
      tips.push({
        icon: <Lightbulb className="h-6 w-6" />,
        title: 'Get Personalized Tips',
        message: 'Take the dyslexia test to unlock personalized reading strategies and tips tailored to your needs!',
        color: 'bg-pastel-yellow'
      });
    }

    // Tips based on activity
    if (gamesPlayed === 0) {
      tips.push({
        icon: <Zap className="h-6 w-6" />,
        title: 'Play Your First Game',
        message: 'Games make learning fun! Try "Word Match" - it\'s a great way to build vocabulary while having fun.',
        color: 'bg-pastel-pink'
      });
    }

    if (storiesRead === 0) {
      tips.push({
        icon: <BookOpen className="h-6 w-6" />,
        title: 'Start Your First Story',
        message: 'Reading boosts comprehension and vocabulary. Start with a short, simple story today!',
        color: 'bg-pastel-blue'
      });
    }

    // Streak motivation
    if (streak > 0 && streak < 7) {
      tips.push({
        icon: <Zap className="h-6 w-6" />,
        title: `${7 - streak} Days to a Streak Badge!`,
        message: 'Keep learning every day to unlock your first 7-day streak badge and special rewards!',
        color: 'bg-pastel-yellow'
      });
    }

    // High achiever tips
    if (storiesRead >= 20 && gamesPlayed >= 10) {
      tips.push({
        icon: <Lightbulb className="h-6 w-6" />,
        title: 'Challenge Yourself',
        message: 'You\'re doing amazing! Try the advanced learning resources to keep pushing yourself!',
        color: 'bg-pastel-purple'
      });
    }

    return tips.length > 0 ? tips : [
      {
        icon: <Lightbulb className="h-6 w-6" />,
        title: 'Reading Tip of the Day',
        message: 'Try using a ruler or bookmark under each line as you read. This helps your eyes focus on one line at a time!',
        color: 'bg-pastel-green'
      }
    ];
  };

  const tips = getTips();
  // Show first tip prominently
  const mainTip = tips[0];
  const otherTips = tips.slice(1);

  return (
    <div className="space-y-4 mb-8">
      {/* Main Tip */}
      <div className={`${mainTip.color} rounded-2xl p-6 shadow-md border-l-4 border-amber-400`}>
        <div className="flex items-start gap-4">
          <AnimatedIcon animation="bounce" className="flex-shrink-0">
            {mainTip.icon}
          </AnimatedIcon>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">{mainTip.title}</h3>
            <ReadingText className="text-sm">
              {mainTip.message}
            </ReadingText>
          </div>
        </div>
      </div>

      {/* Additional Tips */}
      {otherTips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherTips.map((tip, index) => (
            <div key={index} className={`${tip.color} rounded-xl p-4 shadow-sm`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-700">{tip.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalizedTips;

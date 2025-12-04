import React from 'react';
import { Zap, AlertCircle, TrendingUp, BookOpen, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import ReadingText from './ReadingText';
import AnimatedIcon from './AnimatedIcon';

interface AdaptiveRecommendationsProps {
  dyslexiaScore?: number;
  lastTestDate?: string;
  storiesRead?: number;
  gamesPlayed?: number;
  xp?: number;
}

const AdaptiveRecommendations: React.FC<AdaptiveRecommendationsProps> = ({
  dyslexiaScore,
  lastTestDate,
  storiesRead = 0,
  gamesPlayed = 0,
  xp = 0
}) => {
  // Determine what to recommend based on user activity
  const getRecommendations = () => {
    const recs: { type: string; title: string; description: string; action: string; path: string; icon: React.ReactNode; bgColor: string }[] = [];

    // Check if test was taken recently (within 7 days)
    const isRecentTest = lastTestDate ? (Date.now() - new Date(lastTestDate).getTime()) < 7 * 24 * 60 * 60 * 1000 : false;

    // 1. No test taken - show prominent test recommendation
    if (dyslexiaScore === undefined) {
      recs.push({
        type: 'test',
        title: 'Complete Your Dyslexia Screening',
        description: 'Take a quick 5-minute assessment to get personalized learning recommendations based on your needs.',
        action: 'Take Test Now',
        path: '/dyslexia-test',
        icon: <AlertCircle className="h-8 w-8" />,
        bgColor: 'from-red-100 to-orange-100'
      });
    } else if (isRecentTest) {
      // 2a. Recently took test - show personalized message about results
      if (dyslexiaScore >= 70) {
        recs.push({
          type: 'recent_test_high',
          title: 'Great News! Strong Reading Abilities Detected',
          description: 'Your recent test shows excellent reading skills. Challenge yourself with advanced content to continue improving.',
          action: 'View Results',
          path: '/dyslexia-test',
          icon: <TrendingUp className="h-8 w-8" />,
          bgColor: 'from-green-100 to-emerald-100'
        });
      } else if (dyslexiaScore >= 40) {
        recs.push({
          type: 'recent_test_mid',
          title: 'Keep Building Your Skills',
          description: 'Your test results show areas to improve. Use our personalized learning paths to build confidence step by step.',
          action: 'View Results',
          path: '/dyslexia-test',
          icon: <Target className="h-8 w-8" />,
          bgColor: 'from-blue-100 to-cyan-100'
        });
      } else {
        recs.push({
          type: 'recent_test_low',
          title: 'Your Personalized Learning Plan',
          description: 'Based on your test results, we\'ve tailored activities to help you. Start with beginner-friendly games and stories.',
          action: 'View Results',
          path: '/dyslexia-test',
          icon: <AlertCircle className="h-8 w-8" />,
          bgColor: 'from-yellow-100 to-orange-100'
        });
      }
    }

    // 3. High score (70+) - recommend advanced content
    if (dyslexiaScore !== undefined && dyslexiaScore >= 70 && !isRecentTest) {
      recs.push({
        type: 'advanced',
        title: 'Challenge Yourself with Advanced Content',
        description: 'Your test shows strong reading skills. Try our advanced stories and challenging games to build confidence further.',
        action: 'Explore Advanced',
        path: '/resources',
        icon: <TrendingUp className="h-8 w-8" />,
        bgColor: 'from-purple-100 to-blue-100'
      });
    }

    // 4. Spelling struggles (low game performance) - recommend spelling practice
    if (gamesPlayed >= 5 && xp >= 100) {
      recs.push({
        type: 'spelling',
        title: 'Boost Your Spelling Skills',
        description: 'Based on your learning activities, practicing spelling can help you level up faster. Try the Spelling Hero game!',
        action: 'Play Spelling Hero',
        path: '/games/spelling-hero',
        icon: <Zap className="h-8 w-8" />,
        bgColor: 'from-yellow-100 to-orange-100'
      });
    }

    // 5. High reading activity - recommend longer stories
    if (storiesRead >= 10) {
      recs.push({
        type: 'reading',
        title: 'You\'re a Reading Star!',
        description: `You've read ${storiesRead} stories! Keep the momentum going with even more challenging content to expand your vocabulary.`,
        action: 'Find More Stories',
        path: '/reading',
        icon: <BookOpen className="h-8 w-8" />,
        bgColor: 'from-blue-100 to-cyan-100'
      });
    }

    // 6. Low activity - encourage engagement
    if (gamesPlayed < 5 && storiesRead < 5) {
      recs.push({
        type: 'engagement',
        title: 'Get Started With Games',
        description: 'Games are a fun way to learn! Start with Word Match to build your reading confidence and earn XP.',
        action: 'Play Word Match',
        path: '/games/word-match',
        icon: <Target className="h-8 w-8" />,
        bgColor: 'from-pink-100 to-red-100'
      });
    }

    return recs;
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) {
    return null;
  }

  // Show the most important recommendation first
  const priorityOrder = ['test', 'recent_test_high', 'recent_test_mid', 'recent_test_low', 'spelling', 'reading', 'advanced', 'engagement'];
  const sortedRecs = recommendations.sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.type);
    const bIndex = priorityOrder.indexOf(b.type);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });

  return (
    <div className="space-y-4 mb-8">
      {sortedRecs.map((rec, idx) => (
        <div
          key={rec.type}
          className={`bg-gradient-to-r ${rec.bgColor} rounded-2xl p-6 shadow-md border-l-4 border-amber-500 animate-pop`}
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <AnimatedIcon animation={rec.type === 'test' ? 'bounce' : 'float'}>
                <div className="text-4xl">{rec.icon}</div>
              </AnimatedIcon>
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold mb-2">{rec.title}</h3>
              <ReadingText className="text-sm mb-4">
                {rec.description}
              </ReadingText>

              <Link to={rec.path}>
                <Button className="rounded-xl py-2 px-6 font-bold shadow-md hover:shadow-lg flex items-center gap-2 w-fit">
                  {rec.action}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdaptiveRecommendations;


import React from 'react';
import { cn } from "../lib/utils";

interface LearningCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  color?: 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'peach';
  className?: string;
}

const LearningCard = ({ 
  title, 
  icon, 
  children, 
  color = 'yellow',
  className
}: LearningCardProps) => {
  const colorClasses = {
    yellow: 'bg-pastel-yellow border-amber-200',
    green: 'bg-pastel-green border-green-200',
    blue: 'bg-pastel-blue border-blue-200',
    purple: 'bg-pastel-purple border-purple-200',
    pink: 'bg-pastel-pink border-pink-200',
    peach: 'bg-pastel-peach border-orange-200',
  };

  return (
    <div className={cn(
      'rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl animate-pop',
      colorClasses[color],
      className
    )}>
      <div className="flex items-center mb-4 gap-3">
        {icon && <div className="text-2xl animate-bounce-slight">{icon}</div>}
        <h3 className="text-xl font-bold tracking-wide">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export default LearningCard;

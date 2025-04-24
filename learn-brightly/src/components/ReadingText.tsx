
import React from 'react';
import { cn } from "../lib/utils";

interface ReadingTextProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ReadingText = ({ 
  children, 
  size = 'md',
  className
}: ReadingTextProps) => {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <p className={cn(
      'font-dyslexic tracking-wide leading-relaxed',
      sizeClasses[size],
      className
    )}>
      {children}
    </p>
  );
};

export default ReadingText;

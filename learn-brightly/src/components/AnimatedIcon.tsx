
import React from 'react';
import { cn } from "../lib/utils";

interface AnimatedIconProps {
  children: React.ReactNode;
  animation?: 'float' | 'bounce' | 'wiggle' | 'none';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AnimatedIcon = ({ 
  children, 
  animation = 'float',
  size = 'md',
  className
}: AnimatedIconProps) => {
  const animationClasses = {
    float: 'animate-float',
    bounce: 'animate-bounce-slight',
    wiggle: 'animate-wiggle',
    none: '',
  };
  
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div className={cn(
      'inline-flex items-center justify-center',
      animationClasses[animation],
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

export default AnimatedIcon;

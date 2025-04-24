
import React from 'react';
import { cn } from "../lib/utils";
import { Button } from "../components/button";

interface IconButtonProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'muted';
  onClick?: () => void;
  className?: string;
}

const IconButton = ({ 
  icon, 
  children, 
  color = 'primary',
  onClick,
  className
}: IconButtonProps) => {
  const colorVariants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
    muted: 'bg-muted text-muted-foreground hover:bg-muted/90',
  };

  return (
    <Button 
      onClick={onClick}
      className={cn(
        'rounded-xl py-6 px-6 text-lg font-bold flex items-center gap-3 shadow-md hover:shadow-lg animate-on-hover hover-float',
        colorVariants[color],
        className
      )}
    >
      <span className="text-2xl">{icon}</span>
      <span>{children}</span>
    </Button>
  );
};

export default IconButton;

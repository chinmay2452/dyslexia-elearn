import * as React from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "font-semibold rounded-xl transition shadow-md disabled:opacity-50",
          variant === 'default' && "bg-purple-500 hover:bg-purple-600 text-white",
          variant === 'outline' && "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
          size === 'default' && "py-2 px-6",
          size === 'icon' && "p-2",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
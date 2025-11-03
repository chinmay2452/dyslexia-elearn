import * as React from "react";
import { cn } from "../lib/utils";

interface TabsContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const Tabs = ({ children, value, onValueChange, className }: TabsProps) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const TabsList = ({ children, className }: TabsListProps) => {
  return <div className={cn("flex space-x-2 justify-center mb-4", className)}>{children}</div>;
};

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const TabsTrigger = ({
  children,
  value,
  className,
}: TabsTriggerProps) => {
  const context = React.useContext(TabsContext);
  
  return (
    <button
      onClick={() => context?.onValueChange?.(value)}
      data-state={context?.value === value ? "active" : "inactive"}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out",
        "data-[state=active]:bg-[#A38BFE] data-[state=active]:text-white",
        "data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700",
        "before:absolute before:inset-0 before:rounded-xl before:bg-[#A38BFE] before:opacity-0 before:transition-opacity before:duration-300",
        "data-[state=active]:before:opacity-100",
        "hover:before:opacity-20",
        className
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

const TabsContent = ({ children, value, className }: TabsContentProps) => {
  const context = React.useContext(TabsContext);
  
  if (context?.value !== value) return null;
  
  return (
    <div 
      className={cn(
        "bg-white rounded-xl p-4 shadow",
        "animate-in slide-in-from-right fade-in duration-300",
        className
      )}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
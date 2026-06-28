import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  delay?: number;
}

export const Tooltip = ({ content, children, delay = 300 }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  const handleMouseEnter = () => {
    const newTimer = window.setTimeout(() => setIsVisible(true), delay);
    setTimer(newTimer);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  return (
    <div 
      className="relative flex items-center" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 glass-panel text-xs text-white whitespace-nowrap z-[60] pointer-events-none animate-[fadeInUp_0.2s_ease-out]">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-electric-blue/30"></div>
        </div>
      )}
    </div>
  );
};

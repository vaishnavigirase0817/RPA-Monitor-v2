import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const ChartCard = ({ title, children, className = '' }: ChartCardProps) => {
  return (
    <div className={`bg-navy/40 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all hover:bg-navy/50 hover:border-white/20 group relative overflow-hidden ${className}`}>
      {/* Subtle hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/0 to-purple/0 group-hover:from-electric-blue/5 group-hover:to-purple/5 transition-colors duration-500 pointer-events-none" />
      
      <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-electric-blue/50 group-hover:bg-electric-blue transition-colors"></span>
        {title}
      </h3>
      
      <div className="relative z-10 h-[250px] w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';

interface AnalyticsHeaderProps {
  onClose: () => void;
  onExport: () => void;
}

export const AnalyticsHeader = ({ onClose, onExport }: AnalyticsHeaderProps) => {
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    setTimestamp(new Date().toLocaleTimeString());
  }, []);

  return (
    <div className="flex justify-between items-center mb-8 shrink-0">
      <div>
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-electric-blue to-purple tracking-tight flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-electric-blue">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
          </svg>
          Frozen Stream Analytics
        </h1>
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-400 font-mono">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-electric-blue/10 border border-electric-blue/30 text-electric-blue">
            <span className="w-2 h-2 rounded-full bg-electric-blue animate-pulse"></span>
            Snapshot Active
          </span>
          <span>Analysis generated at {timestamp}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export Report
        </button>
        <button 
          onClick={onClose}
          className="p-2.5 bg-white/5 hover:bg-soft-orange/20 text-gray-400 hover:text-soft-orange rounded-full transition-colors border border-transparent hover:border-soft-orange/30 outline-none focus-visible:ring-2 focus-visible:ring-soft-orange"
          aria-label="Close Analytics View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

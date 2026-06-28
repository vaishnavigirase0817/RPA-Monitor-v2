import React, { useState, useEffect, useRef } from 'react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: {
    id: string;
    label: string;
    onExecute: () => void;
    icon?: React.ReactNode;
  }[];
}

export const CommandPalette = ({ isOpen, onClose, actions }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredActions = actions.filter(action => 
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredActions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].onExecute();
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Palette */}
      <div className="relative w-full max-w-xl bg-navy/90 border border-electric-blue/40 rounded-xl shadow-2xl overflow-hidden animate-[fadeInUp_0.15s_ease-out]">
        <div className="flex items-center px-4 py-3 border-b border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-electric-blue mr-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Type a command or search..." 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-lg"
          />
          <div className="text-xs text-gray-500 font-mono border border-gray-600 rounded px-2 py-1">ESC</div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto py-2 custom-scrollbar">
          {filteredActions.length > 0 ? (
            filteredActions.map((action, index) => (
              <div 
                key={action.id}
                className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${index === selectedIndex ? 'bg-electric-blue/20 text-electric-blue border-l-2 border-electric-blue' : 'text-gray-300 hover:bg-white/5 border-l-2 border-transparent'}`}
                onClick={() => {
                  action.onExecute();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {action.icon}
                <span className="font-medium">{action.label}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-8 text-center text-gray-500">
              No matching commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

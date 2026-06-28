import { useEffect, useRef } from 'react';
import type { StreamItem } from '../types/types';

interface ContextMenuProps {
  x: number;
  y: number;
  item: StreamItem;
  onClose: () => void;
  onAction: (action: string, item: StreamItem) => void;
}

export const ContextMenu = ({ x, y, item, onClose, onAction }: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    // Slight delay to prevent immediate close on the same click
    setTimeout(() => {
      window.addEventListener('click', handleClickOutside);
    }, 10);
    
    return () => window.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  // Ensure menu stays within viewport bounds
  let adjustedX = x;
  let adjustedY = y;
  
  if (menuRef.current) {
    const rect = menuRef.current.getBoundingClientRect();
    if (x + rect.width > window.innerWidth) adjustedX = window.innerWidth - rect.width - 10;
    if (y + rect.height > window.innerHeight) adjustedY = window.innerHeight - rect.height - 10;
  }

  return (
    <div 
      ref={menuRef}
      className="fixed z-[100] w-48 glass-panel py-2 shadow-2xl animate-[fadeInUp_0.15s_ease-out]"
      style={{ top: adjustedY, left: adjustedX }}
    >
      <div className="px-4 py-2 border-b border-white/10 mb-1">
        <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold truncate">
          {item.id}
        </div>
      </div>
      
      <button 
        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-electric-blue/20 hover:text-electric-blue transition-colors"
        onClick={() => onAction('copyId', item)}
      >
        Copy ID
      </button>
      <button 
        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-electric-blue/20 hover:text-electric-blue transition-colors"
        onClick={() => onAction('viewDetails', item)}
      >
        View Details
      </button>
      <button 
        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-soft-orange/20 hover:text-soft-orange transition-colors"
        onClick={() => onAction('terminate', item)}
      >
        Terminate Process
      </button>
    </div>
  );
};

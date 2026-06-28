import React, { useState, useRef, useEffect } from 'react';
import type { LayoutPreferences, AutomationType, Department } from '../types/types';
import type { FilterState } from '../hooks/useSortAndFilter';
import type { ColumnDef } from '../hooks/useColumnManager';
import type { StreamItem } from '../types/types';

interface ToolbarProps {
  isPaused: boolean;
  onTogglePause: () => void;
  queueSize: number;
  layoutPrefs: LayoutPreferences;
  onToggleLayout: (key: keyof LayoutPreferences) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  columns: ColumnDef[];
  onToggleColumn: (id: keyof StreamItem) => void;
  onOpenAnalytics: () => void;
}

export const Toolbar = ({
  isPaused,
  onTogglePause,
  queueSize,
  layoutPrefs,
  onToggleLayout,
  filters,
  onFilterChange,
  columns,
  onToggleColumn,
  onOpenAnalytics,
}: ToolbarProps) => {
  const [showColMenu, setShowColMenu] = useState(false);
  const colMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) {
        setShowColMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  return (
    <div className="glass-panel p-4 mb-6 flex flex-wrap gap-6 justify-between items-center z-40 relative" role="toolbar" aria-label="Stream controls and filters">
      <div className="flex gap-4 items-center">
        {/* Play/Pause Button */}
        <button 
          onClick={onTogglePause}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold transition-all ${
            isPaused 
              ? 'bg-soft-orange/20 text-soft-orange border border-soft-orange/50 hover:bg-soft-orange/30' 
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30'
          }`}
        >
          {isPaused ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 20.04c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
              RESUME STREAM
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
              </svg>
              PAUSE STREAM
            </>
          )}
        </button>

        {isPaused && (
          <div className="flex items-center gap-2 text-soft-orange text-sm font-mono animate-pulse">
            <span>Queue: {queueSize}</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-1 justify-center">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search projects, companies..." 
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-black/50 border border-electric-blue/30 rounded-md py-1.5 pl-3 pr-8 text-sm text-white focus:outline-none focus:border-electric-blue focus:shadow-[0_0_10px_rgba(0,229,255,0.3)] transition-all"
          />
        </div>

        <select 
          value={filters.automationType} 
          onChange={(e) => onFilterChange({ ...filters, automationType: e.target.value as AutomationType | 'All' })}
          className="bg-black/50 border border-electric-blue/30 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none"
        >
          <option value="All">All Types</option>
          <option value="Attended">Attended</option>
          <option value="Unattended">Unattended</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <select 
          value={filters.department} 
          onChange={(e) => onFilterChange({ ...filters, department: e.target.value as Department | 'All' })}
          className="bg-black/50 border border-electric-blue/30 rounded-md py-1.5 px-3 text-sm text-white focus:outline-none"
        >
          <option value="All">All Depts</option>
          <option value="Finance">Finance</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Operations">Operations</option>
          <option value="Sales">Sales</option>
        </select>
      </div>

      {/* Columns & Layout Toggles */}
      <div className="flex gap-4 items-center">
        <div className="relative" ref={colMenuRef}>
          <button 
            onClick={() => setShowColMenu(!showColMenu)}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            COLUMNS
          </button>
          {showColMenu && (
            <div className="absolute right-0 mt-2 w-48 glass-panel p-2 shadow-xl z-50 animate-[fadeInUp_0.15s_ease-out]">
              {columns.map(col => (
                <label key={col.id} className="flex items-center gap-2 p-1 text-xs text-white cursor-pointer hover:bg-white/10 rounded">
                  <input 
                    type="checkbox" 
                    checked={col.isVisible} 
                    onChange={() => onToggleColumn(col.id)} 
                    className="accent-electric-blue"
                  />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 border-l border-white/20 pl-4 items-center">
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" checked={layoutPrefs.showKPIs} onChange={() => onToggleLayout('showKPIs')} className="accent-electric-blue" />
            KPIs
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">
            <input type="checkbox" checked={layoutPrefs.showGrid} onChange={() => onToggleLayout('showGrid')} className="accent-electric-blue" />
            Grid
          </label>
          <div className="h-4 w-px bg-white/20 mx-1"></div>
          <button 
            onClick={onOpenAnalytics}
            className="flex items-center gap-1.5 px-3 py-1 bg-electric-blue/10 hover:bg-electric-blue/20 text-electric-blue text-xs rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
            Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

import { memo, useState, useRef, useCallback } from 'react';
import type { StreamItem, SortCriteria } from '../types/types';
import { formatNumber, formatCurrency, formatPercentage } from '../utils/formatters';
import { useVirtualization } from '../hooks/useVirtualization';
import type { ColumnDef } from '../hooks/useColumnManager';
import { ContextMenu } from './ContextMenu';
import { Tooltip } from './Tooltip';
import { LoadingSkeleton } from './LoadingSkeleton';
import { useInspector } from './InspectorProvider';
import { useToast } from './ToastProvider';

interface VirtualGridProps {
  data: StreamItem[];
  sortCriteria: SortCriteria[];
  onSort: (key: keyof StreamItem, isShiftPressed: boolean) => void;
  isLoading?: boolean;
  columns: ColumnDef[];
  resizeColumn: (id: keyof StreamItem, width: number) => void;
  isPaused?: boolean;
  selectedIds?: Set<string>;
  onToggleSelection?: (id: string, isShift: boolean, visibleData: StreamItem[]) => void;
  onSelectAll?: (visibleData: StreamItem[]) => void;
  onClearSelection?: () => void;
}

const ROW_HEIGHT = 48;

export const VirtualGridPlaceholder = ({ data, sortCriteria, onSort, isLoading, columns, resizeColumn, isPaused = false, selectedIds, onToggleSelection, onSelectAll, onClearSelection }: VirtualGridProps) => {
  
  const { containerRef, startIndex, endIndex, totalHeight, offsetY } = useVirtualization({
    itemHeight: ROW_HEIGHT,
    totalItems: data.length,
    overscan: 10,
  });

  const [contextMenu, setContextMenu] = useState<{x: number, y: number, item: StreamItem} | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const { openInspector } = useInspector();
  const { showToast } = useToast();

  const handleRowClick = useCallback((item: StreamItem) => {
    if (isPaused) {
      openInspector(item);
    } else {
      showToast('Pause the stream to inspect rows', 'warning');
    }
  }, [isPaused, openInspector, showToast]);

  const handleScrollProgress = useCallback(() => {
    const el = containerRef.current;
    if (el && el.scrollHeight > el.clientHeight) {
      setScrollProgress((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    }
  }, [containerRef]);

  const visibleData = data.slice(startIndex, endIndex);

  const getSortIcon = (key: keyof StreamItem) => {
    const criteria = sortCriteria.find(c => c.key === key);
    if (!criteria) return null;
    return criteria.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const resizingColRef = useRef<{ id: keyof StreamItem, startX: number, startWidth: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, id: keyof StreamItem, currentWidth: number) => {
    e.preventDefault();
    e.stopPropagation();
    resizingColRef.current = { id, startX: e.clientX, startWidth: currentWidth };
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizingColRef.current) return;
      const diff = moveEvent.clientX - resizingColRef.current.startX;
      resizeColumn(resizingColRef.current.id, resizingColRef.current.startWidth + diff);
    };
    
    const handleMouseUp = () => {
      resizingColRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleContextMenu = (e: React.MouseEvent, item: StreamItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleContextAction = (action: string, item: StreamItem) => {
    console.log(`Action: ${action} on item ${item.id}`);
    setContextMenu(null);
  };

  const allSelected = selectedIds ? data.length > 0 && data.every(d => selectedIds.has(d.id)) : false;

  const handleSelectAllToggle = useCallback(() => {
    if (allSelected) {
      onClearSelection?.();
    } else {
      onSelectAll?.(data);
    }
  }, [allSelected, onClearSelection, onSelectAll, data]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const visibleCols = columns.filter(c => c.isVisible);

  return (
    <div className="glass-panel flex-1 flex flex-col overflow-hidden fade-in-up" role="region" aria-label="Data grid">
      {/* Scroll Progress Indicator */}
      <div className="h-[2px] w-full bg-white/5 shrink-0">
        <div className="h-full bg-electric-blue transition-all duration-150 ease-out shadow-[0_0_6px_rgba(0,229,255,0.6)]" style={{ width: `${scrollProgress}%` }} />
      </div>
      
      {/* Selection Bar */}
      {selectedIds && selectedIds.size > 0 && (
        <div className="px-6 py-2 bg-electric-blue/10 border-b border-electric-blue/20 flex items-center justify-between text-sm shrink-0">
          <span className="text-electric-blue font-bold">{selectedIds.size} row{selectedIds.size > 1 ? 's' : ''} selected</span>
          <button onClick={onClearSelection} className="text-gray-400 hover:text-white text-xs uppercase tracking-wider transition-colors">Clear</button>
        </div>
      )}

      {/* Sticky Header */}
      <div className="px-6 py-3 border-b border-white/10 bg-navy/80 backdrop-blur-xl z-20 flex text-xs text-gray-400 uppercase tracking-widest sticky top-0 shadow-lg" role="row" aria-label="Column headers">
        {/* Checkbox Column */}
        <div className="w-10 shrink-0 flex items-center justify-center">
          <input 
            type="checkbox" 
            checked={allSelected} 
            onChange={handleSelectAllToggle}
            className="w-3.5 h-3.5 accent-electric-blue cursor-pointer"
            aria-label="Select all rows"
          />
        </div>
        {visibleCols.map(col => (
          <div 
            key={col.id}
            className="font-semibold cursor-pointer hover:text-electric-blue transition-colors flex items-center justify-between group relative"
            style={{ width: col.width, flexShrink: 0 }}
            onClick={(e) => onSort(col.id, e.shiftKey)}
          >
            <div className="flex items-center gap-1 overflow-hidden">
              <span className="truncate">{col.label}</span>
              <span className="text-electric-blue w-3 shrink-0">{getSortIcon(col.id)}</span>
            </div>
            {/* Resize Handle */}
            <div 
              className="w-2 h-full absolute right-0 top-0 cursor-col-resize opacity-0 group-hover:opacity-100 bg-electric-blue/50"
              onMouseDown={(e) => handleMouseDown(e, col.id, col.width)}
            />
          </div>
        ))}
      </div>

      {/* Virtualized Body */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-auto relative custom-scrollbar bg-black/20"
        onScroll={handleScrollProgress}
        role="rowgroup"
        aria-label={`Showing ${visibleData.length} of ${data.length} rows`}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative', minWidth: 'max-content' }}>
          <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0, right: 0 }}>
            {visibleData.map((item) => (
              <VirtualRow 
                key={item.id} 
                item={item} 
                columns={visibleCols} 
                onContextMenu={(e) => handleContextMenu(e, item)}
                onClick={() => handleRowClick(item)}
                isPaused={isPaused}
                isSelected={selectedIds?.has(item.id) ?? false}
                onToggleSelect={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onToggleSelection?.(item.id, e.shiftKey, data);
                }}
              />
            ))}
            
            {data.length === 0 && (
              <div className="flex flex-col justify-center items-center h-64 text-gray-500 font-mono gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-electric-blue/30">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>No matching records found. Try clearing filters.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          item={contextMenu.item} 
          onClose={() => setContextMenu(null)} 
          onAction={handleContextAction}
        />
      )}
    </div>
  );
};

// Memoized Row Component
const VirtualRow = memo(({ item, columns, onContextMenu, onClick, isPaused, isSelected, onToggleSelect }: { 
  item: StreamItem, 
  columns: ColumnDef[], 
  onContextMenu: (e: React.MouseEvent) => void, 
  onClick: () => void, 
  isPaused: boolean,
  isSelected: boolean,
  onToggleSelect: (e: React.MouseEvent) => void,
}) => {
  const isError = item.status === 'Failed' || item.roi < 0;
  
  return (
    <div 
      className={`flex px-6 items-center border-b border-white/5 transition-colors cursor-context-menu ${
        isSelected 
          ? 'bg-electric-blue/15 shadow-[inset_4px_0_0_rgba(0,229,255,1)]' 
          : 'bg-white/5 hover:bg-electric-blue/10'
      } ${isPaused ? 'cursor-pointer' : ''} ${isError ? 'animate-flash-error' : ''}`}
      style={{ height: `${ROW_HEIGHT}px` }}
      onContextMenu={onContextMenu}
      onClick={onClick}
    >
      {/* Checkbox */}
      <div className="w-10 shrink-0 flex items-center justify-center">
        <input 
          type="checkbox" 
          checked={isSelected} 
          onChange={() => {}} 
          onClick={onToggleSelect}
          className="w-3.5 h-3.5 accent-electric-blue cursor-pointer"
          aria-label={`Select ${item.projectName}`}
        />
      </div>
      {columns.map(col => {
        let content: React.ReactNode;
        
        switch (col.id) {
          case 'id':
            content = <span className="font-mono text-gray-300 text-sm truncate" title={item.id}>{item.id}</span>;
            break;
          case 'projectName':
            content = (
              <Tooltip content={item.projectName}>
                <span className="text-white font-medium truncate w-full block">{item.projectName}</span>
              </Tooltip>
            );
            break;
          case 'status':
            content = (
              <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md border inline-block ${
                item.status === 'Running' 
                  ? 'bg-electric-blue/10 text-electric-blue border-electric-blue/30 shadow-[0_0_8px_rgba(0,229,255,0.2)]' 
                  : item.status === 'Completed'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-soft-orange/10 text-soft-orange border-soft-orange/30 shadow-[0_0_8px_rgba(255,159,67,0.3)]'
              }`}>
                {item.status}
              </span>
            );
            break;
          case 'roi':
            content = <span className={`font-mono font-bold ${item.roi < 0 ? 'text-soft-orange' : 'text-emerald-400'}`}>{formatPercentage(item.roi)}</span>;
            break;
          case 'budget':
            content = <span className="font-mono text-gray-300">{formatCurrency(item.budget)}</span>;
            break;
          case 'industry':
            content = <span className="text-gray-400 text-xs truncate">{item.industry}</span>;
            break;
          case 'department':
            content = <span className="text-gray-400 text-xs truncate">{item.department}</span>;
            break;
          case 'rowsProcessed':
            content = <span className="font-mono text-cyan text-right w-full block">{formatNumber(item.rowsProcessed)}</span>;
            break;
          default:
            content = <span>-</span>;
        }

        return (
          <div key={col.id} className="pr-2 shrink-0 flex items-center" style={{ width: col.width }}>
            {content}
          </div>
        );
      })}
    </div>
  );
});
VirtualRow.displayName = 'VirtualRow';

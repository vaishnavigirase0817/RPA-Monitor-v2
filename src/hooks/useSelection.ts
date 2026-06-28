import { useState, useCallback } from 'react';
import type { StreamItem } from '../types/types';

export const useSelection = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const toggleSelection = useCallback((id: string, isShift: boolean, visibleData: StreamItem[]) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      
      if (isShift && lastSelectedId) {
        // Find indices in visible data
        const startIdx = visibleData.findIndex(item => item.id === lastSelectedId);
        const endIdx = visibleData.findIndex(item => item.id === id);
        
        if (startIdx >= 0 && endIdx >= 0) {
          const min = Math.min(startIdx, endIdx);
          const max = Math.max(startIdx, endIdx);
          
          for (let i = min; i <= max; i++) {
            next.add(visibleData[i].id);
          }
        } else {
          // Fallback if one isn't in visible (should be rare)
          if (next.has(id)) next.delete(id); else next.add(id);
        }
      } else {
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        setLastSelectedId(id);
      }
      
      return next;
    });
  }, [lastSelectedId]);

  const selectAll = useCallback((visibleData: StreamItem[]) => {
    setSelectedIds(new Set(visibleData.map(item => item.id)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setLastSelectedId(null);
  }, []);

  return {
    selectedIds,
    toggleSelection,
    selectAll,
    clearSelection,
  };
};

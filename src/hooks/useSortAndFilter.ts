import { useState, useMemo } from 'react';
import type { StreamItem, SortCriteria, AutomationType, Department, Industry } from '../types/types';

export interface FilterState {
  searchQuery: string;
  automationType: AutomationType | 'All';
  department: Department | 'All';
  industry: Industry | 'All';
}

export const useSortAndFilter = (data: StreamItem[]) => {
  const [sortCriteria, setSortCriteria] = useState<SortCriteria[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    automationType: 'All',
    department: 'All',
    industry: 'All',
  });

  const handleSort = (key: keyof StreamItem, isShiftPressed: boolean) => {
    setSortCriteria(prev => {
      const existingIndex = prev.findIndex(c => c.key === key);
      let newCriteria = [...prev];

      if (existingIndex >= 0) {
        const currentDirection = newCriteria[existingIndex].direction;
        if (currentDirection === 'asc') {
          newCriteria[existingIndex].direction = 'desc';
        } else {
          newCriteria.splice(existingIndex, 1); // Remove if third click
        }
      } else {
        const newSort: SortCriteria = { key, direction: 'asc' };
        if (isShiftPressed) {
          newCriteria.push(newSort);
        } else {
          newCriteria = [newSort]; // Single column sort replaces existing
        }
      }
      return newCriteria;
    });
  };

  const processedData = useMemo(() => {
    let result = data;

    // 1. Filtering
    if (filters.automationType !== 'All') {
      result = result.filter(item => item.automationType === filters.automationType);
    }
    if (filters.department !== 'All') {
      result = result.filter(item => item.department === filters.department);
    }
    if (filters.industry !== 'All') {
      result = result.filter(item => item.industry === filters.industry);
    }

    // Fuzzy search (Out-of-order keywords)
    if (filters.searchQuery) {
      const keywords = filters.searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      if (keywords.length > 0) {
        result = result.filter(item => {
          const combinedText = `${item.projectName} ${item.company} ${item.partner} ${item.country}`.toLowerCase();
          return keywords.every(kw => combinedText.includes(kw));
        });
      }
    }

    // 2. Sorting
    if (sortCriteria.length > 0) {
      result = [...result].sort((a, b) => {
        for (const criteria of sortCriteria) {
          const { key, direction } = criteria;
          const valA = a[key];
          const valB = b[key];
          
          if (valA === valB) continue;

          const modifier = direction === 'asc' ? 1 : -1;
          
          if (typeof valA === 'string' && typeof valB === 'string') {
            return valA.localeCompare(valB) * modifier;
          }
          if (typeof valA === 'number' && typeof valB === 'number') {
            return (valA - valB) * modifier;
          }
          return 0;
        }
        return 0;
      });
    }

    return result;
  }, [data, filters, sortCriteria]);

  return {
    processedData,
    sortCriteria,
    handleSort,
    filters,
    setFilters,
  };
};

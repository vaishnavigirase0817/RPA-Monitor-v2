import { useState, useCallback } from 'react';
import type { StreamItem } from '../types/types';

export interface ColumnDef {
  id: keyof StreamItem;
  label: string;
  width: number;
  minWidth: number;
  isVisible: boolean;
}

const defaultColumns: ColumnDef[] = [
  { id: 'id', label: 'ID', width: 100, minWidth: 60, isVisible: true },
  { id: 'projectName', label: 'Project Name', width: 200, minWidth: 100, isVisible: true },
  { id: 'status', label: 'Status', width: 120, minWidth: 80, isVisible: true },
  { id: 'roi', label: 'ROI', width: 100, minWidth: 60, isVisible: true },
  { id: 'budget', label: 'Budget', width: 120, minWidth: 80, isVisible: true },
  { id: 'industry', label: 'Industry', width: 180, minWidth: 100, isVisible: true },
  { id: 'department', label: 'Department', width: 150, minWidth: 100, isVisible: false },
  { id: 'rowsProcessed', label: 'Rows', width: 100, minWidth: 60, isVisible: true },
];

export const useColumnManager = () => {
  const [columns, setColumns] = useState<ColumnDef[]>(defaultColumns);

  const toggleColumnVisibility = useCallback((id: keyof StreamItem) => {
    setColumns(prev => 
      prev.map(col => col.id === id ? { ...col, isVisible: !col.isVisible } : col)
    );
  }, []);

  const resizeColumn = useCallback((id: keyof StreamItem, newWidth: number) => {
    setColumns(prev => 
      prev.map(col => {
        if (col.id === id) {
          return { ...col, width: Math.max(col.minWidth, newWidth) };
        }
        return col;
      })
    );
  }, []);

  return { columns, toggleColumnVisibility, resizeColumn };
};

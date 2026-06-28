import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { StreamItem } from '../types/types';

interface InspectorContextType {
  isOpen: boolean;
  selectedItem: StreamItem | null;
  openInspector: (item: StreamItem) => void;
  closeInspector: () => void;
}

const InspectorContext = createContext<InspectorContextType | undefined>(undefined);

export const InspectorProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StreamItem | null>(null);

  const openInspector = useCallback((item: StreamItem) => {
    setSelectedItem(item);
    setIsOpen(true);
  }, []);

  const closeInspector = useCallback(() => {
    setIsOpen(false);
    // Deliberately not clearing selectedItem immediately so the exit animation looks smooth
  }, []);

  return (
    <InspectorContext.Provider value={{ isOpen, selectedItem, openInspector, closeInspector }}>
      {children}
    </InspectorContext.Provider>
  );
};

export const useInspector = () => {
  const context = useContext(InspectorContext);
  if (context === undefined) {
    throw new Error('useInspector must be used within an InspectorProvider');
  }
  return context;
};

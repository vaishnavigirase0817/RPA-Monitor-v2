import { useState, useEffect, useRef, useCallback } from 'react';

interface VirtualizationConfig {
  itemHeight: number;
  totalItems: number;
  overscan?: number;
}

export const useVirtualization = ({ itemHeight, totalItems, overscan = 5 }: VirtualizationConfig) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (target) {
      // Use requestAnimationFrame to debounce scroll for smoother performance
      requestAnimationFrame(() => {
        setScrollTop(target.scrollTop);
      });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Calculate visible range
  let startIndex = Math.floor(scrollTop / itemHeight);
  let visibleNodeCount = 0;

  if (containerRef.current) {
    visibleNodeCount = Math.ceil(containerRef.current.clientHeight / itemHeight);
  } else {
    // Fallback before first render
    visibleNodeCount = 20;
  }

  startIndex = Math.max(0, startIndex - overscan);
  const endIndex = Math.min(totalItems, startIndex + visibleNodeCount + (overscan * 2));

  const totalHeight = totalItems * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    containerRef,
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
  };
};

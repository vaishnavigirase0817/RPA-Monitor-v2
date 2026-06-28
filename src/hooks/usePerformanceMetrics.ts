import { useState, useEffect, useRef } from 'react';

export const usePerformanceMetrics = (currentRowCount: number) => {
  const [fps, setFps] = useState(60);
  const [rps, setRps] = useState(0); // Rows per second
  
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());
  
  const lastRowCountRef = useRef(currentRowCount);
  const lastRpsTimeRef = useRef(Date.now());

  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastFpsTimeRef.current;

      // Update FPS every second
      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    // Update RPS every second based on total row count changes
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = (now - lastRpsTimeRef.current) / 1000;
      
      if (elapsedSeconds > 0) {
        const rowDiff = currentRowCount - lastRowCountRef.current;
        setRps(Math.max(0, Math.round(rowDiff / elapsedSeconds)));
      }
      
      lastRowCountRef.current = currentRowCount;
      lastRpsTimeRef.current = now;
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRowCount]);

  return { fps, rps };
};

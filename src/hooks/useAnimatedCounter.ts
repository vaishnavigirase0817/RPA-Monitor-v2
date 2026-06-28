import { useState, useEffect, useRef } from 'react';

export const useAnimatedCounter = (targetValue: number, duration: number = 500) => {
  const [value, setValue] = useState(targetValue);
  const prevTargetRef = useRef(targetValue);
  
  useEffect(() => {
    if (targetValue === prevTargetRef.current) return;
    
    const startValue = value;
    const endValue = targetValue;
    const startTime = performance.now();
    
    let animationFrameId: number;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      
      const currentVal = startValue + (endValue - startValue) * easeProgress;
      
      // If it's a small number, keep decimals, else round
      if (Math.abs(endValue) < 10 && endValue % 1 !== 0) {
        setValue(currentVal);
      } else {
        setValue(Math.round(currentVal));
      }
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setValue(endValue);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    prevTargetRef.current = targetValue;
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, duration, value]);

  return value;
};

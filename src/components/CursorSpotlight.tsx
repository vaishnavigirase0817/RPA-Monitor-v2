import { useEffect, useRef } from 'react';

export const CursorSpotlight = () => {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        requestAnimationFrame(() => {
          if (spotlightRef.current) {
            spotlightRef.current.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
          }
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={spotlightRef}
      className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-50 opacity-20 mix-blend-screen transition-opacity duration-300"
      style={{
        background: 'radial-gradient(circle, rgba(0,229,255,0.4) 0%, rgba(0,0,0,0) 70%)',
        willChange: 'transform'
      }}
    />
  );
};

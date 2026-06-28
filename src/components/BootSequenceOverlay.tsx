import { useEffect, useState } from 'react';

export const BootSequenceOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Only run on initial mount
    const hasBooted = sessionStorage.getItem('rpa_booted');
    if (hasBooted) {
      setIsVisible(false);
      return;
    }

    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('rpa_booted', 'true');
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${stage === 2 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-center gap-4 mb-8 animate-pulse">
        <div className="w-16 h-16 rounded-full border-4 border-electric-blue flex items-center justify-center neon-border">
          <span className="font-bold text-electric-blue text-2xl">RPA</span>
        </div>
      </div>
      
      <div className="font-mono text-electric-blue text-sm space-y-2 text-center">
        <p className="animate-[fadeInUp_0.3s_ease-out]">INITIALIZING KERNEL...</p>
        {stage >= 1 && <p className="animate-[fadeInUp_0.3s_ease-out]">ESTABLISHING SECURE CONNECTION...</p>}
        {stage >= 1 && <p className="text-emerald-400 animate-[fadeInUp_0.5s_ease-out] mt-4">SYSTEM ONLINE</p>}
      </div>
      
      <div className="absolute bottom-10 w-64 h-1 bg-white/10 rounded overflow-hidden">
        <div className="h-full bg-electric-blue transition-all duration-1000 ease-out" style={{ width: stage === 0 ? '30%' : stage === 1 ? '70%' : '100%' }}></div>
      </div>
    </div>
  );
};

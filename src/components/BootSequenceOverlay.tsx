import { useEffect, useState } from 'react';

export const BootSequenceOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Only run on initial mount
    const hasBooted = localStorage.getItem('rpa_booted');
    if (hasBooted) {
      setIsVisible(false);
      return;
    }

    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => setStage(3), 1800);
    const t4 = setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('rpa_booted', 'true');
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${stage === 3 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
      <div className="flex items-center gap-4 mb-8 animate-pulse">
        <div className="w-16 h-16 rounded-full border-4 border-electric-blue flex items-center justify-center neon-border shadow-[0_0_30px_rgba(0,229,255,0.5)]">
          <span className="font-bold text-electric-blue text-2xl">RPA</span>
        </div>
      </div>
      
      <div className="font-mono text-electric-blue text-sm space-y-2 text-center">
        <p className="animate-[fadeInUp_0.3s_ease-out]">SYSTEM INITIALIZATION...</p>
        {stage >= 1 && <p className="animate-[fadeInUp_0.3s_ease-out]">CONNECTING TELEMETRY...</p>}
        {stage >= 2 && <p className="animate-[fadeInUp_0.3s_ease-out]">LOADING MODULES...</p>}
        {stage >= 2 && <p className="text-emerald-400 animate-[fadeInUp_0.5s_ease-out] mt-4 font-bold neon-text-emerald">SYSTEM ONLINE</p>}
      </div>
      
      <div className="absolute bottom-10 w-64 h-1 bg-white/10 rounded overflow-hidden">
        <div className="h-full bg-electric-blue transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,229,255,0.8)]" style={{ width: stage === 0 ? '25%' : stage === 1 ? '60%' : '100%' }}></div>
      </div>
    </div>
  );
};

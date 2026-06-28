import { useEffect, useState } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  return (
    <div className={`fixed inset-0 z-[250] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-navy/90 border border-electric-blue/30 rounded-xl shadow-[0_0_50px_rgba(0,229,255,0.1)] p-8 max-w-2xl w-full text-gray-300 transform transition-transform duration-300 scale-100">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-electric-blue">
            <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c1.68 0 3.282.41 4.75 1.143.61.306 1.25-.136 1.25-.707V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
          </svg>
          Enterprise RPA Monitor v2.0
        </h2>
        <p className="text-gray-400 mb-8">Welcome to the premium hackathon-winning edition. Master the system using these shortcuts.</p>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-black/40 rounded-lg p-4 border border-white/5">
            <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">Global Shortcuts</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center">
                <span>Command Palette</span>
                <kbd className="bg-white/10 text-electric-blue px-2 py-1 rounded font-mono">Ctrl/Cmd + K</kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Play / Pause Stream</span>
                <kbd className="bg-white/10 text-electric-blue px-2 py-1 rounded font-mono">Spacebar</kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Toggle Fullscreen</span>
                <kbd className="bg-white/10 text-electric-blue px-2 py-1 rounded font-mono">F</kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Show This Help</span>
                <kbd className="bg-white/10 text-electric-blue px-2 py-1 rounded font-mono">?</kbd>
              </li>
            </ul>
          </div>

          <div className="bg-black/40 rounded-lg p-4 border border-white/5">
            <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">Pro Tips</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-electric-blue mt-0.5">•</span>
                <span><strong>Multi-Sort:</strong> Hold <kbd className="text-xs bg-white/10 px-1 rounded">Shift</kbd> and click multiple columns to prioritize sorting.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-electric-blue mt-0.5">•</span>
                <span><strong>Context Menus:</strong> Right-click any row in the virtual grid.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-electric-blue mt-0.5">•</span>
                <span><strong>CSV Export:</strong> Hit Ctrl+K and search "Export".</span>
              </li>
            </ul>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30 border border-electric-blue/50 py-3 rounded-lg font-bold transition-all"
        >
          ACKNOWLEDGE & START
        </button>
      </div>
    </div>
  );
};

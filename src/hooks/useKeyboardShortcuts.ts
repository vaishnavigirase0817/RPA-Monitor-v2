import { useEffect } from 'react';

interface ShortcutConfig {
  onTogglePause: () => void;
  onToggleFullscreen: () => void;
}

export const useKeyboardShortcuts = ({ onTogglePause, onToggleFullscreen }: ShortcutConfig) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePause();
      }
      
      if (e.code === 'KeyF') {
        e.preventDefault();
        onToggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePause, onToggleFullscreen]);
};

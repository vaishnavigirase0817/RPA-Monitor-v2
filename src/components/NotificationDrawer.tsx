import { useEffect, useRef, useMemo } from 'react';
import type { Notification } from '../types/types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClear: () => void;
}

export const NotificationDrawer = ({ isOpen, onClose, notifications, onMarkRead, onMarkAllRead, onClear }: NotificationDrawerProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && panelRef.current) panelRef.current.focus();
  }, [isOpen]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const severityStyles: Record<string, string> = {
    info: 'border-electric-blue/30 bg-electric-blue/5',
    success: 'border-emerald-500/30 bg-emerald-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    error: 'border-soft-orange/30 bg-soft-orange/5',
  };

  const severityDot: Record<string, string> = {
    info: 'bg-electric-blue',
    success: 'bg-emerald-400',
    warning: 'bg-yellow-400',
    error: 'bg-soft-orange',
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-[190] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div 
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Notifications"
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-navy/95 backdrop-blur-xl border-l border-white/10 z-[200] flex flex-col transition-transform duration-300 ease-out outline-none ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-navy to-purple/5 shrink-0">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-white tracking-wide">Notifications</h2>
            <button onClick={onClose} className="p-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-colors" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button onClick={onMarkAllRead} className="text-xs text-electric-blue hover:text-white transition-colors uppercase tracking-wider">
                Mark all read ({unreadCount})
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={onClear} className="text-xs text-gray-500 hover:text-soft-orange transition-colors uppercase tracking-wider">
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-600 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-3 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              No notifications
            </div>
          )}
          {[...notifications].reverse().map(n => (
            <div 
              key={n.id} 
              className={`p-3 rounded-lg border ${severityStyles[n.severity]} ${!n.read ? 'ring-1 ring-white/10' : 'opacity-60'} transition-all cursor-pointer hover:opacity-100`}
              onClick={() => onMarkRead(n.id)}
            >
              <div className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${severityDot[n.severity]} ${!n.read ? 'animate-pulse' : ''}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{n.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.message}</p>
                  <p className="text-[10px] text-gray-600 mt-2 font-mono">{new Date(n.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

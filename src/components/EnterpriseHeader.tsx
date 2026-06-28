import { useMemo } from 'react';
import type { ConnectionStatus } from '../types/types';
import type { TabId } from './Sidebar';

interface EnterpriseHeaderProps {
  connectionStatus: ConnectionStatus;
  unreadNotifications: number;
  onNotificationClick: () => void;
  activeTab: TabId;
  onToggleMobileDrawer: () => void;
}

export const EnterpriseHeader = ({ connectionStatus, unreadNotifications, onNotificationClick, activeTab, onToggleMobileDrawer }: EnterpriseHeaderProps) => {
  const statusConfig = useMemo(() => {
    switch (connectionStatus) {
      case 'Connected': return { color: 'bg-emerald-500', text: 'text-emerald-400', label: 'Live Connection', ping: true };
      case 'Connecting': return { color: 'bg-yellow-400', text: 'text-yellow-400', label: 'Connecting...', ping: true };
      case 'Reconnecting': return { color: 'bg-soft-orange', text: 'text-soft-orange', label: 'Reconnecting...', ping: true };
      case 'Disconnected': return { color: 'bg-red-500', text: 'text-red-400', label: 'Disconnected', ping: false };
      default: return { color: 'bg-gray-500', text: 'text-gray-400', label: 'Unknown', ping: false };
    }
  }, [connectionStatus]);

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/5 shrink-0 bg-black/20 backdrop-blur-sm z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger (visible only on small screens) */}
        <button
          onClick={onToggleMobileDrawer}
          className="flex md:hidden text-gray-400 hover:text-white p-1 -ml-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Open mobile menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Mobile Active Tab Name */}
        <div className="flex md:hidden items-center gap-2">
          <span className="text-white font-bold tracking-widest text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-electric-blue">
              <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
            </svg>
            {activeTab}
          </span>
        </div>

        {/* Desktop Breadcrumbs */}
        <nav className="hidden md:flex text-sm text-gray-400 font-medium" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><a href="#" className="hover:text-white transition-colors">Infrastructure</a></li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </li>
            <li><a href="#" className="hover:text-white transition-colors">Global Monitors</a></li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </li>
            <li className="text-white" aria-current="page">{activeTab}</li>
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {statusConfig.ping && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusConfig.color} opacity-75`}></span>}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusConfig.color}`}></span>
          </span>
          <span className={`${statusConfig.text} text-xs font-bold tracking-wider uppercase`}>{statusConfig.label}</span>
        </div>

        <div className="h-5 w-px bg-white/10"></div>

        {/* Keyboard Shortcut Hint */}
        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-gray-600 font-mono">
          <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-500">Ctrl+K</kbd>
        </div>

        <div className="hidden md:block h-5 w-px bg-white/10"></div>

        {/* Notification Bell */}
        <button 
          onClick={onNotificationClick}
          className="text-gray-400 hover:text-white transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-electric-blue rounded p-1"
          aria-label={`Notifications (${unreadNotifications} unread)`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-soft-orange text-black text-[9px] font-bold rounded-full flex items-center justify-center border border-black">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </button>

        {/* User Avatar */}
        <button className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-electric-blue rounded p-1">
          <div className="w-8 h-8 rounded-full border border-white/20 hover:border-electric-blue transition-colors bg-gradient-to-br from-electric-blue/20 to-purple/20 flex items-center justify-center">
            <span className="text-xs font-bold text-white">A</span>
          </div>
        </button>
      </div>
    </header>
  );
};

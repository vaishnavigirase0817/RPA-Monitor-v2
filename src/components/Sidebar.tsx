import { useState } from 'react';

export type TabId = 'Dashboard' | 'Live Telemetry' | 'Bot Management' | 'Processes' | 'Analytics' | 'Activity Logs' | 'Alerts' | 'Infrastructure' | 'Settings';

interface SidebarProps {
  activeTab: TabId;
  onNavigate: (tab: TabId) => void;
}

export const Sidebar = ({ activeTab, onNavigate }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems: { name: TabId; icon: React.ReactNode }[] = [
    { name: 'Dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /> },
    { name: 'Live Telemetry', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /> },
    { name: 'Bot Management', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" /> },
    { name: 'Processes', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /> },
    { name: 'Analytics', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /> },
    { name: 'Activity Logs', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { name: 'Alerts', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> },
    { name: 'Infrastructure', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008V18zm0-6h.008v.008h-.008v-.008zm-6 6h.008v.008h-.008V18zm0-6h.008v.008H9.75v-.008z" /> },
    { name: 'Settings', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /> },
  ];

  return (
    <aside 
      className={`bg-navy/90 backdrop-blur-md hidden md:flex flex-col transition-all duration-300 ${isCollapsed ? 'w-[68px]' : 'w-56'} h-full border-r border-electric-blue/10 relative z-40 shrink-0`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-md border border-electric-blue/40 flex flex-shrink-0 items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.15)] bg-electric-blue/5">
              <span className="font-bold text-electric-blue text-[10px]">RPA</span>
            </div>
            <span className="font-bold text-white tracking-wide truncate text-sm">Monitor <span className="text-gray-500 font-normal text-xs">v2</span></span>
          </div>
        )}
        {isCollapsed && (
          <div className="w-7 h-7 mx-auto rounded-md border border-electric-blue/40 flex flex-shrink-0 items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.15)] bg-electric-blue/5">
            <span className="font-bold text-electric-blue text-[10px]">RPA</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-4 bg-navy border border-white/10 rounded-full p-0.5 text-gray-500 hover:text-white hover:border-electric-blue/50 transition-colors z-50`}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 py-3 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {menuItems.map((item) => (
          <button 
            key={item.name}
            onClick={() => onNavigate(item.name)}
            className={`relative flex items-center px-3 py-2.5 mx-2 rounded-lg transition-all group outline-none focus-visible:ring-2 focus-visible:ring-electric-blue overflow-hidden btn-base btn-ripple ${
              activeTab === item.name 
                ? 'text-electric-blue' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
            title={isCollapsed ? item.name : undefined}
            aria-label={item.name}
          >
            {/* Active highlight background */}
            <div className={`absolute inset-0 bg-electric-blue/10 shadow-[inset_3px_0_0_rgba(0,229,255,1)] transition-transform duration-300 origin-left ${activeTab === item.name ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50 group-hover:bg-white/5 group-hover:shadow-none'}`} />
            
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-[18px] h-[18px] shrink-0 relative z-10 transition-transform ${activeTab === item.name ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </svg>
            {!isCollapsed && <span className="ml-3 text-sm font-medium truncate relative z-10 transition-colors">{item.name}</span>}
            {!isCollapsed && activeTab === item.name && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-electric-blue shadow-[0_0_6px_rgba(0,229,255,1)] animate-pulse-glow relative z-10"></span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-white/5 shrink-0">
        <button className="flex items-center justify-center w-full px-3 py-2 bg-white/5 hover:bg-soft-orange/10 text-gray-500 hover:text-soft-orange rounded-lg transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-soft-orange text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[18px] h-[18px] shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          {!isCollapsed && <span className="ml-3 font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

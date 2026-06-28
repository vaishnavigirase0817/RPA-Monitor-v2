import { useEffect, useRef, useMemo } from 'react';
import { useInspector } from './InspectorProvider';
import { formatCurrency, formatPercentage } from '../utils/formatters';

export const InspectorPanel = () => {
  const { isOpen, selectedItem, closeInspector } = useInspector();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeInspector();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeInspector]);

  // Trap focus (simple approach for hackathon: auto focus first element)
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  const groups = useMemo(() => {
    if (!selectedItem) return [];

    // Dynamically categorize the object
    const core = ['id', 'projectName', 'status', 'timestamp'];
    const financial = ['budget', 'roi', 'annualSavings', 'employeeHours'];
    const organization = ['company', 'partner', 'industry', 'department', 'country'];
    const technical = ['robotName', 'processName', 'automationType', 'rowsProcessed'];

    const getGroup = (key: string) => {
      if (core.includes(key)) return 'Core Information';
      if (financial.includes(key)) return 'Financial Metrics';
      if (organization.includes(key)) return 'Organization Details';
      if (technical.includes(key)) return 'Technical Specs';
      return 'Additional Metadata';
    };

    const grouped: Record<string, { key: string, value: any }[]> = {};

    Object.entries(selectedItem).forEach(([key, value]) => {
      if (key === 'isNew') return; // internal UI flag
      const groupName = getGroup(key);
      if (!grouped[groupName]) grouped[groupName] = [];
      grouped[groupName].push({ key, value });
    });

    return Object.entries(grouped).sort((a, b) => {
      // Force Core to top, Additional to bottom
      if (a[0] === 'Core Information') return -1;
      if (b[0] === 'Core Information') return 1;
      if (a[0] === 'Additional Metadata') return 1;
      if (b[0] === 'Additional Metadata') return -1;
      return 0;
    });
  }, [selectedItem]);

  const renderValue = (key: string, value: any) => {
    if (key.toLowerCase().includes('budget') || key.toLowerCase().includes('savings')) {
      return <span className="font-mono text-gray-200">{formatCurrency(Number(value))}</span>;
    }
    if (key.toLowerCase().includes('roi')) {
      const isNegative = Number(value) < 0;
      return <span className={`font-mono font-bold ${isNegative ? 'text-soft-orange' : 'text-emerald-400'}`}>{formatPercentage(Number(value))}</span>;
    }
    if (key === 'status') {
      return (
        <span className={`px-2 py-0.5 text-xs font-bold tracking-wider rounded uppercase border ${
          value === 'Running' ? 'bg-electric-blue/10 text-electric-blue border-electric-blue/30 shadow-[0_0_8px_rgba(0,229,255,0.2)]' :
          value === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
          'bg-soft-orange/10 text-soft-orange border-soft-orange/30 shadow-[0_0_8px_rgba(255,159,67,0.3)]'
        }`}>
          {value}
        </span>
      );
    }
    if (key === 'timestamp') {
      return <span className="text-gray-300">{new Date(value as number).toLocaleString()}</span>;
    }
    if (typeof value === 'number') {
      return <span className="font-mono text-cyan">{value.toLocaleString()}</span>;
    }
    return <span className="text-gray-300">{String(value)}</span>;
  };

  const formatKey = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeInspector}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <div 
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Project Inspector"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-navy/95 border-l border-electric-blue/20 shadow-[-10px_0_30px_rgba(0,229,255,0.1)] z-[210] flex flex-col transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} outline-none`}
      >
        {selectedItem && (
          <>
            {/* Header */}
            <div className="shrink-0 p-6 border-b border-white/10 bg-gradient-to-r from-navy to-electric-blue/5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-electric-blue/10 border border-electric-blue/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-electric-blue">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wide truncate max-w-[200px]">{selectedItem.projectName}</h2>
                    <p className="text-xs text-gray-400 font-mono">ID: {selectedItem.id}</p>
                  </div>
                </div>
                <button 
                  onClick={closeInspector}
                  className="p-2 bg-white/5 hover:bg-soft-orange/20 text-gray-400 hover:text-soft-orange rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-electric-blue"
                  aria-label="Close Inspector"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              {groups.map(([groupName, fields]) => (
                <details key={groupName} className="group glass-panel rounded-lg overflow-hidden border border-white/5 open:border-electric-blue/20 transition-all" open>
                  <summary className="p-4 bg-white/5 cursor-pointer font-semibold text-sm tracking-widest uppercase text-white flex justify-between items-center group-hover:bg-white/10 transition-colors outline-none focus-visible:bg-white/10">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-electric-blue group-open:animate-pulse"></span>
                      {groupName}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500 transform group-open:rotate-180 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </summary>
                  <div className="p-4 space-y-4 bg-black/20 border-t border-white/5">
                    {fields.map(field => (
                      <div key={field.key} className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{formatKey(field.key)}</span>
                        <div className="text-sm">
                          {renderValue(field.key, field.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
            
            {/* Footer */}
            <div className="shrink-0 p-4 border-t border-white/10 bg-black/40 flex justify-end">
               <button 
                  onClick={closeInspector}
                  className="px-4 py-2 text-sm font-bold bg-white/5 hover:bg-white/10 text-gray-300 rounded transition-colors"
                >
                  Dismiss (Esc)
                </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

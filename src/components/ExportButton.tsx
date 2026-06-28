

interface ExportButtonProps {
  onExport: () => void;
  isExporting: boolean;
}

export const ExportButton = ({ onExport, isExporting }: ExportButtonProps) => {
  return (
    <button
      onClick={onExport}
      disabled={isExporting}
      className={`group relative flex items-center gap-2 px-4 py-2 rounded-md font-bold transition-all overflow-hidden ${
        isExporting
          ? 'bg-white/10 text-gray-400 cursor-not-allowed border border-white/20'
          : 'bg-gradient-to-r from-electric-blue/10 to-purple/10 text-electric-blue border border-electric-blue/30 hover:border-electric-blue hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:-translate-y-0.5'
      }`}
      aria-label="Export Snapshot to CSV"
      title="Export Snapshot to CSV"
    >
      {/* Glow effect on hover */}
      {!isExporting && (
        <div className="absolute inset-0 bg-electric-blue/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      )}
      
      {/* Ripple effect base layer */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity duration-100"></div>

      <div className="relative z-10 flex items-center gap-2">
        {isExporting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-electric-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm tracking-wide">Preparing Snapshot...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span className="text-sm tracking-wide">Export Snapshot</span>
            <span className="ml-1 px-1.5 py-0.5 bg-electric-blue/20 text-[10px] text-electric-blue font-mono rounded border border-electric-blue/30 group-hover:border-electric-blue transition-colors">CSV</span>
          </>
        )}
      </div>
    </button>
  );
};

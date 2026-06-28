import { mockProcessData } from '../mockData/mockProcessData';

export const ProcessMonitoringView = () => {
  return (
    <div className="p-6 h-full overflow-hidden flex flex-col gap-6 animate-fade-in">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-wide">Process Queues</h2>
        <p className="text-gray-400 text-sm mt-1">Monitor queue depths and average execution times across business processes.</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          {mockProcessData.map(proc => (
            <div key={proc.id} className="bg-navy/40 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-navy/60 hover:border-white/20 transition-all group flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${
                  proc.status === 'Running' ? 'border-emerald-400/30 bg-emerald-400/10' : 
                  proc.status === 'Idle' ? 'border-gray-400/30 bg-gray-400/10' : 'border-soft-orange/30 bg-soft-orange/10'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${proc.status === 'Running' ? 'text-emerald-400' : proc.status === 'Idle' ? 'text-gray-400' : 'text-soft-orange'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-white font-bold text-lg">{proc.name}</h3>
                  <div className="flex gap-4 mt-1 text-sm text-gray-400 font-mono">
                    <span>ID: {proc.id}</span>
                    <span>Owner: {proc.owner}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Queue Size</p>
                  <p className={`text-xl font-black font-mono ${proc.queue_size > 1000 ? 'text-soft-orange animate-pulse' : 'text-white'}`}>{proc.queue_size.toLocaleString()}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Avg Exec Time</p>
                  <p className="text-xl font-black font-mono text-electric-blue">{proc.avg_execution_time}</p>
                </div>

                <div className="text-center w-24">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Priority</p>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    proc.priority === 'Critical' ? 'bg-soft-orange text-black' :
                    proc.priority === 'High' ? 'bg-yellow-400 text-black' :
                    proc.priority === 'Medium' ? 'bg-white/10 text-white' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {proc.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

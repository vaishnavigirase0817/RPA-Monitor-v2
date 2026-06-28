import { mockInfrastructureData } from '../mockData/mockInfrastructureData';
import { useToast } from '../components/ToastProvider';

export const InfrastructureView = () => {
  const { showToast } = useToast();

  const handleReboot = (server: string) => {
    showToast(`Reboot signal sent to ${server}`, 'warning');
  };

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col gap-6 animate-fade-in">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-wide">Infrastructure Health</h2>
        <p className="text-gray-400 text-sm mt-1">Monitor global server nodes, CPU, and Memory utilization.</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockInfrastructureData.map(node => (
            <div key={node.id} className="bg-navy/40 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-navy/60 hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-electric-blue">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008V18zm0-6h.008v.008h-.008v-.008zm-6 6h.008v.008h-.008V18zm0-6h.008v.008H9.75v-.008z" />
                    </svg>
                    {node.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-mono mt-1">{node.id} • {node.region}</p>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold border ${
                  node.status === 'Healthy' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' :
                  node.status === 'Degraded' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
                  'text-soft-orange bg-soft-orange/10 border-soft-orange/30'
                }`}>
                  {node.status}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 uppercase tracking-wider font-bold">CPU Usage</span>
                    <span className={`font-mono font-bold ${node.cpu_usage > 80 ? 'text-soft-orange' : 'text-white'}`}>{node.cpu_usage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${node.cpu_usage > 80 ? 'bg-soft-orange' : 'bg-electric-blue'}`} 
                      style={{ width: `${node.cpu_usage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 uppercase tracking-wider font-bold">Memory Usage</span>
                    <span className={`font-mono font-bold ${node.memory_usage > 80 ? 'text-soft-orange' : 'text-white'}`}>{node.memory_usage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${node.memory_usage > 80 ? 'bg-soft-orange' : 'bg-purple'}`} 
                      style={{ width: `${node.memory_usage}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Network I/O</span>
                  <span className="font-mono text-sm text-electric-blue">{node.network_io}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => handleReboot(node.name)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded border border-white/10 transition-colors"
                >
                  Restart Node
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

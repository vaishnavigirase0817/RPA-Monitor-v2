import { useState, useMemo } from 'react';
import { mockBotData } from '../mockData/mockBotData';
import { useToast } from '../components/ToastProvider';

export const BotManagementView = () => {
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const filteredBots = useMemo(() => {
    return mockBotData.filter(b => 
      b.bot_name.toLowerCase().includes(search.toLowerCase()) || 
      b.bot_id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleAction = (botId: string, action: string) => {
    showToast(`${action} command sent to ${botId}`, 'success');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Online': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'Offline': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      case 'Error': return 'text-soft-orange bg-soft-orange/10 border-soft-orange/30';
      case 'Maintenance': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      default: return 'text-white';
    }
  };

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Bot Management</h2>
          <p className="text-gray-400 text-sm mt-1">Manage, restart, and monitor individual robotic workers.</p>
        </div>
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search bots..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/50 border border-electric-blue/30 rounded-md py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-electric-blue focus:shadow-[0_0_10px_rgba(0,229,255,0.3)] transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute right-3 top-2 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBots.map(bot => (
            <div key={bot.bot_id} className="bg-navy/40 backdrop-blur-md border border-white/10 p-5 rounded-xl hover:bg-navy/60 hover:border-white/20 transition-all hover:-translate-y-1 duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-electric-blue/50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-electric-blue">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{bot.bot_name}</h3>
                    <p className="text-gray-500 text-xs font-mono">{bot.bot_id}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getStatusColor(bot.status)}`}>
                  {bot.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Process</p>
                  <p className="text-sm text-gray-300 font-medium truncate" title={bot.assigned_process}>{bot.assigned_process}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Success Rate</p>
                  <p className={`text-sm font-mono ${bot.success_rate < 90 ? 'text-soft-orange' : 'text-emerald-400'}`}>{bot.success_rate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Runtime</p>
                  <p className="text-sm text-gray-300 font-mono">{bot.runtime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Version</p>
                  <p className="text-sm text-gray-300 font-mono">{bot.version}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction(bot.bot_id, 'Restart')}
                  className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded border border-white/10 transition-colors text-xs font-bold uppercase"
                >
                  Restart
                </button>
                <button 
                  onClick={() => handleAction(bot.bot_id, 'View Logs')}
                  className="flex-1 py-1.5 bg-electric-blue/10 hover:bg-electric-blue/20 text-electric-blue rounded border border-electric-blue/30 transition-colors text-xs font-bold uppercase"
                >
                  Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

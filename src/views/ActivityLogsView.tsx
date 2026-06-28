import { useState, useMemo } from 'react';
import { mockLogsData } from '../mockData/mockLogsData';

export const ActivityLogsView = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredLogs = useMemo(() => {
    return mockLogsData.filter(log => {
      const matchSearch = log.message.toLowerCase().includes(search.toLowerCase()) || log.event.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'All' || log.severity === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Activity Logs</h2>
          <p className="text-gray-400 text-sm mt-1">Audit trail and system event history.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            className="bg-navy/50 border border-white/20 rounded-md py-2 px-3 text-sm text-white focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Info">Info</option>
            <option value="Warning">Warning</option>
            <option value="Critical">Critical</option>
          </select>
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-64 bg-navy/50 border border-white/20 rounded-md py-2 px-3 text-sm text-white focus:outline-none focus:border-electric-blue"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-navy/40 border border-white/10 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-navy/90 backdrop-blur-md z-10 shadow-md">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Timestamp</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Severity</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Event</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Source</th>
              <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-1/2">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-sm font-mono text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    log.severity === 'Info' ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20' :
                    log.severity === 'Warning' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' :
                    'bg-soft-orange/10 text-soft-orange border border-soft-orange/20'
                  }`}>
                    {log.severity}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-300 font-medium whitespace-nowrap">{log.event}</td>
                <td className="p-4 text-sm text-gray-400 whitespace-nowrap">{log.source}</td>
                <td className="p-4 text-sm text-gray-400 group-hover:text-gray-200 transition-colors">{log.message}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">No logs found matching criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

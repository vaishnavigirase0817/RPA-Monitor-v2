import { mockDashboardData } from '../mockData/mockDashboardData';
import { useToast } from '../components/ToastProvider';

export const DashboardView = () => {
  const { kpis, recentActivity, revenueTrend } = mockDashboardData;
  const { showToast } = useToast();

  const handleAction = () => {
    showToast('Refreshing Dashboard Data...', 'info');
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar animate-fade-in flex flex-col gap-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Enterprise Dashboard</h2>
          <p className="text-gray-400 text-sm mt-1">High-level system health and performance overview.</p>
        </div>
        <button 
          onClick={handleAction}
          className="px-4 py-2 bg-electric-blue/10 hover:bg-electric-blue/20 text-electric-blue border border-electric-blue/30 rounded-lg transition-all hover:-translate-y-0.5 shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-electric-blue text-sm font-medium"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        {[
          { label: 'Total Bots', value: kpis.totalBots, color: 'text-white' },
          { label: 'Active Bots', value: kpis.activeBots, color: 'text-emerald-400' },
          { label: 'Failed Bots', value: kpis.failedBots, color: 'text-soft-orange' },
          { label: 'Tasks Completed', value: kpis.completedTasks.toLocaleString(), color: 'text-electric-blue' },
          { label: 'Revenue Saved', value: `$${(kpis.revenueSaved / 1000000).toFixed(1)}M`, color: 'text-purple' },
          { label: 'System Health', value: `${kpis.systemHealth}%`, color: 'text-emerald-400' },
        ].map((kpi, i) => (
          <div key={i} className="bg-navy/40 backdrop-blur-md border border-white/10 p-6 rounded-xl relative overflow-hidden group hover:border-white/20 hover:bg-navy/50 transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-electric-blue/30 group-hover:bg-electric-blue transition-colors"></div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{kpi.label}</p>
            <p className={`text-3xl font-black font-mono ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Recent Activity */}
        <div className="bg-navy/40 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col h-full hover:border-white/20 transition-colors duration-300">
          <h3 className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
            {recentActivity.map(act => (
              <div key={act.id} className="flex gap-4 items-start group">
                <div className="flex flex-col items-center mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${act.type === 'success' ? 'bg-emerald-400' : act.type === 'error' ? 'bg-soft-orange' : act.type === 'warning' ? 'bg-yellow-400' : 'bg-electric-blue'} group-hover:scale-125 transition-transform`} />
                  <div className="w-px h-full bg-white/10 my-1 min-h-[20px]" />
                </div>
                <div className="pb-4">
                  <p className="text-sm text-gray-200 font-medium group-hover:text-white transition-colors">{act.event}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trend placeholder (Since Chart.js is already in project, we could render a simple chart, but let's keep it simple for now or just mock the space) */}
        <div className="bg-navy/40 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col h-full hover:border-white/20 transition-colors duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="text-gray-300 text-sm font-bold uppercase tracking-widest mb-6 relative z-10">Revenue Trend (YTD)</h3>
          <div className="flex-1 flex items-end justify-between gap-2 relative z-10 pb-4">
            {revenueTrend.map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-3 flex-1 group/bar">
                <div className="w-full bg-electric-blue/20 rounded-t-sm relative flex items-end justify-center group-hover/bar:bg-electric-blue/40 transition-colors" style={{ height: `${(t.revenue / 2.5) * 100}%`, minHeight: '10%' }}>
                  <span className="absolute -top-6 text-xs text-electric-blue font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity">${t.revenue}M</span>
                </div>
                <span className="text-xs text-gray-500 uppercase">{t.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

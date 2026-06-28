import { useState, useEffect } from 'react';
import type { KPIData } from '../types/types';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { SparklineGraph } from './SparklineGraph';
import { StatusDistribution } from './StatusDistribution';

interface KPIProps {
  data: KPIData;
}

export const KPISection = ({ data }: KPIProps) => {
  const animatedStreamedRows = useAnimatedCounter(data.totalStreamedRows, 300);
  const animatedRobots = useAnimatedCounter(data.activeRobots, 300);
  const animatedSavings = useAnimatedCounter(data.globalSavings, 300);
  const animatedROI = useAnimatedCounter(data.roi, 500);

  const [roiHistory, setRoiHistory] = useState<number[]>([]);
  
  useEffect(() => {
    // Keep a sliding window of the last 20 ROI values for the sparkline
    setRoiHistory(prev => {
      const next = [...prev, data.roi];
      if (next.length > 20) return next.slice(next.length - 20);
      return next;
    });
  }, [data.roi]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard 
        title="Active Robots" 
        value={formatNumber(animatedRobots)} 
        trend="+12%"
        icon={<StatusDistribution completed={data.completedProcesses} failed={data.failedProcesses} running={data.activeRobots} size={48} strokeWidth={6} />}
      />
      <KPICard 
        title="Total Streamed Rows" 
        value={formatNumber(animatedStreamedRows)} 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-electric-blue">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
          </svg>
        }
      />
      <KPICard 
        title="Global Savings" 
        value={formatCurrency(animatedSavings)} 
        trend="-2%"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-emerald-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <KPICard 
        title="Average ROI" 
        value={formatPercentage(animatedROI)} 
        trend="+4.5%"
        icon={<SparklineGraph data={roiHistory} width={80} height={32} color="#00e5ff" />}
      />
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

const KPICard = ({ title, value, icon, trend }: KPICardProps) => {
  return (
    <div className="glass-panel p-6 relative overflow-hidden group fade-in-up hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:opacity-20 transition-opacity"></div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">{title}</h3>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
            {trend && (
              <span className={`text-xs font-bold mb-1 ${trend.startsWith('+') ? 'text-emerald-400' : 'text-soft-orange'}`}>
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:border-electric-blue/50 group-hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-all">
          {icon}
        </div>
      </div>
    </div>
  );
};

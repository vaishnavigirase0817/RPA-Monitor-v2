import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import type { StreamItem } from '../../types/types';
import { useAnalyticsAggregation } from '../../hooks/useAnalyticsAggregation';
import { AnalyticsHeader } from './AnalyticsHeader';
import { ChartCard } from './ChartCard';
import { exportToCSV } from '../../utils/exportToCSV';
import { useToast } from '../ToastProvider';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Global Chart.js Defaults
ChartJS.defaults.color = '#9ca3af'; // gray-400
ChartJS.defaults.font.family = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

interface AnalyticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: StreamItem[];
}

export const AnalyticsPanel = ({ isOpen, onClose, data }: AnalyticsPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  
  // Aggregate data using the frozen snapshot
  const analytics = useAnalyticsAggregation(data);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
      if (panelRef.current) panelRef.current.focus();
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExport = () => {
    // Generate a summary export array
    const exportData = [
      { Metric: 'Total Records', Value: analytics.summary.totalRecords },
      { Metric: 'Active Projects', Value: analytics.summary.activeProjects },
      { Metric: 'Completed Projects', Value: analytics.summary.completedProjects },
      { Metric: 'Failed Projects', Value: analytics.summary.failedProjects },
      { Metric: 'Average ROI', Value: analytics.summary.averageRoi.toFixed(2) + '%' },
      { Metric: 'Total Savings', Value: '$' + analytics.summary.totalSavings.toFixed(2) },
      { Metric: 'Unique Robots', Value: analytics.summary.totalRobots },
    ];
    exportToCSV(exportData as any);
    showToast('Analytics Report Exported', 'success');
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const commonOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#e5e7eb', usePointStyle: true, padding: 20 } },
      tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#00e5ff', bodyColor: '#fff', padding: 12, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' } }
    },
    animation: { duration: 1000, easing: 'easeOutQuart' }
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    ...commonOptions,
    scales: { x: { display: false }, y: { display: false } },
    cutout: '70%',
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-in outline-none" role="dialog" aria-modal="true" ref={panelRef} tabIndex={-1}>
      <div className="bg-navy/90 border border-white/10 rounded-2xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-electric-blue/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="p-8 flex flex-col h-full relative z-10 overflow-y-auto custom-scrollbar">
          <AnalyticsHeader onClose={onClose} onExport={handleExport} />

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 shrink-0">
            {[
              { label: 'Records Analyzed', value: analytics.summary.totalRecords.toLocaleString(), color: 'text-white' },
              { label: 'Total Savings', value: formatCurrency(analytics.summary.totalSavings), color: 'text-emerald-400' },
              { label: 'Average ROI', value: `${analytics.summary.averageRoi.toFixed(2)}%`, color: 'text-electric-blue' },
              { label: 'Failure Rate', value: `${((analytics.summary.failedProjects / Math.max(1, analytics.summary.totalRecords)) * 100).toFixed(1)}%`, color: 'text-soft-orange' },
              { label: 'Active Robots', value: analytics.summary.totalRobots.toLocaleString(), color: 'text-purple' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden group hover:bg-white/10 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-electric-blue/50 group-hover:bg-electric-blue transition-colors"></div>
                <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">{stat.label}</span>
                <span className={`text-2xl font-black ${stat.color} font-mono`}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Status Distribution */}
            <ChartCard title="Project Status Distribution">
              <Doughnut 
                data={{
                  labels: Object.keys(analytics.statusDistribution),
                  datasets: [{
                    data: Object.values(analytics.statusDistribution),
                    backgroundColor: ['#10b981', '#00e5ff', '#ff5a5f', '#6b7280'],
                    borderWidth: 0,
                    hoverOffset: 4
                  }]
                }} 
                options={doughnutOptions} 
              />
            </ChartCard>

            {/* Financial Overview */}
            <ChartCard title="Financial Overview (Savings Trend)" className="lg:col-span-2">
              <Line 
                data={{
                  labels: analytics.financialOverview.map(f => f.category),
                  datasets: [{
                    label: 'Total Savings ($)',
                    data: analytics.financialOverview.map(f => f.savings),
                    borderColor: '#00e5ff',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#fff',
                  }]
                }} 
                options={{
                  ...commonOptions,
                  plugins: { ...commonOptions.plugins, tooltip: { ...commonOptions.plugins?.tooltip, callbacks: { label: (ctx) => formatCurrency(ctx.raw as number) } } },
                  scales: { ...commonOptions.scales, y: { ...commonOptions.scales?.y, ticks: { callback: (val) => '$' + (val as number / 1000) + 'k' } } }
                }} 
              />
            </ChartCard>

            {/* Department Performance */}
            <ChartCard title="Department ROI Performance" className="lg:col-span-2">
              <Bar 
                data={{
                  labels: Object.keys(analytics.departmentPerformance),
                  datasets: [{
                    label: 'Average ROI (%)',
                    data: Object.values(analytics.departmentPerformance),
                    backgroundColor: 'rgba(168, 85, 247, 0.8)',
                    borderRadius: 4,
                  }]
                }} 
                options={{
                  ...commonOptions,
                  indexAxis: 'y' as const,
                }} 
              />
            </ChartCard>

            {/* Automation Type */}
            <ChartCard title="Automation Pipeline">
              <Bar 
                data={{
                  labels: Object.keys(analytics.automationTypeAnalysis),
                  datasets: [{
                    label: 'Projects',
                    data: Object.values(analytics.automationTypeAnalysis),
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderRadius: 4,
                  }]
                }} 
                options={commonOptions} 
              />
            </ChartCard>

          </div>
        </div>
      </div>
    </div>
  );
};

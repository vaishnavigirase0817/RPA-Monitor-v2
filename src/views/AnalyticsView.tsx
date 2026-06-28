import { mockAnalyticsData } from '../mockData/mockAnalyticsData';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { ChartCard } from '../components/AnalyticsOverlay/ChartCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export const AnalyticsView = () => {
  const { historicalRoi, departmentSavings, automationGrowth, efficiencyMetrics } = mockAnalyticsData;

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#e5e7eb', usePointStyle: true } },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar animate-fade-in flex flex-col gap-6">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-wide">Historical Analytics</h2>
        <p className="text-gray-400 text-sm mt-1">Long-term trend analysis and department performance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
        <div className="bg-navy/40 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Hours Saved YTD</p>
          <p className="text-2xl font-bold text-emerald-400">{efficiencyMetrics.hoursSavedYTD.toLocaleString()}</p>
        </div>
        <div className="bg-navy/40 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Error Reduction</p>
          <p className="text-2xl font-bold text-electric-blue">{efficiencyMetrics.errorReduction}%</p>
        </div>
        <div className="bg-navy/40 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Compliance Score</p>
          <p className="text-2xl font-bold text-purple">{efficiencyMetrics.complianceScore}%</p>
        </div>
        <div className="bg-navy/40 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg Execution Cost</p>
          <p className="text-2xl font-bold text-white">${efficiencyMetrics.averageExecutionCost}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
        <ChartCard title="Historical ROI Growth (%)">
          <Line 
            data={{
              labels: historicalRoi.map(d => d.year),
              datasets: [{
                label: 'ROI %',
                data: historicalRoi.map(d => d.roi),
                borderColor: '#00e5ff',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                tension: 0.4,
                fill: true,
              }]
            }}
            options={commonOptions}
          />
        </ChartCard>

        <ChartCard title="Automation Growth (Attended vs Unattended)">
          <Bar 
            data={{
              labels: automationGrowth.map(d => d.quarter),
              datasets: [
                { label: 'Attended', data: automationGrowth.map(d => d.attended), backgroundColor: '#10b981' },
                { label: 'Unattended', data: automationGrowth.map(d => d.unattended), backgroundColor: '#a855f7' }
              ]
            }}
            options={commonOptions}
          />
        </ChartCard>

        <ChartCard title="Department Savings ($M)" className="lg:col-span-2">
          <Bar 
            data={{
              labels: departmentSavings.map(d => d.department),
              datasets: [{
                label: 'Savings',
                data: departmentSavings.map(d => d.savings),
                backgroundColor: 'rgba(0, 229, 255, 0.8)',
              }]
            }}
            options={{ ...commonOptions, indexAxis: 'y' as const }}
          />
        </ChartCard>
      </div>
    </div>
  );
};

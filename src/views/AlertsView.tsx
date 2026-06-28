import { useState } from 'react';
import { mockAlertData } from '../mockData/mockAlertData';
import type { Alert } from '../mockData/mockAlertData';
import { useToast } from '../components/ToastProvider';

export const AlertsView = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlertData);
  const { showToast } = useToast();

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Alert dismissed', 'info');
  };

  const handleMarkRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col gap-6 animate-fade-in">
      <div className="shrink-0">
        <h2 className="text-2xl font-bold text-white tracking-wide">System Alerts</h2>
        <p className="text-gray-400 text-sm mt-1">Active incidents and historical warnings.</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className={`p-5 rounded-xl border flex justify-between items-start transition-all hover:-translate-y-1 ${
            alert.severity === 'Critical' ? 'bg-soft-orange/5 border-soft-orange/30' :
            alert.severity === 'Warning' ? 'bg-yellow-400/5 border-yellow-400/30' :
            'bg-emerald-400/5 border-emerald-400/30'
          } ${alert.isRead ? 'opacity-70 grayscale-[30%]' : 'shadow-lg'}`}>
            <div className="flex gap-4 items-start">
              <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                alert.severity === 'Critical' ? 'bg-soft-orange animate-pulse' :
                alert.severity === 'Warning' ? 'bg-yellow-400' : 'bg-emerald-400'
              }`} />
              <div>
                <h3 className={`text-lg font-bold ${!alert.isRead ? 'text-white' : 'text-gray-400'}`}>{alert.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{alert.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs font-mono text-gray-500">
                  <span>{alert.timestamp}</span>
                  <span className={`uppercase font-bold ${
                    alert.severity === 'Critical' ? 'text-soft-orange' :
                    alert.severity === 'Warning' ? 'text-yellow-400' : 'text-emerald-400'
                  }`}>{alert.severity}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 shrink-0">
              {!alert.isRead && (
                <button 
                  onClick={() => handleMarkRead(alert.id)}
                  className="px-3 py-1.5 text-xs text-electric-blue hover:bg-electric-blue/10 rounded transition-colors"
                >
                  Mark Read
                </button>
              )}
              <button 
                onClick={() => handleDismiss(alert.id)}
                className="p-1.5 text-gray-500 hover:text-soft-orange hover:bg-soft-orange/10 rounded transition-colors"
                title="Dismiss Alert"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">All caught up! No active alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

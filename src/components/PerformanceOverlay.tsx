import { useState, useEffect } from 'react';
import type { StreamTelemetry } from '../types/types';

interface PerformanceOverlayProps {
  telemetry: StreamTelemetry;
  fps: number;
  rps: number;
  queueSize: number;
  totalRows: number;
}

export const PerformanceOverlay = ({ telemetry, fps, rps, queueSize, totalRows }: PerformanceOverlayProps) => {
  const [memoryMB, setMemoryMB] = useState(0);
  const [domNodes, setDomNodes] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
      if (perf.memory) {
        setMemoryMB(Math.round(perf.memory.usedJSHeapSize / (1024 * 1024)));
      }
      setDomNodes(document.querySelectorAll('*').length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'FPS', value: fps, warn: fps < 30, color: fps >= 50 ? 'text-emerald-400' : fps >= 30 ? 'text-yellow-400' : 'text-soft-orange' },
    { label: 'Latency', value: `${telemetry.latencyMs}ms`, warn: telemetry.latencyMs > 50, color: 'text-electric-blue' },
    { label: 'RPS', value: rps, warn: false, color: 'text-cyan' },
    { label: 'Pkt/s', value: telemetry.packetsPerSecond, warn: false, color: 'text-purple' },
    { label: 'Queue', value: queueSize, warn: queueSize > 50, color: queueSize > 50 ? 'text-soft-orange' : 'text-gray-300' },
    { label: 'Rows', value: totalRows.toLocaleString(), warn: false, color: 'text-gray-300' },
    { label: 'Heap', value: `${memoryMB}MB`, warn: memoryMB > 200, color: memoryMB > 200 ? 'text-soft-orange' : 'text-gray-300' },
    { label: 'DOM', value: domNodes, warn: domNodes > 3000, color: domNodes > 3000 ? 'text-soft-orange' : 'text-gray-300' },
    { label: 'Proc', value: `${telemetry.avgProcessingTimeMs}ms`, warn: telemetry.avgProcessingTimeMs > 16, color: 'text-gray-300' },
  ];

  return (
    <div className="fixed bottom-14 right-4 z-[180] bg-black/90 backdrop-blur-md border border-white/10 rounded-lg p-3 text-[10px] font-mono shadow-[0_0_20px_rgba(0,0,0,0.5)] max-w-xs">
      <div className="flex items-center gap-2 mb-2 text-gray-500 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        Performance Monitor
      </div>
      <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
        {metrics.map(m => (
          <div key={m.label} className="flex justify-between gap-2">
            <span className="text-gray-600">{m.label}</span>
            <span className={`font-bold ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

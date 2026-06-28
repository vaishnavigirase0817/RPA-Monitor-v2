import { useEffect, useState, useMemo } from 'react';
import type { StreamTelemetry } from '../types/types';

interface StatusFooterProps {
  fps: number;
  rps: number;
  telemetry: StreamTelemetry;
  queueSize: number;
  totalRows: number;
}

export const StatusFooter = ({ fps, rps, telemetry, queueSize, totalRows }: StatusFooterProps) => {
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [memoryMB, setMemoryMB] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString());
      const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
      if (perf.memory) {
        setMemoryMB(Math.round(perf.memory.usedJSHeapSize / (1024 * 1024)));
      }
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const connectionColor = useMemo(() => {
    switch (telemetry.connectionStatus) {
      case 'Connected': return 'bg-emerald-500';
      case 'Connecting': return 'bg-yellow-400 animate-pulse';
      case 'Reconnecting': return 'bg-soft-orange animate-pulse';
      case 'Disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }, [telemetry.connectionStatus]);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <footer 
      className="px-6 py-2.5 shrink-0 flex flex-wrap justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest bg-navy/80 backdrop-blur-md border-t border-white/5"
      role="contentinfo"
      aria-label="System status footer"
    >
      <div className="flex gap-5 flex-wrap items-center">
        {/* Connection Status */}
        <div className="flex items-center gap-1.5" aria-label={`Connection: ${telemetry.connectionStatus}`}>
          <span className={`w-2 h-2 rounded-full ${connectionColor}`}></span>
          <span className={telemetry.connectionStatus === 'Connected' ? 'text-emerald-400' : 'text-soft-orange'}>
            {telemetry.connectionStatus}
          </span>
        </div>

        {/* Latency */}
        <div className="flex items-center gap-1.5" title="Stream latency">
          <span className={`font-mono ${telemetry.latencyMs > 50 ? 'text-soft-orange' : 'text-gray-400'}`}>
            {telemetry.latencyMs}ms
          </span>
        </div>

        {/* FPS */}
        <div className="flex items-center gap-1.5" title="Frames Per Second">
          <span className={`font-mono ${fps < 30 ? 'text-soft-orange' : 'text-emerald-400'}`}>
            {fps} FPS
          </span>
        </div>

        {/* RPS */}
        <div className="flex items-center gap-1.5" title="Rows Per Second">
          <span className="font-mono text-electric-blue">{rps} RPS</span>
        </div>

        {/* Queue */}
        {queueSize > 0 && (
          <div className="flex items-center gap-1.5" title="Queue size (buffered updates)">
            <span className="font-mono text-yellow-400">{queueSize} queued</span>
          </div>
        )}

        {/* Memory */}
        {memoryMB !== null && (
          <div className="flex items-center gap-1.5" title="JS Heap">
            <span className={`font-mono ${memoryMB > 200 ? 'text-soft-orange' : 'text-gray-400'}`}>
              {memoryMB}MB
            </span>
          </div>
        )}

        {/* Rows */}
        <div className="flex items-center gap-1.5" title="Total rows in buffer">
          <span className="font-mono text-gray-400">{totalRows.toLocaleString()} rows</span>
        </div>
      </div>
      
      <div className="flex gap-5 flex-wrap items-center">
        <span className="text-gray-600">{tz}</span>
        <span className="text-gray-600">Updated: {lastUpdate}</span>
        <span>RPA Monitor v2.1.0</span>
      </div>
    </footer>
  );
};

export interface LogEntry {
  id: string;
  timestamp: string;
  event: string;
  source: string;
  severity: 'Info' | 'Warning' | 'Critical';
  message: string;
}

export const mockLogsData: LogEntry[] = [
  { id: 'LOG-1', timestamp: '2026-06-28 10:45:12', event: 'Bot Started', source: 'Orchestrator', severity: 'Info', message: 'InvoiceProcessor-A initialized successfully.' },
  { id: 'LOG-2', timestamp: '2026-06-28 10:46:05', event: 'API Timeout', source: 'Bot-003', severity: 'Warning', message: 'Salesforce API latency > 5000ms.' },
  { id: 'LOG-3', timestamp: '2026-06-28 10:47:33', event: 'Login Failed', source: 'Bot-008', severity: 'Critical', message: 'Legacy SAP system rejected credentials (Account Locked).' },
  { id: 'LOG-4', timestamp: '2026-06-28 10:50:00', event: 'Queue Processed', source: 'QueueManager', severity: 'Info', message: 'Batch 8945 completed (450 items).' },
  { id: 'LOG-5', timestamp: '2026-06-28 10:52:14', event: 'Memory Spike', source: 'Node-Alpha4', severity: 'Warning', message: 'JS Heap size exceeded 1.2GB threshold.' },
  { id: 'LOG-6', timestamp: '2026-06-28 10:55:01', event: 'Bot Paused', source: 'Admin-UI', severity: 'Info', message: 'Stream paused by operator via Dashboard.' },
  { id: 'LOG-7', timestamp: '2026-06-28 10:58:45', event: 'Database Disconnect', source: 'TelemetryDB', severity: 'Critical', message: 'Connection to Azure SQL instance lost.' },
  { id: 'LOG-8', timestamp: '2026-06-28 11:00:12', event: 'Database Reconnected', source: 'TelemetryDB', severity: 'Info', message: 'Connection restored successfully.' },
];

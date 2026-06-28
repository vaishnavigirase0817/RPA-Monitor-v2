export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'Warning' | 'Resolved';
  timestamp: string;
  isRead: boolean;
}

export const mockAlertData: Alert[] = [
  { id: 'ALT-1', title: 'Data Center Offline', description: 'Frankfurt-02 node is unreachable. Failover initiated.', severity: 'Critical', timestamp: '10 mins ago', isRead: false },
  { id: 'ALT-2', title: 'API Rate Limit', description: 'Salesforce API reached 95% of daily limit for Bot-042.', severity: 'Warning', timestamp: '1 hour ago', isRead: false },
  { id: 'ALT-3', title: 'Queue Bottleneck', description: 'Invoice Processing queue size exceeded 500 items.', severity: 'Warning', timestamp: '2 hours ago', isRead: true },
  { id: 'ALT-4', title: 'License Expiring', description: 'Enterprise Orchestrator license expires in 14 days.', severity: 'Warning', timestamp: '1 day ago', isRead: true },
  { id: 'ALT-5', title: 'Network Restored', description: 'Connection to legacy SAP cluster re-established.', severity: 'Resolved', timestamp: 'Yesterday', isRead: true },
];

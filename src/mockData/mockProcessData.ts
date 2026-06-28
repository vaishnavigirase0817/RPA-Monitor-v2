export interface Process {
  id: string;
  name: string;
  queue_size: number;
  avg_execution_time: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  owner: string;
  status: 'Running' | 'Idle' | 'Blocked';
}

export const mockProcessData: Process[] = [
  { id: 'PRC-101', name: 'Invoice Processing', queue_size: 450, avg_execution_time: '2.5s', priority: 'High', owner: 'Finance Team', status: 'Running' },
  { id: 'PRC-102', name: 'Employee Onboarding', queue_size: 12, avg_execution_time: '45.0s', priority: 'Medium', owner: 'HR Dept', status: 'Running' },
  { id: 'PRC-103', name: 'Daily Report Gen', queue_size: 0, avg_execution_time: '120.0s', priority: 'Low', owner: 'Analytics', status: 'Idle' },
  { id: 'PRC-104', name: 'Fraud Detection Sync', queue_size: 8900, avg_execution_time: '0.2s', priority: 'Critical', owner: 'Security', status: 'Running' },
  { id: 'PRC-105', name: 'Legacy Data Migration', queue_size: 15, avg_execution_time: '300.0s', priority: 'Medium', owner: 'IT Dept', status: 'Blocked' },
  { id: 'PRC-106', name: 'Customer Ticket Triage', queue_size: 124, avg_execution_time: '1.5s', priority: 'High', owner: 'Support', status: 'Running' },
];

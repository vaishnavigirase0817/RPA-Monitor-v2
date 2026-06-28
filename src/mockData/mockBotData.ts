export interface Bot {
  bot_id: string;
  bot_name: string;
  status: 'Online' | 'Offline' | 'Error' | 'Maintenance';
  version: string;
  runtime: string;
  success_rate: number;
  last_execution: string;
  assigned_process: string;
}

export const mockBotData: Bot[] = [
  { bot_id: 'BOT-001', bot_name: 'InvoiceProcessor-A', status: 'Online', version: '2.4.1', runtime: '142h', success_rate: 99.8, last_execution: '2 mins ago', assigned_process: 'Procure-to-Pay' },
  { bot_id: 'BOT-002', bot_name: 'OnboardingSync-1', status: 'Online', version: '2.4.0', runtime: '89h', success_rate: 98.5, last_execution: '5 mins ago', assigned_process: 'HR-Onboarding' },
  { bot_id: 'BOT-003', bot_name: 'DataScraper-X', status: 'Error', version: '2.3.9', runtime: '12h', success_rate: 75.2, last_execution: '1 hour ago', assigned_process: 'Market-Analysis' },
  { bot_id: 'BOT-004', bot_name: 'Reconciliation-Bot', status: 'Offline', version: '2.4.1', runtime: '0h', success_rate: 0, last_execution: 'N/A', assigned_process: 'Month-End-Close' },
  { bot_id: 'BOT-005', bot_name: 'Payroll-Runner', status: 'Maintenance', version: '2.4.1', runtime: '340h', success_rate: 100, last_execution: 'Yesterday', assigned_process: 'Global-Payroll' },
  { bot_id: 'BOT-006', bot_name: 'SupportTriage-AI', status: 'Online', version: '3.0.0', runtime: '512h', success_rate: 94.1, last_execution: 'Just now', assigned_process: 'Customer-Service' },
  { bot_id: 'BOT-007', bot_name: 'InventorySync-2', status: 'Online', version: '2.4.1', runtime: '22h', success_rate: 99.1, last_execution: '10 mins ago', assigned_process: 'Supply-Chain' },
  { bot_id: 'BOT-008', bot_name: 'LegacySystem-Bridge', status: 'Error', version: '1.9.0', runtime: '4h', success_rate: 60.5, last_execution: '30 mins ago', assigned_process: 'Data-Migration' },
];

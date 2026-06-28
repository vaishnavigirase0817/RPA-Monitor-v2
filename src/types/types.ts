export interface KPIData {
  totalStreamedRows: number;
  activeRobots: number;
  globalSavings: number;
  roi: number; // Percentage
  completedProcesses: number;
  failedProcesses: number;
}

export type AutomationType = 'Attended' | 'Unattended' | 'Hybrid';
export type Department = 'Finance' | 'HR' | 'IT' | 'Operations' | 'Sales';
export type Industry = 'Banking' | 'Healthcare' | 'Retail' | 'Tech' | 'Logistics';

export interface StreamItem {
  id: string;
  robotName: string;
  processName: string;
  status: 'Running' | 'Completed' | 'Failed';
  rowsProcessed: number;
  timestamp: number;
  budget: number;
  roi: number;
  employeeHours: number;
  automationType: AutomationType;
  department: Department;
  industry: Industry;
  projectName: string;
  company: string;
  partner: string;
  country: string;
  isNew?: boolean; // For tracking newly flushed items in UI if needed
}

export type SortDirection = 'asc' | 'desc';
export interface SortCriteria {
  key: keyof StreamItem;
  direction: SortDirection;
}

export interface LayoutPreferences {
  showKPIs: boolean;
  showToolbar: boolean;
  showGrid: boolean;
  showAnalytics: boolean;
}

export type ConnectionStatus = 'Connected' | 'Connecting' | 'Reconnecting' | 'Disconnected';

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  read: boolean;
  pinned: boolean;
}

export interface StreamTelemetry {
  connectionStatus: ConnectionStatus;
  latencyMs: number;
  lastHeartbeat: number;
  droppedFrames: number;
  avgProcessingTimeMs: number;
  packetsPerSecond: number;
}

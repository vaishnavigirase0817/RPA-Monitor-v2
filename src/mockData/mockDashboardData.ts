export const mockDashboardData = {
  kpis: {
    totalBots: 1450,
    activeBots: 1205,
    failedBots: 12,
    completedTasks: 845020,
    revenueSaved: 12500400, // $12.5M
    systemHealth: 98.4,
  },
  recentActivity: [
    { id: '1', time: '10:45 AM', event: 'Finance Bot Cluster deployed successfully', type: 'success' },
    { id: '2', time: '10:42 AM', event: 'Node Alpha-4 CPU spiked to 98%', type: 'warning' },
    { id: '3', time: '10:30 AM', event: 'Daily report generation completed', type: 'info' },
    { id: '4', time: '10:15 AM', event: 'HR Onboarding Bot #42 failed', type: 'error' },
    { id: '5', time: '09:00 AM', event: 'System maintenance scheduled for weekend', type: 'info' },
  ],
  revenueTrend: [
    { month: 'Jan', revenue: 1.2 },
    { month: 'Feb', revenue: 1.4 },
    { month: 'Mar', revenue: 1.3 },
    { month: 'Apr', revenue: 1.7 },
    { month: 'May', revenue: 2.1 },
    { month: 'Jun', revenue: 2.4 },
  ]
};

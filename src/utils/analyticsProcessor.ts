import type { StreamItem } from '../types/types';

export interface AnalyticsSummary {
  totalRecords: number;
  activeProjects: number;
  failedProjects: number;
  completedProjects: number;
  averageRoi: number;
  totalSavings: number;
  totalRobots: number;
  averageEmployeeHoursSaved: number;
}

export interface AnalyticsAggregation {
  summary: AnalyticsSummary;
  statusDistribution: Record<string, number>;
  automationTypeAnalysis: Record<string, number>;
  financialOverview: { category: string; roi: number; savings: number; budget: number }[];
  departmentPerformance: Record<string, number>;
  robotDeployment: Record<string, number>;
}

export const processAnalytics = (data: StreamItem[]): AnalyticsAggregation => {
  const summary: AnalyticsSummary = {
    totalRecords: data.length,
    activeProjects: 0,
    failedProjects: 0,
    completedProjects: 0,
    averageRoi: 0,
    totalSavings: 0,
    totalRobots: 0, // Unique robots count
    averageEmployeeHoursSaved: 0,
  };

  const statusDistribution: Record<string, number> = {
    Completed: 0,
    Running: 0,
    Failed: 0,
    Pending: 0 // Optional per prompt
  };
  
  const automationTypeAnalysis: Record<string, number> = {};
  const departmentRoiSums: Record<string, { totalRoi: number, count: number }> = {};
  const robotCategories: Record<string, number> = {};
  const financialGroups: Record<string, { roi: number, savings: number, budget: number, count: number }> = {};
  
  const uniqueRobots = new Set<string>();
  let totalRoiSum = 0;
  let totalHours = 0;

  data.forEach(item => {
    // 1. Summary Metrics
    if (item.status === 'Running') summary.activeProjects++;
    else if (item.status === 'Failed') summary.failedProjects++;
    else if (item.status === 'Completed') summary.completedProjects++;

    totalRoiSum += item.roi;
    summary.totalSavings += (item.budget * 0.1); // Simulated savings calculation based on existing logic
    totalHours += item.employeeHours;
    uniqueRobots.add(item.robotName);

    // 2. Status Distribution
    statusDistribution[item.status] = (statusDistribution[item.status] || 0) + 1;

    // 3. Automation Type
    automationTypeAnalysis[item.automationType] = (automationTypeAnalysis[item.automationType] || 0) + 1;

    // 4. Department Performance (ROI)
    if (!departmentRoiSums[item.department]) departmentRoiSums[item.department] = { totalRoi: 0, count: 0 };
    departmentRoiSums[item.department].totalRoi += item.roi;
    departmentRoiSums[item.department].count++;

    // 5. Robot Deployment (Group by automation type or process prefix)
    const botPrefix = item.robotName.split('-')[0] || 'Unknown';
    robotCategories[botPrefix] = (robotCategories[botPrefix] || 0) + 1;

    // 6. Financial Overview (Group by industry for trend visualization, or department)
    if (!financialGroups[item.industry]) financialGroups[item.industry] = { roi: 0, savings: 0, budget: 0, count: 0 };
    financialGroups[item.industry].roi += item.roi;
    financialGroups[item.industry].savings += (item.budget * 0.1);
    financialGroups[item.industry].budget += item.budget;
    financialGroups[item.industry].count++;
  });

  if (data.length > 0) {
    summary.averageRoi = totalRoiSum / data.length;
    summary.averageEmployeeHoursSaved = totalHours / data.length;
  }
  summary.totalRobots = uniqueRobots.size;

  // Process Department Averages
  const departmentPerformance: Record<string, number> = {};
  Object.keys(departmentRoiSums).forEach(dept => {
    departmentPerformance[dept] = departmentRoiSums[dept].totalRoi / departmentRoiSums[dept].count;
  });

  // Process Financial Trend Averages
  const financialOverview = Object.keys(financialGroups).map(ind => ({
    category: ind,
    roi: financialGroups[ind].roi / financialGroups[ind].count,
    savings: financialGroups[ind].savings,
    budget: financialGroups[ind].budget
  })).sort((a, b) => b.savings - a.savings);

  return {
    summary,
    statusDistribution,
    automationTypeAnalysis,
    financialOverview,
    departmentPerformance,
    robotDeployment: robotCategories
  };
};

import { AccountWithUsage } from "./usage";

export interface DashboardMetrics {
  totalAccounts: number;
  gmailCompletedCount: number;
  githubCompletedCount: number;
  totalPossibleSlots: number; // totalAccounts * 24 (12 Gmail + 12 GitHub)
  totalCompletedSlots: number; // gmailCompletedCount + githubCompletedCount
  totalPendingSlots: number; // totalPossibleSlots - totalCompletedSlots
  overallCompletionPercentage: number;
  fullyCompletedAccounts: number;
}

export interface MonthlyUsageSummary {
  month: number;
  monthName: string;
  gmailCompleted: number;
  githubCompleted: number;
  completed: number;
  pending: number;
}

export interface AccountRanking {
  id: string;
  displayName: string;
  gmail: string;
  githubUsername: string;
  gmailCompleted: number; // 0-12
  githubCompleted: number; // 0-12
  totalCompleted: number; // 0-24
  completionPercentage: number;
  isFullyCompleted: boolean;
}

export interface DashboardData {
  year: number;
  metrics: DashboardMetrics;
  accountsWithUsage: AccountWithUsage[];
  monthlySummaries: MonthlyUsageSummary[];
  accountRankings: AccountRanking[];
}

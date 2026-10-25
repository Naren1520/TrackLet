import { AccountRepository } from "../accounts/account.repository";
import { UsageRepository } from "../usage/usage.repository";
import { UsageService } from "../usage/usage.service";
import { DashboardData, DashboardMetrics, MonthlyUsageSummary, AccountRanking } from "@/types/analytics";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export class AnalyticsService {
  static async getDashboardData(year: number): Promise<DashboardData> {
    const accounts = await AccountRepository.findAll();
    const usageRecords = await UsageRepository.findByYear(year);

    const accountsWithUsage = UsageService.mapAccountsWithUsage(accounts, usageRecords);

    const totalAccounts = accounts.length;
    const totalPossibleSlots = totalAccounts * 24; // 12 Gmail + 12 GitHub per account

    let gmailCompletedCount = 0;
    let githubCompletedCount = 0;
    let fullyCompletedAccounts = 0;

    for (const acc of accountsWithUsage) {
      gmailCompletedCount += acc.gmailCompletedMonths;
      githubCompletedCount += acc.githubCompletedMonths;
      if (acc.isFullyCompleted) {
        fullyCompletedAccounts++;
      }
    }

    const totalCompletedSlots = gmailCompletedCount + githubCompletedCount;
    const totalPendingSlots = totalPossibleSlots - totalCompletedSlots;
    const overallCompletionPercentage =
      totalPossibleSlots > 0
        ? Math.round((totalCompletedSlots / totalPossibleSlots) * 100)
        : 0;

    const metrics: DashboardMetrics = {
      totalAccounts,
      gmailCompletedCount,
      githubCompletedCount,
      totalPossibleSlots,
      totalCompletedSlots,
      totalPendingSlots,
      overallCompletionPercentage,
      fullyCompletedAccounts,
    };

    // Monthly summaries breaking down Gmail vs GitHub
    const monthlySummaries: MonthlyUsageSummary[] = MONTH_NAMES.map((name, index) => {
      const monthNum = index + 1;
      let monthGmail = 0;
      let monthGithub = 0;

      for (const acc of accountsWithUsage) {
        if (acc.usage[monthNum]?.gmailUsed) monthGmail++;
        if (acc.usage[monthNum]?.githubUsed) monthGithub++;
      }

      const completed = monthGmail + monthGithub;
      const totalPossibleForMonth = totalAccounts * 2;

      return {
        month: monthNum,
        monthName: name,
        gmailCompleted: monthGmail,
        githubCompleted: monthGithub,
        completed,
        pending: totalPossibleForMonth - completed,
      };
    });

    // Account rankings ordered by completion percentage descending
    const accountRankings: AccountRanking[] = accountsWithUsage
      .map((acc) => ({
        id: acc._id,
        displayName: acc.displayName || acc.gmail,
        gmail: acc.gmail,
        githubUsername: acc.githubUsername,
        gmailCompleted: acc.gmailCompletedMonths,
        githubCompleted: acc.githubCompletedMonths,
        totalCompleted: acc.totalCompletedSlots,
        completionPercentage: acc.completionPercentage,
        isFullyCompleted: acc.isFullyCompleted,
      }))
      .sort((a, b) => {
        if (b.completionPercentage !== a.completionPercentage) {
          return b.completionPercentage - a.completionPercentage;
        }
        return a.displayName.localeCompare(b.displayName);
      });

    return {
      year,
      metrics,
      accountsWithUsage,
      monthlySummaries,
      accountRankings,
    };
  }
}

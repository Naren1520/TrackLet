import { UsageRepository } from "./usage.repository";
import { AccountGroup } from "@/types/account";
import { AccountWithUsage, MonthlyUsageRecord, UsageChannel, MonthChannelUsage } from "@/types/usage";

export class UsageService {
  static async toggleUsage(
    accountId: string,
    year: number,
    month: number,
    channel: UsageChannel,
    used: boolean
  ): Promise<MonthlyUsageRecord> {
    return UsageRepository.upsertChannel(accountId, year, month, channel, used);
  }

  static async getUsageByYear(year: number): Promise<MonthlyUsageRecord[]> {
    return UsageRepository.findByYear(year);
  }

  static async getUsageByAccountAndYear(accountId: string, year: number): Promise<MonthlyUsageRecord[]> {
    return UsageRepository.findByAccountAndYear(accountId, year);
  }

  static mapAccountsWithUsage(
    accounts: AccountGroup[],
    usageRecords: MonthlyUsageRecord[]
  ): AccountWithUsage[] {
    // Map accountId -> (month -> { gmailUsed, githubUsed })
    const usageMap = new Map<string, Record<number, MonthChannelUsage>>();

    for (const record of usageRecords) {
      if (!usageMap.has(record.accountId)) {
        usageMap.set(record.accountId, {});
      }
      usageMap.get(record.accountId)![record.month] = {
        gmailUsed: Boolean(record.gmailUsed),
        githubUsed: Boolean(record.githubUsed),
      };
    }

    return accounts.map((acc) => {
      const accountUsage = usageMap.get(acc._id) || {};
      const fullUsage: Record<number, MonthChannelUsage> = {};
      let gmailCount = 0;
      let githubCount = 0;

      for (let m = 1; m <= 12; m++) {
        const monthData = accountUsage[m] || { gmailUsed: false, githubUsed: false };
        fullUsage[m] = monthData;
        if (monthData.gmailUsed) gmailCount++;
        if (monthData.githubUsed) githubCount++;
      }

      const totalCompletedSlots = gmailCount + githubCount;
      const totalPossibleSlots = 24; // 12 Gmail + 12 GitHub
      const percentage = Math.round((totalCompletedSlots / totalPossibleSlots) * 100);

      return {
        ...acc,
        usage: fullUsage,
        gmailCompletedMonths: gmailCount,
        githubCompletedMonths: githubCount,
        totalCompletedSlots,
        totalPossibleSlots,
        completionPercentage: percentage,
        isFullyCompleted: totalCompletedSlots === totalPossibleSlots,
      };
    });
  }
}

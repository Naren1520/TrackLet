import { AccountGroup } from "./account";

export type UsageChannel = "gmail" | "github";

export interface MonthChannelUsage {
  gmailUsed: boolean;
  githubUsed: boolean;
}

export interface MonthlyUsageRecord {
  _id: string;
  accountId: string;
  year: number;
  month: number; // 1-12
  gmailUsed: boolean;
  githubUsed: boolean;
  used?: boolean; // backwards compatibility: true if either gmail or github used
  updatedAt: string;
}

export interface ToggleUsageDTO {
  accountId: string;
  year: number;
  month: number;
  channel: UsageChannel; // "gmail" | "github"
  used: boolean;
}

export interface AccountWithUsage extends AccountGroup {
  usage: Record<number, MonthChannelUsage>; // month 1-12 -> { gmailUsed, githubUsed }
  gmailCompletedMonths: number; // 0-12
  githubCompletedMonths: number; // 0-12
  totalCompletedSlots: number; // out of 24 (12 gmail + 12 github)
  totalPossibleSlots: number; // 24
  completionPercentage: number;
  isFullyCompleted: boolean;
}

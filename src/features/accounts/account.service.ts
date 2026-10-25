import { AccountRepository } from "./account.repository";
import { CreateAccountDTO, UpdateAccountDTO, AccountGroup } from "@/types/account";

export class AccountService {
  static normalizeGmail(email: string): string {
    const trimmed = email.trim().toLowerCase();
    const [local, domain] = trimmed.split("@");
    if (!domain) return trimmed;
    // Standardize googlemail.com to gmail.com
    const normalizedDomain = domain === "googlemail.com" ? "gmail.com" : domain;
    return `${local}@${normalizedDomain}`;
  }

  static normalizeGithub(username: string): string {
    return username.trim().toLowerCase();
  }

  static async listAccounts(): Promise<AccountGroup[]> {
    return AccountRepository.findAll();
  }

  static async getAccount(id: string): Promise<AccountGroup | null> {
    return AccountRepository.findById(id);
  }

  static async createAccount(dto: CreateAccountDTO): Promise<AccountGroup> {
    const normGmail = this.normalizeGmail(dto.gmail);
    const normGithub = this.normalizeGithub(dto.githubUsername);

    const existing = await AccountRepository.findByNormalizedPair(normGmail, normGithub);
    if (existing) {
      throw new Error(`An account group with Gmail "${dto.gmail}" and GitHub "${dto.githubUsername}" already exists.`);
    }

    return AccountRepository.create(dto, normGmail, normGithub);
  }

  static async updateAccount(id: string, dto: UpdateAccountDTO): Promise<AccountGroup> {
    const current = await AccountRepository.findById(id);
    if (!current) {
      throw new Error("Account group not found");
    }

    const normGmail = dto.gmail ? this.normalizeGmail(dto.gmail) : current.normalizedGmail;
    const normGithub = dto.githubUsername ? this.normalizeGithub(dto.githubUsername) : current.normalizedGithubUsername;

    // Check conflict if identifiers changed
    if (normGmail !== current.normalizedGmail || normGithub !== current.normalizedGithubUsername) {
      const existing = await AccountRepository.findByNormalizedPair(normGmail, normGithub);
      if (existing && existing._id !== id) {
        throw new Error(`An account group with this Gmail and GitHub pair already exists.`);
      }
    }

    const updated = await AccountRepository.update(id, dto, normGmail, normGithub);
    if (!updated) {
      throw new Error("Account update failed");
    }
    return updated;
  }

  static async deleteAccount(id: string): Promise<boolean> {
    const exists = await AccountRepository.findById(id);
    if (!exists) {
      throw new Error("Account group not found");
    }
    return AccountRepository.delete(id);
  }
}

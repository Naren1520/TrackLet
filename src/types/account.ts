export interface AccountGroup {
  _id: string;
  gmail: string;
  normalizedGmail: string;
  githubUsername: string;
  normalizedGithubUsername: string;
  displayName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDTO {
  gmail: string;
  githubUsername: string;
  displayName?: string;
  notes?: string;
}

export interface UpdateAccountDTO {
  gmail?: string;
  githubUsername?: string;
  displayName?: string;
  notes?: string;
}

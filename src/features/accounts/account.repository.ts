import { ObjectId } from "mongodb";
import { getMongoDb, ensureDatabaseIndexes } from "@/lib/mongodb";
import { AccountGroup, CreateAccountDTO, UpdateAccountDTO } from "@/types/account";

export interface AccountDocument {
  _id: ObjectId;
  gmail: string;
  normalizedGmail: string;
  githubUsername: string;
  normalizedGithubUsername: string;
  displayName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

function mapDocumentToAccount(doc: AccountDocument): AccountGroup {
  return {
    _id: doc._id.toString(),
    gmail: doc.gmail,
    normalizedGmail: doc.normalizedGmail,
    githubUsername: doc.githubUsername,
    normalizedGithubUsername: doc.normalizedGithubUsername,
    displayName: doc.displayName,
    notes: doc.notes,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export class AccountRepository {
  static async getCollection() {
    const db = await getMongoDb();
    await ensureDatabaseIndexes(db);
    return db.collection<AccountDocument>("accounts");
  }

  static async findAll(): Promise<AccountGroup[]> {
    const col = await this.getCollection();
    const docs = await col.find().sort({ createdAt: -1 }).toArray();
    return docs.map(mapDocumentToAccount);
  }

  static async findById(id: string): Promise<AccountGroup | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.getCollection();
    const doc = await col.findOne({ _id: new ObjectId(id) });
    return doc ? mapDocumentToAccount(doc) : null;
  }

  static async findByNormalizedPair(
    normalizedGmail: string,
    normalizedGithubUsername: string
  ): Promise<AccountGroup | null> {
    const col = await this.getCollection();
    const doc = await col.findOne({
      normalizedGmail,
      normalizedGithubUsername,
    });
    return doc ? mapDocumentToAccount(doc) : null;
  }

  static async create(
    dto: CreateAccountDTO,
    normalizedGmail: string,
    normalizedGithubUsername: string
  ): Promise<AccountGroup> {
    const col = await this.getCollection();
    const now = new Date();

    const insertResult = await col.insertOne({
      _id: new ObjectId(),
      gmail: dto.gmail.trim(),
      normalizedGmail,
      githubUsername: dto.githubUsername.trim(),
      normalizedGithubUsername,
      displayName: dto.displayName?.trim() || undefined,
      notes: dto.notes?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });

    const created = await col.findOne({ _id: insertResult.insertedId });
    if (!created) {
      throw new Error("Failed to retrieve created account document");
    }

    return mapDocumentToAccount(created);
  }

  static async update(
    id: string,
    dto: UpdateAccountDTO,
    normalizedGmail?: string,
    normalizedGithubUsername?: string
  ): Promise<AccountGroup | null> {
    if (!ObjectId.isValid(id)) return null;
    const col = await this.getCollection();

    const updateFields: Partial<AccountDocument> = {
      updatedAt: new Date(),
    };

    if (dto.gmail !== undefined) {
      updateFields.gmail = dto.gmail.trim();
      if (normalizedGmail) updateFields.normalizedGmail = normalizedGmail;
    }
    if (dto.githubUsername !== undefined) {
      updateFields.githubUsername = dto.githubUsername.trim();
      if (normalizedGithubUsername) updateFields.normalizedGithubUsername = normalizedGithubUsername;
    }
    if (dto.displayName !== undefined) {
      updateFields.displayName = dto.displayName.trim() || undefined;
    }
    if (dto.notes !== undefined) {
      updateFields.notes = dto.notes.trim() || undefined;
    }

    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    return result ? mapDocumentToAccount(result) : null;
  }

  static async delete(id: string): Promise<boolean> {
    if (!ObjectId.isValid(id)) return false;
    const db = await getMongoDb();
    const col = db.collection<AccountDocument>("accounts");

    const deleteResult = await col.deleteOne({ _id: new ObjectId(id) });
    if (deleteResult.deletedCount === 0) {
      return false;
    }

    // Cascade delete all monthly usage records associated with this account
    const usageCol = db.collection("monthly_usage");
    await usageCol.deleteMany({ accountId: id });

    return true;
  }
}

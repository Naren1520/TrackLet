import { ObjectId } from "mongodb";
import { getMongoDb, ensureDatabaseIndexes } from "@/lib/mongodb";
import { MonthlyUsageRecord, UsageChannel } from "@/types/usage";

export interface MonthlyUsageDocument {
  _id: ObjectId;
  accountId: string;
  year: number;
  month: number;
  gmailUsed?: boolean;
  githubUsed?: boolean;
  used?: boolean;
  updatedAt: Date;
}

function mapDocumentToRecord(doc: MonthlyUsageDocument): MonthlyUsageRecord {
  // Support both new channel fields and legacy 'used' field
  const gmailUsed = doc.gmailUsed !== undefined ? doc.gmailUsed : Boolean(doc.used);
  const githubUsed = doc.githubUsed !== undefined ? doc.githubUsed : false;

  return {
    _id: doc._id.toString(),
    accountId: doc.accountId,
    year: doc.year,
    month: doc.month,
    gmailUsed,
    githubUsed,
    used: gmailUsed || githubUsed,
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export class UsageRepository {
  static async getCollection() {
    const db = await getMongoDb();
    await ensureDatabaseIndexes(db);
    return db.collection<MonthlyUsageDocument>("monthly_usage");
  }

  static async upsertChannel(
    accountId: string,
    year: number,
    month: number,
    channel: UsageChannel,
    used: boolean
  ): Promise<MonthlyUsageRecord> {
    const col = await this.getCollection();
    const now = new Date();

    const fieldToSet = channel === "gmail" ? { gmailUsed: used } : { githubUsed: used };

    const result = await col.findOneAndUpdate(
      { accountId, year, month },
      {
        $set: {
          ...fieldToSet,
          updatedAt: now,
        },
        $setOnInsert: {
          _id: new ObjectId(),
          ...(channel === "gmail" ? { githubUsed: false } : { gmailUsed: false }),
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    if (!result) {
      throw new Error("Failed to persist monthly usage record");
    }

    return mapDocumentToRecord(result);
  }

  static async findByYear(year: number): Promise<MonthlyUsageRecord[]> {
    const col = await this.getCollection();
    const docs = await col.find({ year }).toArray();
    return docs.map(mapDocumentToRecord);
  }

  static async findByAccountAndYear(accountId: string, year: number): Promise<MonthlyUsageRecord[]> {
    const col = await this.getCollection();
    const docs = await col.find({ accountId, year }).toArray();
    return docs.map(mapDocumentToRecord);
  }

  static async deleteByAccountId(accountId: string): Promise<number> {
    const col = await this.getCollection();
    const res = await col.deleteMany({ accountId });
    return res.deletedCount;
  }
}

import { MongoClient, Db } from "mongodb";
import { getEnv } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;
let cachedUri: string | undefined;

export async function getMongoClient(): Promise<MongoClient> {
  const env = getEnv();
  const uri = env.MONGODB_URI;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise || cachedUri !== uri) {
      cachedUri = uri;
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    if (!clientPromise || cachedUri !== uri) {
      cachedUri = uri;
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      clientPromise = client.connect();
    }
  }

  return clientPromise;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();
  const env = getEnv();
  return client.db(env.MONGODB_DB_NAME);
}

let indexesInitialized = false;

export async function ensureDatabaseIndexes(db: Db): Promise<void> {
  if (indexesInitialized) return;

  try {
    const accountsCol = db.collection("accounts");
    // Unique compound index on normalized identifiers to prevent duplicate Gmail/GitHub pairs
    await accountsCol.createIndex(
      { normalizedGmail: 1, normalizedGithubUsername: 1 },
      { unique: true, name: "idx_unique_gmail_github" }
    );
    await accountsCol.createIndex({ createdAt: -1 }, { name: "idx_created_at" });

    const usageCol = db.collection("monthly_usage");
    // Unique compound index on accountId, year, and month
    await usageCol.createIndex(
      { accountId: 1, year: 1, month: 1 },
      { unique: true, name: "idx_unique_account_year_month" }
    );
    await usageCol.createIndex(
      { year: 1, used: 1 },
      { name: "idx_year_used" }
    );

    indexesInitialized = true;
  } catch (error) {
    console.error("[TrackLet] Error ensuring database indexes:", error);
  }
}

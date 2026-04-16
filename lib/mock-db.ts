import { promises as fs } from "node:fs";
import path from "node:path";

export type AnalysisRecord = {
  id: string;
  userId: string;
  summary: string;
  deepInsight: string;
  meters: {
    career: number;
    wealth: number;
    love: number;
  };
  createdAt: string;
};

export type PurchaseRecord = {
  id: string;
  userId: string;
  featureType: "deep-insight" | "premium-monthly" | "credit-pack";
  targetId?: string;
  amountTHB: number;
  createdAt: string;
};

export type SubscriptionRecord = {
  userId: string;
  planType: "premium";
  status: "active" | "expired";
  expiryDate: string;
};

export type UserRecord = {
  id: string;
  name: string;
  credits: number;
};

export type DataRequestRecord = {
  id: string;
  requestType: "access" | "delete" | "rectify" | "withdraw-consent";
  fullName: string;
  email: string;
  details: string;
  status: "received" | "in_review" | "completed" | "rejected";
  createdAt: string;
};

type MockDb = {
  users: UserRecord[];
  analyses: AnalysisRecord[];
  purchases: PurchaseRecord[];
  subscriptions: SubscriptionRecord[];
  dataRequests: DataRequestRecord[];
};

const DB_PATH = path.join(process.cwd(), "data", "mock-db.json");

const EMPTY_DB: MockDb = {
  users: [{ id: "demo-user", name: "Demo User", credits: 120 }],
  analyses: [],
  purchases: [],
  subscriptions: [],
  dataRequests: [],
};

async function ensureDbFile() {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(EMPTY_DB, null, 2), "utf8");
  }
}

export async function readDb(): Promise<MockDb> {
  await ensureDbFile();
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw) as MockDb;
}

export async function writeDb(db: MockDb): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

export async function updateDb(updater: (db: MockDb) => MockDb | Promise<MockDb>) {
  const current = await readDb();
  const next = await updater(current);
  await writeDb(next);
  return next;
}

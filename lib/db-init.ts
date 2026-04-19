import { execSync } from "child_process";

let migrationRun = false;

export async function ensureDatabaseSetup() {
  if (migrationRun) return;
  if (process.env.SKIP_DB_SETUP === "true") return;
  
  try {
    migrationRun = true;
    console.log("[DB] Running Prisma db push to ensure schema exists...");
    
    // Only run if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.log("[DB] DATABASE_URL not set, skipping setup");
      return;
    }
    
    execSync("npx prisma db push --skip-generate --accept-data-loss", {
      stdio: "inherit",
      env: { ...process.env },
    });
    
    console.log("[DB] ✓ Database schema synced");
  } catch (err) {
    console.error("[DB] Failed to sync database:", err instanceof Error ? err.message : String(err));
    // Don't fail startup - migrations might already exist
  }
}

import { execSync } from "child_process";

let dbSyncDone = false;

export async function register() {
  // This runs when the server starts
  if (process.env.NEXT_RUNTIME === "nodejs" && !dbSyncDone) {
    try {
      const dbUrl = process.env.DATABASE_URL;
      
      if (dbUrl && (dbUrl.includes("postgres") || dbUrl.includes("supabase"))) {
        console.log("[Instrumentation] Running database schema sync on server startup...");
        dbSyncDone = true;
        
        try {
          execSync("npx prisma db push --skip-generate --accept-data-loss", {
            stdio: "pipe",
            env: { ...process.env },
            timeout: 60000,
          });
          console.log("[Instrumentation] ✓ Database schema synced on startup");
        } catch (err) {
          // Don't fail startup, just log
          console.warn("[Instrumentation] Database sync warning (may already be synced):", 
            err instanceof Error ? err.message : String(err)
          );
        }
      }
    } catch (err) {
      console.warn("[Instrumentation] Database sync skipped:", 
        err instanceof Error ? err.message : String(err)
      );
    }
  }
}

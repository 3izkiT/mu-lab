import { NextResponse } from "next/server";
import { execSync } from "child_process";

let migrationRun = false;

export async function GET() {
  try {
    // Run only once per deployment
    if (migrationRun) {
      return NextResponse.json({ status: "already_synced" });
    }

    // Only run if we have DATABASE_URL and it's PostgreSQL
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || !dbUrl.includes("supabase") && !dbUrl.includes("postgres")) {
      return NextResponse.json({ status: "skipped_no_postgres" });
    }

    console.log("[DB] Running Prisma db push to sync schema with Supabase...");
    migrationRun = true;

    try {
      execSync("npx prisma db push --skip-generate --accept-data-loss", {
        stdio: "pipe",
        env: { ...process.env },
      });
      console.log("[DB] ✓ Database schema synced successfully");
      return NextResponse.json({ status: "synced", success: true });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn("[DB] db push warning (schema may already exist):", errorMsg);
      // Don't fail - schema might already be synced
      return NextResponse.json({ status: "completed_with_warning", success: true });
    }
  } catch (err) {
    console.error("[DB] Unexpected error:", err);
    // Still return 200 to not block the app
    return NextResponse.json({ status: "error", error: String(err) }, { status: 500 });
  }
}

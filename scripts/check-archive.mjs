/**
 * ตรวจว่าตาราง DailyHoroscopeArchive มีแถวหรือไม่ (รัน: node scripts/check-archive.mjs)
 */
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dbPath = path.join(root, "prisma", "dev.db");

const db = new Database(dbPath, { readonly: true });
try {
  const rows = db
    .prepare(
      "SELECT dateKey, source, length(sectionsJson) AS secLen FROM DailyHoroscopeArchive ORDER BY dateKey DESC LIMIT 8",
    )
    .all();
  console.log(JSON.stringify({ dbPath, count: rows.length, rows }, null, 2));
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  db.close();
}

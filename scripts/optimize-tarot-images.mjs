/**
 * Optimize tarot card images: resize 480w + convert to webp
 * Reduces ~12MB to ~2MB total — keeps crisp at retina mobile sizes.
 */
import sharp from "sharp";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";

const DIR = path.resolve("public/tarot");

async function main() {
  const files = await readdir(DIR);
  const jpgs = files.filter((f) => f.endsWith(".jpg"));
  let totalIn = 0;
  let totalOut = 0;
  for (const f of jpgs) {
    const full = path.join(DIR, f);
    const stats = await stat(full);
    totalIn += stats.size;
    const out = full.replace(/\.jpg$/, ".webp");
    const meta = await sharp(full).metadata();
    await sharp(full)
      .resize({ width: Math.min(meta.width ?? 480, 480), withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    const outStats = await stat(out);
    totalOut += outStats.size;
    await unlink(full);
    console.log(`${f} -> ${path.basename(out)}: ${stats.size} -> ${outStats.size}`);
  }
  console.log(`Total: ${totalIn} -> ${totalOut} bytes (${((totalOut * 100) / totalIn).toFixed(1)}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

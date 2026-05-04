/**
 * One-off script: ดาวน์โหลดภาพไพ่ Rider-Waite-Smith (Major Arcana) จาก Wikimedia Commons
 * รันครั้งเดียวเพื่อ bake images เข้า public/tarot/
 *
 *   node scripts/download-tarot-images.mjs
 *
 * ลิขสิทธิ์: ภาพต้นฉบับโดย Pamela Colman Smith (1909) → public domain ทั่วโลกแล้ว
 */
import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const CARDS = [
  { slug: "fool", nn: "00", file: "RWS_Tarot_00_Fool.jpg" },
  { slug: "magician", nn: "01", file: "RWS_Tarot_01_Magician.jpg" },
  { slug: "high-priestess", nn: "02", file: "RWS_Tarot_02_High_Priestess.jpg" },
  { slug: "empress", nn: "03", file: "RWS_Tarot_03_Empress.jpg" },
  { slug: "emperor", nn: "04", file: "RWS_Tarot_04_Emperor.jpg" },
  { slug: "hierophant", nn: "05", file: "RWS_Tarot_05_Hierophant.jpg" },
  { slug: "lovers", nn: "06", file: "RWS_Tarot_06_Lovers.jpg" },
  { slug: "chariot", nn: "07", file: "RWS_Tarot_07_Chariot.jpg" },
  { slug: "strength", nn: "08", file: "RWS_Tarot_08_Strength.jpg" },
  { slug: "hermit", nn: "09", file: "RWS_Tarot_09_Hermit.jpg" },
  { slug: "wheel-of-fortune", nn: "10", file: "RWS_Tarot_10_Wheel_of_Fortune.jpg" },
  { slug: "justice", nn: "11", file: "RWS_Tarot_11_Justice.jpg" },
  { slug: "hanged-man", nn: "12", file: "RWS_Tarot_12_Hanged_Man.jpg" },
  { slug: "death", nn: "13", file: "RWS_Tarot_13_Death.jpg" },
  { slug: "temperance", nn: "14", file: "RWS_Tarot_14_Temperance.jpg" },
  { slug: "devil", nn: "15", file: "RWS_Tarot_15_Devil.jpg" },
  { slug: "tower", nn: "16", file: "RWS_Tarot_16_Tower.jpg" },
  { slug: "star", nn: "17", file: "RWS_Tarot_17_Star.jpg" },
  { slug: "moon", nn: "18", file: "RWS_Tarot_18_Moon.jpg" },
  { slug: "sun", nn: "19", file: "RWS_Tarot_19_Sun.jpg" },
  { slug: "judgement", nn: "20", file: "RWS_Tarot_20_Judgement.jpg" },
  { slug: "world", nn: "21", file: "RWS_Tarot_21_World.jpg" },
];

const OUT = path.resolve("public/tarot");

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithRedirect(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mu-Lab/1.0 (https://mu-lab.app; tarot card import)",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const card of CARDS) {
    const dest = path.join(OUT, `${card.slug}.jpg`);
    if (await exists(dest)) {
      console.log(`skip ${card.slug} (exists)`);
      continue;
    }
    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${card.file}?width=600`;
    console.log(`download ${card.slug} <- ${url}`);
    const bytes = await fetchWithRedirect(url);
    await writeFile(dest, bytes);
    console.log(`  saved ${dest} (${bytes.length} bytes)`);
  }
  console.log("done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

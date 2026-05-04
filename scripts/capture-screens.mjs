import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.BASE_URL || "https://mu-lab.vercel.app";
const OUT = path.resolve("artifacts/screens");

async function shoot(page, url, file, opts = {}) {
  const target = path.join(OUT, file);
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  // Wait for page to settle
  await page.waitForTimeout(2000);
  await page.screenshot({ path: target, fullPage: opts.fullPage ?? true });
  console.log(`captured ${file}`);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: "th-TH",
  });
  const page = await context.newPage();

  // 1. Public pages
  await shoot(page, `${BASE}/`, "home.png");
  await shoot(page, `${BASE}/daily-horoscope`, "daily-horoscope.png");
  await shoot(page, `${BASE}/login`, "login.png");
  await shoot(page, `${BASE}/tarot`, "tarot-guest.png");

  // 2. Sign up + capture authenticated pages
  const ts = Date.now();
  const email = `qa+${ts}@mulab.test`;
  const password = "MulabTest!234";

  const reg = await context.request.post(`${BASE}/api/auth/email/register`, {
    data: { email, password, name: "QA Screens", nextPath: "/vault" },
  });
  console.log("register status:", reg.status());

  // Save analysis with full birth info to test analysis page
  const analysis = await context.request.post(`${BASE}/api/analysis/save`, {
    data: {
      message:
        "## ลักษณะนิสัย\nลักขณาราศีเมษ — ผู้นำพลังสูง ตัดสินใจเด็ดขาด\n\n## ดวงชะตาในช่วงนี้\nจังหวะการงานเด่น เหมาะปิดงานเก่าแล้วเริ่มใหม่\n\n## แผนปฏิบัติ\n1) จัดลำดับงานสำคัญ\n2) สื่อสารตรง\n3) วางแผนการเงิน 30 วัน",
      meters: { career: 82, wealth: 71, love: 64 },
      fullName: "จักริน ยี่สุ่น",
      birthDate: "17/09/1986",
      birthHour: "22",
      birthMinute: "42",
      birthProvince: "นครศรีฯ",
    },
  });
  const analysisJson = await analysis.json();
  console.log("analysis id:", analysisJson.id);

  await shoot(page, `${BASE}/vault`, "vault.png");
  await shoot(page, `${BASE}/tarot`, "tarot-member.png");
  await shoot(page, `${BASE}/analysis/${analysisJson.id}`, "analysis.png");

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

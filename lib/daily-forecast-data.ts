import { unstable_cache } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { readGeminiApiKey, readGeminiChatModel } from "@/lib/gemini-env";
import { extractGeminiResponseText } from "@/lib/gemini-response-text";

export type DailyForecastPayload = {
  dateKey: string;
  scores: { work: number; love: number; health: number };
  /** สรุปภาพรวมพลังงานวันนี้ (เช่น พลังงานการสื่อสารแรง) */
  weatherTag: string;
  /** บันทึกห้องแล็บ ไม่เกิน 200 ตัวอักษร */
  labNote: string;
  luckyItem: string;
  luckyColor: string;
  /** ภารกิจมงคล / นาทีทอง / กิจกรรมเล็ก */
  ritualOfTheDay: string;
  source: "gemini" | "fallback";
};

export function getBangkokDateKey(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
}

function clampScore(n: unknown): number {
  const x = typeof n === "number" ? n : Number(n);
  if (Number.isNaN(x)) return 75;
  return Math.min(100, Math.max(0, Math.round(x)));
}

function truncateNote(s: string, max = 200): string {
  const t = s.trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function extractJsonObject(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const block = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const payload = block ? block[1].trim() : trimmed;
  const start = payload.indexOf("{");
  const end = payload.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object");
  return JSON.parse(payload.slice(start, end + 1)) as Record<string, unknown>;
}

const DAILY_SYSTEM = `คุณคือ Mu-Lab Algorithm บรรณาธิการพยากรณ์ดาราศาสตร์ไทยรายวัน

กฎ: ห้ามพูดถึง Google, Gemini, AI, LLM หรือโมเดลใด ๆ ห้าม disclaimer

ตอบเป็นภาษาไทยเท่านั้น และตอบเป็น JSON เท่านั้น (ไม่มี markdown นอก JSON)

โครงสร้าง JSON (คีย์ภาษาอังกฤษ ค่าภาษาไทยยกเว้นตัวเลข):
{
  "scores": { "work": 0-100, "love": 0-100, "health": 0-100 },
  "weatherTag": "วลีสั้น 1 บรรทัด อธิบายอุณหภูมิพลังงานวันนี้",
  "labNote": "สรุปปรากฏการณ์ดาว/บรรยากาศวันนี้ ไม่เกิน 200 ตัวอักษร",
  "luckyItem": "ของมงคลหรือไอเทมแนะนำวันนี้",
  "luckyColor": "สีมงคลวันนี้ (ระบุชื่อสีเป็นภาษาไทย)",
  "ritualOfTheDay": "ภารกิจมงคลเล็ก ๆ หรือช่วงเวลาที่เหมาะ (เช่น นาทีทองการเจรจา) 1-2 ประโยค"
}`;

async function generateDailyFromGemini(dateKey: string): Promise<DailyForecastPayload> {
  const apiKey = readGeminiApiKey();
  if (!apiKey) throw new Error("no key");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: readGeminiChatModel(),
    systemInstruction: DAILY_SYSTEM,
  });

  const userPrompt = `สร้างรายงานพลังงานจักรวาลประจำวันที่ ${dateKey} (เขตเวลา กรุงเทพฯ)

อ้างอิงบริบทโหราไทยร่วมสมัย ให้คะแนน work/love/health สอดคล้องกับวันนั้นจริง ๆ

ตอบเป็น JSON ตามที่กำหนดเท่านั้น`;

  const result = await model.generateContent(userPrompt);
  const text = extractGeminiResponseText(result.response);
  if (!text?.trim()) throw new Error("empty");

  const raw = extractJsonObject(text);
  const scores = raw.scores as Record<string, unknown> | undefined;
  const payload: DailyForecastPayload = {
    dateKey,
    scores: {
      work: clampScore(scores?.work),
      love: clampScore(scores?.love),
      health: clampScore(scores?.health),
    },
    weatherTag: String(raw.weatherTag ?? "พลังงานกลาง ๆ พอดี").slice(0, 120),
    labNote: truncateNote(String(raw.labNote ?? "")),
    luckyItem: String(raw.luckyItem ?? "ของใช้สีโลหะเงา").slice(0, 80),
    luckyColor: String(raw.luckyColor ?? "สีเงิน").slice(0, 40),
    ritualOfTheDay: String(raw.ritualOfTheDay ?? "").slice(0, 220),
    source: "gemini",
  };

  if (!payload.labNote) {
    payload.labNote = "วันนี้บรรยากาศดาราศาสตร์ค่อนข้างสมดุล เหมาะกับการวางแผนและพักผ่อนสลับกัน";
  }

  return payload;
}

function getFallbackForecast(dateKey: string): DailyForecastPayload {
  return {
    dateKey,
    scores: { work: 78, love: 74, health: 82 },
    weatherTag: "พลังงานกลาง ๆ — เหมาะกับการรักษาสมดุล",
    labNote:
      "วันนี้ห้องแล็บ Mu-Lab สรุปว่าบรรยากาศบนท้องฟ้าเงียบสงบ เหมาะกับการวางแผนและดูแลสุขภาพจิตเป็นหลัก ข้อมูลเต็มจะพร้อมเมื่อเชื่อมต่อระบบพยากรณ์",
    luckyItem: "เครื่องประดับโลหะเงาเล็ก ๆ",
    luckyColor: "สีเงินอมเทา",
    ritualOfTheDay: "ช่วงเช้าตรู่ 10–15 นาทีแรกหลังตื่น ใช้จิตนิ่งกำหนดเป้าหมายวันนี้",
    source: "fallback",
  };
}

async function fetchDailyForecastForDate(dateKey: string): Promise<DailyForecastPayload> {
  console.log(`API Status: ${Boolean(readGeminiApiKey())}`);
  console.log(`Fetching Daily Forecast... (${dateKey})`);
  try {
    return await generateDailyFromGemini(dateKey);
  } catch {
    return getFallbackForecast(dateKey);
  }
}

/**
 * แคชตามวันที่ (กรุงเทพฯ) — ทุกคนในวันเดียวกันได้ชุดข้อมูลเดียวกัน ไม่เรียก Gemini ซ้ำทุก request
 */
export async function getDailyForecast(): Promise<DailyForecastPayload> {
  const dateKey = getBangkokDateKey();
  return unstable_cache(
    async () => fetchDailyForecastForDate(dateKey),
    ["daily-forecast", dateKey],
    { revalidate: 86400, tags: [`daily-forecast-${dateKey}`] },
  )();
}

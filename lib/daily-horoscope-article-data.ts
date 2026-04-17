import { unstable_cache } from "next/cache";
import { cache } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DailyForecastPayload } from "@/lib/daily-forecast-data";
import { getDailyForecast } from "@/lib/daily-forecast-data";
import { readGeminiApiKey, readGeminiChatModel } from "@/lib/gemini-env";
import { extractGeminiResponseText } from "@/lib/gemini-response-text";
import { saveDailyHoroscopeArchive } from "@/lib/daily-horoscope-archive";

/** พุธแยกกลางวัน/กลางคืนตามธรรมเนียมโหราไทย */
export type BirthWeekdayId = "mon" | "tue" | "wed_day" | "wed_night" | "thu" | "fri" | "sat" | "sun";

export type DailyHoroscopeSection = {
  id: BirthWeekdayId;
  titleTh: string;
  body: string;
};

export type DailyHoroscopeArticle = {
  dateKey: string;
  /** หัวข้อบทความ (ไม่รวมแบรนด์) */
  headlineTh: string;
  intro: string;
  sections: DailyHoroscopeSection[];
  forecast: DailyForecastPayload;
  source: "gemini" | "fallback";
};

/** ลำดับแสดงผล / ตรวจสอบ JSON คลัง */
export const BIRTH_WEEKDAY_ORDER: BirthWeekdayId[] = [
  "mon",
  "tue",
  "wed_day",
  "wed_night",
  "thu",
  "fri",
  "sat",
  "sun",
];

const WEEKDAYS: Array<{ id: BirthWeekdayId; titleTh: string }> = [
  { id: "mon", titleTh: "คนเกิดวันจันทร์" },
  { id: "tue", titleTh: "คนเกิดวันอังคาร" },
  { id: "wed_day", titleTh: "คนเกิดวันพุธกลางวัน" },
  { id: "wed_night", titleTh: "คนเกิดวันพุธกลางคืน" },
  { id: "thu", titleTh: "คนเกิดวันพฤหัสบดี" },
  { id: "fri", titleTh: "คนเกิดวันศุกร์" },
  { id: "sat", titleTh: "คนเกิดวันเสาร์" },
  { id: "sun", titleTh: "คนเกิดวันอาทิตย์" },
];

const HOROSCOPE_SYSTEM = `คุณคือ Mu-Lab Algorithm บรรณาธิการพยากรณ์ดาราศาสตร์ไทยรายวัน

กฎ: ห้ามพูดถึง Google, Gemini, AI, LLM หรือโมเดลใด ๆ ห้าม disclaimer

ตอบเป็นภาษาไทยเท่านั้น และตอบเป็น JSON เท่านั้น (ไม่มี markdown นอก JSON)

โครงสร้าง JSON (ต้องมีคีย์ครบทุกตัวด้านล่าง รวม wed_day และ wed_night แยกกัน):
{
  "headlineTh": "หัวข้อบทความสั้น ๆ ไม่เกิน 80 ตัวอักษร",
  "intro": "ย่อหน้าเปิด 120–220 ตัวอักษร สรุปบรรยากาศวันนี้และเชิญอ่านต่อ",
  "mon": "ย่อหน้า 90–180 ตัวอักษร สำหรับคนเกิดวันจันทร์",
  "tue": "… วันอังคาร",
  "wed_day": "… พุธกลางวัน (เกิดช่วงกลางวันของวันพุธตามธรรมเนียมโหราไทย)",
  "wed_night": "… พุธกลางคืน (เกิดช่วงกลางคืนของวันพุธ — ต้องต่างจาก wed_day อย่างชัดเจน)",
  "thu": "… พฤหัสบดี",
  "fri": "… ศุกร์",
  "sat": "… เสาร์",
  "sun": "… อาทิตย์"
}`;

function extractJsonObject(text: string): Record<string, unknown> {
  const trimmed = text.trim();
  const block = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const payload = block ? block[1].trim() : trimmed;
  const start = payload.indexOf("{");
  const end = payload.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object");
  return JSON.parse(payload.slice(start, end + 1)) as Record<string, unknown>;
}

function clampParagraph(s: unknown, min: number, max: number): string {
  let t = typeof s === "string" ? s.trim() : "";
  if (!t) return "";
  if (t.length > max) t = `${t.slice(0, max - 1)}…`;
  if (t.length < min && t.length > 0) return t;
  return t;
}

function hash32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickVariant(seed: number, variants: string[]): string {
  return variants[seed % variants.length] ?? variants[0] ?? "";
}

function fallbackArticle(dateKey: string, forecast: DailyForecastPayload): DailyHoroscopeArticle {
  const { scores, weatherTag, labNote, luckyColor, luckyItem, ritualOfTheDay } = forecast;
  const headlineTh = `พลังงานวันนี้กับคนเกิดแต่ละวัน (${dateKey})`;
  const intro =
    `วันนี้ห้องแล็บสรุปภาพรวมว่า “${weatherTag}” คะแนนพลังงานโดยประมาณ — งาน ${scores.work} ความรัก ${scores.love} สุขภาพ ${scores.health} ` +
    `${labNote} ด้านล่างนี้คือมุมมองเชิงสัญลักษณ์สำหรับคนเกิดในแต่ละวัน รวมทั้งพุธกลางวันและพุธกลางคืน (อ่านฟรี) หากต้องการลงลึกถึงชั่วโมงเกิดและจังหวัด ให้ไปที่แบบฟอร์มวิเคราะห์ส่วนตัวของ Mu-Lab`;

  const sections: DailyHoroscopeSection[] = WEEKDAYS.map(({ id, titleTh }) => {
    const h = hash32(`${dateKey}:${id}`);
    const tone = pickVariant(h, ["เน้นรักษาสมดุล", "เน้นการสื่อสาร", "เน้นการเงินและทรัพยากร", "เน้นความสัมพันธ์", "เน้นสุขภาพจิต"]);
    const pace = pickVariant(h >> 3, ["เดินช้าแต่ชัวร์", "เร่งจังหวะได้ในช่วงสั้น ๆ", "เหมาะกับการสำรวจทางเลือก"]);
    const wedHint =
      id === "wed_day"
        ? " มุมพุธกลางวันเน้นพลังแนวกลางแจ้ง การสื่อสาร และการลงมือกลางวัน."
        : id === "wed_night"
          ? " มุมพุธกลางคืนเน้นพลังแนวลึก การไตร่ตรอง และความสัมพันธ์ภายใน."
          : "";
    const body =
      `สำหรับ${titleTh.replace("คนเกิด", "ผู้ที่เกิด")} วันนี้แนวโน้มภาพรวมสอดคล้องกับบรรยากาศ “${weatherTag}” โดยเน้น${tone} ` +
      `จังหวะการลงมือแนะนำให้${pace} ของมงคลวันนี้ของระบบคือ ${luckyItem} และสีที่สนับสนุนพลังคือ ${luckyColor} ` +
      `ภารกิจมงคลเล็ก ๆ: ${ritualOfTheDay}` +
      wedHint;

    return { id, titleTh, body };
  });

  return {
    dateKey,
    headlineTh,
    intro,
    sections,
    forecast,
    source: "fallback",
  };
}

async function generateFromGemini(dateKey: string, forecast: DailyForecastPayload): Promise<DailyHoroscopeArticle> {
  const apiKey = readGeminiApiKey();
  if (!apiKey) throw new Error("no key");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: readGeminiChatModel(),
    systemInstruction: HOROSCOPE_SYSTEM,
  });

  const userPrompt = `เขียนบทความ “ดูดวงรายวัน” แบบหนึ่งบทความยาวสำหรับวันที่ ${dateKey} (เขตเวลา กรุงเทพฯ)

ข้อมูลอ้างอิงจากห้องแล็บวันนี้:
- weatherTag: ${forecast.weatherTag}
- labNote: ${forecast.labNote}
- scores.work: ${forecast.scores.work}, scores.love: ${forecast.scores.love}, scores.health: ${forecast.scores.health}
- luckyItem: ${forecast.luckyItem}
- luckyColor: ${forecast.luckyColor}
- ritualOfTheDay: ${forecast.ritualOfTheDay}

ให้ intro และแต่ละวันเกิดสอดคล้องกับข้อมูลนี้ แต่ไม่ต้องคัดลอกตัวเลขคะแนนไปทุกย่อหน้า

แยกวันพุธเป็น wed_day (พุธกลางวัน) กับ wed_night (พุธกลางคืน) ตามธรรมเนียมโหราไทย — สองย่อหน้านี้ต้องไม่ซ้ำเนื้อหากัน

ตอบเป็น JSON ตามที่กำหนดเท่านั้น`;

  const result = await model.generateContent(userPrompt);
  const text = extractGeminiResponseText(result.response);
  if (!text?.trim()) throw new Error("empty");

  const raw = extractJsonObject(text);
  const headlineTh = clampParagraph(raw.headlineTh, 10, 90) || `ดวงรายวัน Mu-Lab · ${dateKey}`;
  const intro = clampParagraph(raw.intro, 80, 260) || "";

  const sections: DailyHoroscopeSection[] = WEEKDAYS.map(({ id, titleTh }) => {
    const body = clampParagraph(raw[id], 60, 260);
    return { id, titleTh, body };
  });

  if (!intro || sections.some((s) => !s.body)) {
    throw new Error("incomplete");
  }

  return {
    dateKey,
    headlineTh,
    intro,
    sections,
    forecast,
    source: "gemini",
  };
}

async function fetchArticleForDate(dateKey: string, forecast: DailyForecastPayload): Promise<DailyHoroscopeArticle> {
  try {
    return await generateFromGemini(dateKey, forecast);
  } catch {
    return fallbackArticle(dateKey, forecast);
  }
}

/**
 * บทความดวงรายวัน (ฟรี) แคชตามวันที่กรุงเทพฯ — แยก tag จาก daily-forecast เพื่อให้ cron revalidate ได้ทั้งคู่
 * ใช้ React cache() เพื่อไม่ดึงซ้ำในรอบเดียวกัน (metadata + page)
 */
export const getDailyHoroscopeArticle = cache(async (): Promise<DailyHoroscopeArticle> => {
  const forecast = await getDailyForecast();
  const dateKey = forecast.dateKey;
  const article = await unstable_cache(
    async () => fetchArticleForDate(dateKey, forecast),
    ["daily-horoscope-article", dateKey, "wed-split-v1"],
    { revalidate: 86400, tags: [`daily-horoscope-${dateKey}`] },
  )();

  await saveDailyHoroscopeArchive(article);

  return article;
});

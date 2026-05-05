import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { oneOffCutoffDate } from "@/lib/billing-config";
import { getBangkokDateKey } from "@/lib/daily-forecast-data";
import { TAROT_CARD_NAMES } from "@/lib/tarot-cards";

const DECK = TAROT_CARD_NAMES;

const SPREAD_POSITIONS: Record<3 | 5 | 10, string[]> = {
  3: ["อดีต", "ปัจจุบัน", "อนาคต"],
  5: ["แกนปัจจุบัน", "อุปสรรค", "รากเหตุ", "แนวโน้มใกล้", "คำแนะนำ"],
  10: [
    "สถานการณ์ปัจจุบัน",
    "แรงท้าทาย/สิ่งต้าน",
    "รากเหตุใต้จิต",
    "อดีตใกล้ที่ส่งผล",
    "เป้าหมายที่อยากไป",
    "อนาคตใกล้",
    "ตัวคุณในบทนี้",
    "สภาพแวดล้อมรอบตัว",
    "ความหวังและความกลัว",
    "แนวโน้มผลลัพธ์",
  ],
};

export type TarotDrawResult = {
  readingId: string;
  dateKey: string;
  spreadCount: 3 | 5 | 10;
  spreadPositions: string[];
  cards: string[];
  preview: string;
  freeLimitPerDay: number;
  freeRemainingToday: number;
  deepUnlocked: boolean;
  deepInsight?: string;
  checkout?: { readingId: string };
};

const FREE_LIMIT_PER_DAY = 1;

function hash32(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickCards(seedKey: string, count = 3): string[] {
  const picked: string[] = [];
  const used = new Set<number>();
  let s = hash32(seedKey);
  while (picked.length < count) {
    s = Math.imul(s ^ 0x9e3779b1, 2654435761) >>> 0;
    const idx = s % DECK.length;
    if (used.has(idx)) continue;
    used.add(idx);
    picked.push(DECK[idx] as string);
  }
  return picked;
}

function buildPreview(cards: string[], question: string, positions: string[]): string {
  const mapped = cards
    .map((card, idx) => `${positions[idx] ?? `ตำแหน่ง ${idx + 1}`}: ${card}`)
    .slice(0, 5)
    .join(" | ");
  return `สเปรด: ${mapped} — คำถาม “${question}” กำลังบอกให้ค่อยๆ วางแผนจากภาพรวมก่อนลงมือแบบเร่งรีบ`;
}

function buildDeepInsight(cards: string[], question: string, positions: string[]): string {
  const positionLines = cards
    .map((card, idx) => `- ${positions[idx] ?? `ตำแหน่ง ${idx + 1}`}: ${card}`)
    .join("\n");
  return `Deep Tarot Insight\n\nคำถาม: ${question}\n\nอ่านตามตำแหน่งสเปรด:\n${positionLines}\n\nแผน 3 ขั้น:\n1) ภายใน 48 ชม. แปลงไพ่ตำแหน่ง “อุปสรรค/แรงต้าน” เป็น task ที่จัดการได้จริง\n2) ภายใน 7 วัน ลงมือทางเลือกที่เสี่ยงต่ำก่อน และเช็กผลตามตำแหน่ง “แนวโน้มใกล้/อนาคตใกล้”\n3) ภายใน 30 วัน ประเมินผลด้วยตำแหน่ง “ผลลัพธ์” เทียบเป้าหมายที่ตั้งไว้\n\nสัญญาณดี: เกิดความชัดเจนจากคนรอบตัว + มีทางเลือกใหม่เข้ามา\nข้อควรเลี่ยง: ตัดสินใจจากอารมณ์ชั่ววูบโดยไม่เทียบข้อมูลในตำแหน่งหลัก`;
}

function normalizeSpreadCount(value: number): 3 | 5 | 10 {
  if (value === 5) return 5;
  if (value === 10) return 10;
  return 3;
}

async function hasTarotDeepPurchase(userId: string, readingId: string): Promise<boolean> {
  const c = await prisma.checkoutSession.count({
    where: {
      userId,
      purchaseType: "tarot-deep",
      analysisId: readingId,
      status: "completed",
      createdAt: { gte: oneOffCutoffDate(new Date()) },
    },
  });
  return c > 0;
}

export async function createOrGetTarotReading(userId: string, question: string, spreadCount = 3): Promise<TarotDrawResult> {
  const dateKey = getBangkokDateKey();
  const normalizedQuestion = question.trim().slice(0, 240) || "ภาพรวมวันนี้";

  const existingUsage = await prisma.tarotDailyUsage.findUnique({
    where: { userId_dateKey: { userId, dateKey } },
  });
  const hasUsedFreeQuotaToday = Boolean(existingUsage);

  const count = normalizeSpreadCount(spreadCount);
  const positions = SPREAD_POSITIONS[count];
  const cards = pickCards(`${userId}:${dateKey}:${normalizedQuestion}:${count}`, count);
  const preview = buildPreview(cards, normalizedQuestion, positions);
  const deepInsight = buildDeepInsight(cards, normalizedQuestion, positions);
  const readingId = nanoid(12);

  await prisma.$transaction(async (tx) => {
    await tx.tarotReading.create({
      data: {
        id: readingId,
        userId,
        dateKey,
        question: normalizedQuestion,
        cardsJson: JSON.stringify(cards),
        preview,
        deepInsight,
      },
    });
    // Only mark free quota consumption the first time user draws today.
    // Subsequent draws are still allowed for preview, but "Deep Insight" remains locked.
    if (!hasUsedFreeQuotaToday) {
      await tx.tarotDailyUsage.upsert({
        where: { userId_dateKey: { userId, dateKey } },
        create: { id: nanoid(12), userId, dateKey },
        update: {},
      });
    }
  });

  return {
    readingId,
    dateKey,
    spreadCount: count,
    spreadPositions: positions,
    cards,
    preview,
    freeLimitPerDay: FREE_LIMIT_PER_DAY,
    freeRemainingToday: 0,
    deepUnlocked: false,
    checkout: { readingId },
  };
}

export async function getTarotReadingForUser(userId: string, readingId: string): Promise<TarotDrawResult | null> {
  const reading = await prisma.tarotReading.findUnique({ where: { id: readingId } });
  if (!reading || reading.userId !== userId) return null;
  const cards = JSON.parse(reading.cardsJson) as string[];
  const spreadCount = normalizeSpreadCount(cards.length);
  const spreadPositions = SPREAD_POSITIONS[spreadCount];
  const deepUnlocked = await hasTarotDeepPurchase(userId, readingId);
  return {
    readingId,
    dateKey: reading.dateKey,
    spreadCount,
    spreadPositions,
    cards,
    preview: reading.preview,
    freeLimitPerDay: FREE_LIMIT_PER_DAY,
    freeRemainingToday: reading.dateKey === getBangkokDateKey() ? 0 : FREE_LIMIT_PER_DAY,
    deepUnlocked,
    deepInsight: deepUnlocked ? reading.deepInsight : undefined,
    checkout: deepUnlocked ? undefined : { readingId },
  };
}

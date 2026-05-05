import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { getBangkokDateKey } from "@/lib/daily-forecast-data";

const DECK = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
] as const;

export type TarotDrawResult = {
  readingId: string;
  dateKey: string;
  cards: string[];
  preview: string;
  freeLimitPerDay: number;
  freeRemainingToday: number;
  deepUnlocked: boolean;
  deepInsight?: string;
  checkout?: { purchaseType: "tarot-deep"; readingId: string; amountTHB: number };
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

function buildPreview(cards: string[], question: string): string {
  return `ไพ่ขึ้น ${cards.join(", ")} — วันนี้จังหวะเด่นคือการตั้งสติและเลือกสิ่งที่ควบคุมได้ก่อน คำถาม “${question}” มีแนวโน้มบวกแบบค่อยเป็นค่อยไป`;
}

function buildDeepInsight(cards: string[], question: string): string {
  return `Deep Tarot Insight\n\nคำถาม: ${question}\n\nแกนพลังจากไพ่ ${cards.join(" / ")} สะท้อนว่าคุณกำลังอยู่ช่วงเปลี่ยนผ่านที่ต้องตัดสินใจด้วยข้อมูลมากกว่าความกลัว\n\nแผน 3 ขั้น:\n1) ภายใน 48 ชม. ระบุทางเลือกหลัก 2 ทางพร้อมผลลัพธ์ที่ยอมรับได้\n2) ภายใน 7 วัน ลงมือทดสอบทางเลือกที่เสี่ยงต่ำก่อน\n3) ภายใน 30 วัน ประเมินผลและปรับแผนโดยยึดเป้าหมายระยะยาว\n\nสัญญาณดี: ได้รับคำตอบชัดจากคนสำคัญ / โอกาสใหม่แบบไม่คาดคิด\nข้อควรเลี่ยง: ตัดสินใจจากอารมณ์ฉับพลันหรือตามแรงกดดันภายนอก`;
}

async function hasTarotDeepPurchase(userId: string, readingId: string): Promise<boolean> {
  const c = await prisma.purchase.count({
    where: { userId, featureType: "tarot-deep", targetId: readingId, status: "completed" },
  });
  return c > 0;
}

export async function createOrGetTarotReading(userId: string, question: string): Promise<TarotDrawResult> {
  const dateKey = getBangkokDateKey();
  const normalizedQuestion = question.trim().slice(0, 240) || "ภาพรวมวันนี้";

  const existingUsage = await prisma.tarotDailyUsage.findUnique({
    where: { userId_dateKey: { userId, dateKey } },
  });

  // Free quota already used today -> return latest reading and offer deep unlock.
  if (existingUsage) {
    const latest = await prisma.tarotReading.findFirst({
      where: { userId, dateKey },
      orderBy: { createdAt: "desc" },
    });
    if (latest) {
      const cards = JSON.parse(latest.cardsJson) as string[];
      const deepUnlocked = await hasTarotDeepPurchase(userId, latest.id);
      return {
        readingId: latest.id,
        dateKey,
        cards,
        preview: latest.preview,
        freeLimitPerDay: FREE_LIMIT_PER_DAY,
        freeRemainingToday: 0,
        deepUnlocked,
        deepInsight: deepUnlocked ? latest.deepInsight : undefined,
        checkout: deepUnlocked ? undefined : { purchaseType: "tarot-deep", readingId: latest.id, amountTHB: 39 },
      };
    }
  }

  const cards = pickCards(`${userId}:${dateKey}:${normalizedQuestion}`, 3);
  const preview = buildPreview(cards, normalizedQuestion);
  const deepInsight = buildDeepInsight(cards, normalizedQuestion);
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
    await tx.tarotDailyUsage.upsert({
      where: { userId_dateKey: { userId, dateKey } },
      create: { id: nanoid(12), userId, dateKey },
      update: {},
    });
  });

  return {
    readingId,
    dateKey,
    cards,
    preview,
    freeLimitPerDay: FREE_LIMIT_PER_DAY,
    freeRemainingToday: 0,
    deepUnlocked: false,
    checkout: { purchaseType: "tarot-deep", readingId, amountTHB: 39 },
  };
}

export async function getTarotReadingForUser(userId: string, readingId: string): Promise<TarotDrawResult | null> {
  const reading = await prisma.tarotReading.findUnique({ where: { id: readingId } });
  if (!reading || reading.userId !== userId) return null;
  const cards = JSON.parse(reading.cardsJson) as string[];
  const deepUnlocked = await hasTarotDeepPurchase(userId, readingId);
  return {
    readingId,
    dateKey: reading.dateKey,
    cards,
    preview: reading.preview,
    freeLimitPerDay: FREE_LIMIT_PER_DAY,
    freeRemainingToday: reading.dateKey === getBangkokDateKey() ? 0 : FREE_LIMIT_PER_DAY,
    deepUnlocked,
    deepInsight: deepUnlocked ? reading.deepInsight : undefined,
    checkout: deepUnlocked ? undefined : { purchaseType: "tarot-deep", readingId, amountTHB: 39 },
  };
}

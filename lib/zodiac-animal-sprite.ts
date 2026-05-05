/**
 * Sprite sheet `public/zodiac-animal-sprites.png` — 3×4 จากซ้ายบน (`spriteIndex` 0–11)
 *
 * ### เทียบนักษัตรจีน ↔ ไทย (วัฏจักร “ปีชวด … ปีกุน” เหมือนจีน ลำดับเดียวกัน)
 * | index | Han | เรียกทั่วไป | **ชื่อปีไทย** |
 * |-------|-----|-------------|----------------|
 * | 0 | 鼠 Shǔ | หนู (Rat) | **ชวด** |
 * | 1 | 牛 Niú | วัว/ควาย (Ox) | **ฉลู** |
 * | 2 | 虎 Hǔ | เสือ (Tiger) | **ขาล** |
 * | 3 | 兔 Tù | กระต่าย / เถาะ (Rabbit) | **เถาะ** |
 * | 4 | 龙 Lóng | มังกร (เรียกปากเปล่าๆ “งูใหญ่”) | **มะโรง** |
 * | 5 | 蛇 Shé | งู (เรียกคู่มะโรงว่า “งูเล็ก”) | **มะเส็ง** |
 * | 6 | 马 Mǎ | ม้า (Horse) | **มะเมีย** |
 * | 7 | 羊 Yáng | แพะ/แกะ (Goat) | **มะแม** |
 * | 8 | 猴 Hóu | ลิง (Monkey) | **วอก** |
 * | 9 | 鸡 Jī | ไก่ (Rooster) | **ระกา** |
 * | 10 | 狗 Gǒu | หมา (Dog) | **จอ** |
 * | 11 | 猪 Zhū | หมู (Pig) | **กุน** |
 *
 * UI ใน Mu-Lab ใช้ภาพนี้เป็น **ไอคอนสากลในกริด 12** — เทียบกับตารางบนได้ตรงตัว
 * (`spriteIndex` = ลำดับเดียวกัน)
 *
 * ต่างจาก **12 “ราศีลักขณา” (เมษ–มีน)** ซึ่งเป็นระบบองศาราศีขึ้น — โค้ดด้านล่างแมปราศีลักขณา → `spriteIndex`
 * เพื่อให้แต่ละราศีมีรูปหนึ่งตัว (ไม่ใช่กฎทางโหราศาสตร์เดียวกับปีนักษัตร)
 */
export const ZODIAC_SPRITE_COLS = 4;
export const ZODIAC_SPRITE_ROWS = 3;

/** ชื่อปีไทยตามลำดับเดียวกับช่อง sprite 0–11 (ชวด … กุน) */
export const THAI_ZODIAC_YEAR_NAMES = [
  "ชวด",
  "ฉลู",
  "ขาล",
  "เถาะ",
  "มะโรง",
  "มะเส็ง",
  "มะเมีย",
  "มะแม",
  "วอก",
  "ระกา",
  "จอ",
  "กุน",
] as const;

/** คำเรียกสัตว์สั้น ๆ คู่กับช่อง sprite (สำหรับ tooltip / คู่มือ) */
export const THAI_ZODIAC_ANIMAL_LABELS = [
  "หนู",
  "วัว",
  "เสือ",
  "กระต่าย",
  "มังกร",
  "งู",
  "ม้า",
  "แพะ",
  "ลิง",
  "ไก่",
  "หมา",
  "หมู",
] as const;

export function thaiYearNameForSpriteIndex(spriteIndex: number): string {
  const i = ((spriteIndex % 12) + 12) % 12;
  return THAI_ZODIAC_YEAR_NAMES[i];
}

const THAI_LAGNA_ORDER = [
  "เมษ",
  "พฤษภ",
  "เมถุน",
  "กรกฎ",
  "สิงห์",
  "กันย์",
  "ตุลย์",
  "พิจิก",
  "ธนู",
  "มังกร",
  "กุมภ์",
  "มีน",
] as const;

/** index 0–11 ใน sprite sheet ต่อราศีลักขณา (ไม่ซ้ำ) */
const SPRITE_INDEX_BY_SIGN: Record<(typeof THAI_LAGNA_ORDER)[number], number> = {
  เมษ: 7, // แพะ / คลายแกะ
  พฤษภ: 1, // ควาย
  เมถุน: 8, // ลิง — ความซับซ้อน/คู่พลัง
  กรกฎ: 3, // กระต่าย — เชิงจันทร์
  สิงห์: 2, // เสือ
  กันย์: 9, // ไก่
  ตุลย์: 4, // มังกร — สมดุลเชิงสัญลักษณ์
  พิจิก: 5, // งู
  ธนู: 6, // ม้า
  มังกร: 10, // สุนัข — ภูเขา/ความทรหด
  กุมภ์: 11, // หมู
  มีน: 0, // หนู — วัฏจักร/สายน้ำ
};

export function getSpriteSheetIndexForThaiSign(signName: string): number {
  const hit = SPRITE_INDEX_BY_SIGN[signName as keyof typeof SPRITE_INDEX_BY_SIGN];
  if (typeof hit === "number") return hit;
  const idx = THAI_LAGNA_ORDER.indexOf(signName as (typeof THAI_LAGNA_ORDER)[number]);
  if (idx >= 0) return idx % 12;
  return 0;
}

export function spriteCellFromIndex(spriteIndex: number): { col: number; row: number } {
  const i = ((spriteIndex % 12) + 12) % 12;
  return { col: i % ZODIAC_SPRITE_COLS, row: Math.floor(i / ZODIAC_SPRITE_COLS) };
}

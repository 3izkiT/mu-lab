/**
 * Rider-Waite-Smith Major Arcana — slug + ชื่อไทย + ความหมายโดยย่อ
 * ภาพต้นฉบับโดย Pamela Colman Smith (1909) — public domain ทั่วโลก
 * เก็บไฟล์ที่ public/tarot/<slug>.webp (480px wide, ~120KB ต่อใบ)
 */
export type TarotCardArt = {
  slug: string;
  name: string;
  nameTh: string;
  meaningTh: string;
};

export const TAROT_CARDS: TarotCardArt[] = [
  {
    slug: "fool",
    name: "The Fool",
    nameTh: "เดอะ ฟูล",
    meaningTh: "การเริ่มต้นใหม่ ก้าวข้ามความกลัว เปิดใจให้กับโอกาสที่ไม่คาดฝัน",
  },
  {
    slug: "magician",
    name: "The Magician",
    nameTh: "นักเวทย์",
    meaningTh: "พลังในการลงมือทำ ใช้ทรัพยากรที่มีอย่างชาญฉลาด ปรากฏตัวในจังหวะที่ใช่",
  },
  {
    slug: "high-priestess",
    name: "The High Priestess",
    nameTh: "นักบวชหญิงสูงสุด",
    meaningTh: "สัญชาตญาณภายใน ความลับที่ยังไม่เปิดเผย ฟังเสียงเงียบในใจ",
  },
  {
    slug: "empress",
    name: "The Empress",
    nameTh: "จักรพรรดินี",
    meaningTh: "ความอุดมสมบูรณ์ ความรักและการดูแล โครงการที่กำลังเติบโต",
  },
  {
    slug: "emperor",
    name: "The Emperor",
    nameTh: "จักรพรรดิ",
    meaningTh: "ความมั่นคง โครงสร้างที่ชัดเจน ภาวะผู้นำและการตัดสินใจเด็ดขาด",
  },
  {
    slug: "hierophant",
    name: "The Hierophant",
    nameTh: "นักบวช",
    meaningTh: "ขนบและภูมิปัญญาดั้งเดิม การเรียนรู้จากครู สถาบัน หรือคำสอน",
  },
  {
    slug: "lovers",
    name: "The Lovers",
    nameTh: "คู่รัก",
    meaningTh: "ทางเลือกสำคัญที่ต้องตัดสินใจด้วยหัวใจ ความสัมพันธ์ที่กลมเกลียว",
  },
  {
    slug: "chariot",
    name: "The Chariot",
    nameTh: "รถศึก",
    meaningTh: "ชัยชนะจากความตั้งใจ ขับเคลื่อนเป้าหมายด้วยพลังสองทิศทางให้สมดุล",
  },
  {
    slug: "strength",
    name: "Strength",
    nameTh: "พลัง",
    meaningTh: "พลังภายในที่อ่อนโยน อดทน เปลี่ยนความกลัวให้กลายเป็นความกล้า",
  },
  {
    slug: "hermit",
    name: "The Hermit",
    nameTh: "ฤๅษี",
    meaningTh: "ถอยมาทบทวนตนเอง แสงสว่างในความเงียบ คำตอบจากภายใน",
  },
  {
    slug: "wheel-of-fortune",
    name: "Wheel of Fortune",
    nameTh: "วงล้อโชคชะตา",
    meaningTh: "วัฏจักรพลิกผัน จังหวะเวลาเปลี่ยน ปรับตัวให้ทันกระแสคลื่น",
  },
  {
    slug: "justice",
    name: "Justice",
    nameTh: "ความยุติธรรม",
    meaningTh: "ความสมดุล ผลของการกระทำ พิจารณาด้วยเหตุผลและซื่อตรง",
  },
  {
    slug: "hanged-man",
    name: "The Hanged Man",
    nameTh: "ชายผู้ถูกแขวน",
    meaningTh: "เปลี่ยนมุมมอง รอเวลาที่ถูกต้อง ปล่อยวางในสิ่งที่ควบคุมไม่ได้",
  },
  {
    slug: "death",
    name: "Death",
    nameTh: "ความตาย",
    meaningTh: "การจบเพื่อเริ่มใหม่ ปลดเปลื้องสิ่งเก่า เปิดทางให้บทใหม่ของชีวิต",
  },
  {
    slug: "temperance",
    name: "Temperance",
    nameTh: "ความสมดุล",
    meaningTh: "ผสมผสานทุกด้านอย่างพอดี ปานกลาง อดทน และค่อยเป็นค่อยไป",
  },
  {
    slug: "devil",
    name: "The Devil",
    nameTh: "ปีศาจ",
    meaningTh: "พันธนาการที่เราสร้างเอง ความหลงใหล/ติดยึด รู้ตัวคือทางออก",
  },
  {
    slug: "tower",
    name: "The Tower",
    nameTh: "หอคอย",
    meaningTh: "การพังทลายอย่างฉับพลัน เพื่อโครงสร้างใหม่ที่จริงและมั่นคงกว่า",
  },
  {
    slug: "star",
    name: "The Star",
    nameTh: "ดาว",
    meaningTh: "ความหวัง การเยียวยา แสงนำทางให้กลับมาเชื่อมั่นในตัวเองอีกครั้ง",
  },
  {
    slug: "moon",
    name: "The Moon",
    nameTh: "ดวงจันทร์",
    meaningTh: "ภาพลวงตาและความไม่แน่นอน ฟังสัญชาตญาณ อย่ารีบสรุป",
  },
  {
    slug: "sun",
    name: "The Sun",
    nameTh: "ดวงอาทิตย์",
    meaningTh: "ความสำเร็จที่ส่องประกาย ความสุขซื่อตรง ความมั่นใจที่กลับคืนมา",
  },
  {
    slug: "judgement",
    name: "Judgement",
    nameTh: "การพิพากษา",
    meaningTh: "การปลุกตื่นรู้ครั้งสำคัญ ทบทวนชีวิต และตอบรับการเรียกขาน",
  },
  {
    slug: "world",
    name: "The World",
    nameTh: "โลก",
    meaningTh: "วงรอบที่สมบูรณ์ ความสำเร็จในระดับสูง พร้อมเปิดบทใหม่ที่กว้างขึ้น",
  },
];

const BY_NAME = new Map<string, TarotCardArt>(TAROT_CARDS.map((c) => [c.name, c]));

export function getTarotCardArt(name: string): TarotCardArt | null {
  return BY_NAME.get(name) ?? null;
}

/**
 * Full Rider-Waite-Smith deck (78 cards)
 * - Major Arcana: artwork available in /public/tarot/*.webp
 * - Minor Arcana: metadata-first cards (text faces for now)
 */
export type TarotCardArt = {
  slug: string;
  name: string;
  nameTh: string;
  meaningTh: string;
  hasArtwork: boolean;
};

const MAJOR_ARCANA: TarotCardArt[] = [
  {
    slug: "fool",
    name: "The Fool",
    nameTh: "เดอะ ฟูล",
    meaningTh: "การเริ่มต้นใหม่ ก้าวข้ามความกลัว เปิดใจให้กับโอกาสที่ไม่คาดฝัน",
    hasArtwork: true,
  },
  {
    slug: "magician",
    name: "The Magician",
    nameTh: "นักเวทย์",
    meaningTh: "พลังในการลงมือทำ ใช้ทรัพยากรที่มีอย่างชาญฉลาด ปรากฏตัวในจังหวะที่ใช่",
    hasArtwork: true,
  },
  {
    slug: "high-priestess",
    name: "The High Priestess",
    nameTh: "นักบวชหญิงสูงสุด",
    meaningTh: "สัญชาตญาณภายใน ความลับที่ยังไม่เปิดเผย ฟังเสียงเงียบในใจ",
    hasArtwork: true,
  },
  {
    slug: "empress",
    name: "The Empress",
    nameTh: "จักรพรรดินี",
    meaningTh: "ความอุดมสมบูรณ์ ความรักและการดูแล โครงการที่กำลังเติบโต",
    hasArtwork: true,
  },
  {
    slug: "emperor",
    name: "The Emperor",
    nameTh: "จักรพรรดิ",
    meaningTh: "ความมั่นคง โครงสร้างที่ชัดเจน ภาวะผู้นำและการตัดสินใจเด็ดขาด",
    hasArtwork: true,
  },
  {
    slug: "hierophant",
    name: "The Hierophant",
    nameTh: "นักบวช",
    meaningTh: "ขนบและภูมิปัญญาดั้งเดิม การเรียนรู้จากครู สถาบัน หรือคำสอน",
    hasArtwork: true,
  },
  {
    slug: "lovers",
    name: "The Lovers",
    nameTh: "คู่รัก",
    meaningTh: "ทางเลือกสำคัญที่ต้องตัดสินใจด้วยหัวใจ ความสัมพันธ์ที่กลมเกลียว",
    hasArtwork: true,
  },
  {
    slug: "chariot",
    name: "The Chariot",
    nameTh: "รถศึก",
    meaningTh: "ชัยชนะจากความตั้งใจ ขับเคลื่อนเป้าหมายด้วยพลังสองทิศทางให้สมดุล",
    hasArtwork: true,
  },
  {
    slug: "strength",
    name: "Strength",
    nameTh: "พลัง",
    meaningTh: "พลังภายในที่อ่อนโยน อดทน เปลี่ยนความกลัวให้กลายเป็นความกล้า",
    hasArtwork: true,
  },
  {
    slug: "hermit",
    name: "The Hermit",
    nameTh: "ฤๅษี",
    meaningTh: "ถอยมาทบทวนตนเอง แสงสว่างในความเงียบ คำตอบจากภายใน",
    hasArtwork: true,
  },
  {
    slug: "wheel-of-fortune",
    name: "Wheel of Fortune",
    nameTh: "วงล้อโชคชะตา",
    meaningTh: "วัฏจักรพลิกผัน จังหวะเวลาเปลี่ยน ปรับตัวให้ทันกระแสคลื่น",
    hasArtwork: true,
  },
  {
    slug: "justice",
    name: "Justice",
    nameTh: "ความยุติธรรม",
    meaningTh: "ความสมดุล ผลของการกระทำ พิจารณาด้วยเหตุผลและซื่อตรง",
    hasArtwork: true,
  },
  {
    slug: "hanged-man",
    name: "The Hanged Man",
    nameTh: "ชายผู้ถูกแขวน",
    meaningTh: "เปลี่ยนมุมมอง รอเวลาที่ถูกต้อง ปล่อยวางในสิ่งที่ควบคุมไม่ได้",
    hasArtwork: true,
  },
  {
    slug: "death",
    name: "Death",
    nameTh: "ความตาย",
    meaningTh: "การจบเพื่อเริ่มใหม่ ปลดเปลื้องสิ่งเก่า เปิดทางให้บทใหม่ของชีวิต",
    hasArtwork: true,
  },
  {
    slug: "temperance",
    name: "Temperance",
    nameTh: "ความสมดุล",
    meaningTh: "ผสมผสานทุกด้านอย่างพอดี ปานกลาง อดทน และค่อยเป็นค่อยไป",
    hasArtwork: true,
  },
  {
    slug: "devil",
    name: "The Devil",
    nameTh: "ปีศาจ",
    meaningTh: "พันธนาการที่เราสร้างเอง ความหลงใหล/ติดยึด รู้ตัวคือทางออก",
    hasArtwork: true,
  },
  {
    slug: "tower",
    name: "The Tower",
    nameTh: "หอคอย",
    meaningTh: "การพังทลายอย่างฉับพลัน เพื่อโครงสร้างใหม่ที่จริงและมั่นคงกว่า",
    hasArtwork: true,
  },
  {
    slug: "star",
    name: "The Star",
    nameTh: "ดาว",
    meaningTh: "ความหวัง การเยียวยา แสงนำทางให้กลับมาเชื่อมั่นในตัวเองอีกครั้ง",
    hasArtwork: true,
  },
  {
    slug: "moon",
    name: "The Moon",
    nameTh: "ดวงจันทร์",
    meaningTh: "ภาพลวงตาและความไม่แน่นอน ฟังสัญชาตญาณ อย่ารีบสรุป",
    hasArtwork: true,
  },
  {
    slug: "sun",
    name: "The Sun",
    nameTh: "ดวงอาทิตย์",
    meaningTh: "ความสำเร็จที่ส่องประกาย ความสุขซื่อตรง ความมั่นใจที่กลับคืนมา",
    hasArtwork: true,
  },
  {
    slug: "judgement",
    name: "Judgement",
    nameTh: "การพิพากษา",
    meaningTh: "การปลุกตื่นรู้ครั้งสำคัญ ทบทวนชีวิต และตอบรับการเรียกขาน",
    hasArtwork: true,
  },
  {
    slug: "world",
    name: "The World",
    nameTh: "โลก",
    meaningTh: "วงรอบที่สมบูรณ์ ความสำเร็จในระดับสูง พร้อมเปิดบทใหม่ที่กว้างขึ้น",
    hasArtwork: true,
  },
];

const RANKS = [
  { en: "Ace", th: "เอซ", meaning: "พลังตั้งต้น โอกาสใหม่ และเมล็ดของความเป็นไปได้" },
  { en: "Two", th: "สอง", meaning: "การเลือก สมดุล และการประสานสองขั้ว" },
  { en: "Three", th: "สาม", meaning: "การขยายตัว ผลลัพธ์แรกเริ่ม และการร่วมมือ" },
  { en: "Four", th: "สี่", meaning: "โครงสร้าง เสถียรภาพ และการหยุดทบทวน" },
  { en: "Five", th: "ห้า", meaning: "แรงเสียดทาน บททดสอบ และการเติบโตผ่านปัญหา" },
  { en: "Six", th: "หก", meaning: "การปรับสมดุล การเยียวยา และความก้าวหน้าที่จับต้องได้" },
  { en: "Seven", th: "เจ็ด", meaning: "กลยุทธ์ การป้องกัน และการตั้งหลักในแรงกดดัน" },
  { en: "Eight", th: "แปด", meaning: "ความเร็ว วินัย และการเปลี่ยนจังหวะสำคัญ" },
  { en: "Nine", th: "เก้า", meaning: "ความเข้มข้นใกล้จบ ความกังวล/ความมุ่งมั่นขั้นสูง" },
  { en: "Ten", th: "สิบ", meaning: "จุดสิ้นสุดของวัฏจักรและการส่งต่อสู่บทใหม่" },
  { en: "Page", th: "เพจ", meaning: "ผู้ส่งสาร ข่าวสารใหม่ และมุมมองของผู้เรียนรู้" },
  { en: "Knight", th: "ไนท์", meaning: "การลงมือจริง แรงขับ และการเดินทางสู่เป้าหมาย" },
  { en: "Queen", th: "ควีน", meaning: "การดูแลภายใน การเข้าใจอารมณ์ และพลังเชิงนุ่มนวล" },
  { en: "King", th: "คิง", meaning: "ภาวะผู้นำ การควบคุมสถานการณ์ และวิสัยทัศน์เชิงระบบ" },
] as const;

const SUITS = [
  { en: "Wands", th: "ไม้เท้า", meaning: "พลังชีวิต งาน แรงบันดาลใจ การลงมือ" },
  { en: "Cups", th: "ถ้วย", meaning: "อารมณ์ ความสัมพันธ์ ความรัก สัญชาตญาณ" },
  { en: "Swords", th: "ดาบ", meaning: "ความคิด การตัดสินใจ ความจริง และข้อขัดแย้ง" },
  { en: "Pentacles", th: "เหรียญ", meaning: "การเงิน งานระยะยาว สุขภาพ และทรัพยากร" },
] as const;

const MINOR_ARCANA: TarotCardArt[] = SUITS.flatMap((suit) =>
  RANKS.map((rank) => ({
    slug: `${rank.en.toLowerCase()}-of-${suit.en.toLowerCase()}`,
    name: `${rank.en} of ${suit.en}`,
    nameTh: `${rank.th} ${suit.th}`,
    meaningTh: `${rank.meaning} ในเรื่อง${suit.meaning}`,
    hasArtwork: false,
  })),
);

export const TAROT_CARDS: TarotCardArt[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];
export const TAROT_CARD_NAMES = TAROT_CARDS.map((c) => c.name);

const BY_NAME = new Map<string, TarotCardArt>(TAROT_CARDS.map((c) => [c.name, c]));

export function getTarotCardArt(name: string): TarotCardArt | null {
  return BY_NAME.get(name) ?? null;
}

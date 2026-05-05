/**
 * เมตาดาต้าราศีไทย — element / quality / ruler / สีคุณลักษณะ ฯลฯ
 * ใช้ในหน้า analysis (Ascendant3D, ส่วนฟรี ฯลฯ) และระดับ prompt LLM
 */

export type ZodiacElement = "ไฟ" | "ดิน" | "ลม" | "น้ำ";
export type ZodiacQuality = "นำ" | "คงที่" | "เปลี่ยน";
export type ZodiacPolarity = "บวก" | "ลบ";

export type ZodiacMeta = {
  /** ชื่อราศีไทย เช่น "เมษ" */
  name: string;
  /** ชื่อภาษาอังกฤษ */
  nameEn: string;
  /** สัญลักษณ์ Unicode */
  symbol: string;
  /** ธาตุประจำราศี */
  element: ZodiacElement;
  /** คุณภาพ (Modality) — ราศีนำ/คงที่/เปลี่ยน */
  quality: ZodiacQuality;
  /** ขั้ว (Polarity) — ราศีบวก (extrovert) / ลบ (introvert) */
  polarity: ZodiacPolarity;
  /** ดาวเจ้าเรือน (Ruler) ตามคติโหรไทย */
  ruler: string;
  /** ช่วงวันที่ตกฤกษ์ (sun sign approximation, ใช้บอกข้อมูลทั่วไป) */
  dateRange: string;
  /** สีหลักของราศี (สำหรับ accent UI) */
  color: string;
  /** สีรอง */
  accent: string;
  /** หินมงคล/อัญมณีเฉพาะราศี */
  gemstone: string;
  /** ทิศมงคล */
  direction: string;
  /** จุดเด่นเชิงบุคลิก (3 หัวข้อ ตามคติทั่วไป) */
  strengths: string[];
  /** ระวัง (3 หัวข้อ — สิ่งที่ควรปรับ) */
  challenges: string[];
  /** สัญลักษณ์ตัวแทน (ใช้ใน prompt ให้ LLM) */
  archetype: string;
  /** หัวข้อสำคัญในชีวิต (career angle) */
  careerThemes: string[];
};

export const ZODIAC_META: Record<string, ZodiacMeta> = {
  เมษ: {
    name: "เมษ",
    nameEn: "Aries",
    symbol: "♈︎",
    element: "ไฟ",
    quality: "นำ",
    polarity: "บวก",
    ruler: "อังคาร",
    dateRange: "13 เม.ย. – 14 พ.ค. (อันโตนาที)",
    color: "#ff7a4d",
    accent: "#ffb273",
    gemstone: "ทับทิม",
    direction: "ทิศตะวันออก",
    strengths: ["พลังขับเคลื่อนสูง", "กล้าตัดสินใจ", "เป็นผู้นำโดยธรรมชาติ"],
    challenges: ["ใจร้อน", "ลุยก่อนคิด", "ขาดความอดทนกับงานละเอียด"],
    archetype: "นักรบผู้บุกเบิก (The Pioneer)",
    careerThemes: ["ผู้ก่อตั้ง/เจ้าของกิจการ", "งานเร่งด่วนที่ต้องตัดสินใจไว", "การแข่งขัน/สาย sales/coaching"],
  },
  พฤษภ: {
    name: "พฤษภ",
    nameEn: "Taurus",
    symbol: "♉︎",
    element: "ดิน",
    quality: "คงที่",
    polarity: "ลบ",
    ruler: "ศุกร์",
    dateRange: "15 พ.ค. – 14 มิ.ย. (อันโตนาที)",
    color: "#7bc97a",
    accent: "#bff0bb",
    gemstone: "มรกต",
    direction: "ทิศตะวันออกเฉียงใต้",
    strengths: ["มั่นคง น่าเชื่อถือ", "อดทนเก่ง", "เสน่ห์เงียบ ๆ ที่ดูดเงิน"],
    challenges: ["ดื้อ ปรับยาก", "ติดความสบาย", "หวงสมบัติเกินไป"],
    archetype: "ผู้สร้างความมั่งคั่ง (The Builder)",
    careerThemes: ["การเงิน/การลงทุน", "ศิลปะ-ดีไซน์-อาหาร", "งาน operations ที่ต้องนิ่งและละเอียด"],
  },
  เมถุน: {
    name: "เมถุน",
    nameEn: "Gemini",
    symbol: "♊︎",
    element: "ลม",
    quality: "เปลี่ยน",
    polarity: "บวก",
    ruler: "พุธ",
    dateRange: "15 มิ.ย. – 16 ก.ค. (อันโตนาที)",
    color: "#fdd95c",
    accent: "#ffeea1",
    gemstone: "ไพฑูรย์",
    direction: "ทิศใต้",
    strengths: ["ฉลาดด้านสื่อสาร", "ปรับตัวไว", "เรียนรู้เร็ว multitask ได้ดี"],
    challenges: ["จับจด เปลี่ยนใจง่าย", "พูดมากกว่าทำ", "เครียดเมื่อข้อมูลล้น"],
    archetype: "นักสื่อสาร (The Messenger)",
    careerThemes: ["สื่อ/การตลาด/copywriting", "การสอน/พูด/podcast", "งานที่ต้องเชื่อมโยงคน-ข้อมูล"],
  },
  กรกฎ: {
    name: "กรกฎ",
    nameEn: "Cancer",
    symbol: "♋︎",
    element: "น้ำ",
    quality: "นำ",
    polarity: "ลบ",
    ruler: "จันทร์",
    dateRange: "17 ก.ค. – 16 ส.ค. (อันโตนาที)",
    color: "#c7d4ff",
    accent: "#e3eaff",
    gemstone: "มุก",
    direction: "ทิศตะวันตก",
    strengths: ["ดูแลคนเก่ง", "อ่อนไหวเชิงสัญชาตญาณสูง", "สร้าง safe space ให้ทีม"],
    challenges: ["เก็บอารมณ์ไว้ในใจ", "ใจอ่อนเวลาคนใกล้ชิดขอ", "ติดอดีต"],
    archetype: "ผู้พิทักษ์ (The Caretaker)",
    careerThemes: ["HR/coach/therapist", "อาหาร-ที่อยู่อาศัย-แม่และเด็ก", "งานบริการที่ใช้ empathy"],
  },
  สิงห์: {
    name: "สิงห์",
    nameEn: "Leo",
    symbol: "♌︎",
    element: "ไฟ",
    quality: "คงที่",
    polarity: "บวก",
    ruler: "อาทิตย์",
    dateRange: "17 ส.ค. – 16 ก.ย. (อันโตนาที)",
    color: "#ffb84d",
    accent: "#ffd388",
    gemstone: "บุษราคัม",
    direction: "ทิศตะวันออก",
    strengths: ["มีบารมี ออร่าสูง", "ใจกว้าง ให้ก่อน", "สร้าง stage ให้คนรอบข้างได้"],
    challenges: ["ต้องการการยอมรับมาก", "เวลาน้อยใจ จะนิ่งอันตราย", "อีโก้สูงเมื่อรู้สึกถูกข้าม"],
    archetype: "ผู้นำสง่างาม (The Sovereign)",
    careerThemes: ["ผู้บริหาร/CEO/founder", "performer/influencer/creator", "งานที่ต้องเป็นหน้าตาของแบรนด์"],
  },
  กันย์: {
    name: "กันย์",
    nameEn: "Virgo",
    symbol: "♍︎",
    element: "ดิน",
    quality: "เปลี่ยน",
    polarity: "ลบ",
    ruler: "พุธ",
    dateRange: "17 ก.ย. – 16 ต.ค. (อันโตนาที)",
    color: "#9ddfb4",
    accent: "#cdeed7",
    gemstone: "หยกเขียว",
    direction: "ทิศใต้",
    strengths: ["ละเอียด แม่นยำ", "วิเคราะห์เป็นระบบ", "เป็นเฟืองตัวสำคัญที่ทำให้ทุกอย่างเดิน"],
    challenges: ["จู้จี้กับตัวเอง", "perfectionist เกินไป", "ลังเลตอนเริ่ม"],
    archetype: "ผู้สร้างคุณภาพ (The Craftsman)",
    careerThemes: ["healthcare/QC/auditing", "ที่ปรึกษา/นักวิจัย", "งาน editor/operations/process"],
  },
  ตุลย์: {
    name: "ตุลย์",
    nameEn: "Libra",
    symbol: "♎︎",
    element: "ลม",
    quality: "นำ",
    polarity: "บวก",
    ruler: "ศุกร์",
    dateRange: "17 ต.ค. – 15 พ.ย. (อันโตนาที)",
    color: "#f4b6d6",
    accent: "#ffd6e8",
    gemstone: "เพชร",
    direction: "ทิศตะวันตก",
    strengths: ["รักความสมดุล มี taste", "มองสองด้านเป็น", "เก่งเรื่อง partnership"],
    challenges: ["ตัดสินใจช้า", "เกรงใจจนเสียโอกาส", "ฉาบฉวยเรื่องดราม่า"],
    archetype: "นักประสานสมดุล (The Diplomat)",
    careerThemes: ["กฎหมาย/ทูต/mediator", "design/fashion/luxury", "co-founder ที่ดูแล relationships"],
  },
  พิจิก: {
    name: "พิจิก",
    nameEn: "Scorpio",
    symbol: "♏︎",
    element: "น้ำ",
    quality: "คงที่",
    polarity: "ลบ",
    ruler: "อังคาร (กับพลูโต)",
    dateRange: "16 พ.ย. – 14 ธ.ค. (อันโตนาที)",
    color: "#a16dff",
    accent: "#cdb1ff",
    gemstone: "นิล/โอปอลดำ",
    direction: "ทิศเหนือ",
    strengths: ["ลึก เข้มข้น ทุ่มสุดตัว", "อ่านคนเก่งมาก", "เปลี่ยนวิกฤติเป็นโอกาสได้"],
    challenges: ["หึง/แค้น/ผูกพยาบาท", "ลังเลที่จะปล่อย", "ปกปิดข้อมูลเกินไป"],
    archetype: "นักสืบลึก (The Alchemist)",
    careerThemes: ["จิตบำบัด/forensic/detective", "การเงินเชิงลึก/M&A", "งานวิจัยที่ใช้ความเข้มข้น"],
  },
  ธนู: {
    name: "ธนู",
    nameEn: "Sagittarius",
    symbol: "♐︎",
    element: "ไฟ",
    quality: "เปลี่ยน",
    polarity: "บวก",
    ruler: "พฤหัสบดี",
    dateRange: "15 ธ.ค. – 12 ม.ค. (อันโตนาที)",
    color: "#ff9f6b",
    accent: "#ffc69d",
    gemstone: "บุษราคัมส้ม/อำพัน",
    direction: "ทิศตะวันออก",
    strengths: ["มองเป้ายาว มีปรัชญา", "พลังมองโลกในแง่ดี", "เปิดรับวัฒนธรรมใหม่ ๆ"],
    challenges: ["พูดตรงเกินไปจนคนเจ็บ", "วางแผนแต่ไม่ลงรายละเอียด", "เบื่อง่าย"],
    archetype: "นักผจญภัย-นักปรัชญา (The Seeker)",
    careerThemes: ["ที่ปรึกษา/อาจารย์/วิทยากร", "travel/cross-border", "การกฎหมาย/publishing"],
  },
  มังกร: {
    name: "มังกร",
    nameEn: "Capricorn",
    symbol: "♑︎",
    element: "ดิน",
    quality: "นำ",
    polarity: "ลบ",
    ruler: "เสาร์",
    dateRange: "13 ม.ค. – 11 ก.พ. (อันโตนาที)",
    color: "#a8b3c4",
    accent: "#d4dbe6",
    gemstone: "นิลดำ/อาเกต",
    direction: "ทิศใต้",
    strengths: ["มุ่งมั่น มีวินัย", "วางระบบเก่ง", "อายุยาว — ไต่ระดับโดยอดทน"],
    challenges: ["เคร่งจนเครียด", "เก็บกดอารมณ์", "ลืมเฉลิมฉลอง"],
    archetype: "ผู้สร้างมรดก (The Architect)",
    careerThemes: ["ผู้บริหาร/รัฐกิจ", "อสังหา/โครงสร้างพื้นฐาน", "องค์กรขนาดใหญ่ที่ต้องการ governance"],
  },
  กุมภ์: {
    name: "กุมภ์",
    nameEn: "Aquarius",
    symbol: "♒︎",
    element: "ลม",
    quality: "คงที่",
    polarity: "บวก",
    ruler: "เสาร์ (กับยูเรนัส)",
    dateRange: "12 ก.พ. – 13 มี.ค. (อันโตนาที)",
    color: "#7fc7ff",
    accent: "#bbe1ff",
    gemstone: "อความารีน",
    direction: "ทิศตะวันตก",
    strengths: ["คิดล้ำ ก้าวหน้า", "มี community sense", "เป็นคนที่กลุ่มนึกถึง"],
    challenges: ["เย็นชา/ห่างเหินกับคนใกล้ตัว", "ดื้อในเชิงอุดมการณ์", "ลืมรายละเอียดเรื่องคน"],
    archetype: "ผู้คิดต่าง (The Innovator)",
    careerThemes: ["เทคโนโลยี/AI/สตาร์ทอัพ", "social impact/NGO", "งานวิจัย/futurism"],
  },
  มีน: {
    name: "มีน",
    nameEn: "Pisces",
    symbol: "♓︎",
    element: "น้ำ",
    quality: "เปลี่ยน",
    polarity: "ลบ",
    ruler: "พฤหัสบดี (กับเนปจูน)",
    dateRange: "14 มี.ค. – 12 เม.ย. (อันโตนาที)",
    color: "#7be2d4",
    accent: "#b1f1e7",
    gemstone: "ไพลิน",
    direction: "ทิศเหนือ",
    strengths: ["ใจดี เห็นใจคนเป็น", "เข้าถึงสัญชาตญาณ/ศิลปะลึก", "ทำงานเชิง healing/spiritual ได้ดี"],
    challenges: ["หลีกหนีความจริง", "ขอบเขตกับคนหลวม", "เครียดสะสมจนหมด battery"],
    archetype: "ผู้รักษาด้วยจิต (The Mystic)",
    careerThemes: ["ศิลปะ/ดนตรี/film/photo", "spiritual healer/coach", "เภสัชกร/บริการสุขภาพ"],
  },
};

export function getZodiacMeta(name: string | null | undefined): ZodiacMeta | null {
  if (!name) return null;
  return ZODIAC_META[name] ?? null;
}

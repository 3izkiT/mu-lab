import { getBirthSignDetail, getThaiBirthSign } from "../lib/birth-sign";

type Case = {
  label: string;
  date: string;
  hour: string;
  minute: string;
  province: string;
  expected: string;
};

/**
 * Reference cases — ตรงกับแพ็กเกจ `thai-astrology` (สุริยยาตร์ไทย อันตรนาที + อาทิตย์อุทัยต่อจังหวัด)
 * ไม่ใช่ Lahiri sidereal จากขอบฟ้าภาพจริง — ถ้าจะเทียบกับซอฟต์แวร์ตะวันตกผลจะต่างได้
 */
const cases: Case[] = [
  {
    label: "17/09/1986 22:42 นครศรีธรรมราช (thai-astrology)",
    date: "17/09/1986",
    hour: "22",
    minute: "42",
    province: "นครศรีธรรมราช",
    expected: "เมษ",
  },
  {
    label: "alias นครศรีฯ ต้องคำนวณเหมือนกัน",
    date: "17/09/1986",
    hour: "22",
    minute: "42",
    province: "นครศรีฯ",
    expected: "เมษ",
  },
  {
    label: "Bangkok sunrise 21/03/2000 06:00 → ลักขณาราศีก่อนเที่ยง",
    date: "21/03/2000",
    hour: "06",
    minute: "00",
    province: "กรุงเทพมหานคร",
    expected: "มีน",
  },
];

let pass = 0;
let fail = 0;
for (const c of cases) {
  const detail = getBirthSignDetail(c.date, c.hour, c.minute, c.province);
  const got = detail?.signName ?? getThaiBirthSign(c.date, c.hour, c.minute, c.province);
  const ok = got === c.expected;
  if (ok) pass += 1;
  else fail += 1;
  const marker = ok ? "✓" : "✗";
  const extra =
    detail?.thaiChart != null
      ? `  (ตนุเสธ=${detail.thaiChart.tanuseth})`
      : detail?.degInSign != null && detail.siderealLongitude != null
        ? `  (fallback sid ${detail.siderealLongitude.toFixed(2)}°)`
        : "";
  console.log(`${marker} ${c.label}\n   expected=${c.expected}  got=${got}${extra}`);
}
console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);

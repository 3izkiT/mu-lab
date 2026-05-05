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
 * Reference cases — verified against Lahiri (Chitrapaksha) sidereal ascendant.
 *
 * เคสจักริน: 17/09/1986 22:42 นครศรีธรรมราช
 *   → ตามคณิตดาราศาสตร์ Lahiri sidereal ได้ "พฤษภ" (Taurus 6°)
 *   ก่อนหน้านี้ฟังก์ชันรายงาน "เมษ" เพราะ offset UTC ตั้งผิด (-9 แทนที่จะเป็น -7)
 *   หากผู้ใช้มีโหรไทยที่ใช้ "อันโตนาที"/"พหินาที" แบบที่ไม่ใช่ดาราศาสตร์ ผลอาจต่างกันไป
 */
const cases: Case[] = [
  {
    label: "จักริน 17/09/1986 22:42 นครศรีธรรมราช (Lahiri sidereal)",
    date: "17/09/1986",
    hour: "22",
    minute: "42",
    province: "นครศรีธรรมราช",
    expected: "พฤษภ",
  },
  {
    label: "alias นครศรีฯ ต้องคำนวณเหมือนกัน",
    date: "17/09/1986",
    hour: "22",
    minute: "42",
    province: "นครศรีฯ",
    expected: "พฤษภ",
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
  console.log(
    `${marker} ${c.label}\n   expected=${c.expected}  got=${got}` +
      (detail ? `  (sid ${detail.siderealLongitude.toFixed(2)}°, ใน ${detail.degInSign.toFixed(2)}°)` : ""),
  );
}
console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);

export type LuckMetersData = {
  career: number;
  wealth: number;
  love: number;
};

function clampMeter(n: number): number {
  if (Number.isNaN(n)) return 85;
  return Math.min(100, Math.max(0, Math.round(n)));
}

/** ค่าเริ่มต้นเมื่อโมเดลไม่ส่งมาตรฐาน — สุ่ม 80–95 ตามสเปก UI */
export function defaultLuckMeters(): LuckMetersData {
  const r = () => 80 + Math.floor(Math.random() * 16);
  return { career: r(), wealth: r(), love: r() };
}

const METERS_LINE =
  /^\[METERS:\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\]\s*\n*/im;

/**
 * ดึง [METERS: a, b, c] ออกจากข้อความ (บรรทัดแรกหรือจุดเริ่มต้น)
 * ลำดับ: การงาน, การเงิน, ความรัก
 */
export function splitMetersFromFortuneText(raw: string): {
  body: string;
  meters: LuckMetersData;
} {
  const text = raw.trim();
  const first = text.match(METERS_LINE);
  if (first) {
    return {
      meters: {
        career: clampMeter(parseInt(first[1], 10)),
        wealth: clampMeter(parseInt(first[2], 10)),
        love: clampMeter(parseInt(first[3], 10)),
      },
      body: text.slice(first[0].length).trim(),
    };
  }

  const idx = text.search(/\[METERS:\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\]/i);
  if (idx >= 0) {
    const block = text.slice(idx).match(/\[METERS:\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\]/i);
    if (block) {
      const end = idx + block[0].length;
      const body = `${text.slice(0, idx)}${text.slice(end)}`.replace(/^\s+/, "").trim();
      return {
        meters: {
          career: clampMeter(parseInt(block[1], 10)),
          wealth: clampMeter(parseInt(block[2], 10)),
          love: clampMeter(parseInt(block[3], 10)),
        },
        body,
      };
    }
  }

  return { body: text, meters: defaultLuckMeters() };
}

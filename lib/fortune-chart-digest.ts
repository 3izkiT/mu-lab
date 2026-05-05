import type { ThaiBirthSignDetail } from "@/lib/birth-sign";

const PLANET_TH: Record<string, string> = {
  ascendant: "ลัคนา",
  sun: "อาทิตย์",
  moon: "จันทร์",
  mars: "อังคาร",
  mercury: "พุธ",
  jupiter: "พฤหัสบดี",
  venus: "ศุกร์",
  saturn: "เสาร์",
  rahu: "ราหู",
  ketu: "เกตุ",
  uranus: "มฤตยู",
};

/**
 * ข้อความสั้นสำหรับแนบใน prompt — บังคับให้ AI อ่านจากตำแหน่งที่คำนวณแล้วเท่านั้น
 */
export function formatThaiChartDigestForPrompt(detail: ThaiBirthSignDetail): string | null {
  const c = detail.thaiChart;
  if (!c) return null;

  const parts = Object.entries(c.planets).map(([k, signIdx]) => {
    const label = PLANET_TH[k] ?? k;
    return `${label}=${signIdx}`;
  });

  const channels = c.channelOutputs.map((cell, i) => (cell ? `${i}:${cell}` : "")).filter(Boolean);

  return [
    "ชุดดวง (คำนวณสุริยยาตร์ไทย — ห้ามเปลี่ยนเลขช่องหรือลัคนาเอง):",
    `ลัคนา=ราศี${detail.signName} (ช่องราศี index ${detail.signIndex} เมษ=0 … มีน=11)`,
    `ตนุเสธ=${c.tanuseth}`,
    `ดาวแต่ละดวงอยู่ช่องราศี index: ${parts.join(", ")}`,
    `อาทิตย์ในราศี (องศา, ลิปดา)=${c.sunPosition[0]}° ${c.sunPosition[1]}'`,
    channels.length ? `สัญลักษณ์ในช่อง 12 ราศี: ${channels.join(" ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

import { getBangkokDateKey } from "@/lib/daily-forecast-data";
import { getBirthSignDetail, parseStoredBirthClock } from "@/lib/birth-sign";
import { getZodiacMeta } from "@/lib/zodiac-meta";

export type SoulEnergyPoint = {
  dateKey: string;
  label: string;
  score: number;
  status: "great" | "steady" | "caution";
  powerColor: string;
  luckyNumber: number;
  auspiciousHours: string;
};

export type SoulDashboardData = {
  ascendantSign: string;
  windowDays: number;
  points: SoulEnergyPoint[];
  averageScore: number;
  bestDay?: SoulEnergyPoint;
  cautionDay?: SoulEnergyPoint;
};

type BuildDashboardInput = {
  birthDate?: string | null;
  birthTime?: string | null;
  birthProvince?: string | null;
  fallbackSign?: string | null;
  windowDays?: number;
};

function hash(input: string): number {
  let value = 0;
  for (let i = 0; i < input.length; i += 1) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

function clampScore(score: number): number {
  return Math.max(12, Math.min(96, Math.round(score)));
}

function toDate(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map((v) => Number(v));
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
}

function toDateKey(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function deriveAscSign(input: BuildDashboardInput): string {
  if (input.birthDate) {
    const clock = parseStoredBirthClock(input.birthTime ?? undefined);
    const detail = getBirthSignDetail(
      input.birthDate,
      clock?.hour,
      clock?.minute,
      input.birthProvince ?? undefined,
    );
    if (detail?.signName) return detail.signName;
  }
  return input.fallbackSign || "เมษ";
}

function buildHourWindow(seed: number): string {
  const startHour = 6 + (seed % 11); // 06 - 16
  const startMin = seed % 2 === 0 ? "15" : "45";
  const endHour = Math.min(startHour + 1, 22);
  const endMin = startMin === "15" ? "35" : "20";
  return `${String(startHour).padStart(2, "0")}:${startMin} - ${String(endHour).padStart(2, "0")}:${endMin}`;
}

export function buildSoulDashboardData(input: BuildDashboardInput): SoulDashboardData {
  const windowDays = input.windowDays ?? 30;
  const ascendantSign = deriveAscSign(input);
  const meta = getZodiacMeta(ascendantSign);
  const today = toDate(getBangkokDateKey());
  const signSeed = hash(ascendantSign);
  const points: SoulEnergyPoint[] = [];

  for (let i = 0; i < windowDays; i += 1) {
    const day = new Date(today);
    day.setUTCDate(today.getUTCDate() + i);
    const dateKey = toDateKey(day);
    const weekday = day.getUTCDay();
    const cycle = Math.sin((i + (signSeed % 9)) / 3.4) * 16;
    const weeklyBias = weekday === 1 || weekday === 4 ? 8 : weekday === 0 ? -7 : 0;
    const drift = ((hash(`${ascendantSign}:${dateKey}`) % 15) - 7) * 0.9;
    const base = 58 + cycle + weeklyBias + drift;
    const score = clampScore(base);
    const status: SoulEnergyPoint["status"] = score >= 74 ? "great" : score <= 42 ? "caution" : "steady";
    const luckyNumber = (hash(`${dateKey}:${ascendantSign}:luck`) % 9) + 1;
    const hourSeed = hash(`${dateKey}:${ascendantSign}:hour`) % 100;
    points.push({
      dateKey,
      label: day.toLocaleDateString("th-TH", { day: "2-digit", month: "short", timeZone: "UTC" }),
      score,
      status,
      powerColor: meta?.color ?? "#f7e7ce",
      luckyNumber,
      auspiciousHours: buildHourWindow(hourSeed),
    });
  }

  const averageScore = clampScore(points.reduce((acc, item) => acc + item.score, 0) / Math.max(points.length, 1));
  const bestDay = [...points].sort((a, b) => b.score - a.score)[0];
  const cautionDay = [...points].sort((a, b) => a.score - b.score)[0];

  return {
    ascendantSign,
    windowDays,
    points,
    averageScore,
    bestDay,
    cautionDay,
  };
}

export function buildSevenDayPreview(input: BuildDashboardInput): SoulDashboardData {
  return buildSoulDashboardData({ ...input, windowDays: 7 });
}


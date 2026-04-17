import type { LucideIcon } from "lucide-react";
import { CloudSun, Crown, Flame, Heart, Moon, Sparkles, Sun } from "lucide-react";
import type { BirthWeekdayId } from "@/lib/daily-horoscope-article-data";

export type WeekdayHoroscopeStyle = {
  Icon: LucideIcon;
  /** กล่องไอคอน (พื้นหลังไล่เฉด + ขอบ) */
  iconShell: string;
  /** สี stroke ไอคอน */
  iconClass: string;
  /** เส้นซ้ายของบล็อกเนื้อหา */
  railClass: string;
  /** พื้นหลังการ์ดอ่อน ๆ */
  panelClass: string;
};

/**
 * สีตามมุมโหราไทยร่วมสมัย — หัวข้อในหน้าใช้โทนทองร่วมกับแบรนด์ ส่วนไอคอน/แถบซ้ายใช้สีวันเพื่อให้จับคู่ได้ทันที
 */
export const WEEKDAY_HOROSCOPE_STYLE: Record<BirthWeekdayId, WeekdayHoroscopeStyle> = {
  mon: {
    Icon: Moon,
    iconShell:
      "rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/30 via-yellow-500/15 to-amber-950/30 shadow-[0_0_28px_rgba(251,191,36,0.22)]",
    iconClass: "text-amber-100",
    railClass: "border-l-amber-400/80",
    panelClass: "bg-gradient-to-r from-amber-500/[0.07] to-transparent",
  },
  tue: {
    Icon: Flame,
    iconShell:
      "rounded-2xl border border-rose-400/35 bg-gradient-to-br from-rose-500/25 via-pink-600/15 to-rose-950/25 shadow-[0_0_26px_rgba(244,114,182,0.18)]",
    iconClass: "text-rose-100",
    railClass: "border-l-rose-400/75",
    panelClass: "bg-gradient-to-r from-rose-500/[0.07] to-transparent",
  },
  wed_day: {
    Icon: CloudSun,
    iconShell:
      "rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-400/28 via-lime-500/14 to-emerald-950/28 shadow-[0_0_26px_rgba(52,211,153,0.2)]",
    iconClass: "text-emerald-50",
    railClass: "border-l-emerald-300/85",
    panelClass: "bg-gradient-to-r from-emerald-500/[0.08] to-transparent",
  },
  wed_night: {
    Icon: Moon,
    iconShell:
      "rounded-2xl border border-teal-400/35 bg-gradient-to-br from-teal-900/45 via-indigo-900/35 to-slate-950/55 shadow-[0_0_28px_rgba(45,212,191,0.14)]",
    iconClass: "text-teal-100",
    railClass: "border-l-teal-400/80",
    panelClass: "bg-gradient-to-r from-teal-600/[0.1] to-transparent",
  },
  thu: {
    Icon: Crown,
    iconShell:
      "rounded-2xl border border-orange-400/35 bg-gradient-to-br from-orange-500/25 via-amber-600/12 to-orange-950/25 shadow-[0_0_26px_rgba(251,146,60,0.18)]",
    iconClass: "text-orange-100",
    railClass: "border-l-orange-400/75",
    panelClass: "bg-gradient-to-r from-orange-500/[0.07] to-transparent",
  },
  fri: {
    Icon: Heart,
    iconShell:
      "rounded-2xl border border-sky-400/35 bg-gradient-to-br from-sky-500/25 via-blue-600/12 to-sky-950/25 shadow-[0_0_26px_rgba(56,189,248,0.18)]",
    iconClass: "text-sky-100",
    railClass: "border-l-sky-400/75",
    panelClass: "bg-gradient-to-r from-sky-500/[0.07] to-transparent",
  },
  sat: {
    Icon: Sparkles,
    iconShell:
      "rounded-2xl border border-violet-400/35 bg-gradient-to-br from-violet-500/25 via-purple-600/12 to-violet-950/30 shadow-[0_0_28px_rgba(167,139,250,0.2)]",
    iconClass: "text-violet-100",
    railClass: "border-l-violet-400/75",
    panelClass: "bg-gradient-to-r from-violet-500/[0.08] to-transparent",
  },
  sun: {
    Icon: Sun,
    iconShell:
      "rounded-2xl border border-red-400/35 bg-gradient-to-br from-red-500/22 via-amber-500/12 to-red-950/28 shadow-[0_0_28px_rgba(248,113,113,0.2)]",
    iconClass: "text-red-100",
    railClass: "border-l-red-400/75",
    panelClass: "bg-gradient-to-r from-red-500/[0.07] to-transparent",
  },
};

/** กันหน้าแตกถ้า id ไม่ตรง map (ข้อมูลเก่า/แปลกปน) — ใช้สไตล์จันทร์เป็นค่าเริ่มต้น */
export function getWeekdayHoroscopeStyle(id: BirthWeekdayId): WeekdayHoroscopeStyle {
  return WEEKDAY_HOROSCOPE_STYLE[id] ?? WEEKDAY_HOROSCOPE_STYLE.mon;
}

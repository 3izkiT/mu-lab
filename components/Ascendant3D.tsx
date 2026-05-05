"use client";

import { useId } from "react";
import { getZodiacMeta } from "@/lib/zodiac-meta";

type Ascendant3DProps = {
  /** ราศี เช่น "พฤษภ" */
  signName: string;
  /** องศาภายในราศี 0–30 — ควรแสดงเฉพาะเมื่อคำนวณจากเวลา+ที่เกิด */
  degInSign?: number;
  /** `signature` = โชว์เฉพาะผลลัพธ์ / วงทอง (มืออาชีพขึ้น) · `full` = ธาตุ-ดาวครบ */
  mode?: "signature" | "full";
  /** ระบายข้อความจากระบบ (เช่น จัดการจังหวัดฟัซซี่/สำรอง) */
  footnote?: string;
};

/**
 * แสดงลักขณาแบบเลเยอร์ 3D-ish (CSS perspective + shadow ลึก + วงแหวนลอย)
 *
 * `signature` — เหมาะหน้าคำทำนาย: เด่นแค่ราศี + องศา — ไม่รกด้วยเมตาชุดใหญ่
 */
export default function Ascendant3D({ signName, degInSign, mode = "signature", footnote }: Ascendant3DProps) {
  const ringGradId = useId().replace(/:/g, "");
  const meta = getZodiacMeta(signName);
  const palette = getElementPalette(meta?.element);
  const accentColor = palette.primary;
  const accent2 = palette.secondary;
  const symbol = meta?.symbol ?? "✦";
  const nameEn = meta?.nameEn ?? "Ascendant";
  const zodiacIconPath = getZodiacIconPath(signName);

  const showDetailGrid = mode === "full" && meta;

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border border-[rgba(247,231,206,0.16)] shadow-[0_42px_100px_rgba(0,0,0,0.55)] [-webkit-mask-image:-webkit-radial-gradient(#fff,#000)]`}
      aria-label={`ลักขณาราศี${signName}`}
      style={{
        background:
          "radial-gradient(circle at 28% -8%,rgba(247,231,206,0.22) 0%,transparent 45%), radial-gradient(circle at 108% 88%,rgba(99,118,228,0.28) 0%,transparent 52%),linear-gradient(152deg,#0a1230 0%,#050b1f 52%,#02040f 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_50%_88%,transparent_62%,rgba(0,0,0,0.55)_112%)]" />

      <div className={`relative px-6 py-7 sm:p-10 ${showDetailGrid ? "grid gap-8 sm:grid-cols-[minmax(0,280px)_1fr] sm:items-center" : "flex flex-col items-center text-center gap-7"}`}>
        <div
          className={`relative flex shrink-0 [perspective:1200px] ${showDetailGrid ? "justify-center sm:justify-start mx-auto sm:mx-0" : "mx-auto justify-center"}`}
        >
          {/* outer orbit */}
          <div
            aria-hidden
            className="absolute inset-[-22%] rounded-full animate-[pulse_14s_ease-in-out_infinite]"
            style={{
              background: `linear-gradient(135deg, ${accentColor}18, transparent 40%, ${accent2}25, transparent 70%)`,
              filter: "blur(12px)",
            }}
          />

          <div className={`relative mx-auto grid place-items-center ${showDetailGrid ? "h-[268px] w-[268px] sm:h-[296px] sm:w-[296px]" : "h-[220px] w-[220px] sm:h-[280px] sm:w-[280px]"}`}>
            <div
              className="pointer-events-none absolute inset-[-2%] opacity-75 [animation:mu-lab-asc-spin_42s_linear_infinite]"
              aria-hidden
            >
              <svg viewBox="0 0 200 200" className="h-full w-full" style={{ filter: `drop-shadow(0 4px 20px ${accentColor}44)` }}>
                <defs>
                  <linearGradient id={ringGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={accentColor} stopOpacity={0.9} />
                    <stop offset="40%" stopColor="#f7e7ce" stopOpacity={0.45} />
                    <stop offset="100%" stopColor={accent2} stopOpacity={0.92} />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={`url(#${ringGradId})`}
                  strokeWidth="2"
                  strokeDasharray="3 11"
                  opacity={0.9}
                />
              </svg>
            </div>

            {/* inner halo */}
            <div
              aria-hidden
              className="absolute inset-[10%] rounded-full border border-[rgba(247,231,206,0.18)] opacity-85"
              style={{
                boxShadow: `inset 0 18px 50px rgba(0,0,0,0.55), inset 0 -28px 40px ${accentColor}18`,
              }}
            />

            <div
              className="relative z-[2] mx-auto rounded-full [transform-style:preserve-3d] [animation:mu-lab-asc-float_11s_ease-in-out_infinite]"
              style={{
                width: showDetailGrid ? "58%" : "62%",
                height: showDetailGrid ? "58%" : "62%",
                background: `radial-gradient(circle at 38% 32%, rgba(255,255,255,0.32), transparent 52%), radial-gradient(circle at 72% 88%, rgba(255,255,255,0.08), transparent 55%), radial-gradient(circle at 30% 30%, ${accentColor}, ${accent2} 62%, #0d102e 118%)`,
                boxShadow: `0 42px 80px rgba(0,0,0,0.58), inset 14px -18px 26px rgba(0,0,0,0.55), inset -10px 10px 32px rgba(255,255,255,0.09), 0 0 52px ${accentColor}55`,
              }}
            >
              <div
                className="relative grid h-full w-full place-items-center rounded-full bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,transparent_42%)]"
                style={{
                  transform: "translateZ(12px)",
                  transformStyle: "preserve-3d",
                  textShadow: `0 -2px 1px rgba(255,255,255,0.35), 0 8px 16px rgba(0,0,0,0.55)`,
                }}
              >
                {zodiacIconPath ? (
                  <img
                    src={zodiacIconPath}
                    alt={`${signName} icon`}
                    className="h-[72%] w-[72%] object-contain drop-shadow-[0_10px_16px_rgba(8,12,26,0.58)]"
                    draggable={false}
                  />
                ) : (
                  <span className="font-serif text-[clamp(4.15rem,16vw,5.7rem)] leading-[1.12] text-[#0c0e26]">{symbol}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`min-w-0 ${showDetailGrid ? "sm:text-left" : "text-center"}`}>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--gold)]/72">Ascending sign · ลักขณา</p>
          <h2 className="mt-1.5 bg-[linear-gradient(110deg,#f7e7ce_0%,#ffecb5_52%,#d9bb85_100%)] bg-clip-text pb-2 font-serif text-4xl font-semibold leading-[1.24] tracking-tight text-transparent sm:text-5xl">
            {signName}
          </h2>
          <p className="mt-2 text-[11px] uppercase tracking-[0.24em] text-[#dbe1ff]/60">{nameEn}</p>

          {typeof degInSign !== "number" ? (
            <p className="mt-5 inline-flex rounded-full border border-[rgba(247,231,206,0.22)] bg-[rgba(247,231,206,0.05)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#dbe1ff]/65">
              สุริยยาตร์ไทย · อันตรนาที + อาทิตย์อุทัยตามจังหวัด
            </p>
          ) : null}

          {typeof degInSign === "number" ? (
            <p className="mt-6 inline-flex rounded-full border border-[rgba(247,231,206,0.38)] bg-[rgba(247,231,206,0.06)] px-4 py-1.5 text-xs font-medium text-[var(--gold)] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-sm">
              องศาในราศี&nbsp;
              <span className="text-[#eef1ff]">{degInSign.toFixed(2)}°</span>
              <span className="ml-3 text-[#dbe1ff]/55 hidden sm:inline border-l border-white/20 pl-3">
                สุริยยาตร์ไทย · อันตรนาที + อาทิตย์อุทัยตามจังหวัด
              </span>
            </p>
          ) : null}

          {footnote ? (
            <p className={`mt-4 text-[11px] leading-relaxed text-[#dbe1ff]/58 ${showDetailGrid ? "" : "mx-auto max-w-md"}`}>
              {footnote}
            </p>
          ) : null}

          {!showDetailGrid ? (
            <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-[#dbe1ff]/70">
              ลักขณาคือ &ldquo;ราศีที่เกิดขึ้นที่ขอบฟ้าทิศตะวันออก&rdquo; ณ เวลาที่เกิด — เป็นแกนที่ Mu-Lab ใช้อ่าน temperament ภาพรวมฟรี
              และแยกเลเยอร์เชิงลึกเมื่อเลือกแพ็กเกจถัดไป
            </p>
          ) : null}

          {showDetailGrid ? (
            <div className="mt-8 grid grid-cols-2 gap-3 text-left sm:max-w-xl">
              {meta ? (
                <>
                  <Stat label="ธาตุ" value={meta.element} />
                  <Stat label="คุณภาพ" value={meta.quality} />
                  <Stat label="ดาวเจ้าเรือน" value={meta.ruler} />
                  <Stat label="อัญมณีมงคล" value={meta.gemstone} />
                  <div className="col-span-2 mt-4">
                    <p className="text-base leading-relaxed text-[#e8eeff]/85 sm:text-lg">{meta.archetype}</p>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function getZodiacIconPath(signName: string): string | null {
  const bySign: Record<string, string> = {
    เมษ: "/zodiac-icons/aries.png",
    พฤษภ: "/zodiac-icons/taurus.png",
    เมถุน: "/zodiac-icons/gemini.png",
    กรกฎ: "/zodiac-icons/cancer.png",
    สิงห์: "/zodiac-icons/leo.png",
    กันย์: "/zodiac-icons/virgo.png",
    ตุลย์: "/zodiac-icons/libra.png",
    พิจิก: "/zodiac-icons/scorpio.png",
    ธนู: "/zodiac-icons/sagittarius.png",
    มังกร: "/zodiac-icons/capricorn.png",
    กุมภ์: "/zodiac-icons/aquarius.png",
    มีน: "/zodiac-icons/pisces.png",
  };
  return bySign[signName] ?? null;
}

function getElementPalette(element?: string) {
  if (element === "ไฟ") {
    return { primary: "#ff8c5a", secondary: "#ffc187" };
  }
  if (element === "ดิน") {
    return { primary: "#d9ba8a", secondary: "#f2ddba" };
  }
  if (element === "ลม") {
    return { primary: "#7fc7ff", secondary: "#bbe1ff" };
  }
  if (element === "น้ำ") {
    return { primary: "#7be2d4", secondary: "#b1f1e7" };
  }
  return { primary: "#f7e7ce", secondary: "#ffe6b3" };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgba(247,231,206,0.14)] bg-[rgba(7,16,36,0.55)] px-3 py-3 backdrop-blur-sm">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--gold)]/60">{label}</p>
      <p className="mt-1.5 text-base text-[#eef1ff]/92 sm:text-lg">{value}</p>
    </div>
  );
}

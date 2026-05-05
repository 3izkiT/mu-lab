import { getZodiacMeta } from "@/lib/zodiac-meta";

type Ascendant3DProps = {
  /** ราศี เช่น "พฤษภ" */
  signName: string;
  /** องศาภายในราศี 0–30 (option) */
  degInSign?: number;
};

/**
 * แสดงราศีขึ้น (ลักขณา) แบบสามมิติ — วงแหวน rotating + glyph ลอยเด่น + ออร่าทอง
 *
 * Notes:
 *  - ใช้ pure SVG + CSS เพื่อทำ "เหมือน 3D" ผ่าน gradient/shadow/parallax โดยไม่พึ่ง bitmap
 *  - หากภาษาราศีไม่อยู่ในตาราง → ตกเป็น default ทอง
 */
export default function Ascendant3D({ signName, degInSign }: Ascendant3DProps) {
  const meta = getZodiacMeta(signName);
  const accentColor = meta?.color ?? "#f7e7ce";
  const accent2 = meta?.accent ?? "#ffe6b3";
  const symbol = meta?.symbol ?? "✦";
  const nameEn = meta?.nameEn ?? "Ascendant";
  const archetype = meta?.archetype ?? "ราศีขึ้นของคุณ";

  return (
    <section
      className="relative overflow-hidden rounded-[28px] border border-[rgba(247,231,206,0.16)] bg-[radial-gradient(circle_at_18%_0%,rgba(247,231,206,0.16)_0%,transparent_55%),radial-gradient(circle_at_82%_100%,rgba(99,118,228,0.22)_0%,transparent_60%),linear-gradient(160deg,#0c1330_0%,#06091e_55%,#02040f_100%)] p-6 shadow-[0_36px_80px_rgba(0,0,0,0.45)] sm:p-8"
      aria-label={`ลักขณาราศี${signName}`}
    >
      <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,260px)_1fr] sm:gap-10">
        <div className="relative flex aspect-square w-full max-w-[280px] items-center justify-center [perspective:1000px] mx-auto">
          <div
            aria-hidden
            className="mu-lab-asc-glow pointer-events-none absolute inset-[-10%] rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${accentColor}55 0%, ${accent2}22 35%, transparent 65%)`,
            }}
          />
          <svg
            viewBox="0 0 200 200"
            className="mu-lab-asc-ring-outer absolute inset-0 h-full w-full opacity-80"
            aria-hidden
          >
            <defs>
              <linearGradient id="asc-ring-grad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.95" />
                <stop offset="50%" stopColor="#f7e7ce" stopOpacity="0.55" />
                <stop offset="100%" stopColor={accent2} stopOpacity="0.95" />
              </linearGradient>
            </defs>
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="url(#asc-ring-grad)"
              strokeWidth="1.6"
              strokeDasharray="2 6"
            />
            {Array.from({ length: 12 }).map((_, i) => {
              const ang = (i * 30 * Math.PI) / 180;
              const x1 = 100 + Math.cos(ang) * 84;
              const y1 = 100 + Math.sin(ang) * 84;
              const x2 = 100 + Math.cos(ang) * 92;
              const y2 = 100 + Math.sin(ang) * 92;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={accentColor}
                  strokeOpacity="0.55"
                  strokeWidth="1.2"
                />
              );
            })}
          </svg>
          <svg
            viewBox="0 0 200 200"
            className="mu-lab-asc-ring-inner absolute inset-[8%] h-[84%] w-[84%] opacity-65"
            aria-hidden
          >
            <circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="#f7e7ce"
              strokeOpacity="0.32"
              strokeWidth="0.8"
              strokeDasharray="1 5"
            />
            <circle
              cx="100"
              cy="100"
              r="72"
              fill="none"
              stroke="#f7e7ce"
              strokeOpacity="0.18"
              strokeWidth="0.6"
            />
          </svg>
          <div
            className="mu-lab-asc-float relative z-10 flex h-[58%] w-[58%] items-center justify-center rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${accentColor}, ${accent2} 55%, #1a1438 100%)`,
              boxShadow: `inset 6px -10px 20px rgba(0,0,0,0.5), inset -8px 6px 18px ${accentColor}88, 0 24px 60px rgba(0,0,0,0.5)`,
            }}
          >
            <span
              className="font-serif text-[5.5rem] leading-none sm:text-[6rem]"
              style={{
                color: "#1a1438",
                textShadow: `0 2px 0 ${accent2}, 0 6px 18px rgba(0,0,0,0.55), 0 -1px 1px rgba(255,255,255,0.45)`,
              }}
            >
              {symbol}
            </span>
          </div>
        </div>

        <div className="text-center sm:text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold)]/70">Ascendant · ลักขณา</p>
          <h2 className="mt-2 font-serif text-4xl text-[#f5dfb6] sm:text-5xl">{signName}</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#dbe1ff]/55">{nameEn}</p>
          <p className="mt-4 text-sm leading-relaxed text-[#e8eeff]/85 sm:text-base">{archetype}</p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-left sm:max-w-md">
            {meta ? (
              <>
                <Stat label="ธาตุ" value={meta.element} />
                <Stat label="คุณภาพ" value={meta.quality} />
                <Stat label="ดาวเจ้าเรือน" value={meta.ruler} />
                <Stat label="อัญมณีมงคล" value={meta.gemstone} />
              </>
            ) : null}
          </div>

          {typeof degInSign === "number" ? (
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]/60">
              องศาในราศี · {degInSign.toFixed(1)}°
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgba(247,231,206,0.14)] bg-[rgba(7,16,36,0.55)] px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]/60">{label}</p>
      <p className="mt-1 text-sm text-[#eef1ff]/92">{value}</p>
    </div>
  );
}

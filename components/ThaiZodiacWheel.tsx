"use client";

import { ZodiacAnimalSprite } from "@/components/ZodiacAnimalSprite";

const LABELS = ["เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์", "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"] as const;

type ThaiZodiacWheelProps = {
  /** 0 = เมษ … 11 = มีน — ตรงกับ index จากเครื่องคำนวณ */
  ascendantIndex: number;
  className?: string;
};

/**
 * วงจักร 12 ราศีแบบ SVG — เน้นลัคนา (ไม่วางดาวทุกดวงจนกว่าจะมีข้อมูลจากเอนจิน)
 */
export function ThaiZodiacWheel({ ascendantIndex, className = "" }: ThaiZodiacWheelProps) {
  const cx = 50;
  const cy = 50;
  const rOuter = 46;
  const rInner = 18;
  const safeIdx = ((ascendantIndex % 12) + 12) % 12;

  const activeName = LABELS[safeIdx];

  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[min(100%,420px)] ${className}`}
      aria-label={`วงจักร 12 ราศี ลัคนาอยู่ราศี${activeName}`}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_20px_48px_rgba(0,0,0,0.45)]">
        <defs>
          <radialGradient id="tzw-glow" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="rgba(247,231,206,0.35)" />
            <stop offset="55%" stopColor="rgba(15,28,58,0.2)" />
            <stop offset="100%" stopColor="rgba(2,4,12,0.95)" />
          </radialGradient>
          <linearGradient id="tzw-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9bb85" stopOpacity={0.95} />
            <stop offset="50%" stopColor="#f7e7ce" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#8b7355" stopOpacity={0.9} />
          </linearGradient>
        </defs>

        <circle cx={cx} cy={cy} r={rOuter + 2} fill="url(#tzw-glow)" />
        <circle
          cx={cx}
          cy={cy}
          r={rOuter}
          fill="rgba(7,14,32,0.92)"
          stroke="url(#tzw-ring)"
          strokeWidth={0.55}
        />

        {LABELS.map((label, i) => {
          const deg0 = -90 + i * 30;
          const deg1 = -90 + (i + 1) * 30;
          const a0 = (deg0 * Math.PI) / 180;
          const a1 = (deg1 * Math.PI) / 180;
          const x0 = cx + rOuter * Math.cos(a0);
          const y0 = cy + rOuter * Math.sin(a0);
          const x1 = cx + rOuter * Math.cos(a1);
          const y1 = cy + rOuter * Math.sin(a1);
          const active = i === safeIdx;
          const mid = (a0 + a1) / 2;
          const tx = cx + (rOuter * 0.72) * Math.cos(mid);
          const ty = cy + (rOuter * 0.72) * Math.sin(mid);

          return (
            <g key={label}>
              <path
                d={`M ${cx} ${cy} L ${x0} ${y0} A ${rOuter} ${rOuter} 0 0 1 ${x1} ${y1} Z`}
                fill={active ? "rgba(247,231,206,0.14)" : "rgba(255,255,255,0.02)"}
                stroke="rgba(247,231,206,0.22)"
                strokeWidth={0.12}
              />
              <line x1={cx} y1={cy} x2={x0} y2={y0} stroke="rgba(247,231,206,0.28)" strokeWidth={0.15} />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={active ? "#f7e7ce" : "rgba(219,225,255,0.55)"}
                fontSize={active ? 3.4 : 2.85}
                fontWeight={active ? 700 : 500}
                className="font-serif"
                style={{ textShadow: active ? "0 0 6px rgba(247,231,206,0.45)" : undefined }}
              >
                {label}
              </text>
            </g>
          );
        })}

        <circle cx={cx} cy={cy} r={rInner} fill="rgba(4,8,20,0.92)" stroke="rgba(247,231,206,0.35)" strokeWidth={0.35} />
      </svg>

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex w-[min(32%,150px)] -translate-x-1/2 -translate-y-[52%] flex-col items-center gap-1">
        <p className="font-serif text-[clamp(10px,2.6vw,13px)] font-medium tracking-[0.12em] text-[#f7e7ce]/95">ลัคนา</p>
        <div className="aspect-square w-[78%] min-w-[72px] max-w-[120px]">
          <ZodiacAnimalSprite signName={activeName} fill rounded="full" blendScreen className="ring-2 ring-black/70" />
        </div>
        <p className="font-serif text-[clamp(11px,2.8vw,14px)] text-[#dbe1ff]/90">{activeName}</p>
      </div>
    </div>
  );
}

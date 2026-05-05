import Link from "next/link";
import { AlertTriangle, Star } from "lucide-react";
import type { SoulDashboardData } from "@/lib/soul-dashboard";

type SoulDashboardProps = {
  data: SoulDashboardData;
  hasPremium: boolean;
};

function EnergyAreaChart({ points }: { points: SoulDashboardData["points"] }) {
  const width = 920;
  const height = 220;
  const padX = 20;
  const padY = 18;
  const chartWidth = width - padX * 2;
  const chartHeight = height - padY * 2;
  const maxScore = 100;
  const minScore = 0;
  const stepX = chartWidth / Math.max(points.length - 1, 1);
  const toY = (score: number) =>
    padY + chartHeight - ((score - minScore) / (maxScore - minScore)) * chartHeight;

  const line = points
    .map((p, idx) => `${padX + idx * stepX},${toY(p.score)}`)
    .join(" ");
  const area = `${padX},${height - padY} ${line} ${padX + chartWidth},${height - padY}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full" role="img" aria-label="Life Rhythm">
      <defs>
        <linearGradient id="mu-life-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f7e7ce" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#d9bb85" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="mu-life-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(247,231,206,0.42)" />
          <stop offset="100%" stopColor="rgba(247,231,206,0.04)" />
        </linearGradient>
      </defs>

      {[25, 50, 75].map((mark) => (
        <line
          key={mark}
          x1={padX}
          y1={toY(mark)}
          x2={padX + chartWidth}
          y2={toY(mark)}
          stroke="rgba(247,231,206,0.15)"
          strokeDasharray="4 6"
        />
      ))}

      <polygon points={area} fill="url(#mu-life-fill)" />
      <polyline points={line} fill="none" stroke="url(#mu-life-line)" strokeWidth="3.2" strokeLinecap="round" />
      {points.map((point, idx) => (
        <circle
          key={point.dateKey}
          cx={padX + idx * stepX}
          cy={toY(point.score)}
          r={idx === points.length - 1 ? 4.6 : 3.3}
          fill={idx === points.length - 1 ? "#f7e7ce" : "#e9d8b4"}
          opacity={idx === points.length - 1 ? 1 : 0.75}
        />
      ))}
    </svg>
  );
}

export default function SoulDashboard({ data, hasPremium }: SoulDashboardProps) {
  const points = data.points;
  const today = points[0];
  return (
    <section className="mu-lab-glass relative overflow-hidden rounded-3xl border border-[rgba(247,231,206,0.16)] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]/75">The Soul Dashboard</p>
          <h2 className="mt-2 font-serif text-2xl text-[#eef1ff] sm:text-3xl">Life Rhythm จากลักขณา {data.ascendantSign}</h2>
        </div>
        <p className="rounded-full border border-[rgba(247,231,206,0.24)] bg-[rgba(247,231,206,0.06)] px-3 py-1.5 text-xs text-[#dbe1ff]/82">
          พลังเฉลี่ย {data.windowDays} วัน · {data.averageScore}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4">
        <EnergyAreaChart points={points} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#dbe1ff]/62">Power Color</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-block h-5 w-5 rounded-full border border-white/15" style={{ background: today?.powerColor || "#f7e7ce" }} />
            <p className="text-lg font-semibold text-[#eef1ff]">{today?.powerColor ?? "#f7e7ce"}</p>
          </div>
        </article>
        <article className="rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#dbe1ff]/62">Auspicious Time</p>
          <p className="mt-2 text-lg font-semibold text-[#eef1ff]">{today?.auspiciousHours ?? "-"}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.45)] p-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#dbe1ff]/62">Lucky Number</p>
          <p className="mt-2 text-lg font-semibold text-[#eef1ff]">{today?.luckyNumber ?? "-"}</p>
        </article>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-[rgba(247,231,206,0.16)] bg-[rgba(247,231,206,0.04)] p-4">
          <div className="flex items-center gap-2 text-[var(--gold)]">
            <Star className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.14em]">วันเด่น</p>
          </div>
          <p className="mt-2 text-sm text-[#e8eeff]/88">
            {data.bestDay ? `${data.bestDay.label} · คะแนน ${data.bestDay.score}` : "-"}
          </p>
        </div>
        <div className="rounded-2xl border border-[rgba(247,231,206,0.16)] bg-[rgba(247,231,206,0.04)] p-4">
          <div className="flex items-center gap-2 text-amber-300">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.14em]">วันควรระวัง</p>
          </div>
          <p className="mt-2 text-sm text-[#e8eeff]/88">
            {data.cautionDay ? `${data.cautionDay.label} · คะแนน ${data.cautionDay.score}` : "-"}
          </p>
        </div>
      </div>

      {!hasPremium ? (
        <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-[rgba(4,9,22,0.72)] p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[rgba(247,231,206,0.28)] bg-[rgba(8,14,34,0.9)] p-5 text-center">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/82">VIP Only</p>
            <h3 className="mt-2 font-serif text-2xl text-[#eef1ff]">Unlock Soul Dashboard</h3>
            <p className="mt-2 text-sm text-[#dbe1ff]/82">
              ดูกราฟชีวิตเต็ม 30 วัน + ปฏิทินวันเด่น/วันระวัง + นาทีทองรายวันแบบไม่จำกัด
            </p>
            <Link
              href="/tracking"
              className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.42)] bg-[rgba(247,231,206,0.09)] px-5 py-2 text-sm font-semibold text-[var(--gold)] hover:bg-[rgba(247,231,206,0.15)]"
            >
              Subscribe to Unlock
            </Link>
          </div>
        </div>
      ) : null}
    </section>
  );
}


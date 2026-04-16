"use client";

import { FlaskConical, Infinity, Orbit, Sparkles } from "lucide-react";
import DailyEnergyGauges from "@/components/DailyEnergyGauges";
import { CelestialHeadingRow } from "@/components/CelestialIcon";
import type { DailyForecastPayload } from "@/lib/daily-forecast-data";
import { CELESTIAL_STROKE } from "@/lib/celestial-icon-tokens";

type Props = {
  data: DailyForecastPayload;
};

export default function DailyCosmicDashboard({ data }: Props) {
  const animateKey = `${data.dateKey}-${data.source}`;
  const hasLabNote = Boolean(data.labNote?.trim());
  const hasRitual = Boolean(data.ritualOfTheDay?.trim());
  const hasLuckyColor = Boolean(data.luckyColor?.trim());
  const hasLuckyItem = Boolean(data.luckyItem?.trim());
  const emptyStateText = "The stars are aligning, please check back in a moment.";

  return (
    <section
      className="mu-lab-glass col-span-12 rounded-[1.6rem] p-8 sm:rounded-[2rem] sm:p-10"
      aria-labelledby="daily-cosmic-heading"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CelestialHeadingRow icon={Orbit} orbitSlow className="sm:flex-1">
          <h2
            id="daily-cosmic-heading"
            className="font-serif text-xl font-medium tracking-tight text-[#ecfbf5] sm:text-2xl"
          >
            Cosmic Weather
          </h2>
        </CelestialHeadingRow>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#d9f2e9]/78">
          <time dateTime={data.dateKey}>วันที่ {data.dateKey}</time>
          <span>·</span>
          <span>Bangkok Time</span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${
              data.source === "fallback"
                ? "border-amber-200/60 bg-amber-100/10 text-amber-100"
                : "border-emerald-200/60 bg-emerald-100/10 text-emerald-100"
            }`}
          >
            {data.source === "fallback" ? "Snapshot" : "Live"}
          </span>
        </div>
      </div>

      <p className="mu-lab-glass mb-6 rounded-2xl px-6 py-4 text-base font-light leading-relaxed text-[#dbe1ff]">
        <span className="font-medium text-[var(--gold)]">Live Energy Reading:</span> {data.weatherTag}
      </p>

      <DailyEnergyGauges scores={data.scores} animateKey={animateKey} />

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <article className="mu-lab-glass rounded-2xl p-5 lg:col-span-2">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[var(--gold)]/75">
            <FlaskConical className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]" strokeWidth={CELESTIAL_STROKE} aria-hidden />
            Daily Lab Note
          </p>
          <p className="mt-1.5 text-base font-light text-[#d9f2e9]/92">{hasLabNote ? data.labNote : emptyStateText}</p>
        </article>
        <article className="mu-lab-glass rounded-2xl p-5">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[var(--gold)]/75">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]" strokeWidth={CELESTIAL_STROKE} aria-hidden />
            Ritual
          </p>
          <p className="mt-1.5 text-base font-light text-[#d9f2e9]/92">{hasRitual ? data.ritualOfTheDay : emptyStateText}</p>
        </article>
        <article className="mu-lab-glass rounded-2xl p-5">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-[var(--gold)]/75">
            <Infinity className="h-3.5 w-3.5 shrink-0 text-[var(--gold)]" strokeWidth={CELESTIAL_STROKE} aria-hidden />
            Lucky
          </p>
          <p className="mt-1.5 text-base font-light text-[#d9f2e9]/92">
            {hasLuckyColor ? data.luckyColor : "Silver Mist"} · {hasLuckyItem ? data.luckyItem : "Minimal silver accessory"}
          </p>
        </article>
      </div>
    </section>
  );
}

"use client";

import { FlaskConical, Infinity, Orbit, Sparkles } from "lucide-react";
import DailyEnergyGauges from "@/components/DailyEnergyGauges";
import { CelestialHeadingRow } from "@/components/CelestialIcon";
import type { DailyForecastPayload } from "@/lib/daily-forecast-data";
import { CELESTIAL_STROKE } from "@/lib/celestial-icon-tokens";

type Props = {
  data: DailyForecastPayload;
  compact?: boolean;
};

export default function DailyCosmicDashboard({ data, compact = false }: Props) {
  const animateKey = `${data.dateKey}-${data.source}`;
  const hasLabNote = Boolean(data.labNote?.trim());
  const hasRitual = Boolean(data.ritualOfTheDay?.trim());
  const hasLuckyColor = Boolean(data.luckyColor?.trim());
  const hasLuckyItem = Boolean(data.luckyItem?.trim());
  const emptyStateText = "The stars are aligning, please check back in a moment.";

  return (
    <section
      className={`col-span-12 rounded-[1.6rem] border border-[#72a5ff]/28 bg-[linear-gradient(150deg,rgba(16,28,64,0.93)_0%,rgba(12,20,46,0.93)_46%,rgba(10,16,36,0.92)_100%)] shadow-[0_26px_64px_rgba(10,18,44,0.46)] backdrop-blur-[13px] sm:rounded-[2rem] ${compact ? "p-5 sm:p-6" : "p-9 sm:p-12"}`}
      aria-labelledby="daily-cosmic-heading"
    >
      <div className={`flex min-w-0 ${compact ? "mb-4 flex-col gap-2" : "mb-9 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"}`}>
        <CelestialHeadingRow icon={Orbit} orbitSlow className="min-w-0 sm:min-w-0 sm:flex-1">
          <h2
            id="daily-cosmic-heading"
            className={`font-serif font-semibold tracking-tight text-[#f1f7ff] ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}
          >
            Cosmic Weather
          </h2>
        </CelestialHeadingRow>
        {!compact ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-[#d9f2e9]/78">
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
        ) : (
          <div className="w-full rounded-xl border border-[#7cb6ff]/20 bg-[rgba(10,18,42,0.48)] px-3 py-2 text-xs text-[#d9f2e9]/80">
            <span>วันที่ {data.dateKey}</span>
            <span className="mx-2">·</span>
            <span>Bangkok Time</span>
            <span className="mx-2">·</span>
            <span className={data.source === "fallback" ? "text-amber-200" : "text-emerald-200"}>
              {data.source === "fallback" ? "SNAPSHOT" : "LIVE"}
            </span>
          </div>
        )}
      </div>

      <p className={`rounded-2xl border border-[#7cb6ff]/32 bg-[linear-gradient(120deg,rgba(51,93,175,0.3)_0%,rgba(59,122,216,0.18)_48%,rgba(34,72,144,0.18)_100%)] leading-relaxed text-[#e8efff] shadow-[inset_0_1px_0_rgba(180,216,255,0.2)] ${compact ? "mb-4 px-4 py-3 text-sm" : "mb-8 px-6 py-4 text-base sm:py-5"}`}>
        <span className={`font-bold tracking-wide text-[#bdddff] ${compact ? "text-sm" : "text-base sm:text-lg"}`}>Live Energy Reading:</span>{" "}
        <span className="font-semibold">{data.weatherTag}</span>
      </p>

      <DailyEnergyGauges scores={data.scores} animateKey={animateKey} compact={compact} />

      <div className={`grid ${compact ? "grid-cols-1 mt-5 gap-3" : "lg:grid-cols-4 mt-8 gap-5"}`}>
        <article
          className={`rounded-2xl border border-[#9ad4ff]/30 bg-[linear-gradient(135deg,rgba(42,89,176,0.34)_0%,rgba(22,44,95,0.3)_100%)] shadow-[0_16px_38px_rgba(16,38,80,0.36)] ${
            compact ? "p-4" : "p-6 lg:col-span-2"
          }`}
        >
          <p className={`flex items-center gap-2 font-bold uppercase tracking-[0.12em] text-[#c9e6ff] ${compact ? "text-xs" : "text-base"}`}>
            <FlaskConical className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4 sm:h-5 sm:w-5"} shrink-0 text-[var(--gold)]`} strokeWidth={CELESTIAL_STROKE} aria-hidden />
            Daily Lab Note
          </p>
          <p className={`${compact ? "mt-2 text-sm" : "mt-3 text-[1.05rem]"} leading-relaxed text-[#eef5ff]`}>{hasLabNote ? data.labNote : emptyStateText}</p>
        </article>
        <article className={`rounded-2xl border border-[#b68cff]/30 bg-[linear-gradient(135deg,rgba(110,59,170,0.32)_0%,rgba(58,33,96,0.3)_100%)] shadow-[0_16px_38px_rgba(50,22,90,0.34)] ${compact ? "p-4" : "p-6"}`}>
          <p className={`flex items-center gap-2 font-bold uppercase tracking-[0.12em] text-[#e1ccff] ${compact ? "text-xs" : "text-base"}`}>
            <Sparkles className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4 sm:h-5 sm:w-5"} shrink-0 text-[var(--gold)]`} strokeWidth={CELESTIAL_STROKE} aria-hidden />
            Ritual
          </p>
          <p className={`${compact ? "mt-2 text-sm" : "mt-3 text-[1.05rem]"} leading-relaxed text-[#f1e9ff]`}>{hasRitual ? data.ritualOfTheDay : emptyStateText}</p>
        </article>
        <article className={`rounded-2xl border border-[#85d8cf]/32 bg-[linear-gradient(135deg,rgba(34,119,115,0.3)_0%,rgba(18,68,73,0.28)_100%)] shadow-[0_16px_38px_rgba(14,64,66,0.32)] ${compact ? "p-4" : "p-6"}`}>
          <p className={`flex items-center gap-2 font-bold uppercase tracking-[0.12em] text-[#c8fff5] ${compact ? "text-xs" : "text-base"}`}>
            <Infinity className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4 sm:h-5 sm:w-5"} shrink-0 text-[var(--gold)]`} strokeWidth={CELESTIAL_STROKE} aria-hidden />
            Lucky
          </p>
          <p className={`${compact ? "mt-2 text-sm" : "mt-3 text-[1.05rem]"} leading-relaxed text-[#e8fffb]`}>
            {hasLuckyColor ? data.luckyColor : "Silver Mist"} · {hasLuckyItem ? data.luckyItem : "Minimal silver accessory"}
          </p>
        </article>
      </div>
    </section>
  );
}

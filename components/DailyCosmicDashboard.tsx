import type { DailyForecastPayload } from "@/lib/daily-forecast-data";
import DailyEnergyGauges from "@/components/DailyEnergyGauges";

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
      className={`col-span-12 rounded-[1.35rem] border border-[rgba(247,231,206,0.14)] bg-white/[0.035] p-6 shadow-[0_0_0_1px_rgba(247,231,206,0.05)_inset,0_32px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:rounded-3xl sm:p-8`}
      aria-labelledby="daily-cosmic-heading"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-emerald-400/90">
              Live Energy Reading
            </p>
          </div>
          <h2
            id="daily-cosmic-heading"
            className="mt-3 font-serif text-xl font-light tracking-tight text-white sm:text-2xl"
          >
            Cosmic Weather · พยากรณ์พลังงานวันนี้
          </h2>
          <p className="mt-1 text-[11px] font-light text-zinc-500">
            <time dateTime={data.dateKey}>วันที่ {data.dateKey}</time>
            <span className="mx-2 text-zinc-700">·</span>
            เขตเวลา กรุงเทพฯ
          </p>
        </div>
        {data.source === "fallback" ? (
          <span className="shrink-0 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[10px] font-light uppercase tracking-wider text-amber-200/90">
            Offline snapshot
          </span>
        ) : (
          <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-light uppercase tracking-wider text-emerald-200/90">
            Synced lab
          </span>
        )}
      </div>

      <p className="mb-6 rounded-2xl border border-[rgba(247,231,206,0.08)] bg-[rgba(247,231,206,0.04)] px-4 py-3 text-sm font-light leading-relaxed text-zinc-200 sm:text-[15px]">
        <span className="text-[var(--gold)]/95">อุณหภูมิพลังงานวันนี้:</span> {data.weatherTag}
      </p>

      <DailyEnergyGauges scores={data.scores} animateKey={animateKey} />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-[rgba(247,231,206,0.1)] bg-black/15 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--gold)]/80">
            Daily Lab Note
          </h3>
          <p className="mt-3 text-[13px] font-light leading-relaxed text-zinc-300 sm:text-sm">
            {hasLabNote ? data.labNote : emptyStateText}
          </p>
        </article>

        <div className="flex flex-col gap-4">
          <article className="rounded-2xl border border-[rgba(247,231,206,0.1)] bg-black/15 p-5">
            <h3 className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--gold)]/80">
              Ritual of the Day
            </h3>
            <p className="mt-3 text-[13px] font-light leading-relaxed text-zinc-300 sm:text-sm">
              {hasRitual ? data.ritualOfTheDay : emptyStateText}
            </p>
          </article>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[rgba(247,231,206,0.1)] bg-black/20 p-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Lucky color
              </p>
              <p className="mt-2 text-sm font-light text-[var(--gold)]">
                {hasLuckyColor ? data.luckyColor : "Silver Mist"}
              </p>
            </div>
            <div className="rounded-2xl border border-[rgba(247,231,206,0.1)] bg-black/20 p-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Lucky item
              </p>
              <p className="mt-2 text-sm font-light text-zinc-200">
                {hasLuckyItem ? data.luckyItem : "Minimal silver accessory"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

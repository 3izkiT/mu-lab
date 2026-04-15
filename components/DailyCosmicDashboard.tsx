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
      className="col-span-12 rounded-[1.35rem] border border-[rgba(247,231,206,0.45)] bg-[#08271f]/82 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-3xl sm:p-6"
      aria-labelledby="daily-cosmic-heading"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="daily-cosmic-heading"
          className="font-serif text-xl font-medium tracking-tight text-[#ecfbf5] sm:text-2xl"
        >
          Cosmic Weather
        </h2>
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

      <p className="mb-4 rounded-2xl border border-[rgba(247,231,206,0.4)] bg-[#0a2a22] px-4 py-3 text-base font-light leading-relaxed text-[#d9f2e9]">
        <span className="font-medium text-[var(--gold)]">Live Energy Reading:</span> {data.weatherTag}
      </p>

      <DailyEnergyGauges scores={data.scores} animateKey={animateKey} />

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <article className="rounded-2xl border border-[rgba(247,231,206,0.36)] bg-[#0a2a22] p-3 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--gold)]/75">Daily Lab Note</p>
          <p className="mt-1.5 text-base font-light text-[#d9f2e9]/92">{hasLabNote ? data.labNote : emptyStateText}</p>
        </article>
        <article className="rounded-2xl border border-[rgba(247,231,206,0.36)] bg-[#0a2a22] p-3">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--gold)]/75">Ritual</p>
          <p className="mt-1.5 text-base font-light text-[#d9f2e9]/92">{hasRitual ? data.ritualOfTheDay : emptyStateText}</p>
        </article>
        <article className="rounded-2xl border border-[rgba(247,231,206,0.36)] bg-[#0a2a22] p-3">
          <p className="text-xs uppercase tracking-[0.1em] text-[var(--gold)]/75">Lucky</p>
          <p className="mt-1.5 text-base font-light text-[#d9f2e9]/92">
            {hasLuckyColor ? data.luckyColor : "Silver Mist"} · {hasLuckyItem ? data.luckyItem : "Minimal silver accessory"}
          </p>
        </article>
      </div>
    </section>
  );
}

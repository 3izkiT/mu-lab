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
      className={`col-span-12 rounded-[1.35rem] border border-[rgba(247,231,206,0.62)] bg-white/80 p-5 shadow-[0_18px_44px_rgba(26,35,126,0.09)] backdrop-blur-xl sm:rounded-3xl sm:p-6`}
      aria-labelledby="daily-cosmic-heading"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="daily-cosmic-heading"
          className="font-serif text-xl font-medium tracking-tight text-[#1a237e] sm:text-2xl"
        >
          Cosmic Weather
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#1a237e]/75">
          <time dateTime={data.dateKey}>วันที่ {data.dateKey}</time>
          <span>·</span>
          <span>Bangkok Time</span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${
              data.source === "fallback"
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-emerald-300 bg-emerald-50 text-emerald-700"
            }`}
          >
            {data.source === "fallback" ? "Snapshot" : "Live"}
          </span>
        </div>
      </div>

      <p className="mb-4 rounded-2xl border border-[rgba(247,231,206,0.42)] bg-[#fffaf2] px-4 py-3 text-base font-light leading-relaxed text-[#1a237e]">
        <span className="font-medium text-[#1a237e]">Live Energy Reading:</span> {data.weatherTag}
      </p>

      <DailyEnergyGauges scores={data.scores} animateKey={animateKey} />

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <article className="rounded-2xl border border-[rgba(247,231,206,0.42)] bg-white/90 p-3 lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.1em] text-[#1a237e]/65">Daily Lab Note</p>
          <p className="mt-1.5 text-base font-light text-[#1a237e]/92">{hasLabNote ? data.labNote : emptyStateText}</p>
        </article>
        <article className="rounded-2xl border border-[rgba(247,231,206,0.42)] bg-white/90 p-3">
          <p className="text-xs uppercase tracking-[0.1em] text-[#1a237e]/65">Ritual</p>
          <p className="mt-1.5 text-base font-light text-[#1a237e]/92">{hasRitual ? data.ritualOfTheDay : emptyStateText}</p>
        </article>
        <article className="rounded-2xl border border-[rgba(247,231,206,0.42)] bg-white/90 p-3">
          <p className="text-xs uppercase tracking-[0.1em] text-[#1a237e]/65">Lucky</p>
          <p className="mt-1.5 text-base font-light text-[#1a237e]/92">
            {hasLuckyColor ? data.luckyColor : "Silver Mist"} · {hasLuckyItem ? data.luckyItem : "Minimal silver accessory"}
          </p>
        </article>
      </div>
    </section>
  );
}

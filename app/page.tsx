import DailyCosmicDashboard from "@/components/DailyCosmicDashboard";
import FortuneForm from "@/components/FortuneForm";
import { getDailyForecast } from "@/lib/daily-forecast-data";
import Link from "next/link";

const goldBorder = "border border-[rgba(247,231,206,0.14)]";

/** หน้าแรกดึงพยากรณ์รายวันแบบแคช — เนื้อหาเปลี่ยนตามวันในเขต กรุงเทพฯ */
export const revalidate = 3600;

export default async function Home() {
  const daily = await getDailyForecast();

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Deep cosmic blue → midnight purple */}
      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(165deg,#0a1628_0%,#121528_28%,#1a1032_58%,#0d0818_88%,#050308_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(110%_70%_at_50%_-5%,rgba(56,90,140,0.4)_0%,rgba(18,22,48,0.85)_45%,transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(80%_55%_at_100%_0%,rgba(88,48,120,0.22)_0%,transparent_50%)]"
        aria-hidden
      />
      {/* Star field */}
      <div className="pointer-events-none fixed inset-0 mu-lab-starfield" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          <DailyCosmicDashboard data={daily} />

          <header
            className={`col-span-12 flex flex-col justify-between rounded-[1.35rem] ${goldBorder} bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(247,231,206,0.04)_inset,0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-3xl sm:p-8 lg:col-span-7 lg:min-h-[280px] lg:p-10`}
          >
            <div>
              <p className="text-[10px] font-light uppercase tracking-[0.38em] text-zinc-500 sm:text-[11px]">
                Mu-Lab Analysis
              </p>
              <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,3.75rem)] font-light leading-[1.05] tracking-[-0.03em] text-white">
                Mu-Lab
              </h1>
              <p className="mt-5 max-w-md text-[13px] font-light leading-relaxed tracking-wide text-zinc-400 sm:text-sm">
                ไขรหัสชีวิตรายบุคคล — ห้องทดลองโหราศาสตร์ยุคใหม่
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <span
                className={`rounded-full ${goldBorder} bg-white/[0.03] px-3 py-1 text-[10px] font-light uppercase tracking-wider text-zinc-500`}
              >
                ลักขณา
              </span>
              <span
                className={`rounded-full ${goldBorder} bg-white/[0.03] px-3 py-1 text-[10px] font-light uppercase tracking-wider text-zinc-500`}
              >
                Personal chart
              </span>
              <span className="rounded-full border border-[rgba(247,231,206,0.24)] bg-[rgba(247,231,206,0.06)] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--gold)]">
                Signature
              </span>
            </div>
          </header>

          <aside className="col-span-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:col-span-5 lg:grid-cols-1 lg:grid-rows-2">
            <div
              className={`rounded-[1.35rem] ${goldBorder} bg-gradient-to-br from-white/[0.06] to-transparent p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:rounded-3xl sm:p-6`}
            >
              <p className="text-[10px] font-light uppercase tracking-[0.3em] text-zinc-500">Experience</p>
              <p className="mt-3 text-sm font-light leading-relaxed text-zinc-300">
                ดีไซน์เงียบ ละเอียด — เน้นข้อมูลที่อ่านง่ายและลงมือทำได้จริง
              </p>
            </div>
            <div
              className={`rounded-[1.35rem] ${goldBorder} bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(247,231,206,0.05),inset_0_0_40px_rgba(80,60,120,0.06)] backdrop-blur-2xl sm:rounded-3xl sm:p-6`}
            >
              <p className="text-[10px] font-light uppercase tracking-[0.3em] text-zinc-500">Privacy</p>
              <p className="mt-3 text-sm font-light leading-relaxed text-zinc-400">
                ข้อมูลของคุณใช้เพื่อการวิเคราะห์เท่านั้น ไม่แสดงต่อสาธารณะ
              </p>
            </div>
          </aside>

          <div className="col-span-12 lg:col-span-8">
            <FortuneForm />
          </div>
          <div className="col-span-12 hidden lg:col-span-4 lg:block">
            <div
              className={`sticky top-24 rounded-[1.35rem] ${goldBorder} bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(247,231,206,0.04)] backdrop-blur-2xl`}
            >
              <p className="text-[10px] font-light uppercase tracking-[0.35em] text-zinc-600">Note</p>
              <p className="mt-4 text-xs font-light leading-relaxed text-zinc-500">
                กรอกเวลาเกิดให้ใกล้เคียงที่สุด ช่วยให้การประเมินลักขณาแม่นขึ้น
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 mx-auto mt-2 max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div
          className={`rounded-[1.35rem] ${goldBorder} bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(247,231,206,0.03)] backdrop-blur-2xl sm:rounded-3xl sm:p-8`}
        >
          <p className="text-[10px] font-light uppercase tracking-[0.32em] text-zinc-600">About Mu-Lab</p>
          <div className="mt-4 space-y-4 text-sm font-light leading-relaxed text-zinc-400">
            <p className="font-serif">
              Mu-Lab is a Quantum-Astrology Laboratory based in Nakhon Si Thammarat, Thailand,
              combining ancient wisdom with generative AI logic to translate cosmic motion into clear
              daily guidance.
            </p>
            <p className="font-serif">
              We design every reading around three values: Precision, Modernity, and Individual
              Insight, so each recommendation feels refined, relevant, and grounded in both tradition
              and contemporary analysis.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/the-science-behind-mu-lab"
              className={`rounded-full ${goldBorder} bg-white/[0.04] px-4 py-1.5 text-xs font-light tracking-wide text-zinc-400 transition hover:bg-white/[0.06]`}
            >
              The Science Behind Mu-Lab
            </Link>
            <Link
              href="/terms"
              className={`rounded-full ${goldBorder} bg-white/[0.04] px-4 py-1.5 text-xs font-light tracking-wide text-zinc-400 transition hover:bg-white/[0.06]`}
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className={`rounded-full ${goldBorder} bg-white/[0.04] px-4 py-1.5 text-xs font-light tracking-wide text-zinc-400 transition hover:bg-white/[0.06]`}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

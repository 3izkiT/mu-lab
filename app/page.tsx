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
      {/* Luxury light base: white-forward with subtle cosmic tint */}
      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(165deg,#fbfdff_0%,#f5f8ff_36%,#eef3ff_68%,#e9eefc_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(120%_80%_at_50%_-8%,rgba(90,130,200,0.18)_0%,rgba(239,244,255,0.7)_48%,transparent_76%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(70%_55%_at_100%_0%,rgba(200,170,120,0.14)_0%,transparent_56%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        {/* HERO */}
        <section className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          <header
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.72] p-6 shadow-[0_0_0_1px_rgba(247,231,206,0.18)_inset,0_28px_70px_rgba(63,91,148,0.14)] backdrop-blur-xl sm:rounded-3xl sm:p-8`}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.38em] text-zinc-500/80 sm:text-[11px]">
              Mu-Lab Analysis
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.3rem,5.2vw,3.6rem)] font-light leading-[1.06] tracking-[-0.03em] text-[#162238]">
              Mu-Lab
            </h1>
            <p className="mt-5 max-w-2xl text-[13px] font-light leading-relaxed tracking-wide text-slate-600 sm:text-sm">
              ไขรหัสชีวิตรายบุคคลในไม่กี่นาที จากวันเวลาเกิดและพลังงานรายวันแบบพรีเมียม
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="#fortune-form"
                className="rounded-full border border-[rgba(247,231,206,0.3)] bg-[rgba(247,231,206,0.14)] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.2)]"
              >
                Reveal My Fate
              </Link>
              <Link
                href="/the-science-behind-mu-lab"
                className={`rounded-full ${goldBorder} bg-transparent px-4 py-2 text-xs font-light tracking-[0.08em] text-slate-700 transition hover:bg-white/60`}
              >
                「 เจาะลึกกลไกของห้องทดลอง 」 (Explore our Science)
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              <span
                className={`rounded-full ${goldBorder} bg-white/70 px-3 py-1 text-[10px] font-light uppercase tracking-wider text-slate-600`}
              >
                ลักขณา
              </span>
              <span
                className={`rounded-full ${goldBorder} bg-white/70 px-3 py-1 text-[10px] font-light uppercase tracking-wider text-slate-600`}
              >
                Personal chart
              </span>
              <span className="rounded-full border border-[rgba(247,231,206,0.24)] bg-[rgba(247,231,206,0.06)] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[var(--gold)]">
                Signature
              </span>
            </div>
          </header>

          <div
            id="fortune-form"
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.74] p-2 shadow-[0_26px_70px_rgba(63,91,148,0.14)] sm:rounded-3xl sm:p-3`}
          >
            <FortuneForm />
          </div>
        </section>

        {/* SECONDARY */}
        <section className="mt-4">
          <DailyCosmicDashboard data={daily} />
        </section>

        {/* SUPPORTING */}
        <section className="mt-4 grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          <div
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.66] p-5 shadow-[0_16px_42px_rgba(63,91,148,0.12)] backdrop-blur-xl sm:rounded-3xl sm:p-6 lg:col-span-4`}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.3em] text-zinc-500">Experience</p>
            <p className="mt-3 text-sm font-light leading-relaxed text-slate-600">
              ดีไซน์เงียบ ละเอียด — เน้นข้อมูลที่อ่านง่ายและลงมือทำได้จริง
            </p>
          </div>
          <div
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.66] p-5 shadow-[0_16px_42px_rgba(63,91,148,0.12)] backdrop-blur-xl sm:rounded-3xl sm:p-6 lg:col-span-4`}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.3em] text-zinc-500">Privacy</p>
            <p className="mt-3 text-sm font-light leading-relaxed text-slate-600">
              ข้อมูลของคุณใช้เพื่อการวิเคราะห์เท่านั้น ไม่แสดงต่อสาธารณะ
            </p>
          </div>
          <div
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.66] p-5 shadow-[0_16px_42px_rgba(63,91,148,0.12)] backdrop-blur-xl sm:rounded-3xl sm:p-6 lg:col-span-4`}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.35em] text-zinc-600">Next Read</p>
            <p className="mt-3 text-sm font-light leading-relaxed text-slate-600">
              เข้าใจหลักคิดของระบบก่อนอ่านคำพยากรณ์เชิงลึก
            </p>
            <Link
              href="/the-science-behind-mu-lab"
              className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.3)] bg-white/70 px-3 py-1.5 text-[11px] font-light tracking-wide text-slate-700 transition hover:bg-white"
            >
              Explore Science
            </Link>
          </div>
        </section>
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

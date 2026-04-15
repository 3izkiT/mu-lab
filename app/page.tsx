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
        {/* HERO: สิ่งที่สำคัญที่สุดต้องเห็นก่อน (ข้อความหลัก + ฟอร์ม) */}
        <section className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          <header
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(247,231,206,0.04)_inset,0_40px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:rounded-3xl sm:p-8 lg:col-span-5 lg:p-9`}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.38em] text-zinc-500 sm:text-[11px]">
              Mu-Lab Analysis
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.3rem,5.2vw,3.3rem)] font-light leading-[1.06] tracking-[-0.03em] text-white">
              Mu-Lab
            </h1>
            <p className="mt-5 max-w-md text-[13px] font-light leading-relaxed tracking-wide text-zinc-400 sm:text-sm">
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
                className={`rounded-full ${goldBorder} bg-transparent px-4 py-2 text-xs font-light tracking-[0.08em] text-zinc-300 transition hover:bg-white/[0.05]`}
              >
                「 เจาะลึกกลไกของห้องทดลอง 」 (Explore our Science)
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
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

          <div id="fortune-form" className="col-span-12 lg:col-span-7">
            <FortuneForm />
          </div>
        </section>

        {/* SECONDARY: ส่วนช่วยตัดสินใจก่อนกดวิเคราะห์ */}
        <section className="mt-4">
          <DailyCosmicDashboard data={daily} />
        </section>

        {/* SUPPORTING: ส่วนเสริมความน่าเชื่อถือ/การอ่านต่อ */}
        <section className="mt-4 grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          <div
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-gradient-to-br from-white/[0.06] to-transparent p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:rounded-3xl sm:p-6 lg:col-span-4`}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.3em] text-zinc-500">Experience</p>
            <p className="mt-3 text-sm font-light leading-relaxed text-zinc-300">
              ดีไซน์เงียบ ละเอียด — เน้นข้อมูลที่อ่านง่ายและลงมือทำได้จริง
            </p>
          </div>
          <div
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(247,231,206,0.05),inset_0_0_40px_rgba(80,60,120,0.06)] backdrop-blur-2xl sm:rounded-3xl sm:p-6 lg:col-span-4`}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.3em] text-zinc-500">Privacy</p>
            <p className="mt-3 text-sm font-light leading-relaxed text-zinc-400">
              ข้อมูลของคุณใช้เพื่อการวิเคราะห์เท่านั้น ไม่แสดงต่อสาธารณะ
            </p>
          </div>
          <div
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(247,231,206,0.04)] backdrop-blur-2xl sm:rounded-3xl sm:p-6 lg:col-span-4`}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.35em] text-zinc-600">Next Read</p>
            <p className="mt-3 text-sm font-light leading-relaxed text-zinc-500">
              เข้าใจหลักคิดของระบบก่อนอ่านคำพยากรณ์เชิงลึก
            </p>
            <Link
              href="/the-science-behind-mu-lab"
              className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.22)] px-3 py-1.5 text-[11px] font-light tracking-wide text-zinc-300 transition hover:bg-white/[0.05]"
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

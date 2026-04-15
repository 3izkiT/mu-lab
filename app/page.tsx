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
      <header className="sticky top-0 z-30 border-b border-[rgba(247,231,206,0.2)] bg-white/[0.75] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <p className="font-serif text-lg tracking-tight text-[#162238]">Mu-Lab</p>
          <nav className="hidden items-center gap-2 sm:flex">
            <Link
              href="#fortune-form"
              className="rounded-full border border-[rgba(247,231,206,0.28)] px-3 py-1.5 text-xs text-slate-700 transition hover:bg-white"
            >
              ดูดวงทันที
            </Link>
            <Link
              href="#services"
              className="rounded-full border border-[rgba(247,231,206,0.28)] px-3 py-1.5 text-xs text-slate-700 transition hover:bg-white"
            >
              บริการและแพ็กเกจ
            </Link>
            <Link
              href="#about"
              className="rounded-full border border-[rgba(247,231,206,0.28)] px-3 py-1.5 text-xs text-slate-700 transition hover:bg-white"
            >
              เกี่ยวกับ Mu-Lab
            </Link>
            <Link
              href="#fortune-form"
              className="rounded-full border border-[rgba(247,231,206,0.35)] bg-[rgba(247,231,206,0.2)] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.1em] text-[#6b4e12] transition hover:bg-[rgba(247,231,206,0.3)]"
            >
              เริ่มวิเคราะห์
            </Link>
          </nav>
        </div>
      </header>

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
      <div className="pointer-events-none fixed inset-0 mu-lab-starfield" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        {/* HERO */}
        <section className="grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          <header
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.72] p-6 shadow-[0_0_0_1px_rgba(247,231,206,0.18)_inset,0_28px_70px_rgba(63,91,148,0.14)] backdrop-blur-xl sm:rounded-3xl sm:p-8 lg:col-span-6`}
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
                className="rounded-full border border-[rgba(247,231,206,0.6)] bg-[rgba(247,231,206,0.42)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#1a237e] transition hover:bg-[rgba(247,231,206,0.62)]"
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
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.74] p-2 shadow-[0_26px_70px_rgba(63,91,148,0.14)] sm:rounded-3xl sm:p-3 lg:col-span-6`}
          >
            <FortuneForm />
          </div>
        </section>

        {/* SECONDARY */}
        <section className="mt-4">
          <DailyCosmicDashboard data={daily} />
        </section>

        <section className="mt-4 rounded-[1.35rem] border border-[rgba(247,231,206,0.55)] bg-white/82 p-6 shadow-[0_18px_44px_rgba(26,35,126,0.08)] sm:rounded-3xl sm:p-8">
          <h2 className="font-serif text-2xl text-[#1a237e] sm:text-3xl">Why Mu-Lab</h2>
          <p className="mt-3 max-w-3xl text-sm font-light leading-relaxed text-[#1a237e]/80">
            เราแปลงโหราศาสตร์ให้เป็นระบบคิดที่ใช้ตัดสินใจได้จริง ไม่ใช่แค่อ่านแล้วผ่านไป
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[rgba(247,231,206,0.55)] bg-white p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a237e]/62">Precision</p>
              <p className="mt-2 text-sm text-[#1a237e]/88">อ่านพื้นข้อมูลเกิดแบบเฉพาะบุคคล</p>
            </div>
            <div className="rounded-2xl border border-[rgba(247,231,206,0.55)] bg-white p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a237e]/62">Clarity</p>
              <p className="mt-2 text-sm text-[#1a237e]/88">มี Daily Dashboard ให้เช็คทุกเช้าในหน้าเดียว</p>
            </div>
            <div className="rounded-2xl border border-[rgba(247,231,206,0.55)] bg-white p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1a237e]/62">Action</p>
              <p className="mt-2 text-sm text-[#1a237e]/88">สรุปผลเป็นคำแนะนำที่ลงมือทำได้ทันที</p>
            </div>
          </div>
        </section>

        {/* MONEY SECTION: บริการที่แปลงเป็นรายได้ */}
        <section id="services" className="mt-4 grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          <div
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-white/[0.78] p-6 shadow-[0_18px_44px_rgba(63,91,148,0.12)] sm:rounded-3xl sm:p-8`}
          >
            <p className="text-[10px] font-light uppercase tracking-[0.32em] text-zinc-600">
              Services & Offers
            </p>
            <h2 className="mt-3 font-serif text-2xl font-light tracking-tight text-[#162238] sm:text-3xl">
              เลือกบริการดูดวงที่เหมาะกับจังหวะชีวิตคุณ
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-slate-600">
              ออกแบบเป็นขั้น: เริ่มจาก Quick Reading เพื่อเห็นภาพรวม แล้วค่อยขยับเป็นโหมดลึกเพื่อการตัดสินใจเรื่องสำคัญ
            </p>

            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              <article className="rounded-2xl border border-[rgba(247,231,206,0.24)] bg-white/80 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Starter</p>
                <h3 className="mt-2 font-serif text-xl text-[#162238]">Quick Reading</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-slate-600">
                  วิเคราะห์พื้นดวงและคำแนะนำรายวันสำหรับการตัดสินใจทันที
                </p>
                <Link
                  href="#fortune-form"
                  className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.34)] bg-white px-4 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-[rgba(247,231,206,0.18)]"
                >
                  เริ่มใช้ฟรี
                </Link>
              </article>

              <article className="rounded-2xl border border-[rgba(247,231,206,0.3)] bg-[rgba(247,231,206,0.2)] p-5 shadow-[0_10px_25px_rgba(247,231,206,0.2)]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#7a5a1f]">Most Popular</p>
                <h3 className="mt-2 font-serif text-xl text-[#162238]">Deep Insight Session</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-slate-700">
                  เจาะลึกงาน เงิน ความรัก พร้อมแผน 30 วันแบบลงมือทำได้จริง
                </p>
                <Link
                  href="#fortune-form"
                  className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.4)] bg-white px-4 py-1.5 text-xs font-semibold text-[#6b4e12] transition hover:bg-[rgba(247,231,206,0.25)]"
                >
                  ปลดล็อกโหมดลึก
                </Link>
              </article>

              <article className="rounded-2xl border border-[rgba(247,231,206,0.24)] bg-white/80 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Premium</p>
                <h3 className="mt-2 font-serif text-xl text-[#162238]">VIP Guidance</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-slate-600">
                  วิเคราะห์เชิงกลยุทธ์รายเดือนสำหรับช่วงเปลี่ยนงาน ลงทุน หรือความสัมพันธ์
                </p>
                <Link
                  href="#fortune-form"
                  className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.34)] bg-white px-4 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-[rgba(247,231,206,0.18)]"
                >
                  รับคำแนะนำพรีเมียม
                </Link>
              </article>
            </div>
          </div>
        </section>
      </div>

      <footer id="about" className="relative z-10 mx-auto mt-2 max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div
          className={`rounded-[1.35rem] ${goldBorder} bg-white/82 p-6 shadow-[0_16px_42px_rgba(26,35,126,0.08)] backdrop-blur-xl sm:rounded-3xl sm:p-8`}
        >
          <p className="text-[10px] font-light uppercase tracking-[0.32em] text-zinc-600">About Mu-Lab</p>
          <div className="mt-4 space-y-4 text-sm font-light leading-relaxed text-[#1a237e]/80">
            <p className="font-serif">
              Mu-Lab เริ่มจากคำถามง่าย ๆ ว่า “ทำไมคำทำนายต้องคลุมเครือ?” เราจึงสร้างพื้นที่ที่แปลงภาษาดวงดาวให้เป็นภาษาชีวิตจริง
              ให้คุณมองเห็นจังหวะที่ควรเดินหน้า ชะลอ หรือเปลี่ยนเกมอย่างมั่นใจ
            </p>
            <p className="font-serif">
              ทุกคำแนะนำถูกออกแบบเหมือนแผนที่ส่วนตัว: ละเอียดพอจะใช้ตัดสินใจ และนุ่มพอจะไม่ทำให้คุณหลงทาง
              เพราะสำหรับเรา ดวงที่ดีไม่ใช่ดวงที่ฟังแล้วว้าว แต่คือดวงที่อ่านแล้ว “ใช้ได้จริง” ในวันพรุ่งนี้
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/the-science-behind-mu-lab"
              className={`rounded-full ${goldBorder} bg-white px-4 py-1.5 text-xs font-light tracking-wide text-[#1a237e]/80 transition hover:bg-[#fffaf2]`}
            >
              The Science Behind Mu-Lab
            </Link>
            <Link
              href="/terms"
              className={`rounded-full ${goldBorder} bg-white px-4 py-1.5 text-xs font-light tracking-wide text-[#1a237e]/80 transition hover:bg-[#fffaf2]`}
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className={`rounded-full ${goldBorder} bg-white px-4 py-1.5 text-xs font-light tracking-wide text-[#1a237e]/80 transition hover:bg-[#fffaf2]`}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

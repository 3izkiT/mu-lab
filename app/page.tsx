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
      <header className="sticky top-0 z-30 border-b border-[rgba(247,231,206,0.18)] bg-[#070d22]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <p className="font-serif text-xl tracking-tight text-[var(--gold)]">Mu-Lab</p>
          <nav className="hidden items-center gap-2 sm:flex">
            <Link
              href="#fortune-form"
              className="rounded-full border border-[rgba(247,231,206,0.24)] px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-white/[0.07]"
            >
              ดูดวงทันที
            </Link>
            <Link
              href="#services"
              className="rounded-full border border-[rgba(247,231,206,0.24)] px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-white/[0.07]"
            >
              บริการและแพ็กเกจ
            </Link>
            <Link
              href="#about"
              className="rounded-full border border-[rgba(247,231,206,0.24)] px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-white/[0.07]"
            >
              เกี่ยวกับ Mu-Lab
            </Link>
            <Link
              href="#fortune-form"
              className="rounded-full border border-[rgba(247,231,206,0.45)] bg-[rgba(247,231,206,0.18)] px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.28)]"
            >
              เริ่มวิเคราะห์
            </Link>
          </nav>
        </div>
      </header>

      {/* Deep cosmic cinematic background */}
      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(165deg,#081022_0%,#0a1128_35%,#0b1431_70%,#081229_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(85%_70%_at_50%_12%,rgba(120,170,255,0.25)_0%,transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(70%_50%_at_96%_0%,rgba(247,231,206,0.15)_0%,transparent_58%)]"
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 mu-lab-starfield" aria-hidden />
      <div className="pointer-events-none fixed inset-0 mu-lab-blueprint" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
        {/* HERO */}
        <section className="relative grid grid-cols-12 gap-3 overflow-hidden rounded-[1.6rem] border border-[rgba(247,231,206,0.28)] bg-[#0a122c]/80 p-4 shadow-[0_36px_80px_rgba(0,0,0,0.45)] sm:gap-4 sm:p-6 lg:gap-5 lg:p-8">
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-85"
            style={{ backgroundImage: "url('/hero-nebula.png')" }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,25,0.84)_0%,rgba(7,11,25,0.66)_48%,rgba(7,11,25,0.45)_100%)]" />
          <header
            className={`relative col-span-12 rounded-[1.35rem] ${goldBorder} bg-[#08142f]/58 p-6 shadow-[0_0_0_1px_rgba(247,231,206,0.15)_inset,0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-3xl sm:p-8 lg:col-span-6`}
          >
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--gold)]/85">
              Possibilities At The Dawn Of Fate
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.3rem,5.2vw,3.9rem)] font-light leading-[1.04] tracking-[-0.03em] text-[#f3f7ff]">
              Ancient Wisdom,
              <br />
              <span className="text-[var(--gold)]">Future Precision</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base font-light leading-relaxed tracking-normal text-[#d8e2ff]/88">
              ห้องทดลองพยากรณ์ที่ถอดสัญญาณจักรวาลให้กลายเป็นแผนตัดสินใจที่ใช้ได้จริงในทุกวัน
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="#fortune-form"
                className="rounded-full border border-[rgba(247,231,206,0.55)] bg-[rgba(247,231,206,0.2)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.32)]"
              >
                Reveal My Fate
              </Link>
              <Link
                href="/the-science-behind-mu-lab"
                className={`rounded-full ${goldBorder} bg-transparent px-4 py-2 text-sm font-medium tracking-[0.03em] text-[#d8e2ff] transition hover:bg-white/[0.06]`}
              >
                Explore Our Science
              </Link>
            </div>
          </header>

          <div
            id="fortune-form"
            className={`relative col-span-12 rounded-[1.35rem] ${goldBorder} bg-[#08142f]/58 p-2 shadow-[0_26px_70px_rgba(0,0,0,0.4)] sm:rounded-3xl sm:p-3 lg:col-span-6`}
          >
            <FortuneForm />
          </div>
        </section>

        {/* SECONDARY */}
        <section className="mt-4">
          <DailyCosmicDashboard data={daily} />
        </section>

        <section className="mt-4 rounded-[1.35rem] border border-[rgba(247,231,206,0.42)] bg-[#0d1735]/82 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.35)] sm:rounded-3xl sm:p-8">
          <h2 className="font-serif text-2xl text-[#edf3ff] sm:text-3xl">Why Mu-Lab</h2>
          <p className="mt-3 max-w-3xl text-sm font-light leading-relaxed text-[#d8e2ff]/82">
            เราแปลงโหราศาสตร์ให้เป็นระบบคิดที่ใช้ตัดสินใจได้จริง ไม่ใช่แค่อ่านแล้วผ่านไป
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[rgba(247,231,206,0.4)] bg-[#0a1636] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/72">Precision</p>
              <p className="mt-2 text-sm text-[#d8e2ff]/86">อ่านพื้นข้อมูลเกิดแบบเฉพาะบุคคล</p>
            </div>
            <div className="rounded-2xl border border-[rgba(247,231,206,0.4)] bg-[#0a1636] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/72">Clarity</p>
              <p className="mt-2 text-sm text-[#d8e2ff]/86">มี Daily Dashboard ให้เช็คทุกเช้าในหน้าเดียว</p>
            </div>
            <div className="rounded-2xl border border-[rgba(247,231,206,0.4)] bg-[#0a1636] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/72">Action</p>
              <p className="mt-2 text-sm text-[#d8e2ff]/86">สรุปผลเป็นคำแนะนำที่ลงมือทำได้ทันที</p>
            </div>
          </div>
        </section>

        {/* MONEY SECTION: บริการที่แปลงเป็นรายได้ */}
        <section id="services" className="mt-4 grid grid-cols-12 gap-3 sm:gap-4 lg:gap-5">
          <div
            className={`col-span-12 rounded-[1.35rem] ${goldBorder} bg-[#0d1735]/84 p-6 shadow-[0_18px_44px_rgba(0,0,0,0.35)] sm:rounded-3xl sm:p-8`}
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--gold)]/75">
              Services & Offers
            </p>
            <h2 className="mt-3 font-serif text-2xl font-light tracking-tight text-[#edf3ff] sm:text-3xl">
              เลือกบริการดูดวงที่เหมาะกับจังหวะชีวิตคุณ
            </h2>
            <p className="mt-3 max-w-2xl text-base font-light leading-relaxed text-[#d8e2ff]/82">
              ออกแบบเป็นขั้น: เริ่มจาก Quick Reading เพื่อเห็นภาพรวม แล้วค่อยขยับเป็นโหมดลึกเพื่อการตัดสินใจเรื่องสำคัญ
            </p>

            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              <article className="rounded-2xl border border-[rgba(247,231,206,0.28)] bg-[#0a1636] p-5">
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--gold)]/72">Starter</p>
                <h3 className="mt-2 font-serif text-xl text-[#edf3ff]">Quick Reading</h3>
                <p className="mt-2 text-base font-light leading-relaxed text-[#d8e2ff]/82">
                  วิเคราะห์พื้นดวงและคำแนะนำรายวันสำหรับการตัดสินใจทันที
                </p>
                <Link
                  href="#fortune-form"
                  className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.34)] bg-transparent px-4 py-1.5 text-sm font-semibold text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.12)]"
                >
                  เริ่มใช้ฟรี
                </Link>
              </article>

              <article className="rounded-2xl border border-[rgba(247,231,206,0.45)] bg-[rgba(247,231,206,0.08)] p-5 shadow-[0_10px_25px_rgba(0,0,0,0.32)]">
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--gold)]">Most Popular</p>
                <h3 className="mt-2 font-serif text-xl text-[#edf3ff]">Deep Insight Session</h3>
                <p className="mt-2 text-base font-light leading-relaxed text-[#d8e2ff]/90">
                  เจาะลึกงาน เงิน ความรัก พร้อมแผน 30 วันแบบลงมือทำได้จริง
                </p>
                <Link
                  href="#fortune-form"
                  className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.55)] bg-[rgba(247,231,206,0.18)] px-4 py-1.5 text-sm font-semibold text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.26)]"
                >
                  ปลดล็อกโหมดลึก
                </Link>
              </article>

              <article className="rounded-2xl border border-[rgba(247,231,206,0.28)] bg-[#0a1636] p-5">
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--gold)]/72">Premium</p>
                <h3 className="mt-2 font-serif text-xl text-[#edf3ff]">VIP Guidance</h3>
                <p className="mt-2 text-base font-light leading-relaxed text-[#d8e2ff]/82">
                  วิเคราะห์เชิงกลยุทธ์รายเดือนสำหรับช่วงเปลี่ยนงาน ลงทุน หรือความสัมพันธ์
                </p>
                <Link
                  href="#fortune-form"
                  className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.34)] bg-transparent px-4 py-1.5 text-sm font-semibold text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.12)]"
                >
                  รับคำแนะนำพรีเมียม
                </Link>
              </article>
            </div>
          </div>
        </section>
      </div>

      <footer id="about" className="relative z-10 mt-4 border-t border-[rgba(247,231,206,0.16)] bg-[#060c20]/86">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <p className="font-serif text-lg text-[var(--gold)]">Mu-Lab</p>
            <p className="mt-1 text-sm text-[#d8e2ff]/75">Cosmic intelligence for practical decisions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/the-science-behind-mu-lab"
              className="rounded-full border border-[rgba(247,231,206,0.28)] px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-[#d8e2ff] transition hover:bg-white/[0.06]"
            >
              Science
            </Link>
            <Link
              href="/terms"
              className="rounded-full border border-[rgba(247,231,206,0.28)] px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-[#d8e2ff] transition hover:bg-white/[0.06]"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="rounded-full border border-[rgba(247,231,206,0.28)] px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-[#d8e2ff] transition hover:bg-white/[0.06]"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

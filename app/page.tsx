import DailyCosmicDashboard from "@/components/DailyCosmicDashboard";
import {
  Floating,
  GlintWrap,
  HoverConstellation,
  ParallaxNebula,
  Reveal,
} from "@/components/CinematicCelestial";
import FortuneForm from "@/components/FortuneForm";
import { getDailyForecast } from "@/lib/daily-forecast-data";
import Image from "next/image";
import Link from "next/link";

const glassPanel = "mu-lab-glass";

/** หน้าแรกดึงพยากรณ์รายวันแบบแคช — เนื้อหาเปลี่ยนตามวันในเขต กรุงเทพฯ */
export const revalidate = 3600;

export default async function Home() {
  const daily = await getDailyForecast();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <header className="sticky top-0 z-30 bg-[rgba(6,10,22,0.68)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <Image src="/logo-brand-v2.png" alt="Mu Lab" width={46} height={46} className="h-[46px] w-[46px] rounded-full" />
            <p className="font-serif text-2xl tracking-tight text-[var(--gold)]">Mu-Lab</p>
          </div>
          <nav className="hidden items-center gap-2 sm:flex">
            <HoverConstellation>
              <Link
                href="#fortune-form"
                className="rounded-full px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.07]"
              >
                ดูดวงทันที
              </Link>
            </HoverConstellation>
            <HoverConstellation>
              <Link
                href="#services"
                className="rounded-full px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.07]"
              >
                บริการและแพ็กเกจ
              </Link>
            </HoverConstellation>
            <HoverConstellation>
              <Link
                href="#about"
                className="rounded-full px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.07]"
              >
                เกี่ยวกับ Mu-Lab
              </Link>
            </HoverConstellation>
            <HoverConstellation>
              <Link
                href="#fortune-form"
                className="rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ead2a6_48%,#d9bb85_100%)] px-5 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#241d16] shadow-[0_0_28px_rgba(247,231,206,0.26)] transition hover:brightness-105"
              >
                <GlintWrap>เริ่มวิเคราะห์</GlintWrap>
              </Link>
            </HoverConstellation>
          </nav>
        </div>
      </header>

      {/* Deep cosmic cinematic background */}
      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(165deg,#1a1042_0%,#130a35_52%,#0d0824_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(85%_70%_at_50%_12%,rgba(98,86,188,0.2)_0%,transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(70%_50%_at_96%_0%,rgba(247,231,206,0.15)_0%,transparent_58%)]"
        aria-hidden
      />
      <ParallaxNebula />
      <div className="pointer-events-none fixed inset-0 mu-lab-starfield" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">
        {/* HERO: form-first */}
        <section className="relative z-40 overflow-visible rounded-[2rem] p-6 shadow-[0_40px_90px_rgba(0,0,0,0.5)] sm:p-8 lg:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              backgroundImage:
                "radial-gradient(circle at 28% 36%, rgba(104,118,218,0.52) 0%, rgba(58,70,150,0.2) 34%, transparent 60%), radial-gradient(circle at 70% 28%, rgba(159,92,205,0.26) 0%, transparent 40%), radial-gradient(circle at 64% 70%, rgba(247,231,206,0.14) 0%, transparent 38%), radial-gradient(circle at 52% 62%, rgba(22,36,84,0.72) 0%, rgba(6,12,30,0.84) 45%, rgba(3,7,17,0.94) 100%)",
            }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,19,0.9)_0%,rgba(5,8,19,0.72)_48%,rgba(5,8,19,0.52)_100%)]" />
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2" aria-hidden>
            <Image
              src="/logo-brand-v2.png"
              alt=""
              width={260}
              height={260}
              className="h-[260px] w-[260px] rounded-full shadow-[0_0_46px_rgba(247,231,206,0.24)]"
            />
          </div>
          <Reveal delay={0.1} className="relative">
            <Floating
              id="fortune-form"
              className="relative z-50 rounded-[1.6rem] p-2 sm:rounded-[2rem] sm:p-3"
            >
              <FortuneForm />
            </Floating>
          </Reveal>
        </section>

        {/* SECONDARY */}
        <Reveal delay={0.35} className="relative z-10 mt-4">
          <DailyCosmicDashboard data={daily} />
        </Reveal>

        <Reveal delay={0.45} className={`mt-8 rounded-[1.6rem] p-10 sm:rounded-[2rem] sm:p-12 ${glassPanel}`}>
          <h2 className="font-serif text-3xl tracking-[0.05em] text-[#eef1ff] sm:text-4xl">Why Mu-Lab</h2>
          <p className="mt-6 max-w-3xl text-base font-light leading-relaxed text-[#dbe1ff]/82">
            เราแปลงโหราศาสตร์ให้เป็นระบบคิดที่ใช้ตัดสินใจได้จริง ไม่ใช่แค่อ่านแล้วผ่านไป
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className={`rounded-2xl p-6 ${glassPanel}`}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/72">Precision</p>
              <p className="mt-3 text-base text-[#dbe1ff]/86">อ่านพื้นข้อมูลเกิดแบบเฉพาะบุคคล</p>
            </div>
            <div className={`rounded-2xl p-6 ${glassPanel}`}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/72">Clarity</p>
              <p className="mt-3 text-base text-[#dbe1ff]/86">มี Daily Dashboard ให้เช็คทุกเช้าในหน้าเดียว</p>
            </div>
            <div className={`rounded-2xl p-6 ${glassPanel}`}>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/72">Action</p>
              <p className="mt-3 text-base text-[#dbe1ff]/86">สรุปผลเป็นคำแนะนำที่ลงมือทำได้ทันที</p>
            </div>
          </div>
        </Reveal>

        {/* MONEY SECTION: บริการที่แปลงเป็นรายได้ */}
        <section id="services" className="mt-8 grid grid-cols-12 gap-6 lg:gap-8">
          <Reveal delay={0.55} className="col-span-12">
            <div
            className={`col-span-12 rounded-[1.6rem] p-10 sm:rounded-[2rem] sm:p-12 ${glassPanel}`}
            >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--gold)]/75">
              Services & Offers
            </p>
            <h2 className="mt-5 font-serif text-3xl font-light tracking-[0.05em] text-[#eef1ff] sm:text-4xl">
              เลือกบริการดูดวงที่เหมาะกับจังหวะชีวิตคุณ
            </h2>
            <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-[#dbe1ff]/82">
              ออกแบบเป็นขั้น: เริ่มจาก Quick Reading เพื่อเห็นภาพรวม แล้วค่อยขยับเป็นโหมดลึกเพื่อการตัดสินใจเรื่องสำคัญ
            </p>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              <article className={`rounded-2xl p-7 ${glassPanel}`}>
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--gold)]/72">Starter</p>
                <h3 className="mt-3 font-serif text-2xl tracking-[0.05em] text-[#eef1ff]">Quick Reading</h3>
                <p className="mt-4 text-base font-light leading-relaxed text-[#dbe1ff]/82">
                  วิเคราะห์พื้นดวงและคำแนะนำรายวันสำหรับการตัดสินใจทันที
                </p>
                <Link
                  href="#fortune-form"
                  className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.34)] bg-transparent px-4 py-1.5 text-sm font-semibold text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.12)]"
                >
                  เริ่มใช้ฟรี
                </Link>
              </article>

              <article className="rounded-2xl bg-[rgba(255,255,255,0.05)] p-7 shadow-[inset_0_1px_0_rgba(247,231,206,0.14),0_26px_52px_rgba(1,4,16,0.4)]">
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--gold)]">Most Popular</p>
                <h3 className="mt-3 font-serif text-2xl tracking-[0.05em] text-[#eef1ff]">Deep Insight Session</h3>
                <p className="mt-4 text-base font-light leading-relaxed text-[#dbe1ff]/90">
                  เจาะลึกงาน เงิน ความรัก พร้อมแผน 30 วันแบบลงมือทำได้จริง
                </p>
                <Link
                  href="#fortune-form"
                  className="mt-4 inline-flex rounded-full border border-[rgba(247,231,206,0.55)] bg-[rgba(247,231,206,0.18)] px-4 py-1.5 text-sm font-semibold text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.26)]"
                >
                  ปลดล็อกโหมดลึก
                </Link>
              </article>

              <article className={`rounded-2xl p-7 ${glassPanel}`}>
                <p className="text-xs uppercase tracking-[0.1em] text-[var(--gold)]/72">Premium</p>
                <h3 className="mt-3 font-serif text-2xl tracking-[0.05em] text-[#eef1ff]">VIP Guidance</h3>
                <p className="mt-4 text-base font-light leading-relaxed text-[#dbe1ff]/82">
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
          </Reveal>
        </section>
      </div>

      <Reveal delay={0.7}>
        <footer id="about" className="relative z-10 mt-12 bg-[rgba(3,7,17,0.5)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 sm:flex-row sm:items-center sm:px-8 lg:px-10">
          <div>
            <p className="font-serif text-lg text-[var(--gold)]">Mu-Lab</p>
            <p className="mt-1 text-sm text-[#d9f2e9]/75">Cosmic intelligence for practical decisions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/the-science-behind-mu-lab"
              className="rounded-full border border-[rgba(247,231,206,0.28)] px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-[#d9f2e9] transition hover:bg-white/[0.06]"
            >
              Science
            </Link>
            <Link
              href="/terms"
              className="rounded-full border border-[rgba(247,231,206,0.28)] px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-[#d9f2e9] transition hover:bg-white/[0.06]"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="rounded-full border border-[rgba(247,231,206,0.28)] px-3 py-1.5 text-xs uppercase tracking-[0.1em] text-[#d9f2e9] transition hover:bg-white/[0.06]"
            >
              Privacy
            </Link>
          </div>
        </div>
        </footer>
      </Reveal>
    </main>
  );
}

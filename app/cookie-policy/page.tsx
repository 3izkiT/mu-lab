import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ParallaxNebula } from "@/components/CinematicCelestial";

export const metadata: Metadata = {
  title: "Cookie Policy | Mu-Lab",
  description: "นโยบายคุกกี้ของ Mu-Lab อธิบายประเภทคุกกี้ วัตถุประสงค์ และทางเลือกในการจัดการคุกกี้",
  alternates: { canonical: "/cookie-policy" },
};

const COOKIE_SECTIONS = [
  {
    title: "1. คุกกี้คืออะไร",
    body: "คุกกี้คือไฟล์ข้อมูลขนาดเล็กที่ถูกบันทึกในอุปกรณ์ของผู้ใช้เพื่อช่วยให้ระบบจดจำการใช้งานและปรับปรุงประสบการณ์ใช้งานเว็บไซต์",
  },
  {
    title: "2. ประเภทคุกกี้ที่เราใช้",
    body: "เราอาจใช้คุกกี้ที่จำเป็นต่อการทำงานของระบบ คุกกี้เพื่อวัดผลการใช้งาน และคุกกี้เพื่อความปลอดภัย โดยใช้เท่าที่จำเป็นต่อการให้บริการ",
  },
  {
    title: "3. วัตถุประสงค์การใช้งาน",
    body: "คุกกี้ช่วยให้ผู้ใช้เข้าสู่ระบบได้ต่อเนื่อง ป้องกันการใช้งานที่ผิดปกติ และช่วยวิเคราะห์การใช้งานเพื่อปรับปรุงประสิทธิภาพของเว็บไซต์",
  },
  {
    title: "4. การจัดการคุกกี้",
    body: "ผู้ใช้สามารถจัดการคุกกี้ผ่านการตั้งค่าเบราว์เซอร์ได้ตลอดเวลา ทั้งการลบหรือบล็อกคุกกี้บางประเภท แต่อาจส่งผลให้บางฟังก์ชันใช้งานได้ไม่สมบูรณ์",
  },
  {
    title: "5. การปรับปรุงนโยบายคุกกี้",
    body: "เราอาจอัปเดตนโยบายคุกกี้ให้สอดคล้องกับบริการและกฎหมาย โดยจะแสดงฉบับล่าสุดบนหน้านี้เสมอ",
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ParallaxNebula />
      <div className="pointer-events-none fixed inset-0 z-[3] mu-lab-starfield" aria-hidden />

      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <Link href="/" className="mb-6 inline-flex items-center gap-3" aria-label="Go to Mu-Lab homepage">
          <Image
            src="/logo-brand-v2.png"
            alt="Mu Lab"
            width={40}
            height={40}
            className="mu-lab-logo-solid mu-lab-logo-living h-10 w-10 rounded-full object-cover"
          />
          <span className="font-serif text-2xl tracking-tight text-[var(--gold)]">Mu-Lab</span>
        </Link>

        <div className="mu-lab-glass rounded-[1.35rem] border border-[rgba(247,231,206,0.22)] p-7 shadow-[0_16px_42px_rgba(1,4,16,0.42)] backdrop-blur-xl sm:rounded-3xl sm:p-10">
          <p className="text-[10px] font-light uppercase tracking-[0.34em] text-[var(--gold)]/70">Mu-Lab Policy</p>
          <h1 className="mt-4 font-serif text-3xl font-light tracking-tight text-[#eef1ff] sm:text-4xl">
            Cookie Policy
          </h1>
          <p className="mt-4 text-sm font-light leading-relaxed text-[#dbe1ff]/80">
            นโยบายคุกกี้นี้อธิบายวิธีที่ Mu-Lab ใช้คุกกี้และเทคโนโลยีใกล้เคียงเพื่อให้ระบบทำงานอย่างปลอดภัยและมีประสิทธิภาพ
          </p>

          <div className="mt-8 space-y-6 text-sm font-light leading-relaxed text-[#dbe1ff]/78">
            {COOKIE_SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="font-serif text-xl text-[#eef1ff]">{section.title}</h2>
                <p className="mt-2">{section.body}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            <Link
              href="/privacy"
              className="rounded-full border border-[rgba(247,231,206,0.22)] bg-[rgba(247,231,206,0.08)] px-4 py-1.5 text-xs font-light tracking-wide text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.16)]"
            >
              View Privacy Policy
            </Link>
            <Link
              href="/data-request"
              className="rounded-full border border-[rgba(247,231,206,0.22)] bg-[rgba(247,231,206,0.08)] px-4 py-1.5 text-xs font-light tracking-wide text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.16)]"
            >
              Data Request Form
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Terms of Service | Mu-Lab",
  description:
    "ข้อกำหนดการใช้งาน Mu-Lab ครอบคลุมขอบเขตบริการและการใช้ข้อมูลเกิดเพื่อการพยากรณ์อย่างโปร่งใสและรับผิดชอบ",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | Mu-Lab",
    description:
      "ข้อกำหนดการใช้งาน Mu-Lab ครอบคลุมขอบเขตบริการและการใช้ข้อมูลเกิดเพื่อการพยากรณ์อย่างโปร่งใสและรับผิดชอบ",
    url: "/terms",
    type: "article",
  },
};

const goldBorder = "border border-[rgba(247,231,206,0.14)]";

export default function TermsPage() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mu-Lab",
    url: siteUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Mu-Lab",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Terms of Service",
        item: `${siteUrl}/terms`,
      },
    ],
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(165deg,#fbfdff_0%,#f5f8ff_36%,#eef3ff_68%,#e9eefc_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 mu-lab-starfield" aria-hidden />

      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className={`rounded-[1.35rem] ${goldBorder} bg-white/82 p-7 shadow-[0_16px_42px_rgba(26,35,126,0.08)] backdrop-blur-xl sm:rounded-3xl sm:p-10`}>
          <p className="text-[10px] font-light uppercase tracking-[0.34em] text-zinc-500">Mu-Lab Policy</p>
          <h1 className="mt-4 font-serif text-3xl font-light tracking-tight text-[#1a237e] sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm font-light leading-relaxed text-[#1a237e]/80">
            เงื่อนไขการใช้งานนี้กำหนดกรอบการให้บริการของ Mu-Lab เพื่อให้ประสบการณ์การวิเคราะห์ส่วนบุคคลมีความปลอดภัย โปร่งใส และเหมาะสมกับการใช้งานเชิงพยากรณ์ร่วมสมัย
          </p>

          <div className="mt-8 space-y-6 text-sm font-light leading-relaxed text-[#1a237e]/78">
            <section>
              <h2 className="font-serif text-xl text-[#1a237e]">1. Nature of Service</h2>
              <p className="mt-2">
                Mu-Lab ให้บริการวิเคราะห์แนวโน้มชีวิตและพลังงานประจ าวันในรูปแบบข้อมูลเชิงตีความ ผู้ใช้ยอมรับว่าผลลัพธ์เป็นแนวทางประกอบการตัดสินใจ ไม่ใช่คำรับรองผลลัพธ์ที่แน่นอน
              </p>
            </section>
            <section>
              <h2 className="font-serif text-xl text-[#1a237e]">2. Data Processing Scope</h2>
              <p className="mt-2">
                ข้อมูลวันเดือนปีเกิด เวลาเกิด และจังหวัดเกิดที่ผู้ใช้กรอก จะถูกประมวลผลผ่าน Mu-Lab Algorithm (Gemini) เพื่อสร้างคำพยากรณ์เฉพาะบุคคลเท่านั้น
              </p>
            </section>
            <section>
              <h2 className="font-serif text-xl text-[#1a237e]">3. Storage Limitation</h2>
              <p className="mt-2">
                ระบบปัจจุบันไม่ได้เก็บข้อมูลส่วนบุคคลดังกล่าวไว้ในฐานข้อมูลถาวรเพื่อการทำโปรไฟล์ผู้ใช้ระยะยาว โดยการประมวลผลมุ่งเน้นที่ผลลัพธ์คำพยากรณ์ในบริบทของคำขอแต่ละครั้ง
              </p>
            </section>
            <section>
              <h2 className="font-serif text-xl text-[#1a237e]">4. Responsible Use</h2>
              <p className="mt-2">
                ผู้ใช้ตกลงใช้งานบริการอย่างสุจริต ไม่ส่งข้อมูลเท็จหรือใช้ระบบในลักษณะที่ละเมิดสิทธิผู้อื่น และเคารพข้อกำหนดทางกฎหมายที่เกี่ยวข้อง
              </p>
            </section>
            <section>
              <h2 className="font-serif text-xl text-[#1a237e]">5. Updates to Terms</h2>
              <p className="mt-2">
                Mu-Lab อาจปรับปรุงข้อกำหนดนี้ตามการพัฒนาบริการ โดยจะเผยแพร่เวอร์ชันล่าสุดบนหน้านี้เสมอ
              </p>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            <Link
              href="/privacy"
              className={`rounded-full ${goldBorder} bg-white px-4 py-1.5 text-xs font-light tracking-wide text-[#1a237e]/80 transition hover:bg-[#fffaf2]`}
            >
              View Privacy Policy
            </Link>
            <Link
              href="/"
              className={`rounded-full ${goldBorder} bg-white px-4 py-1.5 text-xs font-light tracking-wide text-[#1a237e]/80 transition hover:bg-[#fffaf2]`}
            >
              Back to Mu-Lab
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

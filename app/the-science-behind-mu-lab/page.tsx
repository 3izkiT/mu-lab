import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "The Science Behind Mu-Lab | Algorithm & Astrology",
  description:
    "เจาะลึกหลักการทำงานของ Mu-Lab ที่ผสานการวิเคราะห์เชิงอัลกอริทึมกับกรอบโหราศาสตร์ร่วมสมัยเพื่อสร้างคำพยากรณ์ที่ใช้งานได้จริง",
  alternates: {
    canonical: "/the-science-behind-mu-lab",
  },
  openGraph: {
    title: "The Science Behind Mu-Lab | Algorithm & Astrology",
    description:
      "เจาะลึกหลักการทำงานของ Mu-Lab ที่ผสานการวิเคราะห์เชิงอัลกอริทึมกับกรอบโหราศาสตร์ร่วมสมัยเพื่อสร้างคำพยากรณ์ที่ใช้งานได้จริง",
    url: "/the-science-behind-mu-lab",
    type: "article",
  },
};

const goldBorder = "border border-[rgba(247,231,206,0.14)]";

const faqs = [
  {
    q: "Mu-Lab คำนวณคำพยากรณ์อย่างไร?",
    a: "ระบบใช้ข้อมูลวันเวลาและจังหวัดเกิดเพื่อวางตำแหน่งดวงเชิงเวลา จากนั้นตีความเป็นแพทเทิร์นพลังงานด้วยตรรกะโหราศาสตร์ร่วมสมัยและโมเดลภาษาเชิงกำเนิด",
  },
  {
    q: "เกี่ยวข้องกับดาราศาสตร์จริงหรือไม่?",
    a: "Mu-Lab อ้างอิงแนวคิดการเคลื่อนที่ของวัตถุท้องฟ้าเชิงเวลา แล้วแปลงเป็นกรอบการอ่านเชิงสัญลักษณ์ เพื่อสร้างคำแนะนำที่อ่านง่ายและนำไปใช้ได้ทันที",
  },
  {
    q: "ทำไมต้องมี Daily Cosmic Dashboard?",
    a: "แดชบอร์ดรายวันช่วยให้ผู้ใช้เห็นภาพพลังงานรวมของวันเดียวกันแบบรวดเร็ว ก่อนลงรายละเอียดการอ่านดวงเฉพาะบุคคล",
  },
  {
    q: "ความแม่นยำมาจากอะไร?",
    a: "ความแม่นยำขึ้นกับคุณภาพข้อมูลเกิด ความสอดคล้องของบริบทชีวิต และการใช้ผลวิเคราะห์เป็นกรอบคิดเชิงกลยุทธ์ ไม่ใช่คำทำนายเด็ดขาด",
  },
];

export default function SciencePage() {
  const faqEntities = faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  }));

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mu-Lab",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/the-science-behind-mu-lab`,
      "query-input": "required name=search_term_string",
    },
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
        name: "The Science Behind Mu-Lab",
        item: `${siteUrl}/the-science-behind-mu-lab`,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqEntities,
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(165deg,#fbfdff_0%,#f5f8ff_36%,#eef3ff_68%,#e9eefc_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 mu-lab-starfield" aria-hidden />

      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className={`rounded-[1.35rem] ${goldBorder} bg-white/82 p-7 shadow-[0_16px_42px_rgba(26,35,126,0.08)] backdrop-blur-xl sm:rounded-3xl sm:p-10`}>
          <p className="text-[10px] font-light uppercase tracking-[0.34em] text-zinc-500">Mu-Lab Knowledge</p>
          <h1 className="mt-4 font-serif text-3xl font-light tracking-tight text-[#1a237e] sm:text-4xl">
            The Science Behind Mu-Lab
          </h1>
          <p className="mt-4 max-w-3xl text-sm font-light leading-relaxed text-[#1a237e]/80">
            หน้านี้อธิบายแนวคิดการทำงานของ Mu-Lab ในมุมวิทยาศาสตร์ผสมโหราศาสตร์: การอ่านองศาดาวเชิงเวลา การแปลงสัญญาณเป็นพลังงานรายมิติ และการสังเคราะห์ผลด้วยตรรกะเชิงภาษาให้เข้าใจง่าย
          </p>

          <div className="mt-8 grid gap-4">
            {faqs.map((item) => (
              <article
                key={item.q}
                className={`rounded-2xl ${goldBorder} bg-white p-5 shadow-[0_8px_20px_rgba(26,35,126,0.06)]`}
              >
                <h2 className="font-serif text-xl text-[#1a237e]">{item.q}</h2>
                <p className="mt-2 text-sm font-light leading-relaxed text-[#1a237e]/80">{item.a}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
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

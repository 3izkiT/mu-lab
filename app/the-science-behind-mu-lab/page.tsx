import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Science Behind Mu-Lab",
  description: "คำอธิบายเชิงวิทยาศาสตร์-โหราศาสตร์ของกระบวนการวิเคราะห์ Mu-Lab",
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
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(165deg,#0a1628_0%,#121528_28%,#1a1032_58%,#0d0818_88%,#050308_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 mu-lab-starfield" aria-hidden />

      <section className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className={`rounded-[1.35rem] ${goldBorder} bg-white/[0.04] p-7 backdrop-blur-2xl sm:rounded-3xl sm:p-10`}>
          <p className="text-[10px] font-light uppercase tracking-[0.34em] text-zinc-500">Mu-Lab Knowledge</p>
          <h1 className="mt-4 font-serif text-3xl font-light tracking-tight text-zinc-100 sm:text-4xl">
            The Science Behind Mu-Lab
          </h1>
          <p className="mt-4 max-w-3xl text-sm font-light leading-relaxed text-zinc-400">
            หน้านี้อธิบายแนวคิดการทำงานของ Mu-Lab ในมุมวิทยาศาสตร์ผสมโหราศาสตร์: การอ่านองศาดาวเชิงเวลา การแปลงสัญญาณเป็นพลังงานรายมิติ และการสังเคราะห์ผลด้วยตรรกะเชิงภาษาให้เข้าใจง่าย
          </p>

          <div className="mt-8 grid gap-4">
            {faqs.map((item) => (
              <article
                key={item.q}
                className={`rounded-2xl ${goldBorder} bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(247,231,206,0.03)]`}
              >
                <h2 className="font-serif text-xl text-zinc-100">{item.q}</h2>
                <p className="mt-2 text-sm font-light leading-relaxed text-zinc-300">{item.a}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
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
            <Link
              href="/"
              className={`rounded-full ${goldBorder} bg-white/[0.04] px-4 py-1.5 text-xs font-light tracking-wide text-zinc-400 transition hover:bg-white/[0.06]`}
            >
              Back to Mu-Lab
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

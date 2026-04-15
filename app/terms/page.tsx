import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "ข้อกำหนดการใช้งาน Mu-Lab สำหรับการวิเคราะห์พลังงานและดวงชะตา",
};

const goldBorder = "border border-[rgba(247,231,206,0.14)]";

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(165deg,#0a1628_0%,#121528_28%,#1a1032_58%,#0d0818_88%,#050308_100%)]"
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 mu-lab-starfield" aria-hidden />

      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className={`rounded-[1.35rem] ${goldBorder} bg-white/[0.04] p-7 backdrop-blur-2xl sm:rounded-3xl sm:p-10`}>
          <p className="text-[10px] font-light uppercase tracking-[0.34em] text-zinc-500">Mu-Lab Policy</p>
          <h1 className="mt-4 font-serif text-3xl font-light tracking-tight text-zinc-100 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm font-light leading-relaxed text-zinc-400">
            เงื่อนไขการใช้งานนี้กำหนดกรอบการให้บริการของ Mu-Lab เพื่อให้ประสบการณ์การวิเคราะห์ส่วนบุคคลมีความปลอดภัย โปร่งใส และเหมาะสมกับการใช้งานเชิงพยากรณ์ร่วมสมัย
          </p>

          <div className="mt-8 space-y-6 text-sm font-light leading-relaxed text-zinc-300">
            <section>
              <h2 className="font-serif text-xl text-zinc-100">1. Nature of Service</h2>
              <p className="mt-2">
                Mu-Lab ให้บริการวิเคราะห์แนวโน้มชีวิตและพลังงานประจ าวันในรูปแบบข้อมูลเชิงตีความ ผู้ใช้ยอมรับว่าผลลัพธ์เป็นแนวทางประกอบการตัดสินใจ ไม่ใช่คำรับรองผลลัพธ์ที่แน่นอน
              </p>
            </section>
            <section>
              <h2 className="font-serif text-xl text-zinc-100">2. Data Processing Scope</h2>
              <p className="mt-2">
                ข้อมูลวันเดือนปีเกิด เวลาเกิด และจังหวัดเกิดที่ผู้ใช้กรอก จะถูกประมวลผลผ่าน Mu-Lab Algorithm (Gemini) เพื่อสร้างคำพยากรณ์เฉพาะบุคคลเท่านั้น
              </p>
            </section>
            <section>
              <h2 className="font-serif text-xl text-zinc-100">3. Storage Limitation</h2>
              <p className="mt-2">
                ระบบปัจจุบันไม่ได้เก็บข้อมูลส่วนบุคคลดังกล่าวไว้ในฐานข้อมูลถาวรเพื่อการทำโปรไฟล์ผู้ใช้ระยะยาว โดยการประมวลผลมุ่งเน้นที่ผลลัพธ์คำพยากรณ์ในบริบทของคำขอแต่ละครั้ง
              </p>
            </section>
            <section>
              <h2 className="font-serif text-xl text-zinc-100">4. Responsible Use</h2>
              <p className="mt-2">
                ผู้ใช้ตกลงใช้งานบริการอย่างสุจริต ไม่ส่งข้อมูลเท็จหรือใช้ระบบในลักษณะที่ละเมิดสิทธิผู้อื่น และเคารพข้อกำหนดทางกฎหมายที่เกี่ยวข้อง
              </p>
            </section>
            <section>
              <h2 className="font-serif text-xl text-zinc-100">5. Updates to Terms</h2>
              <p className="mt-2">
                Mu-Lab อาจปรับปรุงข้อกำหนดนี้ตามการพัฒนาบริการ โดยจะเผยแพร่เวอร์ชันล่าสุดบนหน้านี้เสมอ
              </p>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            <Link
              href="/privacy"
              className={`rounded-full ${goldBorder} bg-white/[0.04] px-4 py-1.5 text-xs font-light tracking-wide text-zinc-400 transition hover:bg-white/[0.06]`}
            >
              View Privacy Policy
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

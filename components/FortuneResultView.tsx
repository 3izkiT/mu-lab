"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import PaywallOverlay from "@/components/ui/PaywallOverlay";
import { BirthSignDisplay } from "@/components/BirthSignDisplay";
import { ThaiZodiacWheel } from "@/components/ThaiZodiacWheel";

type FortuneResultViewProps = {
  analysisId: string;
  summary: string;
  deepInsight: string;
  career: number;
  wealth: number;
  love: number;
  hasAccess: boolean;
  /** ลัคนาที่คำนวณจากวันเวลาจังหวัด (ถ้ามี) */
  ascendantSignName: string;
  ascendantIndex: number;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function FortuneResultView({
  analysisId,
  summary,
  deepInsight,
  career,
  wealth,
  love,
  hasAccess,
  ascendantSignName,
  ascendantIndex,
}: FortuneResultViewProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-[rgba(247,231,206,0.14)] bg-[linear-gradient(165deg,rgba(12,22,48,0.92)_0%,rgba(4,8,20,0.96)_48%,rgba(2,4,12,1)_100%)] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.55)] sm:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(247,231,206,0.12)_0%,transparent_68%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(99,118,228,0.18)_0%,transparent_70%)] blur-2xl"
      />

      <motion.header
        initial="hidden"
        animate="show"
        custom={0}
        variants={fadeUp}
        className="relative text-center"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]/80">Your Fortune</p>
        <h1 className="mt-3 font-serif text-3xl text-[#eef1ff] sm:text-4xl">คำทำนายของคุณ</h1>
        <p className="mt-2 text-sm text-[#dbe1ff]/72">ลัคนาและมิเตอร์จากข้อมูลที่คุณให้ — อ่านภาพรวมก่อน แล้วค่อยเจาะ Deep Insight</p>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="show"
        custom={1}
        variants={fadeUp}
        className="relative mx-auto mt-10 grid max-w-3xl gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,260px)] sm:items-center"
      >
        <div className="order-2 text-center sm:order-1 sm:text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--gold)]/70">ลัคนา · สุริยยาตร์ไทย</p>
          <p className="mt-2 font-serif text-3xl text-[#f7e7ce] sm:text-4xl">{ascendantSignName}</p>
          <p className="mt-2 text-xs leading-relaxed text-[#dbe1ff]/68">
            วงจักรแสดงตำแหน่งลัคนาในระบบ 12 ราศี (เมษ = ช่องแรกตามเข็ม) — ตำแหน่งดาวเต็มจะต่อยอดใน Deep Insight เมื่อปลดล็อก
          </p>
        </div>
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="order-1 flex justify-center sm:order-2"
        >
          <motion.div
            animate={{ rotate: [0, 1.2, -1.2, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="w-[min(100%,280px)]"
          >
            <ThaiZodiacWheel ascendantIndex={ascendantIndex} />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.section
        initial="hidden"
        animate="show"
        custom={3}
        variants={fadeUp}
        className="relative mt-10 rounded-2xl border border-[rgba(247,231,206,0.12)] bg-[rgba(247,231,206,0.05)] p-6 sm:p-8"
      >
        <h2 className="font-serif text-xl font-semibold text-[#eef1ff] sm:text-2xl">ภาพรวมดวงของคุณ</h2>
        <p className="mt-4 text-sm leading-relaxed text-[#e8eeff]/88">{summary}</p>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="show"
        custom={4}
        variants={fadeUp}
        className="relative mt-8 grid grid-cols-3 gap-3 sm:gap-4"
      >
        {[
          { label: "Career", value: career },
          { label: "Wealth", value: wealth },
          { label: "Love", value: love },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="rounded-xl border border-[rgba(247,231,206,0.14)] bg-[rgba(7,16,36,0.55)] p-4 text-center backdrop-blur-sm sm:p-6"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--gold)]/80">{m.label}</p>
            <motion.p
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.08, type: "spring", stiffness: 220 }}
              className="mt-3 font-serif text-3xl text-[#eef1ff] sm:text-4xl"
            >
              {m.value}
            </motion.p>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        initial="hidden"
        animate="show"
        custom={5}
        variants={fadeUp}
        className="relative mt-8"
      >
        <article
          className={`rounded-2xl border border-[rgba(247,231,206,0.12)] bg-[rgba(7,16,36,0.45)] p-6 sm:p-8 ${!hasAccess ? "overflow-hidden" : ""}`}
        >
          <h2 className="font-serif text-2xl font-semibold text-[#eef1ff] sm:text-3xl">ความเห็นที่ลึกซึ้ง</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#dbe1ff]/84 sm:text-base">
            {hasAccess
              ? deepInsight
              : "เนื้อหานี้เป็นส่วนพิเศษสำหรับสมาชิกที่ปลดล็อกเท่านั้น ล็อกอินและปลดล็อกเพื่ออ่านเพิ่ม"}
          </p>
        </article>
        {!hasAccess ? <PaywallOverlay analysisId={analysisId} /> : null}
      </motion.section>

      {ascendantSignName ? (
        <motion.div initial="hidden" animate="show" custom={6} variants={fadeUp} className="mt-8">
          <BirthSignDisplay signName={ascendantSignName} />
        </motion.div>
      ) : null}

      <motion.div
        initial="hidden"
        animate="show"
        custom={7}
        variants={fadeUp}
        className="relative mt-8 flex flex-wrap justify-center gap-3 sm:justify-start"
      >
        <Link
          href="/"
          className="rounded-full border border-[rgba(247,231,206,0.4)] px-6 py-2.5 text-sm font-medium text-[var(--gold)] transition hover:bg-[rgba(247,231,206,0.1)]"
        >
          ทำนายอีกครั้ง
        </Link>
        <Link
          href="/vault"
          className="rounded-full border border-[rgba(247,231,206,0.24)] px-6 py-2.5 text-sm font-medium text-[#e8eeff]/88 transition hover:bg-[rgba(247,231,206,0.06)]"
        >
          ไปยัง Personal Vault
        </Link>
      </motion.div>
    </div>
  );
}

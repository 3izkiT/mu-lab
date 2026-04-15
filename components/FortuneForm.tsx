"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { Link2 } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import LuckMeters from "@/components/LuckMeters";
import ProvinceCommand from "@/components/ProvinceCommand";
import { defaultLuckMeters, type LuckMetersData } from "@/lib/fortune-parse";

type FormData = {
  fullName: string;
  gender: string;
  birthDate: string;
  birthHour: string;
  birthMinute: string;
  birthProvince: string;
};

type SectionKey = "character" | "luck" | "action" | "fallback";

type ParsedSection = {
  key: SectionKey;
  title: string;
  content: string;
};

const initialData: FormData = {
  fullName: "",
  gender: "",
  birthDate: "",
  birthHour: "",
  birthMinute: "",
  birthProvince: "",
};

function inferSectionKey(title: string): SectionKey {
  const t = title.toLowerCase();
  if (title.includes("ลักษณะ") || title.includes("นิสัย")) return "character";
  if (title.includes("ดวงชะตา") || title.includes("โชค") || t.includes("luck")) return "luck";
  if (title.includes("แผน")) return "action";
  return "fallback";
}

function parseFortuneMarkdown(markdown: string): ParsedSection[] {
  const text = markdown.trim();
  const headingRegex = /^##\s+(.+)$/gm;
  const matches = [...text.matchAll(headingRegex)];

  if (!matches.length) {
    return [{ key: "fallback", title: "คำทำนาย", content: text }];
  }

  const sections: ParsedSection[] = [];

  for (let i = 0; i < matches.length; i += 1) {
    const title = matches[i][1].trim();
    const start = (matches[i].index ?? 0) + matches[i][0].length;
    const end =
      i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;
    const content = text.slice(start, end).trim();
    sections.push({
      key: inferSectionKey(title),
      title,
      content,
    });
  }

  return sections;
}

const sectionIndexLabel = (key: SectionKey, index: number) => {
  const n = String(index + 1).padStart(2, "0");
  if (key === "character") return `${n} · นิสัย`;
  if (key === "luck") return `${n} · ชะตากรรม`;
  if (key === "action") return `${n} · แผน`;
  return `${n}`;
};

const ILLUSION_DURATION_MS = 3000;
const ILLUSION_STATUS_LINES = [
  "Aligning Natal Coordinates...",
  "Synthesizing Quantum Fate...",
];
const ILLUSION_PATHS = [
  "M -20 50 L 120 50",
  "M 14 86 L 86 14",
  "M 16 14 L 84 86",
];

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 text-[14px] font-light leading-[1.8] tracking-wide text-zinc-300 last:mb-0 sm:text-base sm:leading-8">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-3 list-disc space-y-2 pl-4 text-[14px] font-light text-zinc-300 sm:text-base">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-2 pl-4 text-[14px] font-light text-zinc-300 sm:text-base">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="marker:text-[var(--gold)]/70">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold text-zinc-100">{children}</strong>
  ),
};

export default function FortuneForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [illusionProgress, setIllusionProgress] = useState(0);
  const [fortuneResult, setFortuneResult] = useState<string | null>(null);
  const [luckMeters, setLuckMeters] = useState<LuckMetersData | null>(null);
  const [resultSessionId, setResultSessionId] = useState("");
  const [copyDone, setCopyDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialData);

  const parsedSections = useMemo(
    () => (fortuneResult ? parseFortuneMarkdown(fortuneResult) : []),
    [fortuneResult],
  );

  const isStepOneValid = formData.fullName.trim() !== "" && formData.gender !== "";
  const isStepTwoValid = formData.birthDate !== "";
  const isStepThreeValid =
    formData.birthHour !== "" &&
    formData.birthMinute !== "" &&
    formData.birthProvince.trim() !== "";

  const isFormValid = isStepOneValid && isStepTwoValid && isStepThreeValid;
  const currentIllusionStatus =
    ILLUSION_STATUS_LINES[
      Math.min(
        ILLUSION_STATUS_LINES.length - 1,
        Math.floor(illusionProgress * ILLUSION_STATUS_LINES.length),
      )
    ];

  const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const startedAt = Date.now();
    setIsLoading(true);
    setShowTransition(true);
    setIllusionProgress(0);
    setErrorMessage(null);
    setFortuneResult(null);
    setLuckMeters(null);

    try {
      const response = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json()) as {
        message?: string;
        meters?: LuckMetersData;
      };
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, ILLUSION_DURATION_MS - elapsed);
      if (remaining > 0) await sleep(remaining);

      if (!response.ok) {
        setErrorMessage(
          payload?.message ?? "สภาวะดวงดาวไม่เอื้ออำนวย กรุณาลองใหม่อีกครั้ง",
        );
        track("fortune_api_error", { status: String(response.status) });
        return;
      }

      const message = payload?.message;
      if (typeof message === "string" && message.trim()) {
        setFortuneResult(message.trim());
        setLuckMeters(
          payload.meters &&
            typeof payload.meters.career === "number" &&
            typeof payload.meters.wealth === "number" &&
            typeof payload.meters.love === "number"
            ? payload.meters
            : defaultLuckMeters(),
        );
        setResultSessionId(
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
        );
        setCopyDone(false);
        track("fortune_result_ok");
      } else {
        setErrorMessage("สภาวะดวงดาวไม่เอื้ออำนวย กรุณาลองใหม่อีกครั้ง");
        track("fortune_result_empty");
      }
    } catch {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, ILLUSION_DURATION_MS - elapsed);
      if (remaining > 0) await sleep(remaining);
      setErrorMessage("สภาวะดวงดาวไม่เอื้ออำนวย กรุณาลองใหม่อีกครั้ง");
      track("fortune_result_error");
    } finally {
      setShowTransition(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!showTransition) return;

    const start = Date.now();
    const timer = window.setInterval(() => {
      const ratio = Math.min(1, (Date.now() - start) / ILLUSION_DURATION_MS);
      setIllusionProgress(ratio);
      if (ratio >= 1) window.clearInterval(timer);
    }, 45);

    return () => window.clearInterval(timer);
  }, [showTransition]);

  if (showTransition) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: illusionProgress > 0.92 ? 1 - (illusionProgress - 0.92) / 0.08 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[120] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(76,92,192,0.3)_0%,rgba(8,14,35,0.94)_64%,#030711_100%)]"
          role="status"
          aria-live="polite"
        >
          <div className="pointer-events-none absolute inset-0 mu-lab-starfield" />
          <div className="pointer-events-none absolute inset-0 mu-lab-blueprint" />

          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="h-[62vmin] w-[62vmin] max-h-[540px] max-w-[540px]"
              aria-hidden
            >
              {ILLUSION_PATHS.map((path, index) => (
                <motion.path
                  key={path}
                  d={path}
                  fill="none"
                  stroke="#F7E7CE"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  animate={{ pathLength: [0, 1, 1], opacity: [0.22, 0.85, 0.25] }}
                  transition={{
                    duration: 1.45,
                    delay: index * 0.12,
                    repeat: Infinity,
                    repeatDelay: 0.06,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </svg>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <motion.div
              className="relative flex h-32 w-32 items-center justify-center rounded-full"
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 22px rgba(247,231,206,0.2)",
                  "0 0 56px rgba(247,231,206,0.42)",
                  "0 0 94px rgba(247,231,206,0.62)",
                ],
              }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(247,231,206,0.58)_0%,rgba(247,231,206,0.12)_52%,transparent_100%)]"
                animate={{ opacity: [0.42, 0.95, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <Image
                src="/logo-loader.png"
                alt="Mu Lab loader"
                width={96}
                height={96}
                className="relative z-10 h-24 w-24 rounded-full object-cover"
                priority
              />
            </motion.div>

            <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--gold)]/76">
              Quantum Calculation
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIllusionStatus}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.22 }}
                className="mt-3 font-serif text-[11px] tracking-[0.08em] text-[#f7e7ce]/92"
              >
                {currentIllusionStatus}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const handleReset = () => {
    setFormData(initialData);
    setFortuneResult(null);
    setLuckMeters(null);
    setResultSessionId("");
    setCopyDone(false);
    setErrorMessage(null);
    setIsLoading(false);
  };

  const handleCopyLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopyDone(true);
      window.setTimeout(() => setCopyDone(false), 2200);
    } catch {
      setCopyDone(false);
    }
  };

  if (fortuneResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[1.35rem] border border-[rgba(247,231,206,0.14)] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-[1px] shadow-[0_40px_120px_rgba(0,0,0,0.55)] sm:rounded-3xl"
      >
        <div className="rounded-[1.3rem] bg-[#060a12]/80 px-5 py-8 backdrop-blur-2xl sm:rounded-[1.9rem] sm:px-10 sm:py-11">
          <div className="mx-auto mb-8 flex flex-col items-center text-center">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[var(--gold)]/50 to-transparent" />
            <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.4em] text-zinc-600">
              Mu-Lab Analysis
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
              คำทำนายของคุณ
            </h2>
            <p className="mt-2 max-w-md text-xs font-light leading-relaxed text-zinc-500">
              แกะกล่องทีละชั้น — อ่านช้า ๆ ได้ตามจังหวะของคุณ
            </p>
          </div>

          {luckMeters ? (
            <LuckMeters meters={luckMeters} animateKey={resultSessionId || "session"} />
          ) : null}

          <div className="flex flex-col gap-4 sm:gap-5">
            {parsedSections.map((section, index) => (
              <motion.article
                key={`${section.title}-${index}`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.06 + index * 0.11,
                  duration: 0.48,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl border border-[rgba(247,231,206,0.12)] bg-white/[0.03] px-5 py-5 shadow-[inset_0_1px_0_rgba(247,231,206,0.05)] sm:rounded-3xl sm:px-7 sm:py-6"
              >
                <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-white/[0.05] pb-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--gold)]/75">
                      {sectionIndexLabel(section.key, index)}
                    </p>
                    <h3 className="mt-1.5 font-serif text-lg font-semibold tracking-tight text-white sm:text-xl">
                      {section.title}
                    </h3>
                  </div>
                  <span className="select-none text-lg font-extralight text-zinc-700" aria-hidden>
                    ✦
                  </span>
                </div>
                <div className="max-w-none">
                  <ReactMarkdown components={markdownComponents}>{section.content}</ReactMarkdown>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-full border border-white/[0.1] bg-white/[0.04] px-8 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 transition hover:border-[var(--gold)]/25 hover:text-zinc-200 sm:w-auto"
            >
              เริ่มใหม่อีกครั้ง
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(247,231,206,0.2)] bg-[rgba(247,231,206,0.06)] px-6 py-2.5 text-xs font-light tracking-wide text-[var(--gold)] transition hover:border-[rgba(247,231,206,0.35)] hover:bg-[rgba(247,231,206,0.1)] sm:w-auto"
            >
              <Link2 className="h-3.5 w-3.5 opacity-90" aria-hidden />
              {copyDone ? "คัดลอกลิงก์แล้ว" : "คัดลอกลิงก์แชร์ให้เพื่อน"}
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mu-lab-glass relative overflow-visible rounded-[1.6rem] sm:rounded-[2rem]">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 rounded-[inherit] bg-[#05080f]/84 px-6 py-14 text-center backdrop-blur-xl"
          role="status"
          aria-live="polite"
        >
          <div className="relative flex h-32 w-32 items-center justify-center">
            <span className="absolute -inset-2 rounded-full bg-[radial-gradient(circle,rgba(247,231,206,0.12),transparent_72%)]" />
            <span className="absolute inset-0 rounded-full border border-[var(--gold)]/18 mu-lab-scan-pulse" />
            <span
              className="absolute inset-0 rounded-full border border-[var(--gold)]/14 mu-lab-scan-ring"
              style={{ animationDelay: "0.45s" }}
            />
            <span className="absolute inset-4 rounded-full border border-white/[0.08] shadow-[0_0_30px_rgba(82,192,152,0.24)]" />
            <span className="absolute inset-[26px] rounded-full border border-[rgba(247,231,206,0.15)]" />
            <span className="relative text-[10px] font-light uppercase tracking-[0.48em] text-zinc-500">Mu-Lab</span>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-zinc-600">
              Aligning Frequencies
            </p>
            <p className="max-w-xs text-sm font-light leading-relaxed text-zinc-200 sm:text-base">
              Mu-Lab กำลังถอดรหัสชีวิตของคุณด้วยลำแสงเชิงดาราศาสตร์...
            </p>
            <p className="text-[11px] font-light text-zinc-500">Please hold this cosmic moment.</p>
          </div>
        </motion.div>
      )}

      <div className={`p-10 sm:p-12 ${isLoading ? "pointer-events-none select-none opacity-[0.22]" : ""}`}>
        <div className="mb-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--gold)]/78">Session</p>
            <h2 className="mt-4 font-serif text-3xl font-medium tracking-[0.05em] text-[#eef1ff] sm:text-4xl">
              ข้อมูลดวง
            </h2>
            <p className="mt-4 text-base font-light text-[#dbe1ff]/78">กรอกข้อมูลครั้งเดียวให้ครบ แล้วรับผลวิเคราะห์ทันที</p>
          </div>
        </div>

        <div className="space-y-10">
          <section className="mu-lab-glass rounded-2xl p-7 sm:p-8">
            <p className="mb-7 text-xs font-medium uppercase tracking-[0.16em] text-[var(--gold)]/75">ข้อมูลพื้นฐาน</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-[#d9f2e9]/74">
                  ชื่อ-นามสกุล
                </span>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                  placeholder="เช่น อรทัย ใจดี"
                  className="mu-lab-input w-full px-4 py-4 text-base placeholder:text-[#dbe1ff]/45"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-[#d9f2e9]/74">
                  เพศ
                </span>
                <select
                  value={formData.gender}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, gender: event.target.value }))
                  }
                  className="mu-lab-input w-full cursor-pointer appearance-none px-4 py-4 text-base"
                >
                  <option value="" className="bg-[#0a101c] text-zinc-400">
                    เลือกเพศ
                  </option>
                  <option value="female" className="bg-[#0a101c]">
                    หญิง
                  </option>
                  <option value="male" className="bg-[#0a101c]">
                    ชาย
                  </option>
                  <option value="non-binary" className="bg-[#0a101c]">
                    ไม่ระบุ / อื่น ๆ
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-[#d9f2e9]/74">
                  วันเกิด
                </span>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, birthDate: event.target.value }))
                  }
                  className="mu-lab-input w-full px-4 py-4 text-base scheme-dark"
                />
              </label>
            </div>
          </section>

          <section className="mu-lab-glass rounded-2xl p-7 sm:p-8">
            <p className="mb-7 text-xs font-medium uppercase tracking-[0.16em] text-[var(--gold)]/75">ข้อมูลเวลาและสถานที่เกิด</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-[#d9f2e9]/74">
                  เวลาเกิด (ชั่วโมง · นาที)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={formData.birthHour}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, birthHour: event.target.value }))
                    }
                    placeholder="0–23"
                    className="mu-lab-input w-full px-4 py-4 text-base placeholder:text-[#dbe1ff]/45"
                  />
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={formData.birthMinute}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, birthMinute: event.target.value }))
                    }
                    placeholder="0–59"
                    className="mu-lab-input w-full px-4 py-4 text-base placeholder:text-[#dbe1ff]/45"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="mb-2 block text-xs font-medium uppercase tracking-[0.08em] text-[#d9f2e9]/74">
                  จังหวัดที่เกิด
                </span>
                <ProvinceCommand
                  value={formData.birthProvince}
                  onChange={(province) =>
                    setFormData((prev) => ({ ...prev, birthProvince: province }))
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
          </section>
        </div>

        {errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-[13px] font-light text-red-300/95"
          >
            {errorMessage}
          </motion.p>
        )}

        <div className="mt-12 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            className="mu-lab-btn-shimmer relative inline-flex min-h-[52px] min-w-[min(100%,290px)] items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(125deg,#f7e7ce_0%,#ebd3a8_48%,#d6b379_100%)] px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#201911] shadow-[0_0_34px_rgba(247,231,206,0.26)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-35 sm:min-w-0"
          >
            <span className="relative z-10">Reveal My Fate</span>
          </button>
        </div>
      </div>
    </div>
  );
}

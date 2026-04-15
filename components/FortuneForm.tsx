"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@vercel/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Link2 } from "lucide-react";
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

const TOTAL_STEPS = 3;

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

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 text-[13px] font-light leading-[1.75] tracking-wide text-zinc-400 last:mb-0 sm:text-sm sm:leading-7">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-4 text-[13px] font-light text-zinc-400 sm:text-sm">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-4 text-[13px] font-light text-zinc-400 sm:text-sm">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="marker:text-[var(--gold)]/70">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold text-zinc-100">{children}</strong>
  ),
};

export default function FortuneForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fortuneResult, setFortuneResult] = useState<string | null>(null);
  const [luckMeters, setLuckMeters] = useState<LuckMetersData | null>(null);
  const [resultSessionId, setResultSessionId] = useState("");
  const [copyDone, setCopyDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialData);

  useEffect(() => {
    track("fortune_form_step", { step: String(step) });
  }, [step]);

  const progressValue = useMemo(() => (step / TOTAL_STEPS) * 100, [step]);
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

  const canContinue =
    (step === 1 && isStepOneValid) ||
    (step === 2 && isStepTwoValid) ||
    (step === 3 && isStepThreeValid);

  const handleNext = () => {
    if (!canContinue || step >= TOTAL_STEPS) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step <= 1) return;
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!isStepThreeValid) return;

    setIsLoading(true);
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
      setErrorMessage("สภาวะดวงดาวไม่เอื้ออำนวย กรุณาลองใหม่อีกครั้ง");
      track("fortune_result_error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
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
    <div className="relative overflow-hidden rounded-[1.35rem] border border-[rgba(247,231,206,0.14)] bg-white/[0.035] shadow-[0_0_0_1px_rgba(247,231,206,0.05)_inset,0_32px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl sm:rounded-3xl">
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
            <span className="absolute inset-4 rounded-full border border-white/[0.08] shadow-[0_0_30px_rgba(83,133,220,0.24)]" />
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

      <div className={`p-6 sm:p-8 ${isLoading ? "pointer-events-none select-none opacity-[0.22]" : ""}`}>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-600">Session</p>
            <h2 className="mt-2 font-serif text-xl font-light tracking-tight text-white sm:text-2xl">
              ข้อมูลดวง
            </h2>
          </div>
          <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            {step}/{TOTAL_STEPS}
          </span>
        </div>

        <div className="mb-8 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--gold)]/90 via-[var(--gold)]/40 to-zinc-600/30"
            initial={false}
            animate={{ width: `${progressValue}%` }}
            transition={{ type: "spring", stiffness: 140, damping: 24 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            {step === 1 && (
              <>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600">
                    ชื่อ-นามสกุล
                  </span>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, fullName: event.target.value }))
                    }
                    placeholder="เช่น อรทัย ใจดี"
                    className="mu-lab-input w-full rounded-2xl px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600">
                    เพศ
                  </span>
                  <select
                    value={formData.gender}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, gender: event.target.value }))
                    }
                    className="mu-lab-input w-full cursor-pointer appearance-none rounded-2xl bg-[rgba(255,255,255,0.035)] px-4 py-3.5 text-sm text-zinc-100"
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
              </>
            )}

            {step === 2 && (
              <label className="block">
                <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600">
                  วันเกิด
                </span>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, birthDate: event.target.value }))
                  }
                  className="mu-lab-input w-full rounded-2xl px-4 py-3.5 text-sm text-zinc-100 scheme-dark"
                />
                <p className="mt-2 text-[11px] font-light leading-relaxed text-zinc-600">
                  วันเกิดช่วยให้ Mu-Lab วิเคราะห์ภาพรวมและจังหวะชีวิตได้ละเอียดขึ้น
                </p>
              </label>
            )}

            {step === 3 && (
              <>
                <div>
                  <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600">
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
                      className="mu-lab-input w-full rounded-2xl px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600"
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
                      className="mu-lab-input w-full rounded-2xl px-4 py-3.5 text-sm text-zinc-100 placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div>
                  <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-600">
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
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-[13px] font-light text-red-300/95"
          >
            {errorMessage}
          </motion.p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || isLoading}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-transparent px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-zinc-500 transition hover:border-white/[0.14] hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
            ย้อนกลับ
          </button>

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canContinue || isLoading}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.06] px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-zinc-200 transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ถัดไป
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canContinue || isLoading}
              className="mu-lab-btn-shimmer relative inline-flex min-h-[44px] min-w-[min(100%,200px)] items-center justify-center overflow-hidden rounded-full border border-[rgba(247,231,206,0.35)] bg-gradient-to-b from-[rgba(247,231,206,0.18)] to-[rgba(247,231,206,0.04)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1a1428] shadow-[0_0_48px_rgba(247,231,206,0.15)] transition hover:border-[rgba(247,231,206,0.5)] disabled:cursor-not-allowed disabled:opacity-35 sm:min-w-0"
            >
              <span className="relative z-10">Reveal My Fate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

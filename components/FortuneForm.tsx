"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  MapPinned,
  Sparkles,
  VenusAndMars,
} from "lucide-react";

type FormData = {
  fullName: string;
  gender: string;
  birthDate: string;
  birthHour: string;
  birthMinute: string;
  birthProvince: string;
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

export default function FortuneForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [formData, setFormData] = useState<FormData>(initialData);

  const progressValue = useMemo(() => (step / TOTAL_STEPS) * 100, [step]);

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

    setIsSubmitting(true);
    setResultMessage("");

    try {
      const response = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const payload = await response.json();

      if (!response.ok) {
        setResultMessage(payload?.message ?? "เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะ");
        return;
      }

      setResultMessage(payload?.message ?? "รับข้อมูลแล้ว เดี๋ยวสรุปดวงให้ในขั้นตอนถัดไป");
    } catch {
      setResultMessage("ตอนนี้ยังเชื่อมต่อไม่ได้ ลองอีกครั้งในอีกสักครู่นะ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/50 bg-white/45 p-5 shadow-[0_16px_55px_rgba(15,31,61,0.18)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0f1f3d] sm:text-xl">เริ่มดูดวงส่วนตัว</h2>
        <span className="rounded-full bg-[#0f1f3d]/85 px-3 py-1 text-xs font-medium text-white">
          ขั้นตอน {step}/{TOTAL_STEPS}
        </span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#b8985f] to-[#0f1f3d] transition-all duration-300"
          style={{ width: `${progressValue}%` }}
        />
      </div>

      <div className="space-y-4">
        {step === 1 && (
          <>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <CircleUserRound className="h-4 w-4 text-[#8b6a2e]" />
                ชื่อ-นามสกุล
              </span>
              <input
                type="text"
                value={formData.fullName}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, fullName: event.target.value }))
                }
                placeholder="เช่น อรทัย ใจดี"
                className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none ring-[#b8985f]/40 transition focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <VenusAndMars className="h-4 w-4 text-[#8b6a2e]" />
                เพศ
              </span>
              <select
                value={formData.gender}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, gender: event.target.value }))
                }
                className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none ring-[#b8985f]/40 transition focus:ring-2"
              >
                <option value="">เลือกเพศ</option>
                <option value="female">หญิง</option>
                <option value="male">ชาย</option>
                <option value="non-binary">ไม่ระบุ/อื่น ๆ</option>
              </select>
            </label>
          </>
        )}

        {step === 2 && (
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <CalendarDays className="h-4 w-4 text-[#8b6a2e]" />
              วันเกิด
            </span>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, birthDate: event.target.value }))
              }
              className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none ring-[#b8985f]/40 transition focus:ring-2"
            />
            <p className="mt-2 text-xs text-slate-600">
              วันเกิดช่วยให้ AI วิเคราะห์ภาพรวมเรื่องนิสัย โอกาส และจังหวะชีวิตได้แม่นขึ้น
            </p>
          </label>
        )}

        {step === 3 && (
          <>
            <div>
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Clock3 className="h-4 w-4 text-[#8b6a2e]" />
                เวลาเกิด (ชั่วโมง/นาที)
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
                  placeholder="ชั่วโมง (0-23)"
                  className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none ring-[#b8985f]/40 transition focus:ring-2"
                />
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={formData.birthMinute}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, birthMinute: event.target.value }))
                  }
                  placeholder="นาที (0-59)"
                  className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none ring-[#b8985f]/40 transition focus:ring-2"
                />
              </div>
            </div>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <MapPinned className="h-4 w-4 text-[#8b6a2e]" />
                จังหวัดที่เกิด
              </span>
              <input
                type="text"
                value={formData.birthProvince}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, birthProvince: event.target.value }))
                }
                placeholder="เช่น กรุงเทพมหานคร"
                className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none ring-[#b8985f]/40 transition focus:ring-2"
              />
            </label>
          </>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className="inline-flex items-center gap-2 rounded-full border border-[#0f1f3d]/25 bg-white/70 px-4 py-2 text-sm text-[#0f1f3d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          ย้อนกลับ
        </button>

        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 rounded-full bg-[#0f1f3d] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#192f59] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ถัดไป
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canContinue || isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#b8985f] to-[#0f1f3d] px-5 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" />
            {isSubmitting ? "กำลังประมวลผล..." : "เริ่มวิเคราะห์ดวง"}
          </button>
        )}
      </div>

      {resultMessage && (
        <p className="mt-4 rounded-2xl border border-white/70 bg-white/65 px-4 py-3 text-sm text-slate-700">
          {resultMessage}
        </p>
      )}
    </div>
  );
}

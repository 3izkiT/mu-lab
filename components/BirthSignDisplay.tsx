"use client";

import { ZodiacAnimalSprite } from "@/components/ZodiacAnimalSprite";

/** ลำดับเดียวกับเครื่องคำนวณลัคนา (เมษ = ช่อง 0 … มีน = 11) */
const THAI_BIRTH_SIGNS = [
  { name: "เมษ", color: "#E0AAFF" },
  { name: "พฤษภ", color: "#D946EF" },
  { name: "เมถุน", color: "#C239B3" },
  { name: "กรกฎ", color: "#A0106F" },
  { name: "สิงห์", color: "#810E71" },
  { name: "กันย์", color: "#6A0DAD" },
  { name: "ตุลย์", color: "#5A189A" },
  { name: "พิจิก", color: "#480355" },
  { name: "ธนู", color: "#3C096C" },
  { name: "มังกร", color: "#9D4EDD" },
  { name: "กุมภ์", color: "#7209B7" },
  { name: "มีน", color: "#560BAD" },
] as const;

type BirthSignDisplayProps = {
  signName: string;
};

export function BirthSignDisplay({ signName }: BirthSignDisplayProps) {
  const sign = THAI_BIRTH_SIGNS.find((s) => s.name === signName);
  if (!sign) return null;

  return (
    <section className="rounded-3xl border border-[rgba(247,231,206,0.22)] bg-[rgba(5,10,24,0.35)] p-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--gold)]/80">ลักขณาของคุณ</p>
        <h2 className="mt-4 font-serif text-4xl text-[#eef1ff]">{sign.name}</h2>
        <div className="mt-6 flex justify-center">
          <div
            className="rounded-full p-1 shadow-[0_24px_60px_rgba(0,0,0,0.45)] ring-2 ring-[rgba(247,231,206,0.25)]"
            style={{
              boxShadow: `0 20px 50px rgba(0,0,0,0.5), inset 0 0 40px ${sign.color}22`,
            }}
          >
            <ZodiacAnimalSprite signName={sign.name} size={120} rounded="full" blendScreen />
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-4 gap-3 sm:gap-4">
        {THAI_BIRTH_SIGNS.map((s) => (
          <div
            key={s.name}
            className={`rounded-2xl border p-3 text-center transition sm:p-4 ${
              s.name === sign.name
                ? "border-[rgba(247,231,206,0.4)] bg-[rgba(247,231,206,0.08)] shadow-[inset_0_0_24px_rgba(247,231,206,0.06)]"
                : "border-white/10 bg-[rgba(5,10,24,0.55)] opacity-92"
            }`}
          >
            <div className="mx-auto flex w-11 justify-center sm:w-14">
              <ZodiacAnimalSprite
                signName={s.name}
                fill
                className={`h-11 w-11 sm:h-14 sm:w-14 ${s.name === sign.name ? "ring-1 ring-[rgba(247,231,206,0.35)]" : "opacity-[0.92]"}`}
                rounded="lg"
              />
            </div>
            <p
              className={`mt-2 text-[11px] font-light leading-tight sm:text-xs ${
                s.name === sign.name ? "text-[#eef1ff]" : "text-[#dbe1ff]/70"
              }`}
            >
              {s.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
